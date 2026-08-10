import React from 'react';
import { ArrowUp, Terminal, Heart } from 'lucide-react';
import { soundFX } from './SoundEffects';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    soundFX.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-neutral-200 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 bg-white/60 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-neutral-900 flex items-center justify-center text-white shadow-sm">
            <Terminal className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-mono text-neutral-700 font-medium">
            © {new Date().getFullYear()} Creative Portfolio & 3D Lab. Built with React & Three.js.
          </span>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-xs font-mono text-neutral-600 font-medium flex items-center gap-1.5">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-neutral-900 inline fill-neutral-900" />
            <span>& WebGL</span>
          </span>

          <button
            onClick={scrollToTop}
            onMouseEnter={() => soundFX.playHover()}
            title="Back to top"
            className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-900 hover:text-white border border-neutral-300 flex items-center justify-center text-neutral-800 transition-all shadow-sm"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
};
