import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { ParticleField } from './ParticleField';
import { InteractiveGeometry } from './InteractiveGeometry';
import { FloatingShapes } from './FloatingShapes';

interface BackgroundSceneProps {
  scrollYProgress: number;
  mouseRef: React.MutableRefObject<{ x: number; y: number; targetX: number; targetY: number; vx: number; vy: number }>;
}

const BackgroundScene: React.FC<BackgroundSceneProps> = ({ scrollYProgress, mouseRef }) => {
  const groupRef = useRef<THREE.Group>(null);
  const centralMeshGroup = useRef<THREE.Group>(null);
  const secondaryMeshGroup = useRef<THREE.Group>(null);
  const tertiaryMeshGroup = useRef<THREE.Group>(null);
  const prevMouse = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    const mouse = mouseRef.current;

    // Smoothly interpolate current mouse position toward target
    mouse.x = THREE.MathUtils.lerp(mouse.x, mouse.targetX, 0.08);
    mouse.y = THREE.MathUtils.lerp(mouse.y, mouse.targetY, 0.08);

    // Calculate cursor velocity for dynamic spin impulse
    const vx = mouse.x - prevMouse.current.x;
    const vy = mouse.y - prevMouse.current.y;
    prevMouse.current.x = mouse.x;
    prevMouse.current.y = mouse.y;

    if (groupRef.current) {
      // Background moves UP (+Y) when scrolling DOWN, and moves DOWN (-Y) when scrolling UP
      const targetScrollY = scrollYProgress * 7.5;
      const scrollRotX = -scrollYProgress * Math.PI * 0.25;
      
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetScrollY, 0.06);
      
      // Scene perspective tilts towards the cursor direction
      const targetSceneRotY = mouse.x * 0.45;
      const targetSceneRotX = -mouse.y * 0.35 + scrollRotX * 0.2;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetSceneRotY, 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetSceneRotX, 0.05);
    }

    // 1. Primary Central 3D Mesh: Follows cursor position and rotates along cursor movement vector
    if (centralMeshGroup.current) {
      const targetMeshX = mouse.x * 3.4;
      const targetMeshY = mouse.y * 2.2 + 0.1;
      
      centralMeshGroup.current.position.x = THREE.MathUtils.lerp(centralMeshGroup.current.position.x, targetMeshX, 0.08);
      centralMeshGroup.current.position.y = THREE.MathUtils.lerp(centralMeshGroup.current.position.y, targetMeshY, 0.08);
      
      // Dynamic roll & tilt based on cursor velocity & direction
      centralMeshGroup.current.rotation.z += vx * 1.8;
      centralMeshGroup.current.rotation.x += vy * 1.5;
    }

    // 2. Secondary Mesh: Parallax counter-movement for rich depth
    if (secondaryMeshGroup.current) {
      secondaryMeshGroup.current.position.x = THREE.MathUtils.lerp(
        secondaryMeshGroup.current.position.x,
        -1.8 - mouse.x * 1.0,
        0.05
      );
      secondaryMeshGroup.current.position.y = THREE.MathUtils.lerp(
        secondaryMeshGroup.current.position.y,
        -3.8 - mouse.y * 0.8,
        0.05
      );
    }

    // 3. Tertiary Mesh: Rises during deep scroll
    if (tertiaryMeshGroup.current) {
      tertiaryMeshGroup.current.position.x = THREE.MathUtils.lerp(
        tertiaryMeshGroup.current.position.x,
        1.8 + mouse.x * 0.8,
        0.05
      );
      tertiaryMeshGroup.current.position.y = THREE.MathUtils.lerp(
        tertiaryMeshGroup.current.position.y,
        -7.2 + mouse.y * 0.6,
        0.05
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Crisp Lighting Setup */}
      <ambientLight intensity={0.4} color="#ffffff" />
      <directionalLight position={[10, 15, 10]} intensity={1.0} color="#ffffff" />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} color="#e4e4e7" />

      {/* Reactive Monochrome Particle Swarm */}
      <ParticleField count={450} color="#000000" speed={0.3} />

      {/* Primary Central Mesh - Sleek scale (1.25) tracking cursor across the entire page */}
      <group ref={centralMeshGroup} position={[0, 0, 0]}>
        <InteractiveGeometry
          type="icosahedron"
          wireframe={false}
          color="#000000"
          speed={0.8}
          interactive={true}
          scale={1.25}
        />
      </group>

      {/* Secondary Accent Geometry - Rises gracefully as you scroll down */}
      <group ref={secondaryMeshGroup} position={[-1.8, -3.8, -0.5]}>
        <InteractiveGeometry
          type="torusKnot"
          wireframe={false}
          color="#000000"
          speed={0.6}
          interactive={true}
          scale={0.95}
        />
      </group>

      {/* Tertiary Accent Geometry - Rises in lower sections */}
      <group ref={tertiaryMeshGroup} position={[1.8, -7.2, -0.8]}>
        <InteractiveGeometry
          type="quantumCube"
          wireframe={false}
          color="#000000"
          speed={0.7}
          interactive={true}
          scale={0.9}
        />
      </group>

      {/* Floating Geometric Ornaments */}
      <FloatingShapes />
    </group>
  );
};

export const Background3DCanvas: React.FC = () => {
  const scrollRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, vx: 0, vy: 0 });

  useEffect(() => {
    // Global Scroll Tracker
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        scrollRef.current = window.scrollY / totalScroll;
      }
    };

    // Global Cursor Direction & Position Tracker
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    // Touch Support for Mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.targetX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouseRef.current.targetY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-white">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        onCreated={({ scene }) => {
          scene.background = new THREE.Color('#ffffff');
        }}
        camera={{ position: [0, 0, 7], fov: 45 }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={45} />
        <Suspense fallback={null}>
          <BackgroundScene scrollYProgress={scrollRef.current} mouseRef={mouseRef} />
        </Suspense>
      </Canvas>
    </div>
  );
};
