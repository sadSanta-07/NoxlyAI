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
    const body = await req.json().catch(() => ({}));
    const { action = "summarize", text: selectedText } = body;

    const note = await prisma.note.findFirst({
      where: { id, userId: user.userId },
    });

    if (!note) return errorResponse("Note not found", 404);

    const contentToProcess = selectedText || note.content;

    if (!contentToProcess || contentToProcess.trim().length < 5) {
      return errorResponse("Content is too short for AI processing");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let prompt = "";
    if (action === "summarize") {
      prompt = `
Analyze the following text and respond ONLY with a valid JSON object.
{
  "summary": "A concise 2-3 sentence summary",
  "action_items": ["action 1", "action 2"],
  "suggested_title": "A short, clear title"
}

Text:
"""
${contentToProcess}
"""
`.trim();
    } else {
      const actionPrompts: Record<string, string> = {
        rewrite: "Rewrite the following text to be more professional and clear while maintaining the original meaning.",
        simplify: "Simplify the following text to make it easy to understand, like for a 5th grader.",
        expand: "Expand on the following text by adding more detail and context while staying relevant.",
        "fix-grammar": "Fix any grammar or spelling errors in the following text.",
      };

      const selectedActionPrompt = actionPrompts[action] || actionPrompts["rewrite"];
      prompt = `
${selectedActionPrompt}
Respond ONLY with the modified text. Do not include explanations, code fences, or any other content.

Text:
"""
${contentToProcess}
"""
`.trim();
    }

    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();

    // increment user AI usage count
    await prisma.user.update({
      where: { id: user.userId },
      data: { aiUsageCount: { increment: 1 } },
    });

    if (action === "summarize") {
      let parsed: {
        summary: string;
        action_items: string[];
        suggested_title: string;
      };

      try {
        const cleanRaw = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
        parsed = JSON.parse(cleanRaw);
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

      return successResponse({
        summary: updated.summary,
        action_items: updated.actionItems,
        suggested_title: updated.suggestedTitle,
      });
    } else {
      return successResponse({ result: raw });
    }
  } catch (err: any) {
    console.error("[AI ERROR]", err);
    const msg = err.message || "Unknown AI error";
    return errorResponse(`AI Processing Error: ${msg}`, 500);
  }
}