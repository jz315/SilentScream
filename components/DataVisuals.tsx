import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine, Label } from 'recharts';

const sleepData = [
  { name: '小学生', hours: 9.5, recommended: 10 },
  { name: '初中生', hours: 7.0, recommended: 9 },
  { name: '高中生', hours: 5.5, recommended: 8 }, // The stark contrast
  { name: '成年人', hours: 7.2, recommended: 7.5 },
];

const DataVisuals: React.FC = () => {
  return (
    <div className="py-20 bg-slate-900 border-y border-slate-800">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4 text-slate-100">数据不说谎</h2>
        <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
          当睡眠成为一种奢求，健康就成了代价。对比不同群体的平均睡眠时间，高中生的现状令人触目惊心。
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Chart 1: Sleep Comparison */}
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 shadow-xl">
            <h3 className="text-xl font-semibold mb-6 text-slate-300 flex items-center">
              <span className="w-2 h-6 bg-blue-500 mr-3 rounded-sm"></span>
              日均睡眠时长对比 (小时)
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sleepData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis type="number" domain={[0, 12]} stroke="#94a3b8" />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" width={60} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                    cursor={{fill: 'transparent'}}
                  />
                  <ReferenceLine x={8} stroke="red" strokeDasharray="3 3">
                    <Label value="健康红线 (8h)" position="insideTopRight" fill="red" fontSize={12}/>
                  </ReferenceLine>
                  <Bar dataKey="hours" radius={[0, 4, 4, 0]}>
                    {sleepData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.name === '高中生' ? '#ef4444' : '#3b82f6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-500 mt-4 text-right">* 数据来源：2023年中国青少年睡眠健康白皮书 (汇总整理)</p>
          </div>

          {/* Infographic Section */}
          <div className="flex flex-col justify-between">
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 mb-6">
              <h4 className="text-red-400 font-bold text-lg mb-2">生理与心理的双重透支</h4>
              <ul className="space-y-3 text-slate-300 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 text-red-500">⚠</span>
                  <span><strong>抑郁风险增加 3.5 倍：</strong> 睡眠不足与青少年抑郁症有直接强相关。</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-red-500">⚠</span>
                  <span><strong>免疫力下降：</strong> 长期熬夜导致身体处于慢性炎症状态。</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-red-500">⚠</span>
                  <span><strong>记忆力受损：</strong> 大脑海马体缺乏修复时间，反而降低学习效率。</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-r from-red-900/20 to-slate-900 p-6 rounded-xl border border-red-900/30">
              <p className="text-xl italic font-serif text-slate-300 leading-relaxed">
                "我看过凌晨1点、2点、3点、4点的城市。不是为了梦想，仅仅是为了完成那一叠永远写不完的试卷。"
              </p>
              <p className="text-right text-slate-500 mt-2">— 某重点高中高三学生</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DataVisuals;