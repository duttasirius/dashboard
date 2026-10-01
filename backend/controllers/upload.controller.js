import cloudinary from "../config/cloudinary.js";

export async function uploadImage(req,res){
  if(!req.file)return res.status(400).json({message:"Image file is required."});
  if(!process.env.CLOUDINARY_URL)return res.status(503).json({message:"Cloudinary is not configured."});
  const result=await new Promise((resolve,reject)=>{
    const stream=cloudinary.uploader.upload_stream({resource_type:"image",folder:"mern-erp"},(error,data)=>{
      if(error)reject(error);else resolve(data);
    });
    stream.end(req.file.buffer);
  });
  res.status(201).json({url:result.secure_url,publicId:result.public_id});
}
