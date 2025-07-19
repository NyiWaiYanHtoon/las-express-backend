import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const insertDislike = async (videoId, userId) => {
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
                        count: { increment: 1 },
                    },
                });
                return updatedDislike;
            }
            else {
                return existingDislike;
            }
        }
        else {
            const newDislike = await prisma.dislike.create({
                data: {
                    videoId,
                    users: [userId],
                    count: 1,
                },
            });
            return newDislike;
        }
    }
    catch (error) {
        console.log('Error adding dislike:', error);
        return null;
    }
};
