import React, { useState, useRef, useEffect } from 'react';
import { generateEmpathyResponse } from '../services/geminiService';
import { Send, User, Bot, Loader2, MessageSquare } from 'lucide-react';
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
    <div className="py-24 px-4 bg-[#050505] relative overflow-hidden border-t border-neutral-900/30">
        {/* Decorative background - Subtle */}
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-neutral-900/20 rounded-full blur-[120px] transform -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-screen"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-5 rounded-full mb-8 border border-neutral-800 bg-[#0a0a0a]">
            <MessageSquare className="text-neutral-400" size={24} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-neutral-200 mb-4 tracking-wide">
            Tree Hole
          </h2>
          <p className="text-neutral-500 font-serif text-lg italic">
            这里没有分数，没有排名，只有倾听。
          </p>
        </div>

        <div className="glass-panel rounded-sm flex flex-col h-[70vh] min-h-[560px] max-h-[760px] overflow-hidden border border-white/5 bg-[#0a0a0a]/60 shadow-2xl">
          {/* Chat Window */}
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group`}>
                <div className={`flex max-w-[90%] md:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-sm flex items-center justify-center border ${msg.role === 'user' ? 'bg-neutral-800 border-neutral-700 ml-6' : 'bg-neutral-900 border-neutral-800 mr-6'}`}>
                    {msg.role === 'user' ? <User size={14} className="text-neutral-400"/> : <Bot size={14} className="text-neutral-500"/>}
                  </div>

                  {/* Bubble */}
                  <div className={`py-4 px-6 text-base md:text-lg leading-relaxed font-serif relative transition-all duration-300 ${
                    msg.role === 'user' 
                      ? 'bg-neutral-800/40 text-neutral-200 border border-neutral-700/50 rounded-sm' 
                      : 'bg-transparent text-neutral-300 border-l border-neutral-800 pl-6'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-pulse">
                <div className="flex flex-row items-center ml-16 pl-6 py-4">
                  <div className="flex space-x-2">
                    <div className="w-1.5 h-1.5 bg-neutral-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-1.5 h-1.5 bg-neutral-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1.5 h-1.5 bg-neutral-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 md:p-8 bg-[#0a0a0a] border-t border-neutral-900">
            <div className="relative group max-w-3xl mx-auto">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={isAiEnabled ? "写下你的心事..." : "AI 连接中..."}
                className="w-full bg-neutral-900/30 text-neutral-200 placeholder-neutral-600 rounded-sm pl-4 pr-16 py-4 focus:outline-none focus:bg-neutral-900/50 border-b border-neutral-800 focus:border-neutral-600 transition-all resize-none h-16 font-serif"
                disabled={!isAiEnabled || isLoading}
              />
              <button 
                onClick={handleSend}
                disabled={!isAiEnabled || !input.trim() || isLoading}
                className="absolute right-2 top-3 p-3 text-neutral-500 hover:text-neutral-200 disabled:opacity-30 disabled:hover:text-neutral-500 transition-colors"
              >
                {isLoading ? <Loader2 size={20} className="animate-spin"/> : <Send size={20} strokeWidth={1.5} />}
              </button>
            </div>
            <p className="text-[10px] text-neutral-700 mt-4 text-center flex items-center justify-center gap-2 uppercase tracking-widest">
              <Bot size={10} />
              AI Empathy Support
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIListener;