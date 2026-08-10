import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Background3DCanvas } from './components/3d/Background3DCanvas';
import { Navbar } from './components/ui/Navbar';
import { HeroSection } from './components/ui/HeroSection';
import { NeuronInfoPanel } from './components/ui/NeuronInfoPanel';
import { CustomCursor } from './components/ui/CustomCursor';
import { soundFX } from './components/ui/SoundEffects';

export const App: React.FC = () => {
  // 0 = Overview (Hero with "WELCOME TO WORLD OF MULLO")
  // 1 to 9 = Story Nodes (1: Mullo, 2: About, 3: Org Exp, 4: Pro Exp, 5: Projects, 6: Skills, 7: Education, 8: Certs, 9: Contact)
  const [activeStep, setActiveStep] = useState<number>(0);
  const isThrottled = useRef(false);
  const touchStartY = useRef(0);

  const totalSteps = 9;

  // Step advancement helper
  const navigateToStep = useCallback((step: number) => {
    const clamped = Math.max(0, Math.min(totalSteps, step));
    setActiveStep(clamped);
    soundFX.playClick();
  }, [totalSteps]);

  const advanceStep = useCallback((direction: 1 | -1) => {
    if (isThrottled.current) return;
    isThrottled.current = true;

    setActiveStep((prev) => {
      const next = prev + direction;
      return Math.max(0, Math.min(totalSteps, next));
    });
    soundFX.playClick();

    setTimeout(() => {
      isThrottled.current = false;
    }, 550); // 550ms cooldown for smooth cinematic flight
  }, [totalSteps]);

  // Global Wheel, Touch, and Keyboard Listeners for Synaptic 3D Navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
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
  }, [advanceStep, navigateToStep]);

  // Navbar section mapping to steps
  const activeSectionId =
    activeStep === 0
      ? 'hero'
      : activeStep <= 2
      ? 'about'
      : activeStep <= 4
      ? 'experience'
      : activeStep === 5
      ? 'projects'
      : activeStep === 6
      ? 'lab'
      : activeStep <= 8
      ? 'education'
      : 'contact';

  const handleNavClick = (sectionId: string) => {
    switch (sectionId) {
      case 'hero':
        navigateToStep(0);
        break;
      case 'about':
        navigateToStep(2);
        break;
      case 'experience':
        navigateToStep(3);
        break;
      case 'projects':
        navigateToStep(5);
        break;
      case 'lab':
        navigateToStep(6);
        break;
      case 'contact':
        navigateToStep(9);
        break;
      default:
        navigateToStep(0);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-transparent relative font-sans text-white select-none">
      {/* Interactive 3D Canvas Background with Camera Flight */}
      <Background3DCanvas
        activeStep={activeStep}
        onSelectNode={(storyIndex) => navigateToStep(storyIndex + 1)}
      />

      {/* Custom Interactive Monochrome Cursor */}
      <CustomCursor />

      {/* Top Floating Glassmorphism Navbar */}
      <Navbar activeSection={activeSectionId} onNavigate={handleNavClick} />

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
    </div>
  );
};

export default App;
