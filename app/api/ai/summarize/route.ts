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

    const prompt = `You are an executive inbox assistant. Summarize the given email concisely in 2-3 bullet points, highlighting key takeaways or required actions.

From: ${sender}
Subject: ${subject}

Content:
${cleanContent}

Summary:`;

    // Skúsime najprv stabilnejší starší endpoint/model, alebo vrátime užívateľovi radu, že ide o chvíľkový výadok Google serverov
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error:", data);
      const errorMsg = data.error?.message || "Failed to generate summary.";
      if (errorMsg.includes("high demand")) {
        return NextResponse.json(
          { error: "Google AI servery sú preťažené. Skús to prosím o chvíľku znova." },
          { status: 503 }
        );
      }
      return NextResponse.json({ error: errorMsg }, { status: 500 });
    }

    const summaryText =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "Could not generate summary.";

    return NextResponse.json({ summary: summaryText.trim() });
  } catch (error: any) {
    console.error("Error in summarize API:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
