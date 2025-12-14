import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 py-12 border-t border-slate-900 text-center">
        <div className="flex items-center justify-center gap-2 mb-4 text-slate-500">
            <Heart size={16} className="text-red-900" fill="currentColor"/>
            <span className="text-sm">献给每一个在深夜里独自奋斗的灵魂</span>
        </div>
        <p className="text-slate-700 text-xs">
            © {new Date().getFullYear()} Silent Scream. 请善待自己。<br/>
            我们不是机器，我们是活生生的人。
        </p>
    </footer>
  );
};

export default Footer;