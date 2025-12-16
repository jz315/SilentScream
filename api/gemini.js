import { GoogleGenAI } from '@google/genai';

const SYSTEM_INSTRUCTION = `You are a deeply empathetic and understanding counselor and listener for high school students who are suffering from extreme academic pressure, sleep deprivation, and burnout.

Your goal is to:
1. Validate their feelings without judgment. Acknowledge that their pain is real and the system is harsh.
2. Offer a very brief, warm psychological comfort.
3. Do NOT offer generic advice like "just study harder" or "manage your time better". Instead, focus on survival, self-compassion, and mental preservation.
4. Keep the tone gentle, supportive, and slightly somber but holding a glimmer of hope.
5. Keep the response under 150 words.
6. Reply in Chinese (Simplified).`;

function getApiKey() {
  return process.env.GEMINI_API_KEY || '';
}

function readText(body) {
  if (!body) return '';
  if (typeof body === 'string') return body;
  if (typeof body.text === 'string') return body.text;
  if (typeof body.userVent === 'string') return body.userVent;
  return '';
}

export default async function handler(req, res) {
  const apiKey = getApiKey();

  if (req.method === 'GET') {
    res.status(200).json({ ok: Boolean(apiKey) });
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  if (!apiKey) {
    res.status(503).json({ error: 'AI not configured' });
    return;
  }

  const text = readText(req.body);
  if (!text.trim()) {
    res.status(400).json({ error: 'Missing text' });
    return;
  }

  if (text.length > 4000) {
    res.status(413).json({ error: 'Text too long' });
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: text,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7
      }
    });

    res.status(200).json({ text: response.text || '' });
  } catch (error) {
    console.error('Gemini proxy error:', error);
    res.status(502).json({ error: 'Upstream error' });
  }
}

