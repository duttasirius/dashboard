import mongoose from "mongoose";
const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
  sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
  category: { type: String, required: true, trim: true, maxlength: 80 },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 0, default: 0 },
  supplier: { type: String, trim: true, maxlength: 100 },
  lowStockThreshold: { type: Number, min: 0, default: 5 },
  imageUrl: { type: String, default: "" },
  imagePublicId: { type: String, default: "" }
}, { timestamps: true });
export default mongoose.model("Product", schema);
