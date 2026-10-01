import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import Employee from "./models/Employee.js";
import School from "./models/School.js";
import Course from "./models/Course.js";
import Student from "./models/Student.js";
import Payment from "./models/Payment.js";

await connectDB();

await Promise.all([
  Employee.deleteMany({}),
  School.deleteMany({}),
  Course.deleteMany({}),
  Student.deleteMany({}),
  Payment.deleteMany({})
]);

const schools=await School.insertMany([
  {name:"St. Xavier Learning School",code:"SXL01",address:"Kolkata, West Bengal",phone:"03340001001",email:"office@sxl.example",principal:"Ananya Mukherjee",status:"active"},
  {name:"Tech Valley Academy",code:"TVA01",address:"Salt Lake, Kolkata",phone:"03340001002",email:"hello@tva.example",principal:"Rohan Sen",status:"active"},
  {name:"Greenfield Institute",code:"GFI01",address:"Howrah, West Bengal",phone:"03340001003",email:"admin@gfi.example",principal:"Mita Roy",status:"active"},
  {name:"North Point Academy",code:"NPA01",address:"New Town, Kolkata",phone:"03340001004",email:"contact@npa.example",principal:"Sourav Roy",status:"active"},
  {name:"Future Minds School",code:"FMS01",address:"Dumdum, Kolkata",phone:"03340001005",email:"hello@fms.example",principal:"Rhea Sen",status:"inactive"}
]);

const courses=await Course.insertMany([
  {title:"Full Stack Web Development",code:"FSWD01",duration:"6 Months",fee:45000,capacity:40,description:"React, Node.js, Express, MongoDB and deployment.",active:true},
  {title:"Data Analytics",code:"DA01",duration:"4 Months",fee:30000,capacity:35,description:"SQL, dashboards, Excel and data analysis.",active:true},
  {title:"UI/UX Design",code:"UIUX01",duration:"3 Months",fee:24000,capacity:30,description:"Design systems, Figma and product design fundamentals.",active:true},
  {title:"Python Programming",code:"PY01",duration:"4 Months",fee:28000,capacity:35,description:"Python fundamentals, automation and scripting.",active:true},
  {title:"Digital Marketing",code:"DM01",duration:"3 Months",fee:22000,capacity:30,description:"SEO, social media, analytics and campaign basics.",active:true},
  {title:"Cloud & DevOps",code:"CD01",duration:"5 Months",fee:38000,capacity:25,description:"Docker, CI/CD, cloud deployment and monitoring.",active:true}
]);

const students=await Student.insertMany([
  {name:"Aditi Das",email:"aditi@example.com",phone:"9000000001",school:schools[0]._id,course:courses[0]._id,totalFee:45000,enrollmentStatus:"active"},
  {name:"Ritwik Sen",email:"ritwik@example.com",phone:"9000000002",school:schools[1]._id,course:courses[1]._id,totalFee:30000,enrollmentStatus:"active"},
  {name:"Moumita Ghosh",email:"moumita@example.com",phone:"9000000003",school:schools[2]._id,course:courses[2]._id,totalFee:24000,enrollmentStatus:"completed"},
  {name:"Ishaan Roy",email:"ishaan@example.com",phone:"9000000004",school:schools[0]._id,course:courses[0]._id,totalFee:45000,enrollmentStatus:"active"},
  {name:"Sneha Paul",email:"sneha@example.com",phone:"9000000005",school:schools[3]._id,course:courses[3]._id,totalFee:28000,enrollmentStatus:"active"},
  {name:"Arko Banerjee",email:"arko@example.com",phone:"9000000006",school:schools[1]._id,course:courses[4]._id,totalFee:22000,enrollmentStatus:"active"},
  {name:"Tania Bose",email:"tania@example.com",phone:"9000000007",school:schools[4]._id,course:courses[5]._id,totalFee:38000,enrollmentStatus:"paused"},
  {name:"Debjit Das",email:"debjit@example.com",phone:"9000000008",school:schools[2]._id,course:courses[1]._id,totalFee:30000,enrollmentStatus:"active"}
]);

const employees=await Employee.insertMany([
  {name:"Rahul Sen",employeeId:"EMP001",email:"rahul.emp@example.com",phone:"9876543210",department:"Development",position:"Frontend Developer",salary:45000,status:"active"},
  {name:"Priya Sharma",employeeId:"EMP002",email:"priya.emp@example.com",phone:"9876543211",department:"HR",position:"HR Executive",salary:38000,status:"active"},
  {name:"Arjun Das",employeeId:"EMP003",email:"arjun.emp@example.com",phone:"9876543212",department:"Sales",position:"Sales Executive",salary:32000,status:"active"},
  {name:"Neha Gupta",employeeId:"EMP004",email:"neha.emp@example.com",phone:"9876543213",department:"Marketing",position:"Marketing Specialist",salary:40000,status:"active"},
  {name:"Vikram Singh",employeeId:"EMP005",email:"vikram.emp@example.com",phone:"9876543214",department:"Operations",position:"Operations Executive",salary:35000,status:"inactive"},
  {name:"Karan Mehta",employeeId:"EMP006",email:"karan.emp@example.com",phone:"9876543215",department:"Finance",position:"Accountant",salary:42000,status:"active"},
  {name:"Pooja Roy",employeeId:"EMP007",email:"pooja.emp@example.com",phone:"9876543216",department:"Support",position:"Support Executive",salary:30000,status:"active"},
  {name:"Sourav Dey",employeeId:"EMP008",email:"sourav.emp@example.com",phone:"9876543217",department:"Development",position:"Backend Developer",salary:50000,status:"active"}
]);

const month=new Date().toISOString().slice(0,7);
await Payment.insertMany([
  {employee:employees[0]._id,month,amount:45000,currency:"INR",orderId:"demo_order_emp001",status:"created",notes:"Demo payment record"},
  {employee:employees[1]._id,month,amount:38000,currency:"INR",orderId:"demo_order_emp002",status:"created",notes:"Demo payment record"},
  {employee:employees[2]._id,month,amount:32000,currency:"INR",orderId:"demo_order_emp003",status:"created",notes:"Demo payment record"}
]);

console.log("ERP demo data inserted: 5 schools, 6 courses, 8 students, 8 employees and 3 demo payment records.");
await mongoose.disconnect();
