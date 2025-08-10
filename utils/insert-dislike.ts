import { Dislike, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const insertDislike = async (videoId: string, userId: string): Promise< Dislike | null > => {
  try {
    const existingDislike = await prisma.dislike.findUnique({
      where: { videoId },
    });

    if (existingDislike) {
      if (!existingDislike.users.includes(userId)) {
        const updatedDislike = await prisma.dislike.update({
          where: { videoId },
          data: {
            users: { push: userId },
            count: { set: existingDislike.users.length+1 },
          },
        });
        return updatedDislike;
      } else {
        const newDislikeUsers= existingDislike.users.filter(id => id !== userId);
        const removedDislike= await prisma.dislike.update({
          where: { videoId },
          data: {
            users: { set: newDislikeUsers },
            count: { set: newDislikeUsers.length },
          }
        })
        return removedDislike;
      }
    } else {
      const newDislike = await prisma.dislike.create({
        data: {
          videoId,
          users: [userId],
          count: 1,
        },
      });
      return newDislike;
    }
  } catch (error) {
    console.log('Error adding dislike:', error);
    return null;
  }
};
