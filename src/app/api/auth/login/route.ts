import { prisma } from "@/lib/prisma";
import { comparePassword, signToken } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/response";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return errorResponse("Email and password are required");
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return errorResponse("Invalid credentials", 401);
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
      return errorResponse("Invalid credentials", 401);
    }

    const token = await signToken({ userId: user.id, email: user.email });

    return successResponse({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err: any) {
    console.error("[LOGIN] CRITICAL ERROR:", err);
    return errorResponse(err.message || "Internal server error", 500);
  }
}