import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { soundFX } from './SoundEffects';

interface OverviewStartButtonProps {
  activeStep: number;
  onStart: () => void;
}

export const OverviewStartButton: React.FC<OverviewStartButtonProps> = ({
  activeStep,
  onStart,
}) => {
  // Only render during Overview (Step 0) on Mobile and Tablet (hidden on Desktop lg:)
  if (activeStep !== 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="overview-start-btn"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 15, scale: 0.95 }}
        transition={{ delay: 0.5, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-14 sm:bottom-16 left-1/2 -translate-x-1/2 z-40 pointer-events-auto select-none font-mono lg:hidden"
      >
        <button
          onClick={() => {
            soundFX.playOpenSaber();
            onStart();
          }}
          onMouseEnter={() => soundFX.playHover()}
          className="group flex items-center gap-2 py-2 px-4 text-white/80 hover:text-cyan-300 active:text-cyan-400 text-xs font-mono font-bold tracking-[0.25em] uppercase transition-all duration-300 active:scale-95 cursor-pointer drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
        >
          <span className="relative transition-colors">
            START JOURNEY
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
