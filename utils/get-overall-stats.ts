import { PrismaClient } from "@prisma/client";
import { getTimestampFilter } from "./get-timestamp-filter";

const prisma = new PrismaClient();

export const getOverallStats = async (
  timeframe: "today" | "week" | "all"
): Promise<{
  visits: number;
  views: number;
  completions: number;
} | null> => {
  try {

    //get the start date
    let startDate= getTimestampFilter(timeframe)

    const where = startDate ? { createdAt: startDate } : {};

    const [visits, views, completions] = await Promise.all([
      prisma.action.count({ where: { actionType: "visit", ...where } }),
      prisma.action.count({ where: { actionType: "view", ...where } }),
      prisma.action.count({ where: { actionType: "complete", ...where } }),
    ]);

    return { visits, views, completions };
  } catch (err) {
    console.error("Error in getOverallStats:", err);
    return null;
  }
};
