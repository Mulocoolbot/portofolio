import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Background3DCanvas } from './components/3d/Background3DCanvas';
import { Navbar } from './components/ui/Navbar';
import { HeroSection } from './components/ui/HeroSection';
import { NeuronInfoPanel } from './components/ui/NeuronInfoPanel';
import { CustomCursor } from './components/ui/CustomCursor';
import { BackgroundMusic } from './components/ui/BackgroundMusic';
import { OverviewSettingsButton } from './components/ui/OverviewSettingsButton';
import { SettingsModal } from './components/ui/SettingsModal';
import { soundFX } from './components/ui/SoundEffects';

export const App: React.FC = () => {
  // 0 = Overview (Hero with "WELCOME TO WORLD OF MULLO")
  // 1 to 9 = Story Nodes (1: Mullo, 2: About, 3: Org Exp, 4: Pro Exp, 5: Projects, 6: Skills, 7: Education, 8: Certs, 9: Contact)
  const [activeStep, setActiveStep] = useState<number>(0);
  const isThrottled = useRef(false);
  const touchStartY = useRef(0);

  // Settings & Audio State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [bgmPlaying, setBgmPlaying] = useState(true);
  const [bgmVolume, setBgmVolume] = useState(20);
  const [bgmMuted, setBgmMuted] = useState(false);
  const [bgmLoop, setBgmLoop] = useState(true);
  const [bgmTrackTitle, setBgmTrackTitle] = useState('Interstellar Main Theme - Hans Zimmer');
  const [soundFXEnabled, setSoundFXEnabled] = useState(true);
  const [cursorEnabled, setCursorEnabled] = useState(true);

  const totalSteps = 9;

  // Preload and initialize all sound effects & start ambient idle hum
  useEffect(() => {
    soundFX.preloadAll();

    const startAudioOnInteraction = () => {
      soundFX.startIdle();
    };

    window.addEventListener('pointerdown', startAudioOnInteraction, { once: true });
    window.addEventListener('keydown', startAudioOnInteraction, { once: true });
    window.addEventListener('wheel', startAudioOnInteraction, { once: true });
    window.addEventListener('touchstart', startAudioOnInteraction, { once: true });

    return () => {
      window.removeEventListener('pointerdown', startAudioOnInteraction);
      window.removeEventListener('keydown', startAudioOnInteraction);
      window.removeEventListener('wheel', startAudioOnInteraction);
      window.removeEventListener('touchstart', startAudioOnInteraction);
    };
  }, []);

  // Step advancement helper
  const navigateToStep = useCallback((step: number) => {
    const clamped = Math.max(0, Math.min(totalSteps, step));
    setActiveStep((prev) => {
      if (prev === 0 && clamped >= 1) {
        // Overview -> Neuron: Open Saber Forward
        soundFX.playOpenSaber();
      } else if (prev >= 1 && clamped === 0) {
        // Neuron -> Overview: Open Saber Reversed
        soundFX.playOpenSaberReversed();
      } else if (prev >= 1 && clamped >= 1 && prev !== clamped) {
        // Neuron -> Neuron: Neuron Transition
        soundFX.playNeuronTransition();
      } else if (prev === clamped) {
        soundFX.playClick();
      }
      return clamped;
    });
  }, [totalSteps]);

  const advanceStep = useCallback((direction: 1 | -1) => {
    if (isThrottled.current) return;
    isThrottled.current = true;

    setActiveStep((prev) => {
      let next: number;
      if (direction === 1) {
        // Return to Overview (0) automatically when scrolling past the last detail section
        if (prev >= totalSteps) {
          next = 0;
        } else {
          next = prev + 1;
        }
      } else {
        next = Math.max(0, prev - 1);
      }

      if (prev === 0 && next >= 1) {
        // Overview -> Neuron: Open Saber Forward
        soundFX.playOpenSaber();
      } else if (prev >= 1 && next === 0) {
        // Neuron -> Overview: Open Saber Reversed
        soundFX.playOpenSaberReversed();
      } else if (prev >= 1 && next >= 1 && prev !== next) {
        // Neuron -> Neuron: Neuron Transition
        soundFX.playNeuronTransition();
      }

      return next;
    });

    setTimeout(() => {
      isThrottled.current = false;
    }, 550); // 550ms cooldown for smooth cinematic flight
  }, [totalSteps]);

  // Global Wheel, Touch, and Keyboard Listeners for Synaptic 3D Navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // If settings modal is open, don't trigger 3D flight
      if (isSettingsOpen) return;

      // Ignore wheel if hovering inside a scrollable modal/card that is not at boundaries
      const target = e.target as HTMLElement;
      if (target && target.closest('.custom-scrollbar')) {
        const scrollElem = target.closest('.custom-scrollbar') as HTMLElement;
        const isAtBottom = scrollElem.scrollTop + scrollElem.clientHeight >= scrollElem.scrollHeight - 5;
        const isAtTop = scrollElem.scrollTop <= 5;
        if ((e.deltaY > 0 && !isAtBottom) || (e.deltaY < 0 && !isAtTop)) {
          return;
        }
      }

      if (Math.abs(e.deltaY) > 18) {
        if (e.deltaY > 0) {
          advanceStep(1);
        } else {
          advanceStep(-1);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSettingsOpen) return;

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        advanceStep(1);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        advanceStep(-1);
      } else if (e.key === 'Escape' || e.key === 'Home') {
        e.preventDefault();
        navigateToStep(0);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartY.current = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isSettingsOpen) return;
      if (e.changedTouches.length > 0) {
        const deltaY = touchStartY.current - e.changedTouches[0].clientY;
        if (Math.abs(deltaY) > 40) {
          if (deltaY > 0) {
            advanceStep(1); // Swipe Up -> Next
          } else {
            advanceStep(-1); // Swipe Down -> Prev
          }
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [advanceStep, isSettingsOpen, navigateToStep]);

  // Audio & Settings Control Callbacks
  const toggleBgm = useCallback(() => {
    setBgmPlaying((prev) => !prev);
  }, []);

  const toggleBgmMute = useCallback(() => {
    setBgmMuted((prev) => !prev);
  }, []);

  const toggleBgmLoop = useCallback(() => {
    setBgmLoop((prev) => !prev);
  }, []);

  const toggleSoundFX = useCallback(() => {
    setSoundFXEnabled((prev) => {
      const next = !prev;
      soundFX.setEnabled(next);
      if (next) soundFX.playClick();
      return next;
    });
  }, []);

  const toggleCursor = useCallback(() => {
    setCursorEnabled((prev) => !prev);
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden bg-transparent relative font-sans text-white select-none">
      {/* Interactive 3D Canvas Background with Camera Flight */}
      <Background3DCanvas
        activeStep={activeStep}
        onSelectNode={(storyIndex) => navigateToStep(storyIndex + 1)}
      />

      {/* Custom Interactive Monochrome Cursor */}
      <CustomCursor enabled={cursorEnabled} />

      {/* Overview Top-Right Settings Button (activeStep === 0) */}
      <OverviewSettingsButton
        activeStep={activeStep}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Top Floating Glassmorphism Navbar — hidden on Overview, visible on Detail (activeStep >= 1) */}
      <Navbar
        activeStep={activeStep}
        onNavigateStep={navigateToStep}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* ── Step 0: Hero Section with Typewriter & Inversion ────────────────── */}
      <HeroSection
        activeStep={activeStep}
        onStartExplore={() => navigateToStep(1)}
      />

      {/* ── Step 1 to 9: Interactive Neuron Info Panel & HUD ───────────────── */}
      <NeuronInfoPanel
        activeStep={activeStep}
        onNavigateStep={(step) => navigateToStep(step)}
        onCloseToOverview={() => navigateToStep(0)}
      />

      {/* ── Background Music Controller (BGM Watermark & Audio Engine) ── */}
      <BackgroundMusic
        isPlaying={bgmPlaying}
        volume={bgmVolume}
        isMuted={bgmMuted}
        loopActive={bgmLoop}
        trackTitle={bgmTrackTitle}
        onTrackTitleLoaded={setBgmTrackTitle}
        setIsPlayingState={setBgmPlaying}
      />

      {/* ── System & Audio Settings Modal ──────────────────────────────────── */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        bgmPlaying={bgmPlaying}
        onToggleBgm={toggleBgm}
        bgmVolume={bgmVolume}
        onChangeBgmVolume={setBgmVolume}
        bgmMuted={bgmMuted}
        onToggleBgmMute={toggleBgmMute}
        bgmLoop={bgmLoop}
        onToggleBgmLoop={toggleBgmLoop}
        bgmTrackTitle={bgmTrackTitle}
        soundFXEnabled={soundFXEnabled}
        onToggleSoundFX={toggleSoundFX}
        cursorEnabled={cursorEnabled}
        onToggleCursor={toggleCursor}
      />
    </div>
  );
};

export default App;

