import React, { Suspense, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { NeuronNetwork, NEURON_SPATIAL_ANCHORS, NeuronInversionData } from './NeuronNetwork';
import { StencilInversionHeroText } from './HeroTextInversion3D';

interface CameraFlightControllerProps {
  activeStep: number; // 0 = Overview, 1 to 9 = Story Nodes 1 to 9
  mouseRef: React.MutableRefObject<{ x: number; y: number; targetX: number; targetY: number; vx: number; vy: number }>;
}

const CameraFlightController: React.FC<CameraFlightControllerProps> = ({ activeStep, mouseRef }) => {
  const { camera } = useThree();

  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const targetCamPos = useMemo(() => new THREE.Vector3(0, 0, 7.5), []);
  const targetLookAt = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useFrame((_state, _delta) => {
    const mouse = mouseRef.current;

    // Smoothly interpolate mouse coordinates
    mouse.x = THREE.MathUtils.lerp(mouse.x, mouse.targetX, 0.08);
    mouse.y = THREE.MathUtils.lerp(mouse.y, mouse.targetY, 0.08);

    if (activeStep === 0) {
      // ── Step 0: Overview of the entire Neural Universe ──────────────────
      const parallaxX = mouse.x * 0.35;
      const parallaxY = mouse.y * 0.28;

      targetCamPos.set(parallaxX, parallaxY, 7.5);
      targetLookAt.set(parallaxX * 0.2, parallaxY * 0.2, 0);
    } else {
      // ── Step 1 to 9: Frame 3D Neuron Node on the LEFT (opposite the Card on Right)
      const storyIdx = activeStep - 1;
      const anchor = NEURON_SPATIAL_ANCHORS[storyIdx] || [0, 0, 0];

      const isDesktop = window.innerWidth > 768;
      // On desktop: offset camera by +0.65 so neuron sits in a balanced space slightly to the right (X ≈ 32%)
      const cameraOffsetX = isDesktop ? 0.65 : 0.0;
      const cameraOffsetY = isDesktop ? 0.0 : 0.50; // On mobile, shift camera down so node sits in upper half
      const lookAtOffsetX = isDesktop ? 0.65 : 0.0;

      const parallaxX = mouse.x * 0.10;
      const parallaxY = mouse.y * 0.08;

      targetCamPos.set(
        anchor[0] + cameraOffsetX + parallaxX,
        anchor[1] + cameraOffsetY + parallaxY,
        anchor[2] + (isDesktop ? 2.45 : 2.8)
      );

      targetLookAt.set(
        anchor[0] + lookAtOffsetX,
        anchor[1] + (isDesktop ? 0.0 : 0.08),
        anchor[2]
      );
    }

    // Smooth cinematic damping towards target camera position & lookAt
    camera.position.lerp(targetCamPos, 0.065);
    currentLookAt.current.lerp(targetLookAt, 0.075);
    camera.lookAt(currentLookAt.current);
  });

  return null;
};

interface Background3DCanvasProps {
  activeStep: number;
  onSelectNode?: (storyIndex: number) => void;
}

export const Background3DCanvas: React.FC<Background3DCanvasProps> = ({ activeStep, onSelectNode }) => {
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, vx: 0, vy: 0 });
  const neuronDataRef = useRef<NeuronInversionData>({
    positions: [],
    radii: [],
    lines: [],
  });

  useEffect(() => {
    // Global Cursor Tracker in NDC [-1, 1]
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

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-auto -z-10 overflow-hidden bg-[#000000]">
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        onCreated={({ scene, gl }) => {
          scene.background = new THREE.Color('#000000');
          gl.setClearColor('#000000', 1);
        }}
        camera={{ position: [0, 0, 7.5], fov: 46 }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={1.0} color="#ffffff" />
          <directionalLight position={[10, 15, 10]} intensity={1.8} color="#ffffff" />
          <directionalLight position={[-10, -10, -5]} intensity={0.9} color="#d4d4d8" />

          {/* 3D Camera Flight Interpolator */}
          <CameraFlightController activeStep={activeStep} mouseRef={mouseRef} />

          {/* Solid White 3D Neural Network */}
          <NeuronNetwork
            activeStep={activeStep}
            mouseRef={mouseRef}
            neuronDataRef={neuronDataRef}
            onSelectNode={onSelectNode}
          />

          {/* Dynamic Color Inversion Hero Text: "WELCOME TO WORLD OF" & "MULLO" */}
          <StencilInversionHeroText
            activeStep={activeStep}
            position={[0, -0.9, 0.4]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
