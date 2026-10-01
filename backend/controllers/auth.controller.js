import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

export async function register(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required." });
  if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters." });

  const normalized = email.toLowerCase().trim();
  if (await User.findOne({ email: normalized })) return res.status(409).json({ message: "Email is already registered." });

  const role = (await User.countDocuments()) === 0 ? "admin" : "staff";
  const hashed = await bcrypt.hash(password, 12);
  const user = await User.create({ name: name.trim(), email: normalized, password: hashed, role });
  const safeUser = await User.findById(user._id).select("-password");

  res.status(201).json({ token: signToken(user._id), user: safeUser });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase().trim() }).select("+password");
  if (!user || !(await bcrypt.compare(password || "", user.password))) {
    return res.status(401).json({ message: "Invalid email or password." });
  }
  const safeUser = await User.findById(user._id).select("-password");
  res.json({ token: signToken(user._id), user: safeUser });
}

export async function me(req, res) {
  res.json({ user: req.user });
}
