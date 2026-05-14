import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/response";
import { getUserFromRequest } from "@/lib/getUser";
import { NextRequest } from "next/server";

// GET /api/notes — list notes with search + filter + sort
export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) return errorResponse("Unauthorized", 401);

    const { searchParams } = req.nextUrl;
    const search = searchParams.get("search") || "";
    const tag = searchParams.get("tag") || "";
    const category = searchParams.get("category") || "";
    const archived = searchParams.get("archived") === "true";

    const notes = await prisma.note.findMany({
      where: {
        userId: user.userId,
        isArchived: archived,
        ...(tag && { tags: { has: tag } }),
        ...(category && { category }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        content: true,
        tags: true,
        category: true,
        isPublic: true,
        isArchived: true,
        shareId: true,
        summary: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return successResponse(notes);
  } catch (err) {
    console.error("[GET /notes]", err);
    return errorResponse("Internal server error", 500);
  }
}

// POST /api/notes — create a new note
export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) return errorResponse("Unauthorized", 401);

    const { title, content, tags, category } = await req.json();

    if (!title || !content) {
      return errorResponse("Title and content are required");
    }

    const note = await prisma.note.create({
      data: {
        title,
        content,
        tags: tags || [],
        category: category || null,
        userId: user.userId,
      },
    });

    return successResponse(note, 201);
  } catch (err) {
    console.error("[POST /notes]", err);
    return errorResponse("Internal server error", 500);
  }
}