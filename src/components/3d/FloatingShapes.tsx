import React from 'react';
import { Float } from '@react-three/drei';

export const FloatingShapes: React.FC = () => {
  return (
    <group>
      {/* Top Left Floating Torus */}
      <Float speed={1.5} rotationIntensity={2} floatIntensity={2} position={[-3.5, 2.5, -2]}>
        <mesh scale={0.4}>
          <torusGeometry args={[1, 0.25, 16, 32]} />
          <meshStandardMaterial
            color="#8a2be2"
            wireframe
            roughness={0.1}
            metalness={0.9}
            emissive="#8a2be2"
            emissiveIntensity={0.6}
          />
        </mesh>
      </Float>

      {/* Bottom Right Floating Octahedron */}
      <Float speed={2} rotationIntensity={1.8} floatIntensity={2} position={[3.8, -2.2, -1]}>
        <mesh scale={0.5}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#00f2fe"
            roughness={0.2}
            metalness={0.8}
            emissive="#00f2fe"
            emissiveIntensity={0.4}
          />
        </mesh>
      </Float>

      {/* Far Background Floating Ring */}
      <Float speed={1.2} rotationIntensity={0.8} floatIntensity={1} position={[0, -3.5, -4]}>
        <mesh scale={1.8} rotation={[Math.PI / 4, 0, 0]}>
          <ringGeometry args={[1.6, 1.65, 64]} />
          <meshBasicMaterial color="#f72585" side={2} wireframe />
        </mesh>
      </Float>
    </group>
  );
};
