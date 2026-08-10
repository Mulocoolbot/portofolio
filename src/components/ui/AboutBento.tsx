import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Compass, Cpu, Award, Sparkles, Terminal } from 'lucide-react';
import { skillsData, experienceTimeline, personalInfo } from '../../data/portfolioData';

export const AboutBento: React.FC = () => {
  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Section Header with Dynamic 3D Inversion */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="blend-invert inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 text-xs font-mono font-bold mb-4 shadow-sm backdrop-blur-xs">
          <Terminal className="w-3.5 h-3.5" />
          <span>ABOUT &amp; CAPABILITIES</span>
        </div>
        <h2 className="blend-invert text-3xl sm:text-5xl font-extrabold tracking-tight select-none">
          Menyatukan Kode &amp; Kreativitas 3D
        </h2>
        <p className="blend-invert mt-4 max-w-2xl text-sm sm:text-base font-medium select-none">
          Eksplorasi mendalam pada antarmuka web masa depan, simulasi grafis spasial, dan rekayasa frontend yang solid.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Card 1: Philosophy & Bio (8 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="md:col-span-8 glass-panel rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group glass-panel-hover"
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-sm">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono text-white/40 font-semibold">PHILOSOPHY // 01</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
              "Bukan sekadar website biasa, tapi pengalaman digital yang berkesan."
            </h3>
            <p className="text-white/60 leading-relaxed text-sm sm:text-base">
              Di era web modern, pengalaman visual tidak lagi terbatas pada layout 2D statis. Melalui Three.js, WebGL, dan GLSL shaders, saya membangun produk digital dengan kedalaman spasial, animasi dinamis, serta performa ringan 60 FPS di berbagai perangkat.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-mono text-white/60 font-medium">{personalInfo.location}</span>
            </div>
            <span className="text-xs font-mono text-white/80 font-bold">WebGL • Three.js • React • Shaders</span>
          </div>
        </motion.div>

        {/* Card 2: Interactive Stats & Focus (4 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="md:col-span-4 glass-panel rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden glass-panel-hover"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-white/40 font-semibold">CORE FOCUS // 02</span>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white">Spesialisasi Saat Ini:</h4>
            <div className="space-y-2.5">
              {[
                '3D Canvas & Shader Dynamics',
                'Interactive WebGL Sandboxes',
                'Micro-interactions & Sound FX',
                'High Performance Web Apps',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-white/70 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <span className="text-[11px] font-mono text-white/40 font-semibold block">Status:</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 mt-1 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              Siap untuk kolaborasi kreatif
            </span>
          </div>
        </motion.div>

        {/* Card 3: Detailed Technical Skills Matrix (6 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-6 glass-panel rounded-3xl p-8 relative overflow-hidden glass-panel-hover"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Code2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-white/40 font-semibold">TECH ARSENAL // 03</span>
          </div>

          <h4 className="text-lg font-bold text-white mb-6">3D &amp; Frontend Capabilities</h4>

          <div className="space-y-5">
            {skillsData[0].skills.concat(skillsData[1].skills.slice(0, 2)).map((skill, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white/80">{skill.name}</span>
                  <span className="font-mono text-cyan-400 font-bold">{skill.level}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden p-0.5 border border-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-300"
                  />
                </div>
                <p className="text-[11px] text-white/40 font-medium">{skill.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Card 4: Career & Experience Timeline (6 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="md:col-span-6 glass-panel rounded-3xl p-8 relative overflow-hidden glass-panel-hover flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono text-white/40 font-semibold">EXPERIENCE // 04</span>
            </div>

            <h4 className="text-lg font-bold text-white mb-6">Perjalanan Karir &amp; Eksplorasi</h4>

            <div className="relative border-l border-white/15 ml-3 pl-6 space-y-6">
              {experienceTimeline.map((item, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#0a0a0a] border-2 border-cyan-400 group-hover:bg-cyan-400 transition-colors" />
                  
                  <span className="text-xs font-mono text-cyan-400 font-bold">{item.year}</span>
                  <h5 className="text-sm sm:text-base font-bold text-white mt-0.5">{item.role}</h5>
                  <span className="text-xs text-white/50 font-medium block">{item.company}</span>
                  <p className="text-xs text-white/40 mt-2 leading-relaxed">{item.description}</p>
                  
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {item.technologies.map((t) => (
                      <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60 font-medium border border-white/10">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
