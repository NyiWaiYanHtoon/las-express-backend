import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export async function insertVideo(videoUrl, title, description, tags, categoryId, thumbnailUrl, duration) {
    try {
        const newVideo = await prisma.video.create({
            data: {
                title,
                description,
                tags,
                videoUrl,
                thumbnailUrl,
                categoryId,
                duration,
                likes: {
                    create: {
                        users: [],
                        count: 0,
                    },
                },
                dislikes: {
                    create: {
                        users: [],
                        count: 0,
                    },
                },
            },
        });
        return newVideo;
    }
    catch (error) {
        console.log('Error inserting video into database:', error);
        return null;
    }
}
