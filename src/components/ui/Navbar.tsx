import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Menu, X, Sparkles, Terminal } from 'lucide-react';
import { soundFX } from './SoundEffects';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    soundFX.setEnabled(nextState);
    if (nextState) soundFX.playClick();
  };

  const navItems = [
    { id: 'hero', label: 'Overview' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'lab', label: 'Skills' },
    { id: 'contact', label: 'Contact', highlight: true },
  ];

  const handleItemClick = (id: string) => {
    soundFX.playClick();
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-4 left-0 right-0 z-40 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pointer-events-auto">
      <nav className="glass-panel rounded-full px-5 py-2.5 flex items-center justify-between shadow-sm backdrop-blur-xl">
        {/* Brand / Logo */}
        <button
          onClick={() => handleItemClick('hero')}
          className="flex items-center gap-2.5 group focus:outline-none"
          onMouseEnter={() => soundFX.playHover()}
        >
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <Terminal className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-bold text-sm sm:text-base tracking-tight text-white font-mono">
              MULLO<span className="text-white/50">.3D</span>
            </span>
            <span className="text-[10px] text-white/40 -mt-1 font-mono">Neural Universe</span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full px-2 py-1 border border-white/10">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                onMouseEnter={() => soundFX.playHover()}
                className={`relative px-4 py-1.5 rounded-full text-xs font-mono font-semibold transition-all ${
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

        {/* Controls & Status Badge */}
        <div className="flex items-center gap-3">
          {/* Status Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-white/60 font-mono font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span>Interactive 3D</span>
          </div>

          {/* Sound FX Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Mute Interface Sound' : 'Unmute Interface Sound'}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-white" />
            ) : (
              <VolumeX className="w-4 h-4 text-white/30" />
            )}
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
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-between ${
                    activeSection === item.id
                      ? 'bg-white/20 text-white border border-white/30'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.highlight && <Sparkles className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
