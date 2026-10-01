import { Router } from "express";
import { createSchool,deleteSchool,getSchool,listSchools,updateSchool } from "../controllers/school.controller.js";
import { protect } from "../middleware/auth.js";
const router=Router();router.use(protect);
router.get("/",listSchools);router.get("/:id",getSchool);router.post("/",createSchool);router.put("/:id",updateSchool);router.delete("/:id",deleteSchool);
export default router;
