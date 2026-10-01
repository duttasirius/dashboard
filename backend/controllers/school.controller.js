import School from "../models/School.js";
import Student from "../models/Student.js";
import { escapeRegex } from "../utils/escape.js";

export async function listSchools(req,res){
  const {search="",status,page=1,limit=10}=req.query; const filter={};
  if(search){const regex=new RegExp(escapeRegex(search),"i");filter.$or=[{name:regex},{code:regex},{principal:regex}];}
  if(status)filter.status=status;
  const pageNum=Math.max(Number(page),1),limitNum=Math.min(Math.max(Number(limit),1),100);
  const [schools,total]=await Promise.all([School.find(filter).sort({createdAt:-1}).skip((pageNum-1)*limitNum).limit(limitNum),School.countDocuments(filter)]);
  res.json({schools,pagination:{page:pageNum,limit:limitNum,total,pages:Math.max(Math.ceil(total/limitNum),1)}});
}
export async function getSchool(req,res){const school=await School.findById(req.params.id);if(!school)return res.status(404).json({message:"School not found."});res.json({school});}
export async function createSchool(req,res){const school=await School.create(req.body);res.status(201).json({school});}
export async function updateSchool(req,res){const school=await School.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});if(!school)return res.status(404).json({message:"School not found."});res.json({school});}
export async function deleteSchool(req,res){const inUse=await Student.exists({school:req.params.id});if(inUse)return res.status(409).json({message:"This school is linked to students and cannot be deleted."});const school=await School.findByIdAndDelete(req.params.id);if(!school)return res.status(404).json({message:"School not found."});res.json({message:"School deleted."});}
