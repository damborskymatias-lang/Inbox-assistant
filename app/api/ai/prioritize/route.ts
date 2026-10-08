import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { emailContent, subject, sender } = await req.json();

    if (!emailContent) {
      return NextResponse.json({ priority: "Normal" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Analyze the following email and determine its priority level.
      Choose strictly one of these three options: "Urgent", "Important", or "Normal".
      
      Sender: ${sender}
      Subject: ${subject}
      Content: ${emailContent}

      Return ONLY the priority word, nothing else.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let priority = response.text().trim();

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
