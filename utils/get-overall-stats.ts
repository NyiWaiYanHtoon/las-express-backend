import { PrismaClient } from "@prisma/client";
import { getTimestampFilter } from "./get-timestamp-filter";

const prisma = new PrismaClient();

export const getOverallStats = async (
  timeframe: "today" | "week" | "all",
  userId?: string
): Promise<{
  visits: number;
  views: number;
  completions: number;
  totalVideoCount: number;
} | null> => {
  try {
    //get the start date
    let startDate = getTimestampFilter(timeframe);

    const where = {
      ...(startDate && { createdAt: startDate }),
      ...(userId && { userId }),
    };

    const [visits, views, completions, totalVideoCount] = await Promise.all([
      prisma.action.count({ where: { actionType: "visit", userId, ...where } }),
      prisma.action.count({ where: { actionType: "view", userId, ...where } }),
      prisma.action.count({
        where: { actionType: "complete", userId, ...where },
      }),
      prisma.video.count(),
    ]);

    return { visits, views, completions, totalVideoCount };
  } catch (err) {
    console.error("Error in getOverallStats:", err);
    return null;
  }
};
