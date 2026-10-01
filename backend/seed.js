import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import Employee from "./models/Employee.js";
import School from "./models/School.js";
import Course from "./models/Course.js";
import Student from "./models/Student.js";

await connectDB();
await Promise.all([
  Employee.deleteMany({}),
  School.deleteMany({}),
  Course.deleteMany({}),
  Student.deleteMany({})
]);

const schools=await School.insertMany([
  {name:"St. Xavier Learning School",code:"SXL01",address:"Kolkata, West Bengal",phone:"03340001001",email:"office@sxl.example",principal:"Ananya Mukherjee",status:"active"},
  {name:"Tech Valley Academy",code:"TVA01",address:"Salt Lake, Kolkata",phone:"03340001002",email:"hello@tva.example",principal:"Rohan Sen",status:"active"},
  {name:"Greenfield Institute",code:"GFI01",address:"Howrah, West Bengal",phone:"03340001003",email:"admin@gfi.example",principal:"Mita Roy",status:"active"}
]);
const courses=await Course.insertMany([
  {title:"Full Stack Web Development",code:"FSWD01",duration:"6 Months",fee:45000,capacity:40,description:"React, Node.js, Express, MongoDB and deployment.",active:true},
  {title:"Data Analytics",code:"DA01",duration:"4 Months",fee:30000,capacity:35,description:"SQL, dashboards, Excel and data analysis.",active:true},
  {title:"UI/UX Design",code:"UIUX01",duration:"3 Months",fee:24000,capacity:30,description:"Design systems, Figma and product design fundamentals.",active:true}
]);
await Student.insertMany([
  {name:"Aditi Das",email:"aditi@example.com",phone:"9000000001",school:schools[0]._id,course:courses[0]._id,totalFee:45000,enrollmentStatus:"active"},
  {name:"Ritwik Sen",email:"ritwik@example.com",phone:"9000000002",school:schools[1]._id,course:courses[1]._id,totalFee:30000,enrollmentStatus:"active"},
  {name:"Moumita Ghosh",email:"moumita@example.com",phone:"9000000003",school:schools[2]._id,course:courses[2]._id,totalFee:24000,enrollmentStatus:"completed"},
  {name:"Ishaan Roy",email:"ishaan@example.com",phone:"9000000004",school:schools[0]._id,course:courses[0]._id,totalFee:45000,enrollmentStatus:"active"}
]);
await Employee.insertMany([
  {name:"Rahul Sen",employeeId:"EMP001",email:"rahul.emp@example.com",phone:"9876543210",department:"Development",position:"Frontend Developer",salary:45000,status:"active"},
  {name:"Priya Sharma",employeeId:"EMP002",email:"priya.emp@example.com",phone:"9876543211",department:"HR",position:"HR Executive",salary:38000,status:"active"},
  {name:"Arjun Das",employeeId:"EMP003",email:"arjun.emp@example.com",phone:"9876543212",department:"Sales",position:"Sales Executive",salary:32000,status:"active"},
  {name:"Neha Gupta",employeeId:"EMP004",email:"neha.emp@example.com",phone:"9876543213",department:"Marketing",position:"Marketing Specialist",salary:40000,status:"active"},
  {name:"Vikram Singh",employeeId:"EMP005",email:"vikram.emp@example.com",phone:"9876543214",department:"Operations",position:"Operations Executive",salary:35000,status:"inactive"}
]);

console.log("ERP demo data inserted.");
await mongoose.disconnect();
