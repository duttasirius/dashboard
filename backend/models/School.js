import mongoose from "mongoose";
const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 140 },
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  address: { type: String, required: true, trim: true, maxlength: 300 },
  phone: { type: String, trim: true, maxlength: 30 },
  email: { type: String, lowercase: true, trim: true },
  principal: { type: String, trim: true, maxlength: 100 },
  logoUrl: { type: String, default: "" },
  logoPublicId: { type: String, default: "" },
  status: { type: String, enum: ["active", "inactive"], default: "active" }
}, { timestamps: true });
export default mongoose.model("School", schema);
