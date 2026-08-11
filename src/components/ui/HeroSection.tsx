import React from 'react';

interface HeroSectionProps {
  activeStep: number;
  onStartExplore: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ activeStep, onStartExplore }) => {
  if (activeStep !== 0) return null;

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-end items-center pb-14 sm:pb-16 px-4 sm:px-6 lg:px-8 select-none pointer-events-none z-10"
    >
      {/* Screen-reader accessible title for SEO */}
      <div className="sr-only">
        <p>WELCOME TO WORLD OF</p>
        <h1>MULLO - Creative Technologist &amp; 3D Web Architect</h1>
      </div>
    </section>
  );
};

