import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine, Label } from 'recharts';
import { AlertTriangle, ShieldAlert, BrainCircuit, Activity } from 'lucide-react';

const sleepData = [
  { name: '小学生', hours: 9.5, recommended: 10 },
  { name: '初中生', hours: 7.0, recommended: 9 },
  { name: '高中生', hours: 5.5, recommended: 8 }, // The stark contrast
  { name: '成年人', hours: 7.2, recommended: 7.5 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-4 rounded-lg shadow-xl animate-fade-in-up">
        <p className="text-slate-300 font-bold mb-2">{label}</p>
        <p className="text-blue-400">平均睡眠: <span className="font-mono text-xl text-white">{payload[0].value}h</span></p>
        <p className="text-slate-500 text-xs mt-1">推荐: {payload[0].payload.recommended}h</p>
      </div>
    );
  }
  return null;
};

// Animated Counter Component
const CountUp = ({ end, duration = 2000, suffix = '' }: { end: number, duration?: number, suffix?: string }) => {
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
            
            setCount(Number((end * easeOut).toFixed(1)));

            if (progress < duration) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);

    return <span>{count}{suffix}</span>;
};


const DataVisuals: React.FC = () => {
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
    <div className="py-24 bg-slate-950 border-y border-slate-900 relative overflow-hidden" onMouseMove={handleMouseMove}>
       {/* Background Decoration */}
       <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-blue-900/5 to-transparent pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <h2 className="text-4xl font-bold text-center mb-6 text-slate-100 animate-fade-in-up">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-slate-400">数据不说谎</span>
        </h2>
        <p className="text-center text-slate-400 mb-16 max-w-2xl mx-auto text-lg font-light leading-relaxed animate-fade-in-up animation-delay-200">
          当睡眠成为一种奢求，健康就成了代价。<br/>对比不同群体的平均睡眠时间，高中生的现状令人触目惊心。
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          
          {/* Chart 1: Sleep Comparison */}
          <div className="glass-panel spotlight-card p-8 rounded-2xl flex flex-col animate-fade-in-up animation-delay-200 border border-white/5">
            <h3 className="text-xl font-bold mb-8 text-slate-200 flex items-center gap-3">
              <Activity className="text-blue-500" />
              日均睡眠时长对比 (小时)
            </h3>
            <div className="flex-grow min-h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sleepData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <XAxis type="number" domain={[0, 12]} stroke="#475569" tick={{fill: '#94a3b8'}} />
                  <YAxis dataKey="name" type="category" stroke="#475569" width={60} tick={{fill: '#cbd5e1', fontWeight: 500}} />
                  <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                  <ReferenceLine x={8} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.7}>
                    <Label value="健康红线 (8h)" position="insideTopRight" fill="#f87171" fontSize={12} offset={10}/>
                  </ReferenceLine>
                  <Bar dataKey="hours" radius={[0, 4, 4, 0]} barSize={32} animationDuration={1500}>
                    {sleepData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.name === '高中生' ? '#ef4444' : '#3b82f6'} 
                        className={entry.name === '高中生' ? 'filter drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'opacity-80'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-600 mt-6 text-right font-mono">* 数据来源：2023年中国青少年睡眠健康白皮书 (汇总整理)</p>
          </div>

          {/* Infographic Section */}
          <div className="flex flex-col gap-6 animate-fade-in-up animation-delay-400">
            <div className="glass-panel spotlight-card p-8 rounded-2xl border-l-4 border-red-500 flex-grow hover:bg-slate-900/60 transition-colors duration-500 border-white/5">
              <h4 className="text-red-400 font-bold text-xl mb-6 flex items-center gap-2">
                <AlertTriangle className="animate-pulse" />
                生理与心理的双重透支
              </h4>
              <ul className="space-y-6">
                <li className="flex items-start gap-4 group">
                  <div className="p-3 bg-slate-900 rounded-lg text-red-500 group-hover:bg-red-900/20 group-hover:scale-110 transition-all duration-300 ring-1 ring-white/5">
                    <ShieldAlert size={24} />
                  </div>
                  <div>
                    <strong className="text-slate-200 block text-lg mb-1">
                        抑郁风险增加 <span className="text-red-500"><CountUp end={3.5} suffix="倍" /></span>
                    </strong>
                    <span className="text-slate-400 text-sm leading-relaxed">睡眠不足与青少年抑郁症有直接强相关，情绪调节能力显著下降。</span>
                  </div>
                </li>
                <li className="flex items-start gap-4 group">
                  <div className="p-3 bg-slate-900 rounded-lg text-blue-500 group-hover:bg-blue-900/20 group-hover:scale-110 transition-all duration-300 ring-1 ring-white/5">
                     <Activity size={24} />
                  </div>
                  <div>
                    <strong className="text-slate-200 block text-lg mb-1">免疫力断崖式下跌</strong>
                    <span className="text-slate-400 text-sm leading-relaxed">长期熬夜导致身体处于慢性炎症状态，易感冒、过敏。</span>
                  </div>
                </li>
                <li className="flex items-start gap-4 group">
                  <div className="p-3 bg-slate-900 rounded-lg text-purple-500 group-hover:bg-purple-900/20 group-hover:scale-110 transition-all duration-300 ring-1 ring-white/5">
                    <BrainCircuit size={24} />
                  </div>
                  <div>
                    <strong className="text-slate-200 block text-lg mb-1">记忆力受损</strong>
                    <span className="text-slate-400 text-sm leading-relaxed">大脑海马体缺乏修复时间，反而降低学习效率，形成恶性循环。</span>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="p-8 rounded-2xl bg-gradient-to-br from-red-950/40 to-slate-900 border border-red-900/30 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
              <div className="absolute top-0 right-0 p-10 bg-red-500/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
              <p className="text-xl italic font-serif text-slate-300 leading-relaxed relative z-10 group-hover:text-white transition-colors duration-500">
                "我看过凌晨1点、2点、3点、4点的城市。不是为了梦想，仅仅是为了完成那一叠永远写不完的试卷。"
              </p>
              <p className="text-right text-red-400/80 mt-4 font-bold text-sm uppercase tracking-widest">— 某重点高中高三学生</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DataVisuals;
