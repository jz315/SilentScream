import React, { useState, useEffect, useRef } from 'react';
import { Flame, Users, Feather, BookOpen } from 'lucide-react';

const MANIFESTO_TEXT = [
  "我们身处分数的牢笼，",
  "但思想依然自由。",
  "在这巨大的机器轰鸣声中，",
  "我们郑重立约：",
  "拒绝以排名论断人的尊严，",
  "拒绝用健康换取虚幻的数字，",
  "在机械的重复中，保留思考的火种，",
  "不仅要活着，更要清醒地活着。"
];

const Manifesto: React.FC = () => {
  const [signedCount, setSignedCount] = useState(14892); // Fake initial seed
  const [hasSigned, setHasSigned] = useState(false);
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Typewriter effect logic
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && visibleLines === 0) {
        let currentLine = 0;
        const interval = setInterval(() => {
          setVisibleLines(prev => {
            if (prev < MANIFESTO_TEXT.length) return prev + 1;
            clearInterval(interval);
            return prev;
          });
          currentLine++;
          if (currentLine >= MANIFESTO_TEXT.length) clearInterval(interval);
        }, 600);
      }
    }, { threshold: 0.3 });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [visibleLines]);

  // Load state from local storage
  useEffect(() => {
    const signed = localStorage.getItem('dawn_manifesto_signed');
    if (signed) {
      setHasSigned(true);
      setVisibleLines(MANIFESTO_TEXT.length);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleSign = () => {
    if (hasSigned) return;
    
    setHasSigned(true);
    setSignedCount(prev => prev + 1);
    localStorage.setItem('dawn_manifesto_signed', 'true');
    
    // Trigger vibration if on mobile
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50]);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center px-4 bg-slate-950 relative overflow-hidden border-t border-slate-900/50" onMouseMove={handleMouseMove}>
      
      <div className="max-w-4xl w-full mx-auto relative z-10 text-center">
        
        {/* Header Icon */}
        <div className="flex justify-center mb-8">
            <div className={`relative p-5 rounded-full bg-slate-900 border border-slate-700 ${hasSigned ? 'shadow-[0_0_60px_rgba(255,255,255,0.1)]' : ''} transition-all duration-700`}>
                <BookOpen size={32} className={`${hasSigned ? 'text-slate-100' : 'text-slate-500'} transition-colors duration-500`} strokeWidth={1.5} />
            </div>
        </div>

        <h2 className="text-5xl md:text-6xl font-black text-slate-100 mb-16 tracking-tighter">
          独立思考者公约
        </h2>

        {/* The Manifesto Text Card */}
        <div 
          ref={containerRef}
          className="glass-panel p-10 md:p-16 rounded-sm mb-16 text-left min-h-[400px] flex flex-col justify-center relative spotlight-card group border border-slate-800"
        >
          {/* Paper Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.05] bg-repeat mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'4\' height=\'4\' viewBox=\'0 0 4 4\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 3h1v1H1V3zm2-2h1v1H3V1z\' fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }}></div>

          <div className="space-y-8 font-serif text-xl md:text-3xl leading-relaxed text-slate-300 relative z-10 tracking-wide text-center">
            {MANIFESTO_TEXT.map((line, index) => (
              <p 
                key={index} 
                className={`transition-all duration-700 transform ${
                  index < visibleLines 
                    ? 'opacity-100 translate-y-0 blur-0' 
                    : 'opacity-0 translate-y-8 blur-sm'
                } ${index === MANIFESTO_TEXT.length - 1 ? 'text-slate-100 font-bold pt-8 scale-105 origin-center' : ''}`}
              >
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* Action Area */}
        <div className="flex flex-col items-center space-y-8">
          <button
            onClick={handleSign}
            disabled={hasSigned}
            className={`group relative overflow-hidden transition-all duration-500 ${
              hasSigned 
                ? 'bg-transparent text-slate-500 cursor-default px-8 py-4 border border-slate-800 rounded-sm' 
                : 'bg-slate-100 text-slate-900 px-12 py-5 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] rounded-sm'
            }`}
          >
            {/* Button Content */}
            <div className="flex items-center gap-3 relative z-10 font-bold text-lg md:text-xl tracking-wider uppercase">
              {hasSigned ? (
                <>
                  <Feather size={24} className="text-slate-500" />
                  <span className="font-serif italic">已郑重立约</span>
                </>
              ) : (
                <>
                  <Feather size={24} />
                  <span>签署公约</span>
                </>
              )}
            </div>
          </button>

          <div className="flex items-center gap-3 text-slate-500 font-mono text-sm tracking-wider">
            <Users size={14} />
            <span className="tabular-nums text-slate-400">{signedCount.toLocaleString()}</span>
            <span>位觉醒者</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manifesto;
