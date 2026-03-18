import { GoogleGenAI, Type } from "@google/genai";
import { Advice, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateAdvice(language: Language): Promise<Advice[]> {
  const prompt = language === 'ko' 
    ? "시니어를 위한 4가지 생활 조언을 생성해주세요. 카테고리는 'walking', 'water', 'posture', 'social'이어야 합니다. 각 조언은 텍스트, 강조할 부분(highlight), 그리고 부연 설명(subtext)을 포함해야 합니다. JSON 형식으로 반환해주세요."
    : "Generate 4 lifestyle advice tips for seniors. Categories must be 'walking', 'water', 'posture', 'social'. Each tip should include text, a highlight, and subtext. Return in JSON format.";

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            category: { 
              type: Type.STRING, 
              enum: ['walking', 'water', 'posture', 'social'] 
            },
            text: { type: Type.STRING },
            highlight: { type: Type.STRING },
            subtext: { type: Type.STRING },
          },
          required: ['id', 'category', 'text', 'highlight', 'subtext'],
        },
      },
    },
  });

  try {
    const advice = JSON.parse(response.text);
    return advice;
  } catch (error) {
    console.error("Failed to parse advice from Gemini:", error);
    return [];
  }
}
