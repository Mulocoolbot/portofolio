import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { NEURON_STORY_DATA } from '../../data/neuronStoryData';

// ── Neuron Node Data Structure ─────────────────────────────────────────────
export interface NeuronNode {
  id: number;
  storyIndex: number; // 0 to 8 for the 9 primary interactive story nodes, -1 for connective satellites
  label: string;
  category: string;
  zoneCenter: THREE.Vector3;
  position: THREE.Vector3;
  phase: number;
  pulseSpeed: number;
  rotSpeed: { x: number; y: number; z: number };
  radius: number;
  geometryType: 'octa' | 'dodeca' | 'icosa' | 'box';
  isMain: boolean;
  currentHoverScale: number;
}

interface Spark {
  progress: number;
  speed: number;
  connIdx: number;
}

export interface NeuronInversionData {
  positions: THREE.Vector3[];
  radii: number[];
  lines: THREE.Vector4[];
}

// 18 Structured Spatial Anchors with generous 3D clearance:
// Nodes 0 to 8 correspond to the 9 Story Chapters
export const NEURON_SPATIAL_ANCHORS: [number, number, number][] = [
  // ── 9 Primary Interactive Story Nodes ────────────────────────────────────
  [0.0, -0.6, 0.4],     // 0: MULLO (Passes right behind Hero text at Step 0)
  [-2.2, 1.4, 0.2],     // 1: ABOUT ME (Upper-Left)
  [2.2, 1.5, 0.1],      // 2: EXPERIENCE - ORGANIZATIONAL (Upper-Right)
  [2.8, 0.2, -0.2],     // 3: EXPERIENCE - PROFESSIONAL (Mid-Right)
  [1.8, -1.2, 0.3],     // 4: PROJECT (Lower-Right)
  [-0.1, -1.7, 0.3],    // 5: SKILL (Lower-Center, across "MULLO" title)
  [-2.2, -1.1, -0.1],   // 6: EDUCATION (Lower-Left)
  [-2.9, 0.2, 0.1],     // 7: CERTIFICATE (Mid-Left)
  [0.0, 0.3, 0.8],      // 8: CONTACT (Center Foreground)

  // ── 9 Supporting Connective Satellites ──────────────────────────────────
  [-3.5, 1.8, -0.5],    // 9: Outer Deep Left
  [3.5, 1.7, -0.5],     // 10: Outer Deep Right
  [0.0, 2.3, -0.3],     // 11: Top Zenith
  [-3.4, -1.8, -0.3],   // 12: Bottom Outer Left
  [3.4, -1.7, -0.3],    // 13: Bottom Outer Right
  [0.0, -2.7, -0.4],    // 14: Bottom Nadir
  [-1.4, 0.6, -1.2],    // 15: Deep Background Left
  [1.4, 0.7, -1.2],     // 16: Deep Background Right
  [0.0, 0.0, -1.4],     // 17: Deep Core
];

const SATELLITE_LABELS = [
  'GLSL', 'SHADERS', 'WEBGL', 'ALGORITHMS', 'R3F', 'AUDIO FFT', 'BLENDER', 'SYSTEMS', 'OPTIMIZE'
];

const MAX_CONN_DIST = 3.9;
const SPARK_COUNT = 24;
const BLOOM_DURATION = 1.4;

// Clean high-contrast monochrome 3D billboard text badge with depthTest disabled
function createSolidWhiteBadgeTexture(text: string, isMain: boolean, isStory: boolean, stepNum?: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, 512, 128);

    // High-contrast solid dark pill with crisp solid white border
    ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = isStory ? 4.5 : 2.5;

    const x = 16;
    const y = 16;
    const w = 480;
    const h = 96;
    const r = 48;

    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Solid white step badge if story node
    if (isStory && stepNum !== undefined) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(68, 64, 24, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#000000';
      ctx.font = 'bold 24px "JetBrains Mono", monospace, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`0${stepNum}`, 68, 65);
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(68, 64, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Solid white text label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 34px "JetBrains Mono", monospace, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, isStory ? 108 : 96, 64);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

// Generate neuron nodes with assigned spatial positions
function createNeurons(): NeuronNode[] {
  const neurons: NeuronNode[] = [];

  for (let i = 0; i < NEURON_SPATIAL_ANCHORS.length; i++) {
    const anchor = NEURON_SPATIAL_ANCHORS[i];
    const zonePos = new THREE.Vector3(anchor[0], anchor[1], anchor[2]);
    const isStory = i < 9;
    const storyItem = isStory ? NEURON_STORY_DATA[i] : null;

    const label = storyItem ? storyItem.label : SATELLITE_LABELS[i - 9] || `NODE ${i}`;
    const category = storyItem ? storyItem.category : 'tech';
    const geom: ('octa' | 'dodeca' | 'icosa' | 'box') = (['icosa', 'dodeca', 'octa', 'icosa', 'dodeca', 'octa', 'icosa', 'dodeca', 'icosa'] as const)[i % 9];

    neurons.push({
      id: i,
      storyIndex: isStory ? i : -1,
      label,
      category,
      isMain: isStory,
      geometryType: geom,
      zoneCenter: zonePos.clone(),
      position: new THREE.Vector3(0, 0, 0),
      phase: (i / NEURON_SPATIAL_ANCHORS.length) * Math.PI * 2,
      pulseSpeed: 0.6 + (i % 3) * 0.25,
      rotSpeed: {
        x: 0.4 + (i % 4) * 0.15,
        y: 0.5 + (i % 3) * 0.18,
        z: 0.3 + (i % 5) * 0.12,
      },
      radius: isStory ? 0.30 : 0.18,
      currentHoverScale: 1.0,
    });
  }
  return neurons;
}

// Interconnected axon lines based on structured zone proximity
function createConnections(neurons: NeuronNode[]): [number, number][] {
  const connections: [number, number][] = [];
  
  // 1. Guaranteed sequential story path connections
  for (let i = 0; i < 9; i++) {
    const next = (i + 1) % 9;
    connections.push([i, next]);
  }

  // 2. Star connections from central core (Node 0) to other key nodes
  connections.push([0, 2]);
  connections.push([0, 4]);
  connections.push([0, 5]);
  connections.push([0, 6]);
  connections.push([0, 7]);

  // 3. Proximity connections for satellites and supporting network
  for (let i = 0; i < neurons.length; i++) {
    for (let j = i + 1; j < neurons.length; j++) {
      const dist = neurons[i].zoneCenter.distanceTo(neurons[j].zoneCenter);
      if (dist < MAX_CONN_DIST) {
        const exists = connections.some(([a, b]) => (a === i && b === j) || (a === j && b === i));
        if (!exists) {
          connections.push([i, j]);
        }
      }
    }
  }
  return connections;
}

interface NeuronNetworkProps {
  activeStep: number; // 0 = Overview, 1 to 9 = Story Nodes 1 to 9
  mouseRef: React.MutableRefObject<{ x: number; y: number; targetX: number; targetY: number }>;
  neuronDataRef?: React.MutableRefObject<NeuronInversionData>;
  onSelectNode?: (storyIndex: number) => void;
}

export const NeuronNetwork: React.FC<NeuronNetworkProps> = ({ activeStep, mouseRef, neuronDataRef, onSelectNode }) => {
  const groupRef = useRef<THREE.Group>(null);
  const nodeGroupsRef = useRef<(THREE.Group | null)[]>([]);
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const spriteRefs = useRef<(THREE.Sprite | null)[]>([]);
  const linesRef = useRef<THREE.LineSegments>(null);
  const sparkGroupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  const entranceElapsedRef = useRef(0);

  const { neurons, connections, sparks, linePositionsArray, badgeTextures } = useMemo(() => {
    const n = createNeurons();
    const c = createConnections(n);

    const s: Spark[] = [];
    for (let i = 0; i < SPARK_COUNT; i++) {
      s.push({
        progress: Math.random(),
        speed: 0.18 + Math.random() * 0.22,
        connIdx: Math.floor(Math.random() * c.length),
      });
    }

    const linePos = new Float32Array(c.length * 2 * 3);
    const textures = n.map((item) =>
      createSolidWhiteBadgeTexture(item.label, item.isMain, item.storyIndex >= 0, item.storyIndex >= 0 ? item.storyIndex + 1 : undefined)
    );

    return { neurons: n, connections: c, sparks: s, linePositionsArray: linePos, badgeTextures: textures };
  }, []);

  const projectedVec = useMemo(() => new THREE.Vector3(), []);
  const originPos = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useFrame((state, delta) => {
    timeRef.current += delta;
    entranceElapsedRef.current += delta;

    const t = timeRef.current;
    const elapsed = entranceElapsedRef.current;
    const mouse = mouseRef.current;

    // Opening Bloom Transition: quartic ease-out expansion from center
    const p = Math.min(1, elapsed / BLOOM_DURATION);
    const bloomEase = 1 - Math.pow(1 - p, 3.8);

    const cam = state.camera;
    const aspect = state.viewport.aspect;

    // Active story index (0 to 8) when activeStep >= 1
    const currentActiveStoryIdx = activeStep > 0 ? activeStep - 1 : -1;

    for (let i = 0; i < neurons.length; i++) {
      const n = neurons[i];
      const isActiveNode = n.storyIndex === currentActiveStoryIdx;

      let targetX = n.zoneCenter.x;
      let targetY = n.zoneCenter.y;
      let targetZ = n.zoneCenter.z;

      if (isActiveNode) {
        // ── In Active Detail Section: Position is STATIC & CONSTANT at its anchor ──
        targetX = n.zoneCenter.x;
        targetY = n.zoneCenter.y;
        targetZ = n.zoneCenter.z;
      } else {
        // ── In Overview / Inactive: Subtle Harmonic Oscillation & Cursor Pull ──
        const rayZDist = Math.max(1, cam.position.z - n.zoneCenter.z);
        const exactMouseWorldX = (mouse.x * state.viewport.width * (rayZDist / cam.position.z)) / 2;
        const exactMouseWorldY = (mouse.y * state.viewport.height * (rayZDist / cam.position.z)) / 2;

        const localOffsetX = Math.sin(t * 0.7 * n.pulseSpeed + n.phase) * 0.12;
        const localOffsetY = Math.cos(t * 0.6 * n.pulseSpeed + n.phase * 1.2) * 0.12;
        const localOffsetZ = Math.sin(t * 0.5 * n.pulseSpeed + n.phase * 0.8) * 0.08;

        const dxToMouse = exactMouseWorldX - n.zoneCenter.x;
        const dyToMouse = exactMouseWorldY - n.zoneCenter.y;
        const dist2D = Math.sqrt(dxToMouse * dxToMouse + dyToMouse * dyToMouse);
        const pullFactor = Math.max(0, 1 - dist2D / 3.0) * 0.3;

        const fullTargetX = n.zoneCenter.x + localOffsetX + (dxToMouse * pullFactor);
        const fullTargetY = n.zoneCenter.y + localOffsetY + (dyToMouse * pullFactor);
        const fullTargetZ = n.zoneCenter.z + localOffsetZ;

        targetX = THREE.MathUtils.lerp(originPos.x, fullTargetX, bloomEase);
        targetY = THREE.MathUtils.lerp(originPos.y, fullTargetY, bloomEase);
        targetZ = THREE.MathUtils.lerp(originPos.z, fullTargetZ, bloomEase);
      }

      n.position.x += (targetX - n.position.x) * 0.10;
      n.position.y += (targetY - n.position.y) * 0.10;
      n.position.z += (targetZ - n.position.z) * 0.10;

      const nodeGroup = nodeGroupsRef.current[i];
      const mesh = meshRefs.current[i];
      const sprite = spriteRefs.current[i];

      if (nodeGroup) {
        nodeGroup.position.copy(n.position);

        // Screen-space hover detection
        projectedVec.copy(n.position).project(cam);
        const screenDx = projectedVec.x - mouse.x;
        const screenDy = (projectedVec.y - mouse.y) / aspect;
        const screenDistance = Math.sqrt(screenDx * screenDx + screenDy * screenDy);

        const hitRadius = n.isMain ? 0.095 : 0.075;
        const isHovered = screenDistance < hitRadius && bloomEase > 0.7;

        // Tailored scale: Refined compact size (0.38) in detail mode
        const targetHoverScale = isActiveNode ? 1.30 : isHovered ? 1.25 : 1.0;
        n.currentHoverScale = THREE.MathUtils.lerp(n.currentHoverScale, targetHoverScale, 0.15);

        // Dynamic pulse
        const pulse = 1 + Math.sin(t * n.pulseSpeed * (isActiveNode ? 2.0 : 1.8) + n.phase) * (isActiveNode ? 0.06 : 0.05);
        const nodeBaseRadius = isActiveNode ? 0.38 : n.radius;
        const s = nodeBaseRadius * pulse * (isActiveNode ? 1.0 : n.currentHoverScale) * bloomEase;

        if (mesh) {
          mesh.scale.set(Math.max(0.001, s), Math.max(0.001, s), Math.max(0.001, s));
          // Continuous abstract rotation preserved
          mesh.rotation.x += delta * (isActiveNode ? 0.75 : n.rotSpeed.x);
          mesh.rotation.y += delta * (isActiveNode ? 0.95 : n.rotSpeed.y);
          mesh.rotation.z += delta * (isActiveNode ? 0.60 : n.rotSpeed.z);
        }

        if (sprite) {
          const targetOpacity = activeStep === 0
            ? 0.94
            : isActiveNode
            ? 1.0
            : 0.14;

          const spriteMat = sprite.material as THREE.SpriteMaterial;
          if (spriteMat) {
            spriteMat.opacity = THREE.MathUtils.lerp(spriteMat.opacity, targetOpacity, 0.12);
          }

          const spriteScale = isActiveNode ? 1.15 : isHovered ? 1.05 : 0.92;
          sprite.scale.set(1.15 * spriteScale, 0.28 * spriteScale, 1);
        }
      }
    }

    // Share real-time neuron positions and lines for Text Dynamic Inversion Shader
    if (neuronDataRef) {
      if (!neuronDataRef.current.positions || neuronDataRef.current.positions.length !== neurons.length) {
        neuronDataRef.current.positions = neurons.map(() => new THREE.Vector3());
        neuronDataRef.current.radii = neurons.map((n) => n.radius);
        neuronDataRef.current.lines = [];
        for (let c = 0; c < Math.min(20, connections.length); c++) {
          neuronDataRef.current.lines.push(new THREE.Vector4());
        }
      }

      for (let i = 0; i < neurons.length; i++) {
        neuronDataRef.current.positions[i].copy(neurons[i].position);
        neuronDataRef.current.radii[i] = (neurons[i].radius * (neurons[i].isMain ? 1.5 : 1.1) + 0.08) * bloomEase;
      }

      for (let c = 0; c < Math.min(20, connections.length); c++) {
        const [fromIdx, toIdx] = connections[c];
        const p1 = neurons[fromIdx].position;
        const p2 = neurons[toIdx].position;
        neuronDataRef.current.lines[c].set(p1.x, p1.y, p2.x, p2.y);
      }
    }

    // Update axon connection lines
    if (linesRef.current) {
      const posAttr = linesRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;

      for (let c = 0; c < connections.length; c++) {
        const [i, j] = connections[c];
        const offset = c * 6;
        arr[offset] = neurons[i].position.x;
        arr[offset + 1] = neurons[i].position.y;
        arr[offset + 2] = neurons[i].position.z;
        arr[offset + 3] = neurons[j].position.x;
        arr[offset + 4] = neurons[j].position.y;
        arr[offset + 5] = neurons[j].position.z;
      }
      posAttr.needsUpdate = true;
    }

    // Update action potential sparks
    if (sparkGroupRef.current && bloomEase > 0.5) {
      const sparkChildren = sparkGroupRef.current.children;
      for (let s = 0; s < sparks.length; s++) {
        const spark = sparks[s];
        spark.progress += delta * spark.speed;
        if (spark.progress > 1) {
          spark.progress = 0;
          spark.connIdx = Math.floor(Math.random() * connections.length);
          spark.speed = 0.18 + Math.random() * 0.22;
        }

        const [fromIdx, toIdx] = connections[spark.connIdx];
        const from = neurons[fromIdx].position;
        const to = neurons[toIdx].position;

        const px = from.x + (to.x - from.x) * spark.progress;
        const py = from.y + (to.y - from.y) * spark.progress;
        const pz = from.z + (to.z - from.z) * spark.progress;

        if (sparkChildren[s]) {
          sparkChildren[s].position.set(px, py, pz);
          const peakScale = Math.sin(spark.progress * Math.PI);
          const sparkSize = (0.06 + peakScale * 0.07) * bloomEase;
          sparkChildren[s].scale.set(sparkSize, sparkSize, sparkSize);
        }
      }
    }

    // Subtle global scene tilt
    if (groupRef.current) {
      const tiltX = activeStep === 0 ? mouse.y * 0.06 : 0;
      const tiltZ = activeStep === 0 ? -mouse.x * 0.05 : 0;
      groupRef.current.rotation.x += (tiltX - groupRef.current.rotation.x) * 0.04;
      groupRef.current.rotation.z += (tiltZ - groupRef.current.rotation.z) * 0.04;
    }
  });

  // Faceted abstract geometries
  const geometries = useMemo(() => ({
    icosa: new THREE.IcosahedronGeometry(1, 0),
    octa: new THREE.OctahedronGeometry(1, 0),
    dodeca: new THREE.DodecahedronGeometry(1, 0),
    box: new THREE.BoxGeometry(1.2, 1.2, 1.2),
    spark: new THREE.OctahedronGeometry(1, 0),
  }), []);

  return (
    <group ref={groupRef}>
      {/* ── Solid White Abstract Neuron Nodes ── */}
      {neurons.map((n, i) => {
        const geom = geometries[n.geometryType] || geometries.icosa;
        return (
          <group
            key={`neuron-${n.id}`}
            ref={(el) => (nodeGroupsRef.current[i] = el)}
            position={[originPos.x, originPos.y, originPos.z]}
            onClick={(e) => {
              e.stopPropagation();
              if (n.storyIndex >= 0 && onSelectNode) {
                onSelectNode(n.storyIndex);
              }
            }}
          >
            {/* Pure Solid Flat White Abstract Geometry */}
            <mesh
              ref={(el) => (meshRefs.current[i] = el)}
              geometry={geom}
              scale={0.001}
              renderOrder={1}
            >
              <meshBasicMaterial
                color="#ffffff"
                toneMapped={false}
              />
            </mesh>

            {/* Clean Solid White 3D Billboard Badge (depthTest=false so never occluded) */}
            {n.isMain && (
              <sprite
                ref={(el) => (spriteRefs.current[i] = el)}
                position={[0, n.radius + 0.38, 0]}
                scale={[1.15, 0.28, 1]}
                renderOrder={10}
              >
                <spriteMaterial
                  map={badgeTextures[i]}
                  transparent
                  opacity={0.94}
                  depthTest={false}
                  depthWrite={false}
                  toneMapped={false}
                />
              </sprite>
            )}
          </group>
        );
      })}

      {/* ── Solid White Axon Connection Lines ── */}
      <lineSegments ref={linesRef} frustumCulled={false} renderOrder={1}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={connections.length * 2}
            array={linePositionsArray}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.65}
          depthWrite={false}
          toneMapped={false}
        />
      </lineSegments>

      {/* ── Solid White Synaptic Action Potential Sparks ─────────────── */}
      <group ref={sparkGroupRef}>
        {sparks.map((spark, s) => (
          <mesh
            key={`spark-${s}`}
            geometry={geometries.spark}
            scale={0.001}
            renderOrder={1}
          >
            <meshBasicMaterial
              color="#ffffff"
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>

      {/* ── Atmospheric Ambient White Micro Particles ────────────────── */}
      <NeuronParticles />
    </group>
  );
};

// ── Atmospheric micro particles ──────────────────────────────────────────
const NeuronParticles: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 480;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 22;
      pos[i3 + 1] = (Math.random() - 0.5) * 16;
      pos[i3 + 2] = (Math.random() - 0.5) * 18;
    }
    return pos;
  }, []);

  useFrame((_state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.008;
      pointsRef.current.rotation.x += delta * 0.004;
    }
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#ffffff"
        transparent
        opacity={0.3}
        depthWrite={false}
        sizeAttenuation
        toneMapped={false}
      />
    </points>
  );
};
