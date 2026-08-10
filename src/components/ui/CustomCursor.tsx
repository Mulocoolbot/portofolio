import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const onMouseEnter = () => setIsVisible(true);
    const onMouseLeave = () => setIsVisible(false);

    // Track clickable elements for cursor expand effect
    const onElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('interactive-hover')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousemove', onElementHover);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousemove', onElementHover);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [isVisible]);

  // Don't render custom cursor on mobile touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  if (!isVisible) return null;

  return (
    <>
      {/* Center Small White Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-white rounded-full pointer-events-none z-50"
        animate={{
          x: mousePosition.x - 5,
          y: mousePosition.y - 5,
          scale: isHovered ? 0 : 1,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 400, mass: 0.1 }}
      />

      {/* Trailing Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-50 border border-white/40"
        animate={{
          x: mousePosition.x - (isHovered ? 26 : 16),
          y: mousePosition.y - (isHovered ? 26 : 16),
          width: isHovered ? 52 : 32,
          height: isHovered ? 52 : 32,
          backgroundColor: isHovered ? 'rgba(79, 195, 247, 0.08)' : 'transparent',
          borderColor: isHovered ? 'rgba(79, 195, 247, 0.5)' : 'rgba(255, 255, 255, 0.3)',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 250, mass: 0.2 }}
      />
    </>
  );
};
