import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import employeeRoutes from "./routes/employee.routes.js";
import schoolRoutes from "./routes/school.routes.js";
import courseRoutes from "./routes/course.routes.js";
import studentRoutes from "./routes/student.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import { webhook } from "./controllers/payment.controller.js";
import { errorHandler,notFound } from "./middleware/error.js";

const app=express();

app.use(cors({origin:process.env.CLIENT_URL?.split(",").map(v=>v.trim())||["http://localhost:5173"],credentials:true}));

// Must receive the raw body for Razorpay webhook HMAC verification.
app.post("/api/payments/webhook",express.raw({type:"application/json"}),webhook);

app.use(express.json({limit:"1mb"}));
app.use(morgan("dev"));

app.get("/api/health",(req,res)=>res.json({status:"ok",service:"mern-erp-pro"}));

app.use("/api/auth",authRoutes);
app.use("/api/employees",employeeRoutes);
app.use("/api/schools",schoolRoutes);
app.use("/api/courses",courseRoutes);
app.use("/api/students",studentRoutes);
app.use("/api/payments",paymentRoutes);
app.use("/api/uploads",uploadRoutes);
app.use("/api/dashboard",dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

await connectDB();
const port=process.env.PORT||8000;
app.listen(port,()=>console.log(`ERP API running at http://localhost:${port}`));
