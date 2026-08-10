import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles, Layers, Box, Cpu, Eye } from 'lucide-react';
import { Hero3DCanvas } from '../3d/Hero3DCanvas';
import { personalInfo } from '../../data/portfolioData';
import { soundFX } from './SoundEffects';

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const [wireframeMode, setWireframeMode] = useState(false);
  const [geomType, setGeomType] = useState<'icosahedron' | 'torusKnot' | 'wavePlane' | 'quantumCube'>('icosahedron');

  const geometries: { type: 'icosahedron' | 'torusKnot' | 'wavePlane' | 'quantumCube'; label: string }[] = [
    { type: 'icosahedron', label: 'Icosa' },
    { type: 'torusKnot', label: 'Torus' },
    { type: 'wavePlane', label: 'Wave' },
    { type: 'quantumCube', label: 'Tesseract' },
  ];

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Gradients & Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-cyber-purple/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-cyber-cyan/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Column: Typography & CTAs */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-300 mb-6 backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyber-cyan" />
            <span>Interactive 3D Web & Creative Developer</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-white"
          >
            Menciptakan <br />
            <span className="bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple bg-clip-text text-transparent">
              Visual 3D & Web
            </span> <br />
            Masa Depan.
          </motion.h1>

          {/* Subtitle / Bio */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-slate-300 max-w-xl font-light leading-relaxed"
          >
            {personalInfo.bio}
          </motion.p>

          {/* Tech Stack Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center gap-2 mt-6"
          >
            {['Three.js', 'React Three Fiber', 'GLSL', 'TypeScript', 'Tailwind CSS'].map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-md bg-background-surface border border-background-border text-[11px] font-mono text-slate-300 hover:border-cyber-cyan/50 transition-colors"
              >
                #{tech}
              </span>
            ))}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center gap-4 mt-8 w-full sm:w-auto"
          >
            <button
              onClick={() => {
                soundFX.playClick();
                onNavigate('projects');
              }}
              onMouseEnter={() => soundFX.playHover()}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-blue text-black font-semibold text-sm flex items-center justify-center gap-2 shadow-neon-cyan hover:shadow-neon-cyan/80 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Lihat Karya & Proyek</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                soundFX.playClick();
                onNavigate('lab');
              }}
              onMouseEnter={() => soundFX.playHover()}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full glass-panel border border-white/15 text-slate-200 hover:text-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-white/10 hover:border-cyber-cyan/40 transition-all"
            >
              <Cpu className="w-4 h-4 text-cyber-cyan" />
              <span>Buka 3D Creative Lab</span>
            </button>
          </motion.div>
        </div>

        {/* Right Column: 3D Interactive Canvas & Controls */}
        <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
          
          {/* 3D Canvas Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full aspect-square max-w-[460px] relative rounded-3xl glass-panel border border-white/10 overflow-hidden shadow-2xl group"
          >
            {/* Realtime 3D Scene */}
            <Hero3DCanvas
              type={geomType}
              wireframe={wireframeMode}
              color="#00f2fe"
              speed={1.2}
              interactive={true}
            />

            {/* Quick Canvas Overlay Controls */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 border border-white/10 backdrop-blur-md text-[11px] font-mono text-cyber-cyan">
                <Box className="w-3.5 h-3.5" />
                <span>Interactive WebGL 3D</span>
              </div>

              <button
                onClick={() => {
                  soundFX.playClick();
                  setWireframeMode(!wireframeMode);
                }}
                className={`px-3 py-1 rounded-full text-[11px] font-mono transition-all backdrop-blur-md border ${
                  wireframeMode
                    ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan shadow-neon-cyan/40'
                    : 'bg-black/50 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {wireframeMode ? 'Wireframe: ON' : 'Wireframe: OFF'}
              </button>
            </div>

            {/* Bottom Shape Switcher */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-1.5 bg-black/60 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 pointer-events-auto">
              {geometries.map((g) => (
                <button
                  key={g.type}
                  onClick={() => {
                    soundFX.playClick();
                    setGeomType(g.type);
                  }}
                  className={`flex-1 py-1 px-2 rounded-xl text-[11px] font-mono transition-all ${
                    geomType === g.type
                      ? 'bg-cyber-cyan text-black font-bold shadow-neon-cyan/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </motion.div>

          <p className="text-[11px] font-mono text-slate-500 mt-3 flex items-center gap-1.5">
            <Eye className="w-3 h-3 text-cyber-cyan" />
            <span>Gerakkan kursor untuk mengontrol rotasi 3D</span>
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-7xl w-full mx-auto mt-16 pt-10 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6">
        {personalInfo.stats.map((stat, idx) => (
          <div key={idx} className="flex flex-col items-center sm:items-start">
            <span className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              {stat.value}
            </span>
            <span className="text-xs font-mono text-slate-400 mt-1">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
