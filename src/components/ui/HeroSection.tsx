import React from 'react';
import { Sparkles } from 'lucide-react';

interface HeroSectionProps {
  activeStep: number;
  onStartExplore: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ activeStep, onStartExplore }) => {
  if (activeStep !== 0) return null;

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-end items-center pb-14 sm:pb-16 px-4 sm:px-6 lg:px-8 select-none pointer-events-none z-10"
    >
      {/* Screen-reader accessible title for SEO */}
      <div className="sr-only">
        <p>WELCOME TO WORLD OF</p>
        <h1>MULLO - Creative Technologist &amp; 3D Web Architect</h1>
      </div>

      {/* Explore Button & Bottom Scroll Indicator */}
      <div className="w-full max-w-5xl flex flex-col items-center gap-3 pointer-events-auto">
        <button
          onClick={onStartExplore}
          className="px-7 py-3 rounded-full bg-white text-black font-mono font-bold text-xs flex items-center gap-2.5 hover:bg-neutral-200 active:scale-95 transition-all shadow-[0_0_25px_rgba(255,255,255,0.4)]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>START SYNAPTIC JOURNEY</span>
        </button>

        <div
          onClick={onStartExplore}
          className="flex flex-col items-center gap-1.5 cursor-pointer mt-1 opacity-60 hover:opacity-100 transition-opacity"
        >
          <span className="text-[10px] font-mono tracking-[0.3em] font-bold text-white/70 uppercase select-none">
            Scroll / Click to enter
          </span>
          <div className="w-4 h-7 rounded-full border-2 border-white/40 flex items-start justify-center p-1">
            <div className="w-1 h-1.5 rounded-full bg-white animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};
