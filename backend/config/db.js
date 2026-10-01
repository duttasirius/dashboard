import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGO_URL || process.env.MONGODB_URL || process.env.MONGO_URI;

  if (!uri) {
    const error = new Error("MongoDB URL is missing. Set MONGO_URL (or MONGODB_URL/MONGO_URI) in backend/.env.");
    error.statusCode = 500;
    throw error;
  }

  try {
    const connection = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};
