import { prisma } from "@/lib/prisma";
import { hashPassword, signToken } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/response";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return errorResponse("Email and password are required");
    }

    if (password.length < 6) {
      return errorResponse("Password must be at least 6 characters");
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return errorResponse("User already exists", 409);
    }

    const hashed = await hashPassword(password);

    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    });

    const token = await signToken({ userId: user.id, email: user.email });

    return successResponse(
      {
        token,
        user: { id: user.id, name: user.name, email: user.email },
      },
      201
    );
  } catch (err) {
    console.error("[SIGNUP]", err);
    return errorResponse("Internal server error", 500);
  }
}