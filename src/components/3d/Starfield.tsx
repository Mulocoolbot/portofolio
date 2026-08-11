import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Procedural crisp star dot texture with soft glow falloff
function createStarDotTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, 64, 64);

    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
    gradient.addColorStop(0.15, 'rgba(255, 255, 255, 0.9)');
    gradient.addColorStop(0.4, 'rgba(220, 235, 255, 0.4)');
    gradient.addColorStop(0.8, 'rgba(180, 210, 255, 0.08)');
    gradient.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(32, 32, 30, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

export const Starfield: React.FC = () => {
  const deepStarsRef = useRef<THREE.Points>(null);
  const foregroundStarsRef = useRef<THREE.Points>(null);

  const starTexture = useMemo(() => createStarDotTexture(), []);

  // ── Layer 1: Deep Cosmic Background Stars (1,200 small sharp stars) ────────
  const deepStarsData = useMemo(() => {
    const count = 1200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Spherical shell distribution for realistic depth
      const radius = 12 + Math.random() * 28;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Subtle monochromatic and blue-white tint variation
      const brightness = 0.55 + Math.random() * 0.45;
      const tint = Math.random();
      if (tint > 0.7) {
        // Slightly cool starlight
        colors[i3] = brightness * 0.9;
        colors[i3 + 1] = brightness * 0.95;
        colors[i3 + 2] = brightness * 1.0;
      } else {
        // Pure crisp white
        colors[i3] = brightness;
        colors[i3 + 1] = brightness;
        colors[i3 + 2] = brightness;
      }

      phases[i] = Math.random() * Math.PI * 2;
    }

    return { positions, colors, phases, count };
  }, []);

  // ── Layer 2: Foreground Twinkling Accent Stars (350 glittering stars) ─────
  const fgStarsData = useMemo(() => {
    const count = 350;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 6 + Math.random() * 14;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      const brightness = 0.7 + Math.random() * 0.3;
      colors[i3] = brightness;
      colors[i3 + 1] = brightness;
      colors[i3 + 2] = brightness;

      phases[i] = Math.random() * Math.PI * 2;
    }

    return { positions, colors, phases, count };
  }, []);

  useFrame((_state, delta) => {
    // Ultra-slow cosmic drift
    if (deepStarsRef.current) {
      deepStarsRef.current.rotation.y += delta * 0.003;
      deepStarsRef.current.rotation.x += delta * 0.0015;
    }

    if (foregroundStarsRef.current) {
      foregroundStarsRef.current.rotation.y += delta * 0.006;
      foregroundStarsRef.current.rotation.z += delta * 0.003;
    }
  });

  return (
    <group>
      {/* Deep Background Stars */}
      <points ref={deepStarsRef} frustumCulled={false} renderOrder={-5}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={deepStarsData.count}
            array={deepStarsData.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={deepStarsData.count}
            array={deepStarsData.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.16}
          map={starTexture}
          transparent={true}
          opacity={0.85}
          vertexColors={true}
          depthWrite={false}
          sizeAttenuation={true}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>

      {/* Foreground Glittering Stars */}
      <points ref={foregroundStarsRef} frustumCulled={false} renderOrder={-4}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={fgStarsData.count}
            array={fgStarsData.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={fgStarsData.count}
            array={fgStarsData.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.24}
          map={starTexture}
          transparent={true}
          opacity={0.92}
          vertexColors={true}
          depthWrite={false}
          sizeAttenuation={true}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>
    </group>
  );
};
