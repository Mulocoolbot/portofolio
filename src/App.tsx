import React, { useState, useEffect } from 'react';
import { Navbar } from './components/ui/Navbar';
import { HeroSection } from './components/ui/HeroSection';
import { AboutBento } from './components/ui/AboutBento';
import { ProjectsSection } from './components/ui/ProjectsSection';
import { LabSection } from './components/ui/LabSection';
import { ContactSection } from './components/ui/ContactSection';
import { Footer } from './components/ui/Footer';
import { CustomCursor } from './components/ui/CustomCursor';

export const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Scroll spy to update active section in navbar
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'projects', 'lab', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-slate-100 relative selection:bg-cyber-cyan selection:text-black">
      {/* Custom Interactive Glow Cursor */}
      <CustomCursor />

      {/* Floating Modern Navbar */}
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} />

      {/* Main Content Sections */}
      <main className="relative z-10">
        <HeroSection onNavigate={handleNavigate} />
        <AboutBento />
        <ProjectsSection />
        <LabSection />
        <ContactSection />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default App;
