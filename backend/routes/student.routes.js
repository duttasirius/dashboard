import { Router } from "express";
import { createStudent,deleteStudent,getStudent,listStudents,updateStudent } from "../controllers/student.controller.js";
import { protect } from "../middleware/auth.js";
const router=Router();router.use(protect);
router.get("/",listStudents);router.get("/:id",getStudent);router.post("/",createStudent);router.put("/:id",updateStudent);router.delete("/:id",deleteStudent);
export default router;
