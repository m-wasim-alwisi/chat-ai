import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],
    });

    const reply =
      response.candidates?.[0]?.content?.parts?.[0]?.text ??
      "No response";

    return NextResponse.json({ reply });
  } 
  
  catch (error: unknown) {
  console.error(error);

  let message = "Internal error";

  if (error instanceof Error) {
    message = error.message;
  }

  return NextResponse.json({ reply: message }, { status: 500 });
}
}
