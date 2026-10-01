import mongoose from "mongoose";
const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  studentId: { type: String, unique: true, trim: true, uppercase: true },
  email: { type: String, lowercase: true, trim: true },
  phone: { type: String, trim: true, maxlength: 30 },
  school: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  enrollmentStatus: { type: String, enum: ["active", "completed", "paused", "dropped"], default: "active" },
  totalFee: { type: Number, min: 0, default: 0 },
  avatarUrl: { type: String, default: "" },
  avatarPublicId: { type: String, default: "" }
}, { timestamps: true });
schema.pre("validate", function(next) {
  if (!this.studentId) this.studentId = `STU-${String(this._id).slice(-6).toUpperCase()}`;
  next();
});
export default mongoose.model("Student", schema);
