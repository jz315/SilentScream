import React, { useEffect, useState } from 'react';
import { Clock, Activity, Zap, ChevronDown } from 'lucide-react';

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

  useEffect(() => {
    const container = document.getElementById('app-scroll');
    if (!container) return;

    const onScroll = () => setShowScrollHint(container.scrollTop < 20);
    onScroll();
    container.addEventListener('scroll', onScroll, { passive: true });
    
    return () => {
      container.removeEventListener('scroll', onScroll);
    };
  }, []);

  const scrollToWitness = () => {
    const target = document.getElementById('witness') ?? document.getElementById('ironhouse');
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#050505] isolate">
      {/* Dynamic Background Elements - Subtler, Deeper */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-neutral-900/40 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[900px] h-[900px] bg-neutral-800/20 rounded-full blur-[120px] mix-blend-screen"></div>
        
        {/* Subtle red accent, deep and faint */}
        <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-950/10 rounded-full blur-[100px] mix-blend-screen"></div>

        {/* Floating Time Stamps - Very faint */}
        <div className="absolute top-[15%] left-[5%] text-[8rem] font-serif font-bold text-neutral-900/30 transform rotate-[15deg] blur-sm select-none">
          05:30
        </div>
        <div className="absolute top-[60%] right-[8%] text-[10rem] font-serif font-bold text-neutral-900/30 transform -rotate-[10deg] blur-md select-none">
          23:50
        </div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center">
        
        {/* Decorative Line instead of Icon */}
        <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-neutral-500 to-transparent mb-12 opacity-50"></div>

        {/* Main Title */}
        <h1 className="text-5xl md:text-8xl font-serif font-bold tracking-tight mb-8 leading-[1.1] md:leading-[1.1] text-balance">
          <span className="text-gradient-subtle block md:inline mr-0 md:mr-4">
            被偷走的
          </span>
          <br className="md:hidden" />
          <span className="text-red-700 relative inline-block mix-blend-hard-light filter drop-shadow-lg">
            青春
          </span>
        </h1>

        {/* Subtitle / Manifesto Intro */}
        <p className="text-lg md:text-xl text-neutral-400 font-serif font-light mb-20 leading-relaxed max-w-2xl mx-auto tracking-wide">
          我们不是机器，却在高速运转中逐渐<span className="text-neutral-200 border-b border-red-900/50 pb-0.5 mx-1 italic">失去温度</span>。
          <span className="block mt-8 text-xs text-neutral-200 font-mono tracking-[0.3em] uppercase opacity-60">
            Sleep is a luxury &nbsp;•&nbsp; Silence is rare &nbsp;•&nbsp; Pressure is constant
          </span>
        </p>
        
        {/* Stats Grid - Minimalist */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left max-w-4xl mx-auto">
          {/* Card 1 */}
          <div className="glass-panel p-8 rounded-sm border-l-2 border-l-neutral-700 hover:border-l-neutral-400 transition-all duration-500 group">
            <div className="flex items-center justify-between mb-6 opacity-60 group-hover:opacity-100 transition-opacity">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">Sleep Time</span>
              <Clock size={16} className="text-neutral-500" />
            </div>
            <div className="text-4xl md:text-5xl font-serif font-medium text-neutral-200 mb-2">
              <CountUp end={5.5} suffix="h" decimals={1} duration={2500} />
            </div>
            <p className="text-xs text-neutral-500 font-light leading-relaxed">
              低于国际建议标准 <span className="text-neutral-300">3小时</span>
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-panel p-8 rounded-sm border-l-2 border-l-neutral-700 hover:border-l-neutral-400 transition-all duration-500 group">
            <div className="flex items-center justify-between mb-6 opacity-60 group-hover:opacity-100 transition-opacity">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">School Time</span>
              <Activity size={16} className="text-neutral-500" />
            </div>
            <div className="text-4xl md:text-5xl font-serif font-medium text-neutral-200 mb-2">
              <CountUp end={14} suffix="h+" decimals={0} duration={2000} />
            </div>
            <p className="text-xs text-neutral-500 font-light leading-relaxed">
              超过法定工作时长
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel p-8 rounded-sm border-l-2 border-l-neutral-700 hover:border-l-red-900 transition-all duration-500 group">
            <div className="flex items-center justify-between mb-6 opacity-60 group-hover:opacity-100 transition-opacity">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">Anxiety</span>
              <Zap size={16} className="text-neutral-500" />
            </div>
            <div className="text-4xl md:text-5xl font-serif font-medium text-red-800/90 mb-2">
               <CountUp end={85} suffix="%" decimals={0} duration={1500} />
            </div>
            <p className="text-xs text-neutral-500 font-light leading-relaxed">
              处于中度或重度压力下
            </p>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div
        className={`fixed inset-x-0 bottom-8 z-[60] flex justify-center transition-all duration-700 ${
          showScrollHint ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <button
          onClick={scrollToWitness}
          className="group flex flex-col items-center gap-4 cursor-pointer text-neutral-600 hover:text-neutral-400 transition-colors"
        >
          <span className="text-[10px] tracking-[0.4em] uppercase font-mono group-hover:tracking-[0.6em] transition-all">Begin</span>
          <ChevronDown size={18} className="opacity-40 animate-bounce" />
        </button>
      </div>
    </div>
  );
};

export default Hero;