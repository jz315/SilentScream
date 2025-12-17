import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle, ChevronDown, Activity, Eye, Zap } from 'lucide-react';

// Animated Counter Component
const CountUp = ({ end, duration = 2000, suffix = '', decimals = 0 }: { end: number, duration?: number, suffix?: string, decimals?: number }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - percentage, 3);
            
            setCount(Number((end * easeOut).toFixed(decimals)));

            if (progress < duration) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration, decimals]);

    return <span>{count}{suffix}</span>;
};

const Hero: React.FC = () => {
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const container = document.getElementById('app-scroll');
    if (!container) return;

    const onScroll = () => setShowScrollHint(container.scrollTop < 20);
    onScroll();
    container.addEventListener('scroll', onScroll, { passive: true });
    
    // Random glitch trigger - reduced frequency based on feedback
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 150);
      }
    }, 8000);

    return () => {
      container.removeEventListener('scroll', onScroll);
      clearInterval(interval);
    };
  }, []);

  const scrollToWitness = () => {
    const target = document.getElementById('witness') ?? document.getElementById('ironhouse');
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-950 isolate">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {/* Deep Atmospheric Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-indigo-950/30 rounded-full blur-[100px] mix-blend-screen animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[900px] h-[900px] bg-slate-900/40 rounded-full blur-[100px] mix-blend-screen"></div>
        <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/5 rounded-full blur-[80px] mix-blend-overlay"></div>

        {/* Floating Time Stamps - More scattered and subtle */}
        <div className="absolute top-[15%] left-[5%] text-[6rem] md:text-[10rem] font-bold text-slate-900/80 transform rotate-[15deg] blur-sm opacity-20">
          05:30
        </div>
        <div className="absolute top-[60%] right-[8%] text-[8rem] md:text-[12rem] font-bold text-slate-900/80 transform -rotate-[10deg] blur-md opacity-20">
          23:50
        </div>
        <div className="absolute bottom-[10%] left-[15%] text-[4rem] font-mono text-red-900/20 rotate-90">
          NO SLEEP
        </div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Icon Header */}
        <div className="mb-10 relative group inline-block">
          <div className="absolute inset-0 bg-red-500/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="relative z-10 p-4 border border-red-500/30 rounded-full bg-slate-950/50 backdrop-blur-sm shadow-[0_0_15px_rgba(239,68,68,0.1)]">
            <AlertTriangle size={32} className="text-red-500 animate-pulse" strokeWidth={2} />
          </div>
        </div>

        {/* Main Title */}
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.05] md:leading-[1.05] text-balance">
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-200 to-slate-400 filter drop-shadow-lg block md:inline mr-0 md:mr-4">
            被偷走的
          </span>
          <br className="md:hidden" />
          <span 
            className={`glitch-text text-red-500 relative inline-block ${glitchActive ? 'skew-x-6 scale-105' : ''} transition-transform duration-100`} 
            data-text="青春"
          >
            青春
          </span>
        </h1>

        {/* Subtitle / Manifesto Intro */}
        <p className="text-lg md:text-2xl text-slate-400 font-serif font-light mb-16 leading-relaxed max-w-3xl mx-auto">
          我们不是机器，却在高速运转中逐渐<span className="text-slate-200 border-b border-red-500/50 pb-0.5 mx-1 italic">生锈</span>。
          <span className="block mt-6 text-sm md:text-base text-slate-600 font-sans tracking-[0.2em] uppercase opacity-70">
            Sleep is a luxury &nbsp;•&nbsp; Silence is rare &nbsp;•&nbsp; Pressure is constant
          </span>
        </p>
        
        {/* Stats Grid - Cleaner, clearer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full text-left mt-4 max-w-4xl">
          <div 
            className={`glass-panel p-8 rounded-2xl flex flex-col items-start justify-center transition-all duration-500 group border border-white/5 hover:bg-blue-950/20 hover:border-blue-500/20`}
            style={{ animationDelay: `0ms` }}
          >
            <div className="flex items-center justify-between w-full mb-4">
              <Clock className={`text-blue-400 opacity-80`} size={28} strokeWidth={1.5} />
              <div className={`h-1 w-1 rounded-full text-blue-400 shadow-[0_0_8px_currentColor] bg-current`}></div>
            </div>
            <span className={`text-4xl md:text-6xl font-black text-slate-100 mb-2 tracking-tighter`}>
              <CountUp end={5.5} suffix="h" decimals={1} duration={2500} />
            </span>
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">平均睡眠</span>
            <span className="text-xs text-slate-600 font-medium leading-tight">低于国际建议标准3小时</span>
          </div>

          <div 
            className={`glass-panel p-8 rounded-2xl flex flex-col items-start justify-center transition-all duration-500 group border border-white/5 hover:bg-emerald-950/20 hover:border-emerald-500/20`}
            style={{ animationDelay: `150ms` }}
          >
            <div className="flex items-center justify-between w-full mb-4">
              <Activity className={`text-emerald-400 opacity-80`} size={28} strokeWidth={1.5} />
              <div className={`h-1 w-1 rounded-full text-emerald-400 shadow-[0_0_8px_currentColor] bg-current`}></div>
            </div>
            <span className={`text-4xl md:text-6xl font-black text-slate-100 mb-2 tracking-tighter`}>
               <CountUp end={14} suffix="h+" decimals={0} duration={2000} />
            </span>
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">日均在校</span>
            <span className="text-xs text-slate-600 font-medium leading-tight">超过法定工作时长</span>
          </div>

          <div 
            className={`glass-panel p-8 rounded-2xl flex flex-col items-start justify-center transition-all duration-500 group border border-white/5 hover:bg-red-950/20 hover:border-red-500/20`}
            style={{ animationDelay: `300ms` }}
          >
            <div className="flex items-center justify-between w-full mb-4">
              <Zap className={`text-red-400 opacity-80`} size={28} strokeWidth={1.5} />
              <div className={`h-1 w-1 rounded-full text-red-400 shadow-[0_0_8px_currentColor] bg-current`}></div>
            </div>
            <span className={`text-4xl md:text-6xl font-black text-slate-100 mb-2 tracking-tighter`}>
               <CountUp end={85} suffix="%" decimals={0} duration={1500} />
            </span>
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">焦虑比例</span>
            <span className="text-xs text-slate-600 font-medium leading-tight">处于中度或重度压力下</span>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div
        className={`fixed inset-x-0 bottom-8 z-[60] flex justify-center pb-[env(safe-area-inset-bottom)] transition-all duration-500 ${
          showScrollHint ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <button
          type="button"
          onClick={scrollToWitness}
          className="group flex flex-col items-center gap-3 cursor-pointer text-slate-500 hover:text-slate-300 transition-colors"
          aria-label="Scroll to Witness"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase group-hover:tracking-[0.5em] transition-all duration-300">向下探索</span>
          <ChevronDown size={20} className="animate-bounce opacity-50" />
        </button>
      </div>
    </div>
  );
};

export default Hero;
