import { Action, ActionType, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function insertAction(actionType: ActionType, videoId: string, userId: string):  Promise< Action | null >{
  try {
    const newAction = await prisma.action.create({
      data: {
        actionType,
        videoId,
        userId
      },
    });
    return newAction;
    
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error inserting action:', error.message);
      console.error(error.stack);
    } else {
      console.error('Unknown error inserting action:', error);
    }
    return null;
  }
}
