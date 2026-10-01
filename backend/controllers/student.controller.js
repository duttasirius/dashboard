import Student from "../models/Student.js";
import { escapeRegex } from "../utils/escape.js";

export async function listStudents(req,res){
  const {search="",school,course,status,page=1,limit=10}=req.query;const filter={};
  if(search){const regex=new RegExp(escapeRegex(search),"i");filter.$or=[{name:regex},{email:regex},{studentId:regex}];}
  if(school)filter.school=school;if(course)filter.course=course;if(status)filter.enrollmentStatus=status;
  const pageNum=Math.max(Number(page),1),limitNum=Math.min(Math.max(Number(limit),1),100);
  const [students,total]=await Promise.all([
    Student.find(filter).populate("school","name code").populate("course","title code").sort({createdAt:-1}).skip((pageNum-1)*limitNum).limit(limitNum),
    Student.countDocuments(filter)
  ]);
  res.json({students,pagination:{page:pageNum,limit:limitNum,total,pages:Math.max(Math.ceil(total/limitNum),1)}});
}
export async function getStudent(req,res){const student=await Student.findById(req.params.id).populate("school","name code").populate("course","title code");if(!student)return res.status(404).json({message:"Student not found."});res.json({student});}
export async function createStudent(req,res){const student=await Student.create(req.body);const populated=await Student.findById(student._id).populate("school","name code").populate("course","title code");res.status(201).json({student:populated});}
export async function updateStudent(req,res){const student=await Student.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true}).populate("school","name code").populate("course","title code");if(!student)return res.status(404).json({message:"Student not found."});res.json({student});}
export async function deleteStudent(req,res){const student=await Student.findByIdAndDelete(req.params.id);if(!student)return res.status(404).json({message:"Student not found."});res.json({message:"Student deleted."});}
