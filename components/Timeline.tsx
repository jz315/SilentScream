import React, { useEffect, useRef, useState } from 'react';
import { TimelineEvent } from '../types';
import { Clock, BookOpen, Moon, Coffee, AlertCircle, Zap, Activity } from 'lucide-react';

// 扩展类型以包含中式时辰描述
interface ExtendedEvent extends TimelineEvent {
  chineseTime: string;
  sealChar: string; // 印章字
}

const events: ExtendedEvent[] = [
  { time: '05:45', chineseTime: '卯时 · 破晓', activity: '强制唤醒 / 起床', mood: 'Exhausted', icon: 'clock', sealChar: '困' },
  { time: '06:20', chineseTime: '卯时 · 晨读', activity: '早读 (背诵直到嘶哑)', mood: 'Mechanical', icon: 'book', sealChar: '械' },
  { time: '07:30', chineseTime: '辰时 · 授课', activity: '上午课程 (4节连轴转)', mood: 'Focused', icon: 'book', sealChar: '紧' },
  { time: '12:00', chineseTime: '午时 · 进食', activity: '午餐 (15分钟速食)', mood: 'Rushed', icon: 'coffee', sealChar: '急' },
  { time: '12:40', chineseTime: '午时 · 假寐', activity: '午休 (趴在桌上麻木的手臂)', mood: 'Uncomfortable', icon: 'moon', sealChar: '麻' },
  { time: '13:30', chineseTime: '未时 · 测验', activity: '下午课程 + 测验', mood: 'Draining', icon: 'alert', sealChar: '压' },
  { time: '17:30', chineseTime: '酉时 · 喘息', activity: '晚餐 (被挤压的喘息)', mood: 'Numb', icon: 'coffee', sealChar: '木' },
  { time: '18:15', chineseTime: '酉时 · 题海', activity: '晚自习 (无尽的题海)', mood: 'Stressed', icon: 'book', sealChar: '躁' },
  { time: '22:30', chineseTime: '亥时 · 归巢', activity: '放学回家 / 宿舍洗漱', mood: 'Heavy', icon: 'moon', sealChar: '沉' },
  { time: '23:30', chineseTime: '子时 · 夜战', activity: '家庭作业 (第二轮战斗)', mood: 'Despair', icon: 'book', sealChar: '绝' },
  { time: '00:45', chineseTime: '丑时 · 难眠', activity: '尝试入睡', mood: 'Anxious', icon: 'moon', sealChar: '虑' },
];

interface TimelineItemProps {
  event: ExtendedEvent;
  index: number;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ event, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const getIcon = (iconName: string) => {
    const props = { size: 16, strokeWidth: 1.5 };
    switch (iconName) {
      case 'book': return <BookOpen {...props} />;
      case 'moon': return <Moon {...props} />;
      case 'coffee': return <Coffee {...props} />;
      case 'alert': return <AlertCircle {...props} />;
      default: return <Clock {...props} />;
    }
  };

  return (
    <div 
      ref={ref}
      className={`relative grid grid-cols-[1fr_auto_1fr] gap-4 md:gap-12 w-full max-w-5xl mx-auto group mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
    >
      {/* Left Side: Time Info */}
      <div className="flex flex-col items-end justify-center py-6 text-right relative">
        <span className="font-serif text-xs md:text-sm text-neutral-500 tracking-[0.2em] mb-1 opacity-60">
            {event.chineseTime}
        </span>
        <span className={`font-mono text-2xl md:text-4xl font-light tracking-tighter transition-colors duration-500 ${isVisible ? 'text-neutral-200' : 'text-neutral-800'}`}>
            {event.time}
        </span>
        {/* Decorative thin line sticking out */}
        <div className={`absolute right-0 top-1/2 w-8 h-[1px] bg-neutral-800 -mr-4 md:-mr-12 transition-all duration-700 ${isVisible ? 'scale-x-100' : 'scale-x-0'} origin-right`}></div>
      </div>

      {/* Center: The Axis */}
      <div className="relative flex flex-col items-center">
        {/* The Vertical Line Segment */}
        <div className="h-full w-[1px] bg-neutral-800 group-hover:bg-neutral-700 transition-colors relative">
            {/* The Dot / Node */}
            <div className={`absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border border-neutral-600 bg-[#050505] transition-all duration-500 z-10 ${isVisible ? 'scale-100' : 'scale-0'} group-hover:border-red-900 group-hover:bg-red-950`}></div>
        </div>
      </div>

      {/* Right Side: Content Card */}
      <div className="py-4 pr-4 md:pr-0">
        <div className="relative p-5 border-l border-neutral-900 hover:border-red-900/30 transition-colors duration-500 bg-gradient-to-r from-white/[0.02] to-transparent">
          
          <h3 className="text-base md:text-lg font-serif text-neutral-300 tracking-wider mb-3 group-hover:text-white transition-colors">
            {event.activity}
          </h3>
          
          <div className="flex items-center gap-4">
            <div className="text-neutral-600 group-hover:text-red-800 transition-colors">
                {getIcon(event.icon)}
            </div>
            <div className="h-[1px] w-12 bg-neutral-900"></div>
            
            {/* The "Seal" (Mood) */}
            <div className="relative">
                <div className={`
                    w-8 h-8 flex items-center justify-center border border-red-900/40 rounded-sm 
                    text-red-800 font-serif text-sm bg-red-950/10 select-none
                    group-hover:bg-red-900 group-hover:text-white group-hover:border-red-800
                    transition-all duration-500 transform ${isVisible ? 'scale-100 rotate-0' : 'scale-150 rotate-12 opacity-0'}
                `}>
                    {event.sealChar}
                </div>
                {/* Mood text (English) - subtle subscript */}
                <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] uppercase tracking-widest text-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {event.mood}
                </span>
            </div>
          </div>

          {/* Background Decor - Noise or Texture */}
          <div className="absolute top-0 right-0 p-2 opacity-10 pointer-events-none">
             <span className="font-mono text-[10px] text-neutral-500">LOG_0{index + 1}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Timeline: React.FC = () => {
  return (
    <div id="witness" className="min-h-screen py-32 px-4 bg-[#050505] relative overflow-hidden selection:bg-red-900/30">
       
       {/* Background Elements: Subtle Vertical Lines */}
       <div className="absolute inset-0 flex justify-center pointer-events-none opacity-20">
           <div className="w-[1px] h-full bg-neutral-900 mr-[300px] hidden md:block"></div>
           <div className="w-[1px] h-full bg-neutral-900 ml-[300px] hidden md:block"></div>
       </div>

       {/* Giant Watermark Character */}
       <div className="absolute top-20 left-10 md:left-20 pointer-events-none opacity-[0.03] select-none">
            <span className="font-serif font-bold text-[15rem] leading-none text-white vertical-rl">规训</span>
       </div>

      {/* Header Area */}
      <div className="max-w-5xl mx-auto mb-24 relative z-10 text-center md:text-left pl-0 md:pl-20">
        <div className="inline-flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-4">
                <Activity size={18} className="text-red-900" />
                <span className="text-[10px] md:text-xs font-mono tracking-[0.6em] text-red-900 uppercase">System Status: Critical</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-neutral-200 tracking-widest mt-4">
                <span className="relative inline-block">
                    机械
                    <span className="absolute -top-2 -right-2 w-2 h-2 bg-red-900 rounded-full animate-pulse"></span>
                </span>
                
                <span className="text-neutral-400">的一天</span>
            </h2>
            <p className="text-xs md:text-sm text-neutral-600 font-serif tracking-[0.2em] mt-2 italic max-w-md">
                "时间不仅是容器，更是刑具。"
            </p>
        </div>
      </div>
      
      {/* Timeline Container */}
      <div className="relative max-w-6xl mx-auto">
        {/* Gradient Fade for Line Top/Bottom */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[1px] h-32 bg-gradient-to-b from-transparent to-neutral-800 z-0"></div>
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[1px] h-32 bg-gradient-to-t from-transparent to-neutral-800 z-0"></div>

        {events.map((event, index) => (
          <TimelineItem key={index} event={event} index={index} />
        ))}
        
        {/* End Marker */}
         <div className="flex flex-col items-center justify-center mt-24 opacity-40 hover:opacity-100 transition-opacity duration-500">
            <div className="h-16 w-[1px] bg-neutral-800 mb-4"></div>
            <Zap size={20} className="text-red-900" />
            <span className="text-[10px] font-mono tracking-[0.5em] text-neutral-700 mt-4 uppercase">Cycle Repeats</span>
         </div>
      </div>

      <style>{`
        .vertical-rl {
          writing-mode: vertical-rl;
          text-orientation: upright;
        }
      `}</style>
    </div>
  );
};

export default Timeline;