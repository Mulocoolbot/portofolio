import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Meteor {
  id: number;
  startPos: THREE.Vector3;
  endPos: THREE.Vector3;
  currentPos: THREE.Vector3;
  startTime: number;
  duration: number;
  scale: number;
  rotSpeed: THREE.Vector3;
  rotation: THREE.Euler;
  tailLength: number;
  brightness: number;
  active: boolean;
  isShower: boolean;
  sparks: { offset: THREE.Vector3; size: number; alpha: number }[];
}

const MAX_METEORS = 32;
const SINGLE_ASTEROID_INTERVAL = 60; // Every 1 minute
const METEOR_SHOWER_INTERVAL = 300;   // Every 5 minutes

// Generate random crossing trajectories from side to side
function generateTrajectory(isShower: boolean, showerAngleOffset: number = 0): { start: THREE.Vector3; end: THREE.Vector3; duration: number; scale: number } {
  const side = isShower ? Math.floor(showerAngleOffset) % 4 : Math.floor(Math.random() * 4);
  const zDepth = (Math.random() - 0.5) * 3.5; // Depth near neural universe
  const start = new THREE.Vector3();
  const end = new THREE.Vector3();

  const jitterX = (Math.random() - 0.5) * 7;
  const jitterY = (Math.random() - 0.5) * 5;

  if (side === 0) {
    // Top-Left to Bottom-Right
    start.set(-16 + jitterX, 11 + Math.random() * 3, zDepth);
    end.set(16 + jitterX, -11 - Math.random() * 3, zDepth + (Math.random() - 0.5) * 2);
  } else if (side === 1) {
    // Top-Right to Bottom-Left
    start.set(16 + jitterX, 11 + Math.random() * 3, zDepth);
    end.set(-16 + jitterX, -11 - Math.random() * 3, zDepth + (Math.random() - 0.5) * 2);
  } else if (side === 2) {
    // Left-Bottom to Right-Top
    start.set(-17, -8 + jitterY, zDepth);
    end.set(17, 8 + jitterY, zDepth + (Math.random() - 0.5) * 2);
  } else {
    // Right to Left Diagonal
    start.set(17, 7 + jitterY, zDepth);
    end.set(-17, -7 + jitterY, zDepth + (Math.random() - 0.5) * 2);
  }

  // Fast, graceful shooting speed
  const duration = isShower ? 1.6 + Math.random() * 1.2 : 2.2 + Math.random() * 1.0;
  // Tiny sleek glowing core (small & delicate)
  const scale = isShower ? 0.035 + Math.random() * 0.025 : 0.05 + Math.random() * 0.03;

  return { start, end, duration, scale };
}

export const CosmicEvents: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  const nextSingleAsteroidTimeRef = useRef(7); // First preview at 7s, then every 60s
  const nextMeteorShowerTimeRef = useRef(METEOR_SHOWER_INTERVAL); // 300s (5 mins)

  const meteorsRef = useRef<Meteor[]>([]);

  // Pre-create textures & materials for glowing light trails and particle sparks
  const { coreGeom, coreMat, trailGeom, trailMat, innerGlowTex, outerGlowTex, sparkGeom, sparkMat } = useMemo(() => {
    // Small faceted octahedron for crystalline star core
    const cGeom = new THREE.OctahedronGeometry(1, 0);

    // Glowing core material
    const cMat = new THREE.MeshBasicMaterial({
      color: '#ffffff',
      toneMapped: false,
    });

    // Trail geometry (2 segments per meteor: Head -> Mid -> Tail for smooth taper)
    const tGeom = new THREE.BufferGeometry();
    const trailPositions = new Float32Array(MAX_METEORS * 4 * 3); // 2 connected line segments = 4 vertices
    const trailColors = new Float32Array(MAX_METEORS * 4 * 4);
    tGeom.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    tGeom.setAttribute('color', new THREE.BufferAttribute(trailColors, 4));

    const tMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });

    // 1. Inner intense radial glow
    const c1 = document.createElement('canvas');
    c1.width = 64;
    c1.height = 64;
    const ctx1 = c1.getContext('2d');
    if (ctx1) {
      const grad1 = ctx1.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad1.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
      grad1.addColorStop(0.25, 'rgba(255, 255, 255, 0.85)');
      grad1.addColorStop(0.55, 'rgba(220, 240, 255, 0.35)');
      grad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx1.fillStyle = grad1;
      ctx1.fillRect(0, 0, 64, 64);
    }
    const inTex = new THREE.CanvasTexture(c1);

    // 2. Outer soft celestial halo
    const c2 = document.createElement('canvas');
    c2.width = 64;
    c2.height = 64;
    const ctx2 = c2.getContext('2d');
    if (ctx2) {
      const grad2 = ctx2.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad2.addColorStop(0, 'rgba(200, 235, 255, 0.7)');
      grad2.addColorStop(0.4, 'rgba(160, 210, 255, 0.25)');
      grad2.addColorStop(0.8, 'rgba(140, 190, 255, 0.06)');
      grad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx2.fillStyle = grad2;
      ctx2.fillRect(0, 0, 64, 64);
    }
    const outTex = new THREE.CanvasTexture(c2);

    const sGeom = new THREE.OctahedronGeometry(1, 0);
    const sMat = new THREE.MeshBasicMaterial({
      color: '#ffffff',
      transparent: true,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });

    return {
      coreGeom: cGeom,
      coreMat: cMat,
      trailGeom: tGeom,
      trailMat: tMat,
      innerGlowTex: inTex,
      outerGlowTex: outTex,
      sparkGeom: sGeom,
      sparkMat: sMat,
    };
  }, []);

  // Initialize pool of meteors
  useMemo(() => {
    meteorsRef.current = Array.from({ length: MAX_METEORS }, (_, idx) => ({
      id: idx,
      startPos: new THREE.Vector3(),
      endPos: new THREE.Vector3(),
      currentPos: new THREE.Vector3(-999, -999, -999),
      startTime: 0,
      duration: 2.5,
      scale: 0.05,
      rotSpeed: new THREE.Vector3(1, 1, 1),
      rotation: new THREE.Euler(),
      tailLength: 4.5,
      brightness: 1,
      active: false,
      isShower: false,
      sparks: [
        { offset: new THREE.Vector3(), size: 0.02, alpha: 0.8 },
        { offset: new THREE.Vector3(), size: 0.015, alpha: 0.6 },
        { offset: new THREE.Vector3(), size: 0.012, alpha: 0.4 },
      ],
    }));
  }, []);

  const spawnMeteor = (currentTime: number, isShower: boolean, showerAngle: number = 0, delay: number = 0) => {
    const meteor = meteorsRef.current.find((m) => !m.active);
    if (!meteor) return;

    const { start, end, duration, scale } = generateTrajectory(isShower, showerAngle);
    meteor.startPos.copy(start);
    meteor.endPos.copy(end);
    meteor.currentPos.copy(start);
    meteor.startTime = currentTime + delay;
    meteor.duration = duration;
    meteor.scale = scale;
    // Extended luminous trail (3.8 to 5.8 units)
    meteor.tailLength = isShower ? 3.6 + Math.random() * 1.8 : 4.4 + Math.random() * 2.2;
    meteor.rotSpeed.set(
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 8
    );
    meteor.brightness = 0.9 + Math.random() * 0.3;
    meteor.active = true;
    meteor.isShower = isShower;
  };

  useFrame((_state, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;

    // ── 1. Trigger 5-Minute Cascading Meteor Shower ──────────────────────
    if (t >= nextMeteorShowerTimeRef.current) {
      nextMeteorShowerTimeRef.current = t + METEOR_SHOWER_INTERVAL;
      const showerAngle = Math.floor(Math.random() * 4);
      const showerCount = 20 + Math.floor(Math.random() * 8); // 20-28 shooting stars

      for (let i = 0; i < showerCount; i++) {
        const delay = (i / showerCount) * 4.2 + Math.random() * 0.35;
        spawnMeteor(t, true, showerAngle, delay);
      }
    }

    // ── 2. Trigger 1-Minute Asteroid Streak (every 60s) ───────────────────
    if (t >= nextSingleAsteroidTimeRef.current) {
      nextSingleAsteroidTimeRef.current = t + SINGLE_ASTEROID_INTERVAL;
      spawnMeteor(t, false);
      if (Math.random() > 0.55) {
        spawnMeteor(t, false, 0, 0.3 + Math.random() * 0.5);
      }
    }

    // ── 3. Animate All Active Glowing Meteors & Light Trails ──────────────
    const trailPosAttr = trailGeom.getAttribute('position') as THREE.BufferAttribute;
    const trailColAttr = trailGeom.getAttribute('color') as THREE.BufferAttribute;
    const trailPosArr = trailPosAttr.array as Float32Array;
    const trailColArr = trailColAttr.array as Float32Array;

    const children = groupRef.current ? groupRef.current.children : [];

    for (let i = 0; i < meteorsRef.current.length; i++) {
      const m = meteorsRef.current[i];
      const meshGroup = children[i] as THREE.Group | undefined;

      if (!m.active || t < m.startTime) {
        if (meshGroup) meshGroup.visible = false;
        // Zero out trail segments
        const pOffset = i * 12;
        const cOffset = i * 16;
        for (let k = 0; k < 12; k++) trailPosArr[pOffset + k] = 0;
        for (let k = 0; k < 16; k++) trailColArr[cOffset + k] = 0;
        continue;
      }

      const elapsed = t - m.startTime;
      const progress = elapsed / m.duration;

      if (progress >= 1) {
        m.active = false;
        if (meshGroup) meshGroup.visible = false;
        continue;
      }

      // Interpolate shooting path
      m.currentPos.lerpVectors(m.startPos, m.endPos, progress);

      m.rotation.x += m.rotSpeed.x * delta;
      m.rotation.y += m.rotSpeed.y * delta;
      m.rotation.z += m.rotSpeed.z * delta;

      const easeAlpha = Math.sin(progress * Math.PI);

      // Update 3D Glowing Head Group
      if (meshGroup) {
        meshGroup.visible = true;
        meshGroup.position.copy(m.currentPos);
        meshGroup.rotation.copy(m.rotation);
        const dynamicScale = easeAlpha * m.scale;
        meshGroup.scale.set(dynamicScale, dynamicScale, dynamicScale);
      }

      // Compute trail direction vector
      const dir = new THREE.Vector3().subVectors(m.endPos, m.startPos).normalize();
      const fullTailLength = m.tailLength * easeAlpha;

      // Segment 1: Head to Midpoint
      const midPos = new THREE.Vector3().copy(m.currentPos).sub(dir.clone().multiplyScalar(fullTailLength * 0.35));
      // Segment 2: Midpoint to Tail Tip
      const tailPos = new THREE.Vector3().copy(m.currentPos).sub(dir.clone().multiplyScalar(fullTailLength));

      const pOffset = i * 12;
      // Line 1: Head -> Mid
      trailPosArr[pOffset + 0] = m.currentPos.x;
      trailPosArr[pOffset + 1] = m.currentPos.y;
      trailPosArr[pOffset + 2] = m.currentPos.z;

      trailPosArr[pOffset + 3] = midPos.x;
      trailPosArr[pOffset + 4] = midPos.y;
      trailPosArr[pOffset + 5] = midPos.z;

      // Line 2: Mid -> Tail
      trailPosArr[pOffset + 6] = midPos.x;
      trailPosArr[pOffset + 7] = midPos.y;
      trailPosArr[pOffset + 8] = midPos.z;

      trailPosArr[pOffset + 9] = tailPos.x;
      trailPosArr[pOffset + 10] = tailPos.y;
      trailPosArr[pOffset + 11] = tailPos.z;

      const cOffset = i * 16;
      const headAlpha = easeAlpha * m.brightness;

      // Vertex 0 (Head - pure radiant white)
      trailColArr[cOffset + 0] = 1.0; trailColArr[cOffset + 1] = 1.0; trailColArr[cOffset + 2] = 1.0; trailColArr[cOffset + 3] = headAlpha;
      // Vertex 1 (Mid start - bright cyan-white)
      trailColArr[cOffset + 4] = 0.9; trailColArr[cOffset + 5] = 0.95; trailColArr[cOffset + 6] = 1.0; trailColArr[cOffset + 7] = headAlpha * 0.65;
      // Vertex 2 (Mid end)
      trailColArr[cOffset + 8] = 0.9; trailColArr[cOffset + 9] = 0.95; trailColArr[cOffset + 10] = 1.0; trailColArr[cOffset + 11] = headAlpha * 0.65;
      // Vertex 3 (Tail tip - smooth fade out to 0)
      trailColArr[cOffset + 12] = 0.7; trailColArr[cOffset + 13] = 0.85; trailColArr[cOffset + 14] = 1.0; trailColArr[cOffset + 15] = 0.0;
    }

    trailPosAttr.needsUpdate = true;
    trailColAttr.needsUpdate = true;
  });

  return (
    <group>
      {/* Glowing Star Heads + Dual Layer Celestial Glow Sprites */}
      <group ref={groupRef}>
        {meteorsRef.current.map((m) => (
          <group key={m.id} visible={false}>
            {/* Tiny faceted luminous core */}
            <mesh geometry={coreGeom} material={coreMat} scale={[1.2, 1.2, 1.2]} />

            {/* Inner Intense Glow Aura */}
            <sprite scale={[5.0, 5.0, 1]}>
              <spriteMaterial
                map={innerGlowTex}
                transparent={true}
                opacity={0.95}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                toneMapped={false}
              />
            </sprite>

            {/* Outer Soft Celestial Light Flare */}
            <sprite scale={[10.0, 10.0, 1]}>
              <spriteMaterial
                map={outerGlowTex}
                transparent={true}
                opacity={0.7}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                toneMapped={false}
              />
            </sprite>
          </group>
        ))}
      </group>

      {/* Radiant Glowing Motion Trail Streaks (Additive Blending) */}
      <lineSegments geometry={trailGeom} material={trailMat} renderOrder={-1} />
    </group>
  );
};
