import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateEmpathyResponse = async (userVent: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "AI 功能未启用：未配置 GEMINI_API_KEY。";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userVent,
      config: {
        systemInstruction: `You are a deeply empathetic and understanding counselor and listener for high school students who are suffering from extreme academic pressure, sleep deprivation, and burnout. 
        
        Your goal is to:
        1. Validate their feelings without judgment. Acknowledge that their pain is real and the system is harsh.
        2. Offer a very brief, warm psychological comfort.
        3. Do NOT offer generic advice like "just study harder" or "manage your time better". Instead, focus on survival, self-compassion, and mental preservation.
        4. Keep the tone gentle, supportive, and slightly somber but holding a glimmer of hope.
        5. Keep the response under 150 words.
        6. Reply in Chinese (Simplified).`,
        temperature: 0.7,
      }
    });

    return response.text || "抱歉，我现在无法倾听。请稍后再试。";
  } catch (error) {
    console.error("Error generating empathy response:", error);
    return "连接断开... 就像我们与睡眠的连接一样。请检查网络稍后再试。";
  }
};
