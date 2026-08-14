import React from 'react';

interface HeroSectionProps {
  activeStep: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ activeStep }) => {
  if (activeStep !== 0) return null;

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-end items-center pb-14 sm:pb-16 px-4 sm:px-6 lg:px-8 select-none pointer-events-none z-10"
    >
      {/* Screen-reader accessible title for SEO */}
      <div className="sr-only">
        <p>WELCOME TO WORLD OF</p>
        <h1>Ahmad Mulia Saputra (Mullo) — Informatics Student | Web Developer | UI/UX Enthusiast</h1>
      </div>
    </section>
  );
};

