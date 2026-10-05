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

    // Tu môžeme použiť OpenAI API, ak máš nastavený OPENAI_API_KEY, 
    // alebo zatiaľ vrátiť inteligentnú šablónu / mock, kým nezapojíš kľúč.
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      // Fallback ak ešte nie je pridaný OpenAI kľúč vo Vercel/env
      return NextResponse.json({
        summary: `AI Summary (Mock): This email from ${sender} with subject "${subject}" appears to be an informational notification requiring no immediate manual action.`
      });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an executive inbox assistant. Summarize the given email concisely in 2-3 bullet points, highlighting key takeaways or required actions."
          },
          {
            role: "content",
            content: `Subject: ${subject}\nFrom: ${sender}\n\nContent:\n${emailContent}`
          }
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    const summary = data.choices?.[0]?.message?.content || "Could not generate summary.";

    return NextResponse.json({ summary });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
