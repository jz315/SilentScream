import React, { useState, useRef, useEffect } from 'react';
import { generateEmpathyResponse } from '../services/geminiService';
import { MessageSquare, Send, User, Bot, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';

const AIListener = () => {
  const isAiEnabled = Boolean(process.env.API_KEY);
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
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
    <div className="py-20 px-4 bg-slate-950 relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-full mb-4">
            <MessageSquare className="text-blue-400" size={24} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">AI 树洞</h2>
          <p className="text-slate-400">这里没有分数，没有排名，只有倾听。</p>
        </div>

        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl flex flex-col h-[600px]">
          {/* Chat Window */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-slate-700 ml-3' : 'bg-blue-900/50 mr-3'}`}>
                    {msg.role === 'user' ? <User size={16} className="text-slate-300"/> : <Bot size={16} className="text-blue-400"/>}
                  </div>

                  {/* Bubble */}
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-slate-800 text-slate-100 rounded-tr-none border border-slate-700' 
                      : 'bg-blue-950/30 text-slate-200 rounded-tl-none border border-blue-900/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex flex-row items-center ml-11">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-slate-900/50 border-t border-slate-800 rounded-b-2xl">
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={isAiEnabled ? "说点什么吧，我在这里..." : "AI 功能未启用（GEMINI_API_KEY 未配置）"}
                className="w-full bg-slate-800 text-slate-200 placeholder-slate-500 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none h-14"
                disabled={!isAiEnabled || isLoading}
              />
              <button 
                onClick={handleSend}
                disabled={!isAiEnabled || !input.trim() || isLoading}
                className="absolute right-2 top-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
              >
                {isLoading ? <Loader2 size={18} className="animate-spin"/> : <Send size={18} />}
              </button>
            </div>
            <p className="text-xs text-slate-600 mt-2 text-center">
              * AI回复仅供情感支持，不能替代专业心理咨询。如果你处于危机中，请立即寻求专业帮助。
            </p>
            {!isAiEnabled && (
              <p className="text-xs text-slate-600 mt-2 text-center">
                如需开启 AI，请在 `.env.local`（本地）或 Vercel 环境变量（部署）设置 `GEMINI_API_KEY`。
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIListener;
