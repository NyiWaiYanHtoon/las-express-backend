import { PrismaClient, Video } from "@prisma/client";
import { getTimestampFilter } from "./get-timestamp-filter";

const prisma = new PrismaClient();

type TVideosWithStats = {
  videos: {
    video: {
      id: string;
      title: string;
      description: string;
      tags: string[];
      categoryId: string;
      videoUrl: string;
      thumbnailUrl: string;
      createdAt: Date;
      duration: number;
    };
    visit_count: number;
    view_count: number;
    complete_count: number;
  }[];
  total: number;
};

export const getVideoStatsFromDB = async (
  offset: number,
  limit: number,
  timestamp: string
): Promise<TVideosWithStats | null> => {
  
  const filter = getTimestampFilter(timestamp);
  console.log(offset, limit, timestamp, filter);
  const videoList = await prisma.video.findMany({
    orderBy: [
      { createdAt: "desc" }, 
      { id: "desc" }
    ],
    skip: offset,
    take: limit,
  });

  const videoIds = videoList.map((v) => v.id);
  const videoTitles = videoList.map((v) => v.title);

  console.log("titles: ", videoTitles);

  const statsMap = new Map<
    string,
    { visit: number; view: number; complete: number }
  >();

  // Initialize counts
  for (const id of videoIds) {
    statsMap.set(id, { visit: 0, view: 0, complete: 0 });
  }

  const actions = await prisma.action.findMany({
    where: {
      videoId: { in: videoIds },
      ...(filter ? { createdAt: filter } : {}),
    },
  })
  
  for (const action of actions ) {
    const stat = statsMap.get(action.videoId);
    if (!stat) continue;
    if (action.actionType === "visit") stat.visit++;
    if (action.actionType === "view") stat.view++;
    if (action.actionType === "complete") stat.complete++;
  }

  const videos = videoList.map((video) => ({
    video,
    visit_count: statsMap.get(video.id)?.visit ?? 0,
    view_count: statsMap.get(video.id)?.view ?? 0,
    complete_count: statsMap.get(video.id)?.complete ?? 0,
  }));

  const total = await prisma.video.count();
  return { videos, total };
};

export const getTopViewedFromDB = async (orderMethod: "asc" | "desc"): Promise< Video[] | null > => {
  try{
    const grouped = await prisma.action.groupBy({
    by: ["videoId"],
    where: { actionType: "view" },
    _count: { actionType: true },
    orderBy: {
      _count: { actionType: orderMethod }, //order by the count that was grouped 
    },
    take: 3,
  });

    const videoIds = grouped.map((g) => g.videoId);
    const videos= await prisma.video.findMany({
      where: { id: { in: videoIds } },
    });

    return videos
  }catch(error){
    console.log("error getting top 3 videos: ", error);
    return null
  }
};
