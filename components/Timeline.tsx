import React, { useEffect, useRef, useState } from 'react';
import { TimelineEvent } from '../types';
import { Clock, BookOpen, Moon, Coffee, AlertCircle, Zap } from 'lucide-react';

const events: TimelineEvent[] = [
  { time: '05:45', activity: '强制唤醒 / 起床', mood: 'Exhausted', icon: 'clock' },
  { time: '06:20', activity: '早读 (背诵直到嘶哑)', mood: 'Mechanical', icon: 'book' },
  { time: '07:30', activity: '上午课程 (4节连轴转)', mood: 'Focused', icon: 'book' },
  { time: '12:00', activity: '午餐 (15分钟速食)', mood: 'Rushed', icon: 'coffee' },
  { time: '12:40', activity: '午休 (趴在桌上麻木的手臂)', mood: 'Uncomfortable', icon: 'moon' },
  { time: '13:30', activity: '下午课程 + 测验', mood: 'Draining', icon: 'alert' },
  { time: '17:30', activity: '晚餐 (被挤压的喘息)', mood: 'Numb', icon: 'coffee' },
  { time: '18:15', activity: '晚自习 (无尽的题海)', mood: 'Stressed', icon: 'book' },
  { time: '22:30', activity: '放学回家 / 宿舍洗漱', mood: 'Heavy', icon: 'moon' },
  { time: '23:30', activity: '家庭作业 (第二轮战斗)', mood: 'Despair', icon: 'book' },
  { time: '00:45', activity: '尝试入睡', mood: 'Anxious', icon: 'moon' },
];

interface TimelineItemProps {
  event: TimelineEvent;
  index: number;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ event, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -100px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'book': return <BookOpen size={20} />;
      case 'moon': return <Moon size={20} />;
      case 'coffee': return <Coffee size={20} />;
      case 'alert': return <AlertCircle size={20} />;
      default: return <Clock size={20} />;
    }
  };

  const getMoodColor = (mood: string) => {
    const map: {[key: string]: string} = {
      'Exhausted': 'bg-slate-800 text-slate-400 border border-slate-700',
      'Mechanical': 'bg-gray-800 text-gray-300 border border-gray-700',
      'Focused': 'bg-blue-950/30 text-blue-300 border border-blue-900',
      'Rushed': 'bg-orange-950/30 text-orange-300 border border-orange-900',
      'Uncomfortable': 'bg-yellow-950/30 text-yellow-300 border border-yellow-900',
      'Draining': 'bg-red-950/30 text-red-300 border border-red-900',
      'Numb': 'bg-slate-900 text-slate-500 border border-slate-800',
      'Stressed': 'bg-red-950/50 text-red-200 border border-red-800',
      'Heavy': 'bg-purple-950/30 text-purple-300 border border-purple-900',
      'Despair': 'bg-black text-slate-500 border border-slate-800',
      'Anxious': 'bg-indigo-950/30 text-indigo-300 border border-indigo-900',
    };
    return map[mood] || 'bg-slate-800 text-slate-400';
  };

  return (
    <div 
        ref={ref}
        className={`relative flex items-center mb-16 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} group transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
    >
        {/* Dot with Pulse Effect */}
        <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 z-10 flex items-center justify-center">
            <div className={`w-3 h-3 rounded-full bg-slate-950 border border-slate-500 transition-all duration-300 z-10 ${isVisible ? 'scale-100' : 'scale-0'}`}></div>
            {/* Ripple */}
            <div className={`absolute w-8 h-8 rounded-full border border-slate-700 transition-opacity ${isVisible ? 'opacity-0 group-hover:opacity-100 group-hover:animate-ping' : 'opacity-0'}`}></div>
        </div>
        
        {/* Content Spacer */}
        <div className="hidden md:block w-1/2"></div>
        
        {/* Card */}
        <div className={`ml-20 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-20' : 'md:pl-20'}`}>
            <div className="glass-panel spotlight-card p-6 rounded-xl relative hover:-translate-y-1 transition-transform duration-500 border border-white/5">
            
            {/* Connector Line (Horizontal) */}
            <div className={`absolute top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-slate-700 to-transparent w-12 md:w-20 group-hover:from-red-500/50 transition-colors ${index % 2 === 0 ? '-right-12 md:-right-20 rotate-180' : '-left-12 md:-left-20 hidden md:block'} origin-left ${isVisible ? 'scale-x-100' : 'scale-x-0'} duration-1000 delay-300`}></div>
            <div className={`absolute top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-slate-700 to-transparent w-12 group-hover:from-red-500/50 transition-colors md:hidden -left-12 origin-left ${isVisible ? 'scale-x-100' : 'scale-x-0'} duration-1000 delay-300`}></div>

            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                <span className="font-mono text-red-400 font-bold text-xl tracking-wider">{event.time}</span>
                <div className="text-slate-500 group-hover:text-slate-200 transition-colors">
                {getIcon(event.icon)}
                </div>
            </div>
            
            <h3 className="text-lg font-bold text-slate-200 mb-4 tracking-wide">{event.activity}</h3>
            
            <div className="flex items-center justify-between">
                <span className={`inline-block px-3 py-1 text-[10px] uppercase tracking-wider font-semibold rounded-sm ${getMoodColor(event.mood)}`}>
                {event.mood}
                </span>
                <span className="text-[10px] text-slate-700 font-mono">0{index + 1}</span>
            </div>
            </div>
        </div>
    </div>
  );
};

const Timeline: React.FC = () => {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const cards = document.querySelectorAll('.spotlight-card');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
        (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
    });
  };

  return (
    <div id="witness" className="py-24 px-4 bg-slate-950 relative" onMouseMove={handleMouseMove}>
       {/* Ambient Light */}
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-indigo-950/10 rounded-full blur-[100px] pointer-events-none"></div>

      <h2 className="text-4xl md:text-5xl font-black text-center mb-24 text-slate-100 relative z-10">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-500">机械的一天</span>
      </h2>
      
      <div className="max-w-4xl mx-auto relative">
        {/* Gradient Vertical Line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-slate-700 to-transparent transform md:-translate-x-1/2"></div>

        {events.map((event, index) => (
          <TimelineItem key={index} event={event} index={index} />
        ))}
        
        {/* End Marker */}
         <div className="absolute left-8 md:left-1/2 bottom-[-40px] transform -translate-x-1/2 text-slate-800 animate-pulse">
            <Zap size={24} />
         </div>
      </div>
    </div>
  );
};

export default Timeline;
