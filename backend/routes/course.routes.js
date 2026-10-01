import { Router } from "express";
import { createCourse,deleteCourse,getCourse,listCourses,updateCourse } from "../controllers/course.controller.js";
import { adminOnly,protect } from "../middleware/auth.js";
const router=Router();router.use(protect);
router.get("/",listCourses);router.get("/:id",getCourse);router.post("/",adminOnly,createCourse);router.put("/:id",adminOnly,updateCourse);router.delete("/:id",adminOnly,deleteCourse);
export default router;
