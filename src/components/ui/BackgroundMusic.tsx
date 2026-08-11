import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Music } from 'lucide-react';
import { soundFX } from './SoundEffects';

const YOUTUBE_VIDEO_URL = 'https://youtu.be/UDVtMYqUAyw?si=XTptJlIQVoJx4cg1';
const BGM_AUDIO_SRC = '/sounds/bgm.mp3';

interface BackgroundMusicProps {
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  loopActive: boolean;
  trackTitle: string;
  onTrackTitleLoaded?: (title: string) => void;
  setIsPlayingState: (playing: boolean) => void;
}

export const BackgroundMusic: React.FC<BackgroundMusicProps> = ({
  isPlaying,
  volume,
  isMuted,
  loopActive,
  trackTitle,
  setIsPlayingState,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Initialize and mount Audio element
  useEffect(() => {
    const audio = new Audio(BGM_AUDIO_SRC);
    audio.loop = loopActive;
    audio.volume = isMuted ? 0 : Math.max(0, Math.min(1, volume / 100));
    audio.preload = 'auto';
    audioRef.current = audio;

    const handleEnded = () => {
      if (loopActive) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        setIsPlayingState(false);
      }
    };

    audio.addEventListener('ended', handleEnded);

    // Attempt initial autoplay
    if (isPlaying) {
      audio.play().then(() => {
        setIsPlayingState(true);
      }).catch(() => {
        // Autoplay blocked until gesture
      });
    }

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  // Sync Loop property
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = loopActive;
    }
  }, [loopActive]);

  // Sync Volume & Mute changes
  useEffect(() => {
    if (!audioRef.current) return;
    const targetVolume = isMuted ? 0 : Math.max(0, Math.min(1, volume / 100));
    audioRef.current.volume = targetVolume;
  }, [volume, isMuted]);

  // Sync Play / Pause changes
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      if (audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      }
    } else {
      if (!audioRef.current.paused) {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Unlock and play audio on first user interaction if blocked initially
  useEffect(() => {
    const handleFirstGesture = () => {
      if (hasInteracted) return;
      setHasInteracted(true);

      if (audioRef.current && isPlaying && audioRef.current.paused) {
        audioRef.current.play().then(() => {
          setIsPlayingState(true);
        }).catch(() => {});
      }
    };

    window.addEventListener('pointerdown', handleFirstGesture, { once: true });
    window.addEventListener('pointermove', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });
    window.addEventListener('wheel', handleFirstGesture, { once: true });

    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('pointermove', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('wheel', handleFirstGesture);
    };
  }, [hasInteracted, isPlaying, setIsPlayingState]);

  const displayTitle = trackTitle || 'Interstellar Main Theme - Extra Extended - Hans Zimmer';

  return (
    <>
      {/* Constant Shape Watermark Pill with Continuous Running Marquee Title (Bottom Left) */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="fixed bottom-5 left-5 z-40 pointer-events-auto font-mono select-none"
      >
        <a
          href={YOUTUBE_VIDEO_URL}
          target="_blank"
          rel="noreferrer"
          onClick={() => soundFX.playClick()}
          onMouseEnter={() => soundFX.playHover()}
          title="Klik untuk membuka video soundtrack di YouTube"
          className="marquee-container w-[230px] xs:w-[260px] sm:w-[290px] h-[40px] glass-panel rounded-2xl px-3 border border-white/15 hover:border-cyan-400/50 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.7)] flex items-center justify-between gap-2.5 bg-black/80 transition-all group cursor-pointer active:scale-95"
        >
          {/* Left: Animated Sound Equalizer Wave Bars */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-end gap-0.5 h-4 w-4 justify-center shrink-0">
              <span
                className={`w-0.5 bg-cyan-400 rounded-full transition-all duration-300 ${
                  isPlaying ? 'animate-[equalizer-1_0.8s_ease-in-out_infinite]' : 'h-1 opacity-40'
                }`}
              />
              <span
                className={`w-0.5 bg-cyan-300 rounded-full transition-all duration-300 ${
                  isPlaying ? 'animate-[equalizer-2_0.7s_ease-in-out_infinite_0.1s]' : 'h-2 opacity-40'
                }`}
              />
              <span
                className={`w-0.5 bg-white rounded-full transition-all duration-300 ${
                  isPlaying ? 'animate-[equalizer-3_0.9s_ease-in-out_infinite_0.2s]' : 'h-1.5 opacity-40'
                }`}
              />
              <span
                className={`w-0.5 bg-cyan-400 rounded-full transition-all duration-300 ${
                  isPlaying ? 'animate-[equalizer-4_0.75s_ease-in-out_infinite_0.15s]' : 'h-1 opacity-40'
                }`}
              />
            </div>
            <Music className="w-3 h-3 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
          </div>

          {/* Center: Running / Marquee Text (Right to Left) */}
          <div className="relative flex-1 overflow-hidden h-5 flex items-center">
            {/* Left & Right subtle gradient masks for marquee smoothness */}
            <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-3 bg-gradient-to-l from-black/80 to-transparent z-10 pointer-events-none" />

            <div className="animate-marquee items-center text-[11px] font-semibold text-white/90 group-hover:text-cyan-300 transition-colors">
              <span className="pr-6">{displayTitle}</span>
              <span className="pr-6 text-cyan-400/60 font-bold">•</span>
              <span className="pr-6">{displayTitle}</span>
              <span className="pr-6 text-cyan-400/60 font-bold">•</span>
            </div>
          </div>

          {/* Right: External Link Indicator */}
          <div className="shrink-0 flex items-center pl-0.5">
            <ExternalLink className="w-3.5 h-3.5 text-white/40 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>
        </a>
      </motion.div>
    </>
  );
};
