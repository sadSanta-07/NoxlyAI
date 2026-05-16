import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/response";
import { getUserFromRequest } from "@/lib/getUser";
import { NextRequest } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) return errorResponse("Unauthorized", 401);

    const { name } = await req.json();

    if (!name || typeof name !== "string") {
      return errorResponse("Name is required", 400);
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.userId },
      data: { name },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return successResponse(updatedUser);
  } catch (err) {
    console.error("[PATCH /user]", err);
    return errorResponse("Internal server error", 500);
  }
}
