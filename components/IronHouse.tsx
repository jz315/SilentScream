import React, { useState, useRef, useEffect } from 'react';
import { Sun } from 'lucide-react';

const DIALOGUES = [
  { luxun: "从来如此，便对么？", reality: "所有人都补课，我就得补，这真的对吗？" },
  { luxun: "救救孩子……", reality: "谁来救救被题海淹没的我们？" },
  { luxun: "愿中国青年都摆脱冷气，只是向上走。", reality: "我们不想做冷漠的刷题机器，我们要热气腾腾地活着。" },
  { luxun: "真的猛士，敢于直面惨淡的人生。", reality: "哪怕在分数至上的世界里，我也要守住我的灵魂。" },
  { luxun: "不在沉默中爆发，就在沉默中灭亡。", reality: "我不再沉默，我要发出我的声音。" },
];

interface IronHouseProps {
  onBreak?: () => void;
}

const IronHouse: React.FC<IronHouseProps> = ({ onBreak }) => {
  const [hits, setHits] = useState(0);
  const [currentDialogue, setCurrentDialogue] = useState<number>(-1);
  const [isBroken, setIsBroken] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
    }
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#fff';
    }
  }, []);

  const drawLightning = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, displacement: number) => {
    if (displacement < 2) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      return;
    }
    let midX = (x1 + x2) / 2;
    let midY = (y1 + y2) / 2;
    midX += (Math.random() - 0.5) * displacement;
    midY += (Math.random() - 0.5) * displacement;
    drawLightning(ctx, x1, y1, midX, midY, displacement / 1.8);
    drawLightning(ctx, midX, midY, x2, y2, displacement / 1.8);
  };

  const handleStrike = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isBroken) return;

    // Trigger Shake
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 300);

    // Vibration
    if (navigator.vibrate) navigator.vibrate([50, 30, 50]);

    const rect = e.currentTarget.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;

    // Canvas Drawing
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
        // Draw 3 random cracks radiating from touch point
        for (let i = 0; i < 3; i++) {
            const angle = Math.random() * Math.PI * 2;
            const length = 100 + Math.random() * 200;
            const endX = startX + Math.cos(angle) * length;
            const endY = startY + Math.sin(angle) * length;
            drawLightning(ctx, startX, startY, endX, endY, 60);
        }
    }
    
    // Update progress
    const newHits = hits + 1;
    setHits(newHits);

    // Show dialogue
    const dialogueIndex = Math.min(Math.floor(newHits / 3), DIALOGUES.length - 1);
    if (dialogueIndex !== currentDialogue) {
        setCurrentDialogue(dialogueIndex);
    }

    // Trigger break
    if (newHits >= 15) {
      setTimeout(() => {
        setIsBroken(true);
        if (onBreak) onBreak();
      }, 500); // Slight delay for effect
    }
  };

  return (
    <div className="relative h-full w-full bg-black overflow-hidden select-none cursor-crosshair flex items-center justify-center">
       {/* Background Ambience - Broken State */}
       <div className={`absolute inset-0 bg-gradient-to-b from-orange-100 to-sky-300 transition-opacity duration-[2000ms] ${isBroken ? 'opacity-100' : 'opacity-0'} z-0`}></div>

      <div className="w-full h-full relative z-10 px-4 flex flex-col items-center justify-center">
        
        {/* The Iron Box Container */}
        <div 
            ref={containerRef}
            onClick={handleStrike}
            className={`relative w-full max-w-3xl aspect-video bg-neutral-950 border-8 border-neutral-900 shadow-2xl flex flex-col items-center justify-center transition-all duration-1000 ${isBroken ? 'scale-110 opacity-0 pointer-events-none' : 'opacity-100'} ${isShaking ? 'animate-shake-hard' : ''}`}
        >
          {/* Iron Texture */}
          <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <div className="absolute inset-0 bg-black/50 pointer-events-none"></div>

          {/* Canvas for Cracks */}
          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-20 mix-blend-screen" />

          {/* Content Area - Dark State */}
          <div className="relative z-30 text-center px-4">
             <h3 className="text-4xl md:text-6xl font-black text-neutral-800 tracking-tighter uppercase drop-shadow-md select-none">
                {hits === 0 ? "铁屋子" : "打破它"}
             </h3>
             {hits === 0 && (
                <p className="text-neutral-700 mt-4 font-mono text-sm animate-pulse">TAP TO BREAK THE SILENCE</p>
             )}
          </div>

          {/* Dialogue Overlay */}
          {currentDialogue >= 0 && !isBroken && (
            <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none p-8">
                 <div className="flex flex-col gap-8 w-full max-w-2xl">
                    <div key={`d1-${currentDialogue}`} className="bg-black/90 p-6 border-l-4 border-white backdrop-blur-md transform -rotate-1 animate-fade-in-up self-start">
                        <p className="text-2xl md:text-3xl font-serif text-white leading-relaxed">
                            "{DIALOGUES[currentDialogue].luxun}"
                        </p>
                    </div>
                    
                    <div key={`d2-${currentDialogue}`} className="bg-red-950/90 p-6 border-r-4 border-red-500 backdrop-blur-md transform rotate-1 animate-fade-in-up self-end animation-delay-200">
                        <p className="text-xl md:text-2xl text-red-200 font-sans font-bold">
                            {DIALOGUES[currentDialogue].reality}
                        </p>
                    </div>
                 </div>
            </div>
          )}
        </div>

        {/* Broken State Content (Revealed after break) */}
        {isBroken && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-50 animate-scale-in">
                <div className="mb-10 relative">
                     <div className="absolute inset-0 bg-orange-400 blur-[100px] opacity-50 rounded-full animate-pulse"></div>
                     <Sun size={100} className="text-orange-600 relative z-10 animate-spin-slow" />
                </div>
                
                <h2 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter text-slate-900 drop-shadow-2xl">
                    天亮了
                </h2>
                
                <div className="max-w-3xl text-center space-y-8 p-8">
                    <p className="text-2xl md:text-4xl font-serif text-slate-800 leading-relaxed font-bold">
                        "愿中国青年都摆脱冷气，只是向上走。"
                    </p>
                    <div className="h-1 w-20 bg-slate-900 mx-auto"></div>
                    <p className="text-lg md:text-xl text-slate-700 font-sans tracking-wide">
                        既然醒了，就不要再装睡。
                    </p>
                </div>
            </div>
        )}

        {/* Progress Bar */}
        {!isBroken && hits > 0 && (
            <div className="mt-8 w-full max-w-md h-1 bg-neutral-900 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-red-600 transition-all duration-100 ease-out"
                    style={{ width: `${Math.min((hits / 15) * 100, 100)}%` }}
                ></div>
            </div>
        )}

      </div>
    </div>
  );
};

export default IronHouse;
