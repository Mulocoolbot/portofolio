import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { InteractiveGeometry } from './InteractiveGeometry';
import { ParticleField } from './ParticleField';
import { FloatingShapes } from './FloatingShapes';

interface Hero3DCanvasProps {
  type?: 'icosahedron' | 'torusKnot' | 'wavePlane' | 'quantumCube' | 'particleVortex';
  wireframe?: boolean;
  color?: string;
  speed?: number;
  interactive?: boolean;
  className?: string;
}

export const Hero3DCanvas: React.FC<Hero3DCanvasProps> = ({
  type = 'icosahedron',
  wireframe = false,
  color = '#00f2fe',
  speed = 1,
  interactive = true,
  className = "w-full h-full"
}) => {
  return (
    <div className={`relative ${className}`}>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={45} />
        
        {/* Cinematic Ambient & Point Lights */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={1.2} color="#8a2be2" />
        <pointLight position={[0, 5, 5]} intensity={1.0} color="#00f2fe" />
        
        <Suspense fallback={null}>
          <ParticleField count={1000} color={color} speed={speed} />
          <InteractiveGeometry
            type={type}
            wireframe={wireframe}
            color={color}
            speed={speed}
            interactive={interactive}
          />
          <FloatingShapes />
        </Suspense>
      </Canvas>
    </div>
  );
};
