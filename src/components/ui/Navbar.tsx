import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Menu, X, Sparkles, Terminal, ChevronDown } from 'lucide-react';
import { soundFX } from './SoundEffects';
import { NEURON_STORY_DATA } from '../../data/neuronStoryData';

interface NavbarProps {
  activeStep: number; // 0 = Overview (hidden), 1-9 = detail sections
  onNavigateStep: (step: number) => void;
  onOpenSettings: () => void;
}

// Map each step to a navbar section id
const STEP_TO_SECTION: Record<number, string> = {
  1: 'mullo',
  2: 'about',
  3: 'experience',
  4: 'experience',
  5: 'projects',
  6: 'skills',
  7: 'education',
  8: 'certificate',
  9: 'contact',
};

interface NavItem {
  id: string;
  label: string;
  step: number; // primary step to navigate to
  highlight?: boolean;
  hasDropdown?: boolean;
  dropdownItems?: { label: string; step: number }[];
}

const NAV_ITEMS: NavItem[] = [
  { id: 'mullo', label: 'Mullo', step: 1 },
  { id: 'about', label: 'About', step: 2 },
  {
    id: 'experience',
    label: 'Experience',
    step: 3,
    hasDropdown: true,
    dropdownItems: [
      { label: 'Organization', step: 3 },
      { label: 'Professional', step: 4 },
    ],
  },
  { id: 'projects', label: 'Projects', step: 5 },
  { id: 'skills', label: 'Skills', step: 6 },
  { id: 'education', label: 'Education', step: 7 },
  { id: 'certificate', label: 'Certificate', step: 8 },
  { id: 'contact', label: 'Contact', step: 9, highlight: true },
];

export const Navbar: React.FC<NavbarProps> = ({ activeStep, onNavigateStep, onOpenSettings }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expDropdownOpen, setExpDropdownOpen] = useState(false);
  const [mobileExpDropdownOpen, setMobileExpDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setExpDropdownOpen(false);
      }
    };
    if (expDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [expDropdownOpen]);

  // Close mobile menu on step change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileExpDropdownOpen(false);
  }, [activeStep]);

  const handleItemClick = (step: number) => {
    onNavigateStep(step);
    setMobileMenuOpen(false);
    setExpDropdownOpen(false);
  };

  const activeSection = STEP_TO_SECTION[activeStep] || '';

  // Don't render at all during overview
  if (activeStep === 0) return null;

  return (
    <AnimatePresence>
      <motion.header
        key="navbar-detail"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pointer-events-auto"
      >
        <nav className="glass-panel rounded-full px-5 py-2.5 flex items-center justify-between shadow-sm backdrop-blur-xl">
          {/* Brand / Logo — click returns to Overview */}
          <button
            onClick={() => {
              onNavigateStep(0);
            }}
            className="flex items-center gap-2.5 group focus:outline-none"
            onMouseEnter={() => soundFX.playHover()}
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Terminal className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-bold text-sm sm:text-base tracking-tight text-white font-mono">
                World of Mullo
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-0.5 bg-white/5 rounded-full px-1.5 py-1 border border-white/10">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;

              // Experience with dropdown
              if (item.hasDropdown) {
                return (
                  <div key={item.id} className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => {
                        soundFX.playClick();
                        setExpDropdownOpen(!expDropdownOpen);
                      }}
                      onMouseEnter={() => soundFX.playHover()}
                      className={`relative px-3 py-1.5 rounded-full text-[11px] font-mono font-semibold transition-all flex items-center gap-1 ${
                        isActive
                          ? 'text-white'
                          : 'text-white/50 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeNavIndicator"
                          className="absolute inset-0 rounded-full bg-white/15 border border-white/30 shadow-sm"
                          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-1">
                        {item.label}
                        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${expDropdownOpen ? 'rotate-180' : ''}`} />
                      </span>
                    </button>

                    {/* Dropdown */}
                    <AnimatePresence>
                      {expDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -6, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -6, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-44 rounded-xl bg-black/90 border border-white/20 backdrop-blur-xl shadow-2xl overflow-hidden z-50"
                        >
                          {item.dropdownItems!.map((sub) => {
                            const isSubActive = activeStep === sub.step;
                            return (
                              <button
                                key={sub.step}
                                onClick={() => handleItemClick(sub.step)}
                                onMouseEnter={() => soundFX.playHover()}
                                className={`w-full text-left px-4 py-2.5 text-xs font-mono font-semibold transition-all ${
                                  isSubActive
                                    ? 'bg-white/15 text-white'
                                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                                }`}
                              >
                                {sub.label}
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.step)}
                  onMouseEnter={() => soundFX.playHover()}
                  className={`relative px-3 py-1.5 rounded-full text-[11px] font-mono font-semibold transition-all ${
                    isActive
                      ? 'text-white'
                      : 'text-white/50 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 rounded-full bg-white/15 border border-white/30 shadow-sm"
                      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {item.highlight && <Sparkles className={`w-3 h-3 ${isActive ? 'text-white' : 'text-white/70'} animate-pulse`} />}
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Controls: Settings Button & Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Settings Button */}
            <button
              onClick={() => {
                soundFX.playClick();
                onOpenSettings();
              }}
              onMouseEnter={() => soundFX.playHover()}
              title="System & Audio Settings"
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all group active:scale-95"
            >
              <Settings className="w-4 h-4 text-cyan-400 group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => {
                soundFX.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="md:hidden w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>

        {/* Mobile Drawer Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="md:hidden mt-2 glass-panel rounded-2xl p-4 shadow-xl backdrop-blur-2xl"
            >
              <div className="flex flex-col gap-1">
                {NAV_ITEMS.map((item) => {
                  const isActive = activeSection === item.id;

                  if (item.hasDropdown) {
                    return (
                      <div key={item.id}>
                        <button
                          onClick={() => {
                            soundFX.playClick();
                            setMobileExpDropdownOpen(!mobileExpDropdownOpen);
                          }}
                          className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-between ${
                            isActive
                              ? 'bg-white/20 text-white border border-white/30'
                              : 'text-white/60 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <span>{item.label}</span>
                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileExpDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {mobileExpDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-6 flex flex-col gap-1 mt-1">
                                {item.dropdownItems!.map((sub) => {
                                  const isSubActive = activeStep === sub.step;
                                  return (
                                    <button
                                      key={sub.step}
                                      onClick={() => handleItemClick(sub.step)}
                                      className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        isSubActive
                                          ? 'bg-white/15 text-white'
                                          : 'text-white/50 hover:bg-white/5 hover:text-white'
                                      }`}
                                    >
                                      {sub.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.step)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-between ${
                        isActive
                          ? 'bg-white/20 text-white border border-white/30'
                          : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.highlight && <Sparkles className="w-3.5 h-3.5 text-white" />}
                    </button>
                  );
                })}

                {/* Mobile Settings Row */}
                <div className="pt-2 border-t border-white/10 mt-1">
                  <button
                    onClick={() => {
                      soundFX.playClick();
                      setMobileMenuOpen(false);
                      onOpenSettings();
                    }}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-cyan-400 hover:bg-white/5 flex items-center justify-between transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      <span>Settings / Pengaturan</span>
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </AnimatePresence>
  );
};
