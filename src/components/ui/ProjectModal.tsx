import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github } from 'lucide-react';
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
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#121214] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl z-10 text-left text-white"
        >
          {/* Close Button */}
          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Project Image Banner */}
          <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden mb-6 border border-white/10 bg-white/5">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4">
              <span className="px-3 py-1 rounded-full bg-black/60 border border-white/20 text-cyan-400 text-xs font-mono font-bold shadow-sm backdrop-blur-md">
                {project.category.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Title & Subtitle */}
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            {project.title}
          </h3>
          <p className="text-sm font-mono text-cyan-400 font-semibold mt-1">
            {project.subtitle}
          </p>

          {/* Description */}
          <div className="mt-6 text-white/70 text-sm sm:text-base leading-relaxed space-y-4 font-normal">
            <p>{project.description}</p>
          </div>

          {/* Metrics */}
          {project.metrics && (
            <div className="grid grid-cols-2 gap-4 mt-6 p-4 rounded-2xl bg-white/5 border border-white/10">
              {project.metrics.map((m, idx) => (
                <div key={idx}>
                  <span className="text-[11px] font-mono text-white/40 font-semibold block">{m.label}</span>
                  <span className="text-base font-bold text-cyan-400 font-mono mt-0.5 block">{m.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tags */}
          <div className="mt-6">
            <h4 className="text-xs font-mono text-white/50 font-semibold mb-2.5">TECHNOLOGIES USED:</h4>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-white/80 font-medium"
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
                className="px-6 py-3 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all"
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
                className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white/80 hover:text-white font-semibold text-xs sm:text-sm flex items-center gap-2 hover:bg-white/10 transition-all shadow-sm"
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
