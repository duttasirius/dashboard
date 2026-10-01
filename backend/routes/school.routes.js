import { Router } from "express";
import { createSchool,deleteSchool,getSchool,listSchools,updateSchool } from "../controllers/school.controller.js";
import { adminOnly,protect } from "../middleware/auth.js";
const router=Router();router.use(protect);
router.get("/",listSchools);router.get("/:id",getSchool);router.post("/",adminOnly,createSchool);router.put("/:id",adminOnly,updateSchool);router.delete("/:id",adminOnly,deleteSchool);
export default router;
