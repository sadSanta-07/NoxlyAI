import { NextRequest } from "next/server";

export function getUserFromRequest(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  const email = req.headers.get("x-user-email");

  if (!userId || !email) return null;

  return { userId, email };
}