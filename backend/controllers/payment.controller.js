import crypto from "crypto";
import Razorpay from "razorpay";
import Employee from "../models/Employee.js";
import Payment from "../models/Payment.js";

function razorpayClient() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    const err = new Error("Razorpay credentials are not configured in backend/.env.");
    err.statusCode = 500;
    throw err;
  }
  return new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
}

function checkoutSignature(orderId, paymentId) {
  return crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(`${orderId}|${paymentId}`).digest("hex");
}

export async function createOrder(req,res){
  const {employeeId,month,amount}=req.body;
  if(!employeeId||!month)return res.status(400).json({message:"Employee and month are required."});
  if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(month))return res.status(400).json({message:"Month must use YYYY-MM format."});
  const employee=await Employee.findById(employeeId);
  if(!employee)return res.status(404).json({message:"Employee not found."});
  const numericAmount=Number(amount??employee.salary);
  if(!Number.isFinite(numericAmount)||numericAmount<=0)return res.status(400).json({message:"Amount must be greater than zero."});
  const existing=await Payment.findOne({employee:employee._id,month,status:"paid"});
  if(existing)return res.status(409).json({message:`Salary for ${month} is already paid.`});
  const order=await razorpayClient().orders.create({
    amount:Math.round(numericAmount*100),currency:"INR",
    receipt:`salary_${employee.employeeId||employee._id}_${Date.now()}`,
    notes:{employeeId:String(employee._id),employeeName:employee.name,month}
  });
  const record=await Payment.create({employee:employee._id,month,amount:numericAmount,orderId:order.id,createdBy:req.user._id,status:"created"});
  res.status(201).json({
    order:{id:order.id,amount:order.amount,currency:order.currency},
    paymentRecordId:record._id,
    razorpayKeyId:process.env.RAZORPAY_KEY_ID,
    employee:{id:employee._id,name:employee.name,employeeId:employee.employeeId,email:employee.email,phone:employee.phone}
  });
}

export async function verifyPayment(req,res){
  const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body;
  if(!razorpay_order_id||!razorpay_payment_id||!razorpay_signature)return res.status(400).json({message:"Incomplete Razorpay response."});
  const expected=checkoutSignature(razorpay_order_id,razorpay_payment_id);
  if(expected!==razorpay_signature){
    await Payment.findOneAndUpdate({orderId:razorpay_order_id},{status:"failed"});
    return res.status(400).json({message:"Payment signature verification failed."});
  }
  const payment=await Payment.findOneAndUpdate(
    {orderId:razorpay_order_id},
    {paymentId:razorpay_payment_id,signature:razorpay_signature,status:"paid",paidAt:new Date()},
    {new:true}
  ).populate("employee","name employeeId department");
  if(!payment)return res.status(404).json({message:"Payment record not found."});
  res.json({message:"Payment verified.",payment});
}

export async function listPayments(req,res){
  const {status,employeeId,month,page=1,limit=10}=req.query;
  const filter={};if(status)filter.status=status;if(employeeId)filter.employee=employeeId;if(month)filter.month=month;
  const pageNum=Math.max(Number(page),1),limitNum=Math.min(Math.max(Number(limit),1),100);
  const [payments,total]=await Promise.all([
    Payment.find(filter).populate("employee","name employeeId department").sort({createdAt:-1}).skip((pageNum-1)*limitNum).limit(limitNum),
    Payment.countDocuments(filter)
  ]);
  res.json({payments,pagination:{page:pageNum,limit:limitNum,total,pages:Math.max(Math.ceil(total/limitNum),1)}});
}

export async function employeePayments(req,res){
  const payments=await Payment.find({employee:req.params.employeeId}).populate("employee","name employeeId").sort({createdAt:-1});
  res.json({payments});
}

export async function webhook(req,res){
  const signature=req.headers["x-razorpay-signature"];
  if(!process.env.RAZORPAY_WEBHOOK_SECRET||!signature)return res.status(400).json({message:"Webhook signature missing."});
  const expected=crypto.createHmac("sha256",process.env.RAZORPAY_WEBHOOK_SECRET).update(req.body).digest("hex");
  if(expected!==signature)return res.status(400).json({message:"Invalid webhook signature."});
  let event;
  try { event=JSON.parse(req.body.toString("utf8")); }
  catch { return res.status(400).json({message:"Invalid webhook JSON."}); }
  const entity=event.payload?.payment?.entity;
  const orderId=entity?.order_id;
  if(orderId&&event.event==="payment.captured"){
    await Payment.findOneAndUpdate({orderId},{paymentId:entity.id,status:"paid",paidAt:new Date()});
  }
  if(orderId&&event.event==="payment.failed"){
    await Payment.findOneAndUpdate({orderId},{status:"failed"});
  }
  res.json({received:true});
}
