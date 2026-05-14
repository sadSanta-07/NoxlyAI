import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/response";
import { getUserFromRequest } from "@/lib/getUser";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(
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

    if (!note.content || note.content.trim().length < 20) {
      return errorResponse("Note content is too short to summarise");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are a helpful assistant. Analyse the following note and respond ONLY with a valid JSON object — no markdown, no explanation, no code fences.

The JSON must have exactly these three keys:
{
  "summary": "A concise 2-3 sentence summary of the note",
  "action_items": ["action 1", "action 2"],
  "suggested_title": "A short, clear title for this note"
}

Note content:
"""
${note.content}
"""
`.trim();

    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();

    let parsed: {
      summary: string;
      action_items: string[];
      suggested_title: string;
    };

    try {
      parsed = JSON.parse(raw);
    } catch {
      console.error("[AI] Failed to parse Gemini response:", raw);
      return errorResponse("AI returned an unexpected response format", 502);
    }

    // save AI output back to the note
    const updated = await prisma.note.update({
      where: { id },
      data: {
        summary: parsed.summary,
        actionItems: parsed.action_items,
        suggestedTitle: parsed.suggested_title,
      },
    });

    // increment user AI usage count
    await prisma.user.update({
      where: { id: user.userId },
      data: { aiUsageCount: { increment: 1 } },
    });

    return successResponse({
      summary: updated.summary,
      action_items: updated.actionItems,
      suggested_title: updated.suggestedTitle,
    });
  } catch (err) {
    console.error("[POST /notes/:id/generate-summary]", err);
    return errorResponse("Internal server error", 500);
  }
}