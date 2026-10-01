import { Router } from "express";
import { createOrder,employeePayments,listPayments,verifyPayment } from "../controllers/payment.controller.js";
import { protect } from "../middleware/auth.js";
const router=Router();router.use(protect);
router.post("/create-order",createOrder);router.post("/verify",verifyPayment);router.get("/",listPayments);router.get("/employee/:employeeId",employeePayments);
export default router;
