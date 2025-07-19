import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();
export const deleteVideo = async (videoId) => {
    await prisma.$transaction([
        prisma.action.deleteMany({
            where: { videoId },
        }),
        prisma.like.deleteMany({
            where: { videoId },
        }),
        prisma.dislike.deleteMany({
            where: { videoId },
        }),
        prisma.video.delete({
            where: { id: videoId },
        }),
    ]);
};
