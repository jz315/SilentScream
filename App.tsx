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
    // Keep the ref for potential future use; no auto-scroll on awaken.
  }, [isAwakened]);

  return (
    <div
      id="app-scroll"
      className={`h-screen overflow-y-scroll bg-[#050505] text-neutral-200 font-sans antialiased tracking-wide scroll-smooth ${isAwakened ? 'snap-none' : 'snap-y snap-mandatory'
        }`}
    >
      <div className="vignette" />

      <section className="snap-start h-screen w-full relative">
        <Hero />
      </section>

      <section ref={timelineRef} className="snap-start min-h-screen w-full relative">
        <Timeline />
      </section>

      <section id="ironhouse" className="snap-start h-screen w-full relative">
        <IronHouse onBreak={() => setIsAwakened(true)} />
      </section>

      {isAwakened && (
        <>


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
