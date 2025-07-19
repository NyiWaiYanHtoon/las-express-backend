import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});


export const streamUpload = (reqFile: any): Promise<string | null> => {
  return new Promise((resolve) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'video', folder: 'las_videos' },
      (error, result) => {
        if (error || !result) {
          console.error("Cloudinary upload error:", error);
          resolve(null);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    streamifier.createReadStream(reqFile.buffer).pipe(stream);
  });
};
