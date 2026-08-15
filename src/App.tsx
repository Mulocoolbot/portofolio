import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Background3DCanvas } from './components/3d/Background3DCanvas';
import { Navbar } from './components/ui/Navbar';
import { HeroSection } from './components/ui/HeroSection';
import { NeuronInfoPanel } from './components/ui/NeuronInfoPanel';
import { CustomCursor } from './components/ui/CustomCursor';
import { BackgroundMusic } from './components/ui/BackgroundMusic';
import { OverviewSettingsButton } from './components/ui/OverviewSettingsButton';
import { OverviewStartButton } from './components/ui/OverviewStartButton';
import { SettingsModal } from './components/ui/SettingsModal';
import { SplashScreen } from './components/ui/SplashScreen';
import { soundFX } from './components/ui/SoundEffects';

export const App: React.FC = () => {
  // Splash Screen State
  const [hasEntered, setHasEntered] = useState(false);

  // 0 = Overview (Hero with "WELCOME TO WORLD OF MULLO")
  // 1 to 9 = Story Nodes (1: Mullo, 2: About, 3: Org Exp, 4: Pro Exp, 5: Projects, 6: Skills, 7: Education, 8: Certs, 9: Contact)
  const [activeStep, setActiveStep] = useState<number>(0);
  const isThrottled = useRef(false);

  // Settings & Audio State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [bgmPlaying, setBgmPlaying] = useState(true);
  const [bgmVolume, setBgmVolume] = useState(20);
  const [bgmMuted, setBgmMuted] = useState(false);
  const [bgmLoop, setBgmLoop] = useState(true);
  const bgmTrackTitle = 'Interstellar Main Theme - Hans Zimmer';
  const [soundFXEnabled, setSoundFXEnabled] = useState(true);
  const [cursorEnabled, setCursorEnabled] = useState(true);

  const totalSteps = 9;

  // Handle Enter Experience from Splash Screen
  const handleEnterExperience = useCallback(() => {
    setHasEntered(true);
    soundFX.unlockAudio();
    soundFX.playOpenSaber();
    setBgmPlaying(true);
  }, []);

  // Preload and initialize all sound effects & start ambient idle hum
  useEffect(() => {
    soundFX.preloadAll();

    const startAudioOnInteraction = () => {
      soundFX.startIdle();
    };

    const unlockEvents = ['pointerdown', 'click', 'touchstart', 'keydown', 'wheel'] as const;
    unlockEvents.forEach((evt) => {
      window.addEventListener(evt, startAudioOnInteraction, { once: true, passive: true });
      document.addEventListener(evt, startAudioOnInteraction, { once: true, passive: true });
    });

    return () => {
      unlockEvents.forEach((evt) => {
        window.removeEventListener(evt, startAudioOnInteraction);
        document.removeEventListener(evt, startAudioOnInteraction);
      });
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
        if (prev >= totalSteps) {
          next = 0;
        } else {
          next = prev + 1;
        }
      } else {
        next = Math.max(0, prev - 1);
      }

      if (prev === 0 && next >= 1) {
        soundFX.playOpenSaber();
      } else if (prev >= 1 && next === 0) {
        soundFX.playOpenSaberReversed();
      } else if (prev >= 1 && next >= 1 && prev !== next) {
        soundFX.playNeuronTransition();
      }

      return next;
    });

    setTimeout(() => {
      isThrottled.current = false;
    }, 550); // 550ms cooldown for smooth cinematic flight
  }, [totalSteps]);

  // Global Wheel and Keyboard Listeners (Touch swipe is explicitly disabled to avoid accidental navigation)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // If splash screen is visible or settings modal is open, don't trigger 3D flight
      if (!hasEntered || isSettingsOpen) return;

      // STRICT DETAIL CARD SCROLL ISOLATION:
      // If cursor is inside any detail card or scrollable modal, do NOT advance website steps.
      const target = e.target as HTMLElement;
      if (target && (target.closest('[data-detail-card="true"]') || target.closest('.custom-scrollbar'))) {
        return;
      }

      if (Math.abs(e.deltaY) > 24) {
        if (e.deltaY > 0) {
          advanceStep(1);
        } else {
          advanceStep(-1);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hasEntered || isSettingsOpen) return;

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown') {
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

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [advanceStep, hasEntered, isSettingsOpen, navigateToStep]);

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
        hasEntered={hasEntered}
        onSelectNode={(storyIndex) => navigateToStep(storyIndex + 1)}
      />

      {/* Custom Interactive Monochrome Cursor */}
      <CustomCursor enabled={cursorEnabled} />

      {/* Overview Top-Right Settings Button (activeStep === 0) */}
      {hasEntered && (
        <OverviewSettingsButton
          activeStep={activeStep}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      )}

      {/* Overview Center Bottom Start Button (activeStep === 0) */}
      {hasEntered && (
        <OverviewStartButton
          activeStep={activeStep}
          onStart={() => navigateToStep(1)}
        />
      )}

      {/* Top Floating Glassmorphism Navbar — hidden on Overview, visible on Detail (activeStep >= 1) */}
      {hasEntered && (
        <Navbar
          activeStep={activeStep}
          onNavigateStep={navigateToStep}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      )}

      {/* ── Step 0: Hero Section with Typewriter & Inversion ────────────────── */}
      {hasEntered && (
        <HeroSection
          activeStep={activeStep}
        />
      )}

      {/* ── Step 1 to 9: Interactive Neuron Info Panel & Bottom HUD ───────── */}
      {hasEntered && (
        <NeuronInfoPanel
          activeStep={activeStep}
          onNavigateStep={(step) => navigateToStep(step)}
          onCloseToOverview={() => navigateToStep(0)}
        />
      )}

      {/* ── Background Music Controller (BGM Watermark & Audio Engine) ── */}
      {hasEntered && (
        <BackgroundMusic
          isPlaying={bgmPlaying}
          volume={bgmVolume}
          isMuted={bgmMuted}
          loopActive={bgmLoop}
          trackTitle={bgmTrackTitle}
          activeStep={activeStep}
          setIsPlayingState={setBgmPlaying}
        />
      )}

      {/* ── Initial Neural Experience Splash Screen ───────────────────────── */}
      <SplashScreen
        isVisible={!hasEntered}
        onEnter={handleEnterExperience}
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
