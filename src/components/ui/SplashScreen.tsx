import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundFX } from './SoundEffects';

interface SplashScreenProps {
  isVisible: boolean;
  onEnter: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ isVisible, onEnter }) => {
  // Listen for any key press to trigger start
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isVisible) {
        e.preventDefault();
        onEnter();
      }
    },
    [isVisible, onEnter]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="minimal-cosmic-splash-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.1,
            filter: 'blur(24px)',
            transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 select-none cursor-pointer bg-transparent overflow-hidden font-sans"
          onClick={onEnter}
          onMouseEnter={() => soundFX.playHover()}
        >
          {/* Subtle Ambient Radial Light Spheres for deep space atmosphere */}
          <div className="absolute w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[160px] pointer-events-none animate-pulse" />

          {/* ── Main Hero Center Element: Grand Logo as Primary Focus ──────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center justify-center gap-8 sm:gap-10 text-center z-10"
          >
            {/* Grand Hero Monogram Logo Mark */}
            <motion.div
              animate={{
                y: [-6, 6, -6],
                filter: [
                  'drop-shadow(0 0 25px rgba(255,255,255,0.45)) drop-shadow(0 0 50px rgba(6,182,212,0.5))',
                  'drop-shadow(0 0 45px rgba(255,255,255,0.75)) drop-shadow(0 0 90px rgba(6,182,212,0.85))',
                  'drop-shadow(0 0 25px rgba(255,255,255,0.45)) drop-shadow(0 0 50px rgba(6,182,212,0.5))',
                ],
              }}
              transition={{
                duration: 3.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative flex items-center justify-center"
            >
              {/* Subtle back-glow aura behind the enlarged logo */}
              <div className="absolute inset-0 -m-10 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />

              <img
                src="/logo.png"
                alt="Mullo Logo"
                className="w-64 sm:w-80 md:w-96 lg:w-[420px] max-w-[85vw] h-auto object-contain transition-transform duration-500 group-hover:scale-105 pointer-events-none"
              />
            </motion.div>

            {/* Tap Screen to Start Text (Refined, sleek secondary prompt) */}
            <motion.h1
              animate={{
                opacity: [0.65, 1, 0.65],
                scale: [0.98, 1.02, 0.98],
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="text-xs sm:text-sm md:text-base lg:text-lg font-medium tracking-[0.35em] sm:tracking-[0.48em] text-white/90 uppercase font-mono text-center drop-shadow-[0_0_20px_rgba(255,255,255,0.55)]"
            >
              Tap Screen to Start
            </motion.h1>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
