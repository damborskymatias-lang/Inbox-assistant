import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { emailContent, subject, sender } = await req.json();

    if (!emailContent) {
      return NextResponse.json({ priority: "Normal" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ priority: "Normal" });
    }

    const prompt = `
      Analyze the following email and determine its priority level.
      Choose strictly one of these three options: "Urgent", "Important", or "Normal".
      
      Sender: ${sender}
      Subject: ${subject}
      Content: ${emailContent}

      Return ONLY the priority word, nothing else.
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    let priority = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Normal";

    // Fallback if AI returns something unexpected
    if (!["Urgent", "Important", "Normal"].includes(priority)) {
      priority = "Normal";
    }

    return NextResponse.json({ priority });
  } catch (error) {
    console.error("AI Prioritization Error:", error);
    return NextResponse.json({ priority: "Normal" }, { status: 500 });
  }
}
