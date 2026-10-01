import { Router } from "express";
import { createStudent,deleteStudent,getStudent,listStudents,updateStudent } from "../controllers/student.controller.js";
import { adminOnly,protect } from "../middleware/auth.js";
const router=Router();router.use(protect);
router.get("/",listStudents);router.get("/:id",getStudent);router.post("/",adminOnly,createStudent);router.put("/:id",adminOnly,updateStudent);router.delete("/:id",adminOnly,deleteStudent);
export default router;
