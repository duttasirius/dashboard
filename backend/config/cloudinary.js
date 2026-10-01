import { v2 as cloudinary } from "cloudinary";

if (process.env.CLOUDINARY_URL) {
  const parsed = new URL(process.env.CLOUDINARY_URL);
  cloudinary.config({
    cloud_name: parsed.hostname,
    api_key: parsed.username,
    api_secret: decodeURIComponent(parsed.password),
    secure: true
  });
}

export default cloudinary;
