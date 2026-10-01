import { Router } from "express";
import { uploadImage } from "../controllers/upload.controller.js";
import { protect } from "../middleware/auth.js";
import { imageUpload } from "../middleware/upload.js";
const router=Router();
router.post("/image",protect,imageUpload.single("image"),uploadImage);
export default router;
