import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/response";
import { getUserFromRequest } from "@/lib/getUser";
import { NextRequest } from "next/server";

// GET /api/notes/:id
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromRequest(req);
    if (!user) return errorResponse("Unauthorized", 401);

    const { id } = await params;

    const note = await prisma.note.findFirst({
      where: { id, userId: user.userId },
    });

    if (!note) return errorResponse("Note not found", 404);

    return successResponse(note);
  } catch (err) {
    console.error("[GET /notes/:id]", err);
    return errorResponse("Internal server error", 500);
  }
}

// PATCH /api/notes/:id — update or archive
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromRequest(req);
    if (!user) return errorResponse("Unauthorized", 401);

    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.note.findFirst({
      where: { id, userId: user.userId },
    });

    if (!existing) return errorResponse("Note not found", 404);

    const updated = await prisma.note.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.content !== undefined && { content: body.content }),
        ...(body.tags !== undefined && { tags: body.tags }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.isPublic !== undefined && { isPublic: body.isPublic }),
        ...(body.isArchived !== undefined && { isArchived: body.isArchived }),
      },
    });

    return successResponse(updated);
  } catch (err) {
    console.error("[PATCH /notes/:id]", err);
    return errorResponse("Internal server error", 500);
  }
}

// DELETE /api/notes/:id
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromRequest(req);
    if (!user) return errorResponse("Unauthorized", 401);

    const { id } = await params;

    const existing = await prisma.note.findFirst({
      where: { id, userId: user.userId },
    });

    if (!existing) return errorResponse("Note not found", 404);

    await prisma.note.delete({ where: { id } });

    return successResponse({ message: "Note deleted" });
  } catch (err) {
    console.error("[DELETE /notes/:id]", err);
    return errorResponse("Internal server error", 500);
  }
}