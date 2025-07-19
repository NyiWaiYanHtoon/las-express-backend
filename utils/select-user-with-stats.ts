import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function selectUserStats(offset: number, limit: number, search: string) {
  try {
    const users = await prisma.user.findMany({
      skip: offset,
      take: limit,
      where: {
        email: {
          contains: search,
          mode: "insensitive",
        },
      },
      orderBy: { joinedAt: "desc" },
    });

    const results = await Promise.all(
      users.map(async (user) => {
        const mostViewed = await prisma.action.groupBy({
          by: ["videoId"],
          where: {
            userId: user.id,
            actionType: "view",
          },
          _count: {
            _all: true,
          },
          orderBy: {
            _count: { videoId: "desc" },
          },
          take: 1,
        });

        const mostVisited = await prisma.action.groupBy({
          by: ["videoId"],
          where: {
            userId: user.id,
            actionType: "visit",
          },
          _count: {
            _all: true,
          },
          orderBy: {
            _count: { videoId: "desc" },
          },
          take: 1,
        });

        const video = mostViewed[0]
          ? await prisma.video.findUnique({ where: { id: mostViewed[0].videoId } })
          : null;

        const visitedVideo = mostVisited[0]
          ? await prisma.video.findUnique({ where: { id: mostVisited[0].videoId } })
          : null;

        const viewedCategory = video
          ? await prisma.category.findUnique({ where: { id: video.categoryId } })
          : null;

        const visitedCategory = visitedVideo
          ? await prisma.category.findUnique({ where: { id: visitedVideo.categoryId } })
          : null;

        return {
          email: user.email,
          joinedAt: user.joinedAt,
          mostViewedCategory: viewedCategory,
          mostVisitedCategory: visitedCategory,
          mostViewedVideo: video,
        };
      })
    );

    const total = await prisma.user.count({
      where: {
        email: {
          contains: search,
          mode: "insensitive",
        },
      },
    });

    return { users: results, total };
  } catch (error) {
    console.log("selectUserStats error:", error);
    return null
  }
}
