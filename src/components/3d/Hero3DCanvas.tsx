import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { InteractiveGeometry } from './InteractiveGeometry';
import { ParticleField } from './ParticleField';
import { FloatingShapes } from './FloatingShapes';
import { StencilInversionText } from './HeroTextInversion3D';

interface Hero3DCanvasProps {
  type?: 'icosahedron' | 'torusKnot' | 'wavePlane' | 'quantumCube' | 'particleVortex';
  wireframe?: boolean;
  color?: string;
  speed?: number;
  interactive?: boolean;
  className?: string;
  customText?: string;
  subtext?: string;
  showText?: boolean;
}

interface SceneContentProps {
  type: 'icosahedron' | 'torusKnot' | 'wavePlane' | 'quantumCube' | 'particleVortex';
  wireframe: boolean;
  color: string;
  speed: number;
  interactive: boolean;
  customText: string;
  subtext: string;
  showText: boolean;
}

const SceneContent: React.FC<SceneContentProps> = ({
  type,
  wireframe,
  color,
  speed,
  interactive,
  customText,
  subtext,
  showText
}) => {
  const meshHolderRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshHolderRef.current && interactive) {
      // Smooth movement following cursor across the text
      const targetX = (state.pointer.x * 2.2);
      const targetY = (state.pointer.y * 1.5);
      
      meshHolderRef.current.position.x = THREE.MathUtils.lerp(meshHolderRef.current.position.x, targetX, 0.08);
      meshHolderRef.current.position.y = THREE.MathUtils.lerp(meshHolderRef.current.position.y, targetY, 0.08);
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} color="#ffffff" />
      <directionalLight position={[10, 15, 10]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-10, -10, -5]} intensity={0.4} color="#e4e4e7" />

      {/* Floating Monochrome Particles */}
      <ParticleField count={400} color="#18181b" speed={speed * 0.4} />

      {/* 3D Black Geometric Object that glides under text */}
      <group ref={meshHolderRef} position={[0.8, -0.1, 0]}>
        <InteractiveGeometry
          type={type}
          wireframe={wireframe}
          color={color}
          speed={speed}
          interactive={interactive}
          scale={2.2}
          writeStencil={true}
        />
      </group>

      {/* Text that splits into black & white along the 3D object border */}
      {showText && (
        <StencilInversionText
          text={customText}
          subtext={subtext}
          position={[-2.4, 0.2, 0.5]}
          fontSize={0.65}
        />
      )}

      <FloatingShapes />
    </>
  );
};

export const Hero3DCanvas: React.FC<Hero3DCanvasProps> = ({
  type = 'icosahedron',
  wireframe = false,
  color = '#000000',
  speed = 1,
  interactive = true,
  className = "w-full h-full",
  customText = "PORTOFOLIO\nMULLO.3D",
  subtext = "Interactive 3D Web & Creative Developer",
  showText = false
}) => {
  return (
    <div className={`relative ${className}`}>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, stencil: true, alpha: false, powerPreference: 'high-performance' }}
        onCreated={({ scene }) => {
          scene.background = new THREE.Color('#ffffff');
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 6.5]} fov={45} />
        
        <Suspense fallback={null}>
          <SceneContent
            type={type}
            wireframe={wireframe}
            color={color}
            speed={speed}
            interactive={interactive}
            customText={customText}
            subtext={subtext}
            showText={showText}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
