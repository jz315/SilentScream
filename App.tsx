import React from 'react';
import Hero from './components/Hero';
import Timeline from './components/Timeline';
import DataVisuals from './components/DataVisuals';
import Manifesto from './components/Manifesto';
import AIListener from './components/AIListener';
import { ShareCard } from './components/ShareCard';
import Guestbook from './components/Guestbook';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-red-500/30 selection:text-red-200">
      <Hero />
      <Timeline />
      <DataVisuals />
      <Manifesto />
      <AIListener />
      <ShareCard />
      <Guestbook />
      <Footer />
    </div>
  );
};

export default App;