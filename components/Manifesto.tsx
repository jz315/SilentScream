import React, { useState, useEffect, useRef } from 'react';
import { Feather } from 'lucide-react';

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
  const [signedCount, setSignedCount] = useState(14892); 
  const [hasSigned, setHasSigned] = useState(false);
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

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
        }, 800);
      }
    }, { threshold: 0.2 });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [visibleLines]);

  useEffect(() => {
    const signed = localStorage.getItem('dawn_manifesto_signed');
    if (signed) {
      setHasSigned(true);
      setVisibleLines(MANIFESTO_TEXT.length);
    }
  }, []);

  const handleSign = () => {
    if (hasSigned) return;
    setHasSigned(true);
    setSignedCount(prev => prev + 1);
    localStorage.setItem('dawn_manifesto_signed', 'true');
    if (navigator.vibrate) navigator.vibrate([50]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#050505] relative border-t border-neutral-900/30">
      <div className="max-w-3xl w-full mx-auto relative z-10 flex flex-col items-center">
        
        <div className="mb-16 opacity-40">
           <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-neutral-400 to-transparent mx-auto"></div>
        </div>

        <h2 className="text-3xl md:text-4xl font-serif font-medium text-neutral-300 mb-20 tracking-widest text-center uppercase">
          Declaration
        </h2>

        {/* The Manifesto Text */}
        <div 
          ref={containerRef}
          className="mb-24 text-center space-y-10 font-serif"
        >
          {MANIFESTO_TEXT.map((line, index) => (
            <p 
              key={index} 
              className={`text-xl md:text-3xl leading-relaxed text-neutral-400 transition-all duration-1000 ease-out transform ${
                index < visibleLines 
                  ? 'opacity-100 translate-y-0 blur-0' 
                  : 'opacity-0 translate-y-12 blur-sm'
              } ${index === MANIFESTO_TEXT.length - 1 ? 'text-neutral-100 pt-10 font-bold' : ''}`}
            >
              {line}
            </p>
          ))}
        </div>

        {/* Action Area */}
        <div className={`transition-all duration-1000 delay-500 ${visibleLines === MANIFESTO_TEXT.length ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <button
            onClick={handleSign}
            disabled={hasSigned}
            className={`group relative flex items-center gap-4 px-10 py-4 transition-all duration-500 border ${
              hasSigned 
                ? 'border-neutral-800 text-neutral-600 cursor-default' 
                : 'border-neutral-600 text-neutral-300 hover:border-neutral-200 hover:text-white hover:bg-neutral-900/30'
            }`}
          >
            <Feather size={18} className={`transition-transform duration-500 ${hasSigned ? '' : 'group-hover:-translate-y-1 group-hover:translate-x-1'}`} />
            <span className="font-serif tracking-widest text-sm uppercase">
              {hasSigned ? 'Signed' : 'Sign Declaration'}
            </span>
          </button>

          <div className="mt-8 text-center">
             <div className="text-xs font-mono text-neutral-700 tracking-[0.2em]">
               {signedCount.toLocaleString()} WITNESSES
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manifesto;