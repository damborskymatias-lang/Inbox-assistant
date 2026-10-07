import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { emailContent, subject, sender } = await req.json();

    if (!emailContent) {
      return NextResponse.json({ error: "Email content is missing" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    const cleanContent = emailContent.replace(/<[^>]*>?/gm, "").trim();

    // Vylepšený prompt, ktorý od AI žiada aj určenie priority
    const prompt = `You are an executive inbox assistant. Analyze the following email and output valid JSON with two fields:
1. "priority": exactly one of "Urgent", "Important", or "Normal".
2. "summary": a concise summary in 2-3 bullet points highlighting key takeaways or required actions.

From: ${sender}
Subject: ${subject}

Content:
${cleanContent}

Respond ONLY with a JSON object in this exact format:
{
  "priority": "...",
  "summary": "..."
}`;

    const response = formatGeminiCall(apiKey, prompt); // interná štruktúra fetch
    const fetchResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await fetchResponse.json();

    if (!fetchResponse.ok) {
      const errorMsg = data.error?.message || "Failed to generate summary from Gemini.";
      return NextResponse.json({ error: errorMsg }, { status: 500 });
    }

    let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // Vyčistenie markdown obalov (ak by AI vrátilo ```json ... ```)
    rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsedResult;
    try {
      parsedResult = JSON.parse(rawText);
    } catch (e) {
      // Fallback, ak by AI náhodou nevrátilo čistý JSON
      parsedResult = {
        priority: "Normal",
        summary: rawText || "Could not generate summary."
      };
    }

    return NextResponse.json({
      summary: parsedResult.summary,
      priority: parsedResult.priority,
    });
  } catch (error: any) {
    console.error("Error in summarize API:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
