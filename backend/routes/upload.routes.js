import { Router } from "express";
import { uploadImage } from "../controllers/upload.controller.js";
import { adminOnly,protect } from "../middleware/auth.js";
import { imageUpload } from "../middleware/upload.js";
const router=Router();
router.post("/image",protect,adminOnly,imageUpload.single("image"),uploadImage);
export default router;
