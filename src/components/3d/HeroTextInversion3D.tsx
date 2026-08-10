import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

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

    // Sample the exact rendered 3D neuron silhouette from the offscreen mask
    vec4 neuronPixel = texture2D(uNeuronMask, screenUv);

    // If the 3D neuron geometry / axon line is present at this pixel (luminance > 0.05):
    // The text inverts to SOLID BLACK (#000000) matching the EXACT 3D faceted geometry!
    // Otherwise it renders PURE WHITE (#ffffff)!
    if (neuronPixel.r > 0.05 || neuronPixel.g > 0.05 || neuronPixel.b > 0.05) {
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

  const { gl, scene, camera, size } = useThree();

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

  // Render enlarged text onto canvas texture whenever typed text updates
  useEffect(() => {
    const ctx = textCanvas.getContext('2d');
    if (!ctx) return;

    const w = textCanvas.width;
    const h = textCanvas.height;

    ctx.clearRect(0, 0, w, h);

    // Subtitle (Enlarged and bold)
    const subText = typedSubtitle + (!isSubtitleDone ? "_" : "");
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 56px "JetBrains Mono", monospace, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '18px';
    ctx.fillText(subText, w / 2, 260);

    // Main Title "MULLO" (Grand, bold, enlarged)
    const titleText = typedTitle + (isSubtitleDone && !isTitleDone ? "_" : "");
    ctx.font = '900 320px "Outfit", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '-4px';
    ctx.fillText(titleText, w / 2, 590);

    textTexture.needsUpdate = true;
  }, [typedSubtitle, typedTitle, isSubtitleDone, isTitleDone, textCanvas, textTexture]);

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

      // Render 3D scene (neurons, lines, sparks) to mask render target
      gl.setRenderTarget(maskRenderTarget);
      gl.clear();
      gl.render(scene, camera);

      // Restore screen render target and reveal text
      gl.setRenderTarget(null);
      meshRef.current.visible = true;
      materialRef.current.uniforms.uNeuronMask.value = maskRenderTarget.texture;
    }

    if (groupRef.current) {
      // Smooth hide when entering story steps (activeStep >= 1)
      const targetScale = activeStep === 0 ? 1.0 : 0.001;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12);
    }
  });

  // Enlarged plane dimensions to accommodate larger text
  const planeWidth = 8.2;
  const planeHeight = 4.1;

  return (
    <group ref={groupRef} position={position}>
      <mesh ref={meshRef} position={[0, 0, 0]} renderOrder={100}>
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

// Backwards compatibility alias for Hero3DCanvas
interface StencilInversionTextProps {
  text?: string;
  subtext?: string;
  position?: [number, number, number];
  fontSize?: number;
}

export const StencilInversionText: React.FC<StencilInversionTextProps> = () => {
  return <StencilInversionHeroText activeStep={0} />;
};
