import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings } from 'lucide-react';
import { soundFX } from './SoundEffects';

interface OverviewSettingsButtonProps {
  activeStep: number;
  onOpenSettings: () => void;
}

export const OverviewSettingsButton: React.FC<OverviewSettingsButtonProps> = ({
  activeStep,
  onOpenSettings,
}) => {
  // Only show on Overview (Step 0)
  if (activeStep !== 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.9 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-5 right-5 sm:right-6 lg:right-8 z-50 pointer-events-auto select-none font-mono"
      >
        <button
          onClick={() => {
            soundFX.playClick();
            onOpenSettings();
          }}
          onMouseEnter={() => soundFX.playHover()}
          title="Open System & Audio Settings"
          className="glass-panel rounded-full px-4 py-2.5 flex items-center gap-2 text-white/80 hover:text-white border border-white/15 hover:border-cyan-400/40 shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all group active:scale-95 bg-black/60 backdrop-blur-xl"
        >
          <div className="w-6 h-6 rounded-lg bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
            <Settings className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-500" />
          </div>
          <span className="text-xs font-bold tracking-wider uppercase text-white/90">
            SETTINGS
          </span>
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
