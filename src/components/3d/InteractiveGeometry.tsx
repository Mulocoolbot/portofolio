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
  writeStencil?: boolean;
}

export const InteractiveGeometry: React.FC<InteractiveGeometryProps> = ({
  type = 'icosahedron',
  wireframe = false,
  color = '#000000',
  speed = 1,
  interactive = true,
  scale = 1.6,
  writeStencil = true
}) => {
  const rotationGroupRef = useRef<THREE.Group>(null);
  const tiltGroupRef = useRef<THREE.Group>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!rotationGroupRef.current || !tiltGroupRef.current) return;

    // Smooth continuous auto-rotation
    rotationGroupRef.current.rotation.x += delta * 0.35 * speed;
    rotationGroupRef.current.rotation.y += delta * 0.5 * speed;

    // Mouse tilt interaction with smooth lerp
    if (interactive) {
      targetRotation.current.x = (state.pointer.y * Math.PI) / 5;
      targetRotation.current.y = (state.pointer.x * Math.PI) / 5;

      tiltGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        tiltGroupRef.current.rotation.x,
        targetRotation.current.x,
        0.05
      );
      tiltGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        tiltGroupRef.current.rotation.y,
        targetRotation.current.y,
        0.05
      );
    }
  });

  const stencilProps = writeStencil
    ? {
        stencilWrite: true,
        stencilRef: 1,
        stencilFunc: THREE.AlwaysStencilFunc,
        stencilZPass: THREE.ReplaceStencilOp,
      }
    : {};

  const renderGeometry = () => {
    switch (type) {
      case 'torusKnot':
        return (
          <mesh scale={scale * 0.8} renderOrder={1}>
            <torusKnotGeometry args={[1, 0.38, 128, 32, 2, 3]} />
            <meshStandardMaterial
              color={color}
              wireframe={wireframe}
              roughness={0.4}
              metalness={0.1}
              {...stencilProps}
            />
          </mesh>
        );

      case 'wavePlane':
        return (
          <mesh rotation={[-Math.PI / 3, 0, 0]} scale={scale * 1.2} renderOrder={1}>
            <planeGeometry args={[3, 3, 32, 32]} />
            <MeshWobbleMaterial
              color={color}
              wireframe={wireframe}
              factor={0.7}
              speed={speed * 1.2}
              roughness={0.4}
              metalness={0.1}
              {...stencilProps}
            />
          </mesh>
        );

      case 'quantumCube':
        return (
          <group scale={scale * 0.9} renderOrder={1}>
            {/* Outer Cube */}
            <mesh>
              <boxGeometry args={[1.8, 1.8, 1.8]} />
              <meshStandardMaterial
                color={color}
                wireframe={wireframe}
                roughness={0.4}
                metalness={0.1}
                {...stencilProps}
              />
            </mesh>
            {/* Inner Core */}
            <mesh scale={0.7}>
              <octahedronGeometry args={[1, 0]} />
              <meshStandardMaterial
                color="#000000"
                roughness={0.3}
                metalness={0.2}
                {...stencilProps}
              />
            </mesh>
          </group>
        );

      case 'particleVortex':
        return (
          <mesh scale={scale} renderOrder={1}>
            <sphereGeometry args={[1.3, 64, 64]} />
            <MeshDistortMaterial
              color={color}
              wireframe={wireframe}
              distort={0.5}
              speed={speed * 1.8}
              roughness={0.4}
              metalness={0.1}
              {...stencilProps}
            />
          </mesh>
        );

      case 'icosahedron':
      default:
        return (
          <mesh scale={scale} renderOrder={1}>
            <icosahedronGeometry args={[1.4, 1]} />
            <MeshDistortMaterial
              color={color}
              wireframe={wireframe}
              distort={0.35}
              speed={speed * 1.2}
              roughness={0.4}
              metalness={0.1}
              {...stencilProps}
            />
          </mesh>
        );
    }
  };

  return (
    <group ref={tiltGroupRef}>
      <Float speed={1.8} rotationIntensity={0.8} floatIntensity={1.4}>
        <group ref={rotationGroupRef}>
          {renderGeometry()}
        </group>
      </Float>
    </group>
  );
};
