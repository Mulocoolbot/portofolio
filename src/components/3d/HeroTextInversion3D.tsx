import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface StencilInversionTextProps {
  text?: string;
  subtext?: string;
  position?: [number, number, number];
  fontSize?: number;
}

export const StencilInversionText: React.FC<StencilInversionTextProps> = ({
  text = "PORTOFOLIO\nMULLO.3D",
  subtext = "Interactive 3D Web & Creative Developer",
  position = [-3.2, 0.4, 0],
  fontSize = 0.72
}) => {
  return (
    <group position={position}>
      {/* 1. BLACK TEXT PASS: Only rendered where stencil != 1 (over white background) */}
      <group renderOrder={2}>
        <Text
          position={[0, 0, 0]}
          fontSize={fontSize}
          lineHeight={1.05}
          letterSpacing={-0.03}
          anchorX="left"
          anchorY="middle"
          textAlign="left"
          fontWeight="bold"
        >
          {text}
          <meshBasicMaterial
            color="#09090b"
            stencilWrite={true}
            stencilRef={1}
            stencilFunc={THREE.NotEqualStencilFunc}
            depthTest={false}
          />
        </Text>

        {subtext && (
          <Text
            position={[0, -1.2, 0]}
            fontSize={0.2}
            lineHeight={1.4}
            anchorX="left"
            anchorY="middle"
            textAlign="left"
          >
            {subtext}
            <meshBasicMaterial
              color="#52525b"
              stencilWrite={true}
              stencilRef={1}
              stencilFunc={THREE.NotEqualStencilFunc}
              depthTest={false}
            />
          </Text>
        )}
      </group>

      {/* 2. WHITE TEXT PASS: Only rendered where stencil == 1 (over dark 3D object) */}
      <group renderOrder={3}>
        <Text
          position={[0, 0, 0]}
          fontSize={fontSize}
          lineHeight={1.05}
          letterSpacing={-0.03}
          anchorX="left"
          anchorY="middle"
          textAlign="left"
          fontWeight="bold"
        >
          {text}
          <meshBasicMaterial
            color="#ffffff"
            stencilWrite={true}
            stencilRef={1}
            stencilFunc={THREE.EqualStencilFunc}
            depthTest={false}
          />
        </Text>

        {subtext && (
          <Text
            position={[0, -1.2, 0]}
            fontSize={0.2}
            lineHeight={1.4}
            anchorX="left"
            anchorY="middle"
            textAlign="left"
          >
            {subtext}
            <meshBasicMaterial
              color="#ffffff"
              stencilWrite={true}
              stencilRef={1}
              stencilFunc={THREE.EqualStencilFunc}
              depthTest={false}
            />
          </Text>
        )}
      </group>
    </group>
  );
};
