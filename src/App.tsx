import React, { useState, useEffect } from 'react';
import { Background3DCanvas } from './components/3d/Background3DCanvas';
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
    <div className="min-h-screen bg-transparent relative font-sans text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Full-Page Interactive 3D Background with scaled-down sleek objects */}
      <Background3DCanvas />

      {/* Custom Interactive Monochrome Cursor */}
      <CustomCursor />

      {/* Floating Modern Frosted Navbar */}
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} />

      {/* Main Content (Un-isolated stacking context for global blend-mode) */}
      <main>
        <HeroSection onNavigate={handleNavigate} />
        <AboutBento />
        <ProjectsSection />
        <LabSection />
        <ContactSection />
      </main>

      {/* Global Clean Footer */}
      <Footer />
    </div>
  );
};

export default App;
