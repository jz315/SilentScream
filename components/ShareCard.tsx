import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Copy, Check, Loader2, Link as LinkIcon } from 'lucide-react';
import { toPng } from 'html-to-image';
import { QRCodeCanvas } from 'qrcode.react';

const presets = [
  "我不是不困，我是不敢睡。",
  "凌晨3点的笔尖，划破了谁的青春？",
  "他们说这是为了未来，可我现在已经透支了。",
  "把周末还给我，把睡眠还给我，把我还给我。",
  "这不是教育，这是生存游戏。",
  "我的梦想，被压在五三模拟的第108页。",
  "只要学不死，就往死里学？可我们明明是活人。"
];

const titles = [
  "高三幸存者",
  "缺觉重症患者",
  "题海潜水员",
  "周末失踪人口",
  "00后守夜人"
];

export const ShareCard = () => {
  const [text, setText] = useState(presets[0]);
  const [title, setTitle] = useState(titles[0]);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure we get the client-side URL
    setCurrentUrl(window.location.href);
  }, []);

  const handleRandom = () => {
    const randomText = presets[Math.floor(Math.random() * presets.length)];
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    setText(randomText);
    setTitle(randomTitle);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    if (cardRef.current === null) return;
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, { 
        cacheBust: true, 
        pixelRatio: 2,
        backgroundColor: '#020617'
      });
      const link = document.createElement('a');
      link.download = `silent-scream-survivor-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
      alert('生成图片失败，请手动截图');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="py-20 px-4 bg-slate-900 border-t border-slate-800">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">让世界听见</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            沉默不会带来改变。生成你的“生存诊断单”，保存并分享。
            <br />让更多人看到这不仅是你一个人的战斗。
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start justify-center">
          
          {/* Controls */}
          <div className="w-full md:w-1/3 space-y-6">
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <label className="block text-sm text-slate-400 mb-2">你的身份</label>
              <div className="flex flex-wrap gap-2 mb-6">
                {titles.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTitle(t)}
                    className={`px-3 py-1 text-xs rounded-full border transition-all ${
                      title === t 
                        ? 'bg-red-900/30 border-red-500 text-red-200' 
                        : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <label className="block text-sm text-slate-400 mb-2">你的呐喊</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 text-sm focus:outline-none focus:border-red-500/50 resize-none mb-4"
              />
              
              <button 
                onClick={handleRandom}
                className="w-full flex items-center justify-center gap-2 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors text-sm"
              >
                <RefreshCw size={14} /> 随机生成文案
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={handleDownload}
                disabled={isGenerating}
                className="w-full py-3 bg-red-700 hover:bg-red-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-900/20 disabled:opacity-50"
              >
                {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Camera size={20} />}
                {isGenerating ? "生成中..." : "保存为图片"}
              </button>

              <button 
                onClick={handleCopyLink}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? "链接已复制" : "复制网站链接"}
              </button>
            </div>
          </div>

          {/* The Card (Visual Preview) */}
          <div className="w-full md:w-2/5 flex justify-center">
            <div className="perspective-1000 w-full max-w-sm">
              <div 
                ref={cardRef}
                className="relative mx-auto bg-slate-950 border-8 border-slate-800 p-8 rounded-sm shadow-2xl aspect-[3/5] flex flex-col justify-between overflow-hidden select-none transition-transform md:hover:scale-[1.02] md:hover:rotate-1"
              >
                
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,#334155_1px,transparent_1px)] [background-size:24px_24px]"></div>
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-gradient-to-br from-red-900/10 via-transparent to-blue-900/10"></div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6 border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-red-600 font-black text-2xl tracking-tighter uppercase">WARNING</h3>
                      <p className="text-slate-500 text-[10px] tracking-widest">SYSTEM OVERLOAD</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400 font-mono text-xs">{new Date().toLocaleDateString()}</p>
                      <p className="text-slate-600 font-mono text-[10px]">No. {Math.floor(Math.random() * 99999)}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <span className="inline-block px-2 py-0.5 bg-slate-800 text-slate-300 text-xs font-mono rounded">
                      IDENTITY: {title}
                    </span>
                    <p className="text-2xl md:text-3xl font-serif font-bold text-slate-100 leading-tight break-words">
                      “{text}”
                    </p>
                  </div>
                </div>

                <div className="relative z-10 w-full h-24 bg-gradient-to-t from-red-900/20 to-transparent border-b border-red-900/30 flex items-end justify-center pb-2">
                  <div className="flex gap-1 items-end h-12">
                     {[...Array(20)].map((_, i) => (
                       <div 
                        key={i} 
                        className="w-1 bg-red-800/40" 
                        style={{ height: `${Math.random() * 100}%` }}
                      ></div>
                     ))}
                  </div>
                </div>

                <div className="relative z-10 mt-8 pt-4 border-t-2 border-dashed border-slate-800">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-1">Generated by</p>
                      <p className="text-white font-bold text-sm">Silent Scream</p>
                      <div className="flex items-center gap-1 mt-1 text-[8px] text-slate-400 font-mono">
                        <LinkIcon size={8} />
                        {currentUrl ? new URL(currentUrl).host : 'silent-scream.app'}
                      </div>
                    </div>
                    
                    {/* Real QR Code */}
                    <div className="bg-white p-1.5 rounded-sm">
                        {currentUrl && (
                            <QRCodeCanvas 
                                value={currentUrl}
                                size={48}
                                bgColor={"#ffffff"}
                                fgColor={"#000000"}
                                level={"L"}
                                includeMargin={false}
                            />
                        )}
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                      <p className="text-slate-600 text-[10px]">活着，本身就是一种反抗</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};