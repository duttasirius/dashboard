import mongoose from "mongoose";
const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  employeeId: { type: String, unique: true, trim: true, uppercase: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, trim: true, maxlength: 30 },
  department: { type: String, required: true, trim: true, maxlength: 80 },
  position: { type: String, required: true, trim: true, maxlength: 80 },
  salary: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ["active", "inactive", "on-leave"], default: "active" },
  joiningDate: { type: Date, default: Date.now },
  avatarUrl: { type: String, default: "" },
  avatarPublicId: { type: String, default: "" }
}, { timestamps: true });
schema.pre("validate", function(next) {
  if (!this.employeeId) this.employeeId = `EMP-${String(this._id).slice(-6).toUpperCase()}`;
  next();
});
export default mongoose.model("Employee", schema);
