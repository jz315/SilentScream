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
  const [isIronhouseLocked, setIsIronhouseLocked] = React.useState(false);
  const timelineRef = React.useRef<HTMLElement>(null);

  const isScrollLocked = isIronhouseLocked;

  const handleIronhouseEngage = React.useCallback(() => {
    if (isAwakened) return;
    setIsIronhouseLocked(true);
  }, [isAwakened]);

  const handleIronhouseBreak = React.useCallback(() => {
    setIsIronhouseLocked(false);
    setIsAwakened(true);
  }, []);

  return (
    <div
      id="app-scroll"
      className={`h-screen ${isScrollLocked ? 'overflow-y-hidden' : 'overflow-y-scroll'} bg-[#050505] text-neutral-200 font-sans antialiased tracking-wide scroll-smooth`}
    >
      <div className="vignette" />

      <section className="h-screen w-full relative">
        <Hero />
      </section>

      <section ref={timelineRef} className="min-h-screen w-full relative">
        <Timeline />
      </section>

      <section id="ironhouse" className="h-screen w-full relative">
        <IronHouse onEngage={handleIronhouseEngage} onBreak={handleIronhouseBreak} />
      </section>

      {isAwakened && (
        <>


          <section className="min-h-screen w-full relative">
            <DataVisuals />
          </section>

          <section className="min-h-screen w-full relative">
            <Manifesto />
          </section>

          <section className="min-h-screen w-full relative">
            <AIListener />
          </section>

          <div>
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
