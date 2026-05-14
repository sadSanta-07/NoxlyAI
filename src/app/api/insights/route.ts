import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/response";
import { getUserFromRequest } from "@/lib/getUser";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) return errorResponse("Unauthorized", 401);

    // run all queries in parallel
    const [allNotes, recentNotes, userData] = await Promise.all([
      // all non-archived notes
      prisma.note.findMany({
        where: { userId: user.userId, isArchived: false },
        select: {
          tags: true,
          updatedAt: true,
          createdAt: true,
        },
      }),

      // recently edited — last 5
      prisma.note.findMany({
        where: { userId: user.userId, isArchived: false },
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          updatedAt: true,
          tags: true,
        },
      }),

      // user AI usage
      prisma.user.findUnique({
        where: { id: user.userId },
        select: { aiUsageCount: true },
      }),
    ]);

    // count tag frequency
    const tagFrequency: Record<string, number> = {};
    for (const note of allNotes) {
      for (const tag of note.tags) {
        tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
      }
    }

    const mostUsedTags = Object.entries(tagFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));

    // weekly activity — notes created in the last 7 days grouped by day
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 6);

    const weeklyMap: Record<string, number> = {};

    // initialise all 7 days to 0
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(sevenDaysAgo.getDate() + i);
      const key = d.toISOString().split("T")[0];
      weeklyMap[key] = 0;
    }

    for (const note of allNotes) {
      const key = note.createdAt.toISOString().split("T")[0];
      if (weeklyMap[key] !== undefined) {
        weeklyMap[key]++;
      }
    }

    const weeklyActivity = Object.entries(weeklyMap).map(([date, count]) => ({
      date,
      count,
    }));

    return successResponse({
      totalNotes: allNotes.length,
      recentNotes,
      mostUsedTags,
      aiUsageCount: userData?.aiUsageCount || 0,
      weeklyActivity,
    });
  } catch (err) {
    console.error("[GET /insights]", err);
    return errorResponse("Internal server error", 500);
  }
}