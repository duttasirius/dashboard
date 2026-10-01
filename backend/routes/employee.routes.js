import { Router } from "express";
import { createEmployee,deleteEmployee,getEmployee,listEmployees,updateEmployee } from "../controllers/employee.controller.js";
import { protect } from "../middleware/auth.js";
const router=Router();router.use(protect);
router.get("/",listEmployees);router.get("/:id",getEmployee);router.post("/",createEmployee);router.put("/:id",updateEmployee);router.delete("/:id",deleteEmployee);
export default router;
