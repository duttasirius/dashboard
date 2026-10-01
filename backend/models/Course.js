import mongoose from "mongoose";
const schema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, minlength: 2, maxlength: 140 },
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  duration: { type: String, required: true, trim: true, maxlength: 60 },
  fee: { type: Number, required: true, min: 0 },
  capacity: { type: Number, min: 1, default: 30 },
  description: { type: String, trim: true, maxlength: 600 },
  active: { type: Boolean, default: true }
}, { timestamps: true });
export default mongoose.model("Course", schema);
