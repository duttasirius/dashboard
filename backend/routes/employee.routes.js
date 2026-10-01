import { Router } from "express";
import { createEmployee,deleteEmployee,getEmployee,listEmployees,updateEmployee } from "../controllers/employee.controller.js";
import { adminOnly,managerOrAdmin,protect } from "../middleware/auth.js";
const router=Router();router.use(protect);
router.get("/",listEmployees);router.get("/:id",getEmployee);router.post("/",managerOrAdmin,createEmployee);router.put("/:id",managerOrAdmin,updateEmployee);router.delete("/:id",adminOnly,deleteEmployee);
export default router;
