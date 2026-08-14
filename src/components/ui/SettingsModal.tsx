import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  X,
  Volume2,
  VolumeX,
  Volume1,
  Play,
  Pause,
  Repeat,
  Music,
  ExternalLink,
  MousePointer,
  Radio,
  Sliders,
  Check
} from 'lucide-react';
import { soundFX } from './SoundEffects';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  // BGM Controls
  bgmPlaying: boolean;
  onToggleBgm: () => void;
  bgmVolume: number;
  onChangeBgmVolume: (val: number) => void;
  bgmMuted: boolean;
  onToggleBgmMute: () => void;
  bgmLoop: boolean;
  onToggleBgmLoop: () => void;
  bgmTrackTitle: string;
  // SFX Controls
  soundFXEnabled: boolean;
  onToggleSoundFX: () => void;
  // Custom Cursor
  cursorEnabled: boolean;
  onToggleCursor: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  bgmPlaying,
  onToggleBgm,
  bgmVolume,
  onChangeBgmVolume,
  bgmMuted,
  onToggleBgmMute,
  bgmLoop,
  onToggleBgmLoop,
  bgmTrackTitle,
  soundFXEnabled,
  onToggleSoundFX,
  cursorEnabled,
  onToggleCursor,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        soundFX.playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none pointer-events-auto">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg rounded-3xl bg-[#0e0e11]/95 border border-white/20 backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] p-6 sm:p-7 text-white font-mono overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                  <Settings className="w-4 h-4 animate-[spin_10s_linear_infinite]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                    SYSTEM SETTINGS
                  </h3>
                  <p className="text-[10px] text-white/50 tracking-wider">
                    Audio &amp; Interactive Configuration
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => {
                  soundFX.playClick();
                  onClose();
                }}
                onMouseEnter={() => soundFX.playHover()}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Sections */}
            <div className="flex flex-col gap-5 max-h-[65vh] overflow-y-auto custom-scrollbar pr-1">
              {/* Section 1: Background Music (BGM) */}
              <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 flex flex-col gap-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    <span>BACKGROUND MUSIC (BGM)</span>
                  </div>

                  {/* YouTube Source Link */}
                  <a
                    href="https://youtu.be/UDVtMYqUAyw"
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={() => soundFX.playHover()}
                    className="flex items-center gap-1 text-[10px] text-white/50 hover:text-cyan-400 transition-colors"
                  >
                    <span>YouTube Source</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>

                {/* Track Info Banner */}
                <div className="rounded-xl bg-black/40 border border-white/10 p-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
                      <Music className="w-3 h-3 text-cyan-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-white truncate">
                        {bgmTrackTitle || 'Interstellar Main Theme - Hans Zimmer'}
                      </div>
                      <div className="text-[9px] text-white/40">Auto-Looping Enabled</div>
                    </div>
                  </div>

                  {/* Play / Pause Toggle Button */}
                  <button
                    onClick={onToggleBgm}
                    onMouseEnter={() => soundFX.playHover()}
                    className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 transition-all shrink-0 active:scale-95 ${
                      bgmPlaying
                        ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                        : 'bg-white/10 border-white/15 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {bgmPlaying ? (
                      <>
                        <Pause className="w-3 h-3 text-cyan-400" />
                        <span>PLAYING</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 text-white fill-white" />
                        <span>PAUSED</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Volume Slider & Mute */}
                <div className="flex flex-col gap-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs text-white/70">
                    <span className="flex items-center gap-1.5">
                      <Sliders className="w-3 h-3 text-white/50" />
                      <span>Volume Level</span>
                    </span>
                    <span className="text-cyan-400 font-bold">
                      {bgmMuted ? 'MUTED' : `${bgmVolume}%`}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={onToggleBgmMute}
                      onMouseEnter={() => soundFX.playHover()}
                      title={bgmMuted ? 'Unmute' : 'Mute'}
                      className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all shrink-0"
                    >
                      {bgmMuted || bgmVolume === 0 ? (
                        <VolumeX className="w-4 h-4 text-red-400" />
                      ) : bgmVolume < 50 ? (
                        <Volume1 className="w-4 h-4 text-white/80" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-cyan-400" />
                      )}
                    </button>

                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={bgmMuted ? 0 : bgmVolume}
                      onChange={(e) => onChangeBgmVolume(Number(e.target.value))}
                      className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Looping Status Switch */}
                <div className="flex items-center justify-between pt-1 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <Repeat className={`w-3.5 h-3.5 ${bgmLoop ? 'text-cyan-400' : 'text-white/40'}`} />
                    <span className="text-xs text-white/80">Continuous Auto-Loop</span>
                  </div>
                  <button
                    onClick={onToggleBgmLoop}
                    onMouseEnter={() => soundFX.playHover()}
                    className={`w-10 h-5 rounded-full p-0.5 transition-colors border ${
                      bgmLoop ? 'bg-cyan-500/30 border-cyan-400/50' : 'bg-white/10 border-white/20'
                    }`}
                  >
                    <motion.div
                      layout
                      className={`w-3.5 h-3.5 rounded-full ${
                        bgmLoop ? 'bg-cyan-400 ml-auto' : 'bg-white/50'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Section 2: UI Sound Effects */}
              <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Volume2 className="w-3.5 h-3.5 text-white/70" />
                    <span>Interface Sound FX</span>
                  </span>
                  <span className="text-[10px] text-white/50">
                    Audio chirps on button clicks and hover interactions
                  </span>
                </div>

                <button
                  onClick={onToggleSoundFX}
                  onMouseEnter={() => soundFX.playHover()}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors border ${
                    soundFXEnabled ? 'bg-cyan-500/30 border-cyan-400/50' : 'bg-white/10 border-white/20'
                  }`}
                >
                  <motion.div
                    layout
                    className={`w-3.5 h-3.5 rounded-full ${
                      soundFXEnabled ? 'bg-cyan-400 ml-auto' : 'bg-white/50'
                    }`}
                  />
                </button>
              </div>

              {/* Section 3: Custom Cursor */}
              <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <MousePointer className="w-3.5 h-3.5 text-white/70" />
                    <span>Interactive Cursor</span>
                  </span>
                  <span className="text-[10px] text-white/50">
                    Monochrome dynamic cursor with spring trailing
                  </span>
                </div>

                <button
                  onClick={onToggleCursor}
                  onMouseEnter={() => soundFX.playHover()}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors border ${
                    cursorEnabled ? 'bg-cyan-500/30 border-cyan-400/50' : 'bg-white/10 border-white/20'
                  }`}
                >
                  <motion.div
                    layout
                    className={`w-3.5 h-3.5 rounded-full ${
                      cursorEnabled ? 'bg-cyan-400 ml-auto' : 'bg-white/50'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-white/40">
              <span>World of Mullo • Neural OS</span>
              <button
                onClick={() => {
                  soundFX.playClick();
                  onClose();
                }}
                className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition-all flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                <span>Apply &amp; Close</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
