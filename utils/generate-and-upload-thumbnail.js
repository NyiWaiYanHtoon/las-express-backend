"use strict";
// import { v2 as cloudinary } from 'cloudinary';
// import streamifier from 'streamifier';
// import ffmpeg from 'fluent-ffmpeg';
// import { Readable } from 'stream';
// cloudinary.config({
//   cloud_name: 'dezionyjx',
//   api_key: '244725459995323',
//   api_secret: '5DeychBFR9FG6vNBzWHhOUBLpi8'
// });
// // Helper: Convert Buffer to Readable Stream
// const bufferToStream = (buffer: Buffer): Readable => {
//   return streamifier.createReadStream(buffer);
// };
// export const generateThumbnail = (file): Promise<string | null> => {
//   return new Promise((resolve) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       {
//         resource_type: 'image',
//         folder: 'las_thumbnails'
//       },
//       (error, result) => {
//         if (error || !result) {
//           console.error('Cloudinary thumbnail upload failed:', error);
//           return resolve(null);
//         }
//         resolve(result.secure_url);
//       }
//     );
//     ffmpeg(bufferToStream(file.buffer))
//       .on('error', (err) => {
//         console.log('FFmpeg processing error:', err);
//         resolve(null);
//       })
//       .on('end', () => {
//         console.log('Thumbnail generated and uploaded.');
//       })
//       .screenshots({
//         count: 1,
//         timestamps: ['1'],
//         filename: 'thumbnail.png',
//         size: '320x240'
//       })
//       .format('image2')
//       .pipe(uploadStream, { end: true });
//   });
// };
