import React, { useState, useRef, useEffect } from 'react';
import { generateEmpathyResponse } from '../services/geminiService';
import { Send, User, Bot, Loader2, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';

const AIListener = () => {
  const [isAiEnabled, setIsAiEnabled] = useState<boolean>(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'model',
      content: '你好。我知道你很累。在这里，你可以放下所有的防备。告诉我，今天发生了什么？或者仅仅是发泄一下，我都在听。',
      timestamp: Date.now()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/gemini', { method: 'GET', signal: controller.signal })
      .then(async (r) => {
        if (!r.ok) return false;
        const data = await r.json().catch(() => null);
        return Boolean(data?.ok);
      })
      .then((ok) => setIsAiEnabled(ok))
      .catch(() => setIsAiEnabled(false));

    return () => controller.abort();
  }, []);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    const container = scrollContainerRef.current;
    if (!container) return;
    if (behavior === 'auto') {
      container.scrollTop = container.scrollHeight;
      return;
    }
    container.scrollTo({ top: container.scrollHeight, behavior });
  };

  useEffect(() => {
    const raf = requestAnimationFrame(() => scrollToBottom('smooth'));
    return () => cancelAnimationFrame(raf);
  }, [messages]);

  const handleSend = async () => {
    if (!isAiEnabled) return;
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await generateEmpathyResponse(userMsg.content);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="py-24 px-4 bg-slate-950 relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[100px] transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-blue-500/10 rounded-full mb-6 ring-1 ring-blue-500/30">
            <Sparkles className="text-blue-400" size={28} />
          </div>
          <h2 className="text-4xl font-bold text-white mb-3 tracking-tight">AI 树洞</h2>
          <p className="text-slate-400 text-lg">这里没有分数，没有排名，只有倾听。</p>
        </div>

        <div className="glass-panel rounded-3xl flex flex-col h-[70vh] min-h-[560px] max-h-[760px] overflow-hidden border border-white/5">
          {/* Chat Window */}
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group`}>
                <div className={`flex max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center border ${msg.role === 'user' ? 'bg-slate-800/70 border-white/10 ml-4' : 'bg-blue-950/40 border-blue-500/20 mr-4 shadow-[0_0_25px_rgba(59,130,246,0.14)]'}`}>
                    {msg.role === 'user' ? <User size={18} className="text-slate-400"/> : <Bot size={18} className="text-blue-400"/>}
                  </div>

                  {/* Bubble */}
                  <div className={`p-5 rounded-2xl text-base leading-relaxed relative ${
                    msg.role === 'user' 
                      ? 'bg-slate-800/70 backdrop-blur-sm text-slate-100 rounded-tr-sm border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.25)]' 
                      : 'bg-gradient-to-br from-blue-950/60 to-slate-900/70 backdrop-blur-sm text-slate-200 rounded-tl-sm border border-blue-500/20 shadow-[0_18px_55px_rgba(0,0,0,0.35)]'
                  }`}>
                    {msg.content}
                    <span className={`absolute top-0 w-2 h-2 ${msg.role === 'user' ? '-right-2 border-l-[10px] border-l-slate-800 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent' : '-left-2 border-r-[10px] border-r-blue-950/80 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent hidden'} `}></span>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-pulse">
                <div className="flex flex-row items-center ml-14 bg-slate-800/50 p-4 rounded-2xl rounded-tl-sm">
                  <div className="flex space-x-1.5">
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 md:p-6 bg-slate-950/40 border-t border-white/5 backdrop-blur-md">
            <div className="relative group">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={isAiEnabled ? "说点什么吧，我在这里..." : "AI 功能未启用（未部署 /api/gemini 或 GEMINI_API_KEY 未配置）"}
                className="w-full bg-slate-900/60 text-slate-200 placeholder-slate-500 rounded-2xl pl-5 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/25 border border-white/10 transition-all resize-none h-16 shadow-inner"
                disabled={!isAiEnabled || isLoading}
              />
              <button 
                onClick={handleSend}
                disabled={!isAiEnabled || !input.trim() || isLoading}
                className="absolute right-3 top-3 p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all shadow-[0_0_18px_rgba(37,99,235,0.22)] hover:shadow-[0_0_28px_rgba(37,99,235,0.35)]"
              >
                {isLoading ? <Loader2 size={20} className="animate-spin"/> : <Send size={20} />}
              </button>
            </div>
            <p className="text-xs text-slate-600 mt-3 text-center flex items-center justify-center gap-2 opacity-70">
              <Bot size={12} />
              AI回复仅供情感支持，不能替代专业心理咨询
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIListener;
