import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/response";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ shareId: string }> }
) {
  try {
    const { shareId } = await params;

    const note = await prisma.note.findFirst({
      where: {
        shareId,
        isPublic: true,
      },
      select: {
        id: true,
        title: true,
        content: true,
        summary: true,
        actionItems: true,
        suggestedTitle: true,
        tags: true,
        category: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!note) return errorResponse("Note not found or is private", 404);

    return successResponse(note);
  } catch (err) {
    console.error("[GET /shared/:shareId]", err);
    return errorResponse("Internal server error", 500);
  }
}