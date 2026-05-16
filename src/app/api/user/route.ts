import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/response";
import { getUserFromRequest } from "@/lib/getUser";
import { NextRequest } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) return errorResponse("Unauthorized", 401);

    const { name, email } = await req.json();

    if (!name && !email) {
      return errorResponse("Name or email is required", 400);
    }

    const data: any = {};
    if (name) data.name = name;
    if (email) {
      // Check if email is already taken
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser && existingUser.id !== user.userId) {
        return errorResponse("Email is already in use", 400);
      }
      data.email = email;
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.userId },
      data,
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
