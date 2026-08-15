import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RotateCcw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { NEURON_STORY_DATA, NeuronStoryItem } from '../../data/neuronStoryData';
import { soundFX } from './SoundEffects';

interface NeuronInfoPanelProps {
  activeStep: number; // 1 to 9
  onNavigateStep: (step: number) => void;
  onCloseToOverview: () => void;
}

export const NeuronInfoPanel: React.FC<NeuronInfoPanelProps> = ({
  activeStep,
  onNavigateStep,
  onCloseToOverview,
}) => {
  if (activeStep < 1 || activeStep > 9) return null;

  const currentItem: NeuronStoryItem = NEURON_STORY_DATA[activeStep - 1] || NEURON_STORY_DATA[0];
  const totalSteps = NEURON_STORY_DATA.length;

  const handlePrev = () => {
    soundFX.playClick();
    if (activeStep > 1) {
      onNavigateStep(activeStep - 1);
    } else {
      onCloseToOverview();
    }
  };

  const handleNext = () => {
    soundFX.playClick();
    if (activeStep < totalSteps) {
      onNavigateStep(activeStep + 1);
    } else {
      onCloseToOverview();
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex flex-col justify-between pt-16 pb-20 px-3.5 sm:px-6 lg:px-8 select-none">
      {/* ── Main Dynamic Story Card (Positioned on the RIGHT, opposite the 3D Neuron on LEFT) ── */}
      <div className="w-full max-w-7xl mx-auto flex justify-end items-center my-auto pointer-events-none">
        <div className="w-full sm:w-[380px] md:w-[410px] lg:w-[480px] xl:w-[540px] pointer-events-auto" data-detail-card="true">
          <AnimatePresence mode="wait">
            <motion.div
              key={`neuron-card-${currentItem.id}`}
              data-detail-card="true"
              onWheel={(e) => e.stopPropagation()}
              initial={{ opacity: 0, x: 35, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -25, scale: 0.97 }}
              transition={{ duration: 0.40, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-3xl bg-black/85 border border-white/20 backdrop-blur-2xl p-5 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.85)] flex flex-col gap-4 sm:gap-5 text-white max-h-[58vh] sm:max-h-[68vh] md:max-h-[74vh] lg:max-h-[80vh] overflow-y-auto custom-scrollbar"
            >
              {/* Card Header */}
              <div className="flex flex-col gap-1.5">
                {/* Main Title */}
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight leading-tight text-white">
                  {currentItem.title}
                </h2>

                {/* Subtitle / Headline Tagline */}
                {currentItem.subtitle && (
                  <p className="text-xs sm:text-sm font-mono font-medium text-cyan-400 tracking-wide mt-0.5">
                    {currentItem.subtitle}
                  </p>
                )}

                {/* Highlight Quote if available */}
                {currentItem.details.highlight && (
                  <div className="mt-2 p-2.5 sm:p-3 rounded-xl bg-white/[0.04] border-l-2 border-cyan-400 border-t border-r border-b border-white/10">
                    <p className="text-xs sm:text-sm font-medium text-white/90 leading-relaxed italic">
                      "{currentItem.details.highlight}"
                    </p>
                  </div>
                )}
              </div>

              {/* Description Body */}
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
                {currentItem.description}
              </p>

              {/* ── Content Type 1: Structured Timeline (Experience / Education) ── */}
              {currentItem.details.timeline && (
                <div className="flex flex-col gap-2.5 border-t border-white/10 pt-3.5">
                  {currentItem.details.timeline.map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-1.5 rounded-2xl bg-white/[0.03] border border-white/10 p-3 sm:p-4 hover:border-white/20 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-mono">
                        <span className="font-bold text-white leading-snug">{item.role}</span>
                        <span className="text-[11px] text-cyan-400/90 shrink-0">{item.period}</span>
                      </div>
                      <span className="text-xs text-white/80 font-medium">{item.org}</span>
                      {item.summary && (
                        <p className="text-[11px] text-white/70 mt-0.5 leading-normal font-light">
                          {item.summary}
                        </p>
                      )}
                      {item.points && item.points.length > 0 && (
                        <ul className="mt-1 space-y-1 pl-4 list-disc text-[11px] text-neutral-300 font-light leading-relaxed">
                          {item.points.map((pt, pIdx) => (
                            <li key={pIdx}>{pt}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* ── Content Type 2: Key Points List (Clean Structured Grid) ── */}
              {currentItem.details.points && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border-t border-white/10 pt-3.5">
                  {currentItem.details.points.map((pt, idx) => {
                    const rawHref = pt.href || pt.url;
                    const isEmail =
                      rawHref?.startsWith('mailto:') ||
                      (!rawHref && pt.value.includes('@') && !pt.value.includes('/'));
                    const href =
                      rawHref ||
                      (isEmail
                        ? `mailto:${pt.value}`
                        : pt.value.startsWith('http')
                        ? pt.value
                        : pt.value.startsWith('www.') ||
                          pt.value.startsWith('linkedin.com') ||
                          pt.value.startsWith('github.com')
                        ? `https://${pt.value}`
                        : null);

                    const cardInner = (
                      <>
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                            {pt.label}
                          </span>
                          {href && (
                            <ExternalLink className="w-3 h-3 text-cyan-400/50 group-hover:text-cyan-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                          )}
                        </div>
                        <span className="text-xs font-semibold text-white/90 group-hover:text-white leading-snug break-words">
                          {pt.value}
                        </span>
                        {pt.desc && (
                          <span className="text-[11px] text-white/60 font-light leading-normal mt-0.5">
                            {pt.desc}
                          </span>
                        )}
                      </>
                    );

                    if (href) {
                      return (
                        <a
                          key={idx}
                          href={href}
                          target={isEmail ? '_self' : '_blank'}
                          rel="noopener noreferrer"
                          className="group flex flex-col gap-1 p-2.5 sm:p-3 rounded-xl bg-white/[0.04] border border-white/10 hover:border-cyan-400/60 hover:bg-white/[0.08] hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] active:scale-[0.98] transition-all cursor-pointer text-left"
                        >
                          {cardInner}
                        </a>
                      );
                    }

                    return (
                      <div
                        key={idx}
                        className="group flex flex-col gap-1 p-2.5 sm:p-3 rounded-xl bg-white/[0.04] border border-white/10 hover:border-cyan-400/40 hover:bg-white/[0.06] transition-all"
                      >
                        {cardInner}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ── Content Type 3: Structured Custom Subsections (About Me, Goals, What I Do, etc.) ── */}
              {currentItem.details.sections && (
                <div className="flex flex-col gap-2.5 border-t border-white/10 pt-3.5">
                  {currentItem.details.sections.map((sec, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col gap-1.5 p-3 sm:p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors"
                    >
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                        {sec.title}
                      </span>
                      {sec.content && (
                        <p className="text-xs text-neutral-300 leading-relaxed font-light whitespace-pre-line">
                          {sec.content}
                        </p>
                      )}
                      {sec.items && sec.items.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {sec.items.map((item, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 rounded-lg bg-white/[0.06] border border-white/10 text-[11px] font-medium text-white/90"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* ── Content Type 4: Rich Project Portfolio Items ── */}
              {currentItem.details.projects && currentItem.details.projects.length > 0 && (
                <div className="flex flex-col gap-3 border-t border-white/10 pt-3.5">
                  {currentItem.details.projects.map((proj, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col gap-2 p-3 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/30 hover:bg-white/[0.05] transition-all"
                    >
                      {/* Project Header: Title & Type */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1.5">
                        <div className="flex flex-col gap-0.5">
                          <h4 className="text-sm font-bold text-white leading-snug">
                            {proj.title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-x-2 text-[11px] font-mono text-cyan-400">
                            <span>{proj.role}</span>
                            {proj.duration && (
                              <>
                                <span className="text-white/30">•</span>
                                <span className="text-white/60">{proj.duration}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {proj.type && (
                          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-[10px] font-mono text-cyan-300 shrink-0 self-start font-medium">
                            {proj.type}
                          </span>
                        )}
                      </div>

                      {/* Short Description */}
                      <p className="text-xs text-neutral-300 font-light leading-relaxed">
                        {proj.description}
                      </p>

                      {/* Key Contributions */}
                      {proj.contributions && proj.contributions.length > 0 && (
                        <div className="flex flex-col gap-1 mt-0.5">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/50">
                            Key Contributions:
                          </span>
                          <ul className="space-y-1 pl-4 list-disc text-[11px] text-white/80 font-light leading-relaxed">
                            {proj.contributions.map((c, cIdx) => (
                              <li key={cIdx}>{c}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Tech Stack Badges */}
                      {proj.techStack && proj.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-white/5">
                          {proj.techStack.map((tech, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/10 text-[10px] font-mono text-white/70"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Links */}
                      {proj.links && (proj.links.github || proj.links.demo || proj.links.caseStudy) && (
                        <div className="flex items-center gap-3 pt-1 border-t border-white/5 text-[11px] font-mono">
                          {proj.links.demo && (
                            <a
                              href={proj.links.demo}
                              target="_blank"
                              rel="noreferrer"
                              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                            >
                              <span>Live Demo</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          {proj.links.github && (
                            <a
                              href={proj.links.github}
                              target="_blank"
                              rel="noreferrer"
                              className="text-white/70 hover:text-white flex items-center gap-1 transition-colors"
                            >
                              <span>GitHub</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* ── Tags / Badges ── */}
              {currentItem.details.tags && currentItem.details.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2.5 border-t border-white/10">
                  {currentItem.details.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/10 text-[11px] font-mono text-white/80 hover:border-white/20 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* ── Mini Stats Bar ── */}
              {currentItem.stats && currentItem.stats.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2.5 border-t border-white/10">
                  {currentItem.stats.map((stat, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/[0.04] border border-white/10 text-center"
                    >
                      <span className="text-sm sm:text-base lg:text-lg font-black font-mono text-white tracking-tight break-words">
                        {stat.value}
                      </span>
                      <span className="text-[9px] font-mono text-white/50 uppercase tracking-wider mt-0.5">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Action Button (Rendered conditionally if actionLabel is provided) ── */}
              {currentItem.actionLabel && (
                <div className="pt-2 border-t border-white/10">
                  <button
                    onClick={() => {
                      if (currentItem.actionUrl) {
                        window.open(currentItem.actionUrl, '_blank');
                      } else if (activeStep < totalSteps) {
                        onNavigateStep(activeStep + 1);
                      } else {
                        onCloseToOverview();
                      }
                    }}
                    className="w-full py-2.5 sm:py-3 px-6 rounded-xl bg-white text-black font-bold text-xs font-mono flex items-center justify-center gap-2 hover:bg-neutral-200 active:scale-[0.98] transition-all shadow-lg cursor-pointer"
                  >
                    <span>{currentItem.actionLabel}</span>
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Bottom Step Navigation Bar: PREV, OVERVIEW, NEXT ──────────────── */}
      <div className="fixed bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 sm:gap-3 pointer-events-auto select-none font-mono">
        {/* Previous Neuron Button */}
        <button
          onClick={handlePrev}
          title={activeStep === 1 ? 'Back to Overview' : 'Previous Neuron'}
          className="flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-black/80 hover:bg-neutral-900 border border-white/20 hover:border-cyan-400/60 text-xs font-bold text-white transition-all backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.6)] active:scale-95 group cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-0.5 transition-transform" />
          <span className="hidden sm:inline text-[11px] tracking-wider text-white/90">PREV</span>
        </button>

        {/* Overview Center Button */}
        <button
          onClick={() => {
            soundFX.playClick();
            onCloseToOverview();
          }}
          title="Return to Neural Overview"
          className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-black/80 hover:bg-neutral-900 border border-white/20 hover:border-cyan-400/60 text-xs font-bold text-white transition-all backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.6)] active:scale-95 group cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-cyan-400 group-hover:-rotate-90 transition-transform duration-300" />
          <span className="text-[11px] sm:text-xs tracking-wider">OVERVIEW</span>
          <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-[10px] text-cyan-300 font-mono">
            {activeStep}/{totalSteps}
          </span>
        </button>

        {/* Next Neuron Button */}
        <button
          onClick={handleNext}
          title={activeStep === totalSteps ? 'Back to Overview' : 'Next Neuron'}
          className="flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-black/80 hover:bg-neutral-900 border border-white/20 hover:border-cyan-400/60 text-xs font-bold text-white transition-all backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.6)] active:scale-95 group cursor-pointer"
        >
          <span className="hidden sm:inline text-[11px] tracking-wider text-white/90">NEXT</span>
          <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

    </div>
  );
};
