import Product from "../models/Product.js";
import { escapeRegex } from "../utils/escape.js";

export async function listProducts(req, res) {
  const { search = "", category, page = 1, limit = 10 } = req.query;
  const filter = {};
  if (search) {
    const regex = new RegExp(escapeRegex(search), "i");
    filter.$or = [{ name: regex }, { sku: regex }, { supplier: regex }];
  }
  if (category) filter.category = category;
  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.min(Math.max(Number(limit), 1), 100);
  const [products, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum),
    Product.countDocuments(filter)
  ]);
  res.json({ products, pagination: { page: pageNum, limit: limitNum, total, pages: Math.max(Math.ceil(total / limitNum), 1) } });
}
export async function getProduct(req,res){ const product=await Product.findById(req.params.id); if(!product)return res.status(404).json({message:"Product not found."}); res.json({product}); }
export async function createProduct(req,res){ const product=await Product.create(req.body); res.status(201).json({product}); }
export async function updateProduct(req,res){ const product=await Product.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true}); if(!product)return res.status(404).json({message:"Product not found."}); res.json({product}); }
export async function deleteProduct(req,res){ const product=await Product.findByIdAndDelete(req.params.id); if(!product)return res.status(404).json({message:"Product not found."}); res.json({message:"Product deleted."}); }
