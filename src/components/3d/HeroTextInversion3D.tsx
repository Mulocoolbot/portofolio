import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export const maskModeUniform = { value: 0.0 };

interface StencilInversionHeroTextProps {
  activeStep: number;
  position?: [number, number, number];
}

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTextMap;
  uniform sampler2D uNeuronMask;
  uniform vec2 uResolution;

  varying vec2 vUv;

  void main() {
    vec4 textSample = texture2D(uTextMap, vUv);
    if (textSample.a < 0.05) discard;

    // Exact screen-space UV coordinate for this pixel
    vec2 screenUv = gl_FragCoord.xy / uResolution;

    // Sample multi-channel mask:
    // R > 0.2: 3D Neuron Solid Body / Axon Line
    // G > 0.2: Neuron Tag Pill Card Background
    // B > 0.2: Neuron Tag Text / Step Badge Icon
    vec4 maskPixel = texture2D(uNeuronMask, screenUv);

    float hasNeuron = maskPixel.r > 0.2 ? 1.0 : 0.0;
    float hasCard = maskPixel.g > 0.2 ? 1.0 : 0.0;
    float hasTagText = maskPixel.b > 0.2 ? 1.0 : 0.0;

    // Total overlapping active layers at this pixel
    float overlapCount = hasNeuron + hasCard + hasTagText;

    // True Parity / XOR Even-Odd Inversion:
    // 0 overlaps (Empty Space): Pure Solid White (#ffffff)
    // 1 overlap  (Individual Asset): 1st Inversion -> Solid Black (#000000)
    // 2 overlaps (Simultaneous Assets / Tag text over card): 2nd Inversion -> Solid White (#ffffff)
    // 3 overlaps: 3rd Inversion -> Solid Black (#000000)
    if (mod(overlapCount, 2.0) > 0.5) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, textSample.a);
    } else {
      gl_FragColor = vec4(1.0, 1.0, 1.0, textSample.a);
    }
  }
`;

export const StencilInversionHeroText: React.FC<StencilInversionHeroTextProps> = ({
  activeStep,
  position = [0, -0.9, 0.4]
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { gl, scene, camera, size, viewport } = useThree();

  const aspect = size.width / Math.max(1, size.height);
  const isMobile = aspect < 0.62 || size.width < 640;
  const isTablet = !isMobile && (aspect < 1.15 || size.width <= 1024);

  const fullSubtitle = "WELCOME TO WORLD OF";
  const fullTitle = "MULLO";

  const [typedSubtitle, setTypedSubtitle] = useState("");
  const [typedTitle, setTypedTitle] = useState("");
  const [isSubtitleDone, setIsSubtitleDone] = useState(false);
  const [isTitleDone, setIsTitleDone] = useState(false);

  // Typewriter animation on mount
  useEffect(() => {
    let subIdx = 0;
    let titleIdx = 0;

    const timer = setTimeout(() => {
      const subInterval = setInterval(() => {
        if (subIdx < fullSubtitle.length) {
          subIdx++;
          setTypedSubtitle(fullSubtitle.slice(0, subIdx));
        } else {
          clearInterval(subInterval);
          setIsSubtitleDone(true);

          setTimeout(() => {
            const titleInterval = setInterval(() => {
              if (titleIdx < fullTitle.length) {
                titleIdx++;
                setTypedTitle(fullTitle.slice(0, titleIdx));
              } else {
                clearInterval(titleInterval);
                setIsTitleDone(true);
              }
            }, 105);
          }, 180);
        }
      }, 45);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // 2D High-Res Canvas for crisp, enlarged typography
  const { textCanvas, textTexture } = useMemo(() => {
    const w = 2048;
    const h = 1024;

    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;

    const tex = new THREE.CanvasTexture(c);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;

    return { textCanvas: c, textTexture: tex };
  }, []);

  // Render enlarged text onto canvas texture whenever typed text or screen mode updates
  useEffect(() => {
    const ctx = textCanvas.getContext('2d');
    if (!ctx) return;

    const w = textCanvas.width;
    const h = textCanvas.height;

    ctx.clearRect(0, 0, w, h);

    if (isMobile) {
      // Mobile Viewport Typography (Centered inside the open oval ring, guaranteed no clipping, no letter overlap)
      const subText = typedSubtitle + (!isSubtitleDone ? "_" : "");
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 42px "JetBrains Mono", monospace, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = '4px';
      ctx.fillText(subText, w / 2, 280);

      const titleText = typedTitle + (isSubtitleDone && !isTitleDone ? "_" : "");
      ctx.font = '900 240px "Outfit", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = '3px';
      ctx.fillText(titleText, w / 2, 620);
    } else if (isTablet) {
      // iPad / Tablet Viewport Typography (Centered inside the open constellation ring, guaranteed no clipping)
      const subText = typedSubtitle + (!isSubtitleDone ? "_" : "");
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 44px "JetBrains Mono", monospace, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = '6px';
      ctx.fillText(subText, w / 2, 280);

      const titleText = typedTitle + (isSubtitleDone && !isTitleDone ? "_" : "");
      ctx.font = '900 260px "Outfit", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = '4px';
      ctx.fillText(titleText, w / 2, 620);
    } else {
      // Desktop Viewport Typography
      const subText = typedSubtitle + (!isSubtitleDone ? "_" : "");
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 48px "JetBrains Mono", monospace, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = '10px';
      ctx.fillText(subText, w / 2, 280);

      const titleText = typedTitle + (isSubtitleDone && !isTitleDone ? "_" : "");
      ctx.font = '900 290px "Outfit", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = '6px';
      ctx.fillText(titleText, w / 2, 620);
    }

    textTexture.needsUpdate = true;
  }, [typedSubtitle, typedTitle, isSubtitleDone, isTitleDone, isMobile, isTablet, textCanvas, textTexture]);

  // Dedicated Render Target for capturing exact 3D neuron silhouette
  const maskRenderTarget = useMemo(() => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const target = new THREE.WebGLRenderTarget(
      Math.max(256, Math.floor(window.innerWidth * dpr)),
      Math.max(256, Math.floor(window.innerHeight * dpr)),
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
      }
    );
    return target;
  }, []);

  // Resize render target on window resize
  useEffect(() => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    maskRenderTarget.setSize(
      Math.max(256, Math.floor(size.width * dpr)),
      Math.max(256, Math.floor(size.height * dpr))
    );
  }, [size, maskRenderTarget]);

  // Uniforms for the Inversion Shader
  const uniforms = useMemo(() => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    return {
      uTextMap: { value: textTexture },
      uNeuronMask: { value: maskRenderTarget.texture },
      uResolution: { value: new THREE.Vector2(size.width * dpr, size.height * dpr) },
    };
  }, [textTexture, maskRenderTarget, size]);

  // Multi-pass render loop:
  // Pass 1: Render 3D neuron network into maskRenderTarget (captures exact 3D geometry shape)
  // Pass 2: Main screen render uses mask to invert text pixel-by-pixel
  useFrame((_state) => {
    if (activeStep === 0 && meshRef.current && materialRef.current) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      materialRef.current.uniforms.uResolution.value.set(size.width * dpr, size.height * dpr);

      // Hide text plane during mask capture pass
      meshRef.current.visible = false;

      // Pass 1: Set Mask Capture Mode on all Layer 1 Neuron & Tag assets
      maskModeUniform.value = 1.0;
      camera.layers.set(1);
      gl.setRenderTarget(maskRenderTarget);
      gl.clear();
      gl.render(scene, camera);

      // Pass 2: Restore Screen Render Mode on all assets & reveal inverted text
      maskModeUniform.value = 0.0;
      camera.layers.set(0);
      camera.layers.enable(1);
      gl.setRenderTarget(null);
      meshRef.current.visible = true;
      materialRef.current.uniforms.uNeuronMask.value = maskRenderTarget.texture;
    }

    if (groupRef.current) {
      // Smooth hide when entering story steps (activeStep >= 1)
      const targetScale = activeStep === 0 ? 1.0 : 0.001;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12);

      // Responsive vertical positioning centered in the open constellation
      const targetPosY = isMobile ? 0.08 : isTablet ? 0.05 : -0.05;
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetPosY, 0.10);
    }
  });

  // Responsive 3D plane dimensions adapted to viewport width
  const planeWidth = isMobile
    ? Math.min(2.30, viewport.width * 0.72)
    : isTablet
    ? Math.min(3.20, viewport.width * 0.65)
    : Math.min(5.40, viewport.width * 0.55);

  const planeHeight = planeWidth * (isMobile ? 0.55 : isTablet ? 0.52 : 0.48);

  return (
    <group ref={groupRef} position={position}>
      <mesh ref={meshRef} position={[0, 0, 0]} renderOrder={50}>
        <planeGeometry args={[planeWidth, planeHeight]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent={true}
          depthTest={false}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};
