import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Compass,
  Briefcase,
  Users,
  Code2,
  Cpu,
  GraduationCap,
  Award,
  Mail,
  ArrowUpRight,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { NEURON_STORY_DATA, NeuronStoryItem } from '../../data/neuronStoryData';

interface NeuronInfoPanelProps {
  activeStep: number; // 1 to 9
  onNavigateStep: (step: number) => void;
  onCloseToOverview: () => void;
}

// Category Icon Mapping
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  overview: <Sparkles className="w-4 h-4 text-white" />,
  about: <Compass className="w-4 h-4 text-white" />,
  experience: <Briefcase className="w-4 h-4 text-white" />,
  project: <Cpu className="w-4 h-4 text-white" />,
  skill: <Code2 className="w-4 h-4 text-white" />,
  education: <GraduationCap className="w-4 h-4 text-white" />,
  certificate: <Award className="w-4 h-4 text-white" />,
  contact: <Mail className="w-4 h-4 text-white" />,
};

export const NeuronInfoPanel: React.FC<NeuronInfoPanelProps> = ({
  activeStep,
  onNavigateStep,
  onCloseToOverview,
}) => {
  if (activeStep < 1 || activeStep > 9) return null;

  const currentItem: NeuronStoryItem = NEURON_STORY_DATA[activeStep - 1] || NEURON_STORY_DATA[0];
  const totalSteps = NEURON_STORY_DATA.length;

  const handlePrev = () => {
    if (activeStep > 1) {
      onNavigateStep(activeStep - 1);
    } else {
      onCloseToOverview();
    }
  };

  const handleNext = () => {
    if (activeStep < totalSteps) {
      onNavigateStep(activeStep + 1);
    } else {
      onCloseToOverview();
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex flex-col justify-between p-4 sm:p-6 lg:p-8 select-none">
      
      {/* ── Top HUD Navigation Bar ─────────────────────────────────────────── */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        {/* Left: Active Neuron Breadcrumb & Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/70 border border-white/20 backdrop-blur-md shadow-2xl">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-[0.2em] text-white/90 uppercase">
              NEURON 0{activeStep} // 0{totalSteps}
            </span>
            <span className="text-white/30">•</span>
            <span className="text-xs font-mono font-bold text-white uppercase">
              {currentItem.label}
            </span>
          </div>
        </div>

        {/* Right: Overview Return Button */}
        <button
          onClick={onCloseToOverview}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-xs font-mono font-bold text-white transition-all backdrop-blur-md shadow-lg group active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5 group-hover:-rotate-90 transition-transform duration-300" />
          <span className="hidden sm:inline">OVERVIEW WORLD</span>
          <span className="sm:hidden">ESC</span>
        </button>
      </div>

      {/* ── Main Dynamic Story Card (Positioned on the RIGHT, opposite the 3D Neuron on LEFT) ── */}
      <div className="w-full max-w-7xl mx-auto flex justify-end items-center my-auto pointer-events-none">
        <div className="w-full lg:w-[500px] xl:w-[540px] pointer-events-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={`neuron-card-${currentItem.id}`}
              initial={{ opacity: 0, x: 40, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -30, scale: 0.97 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-3xl bg-black/80 border border-white/20 backdrop-blur-xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col gap-6 text-white max-h-[75vh] overflow-y-auto custom-scrollbar"
            >
              {/* Card Header */}
              <div>
                {/* Category Pill */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-mono font-bold uppercase tracking-wider mb-3">
                  {CATEGORY_ICONS[currentItem.category] || <Sparkles className="w-3.5 h-3.5" />}
                  <span>{currentItem.subtitle}</span>
                </div>

                {/* Main Title */}
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight text-white">
                  {currentItem.title}
                </h2>

                {/* Highlight Quote if available */}
                {currentItem.details.highlight && (
                  <p className="mt-3 text-sm sm:text-base font-semibold text-white/90 border-l-2 border-white pl-3 italic">
                    "{currentItem.details.highlight}"
                  </p>
                )}
              </div>

              {/* Description Body (Lorem Ipsum) */}
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light">
                {currentItem.description}
              </p>

              {/* ── Content Type 1: Structured Timeline (Experience / Education) ── */}
              {currentItem.details.timeline && (
                <div className="flex flex-col gap-4 border-t border-white/10 pt-4">
                  {currentItem.details.timeline.map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-1 rounded-xl bg-white/5 border border-white/10 p-3.5 hover:border-white/25 transition-colors">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-white">{item.role}</span>
                        <span className="text-white/50">{item.period}</span>
                      </div>
                      <span className="text-xs text-white/80 font-medium">{item.org}</span>
                      <p className="text-[11px] text-white/60 mt-1 leading-normal font-light">
                        {item.summary}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Content Type 2: Key Points List (Mullo, About, Project, Skills, Certs) ── */}
              {currentItem.details.points && (
                <div className="flex flex-col gap-2.5 border-t border-white/10 pt-4">
                  {currentItem.details.points.map((pt, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-white/80 shrink-0 mt-0.5" />
                      <div className="flex flex-col">
                        <span className="font-bold text-white font-mono">{pt.label}:</span>
                        <span className="text-white/75 font-light">{pt.value}</span>
                        {pt.desc && <span className="text-[11px] text-white/50 font-light mt-0.5">{pt.desc}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Tags / Badges ── */}
              {currentItem.details.tags && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
                  {currentItem.details.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md bg-white/10 border border-white/15 text-[11px] font-mono text-white/80"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* ── Mini Stats Bar ── */}
              {currentItem.stats && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
                  {currentItem.stats.map((stat, idx) => (
                    <div key={idx} className="flex flex-col">
                      <span className="text-lg sm:text-xl font-black font-mono text-white">
                        {stat.value}
                      </span>
                      <span className="text-[10px] font-mono text-white/50 uppercase">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Action Button ── */}
              {currentItem.actionLabel && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      if (activeStep < totalSteps) {
                        onNavigateStep(activeStep + 1);
                      } else {
                        onCloseToOverview();
                      }
                    }}
                    className="w-full py-3 px-6 rounded-xl bg-white text-black font-bold text-xs font-mono flex items-center justify-center gap-2 hover:bg-neutral-200 active:scale-[0.98] transition-all shadow-lg"
                  >
                    <span>{currentItem.actionLabel}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Bottom Step Navigation Bar ─────────────────────────────────────── */}
      <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-auto">
        
        {/* Left: Previous Button */}
        <button
          onClick={handlePrev}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/80 hover:bg-black border border-white/20 hover:border-white/40 text-xs font-mono font-bold text-white transition-all backdrop-blur-md shadow-xl active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{activeStep === 1 ? 'OVERVIEW' : 'PREV NEURON'}</span>
        </button>

        {/* Center: Fast Jump Dot Steps */}
        <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-black/80 border border-white/20 backdrop-blur-md shadow-xl">
          {NEURON_STORY_DATA.map((item, idx) => {
            const stepNum = idx + 1;
            const isActive = stepNum === activeStep;
            return (
              <button
                key={item.id}
                onClick={() => onNavigateStep(stepNum)}
                className={`relative px-2.5 py-1 rounded-full text-xs font-mono font-bold transition-all ${
                  isActive
                    ? 'bg-white text-black shadow-md scale-105'
                    : 'text-white/50 hover:text-white hover:bg-white/10'
                }`}
                title={item.label}
              >
                0{stepNum}
              </button>
            );
          })}
        </div>

        {/* Right: Next Button */}
        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black hover:bg-neutral-200 border border-white font-mono font-bold text-xs transition-all shadow-xl active:scale-95"
        >
          <span>{activeStep === totalSteps ? 'FINISH OVERVIEW' : 'NEXT NEURON'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
