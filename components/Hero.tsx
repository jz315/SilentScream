import React, { useEffect, useState } from 'react';
import { ChevronDown, MoveRight } from 'lucide-react';

interface HeroProps {
  onAdvance?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onAdvance }) => {
  const [showScrollHint, setShowScrollHint] = useState(true);

  useEffect(() => {
    const onScroll = () => setShowScrollHint(window.scrollY < 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToWitness = () => {
    if (onAdvance) {
      onAdvance();
      return;
    }
    document.getElementById('witness')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#050505] text-[#e5e5e5] overflow-hidden selection:bg-red-900 selection:text-white">
      
      {/* 极简背景：仅一道微弱的垂直光带，像铁屋子的裂缝 */}
      <div className="absolute left-[15%] top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-[#1a1a1a] to-transparent opacity-50"></div>

      {/* 右侧纵向装饰文字：更细、更暗，像注脚 */}
      <div className="absolute right-8 md:right-12 top-1/2 -translate-y-1/2 hidden lg:block">
        <p className="writing-vertical-rl text-[#555] font-serif text-[15px] tracking-[1.2em] leading-none select-none uppercase">
          倘若有了余力，我们就该呐喊。
        </p>
      </div>

      <div className="relative z-10 w-full max-w-7xl px-8 md:px-16 grid grid-cols-12 gap-0 items-center">
        
        {/* --- 左侧主视觉区 --- */}
        <div className="col-span-12 lg:col-span-7 flex flex-col items-start">
            
            {/* 上标：精致的分类感 */}
            <div className="flex items-center gap-3 mb-8 opacity-40">
                <span className="text-[10px] font-mono tracking-[0.5em] uppercase text-red-800 font-bold">Document 01</span>
                <div className="w-8 h-[1px] bg-[#333]"></div>
            </div>

            {/* 标题组合：不再是巨大色块，而是结构化的汉字 */}
            <div className="relative mb-16">
                <h2 className="text-2xl md:text-3xl font-serif font-light text-[#555] tracking-[0.4em] mb-4 italic ml-1">
                    被偷走的
                </h2>
                
                {/* 
                   字号缩小到 8xl-10xl，保留宋体（Serif）锐利的勾和撇
                */}
                <h1 className="text-7xl md:text-[8rem] lg:text-[10rem] font-serif font-bold leading-[1] tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                    青春
                </h1>
            </div>

            {/* 行动与文案：紧凑排布 */}
            <div className="flex flex-col md:flex-row items-start md:items-end gap-10">
                <button 
                    onClick={scrollToWitness}
                    className="group relative flex items-center gap-6 bg-white text-black px-8 py-4 transition-all duration-700 hover:bg-red-900 hover:text-white"
                >
                    <span className="font-serif text-lg font-bold tracking-[0.3em]">继续</span>
                    <MoveRight className="group-hover:translate-x-2 transition-transform duration-500" size={20} />
                </button>
                
                <div className="max-w-[280px] border-l border-[#222] pl-6 py-1">
                    <p className="text-xs md:text-sm text-[#777] font-serif leading-relaxed italic">
                        “我们的青春<br/>
                        迷失在题海和学校里”
                    </p>
                </div>
            </div>
        </div>

        {/* --- 右侧数据区：更冷静、更像病历档案 --- */}
        <div className="col-span-12 lg:col-span-5 flex flex-col justify-end items-end mt-24 lg:mt-0">
            <div className="grid grid-cols-1 gap-12 w-full max-w-[280px]">
                
                {/* 数据项 1 */}
                <div className="group border-b border-[#151515] pb-6 hover:border-neutral-700 transition-colors">
                    <div className="flex justify-between items-baseline mb-3">
                        <span className="text-[10px] font-serif text-[#444] tracking-[0.3em] uppercase group-hover:text-neutral-300 transition-colors">睡眠</span>
                        <span className="text-4xl font-serif text-[#eee]">不足6<span className="text-xs ml-1 text-[#444]">小时</span></span>
                    </div>
                    <div className="h-[2px] w-full bg-[#111] overflow-hidden">
                        <div className="h-full bg-neutral-800 w-[35%]"></div>
                    </div>
                </div>

                {/* 数据项 2 */}
                <div className="group border-b border-[#151515] pb-6 hover:border-neutral-700 transition-colors">
                    <div className="flex justify-between items-baseline mb-3">
                        <span className="text-[10px] font-serif text-[#444] tracking-[0.3em] uppercase group-hover:text-neutral-300 transition-colors">学习时间</span>
                        <span className="text-4xl font-serif text-[#eee]">大于14<span className="text-xs ml-1 text-[#444]">小时</span></span>
                    </div>
                    <div className="h-[2px] w-full bg-[#111] overflow-hidden">
                        <div className="h-full bg-neutral-800 w-[85%]"></div>
                    </div>
                </div>

                {/* 数据项 3 */}
                <div className="group">
                    <div className="flex justify-between items-baseline mb-3">
                        <span className="text-[10px] font-serif text-red-900/60 tracking-[0.3em] uppercase font-bold">压力</span>
                        <span className="text-5xl font-serif text-red-800">85%</span>
                    </div>
                    <div className="h-[2px] w-full bg-[#1a0505] overflow-hidden">
                        <div className="h-full bg-red-900 w-[85%] animate-pulse"></div>
                    </div>
                </div>

            </div>
        </div>

      </div>
      
      {/* 底部引导 */}
      <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 transition-all duration-1000 ${showScrollHint ? 'opacity-20' : 'opacity-0'}`}>
         <div className="flex flex-col items-center gap-2">
            <span className="text-[8px] tracking-[0.5em] text-[#666] uppercase">Scroll</span>
            <div className="w-[1px] h-8 bg-gradient-to-b from-white to-transparent"></div>
         </div>
      </div>

      <style>{`
        .writing-vertical-rl {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </div>
  );
};

export default Hero;
