import React, { useState, useEffect } from 'react';
import { Flame, Users, Fingerprint } from 'lucide-react';

const MANIFESTO_TEXT = [
  "我们拒绝成为分数的奴隶。",
  "我们拒绝用健康换取毫无意义的排名。",
  "在这台巨大的绞肉机停止转动之前，",
  "我们发誓：",
  "哪怕在深夜，也要仰望星空。",
  "哪怕被压弯，决不被折断。",
  "我不止是一个学号，我是鲜活的生命。",
  "活着，清醒地活着，就是最大的反抗。"
];

const Manifesto: React.FC = () => {
  const [signedCount, setSignedCount] = useState(14892); // Fake initial seed
  const [hasSigned, setHasSigned] = useState(false);
  const [visibleLines, setVisibleLines] = useState<number>(0);

  // Typewriter effect logic
  useEffect(() => {
    if (visibleLines < MANIFESTO_TEXT.length) {
      const timeout = setTimeout(() => {
        setVisibleLines(prev => prev + 1);
      }, 800); // Speed of line appearance
      return () => clearTimeout(timeout);
    }
  }, [visibleLines]);

  // Load state from local storage
  useEffect(() => {
    const signed = localStorage.getItem('dawn_manifesto_signed');
    if (signed) {
      setHasSigned(true);
      // If user already signed, show all lines immediately
      setVisibleLines(MANIFESTO_TEXT.length);
    }
  }, []);

  const handleSign = () => {
    if (hasSigned) return;
    
    setHasSigned(true);
    setSignedCount(prev => prev + 1);
    localStorage.setItem('dawn_manifesto_signed', 'true');
    
    // Trigger vibration if on mobile
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  return (
    <div className="py-24 px-4 bg-slate-950 relative overflow-hidden border-t border-slate-900">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-900/10 via-slate-950 to-slate-950 pointer-events-none"></div>
      
      <div className="max-w-3xl mx-auto relative z-10 text-center">
        <div className="flex justify-center mb-6">
            <div className={`p-4 rounded-full bg-orange-900/20 border border-orange-700/50 ${hasSigned ? 'shadow-[0_0_50px_rgba(234,88,12,0.5)]' : ''} transition-shadow duration-1000`}>
                <Flame size={40} className={`${hasSigned ? 'text-orange-500 animate-pulse' : 'text-slate-600'}`} fill={hasSigned ? "currentColor" : "none"} />
            </div>
        </div>

        <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-red-400 mb-12 tracking-tight">
          破晓计划
        </h2>

        {/* The Manifesto Text */}
        <div className="bg-slate-900/80 p-8 md:p-12 rounded-2xl border border-slate-800 shadow-2xl mb-10 text-left min-h-[400px] flex flex-col justify-center relative overflow-hidden">
          {/* Paper texture overlay */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')] pointer-events-none"></div>
          
          <div className="space-y-6 font-serif text-lg md:text-2xl leading-relaxed text-slate-300">
            {MANIFESTO_TEXT.map((line, index) => (
              <p 
                key={index} 
                className={`transition-all duration-1000 transform ${
                  index < visibleLines 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-4'
                } ${index === MANIFESTO_TEXT.length - 1 ? 'text-orange-400 font-bold mt-8' : ''}`}
              >
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* Action Area */}
        <div className="flex flex-col items-center space-y-6">
          <button
            onClick={handleSign}
            disabled={hasSigned}
            className={`group relative px-8 py-4 rounded-full font-bold text-lg transition-all duration-500 overflow-hidden ${
              hasSigned 
                ? 'bg-slate-800 text-orange-500 cursor-default ring-2 ring-orange-900/50' 
                : 'bg-gradient-to-r from-orange-700 to-red-800 text-white hover:scale-105 hover:shadow-[0_0_30px_rgba(234,88,12,0.4)]'
            }`}
          >
            <div className="flex items-center gap-3 relative z-10">
              {hasSigned ? <Fingerprint size={24} /> : <Flame size={24} />}
              <span>{hasSigned ? "契约已缔结" : "加入破晓计划"}</span>
            </div>
            {/* Hover Shine Effect */}
            {!hasSigned && (
               <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:animate-[shine_1s_ease-in-out]"></div>
            )}
          </button>

          <div className="flex items-center gap-2 text-slate-500 font-mono text-sm">
            <Users size={16} />
            <span className="tabular-nums">{signedCount.toLocaleString()}</span>
            <span>位清醒者已加入</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manifesto;