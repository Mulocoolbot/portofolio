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
          <div className="w-7 h-7 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center text-cyber-cyan">
            <Terminal className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-mono text-slate-400">
            © {new Date().getFullYear()} Creative Portfolio & 3D Lab. Built with React & Three.js.
          </span>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-xs font-mono text-slate-500 flex items-center gap-1.5">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-cyber-pink inline fill-cyber-pink" />
            <span>& WebGL</span>
          </span>

          <button
            onClick={scrollToTop}
            onMouseEnter={() => soundFX.playHover()}
            title="Back to top"
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-cyber-cyan hover:text-black border border-white/10 flex items-center justify-center text-slate-300 transition-all shadow-glass"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
};
