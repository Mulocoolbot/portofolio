import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface InteractiveGeometryProps {
  type?: 'icosahedron' | 'torusKnot' | 'wavePlane' | 'quantumCube' | 'particleVortex';
  wireframe?: boolean;
  color?: string;
  speed?: number;
  interactive?: boolean;
  scale?: number;
}

export const InteractiveGeometry: React.FC<InteractiveGeometryProps> = ({
  type = 'icosahedron',
  wireframe = false,
  color = '#00f2fe',
  speed = 1,
  interactive = true,
  scale = 1.6
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!meshRef.current || !groupRef.current) return;

    // Smooth continuous auto-rotation
    meshRef.current.rotation.x += delta * 0.4 * speed;
    meshRef.current.rotation.y += delta * 0.6 * speed;

    // Mouse tilt interaction with smooth lerp
    if (interactive) {
      targetRotation.current.x = (state.pointer.y * Math.PI) / 6;
      targetRotation.current.y = (state.pointer.x * Math.PI) / 6;

      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotation.current.x,
        0.05
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation.current.y,
        0.05
      );
    }
  });

  const renderGeometry = () => {
    switch (type) {
      case 'torusKnot':
        return (
          <mesh ref={meshRef} scale={scale * 0.8}>
            <torusKnotGeometry args={[1, 0.35, 128, 32, 2, 3]} />
            <meshStandardMaterial
              color={color}
              wireframe={wireframe}
              roughness={0.15}
              metalness={0.85}
              emissive={color}
              emissiveIntensity={wireframe ? 0.6 : 0.2}
            />
          </mesh>
        );

      case 'wavePlane':
        return (
          <mesh ref={meshRef} rotation={[-Math.PI / 3, 0, 0]} scale={scale * 1.2}>
            <planeGeometry args={[3, 3, 32, 32]} />
            <MeshWobbleMaterial
              color={color}
              wireframe={wireframe}
              factor={0.8}
              speed={speed * 1.5}
              roughness={0.2}
              metalness={0.7}
            />
          </mesh>
        );

      case 'quantumCube':
        return (
          <group ref={meshRef} scale={scale * 0.9}>
            {/* Outer Cube */}
            <mesh>
              <boxGeometry args={[1.8, 1.8, 1.8]} />
              <meshStandardMaterial
                color={color}
                wireframe={true}
                emissive={color}
                emissiveIntensity={0.8}
              />
            </mesh>
            {/* Inner Solid Core */}
            <mesh scale={0.6}>
              <octahedronGeometry args={[1, 0]} />
              <meshStandardMaterial
                color="#ffffff"
                roughness={0.1}
                metalness={0.9}
                emissive={color}
                emissiveIntensity={0.5}
              />
            </mesh>
          </group>
        );

      case 'particleVortex':
        return (
          <mesh ref={meshRef} scale={scale}>
            <sphereGeometry args={[1.3, 64, 64]} />
            <MeshDistortMaterial
              color={color}
              wireframe={wireframe}
              distort={0.6}
              speed={speed * 2}
              roughness={0.1}
              metalness={0.9}
              emissive={color}
              emissiveIntensity={0.3}
            />
          </mesh>
        );

      case 'icosahedron':
      default:
        return (
          <mesh ref={meshRef} scale={scale}>
            <icosahedronGeometry args={[1.4, 1]} />
            <MeshDistortMaterial
              color={color}
              wireframe={wireframe}
              distort={0.4}
              speed={speed * 1.5}
              roughness={0.15}
              metalness={0.85}
              emissive={color}
              emissiveIntensity={wireframe ? 0.5 : 0.25}
            />
          </mesh>
        );
    }
  };

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
        {renderGeometry()}
      </Float>
    </group>
  );
};
