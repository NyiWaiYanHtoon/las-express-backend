import { PrismaClient, Prisma, Like, Dislike } from "@prisma/client";
const prisma = new PrismaClient();

export const selectVideoWithCount = async (
  offset: number,
  limit: number,
  search: string,
  id?: string
): Promise<{
  videos: {
    id: string;
    title: string;
    description: string;
    tags: string[];
    videoUrl: string;
    thumbnailUrl: string;
    createdAt: Date;
    duration: number;
    category: { name: string };
    likes: Like | null;
    dislikes: Dislike | null;
    views: number;
  }[];
  total: number;
} | null> => {
  try {
    const searchConditions = search
      ? {
          OR: [
            { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { description: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { tags: { has: search } },
            { category: { name: { contains: search, mode: Prisma.QueryMode.insensitive } } },
          ],
        }
      : {};

    const idCondition = id ? { id } : {};

    const whereFilter: Prisma.VideoWhereInput = {
      AND: [idCondition, searchConditions],
    };

    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where: whereFilter,
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          category: { select: { name: true } },
          likes: { select: { id: true, count: true, users: true, videoId: true } },
          dislikes: { select: { id: true, count: true, users: true, videoId: true } },
          actions: {
            where: { actionType: "view" },
            select: { id: true },
          },
        },
      }),
      prisma.video.count({ where: whereFilter }),
    ]);

    
    const formattedVideos = videos.map((v) => ({
      id: v.id,
      title: v.title,
      description: v.description,
      tags: v.tags,
      videoUrl: v.videoUrl,
      thumbnailUrl: v.thumbnailUrl,
      createdAt: v.createdAt,
      duration: v.duration,
      category: { name: v.category.name },
      likes: v.likes ?? { count: 0, users: [], videoId: "", id: "" },
      dislikes: v.dislikes ?? { count: 0, users: [], videoId: "", id: ""  },
      views: v.actions.length,
    }));

    return { videos: formattedVideos, total };
  } catch (err) {
    console.error(err);
    return null;
  }
};
