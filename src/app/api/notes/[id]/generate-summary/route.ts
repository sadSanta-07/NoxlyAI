import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/response";
import { getUserFromRequest } from "@/lib/getUser";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";

// Use a getter for the model to ensure env vars are accessed at request time
function getAIModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");
  const genAI = new GoogleGenerativeAI(apiKey);
  console.log("[AI] Initializing model: gemini-flash-latest (May 2026)");
  return genAI.getGenerativeModel({ model: "gemini-flash-latest" });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromRequest(req);
    if (!user) return errorResponse("Unauthorized", 401);

    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { action = "summarize", text: selectedText, currentContent } = body;

    const note = await prisma.note.findFirst({
      where: { id, userId: user.userId },
    });

    if (!note) return errorResponse("Note not found", 404);

    // Prioritise passed text, then current content from editor, then DB content
    const contextContent = currentContent || note.content;
    const contentToProcess = selectedText || contextContent;

    if (!contentToProcess || contentToProcess.trim().length < 2) {
      return errorResponse("Content is too short for AI processing");
    }

    const model = getAIModel();

    let prompt = "";
    if (action === "summarize") {
      prompt = `
Analyze the following text and respond ONLY with a valid JSON object.
{
  "summary": "A concise 2-3 sentence summary",
  "action_items": ["action 1", "action 2"],
  "suggested_title": "A short, clear title"
}

Text to analyze:
"""
${contentToProcess}
"""
`.trim();
    } else if (action === "chat") {
      prompt = `
You are a helpful AI assistant. Answer the user's question based on the provided note context.
If the answer isn't in the context, use your general knowledge but mention it's not in the note.

Note Context:
"""
${contextContent}
"""

User Question: ${selectedText}

Respond naturally in markdown. Keep it concise.
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
    const response = await result.response;
    const raw = response.text().trim();

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
        // More robust JSON extraction
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("No JSON found");
        parsed = JSON.parse(jsonMatch[0]);
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