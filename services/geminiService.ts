export const generateEmpathyResponse = async (userVent: string): Promise<string> => {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text: userVent })
    });

    if (response.status === 503) {
      return "AI 功能未启用：未配置 GEMINI_API_KEY（或未部署 /api/gemini）。";
    }

    if (!response.ok) {
      return "抱歉，我现在无法倾听。请稍后再试。";
    }

    const data = await response.json().catch(() => null);
    return (data && typeof data.text === 'string' && data.text.trim()) ? data.text : "抱歉，我现在无法倾听。请稍后再试。";
  } catch (error) {
    console.error("Error generating empathy response:", error);
    return "连接断开... 就像我们与睡眠的连接一样。请检查网络稍后再试。";
  }
};
