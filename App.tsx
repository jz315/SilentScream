import React from 'react';
import Hero from './components/Hero';
import IronHouse from './components/IronHouse';
import Timeline from './components/Timeline';
import DataVisuals from './components/DataVisuals';
import Manifesto from './components/Manifesto';
import AIListener from './components/AIListener';
import { ShareCard } from './components/ShareCard';
import Guestbook from './components/Guestbook';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [isAwakened, setIsAwakened] = React.useState(false);
  const timelineRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (isAwakened && timelineRef.current) {
      // Small delay to allow DOM to update and IronHouse animation to play
      setTimeout(() => {
        timelineRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 2000);
    }
  }, [isAwakened]);

  return (
    <div
      id="app-scroll"
      className={`h-screen overflow-y-scroll bg-slate-950 text-slate-200 font-sans antialiased tracking-[-0.01em] selection:bg-red-500/30 selection:text-red-200 scroll-smooth ${
        isAwakened ? 'snap-none' : 'snap-y snap-mandatory'
      }`}
    >
      <div className="vignette" />
      
      <section className="snap-start h-screen w-full relative">
        <Hero />
      </section>

      <section id="ironhouse" className="snap-start h-screen w-full relative">
        <IronHouse onBreak={() => setIsAwakened(true)} />
      </section>

      {isAwakened && (
        <>
          <section ref={timelineRef} className="snap-start min-h-screen w-full relative">
            <Timeline />
          </section>
          
          <section className="snap-start min-h-screen w-full relative">
            <DataVisuals />
          </section>
          
          <section className="snap-start min-h-screen w-full relative">
            <Manifesto />
          </section>
          
          <section className="snap-start min-h-screen w-full relative">
            <AIListener />
          </section>
          
          <div className="snap-start">
             <ShareCard />
             <Guestbook />
             <Footer />
          </div>
        </>
      )}
    </div>
  );
};

export default App;
