import React from 'react';
import { Float } from '@react-three/drei';

export const FloatingShapes: React.FC = () => {
  return (
    <group>
      {/* Top Left Floating Torus */}
      <Float speed={1.2} rotationIntensity={1.5} floatIntensity={1.5} position={[-3.8, 2.2, -2]}>
        <mesh scale={0.35}>
          <torusGeometry args={[1, 0.25, 16, 32]} />
          <meshStandardMaterial
            color="#27272a"
            wireframe
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      </Float>

      {/* Bottom Right Floating Octahedron */}
      <Float speed={1.6} rotationIntensity={1.2} floatIntensity={1.8} position={[4.2, -2.5, -1]}>
        <mesh scale={0.45}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#18181b"
            roughness={0.25}
            metalness={0.75}
          />
        </mesh>
      </Float>

      {/* Far Background Floating Ring */}
      <Float speed={1.0} rotationIntensity={0.6} floatIntensity={0.8} position={[0, -3.5, -4]}>
        <mesh scale={2.2} rotation={[Math.PI / 4, 0, 0]}>
          <ringGeometry args={[1.8, 1.84, 64]} />
          <meshBasicMaterial color="#d4d4d8" side={2} wireframe />
        </mesh>
      </Float>

      {/* Additional Top Right Minimalist Box */}
      <Float speed={1.4} rotationIntensity={1.0} floatIntensity={1.2} position={[3.2, 3.0, -3]}>
        <mesh scale={0.3}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color="#52525b"
            wireframe
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
      </Float>
    </group>
  );
};
