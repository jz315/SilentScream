import React from 'react';
import { TimelineEvent } from '../types';
import { Clock, BookOpen, Moon, Coffee, AlertCircle } from 'lucide-react';

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

const Timeline: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'book': return <BookOpen size={20} />;
      case 'moon': return <Moon size={20} />;
      case 'coffee': return <Coffee size={20} />;
      case 'alert': return <AlertCircle size={20} />;
      default: return <Clock size={20} />;
    }
  };

  return (
    <div className="py-20 px-4 bg-slate-950">
      <h2 className="text-3xl font-bold text-center mb-16 text-slate-100">
        <span className="border-b-4 border-red-600 pb-2">机械的一天</span>
      </h2>
      
      <div className="max-w-3xl mx-auto relative">
        {/* Vertical Line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-700 transform md:-translate-x-1/2"></div>

        {events.map((event, index) => (
          <div key={index} className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
            {/* Dot */}
            <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-slate-500 border-4 border-slate-900 transform -translate-x-1/2 z-10"></div>
            
            {/* Content Spacer for responsive alignment */}
            <div className="hidden md:block w-1/2"></div>
            
            {/* Card */}
            <div className={`ml-16 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
              <div className="bg-slate-900 p-5 rounded-lg border border-slate-800 shadow-lg hover:border-slate-600 transition-colors group">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-red-400 font-bold text-lg">{event.time}</span>
                  <div className="text-slate-500 group-hover:text-blue-400 transition-colors">
                    {getIcon(event.icon)}
                  </div>
                </div>
                <h3 className="text-lg font-medium text-slate-200 mb-1">{event.activity}</h3>
                <span className="inline-block px-2 py-0.5 text-xs rounded bg-slate-800 text-slate-400 border border-slate-700">
                  Mood: {event.mood}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;