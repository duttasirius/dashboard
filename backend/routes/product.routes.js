import { Router } from "express";
import { createProduct,deleteProduct,getProduct,listProducts,updateProduct } from "../controllers/product.controller.js";
import { adminOnly,managerOrAdmin,protect } from "../middleware/auth.js";
const router=Router();router.use(protect);
router.get("/",listProducts);router.get("/:id",getProduct);router.post("/",managerOrAdmin,createProduct);router.put("/:id",managerOrAdmin,updateProduct);router.delete("/:id",adminOnly,deleteProduct);
export default router;
