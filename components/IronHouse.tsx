import React, { useState, useRef, useEffect } from 'react';
import { Sun } from 'lucide-react';

const DIALOGUES = [
  { luxun: "从来如此，便对么？", reality: "无意义的内卷真的有意义吗？" },
  { luxun: "救救孩子……", reality: "谁来救救被题海淹没的我们？" },
  { luxun: "愿中国青年都摆脱冷气，只是向上走。", reality: "我们不想做冷漠的刷题机器，我们要健康！" },
  { luxun: "真的猛士，敢于直面惨淡的人生。", reality: "哪怕在分数至上的世界里，也要守住灵魂。" },
  { luxun: "不在沉默中爆发，就在沉默中灭亡。", reality: "我不再沉默，我要发出我的声音！" },
];

interface IronHouseProps {
  onBreak?: () => void;
}

interface ShardPiece {
  id: string;
  points: string;
  flyX: number;
  flyY: number;
  rotate: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
}

const IronHouse: React.FC<IronHouseProps> = ({ onBreak }) => {
  const totalHits = 15;
  const [hits, setHits] = useState(0);
  const [shards, setShards] = useState<ShardPiece[]>([]);
  const [currentDialogue, setCurrentDialogue] = useState<number>(-1);
  const [isBroken, setIsBroken] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [showCommand, setShowCommand] = useState(false); // 控制“打破它”显示
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const updateCanvasSize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const animate = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current = particlesRef.current.filter(p => p.life > 0);
      particlesRef.current.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.life -= 0.02; p.vy += 0.2;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
      });
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const createParticles = (x: number, y: number) => {
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;
      particlesRef.current.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        size: 1 + Math.random() * 2,
        color: Math.random() > 0.5 ? '#fbbf24' : '#ffffff'
      });
    }
  };

  const createShard = (x: number, y: number, rect: DOMRect): ShardPiece => {
    const sideCount = Math.floor(3 + Math.random() * 3);
    const radius = 40 + Math.random() * 60;
    const points = Array.from({ length: sideCount }, (_, i) => {
      const angle = (i * Math.PI * 2) / sideCount + Math.random();
      const px = Math.max(0, Math.min(rect.width, x + Math.cos(angle) * radius));
      const py = Math.max(0, Math.min(rect.height, y + Math.sin(angle) * radius));
      return `${((px / rect.width) * 100).toFixed(2)}% ${((py / rect.height) * 100).toFixed(2)}%`;
    }).join(', ');

    return {
      id: Math.random().toString(36),
      points,
      flyX: (Math.random() - 0.5) * 400,
      flyY: (Math.random() - 0.5) * 400,
      rotate: (Math.random() - 0.5) * 360,
    };
  };

  const handleStrike = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isBroken) return;

    // 第一次点击：显示“打破它”，隐藏初始标题
    if (hits === 0) {
      setShowCommand(true);
      setTimeout(() => setShowCommand(false), 1200);
    }

    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 100);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setShards(prev => [...prev, createShard(x, y, rect)]);
    createParticles(x, y);

    const newHits = hits + 1;
    setHits(newHits);

    const dialogueIndex = Math.floor(newHits / 3);
    if (dialogueIndex !== currentDialogue && dialogueIndex < DIALOGUES.length) {
      setCurrentDialogue(dialogueIndex);
    }

    if (newHits >= totalHits) {
      setTimeout(() => {
        setIsBroken(true);
        if (onBreak) onBreak();
      }, 500);
    }
  };

  return (
    <div className="relative h-full w-full bg-[#050505] overflow-hidden select-none cursor-crosshair flex items-center justify-center">
      <style>{`
        @keyframes fade-in-blur {
          0% { opacity: 0; filter: blur(20px); transform: translateY(10px) scale(0.9); }
          100% { opacity: 1; filter: blur(0); transform: translateY(0) scale(1); }
        }
        @keyframes slide-in-right {
          0% { opacity: 0; transform: translateX(30px); filter: brightness(2); }
          100% { opacity: 1; transform: translateX(0); filter: brightness(1); }
        }
        @keyframes command-flash {
          0% { opacity: 0; transform: scale(0.7); filter: blur(15px); }
          15% { opacity: 1; transform: scale(1.1); filter: blur(0px); }
          100% { opacity: 0; transform: scale(1.3); filter: blur(10px); }
        }
        @keyframes shake-hard {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-4px, 4px); }
          50% { transform: translate(4px, -4px); }
          75% { transform: translate(-4px, -4px); }
        }
        .animate-fade-in-blur { animation: fade-in-blur 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .animate-slide-in-right { animation: slide-in-right 1.5s cubic-bezier(0.22, 1, 0.36, 1) 0.3s forwards; opacity: 0; }
        .animate-command-flash { animation: command-flash 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-shake-hard { animation: shake-hard 0.1s ease-in-out infinite; }
        .vertical-text { writing-mode: vertical-rl; }
      `}</style>

      {/* Background Dawn */}
      <div className={`absolute inset-0 bg-gradient-to-b from-blue-50 via-orange-100 to-white transition-opacity duration-[3000ms] ${isBroken ? 'opacity-100' : 'opacity-0'}`} />

      {/* Main Container */}
      <div
        onClick={handleStrike}
        className={`relative w-full max-w-5xl aspect-video bg-[#0a0a0a] border border-neutral-900 transition-all duration-1000 overflow-hidden 
          ${isBroken ? 'scale-150 opacity-0 pointer-events-none blur-2xl' : 'opacity-100'} 
          ${isShaking ? 'animate-shake-hard' : ''}`}
      >
        {/* Shards Layer */}
        <div className="absolute inset-0 pointer-events-none z-20">
          {shards.map((shard) => (
            <div key={shard.id} className="absolute inset-0">
              <div className="absolute inset-0" style={{ clipPath: `polygon(${shard.points})`, background: 'radial-gradient(circle, #fff 0%, #fbbf24 40%, transparent 80%)', opacity: 0.4 }} />
              <div 
                className="absolute inset-0 bg-[#111] border border-white/5"
                style={{ 
                  clipPath: `polygon(${shard.points})`,
                  transform: `translate(${shard.flyX}px, ${shard.flyY}px) rotate(${shard.rotate}deg)`,
                  transition: 'transform 1.5s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              />
            </div>
          ))}
        </div>

        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-30" />

        {/* Dynamic Titles */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
          {/* 初始状态 */}
          {hits === 0 && !showCommand && (
            <div className="text-center mix-blend-difference">
              <h3 className="text-6xl md:text-8xl font-serif font-bold text-neutral-600 tracking-[0.2em] uppercase">铁屋子</h3>
              <div className="text-2xl md:text-3xl font-serif text-neutral-600 mt-4 tracking-widest italic">——呐喊</div>
              <p className="text-neutral-700 mt-12 font-mono text-xs tracking-[0.5em] animate-pulse">打破一切吧！</p>
            </div>
          )}

          {/* 瞬时指令 */}
          {showCommand && (
            <h3 className="text-7xl md:text-[12rem] font-serif font-black text-white tracking-[0.4em] animate-command-flash">打破它</h3>
          )}
        </div>

        {/* Ethereal Dialogues */}
        {currentDialogue >= 0 && !isBroken && (
          <div className="absolute inset-0 z-40 pointer-events-none">
            <div key={`lx-${currentDialogue}`} className="absolute left-[12%] top-[15%] animate-fade-in-blur vertical-text">
              <p className="text-3xl md:text-5xl font-serif text-neutral-300/70 tracking-[0.3em] leading-relaxed italic drop-shadow-2xl">
                {DIALOGUES[currentDialogue].luxun}
              </p>
            </div>

            <div key={`re-${currentDialogue}`} className="absolute right-[8%] bottom-[25%] max-w-[45%] animate-slide-in-right">
              <div className="relative pl-6">
                <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-red-600/60 to-transparent" />
                <p className="text-xl md:text-2xl font-sans font-light text-red-500/80 tracking-widest leading-relaxed text-right">
                  {DIALOGUES[currentDialogue].reality}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Post-Break State */}
      {isBroken && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-50 animate-fade-in-blur p-8 text-slate-900">
          <div className="mb-12 relative animate-bounce">
            <Sun size={120} className="text-orange-500 opacity-80" strokeWidth={1} />
            <div className="absolute inset-0 bg-orange-400 blur-[100px] opacity-30 -z-10" />
          </div>
          <h2 className="text-6xl md:text-9xl font-serif font-black mb-8 tracking-tighter">天亮了。</h2>
          <div className="space-y-6 text-center">
            <p className="text-xl md:text-3xl font-serif italic text-slate-700">"愿中国青年都摆脱冷气，只是向上走。"</p>
            <p className="text-lg md:text-2xl font-serif text-slate-500 italic">"此后如竟没有炬火：我便是唯一的光。"</p>
          </div>
        </div>
      )}

      {/* Minimal Progress Bar */}
      {!isBroken && hits > 0 && (
        <div className="absolute bottom-12 w-48 h-[1px] bg-neutral-900 overflow-hidden">
          <div 
            className="h-full bg-white/40 transition-all duration-500" 
            style={{ width: `${(hits / totalHits) * 100}%` }} 
          />
        </div>
      )}
    </div>
  );
};

export default IronHouse;