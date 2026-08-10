import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github, Sparkles, CheckCircle2 } from 'lucide-react';
import { Project } from '../../types';
import { soundFX } from './SoundEffects';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            soundFX.playClick();
            onClose();
          }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-panel rounded-3xl border border-white/15 p-6 sm:p-8 shadow-2xl z-10 text-left"
        >
          {/* Close Button */}
          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Project Image Banner */}
          <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden mb-6 border border-white/10">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background-card via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4">
              <span className="px-3 py-1 rounded-full bg-cyber-cyan/20 border border-cyber-cyan/40 text-cyber-cyan text-xs font-mono font-medium backdrop-blur-md">
                {project.category.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Title & Subtitle */}
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            {project.title}
          </h3>
          <p className="text-sm font-mono text-cyber-cyan mt-1">
            {project.subtitle}
          </p>

          {/* Description */}
          <div className="mt-6 text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
            <p>{project.description}</p>
          </div>

          {/* Metrics */}
          {project.metrics && (
            <div className="grid grid-cols-2 gap-4 mt-6 p-4 rounded-2xl bg-white/5 border border-white/5">
              {project.metrics.map((m, idx) => (
                <div key={idx}>
                  <span className="text-[11px] font-mono text-slate-400 block">{m.label}</span>
                  <span className="text-base font-bold text-white font-mono mt-0.5 block">{m.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tags */}
          <div className="mt-6">
            <h4 className="text-xs font-mono text-slate-400 mb-2.5">TECHNOLOGIES USED:</h4>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-lg bg-background-surface border border-background-border text-xs font-mono text-slate-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action Links */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-4">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => soundFX.playClick()}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-blue text-black font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-neon-cyan hover:shadow-neon-cyan/80 transition-all"
              >
                <span>Live Demo Preview</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => soundFX.playClick()}
                className="px-6 py-3 rounded-full glass-panel border border-white/15 text-slate-200 hover:text-white font-medium text-xs sm:text-sm flex items-center gap-2 hover:bg-white/10 transition-all"
              >
                <Github className="w-4 h-4" />
                <span>Source Repository</span>
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
