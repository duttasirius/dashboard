import Employee from "../models/Employee.js";
import School from "../models/School.js";
import Course from "../models/Course.js";
import Student from "../models/Student.js";
import Payment from "../models/Payment.js";

export async function dashboard(req,res){
  const now=new Date();
  const payrollMonth=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;

  const [
    totalEmployees,activeEmployees,totalSchools,activeSchools,totalCourses,activeCourses,totalStudents,activeStudents,
    recentEmployees,latestStudents,recentPayments,paidPayrollAgg,activePayrollAgg,paymentCount
  ]=await Promise.all([
    Employee.countDocuments(),
    Employee.countDocuments({status:"active"}),
    School.countDocuments(),
    School.countDocuments({status:"active"}),
    Course.countDocuments(),
    Course.countDocuments({active:true}),
    Student.countDocuments(),
    Student.countDocuments({enrollmentStatus:"active"}),
    Employee.find().sort({createdAt:-1}).limit(5).select("name employeeId department position salary status avatarUrl"),
    Student.find().sort({createdAt:-1}).limit(5).populate("school","name").populate("course","title").select("name studentId enrollmentStatus school course"),
    Payment.find().sort({createdAt:-1}).limit(5).populate("employee","name employeeId"),
    Payment.aggregate([{$match:{status:"paid",month:payrollMonth}},{$group:{_id:null,paidPayroll:{$sum:"$amount"}}}]),
    Employee.aggregate([{$match:{status:"active"}},{$group:{_id:null,monthlyPayroll:{$sum:"$salary"}}}]),
    Payment.countDocuments()
  ]);

  const paid=paidPayrollAgg[0]?.paidPayroll||0;
  const monthly=activePayrollAgg[0]?.monthlyPayroll||0;

  res.json({
    stats:{
      payrollMonth,
      totalEmployees,activeEmployees,totalSchools,activeSchools,totalCourses,activeCourses,totalStudents,activeStudents,
      monthlyPayroll:monthly,
      paidPayroll:paid,
      pendingPayroll:Math.max(monthly-paid,0),
      paymentCount
    },
    latestEmployees:recentEmployees,
    latestStudents,
    recentPayments
  });
}
