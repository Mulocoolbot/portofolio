import React from 'react';
import { ArrowUpRight, Sparkles, Cpu } from 'lucide-react';
import { personalInfo } from '../../data/portfolioData';
import { soundFX } from './SoundEffects';

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  return (
    <section id="hero" className="relative min-h-[90vh] flex flex-col justify-center pt-36 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-6xl w-full mx-auto flex flex-col items-start text-left relative">
        
        {/* Badge with Global 3D Inversion */}
        <div className="blend-invert inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/40 text-xs font-mono font-bold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive 3D Web &amp; Creative Developer</span>
        </div>

        {/* Grand Headline with Pixel-Perfect Slice Inversion */}
        <h1 className="blend-invert text-6xl sm:text-8xl lg:text-9xl font-black tracking-tight leading-[0.98] select-none">
          Portofolio <br />
          Mullo<span className="opacity-80 font-light">.3D</span>
        </h1>

        {/* Bio Description with Slice Inversion */}
        <p className="blend-invert mt-8 text-lg sm:text-2xl max-w-2xl font-medium leading-relaxed select-none">
          {personalInfo.bio}
        </p>

        {/* Tech Stack Pills with Slice Inversion */}
        <div className="flex flex-wrap items-center gap-2.5 mt-8">
          {['Three.js', 'React Three Fiber', 'GLSL Shaders', 'TypeScript', 'Tailwind CSS'].map((tech) => (
            <span
              key={tech}
              className="blend-invert px-3.5 py-1.5 rounded-lg border border-white/30 text-xs font-mono font-bold"
            >
              #{tech}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 mt-10 w-full sm:w-auto">
          <button
            onClick={() => {
              soundFX.playClick();
              onNavigate('projects');
            }}
            onMouseEnter={() => soundFX.playHover()}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-neutral-950 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl hover:bg-neutral-800 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Lihat Karya &amp; Proyek</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              onNavigate('lab');
            }}
            onMouseEnter={() => soundFX.playHover()}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white border border-neutral-300 text-neutral-900 hover:text-black font-bold text-sm flex items-center justify-center gap-2 hover:border-neutral-900 transition-all shadow-sm"
          >
            <Cpu className="w-4 h-4 text-neutral-900" />
            <span>Buka 3D Creative Lab</span>
          </button>
        </div>

      </div>

      {/* Stats Bar with Slice Inversion */}
      <div className="max-w-6xl w-full mx-auto mt-20 pt-8 border-t border-neutral-300/60 grid grid-cols-2 md:grid-cols-4 gap-6">
        {personalInfo.stats.map((stat, idx) => (
          <div key={idx} className="flex flex-col items-start">
            <span className="blend-invert text-3xl sm:text-4xl font-black font-sans">
              {stat.value}
            </span>
            <span className="blend-invert text-xs font-mono font-bold mt-1">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
