import { errorResponse, successResponse } from "@/lib/response";
import { getUserFromRequest } from "@/lib/getUser";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

function getAIModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");
  const genAI = new GoogleGenerativeAI(apiKey);
  console.log("[AI-CHAT] Initializing model: gemini-flash-latest (May 2026)");
  return genAI.getGenerativeModel({ model: "gemini-flash-latest" });
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) return errorResponse("Unauthorized", 401);

    const { message } = await req.json();

    if (!message) {
      return errorResponse("Message is required");
    }

    const model = getAIModel();

    const prompt = `
You are Noxly AI, a helpful and professional workspace assistant. 
The user is asking you a general question about productivity, organization, or your capabilities.

User Question: ${message}

Respond in a professional, helpful, and concise manner using markdown.
`.trim();

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const raw = response.text().trim();

    // increment user AI usage count
    await prisma.user.update({
      where: { id: user.userId },
      data: { aiUsageCount: { increment: 1 } },
    });

    return successResponse({ result: raw });
  } catch (err: any) {
    console.error("[AI CHAT ERROR]", err);
    return errorResponse(err.message || "AI failed to respond", 500);
  }
}
