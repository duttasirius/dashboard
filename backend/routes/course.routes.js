import { Router } from "express";
import { createCourse,deleteCourse,getCourse,listCourses,updateCourse } from "../controllers/course.controller.js";
import { protect } from "../middleware/auth.js";
const router=Router();router.use(protect);
router.get("/",listCourses);router.get("/:id",getCourse);router.post("/",createCourse);router.put("/:id",updateCourse);router.delete("/:id",deleteCourse);
export default router;
