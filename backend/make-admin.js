import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/User.js";

const email = process.argv[2]?.trim().toLowerCase();

if (!email) {
  console.error("Usage: npm run make-admin -- user@example.com");
  process.exit(1);
}

const uri = process.env.MONGO_URL || process.env.MONGODB_URL || process.env.MONGO_URI;
if (!uri) {
  console.error("MongoDB URL is missing in backend/.env");
  process.exit(1);
}

try {
  await mongoose.connect(uri);
  const user = await User.findOne({ email });

  if (!user) {
    console.error(`No user found for ${email}`);
    process.exitCode = 1;
  } else {
    user.role = "admin";
    await user.save();
    console.log(`Admin role granted to ${user.email}.`);
  }
} catch (error) {
  console.error("Unable to update user role:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
