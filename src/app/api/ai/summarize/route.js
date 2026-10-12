import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req) {
  try {
    const { emailContent, subject, sender, language } = await req.json();

    const targetLanguage = language || 'English';

    const prompt = `
      Analyze the following email and provide:
      1. A concise executive summary in ${targetLanguage}.
      2. Priority level (Urgent, Important, or Normal).
      3. Three professional quick reply suggestions in ${targetLanguage}.

      Format the output strictly as JSON with keys: summary, priority, quickReplies (array of 3 strings).

      Sender: ${sender}
      Subject: ${subject}
      Content: ${emailContent}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = typeof response.text === 'function' ? response.text() : response.text;
    const result = JSON.parse(responseText);
    
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error('AI Summarize error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process AI summary' }), { status: 500 });
  }
}
