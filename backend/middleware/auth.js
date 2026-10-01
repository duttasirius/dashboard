import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function protect(req,res,next){
  try{
    const header=req.headers.authorization;
    if(!header?.startsWith("Bearer ")) return res.status(401).json({message:"Authentication required."});

    const decoded=jwt.verify(header.slice(7),process.env.JWT_SECRET);
    const user=await User.findById(decoded.id).select("-password");
    if(!user) return res.status(401).json({message:"User no longer exists."});

    req.user=user;
    next();
  }catch{
    return res.status(401).json({message:"Invalid or expired token."});
  }
}

// Role checks are intentionally disabled for this dashboard.
// Every authenticated user can perform all available application actions.
export function allowRoles(...roles){
  return (req,res,next)=>next();
}
export const adminOnly=allowRoles("admin");
export const managerOrAdmin=allowRoles("admin","manager");
