import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const uploadThumbnail = (file: any): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        folder: "las_thumbnails", // optional: put in a folder
      },
      (error, result) => {
        if (error || !result?.secure_url) {
          console.error("Thumbnail upload failed:", error);
          return resolve(null);
        }
        resolve(result.secure_url);
      }
    );

    if (!file || !file.buffer) return resolve(null);

    Readable.from(file.buffer).pipe(stream);
  });
};
