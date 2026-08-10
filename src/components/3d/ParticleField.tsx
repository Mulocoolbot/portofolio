import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFieldProps {
  count?: number;
  color?: string;
  speed?: number;
}

export const ParticleField: React.FC<ParticleFieldProps> = ({
  count = 800,
  color = '#27272a',
  speed = 0.3
}) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate random 3D points
  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sc = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 24;
      pos[i3 + 1] = (Math.random() - 0.5) * 24;
      pos[i3 + 2] = (Math.random() - 0.5) * 18;
      sc[i] = Math.random() * 0.7 + 0.3;
    }
    return [pos, sc];
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.03 * speed;
    pointsRef.current.rotation.x += delta * 0.015 * speed;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-scale"
          count={scales.length}
          array={scales}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color={color}
        transparent
        opacity={0.4}
        depthWrite={false}
      />
    </points>
  );
};
