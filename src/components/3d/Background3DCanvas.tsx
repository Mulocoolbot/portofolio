import React, { Suspense, useRef, useEffect, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { NeuronNetwork, NEURON_SPATIAL_ANCHORS, NeuronInversionData } from './NeuronNetwork';
import { StencilInversionHeroText } from './HeroTextInversion3D';
import { Starfield } from './Starfield';
import { CosmicEvents } from './CosmicEvents';

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
      const cameraOffsetX = isDesktop ? 0.65 : 0.0;
      const cameraOffsetY = isDesktop ? 0.0 : 0.50;
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

  // ── Drag-to-Rotate State ───────────────────────────────────────────────
  const dragRef = useRef({
    isDragging: false,
    isPending: false,
    startX: 0,
    startY: 0,
    rotationY: 0,
    rotationX: 0,
    velocityY: 0,
    velocityX: 0,
  });

  // Track which neuron story index the cursor is hovering (-1 = none)
  // This is set every frame by NeuronNetwork's screen-space projection check
  const hoveredNeuronRef = useRef(-1);

  const DRAG_THRESHOLD = 5;

  // Stable callback ref so the event listener always has the latest onSelectNode
  const onSelectNodeRef = useRef(onSelectNode);
  onSelectNodeRef.current = onSelectNode;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;

      const drag = dragRef.current;

      // Check if pending drag should become active (movement threshold reached)
      if (drag.isPending && !drag.isDragging) {
        const dx = e.clientX - drag.startX;
        const dy = e.clientY - drag.startY;
        if (Math.sqrt(dx * dx + dy * dy) > DRAG_THRESHOLD) {
          drag.isDragging = true;
          drag.isPending = false;
        }
      }

      // Continue drag rotation if actually dragging
      if (drag.isDragging) {
        const deltaX = e.clientX - drag.startX;
        const deltaY = e.clientY - drag.startY;
        drag.velocityY = deltaX * 0.003;
        drag.velocityX = deltaY * 0.003;
        drag.rotationY += drag.velocityY;
        drag.rotationX += drag.velocityX;
        drag.startX = e.clientX;
        drag.startY = e.clientY;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      // Only prepare drag if NOT hovering a neuron node
      if (hoveredNeuronRef.current < 0) {
        dragRef.current.isPending = true;
        dragRef.current.isDragging = false;
        dragRef.current.startX = e.clientX;
        dragRef.current.startY = e.clientY;
      }
    };

    const handleMouseUp = () => {
      const wasDragging = dragRef.current.isDragging;
      dragRef.current.isDragging = false;
      dragRef.current.isPending = false;

      // ── DOM-level click detection for neuron nodes ──
      // If the user didn't drag (simple click) and a neuron is hovered,
      // fire onSelectNode to navigate to that neuron's detail section.
      if (!wasDragging && hoveredNeuronRef.current >= 0 && onSelectNodeRef.current) {
        onSelectNodeRef.current(hoveredNeuronRef.current);
      }
    };

    // Touch Support for Mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.targetX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouseRef.current.targetY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
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
        onCreated={({ scene, gl, camera }) => {
          scene.background = new THREE.Color('#000000');
          gl.setClearColor('#000000', 1);
          camera.layers.enable(1);
        }}
        camera={{ position: [0, 0, 7.5], fov: 46 }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={1.0} color="#ffffff" />
          <directionalLight position={[10, 15, 10]} intensity={1.8} color="#ffffff" />
          <directionalLight position={[-10, -10, -5]} intensity={0.9} color="#d4d4d8" />

          {/* Twinkling Cosmic Background Starfield Asset */}
          <Starfield />

          {/* 1-Minute Asteroids & 5-Minute Cascading Meteor Showers */}
          <CosmicEvents />

          {/* 3D Camera Flight Interpolator */}
          <CameraFlightController activeStep={activeStep} mouseRef={mouseRef} />

          {/* Solid White 3D Neural Network */}
          <NeuronNetwork
            activeStep={activeStep}
            mouseRef={mouseRef}
            neuronDataRef={neuronDataRef}
            onSelectNode={onSelectNode}
            dragRef={dragRef}
            hoveredNeuronRef={hoveredNeuronRef}
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
