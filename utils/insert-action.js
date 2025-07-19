import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export async function insertAction(actionType, videoId, userId) {
    try {
        // Insert the new user
        const newAction = await prisma.action.create({
            data: {
                actionType,
                videoId,
                userId
            },
        });
        return newAction;
    }
    catch (error) {
        console.log('Error inserting action:', error);
        return null;
    }
}
