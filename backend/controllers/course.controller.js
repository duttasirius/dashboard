import Course from "../models/Course.js";
import Student from "../models/Student.js";
import { escapeRegex } from "../utils/escape.js";

export async function listCourses(req,res){
  const {search="",active,page=1,limit=10}=req.query;const filter={};
  if(search){const regex=new RegExp(escapeRegex(search),"i");filter.$or=[{title:regex},{code:regex}];}
  if(active!==undefined&&active!=="")filter.active=active==="true";
  const pageNum=Math.max(Number(page),1),limitNum=Math.min(Math.max(Number(limit),1),100);
  const [courses,total]=await Promise.all([Course.find(filter).sort({createdAt:-1}).skip((pageNum-1)*limitNum).limit(limitNum),Course.countDocuments(filter)]);
  res.json({courses,pagination:{page:pageNum,limit:limitNum,total,pages:Math.max(Math.ceil(total/limitNum),1)}});
}
export async function getCourse(req,res){const course=await Course.findById(req.params.id);if(!course)return res.status(404).json({message:"Course not found."});res.json({course});}
export async function createCourse(req,res){const course=await Course.create(req.body);res.status(201).json({course});}
export async function updateCourse(req,res){const course=await Course.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});if(!course)return res.status(404).json({message:"Course not found."});res.json({course});}
export async function deleteCourse(req,res){const inUse=await Student.exists({course:req.params.id});if(inUse)return res.status(409).json({message:"This course is linked to students and cannot be deleted. Set Active to off instead."});const course=await Course.findByIdAndDelete(req.params.id);if(!course)return res.status(404).json({message:"Course not found."});res.json({message:"Course deleted."});}
