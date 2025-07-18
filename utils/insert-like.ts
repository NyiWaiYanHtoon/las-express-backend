import { Like, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const insertLike = async (videoId: string, userId: string): Promise< Like | null > => {
  try {
    const existingLike = await prisma.like.findUnique({
      where: { videoId },
    });

    if (existingLike) {
      if (!existingLike.users.includes(userId)) {
        const updatedLike = await prisma.like.update({
          where: { videoId },
          data: {
            users: { push: userId },
            count: { increment: 1 },
          },
        });
        return updatedLike;
      } else {
        return existingLike;
      }
    } else {
      const newLike = await prisma.like.create({
        data: {
          videoId,
          users: [userId],
          count: 1,
        },
      });
      return newLike;
    }
  } catch (error) {
    console.log('Error adding like:', error);
    return null;
  }
};
