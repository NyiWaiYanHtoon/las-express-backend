import { PrismaClient, Video } from '@prisma/client';
const prisma = new PrismaClient();

export async function insertVideo(
  videoUrl: string,
  title: string,
  description: string,
  tags: string[],
  categoryId: string,
  thumbnailUrl: string,
  duration: number
): Promise< Video | null> {
  try {
    const newVideo: Video = await prisma.video.create({
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

  } catch (error) {
    console.log('Error inserting video into database:', error);
    return null;
  }
}
