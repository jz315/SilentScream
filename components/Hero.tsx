import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900 border-b border-slate-800">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 text-9xl font-bold text-white transform rotate-12">05:30</div>
        <div className="absolute bottom-10 right-10 text-9xl font-bold text-white transform -rotate-12">23:50</div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="flex justify-center mb-6 text-red-500 animate-pulse">
          <AlertTriangle size={48} />
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">
          被偷走的<span className="text-red-500">青春</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 font-light mb-10 leading-relaxed">
          一份关于高中生生存状态的控诉书。<br/>
          <span className="text-slate-500 text-base mt-2 block">
            Sleep is a luxury. Silence is rare. Pressure is constant.
          </span>
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-12 bg-slate-800/50 p-6 rounded-xl border border-slate-700 backdrop-blur-sm">
          <div className="flex flex-col items-center p-4">
            <Clock className="mb-2 text-blue-400" size={32} />
            <span className="text-3xl font-bold text-white">5.5h</span>
            <span className="text-sm text-slate-400">平均睡眠时间</span>
          </div>
          <div className="flex flex-col items-center p-4 border-t md:border-t-0 md:border-l border-slate-700">
            <span className="text-3xl font-bold text-white mb-2">14h+</span>
            <span className="text-sm text-slate-400">日均在校时长</span>
          </div>
          <div className="flex flex-col items-center p-4 border-t md:border-t-0 md:border-l border-slate-700">
            <span className="text-3xl font-bold text-white mb-2">85%</span>
            <span className="text-sm text-slate-400">重度焦虑比例</span>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 animate-bounce text-slate-500">
        <p className="text-sm">向下滚动，直面现实</p>
      </div>
    </div>
  );
};

export default Hero;