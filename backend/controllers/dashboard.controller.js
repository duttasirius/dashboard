import Employee from "../models/Employee.js";
import Product from "../models/Product.js";
import School from "../models/School.js";
import Course from "../models/Course.js";
import Student from "../models/Student.js";
import Payment from "../models/Payment.js";

export async function dashboard(req,res){
  const now=new Date();
  const payrollMonth=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
  const [
    totalEmployees,activeEmployees,totalProducts,totalSchools,activeSchools,totalCourses,activeCourses,totalStudents,activeStudents,lowStockProducts,
    inventoryAgg,latestEmployees,latestProducts,latestStudents,recentPayments,paidPayrollAgg,activePayrollAgg
  ]=await Promise.all([
    Employee.countDocuments(),Employee.countDocuments({status:"active"}),Product.countDocuments(),School.countDocuments(),School.countDocuments({status:"active"}),
    Course.countDocuments(),Course.countDocuments({active:true}),Student.countDocuments(),Student.countDocuments({enrollmentStatus:"active"}),
    Product.countDocuments({$expr:{$lte:["$quantity","$lowStockThreshold"]}}),
    Product.aggregate([{$group:{_id:null,totalInventoryValue:{$sum:{$multiply:["$price","$quantity"]}},totalUnits:{$sum:"$quantity"}}}]),
    Employee.find().sort({createdAt:-1}).limit(5).select("name employeeId department position salary status avatarUrl"),
    Product.find().sort({createdAt:-1}).limit(5).select("name sku category price quantity lowStockThreshold imageUrl"),
    Student.find().sort({createdAt:-1}).limit(5).populate("school","name").populate("course","title").select("name studentId enrollmentStatus school course"),
    Payment.find().sort({createdAt:-1}).limit(5).populate("employee","name employeeId"),
    Payment.aggregate([{$match:{status:"paid",month:payrollMonth}},{$group:{_id:null,paidPayroll:{$sum:"$amount"}}}]),
    Employee.aggregate([{$match:{status:"active"}},{$group:{_id:null,monthlyPayroll:{$sum:"$salary"}}}])
  ]);

  const inv=inventoryAgg[0]||{totalInventoryValue:0,totalUnits:0};
  const paid=paidPayrollAgg[0]?.paidPayroll||0;
  const monthly=activePayrollAgg[0]?.monthlyPayroll||0;

  res.json({
    stats:{
      payrollMonth,
      totalEmployees,activeEmployees,totalProducts,totalSchools,activeSchools,totalCourses,activeCourses,totalStudents,activeStudents,lowStockProducts,
      totalInventoryValue:inv.totalInventoryValue,totalUnits:inv.totalUnits,monthlyPayroll:monthly,paidPayroll:paid,pendingPayroll:Math.max(monthly-paid,0)
    },
    latestEmployees,latestProducts,latestStudents,recentPayments
  });
}
