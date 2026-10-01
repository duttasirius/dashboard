import { Router } from "express";
import { createOrder,employeePayments,listPayments,verifyPayment } from "../controllers/payment.controller.js";
import { adminOnly,protect } from "../middleware/auth.js";
const router=Router();router.use(protect);
router.post("/create-order",adminOnly,createOrder);router.post("/verify",adminOnly,verifyPayment);router.get("/",listPayments);router.get("/employee/:employeeId",employeePayments);
export default router;
