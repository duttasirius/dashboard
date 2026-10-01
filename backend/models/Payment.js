import mongoose from "mongoose";
const schema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  month: { type: String, required: true },
  amount: { type: Number, required: true, min: 1 },
  currency: { type: String, default: "INR" },
  orderId: { type: String, required: true, unique: true },
  paymentId: { type: String, default: "" },
  signature: { type: String, default: "" },
  status: { type: String, enum: ["created", "paid", "failed"], default: "created" },
  paidAt: { type: Date },
  notes: { type: String, trim: true, maxlength: 300 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });
export default mongoose.model("Payment", schema);
