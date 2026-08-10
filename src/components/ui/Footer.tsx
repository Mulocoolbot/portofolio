import React from 'react';
import { ArrowUp, Terminal, Heart } from 'lucide-react';
import { soundFX } from './SoundEffects';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    soundFX.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-sm">
            <Terminal className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-mono text-white/50 font-medium">
            © {new Date().getFullYear()} Creative Portfolio & 3D Lab. Built with React & Three.js.
          </span>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-xs font-mono text-white/40 font-medium flex items-center gap-1.5">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-cyan-400 inline fill-cyan-400" />
            <span>& WebGL</span>
          </span>

          <button
            onClick={scrollToTop}
            onMouseEnter={() => soundFX.playHover()}
            title="Back to top"
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/30 flex items-center justify-center text-white/50 hover:text-cyan-400 transition-all shadow-sm"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
};
