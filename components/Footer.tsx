import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050505] py-20 border-t border-neutral-900/50 text-center relative z-10">
        <div className="flex flex-col items-center justify-center gap-6 mb-8 text-neutral-500">
            <div className="p-3 rounded-full bg-neutral-900/30 border border-neutral-900">
               <Heart size={14} className="text-red-900/50" fill="currentColor"/>
            </div>
            <span className="text-sm font-serif italic tracking-wide text-neutral-400">献给每一个在深夜里独自奋斗的灵魂</span>
        </div>
        <div className="text-neutral-700 text-[10px] font-mono tracking-widest uppercase space-y-2 opacity-60">
            <p>© {new Date().getFullYear()} Silent Scream Project</p>
            <p>Stay Awake, Stay Alive</p>
        </div>
    </footer>
  );
};

export default Footer;
