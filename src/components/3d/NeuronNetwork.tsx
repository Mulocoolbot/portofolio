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

// ── Structured Spatial Anchors for Responsive Layouts ──────────────────────
// 1. Desktop Anchors (Wide panoramic constellation)
export const DESKTOP_ANCHORS: [number, number, number][] = [
  // ── 9 Primary Interactive Story Nodes ──
  [0.0, -0.45, 0.3],    // 0: MULLO (Center)
  [-2.6, 1.5, 0.2],     // 1: ABOUT ME (Upper-Left)
  [2.6, 1.5, 0.1],      // 2: EXPERIENCE - ORGANIZATIONAL (Upper-Right)
  [3.0, 0.1, -0.1],     // 3: EXPERIENCE - PROFESSIONAL (Mid-Right)
  [2.1, -1.3, 0.2],     // 4: PROJECTS (Lower-Right)
  [0.0, -1.65, 0.3],    // 5: SKILLS (Bottom Nadir)
  [-2.3, -1.3, -0.1],   // 6: EDUCATION (Lower-Left)
  [-3.0, 0.1, 0.1],     // 7: CERTIFICATE (Mid-Left)
  [0.0, 0.85, 0.7],     // 8: CONTACT (Center Zenith)

  // ── 9 Supporting Connective Satellites ──
  [-3.6, 1.8, -0.5],    // 9: Outer Deep Left
  [3.6, 1.8, -0.5],     // 10: Outer Deep Right
  [0.0, 2.2, -0.3],     // 11: Top Zenith
  [-3.4, -1.8, -0.3],   // 12: Bottom Outer Left
  [3.4, -1.8, -0.3],    // 13: Bottom Outer Right
  [0.0, -2.2, -0.4],    // 14: Bottom Nadir
  [-1.6, 0.7, -1.8],    // 15: Deep Background Left
  [1.6, 0.8, -1.8],     // 16: Deep Background Right
  [0.0, -2.4, -1.8],    // 17: Deep Bottom Background (Clear of central text!)
];

// 2. iPad / Tablet Anchors (Open-Ring Constellation with Hollow Center)
export const TABLET_ANCHORS: [number, number, number][] = [
  // ── 9 Primary Interactive Story Nodes (Arranged in an open ring around central typography) ──
  [0.0, -0.95, 0.3],    // 0: MULLO (Lower-Center)
  [-1.60, 1.25, 0.2],   // 1: ABOUT ME (Upper-Left)
  [1.60, 1.25, 0.1],    // 2: EXPERIENCE - ORGANIZATIONAL (Upper-Right)
  [1.85, 0.35, -0.1],   // 3: EXPERIENCE - PROFESSIONAL (Mid-Right)
  [1.45, -1.35, 0.2],   // 4: PROJECTS (Lower-Right)
  [0.0, -1.85, 0.3],    // 5: SKILLS (Bottom Nadir)
  [-1.45, -1.35, -0.1], // 6: EDUCATION (Lower-Left)
  [-1.85, 0.35, 0.1],   // 7: CERTIFICATE (Mid-Left)
  [0.0, 1.70, 0.6],     // 8: CONTACT (Top Zenith)

  // ── 9 Supporting Connective Satellites (Perimeter & Deep Background) ──
  [-1.95, 1.95, -0.8],  // 9: Outer Top Left
  [1.95, 1.95, -0.8],   // 10: Outer Top Right
  [0.0, 2.15, -0.6],    // 11: Zenith Outer
  [-1.90, -1.95, -0.8], // 12: Outer Bottom Left
  [1.90, -1.95, -0.8],  // 13: Outer Bottom Right
  [0.0, -2.20, -0.6],   // 14: Nadir Outer
  [-1.60, 0.0, -2.2],   // 15: Deep Left Background
  [1.60, 0.0, -2.2],    // 16: Deep Right Background
  [0.0, -2.30, -2.2],   // 17: Deep Bottom Background (Clear of central text!)
];

// 3. Mobile Anchors (Open-Ring Portrait Constellation with Hollow Center)
export const MOBILE_ANCHORS: [number, number, number][] = [
  // ── 9 Primary Interactive Story Nodes (Arranged in a balanced oval ring) ──
  [0.0, -0.95, 0.3],    // 0: MULLO (Lower-Center)
  [-0.85, 1.30, 0.2],   // 1: ABOUT ME (Upper-Left)
  [0.85, 1.30, 0.1],    // 2: EXPERIENCE - ORGANIZATIONAL (Upper-Right)
  [1.08, 0.45, -0.1],   // 3: EXPERIENCE - PROFESSIONAL (Mid-Upper Right)
  [0.85, -1.35, 0.2],   // 4: PROJECTS (Lower-Right)
  [0.0, -1.85, 0.3],    // 5: SKILLS (Bottom Nadir)
  [-0.85, -1.35, -0.1], // 6: EDUCATION (Lower-Left)
  [-1.08, 0.45, 0.1],   // 7: CERTIFICATE (Mid-Upper Left)
  [0.0, 1.70, 0.5],     // 8: CONTACT (Top Zenith)

  // ── 9 Supporting Connective Satellites (Perimeter & Deep Background) ──
  [-1.00, 2.05, -0.8],  // 9: Outer Top Left
  [1.00, 2.05, -0.8],   // 10: Outer Top Right
  [0.0, 2.20, -0.6],    // 11: Top Outer
  [-1.00, -2.05, -0.8], // 12: Outer Bottom Left
  [1.00, -2.05, -0.8],  // 13: Outer Bottom Right
  [0.0, -2.15, -0.6],   // 14: Bottom Outer
  [-0.90, 0.0, -2.2],   // 15: Deep Left Background
  [0.90, 0.0, -2.2],    // 16: Deep Right Background
  [0.0, -2.30, -2.2],   // 17: Deep Bottom Background (Clear of central text!)
];

// Default spatial anchors reference for backwards compatibility
export const NEURON_SPATIAL_ANCHORS: [number, number, number][] = DESKTOP_ANCHORS;

export function getSpatialAnchors(isMobile: boolean, isTablet: boolean): [number, number, number][] {
  if (isMobile) return MOBILE_ANCHORS;
  if (isTablet) return TABLET_ANCHORS;
  return DESKTOP_ANCHORS;
}

export function getSpatialAnchor(storyIndex: number, isMobile: boolean, isTablet: boolean): [number, number, number] {
  const anchors = getSpatialAnchors(isMobile, isTablet);
  return anchors[storyIndex] || [0, 0, 0];
}

// Tailored tag placement offsets for each device
const DESKTOP_TAG_OFFSETS: [number, number, number][] = [
  [0.0, 0.42, 0.15],    // 0: MULLO (Above Node 0)
  [0.0, 0.45, 0.15],    // 1: ABOUT ME (Above Node 1)
  [0.0, 0.45, 0.15],    // 2: ORGANIZATIONAL (Above Node 2)
  [0.25, 0.40, 0.15],   // 3: PROFESSIONAL (Above-Right of Node 3)
  [0.20, -0.44, 0.15],  // 4: PROJECTS (Below-Right of Node 4)
  [0.0, -0.45, 0.15],   // 5: SKILLS (Below Node 5)
  [-0.20, -0.44, 0.15], // 6: EDUCATION (Below-Left of Node 6)
  [-0.25, 0.40, 0.15],  // 7: CERTIFICATE (Above-Left of Node 7)
  [0.0, 0.45, 0.15],    // 8: CONTACT (Above Node 8)
];

const TABLET_TAG_OFFSETS: [number, number, number][] = [
  [0.0, -0.34, 0.15],   // 0: MULLO (Below Node 0)
  [0.0, 0.38, 0.15],    // 1: ABOUT ME
  [0.0, 0.38, 0.15],    // 2: ORGANIZATIONAL
  [0.18, 0.36, 0.15],   // 3: PROFESSIONAL (Outward right)
  [0.10, -0.36, 0.15],  // 4: PROJECTS
  [0.0, -0.36, 0.15],   // 5: SKILLS
  [-0.10, -0.36, 0.15], // 6: EDUCATION
  [-0.18, 0.36, 0.15],  // 7: CERTIFICATE (Outward left)
  [0.0, 0.38, 0.15],    // 8: CONTACT
];

const MOBILE_TAG_OFFSETS: [number, number, number][] = [
  [0.0, -0.32, 0.15],   // 0: MULLO (Below Node 0)
  [0.0, 0.34, 0.15],    // 1: ABOUT ME
  [0.0, 0.34, 0.15],    // 2: ORGANIZATIONAL
  [0.10, 0.32, 0.15],   // 3: PROFESSIONAL (Outward right)
  [0.0, -0.32, 0.15],   // 4: PROJECTS
  [0.0, -0.32, 0.15],   // 5: SKILLS
  [0.0, -0.32, 0.15],   // 6: EDUCATION
  [-0.10, 0.32, 0.15],  // 7: CERTIFICATE (Outward left)
  [0.0, 0.34, 0.15],    // 8: CONTACT
];

const TAG_OFFSETS = DESKTOP_TAG_OFFSETS;

const SATELLITE_LABELS = [
  'GLSL', 'SHADERS', 'WEBGL', 'ALGORITHMS', 'R3F', 'AUDIO FFT', 'BLENDER', 'SYSTEMS', 'OPTIMIZE'
];

const MAX_CONN_DIST = 3.9;
const SPARK_COUNT = 24;
const BLOOM_DURATION = 1.4;
import { maskModeUniform } from './HeroTextInversion3D';

// Clean high-contrast monochrome 3D billboard text badge with multi-channel mask for parity inversion
function createSolidWhiteBadgeTexture(text: string, isMain: boolean, isStory: boolean, stepNum?: number): { displayTexture: THREE.CanvasTexture; maskTexture: THREE.CanvasTexture } {
  // 1. Display Canvas (Solid white pill card with bold black text)
  const dCanvas = document.createElement('canvas');
  dCanvas.width = 512;
  dCanvas.height = 128;
  const dCtx = dCanvas.getContext('2d');

  // 2. Mask Canvas (Green = Card Body, Blue = Text & Dot)
  const mCanvas = document.createElement('canvas');
  mCanvas.width = 512;
  mCanvas.height = 128;
  const mCtx = mCanvas.getContext('2d');

  const x = 8;
  const y = 8;
  const w = 496;
  const h = 112;
  const r = 56;

  if (dCtx) {
    dCtx.clearRect(0, 0, 512, 128);

    // Solid White Capsule Card
    dCtx.fillStyle = '#ffffff';
    dCtx.beginPath();
    dCtx.moveTo(x + r, y);
    dCtx.lineTo(x + w - r, y);
    dCtx.quadraticCurveTo(x + w, y, x + w, y + r);
    dCtx.lineTo(x + w, y + h - r);
    dCtx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    dCtx.lineTo(x + r, y + h);
    dCtx.quadraticCurveTo(x, y + h, x, y + h - r);
    dCtx.lineTo(x, y + r);
    dCtx.quadraticCurveTo(x, y, x + r, y);
    dCtx.closePath();
    dCtx.fill();

    // Solid Black step badge dot if story node
    if (isStory && stepNum !== undefined) {
      dCtx.fillStyle = '#000000';
      dCtx.beginPath();
      dCtx.arc(70, 64, 28, 0, Math.PI * 2);
      dCtx.fill();

      dCtx.fillStyle = '#ffffff';
      dCtx.font = 'bold 24px "JetBrains Mono", monospace, sans-serif';
      dCtx.textAlign = 'center';
      dCtx.textBaseline = 'middle';
      dCtx.fillText(`0${stepNum}`, 70, 65);
    } else {
      dCtx.fillStyle = '#000000';
      dCtx.beginPath();
      dCtx.arc(70, 64, 12, 0, Math.PI * 2);
      dCtx.fill();
    }

    // Bold Black text label inside the solid white badge card
    dCtx.fillStyle = '#000000';
    dCtx.font = 'bold 36px "JetBrains Mono", monospace, sans-serif';
    dCtx.textAlign = 'left';
    dCtx.textBaseline = 'middle';
    dCtx.fillText(text, isStory ? 116 : 98, 64);
  }

  if (mCtx) {
    mCtx.clearRect(0, 0, 512, 128);

    // Green Channel = 1.0 (Card Body)
    mCtx.fillStyle = 'rgb(0, 255, 0)';
    mCtx.beginPath();
    mCtx.moveTo(x + r, y);
    mCtx.lineTo(x + w - r, y);
    mCtx.quadraticCurveTo(x + w, y, x + w, y + r);
    mCtx.lineTo(x + w, y + h - r);
    mCtx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    mCtx.lineTo(x + r, y + h);
    mCtx.quadraticCurveTo(x, y + h, x, y + h - r);
    mCtx.lineTo(x, y + r);
    mCtx.quadraticCurveTo(x, y, x + r, y);
    mCtx.closePath();
    mCtx.fill();

    // Green + Blue Channels = 1.0 (Cyan = Card + Text/Dot overlap -> Level 2)
    mCtx.fillStyle = 'rgb(0, 255, 255)';
    if (isStory && stepNum !== undefined) {
      mCtx.beginPath();
      mCtx.arc(70, 64, 28, 0, Math.PI * 2);
      mCtx.fill();
    } else {
      mCtx.beginPath();
      mCtx.arc(70, 64, 12, 0, Math.PI * 2);
      mCtx.fill();
    }

    mCtx.font = 'bold 36px "JetBrains Mono", monospace, sans-serif';
    mCtx.textAlign = 'left';
    mCtx.textBaseline = 'middle';
    mCtx.fillText(text, isStory ? 116 : 98, 64);

    // Red + Green + Blue Channels = 1.0 (White = Card + Dot + Step Number overlap -> Level 3)
    if (isStory && stepNum !== undefined) {
      mCtx.fillStyle = 'rgb(255, 255, 255)';
      mCtx.font = 'bold 24px "JetBrains Mono", monospace, sans-serif';
      mCtx.textAlign = 'center';
      mCtx.textBaseline = 'middle';
      mCtx.fillText(`0${stepNum}`, 70, 65);
    }
  }

  const dTex = new THREE.CanvasTexture(dCanvas);
  dTex.minFilter = THREE.LinearFilter;
  dTex.magFilter = THREE.LinearFilter;
  dTex.needsUpdate = true;

  const mTex = new THREE.CanvasTexture(mCanvas);
  mTex.minFilter = THREE.LinearFilter;
  mTex.magFilter = THREE.LinearFilter;
  mTex.needsUpdate = true;

  return { displayTexture: dTex, maskTexture: mTex };
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

interface DragState {
  isDragging: boolean;
  isPending: boolean;
  startX: number;
  startY: number;
  rotationY: number;
  rotationX: number;
  velocityY: number;
  velocityX: number;
}

interface NeuronNetworkProps {
  activeStep: number; // 0 = Overview, 1 to 9 = Story Nodes 1 to 9
  mouseRef: React.MutableRefObject<{ x: number; y: number; targetX: number; targetY: number }>;
  neuronDataRef?: React.MutableRefObject<NeuronInversionData>;
  onSelectNode?: (storyIndex: number) => void;
  dragRef?: React.MutableRefObject<DragState>;
  hoveredNeuronRef?: React.MutableRefObject<number>;
}

export const NeuronNetwork: React.FC<NeuronNetworkProps> = ({ activeStep, mouseRef, neuronDataRef, onSelectNode, dragRef, hoveredNeuronRef }) => {
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
  const worldPosVec = useMemo(() => new THREE.Vector3(), []);
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

    // Detect device tier dynamically based on viewport aspect and window width
    const isMobile = aspect < 0.62 || (typeof window !== 'undefined' && window.innerWidth < 640);
    const isTablet = !isMobile && (aspect < 1.15 || (typeof window !== 'undefined' && window.innerWidth <= 1024));

    const activeAnchors = isMobile ? MOBILE_ANCHORS : isTablet ? TABLET_ANCHORS : DESKTOP_ANCHORS;
    const activeTagOffsets = isMobile ? MOBILE_TAG_OFFSETS : isTablet ? TABLET_TAG_OFFSETS : DESKTOP_TAG_OFFSETS;

    // ── 1. Update Group Rotation & World Matrix FIRST so all node transforms follow rotation ──
    if (groupRef.current) {
      if (activeStep === 0) {
        const tiltX = mouse.y * 0.06;
        const tiltZ = -mouse.x * 0.05;

        // Apply drag rotation with momentum decay
        if (dragRef) {
          const drag = dragRef.current;

          // Apply inertia friction when not dragging
          if (!drag.isDragging) {
            drag.velocityY *= 0.95;
            drag.velocityX *= 0.95;
            drag.rotationY += drag.velocityY;
            drag.rotationX += drag.velocityX;
          }

          // Clamp X rotation to prevent flipping
          drag.rotationX = THREE.MathUtils.clamp(drag.rotationX, -1.2, 1.2);

          // Blend drag rotation with cursor tilt
          groupRef.current.rotation.y += (drag.rotationY - groupRef.current.rotation.y) * 0.08;
          groupRef.current.rotation.x += ((tiltX + drag.rotationX) - groupRef.current.rotation.x) * 0.06;
          groupRef.current.rotation.z += (tiltZ - groupRef.current.rotation.z) * 0.04;
        } else {
          groupRef.current.rotation.x += (tiltX - groupRef.current.rotation.x) * 0.04;
          groupRef.current.rotation.z += (tiltZ - groupRef.current.rotation.z) * 0.04;
        }
      } else {
        // In detail view: smoothly reset rotation to zero
        groupRef.current.rotation.x += (0 - groupRef.current.rotation.x) * 0.06;
        groupRef.current.rotation.y += (0 - groupRef.current.rotation.y) * 0.06;
        groupRef.current.rotation.z += (0 - groupRef.current.rotation.z) * 0.06;

        // Also reset drag state
        if (dragRef) {
          dragRef.current.rotationY *= 0.9;
          dragRef.current.rotationX *= 0.9;
          dragRef.current.velocityY = 0;
          dragRef.current.velocityX = 0;
        }
      }
      groupRef.current.updateMatrixWorld(true);
    }

    const groupWorldMatrix = groupRef.current ? groupRef.current.matrixWorld : new THREE.Matrix4();

    // Active story index (0 to 8) when activeStep >= 1
    const currentActiveStoryIdx = activeStep > 0 ? activeStep - 1 : -1;

    // Track which neuron story index is hovered this frame with closest distance in front of camera
    let hoveredStoryIdx = -1;
    let closestHoverDist = Infinity;
    const isDraggingNow = dragRef ? dragRef.current.isDragging : false;

    for (let i = 0; i < neurons.length; i++) {
      const n = neurons[i];
      const isActiveNode = n.storyIndex === currentActiveStoryIdx;

      // Update zoneCenter dynamically to match responsive device layout
      const targetAnchor = activeAnchors[i] || activeAnchors[0];
      n.zoneCenter.x += (targetAnchor[0] - n.zoneCenter.x) * 0.08;
      n.zoneCenter.y += (targetAnchor[1] - n.zoneCenter.y) * 0.08;
      n.zoneCenter.z += (targetAnchor[2] - n.zoneCenter.z) * 0.08;

      let targetX = n.zoneCenter.x;
      let targetY = n.zoneCenter.y;
      let targetZ = n.zoneCenter.z;

      if (isActiveNode) {
        // ── In Active Detail Section: Shift neuron point lower (-Y) for spacious composition ──
        targetX = n.zoneCenter.x;
        targetY = n.zoneCenter.y - (isMobile ? 0.15 : 0.22);
        targetZ = n.zoneCenter.z;
      } else {
        // ── In Overview / Inactive: Subtle Harmonic Oscillation & Cursor Pull ──
        const rayZDist = Math.max(1, cam.position.z - n.zoneCenter.z);
        const exactMouseWorldX = (mouse.x * state.viewport.width * (rayZDist / cam.position.z)) / 2;
        const exactMouseWorldY = (mouse.y * state.viewport.height * (rayZDist / cam.position.z)) / 2;

        const localOffsetX = Math.sin(t * 0.7 * n.pulseSpeed + n.phase) * (isMobile ? 0.06 : 0.12);
        const localOffsetY = Math.cos(t * 0.6 * n.pulseSpeed + n.phase * 1.2) * (isMobile ? 0.06 : 0.12);
        const localOffsetZ = Math.sin(t * 0.5 * n.pulseSpeed + n.phase * 0.8) * (isMobile ? 0.04 : 0.08);

        const dxToMouse = exactMouseWorldX - n.zoneCenter.x;
        const dyToMouse = exactMouseWorldY - n.zoneCenter.y;
        const dist2D = Math.sqrt(dxToMouse * dxToMouse + dyToMouse * dyToMouse);
        const pullFactor = isDraggingNow ? 0 : Math.max(0, 1 - dist2D / 3.0) * (isMobile ? 0.12 : 0.25);

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

        // ── Calculate EXACT World Position (accounting for rotated parent group!) ──
        worldPosVec.copy(n.position).applyMatrix4(groupWorldMatrix);

        // Project World Position to Screen NDC [-1, 1]
        projectedVec.copy(worldPosVec).project(cam);
        const screenDx = projectedVec.x - mouse.x;
        const screenDy = (projectedVec.y - mouse.y) / aspect;
        const screenDistance = Math.sqrt(screenDx * screenDx + screenDy * screenDy);

        // Check if node is in front of camera frustum
        const isFacingCamera = projectedVec.z < 1.0;
        const hitRadius = isMobile ? (n.isMain ? 0.13 : 0.09) : isTablet ? (n.isMain ? 0.11 : 0.08) : (n.isMain ? 0.095 : 0.075);
        const isHovered = isFacingCamera && screenDistance < hitRadius && bloomEase > 0.7;

        // Signal hover state to parent for drag conflict avoidance & click detection
        if (isHovered && n.storyIndex >= 0 && screenDistance < closestHoverDist) {
          closestHoverDist = screenDistance;
          hoveredStoryIdx = n.storyIndex;
        }

        // Tailored scale: Refined compact size in detail mode
        const targetHoverScale = isActiveNode ? 1.30 : isHovered ? 1.25 : 1.0;
        n.currentHoverScale = THREE.MathUtils.lerp(n.currentHoverScale, targetHoverScale, 0.15);

        // Dynamic pulse & responsive node base radius
        const pulse = 1 + Math.sin(t * n.pulseSpeed * (isActiveNode ? 2.0 : 1.8) + n.phase) * (isActiveNode ? 0.06 : 0.05);
        const baseRadius = isMobile ? (n.isMain ? 0.22 : 0.14) : isTablet ? (n.isMain ? 0.26 : 0.16) : n.radius;
        const nodeBaseRadius = isActiveNode ? (isMobile ? 0.32 : 0.38) : baseRadius;
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
            : 0.10;

          const spriteMat = sprite.material as THREE.Material;
          if (spriteMat) {
            spriteMat.opacity = THREE.MathUtils.lerp(spriteMat.opacity, targetOpacity, 0.12);
          }

          // Adaptive Tag Scale per device tier:
          // Desktop: 1.36 x 0.34
          // Tablet: 1.08 x 0.27
          // Mobile: 0.82 x 0.205
          const baseTagWidth = isMobile ? 0.82 : isTablet ? 1.08 : 1.36;
          const baseTagHeight = isMobile ? 0.205 : isTablet ? 0.27 : 0.34;

          const tagScaleFactor = activeStep === 0
            ? (isHovered ? 1.08 : 1.0)
            : (isActiveNode ? (isMobile ? 0.46 : 0.52) : (isMobile ? 0.22 : 0.28));

          const targetWidth = baseTagWidth * tagScaleFactor;
          const targetHeight = baseTagHeight * tagScaleFactor;

          sprite.scale.x = THREE.MathUtils.lerp(sprite.scale.x, targetWidth, 0.12);
          sprite.scale.y = THREE.MathUtils.lerp(sprite.scale.y, targetHeight, 0.12);
          sprite.scale.z = 1;

          // Adaptive Tag Position Offset in Detail Mode:
          const baseOffset = (activeTagOffsets[n.storyIndex] as [number, number, number] | undefined) || [0, nodeBaseRadius + (isMobile ? 0.28 : isTablet ? 0.34 : 0.38), 0.15];
          const targetOffsetX = activeStep === 0 ? baseOffset[0] : (isActiveNode ? 0.0 : baseOffset[0] * 0.45);
          const targetOffsetY = activeStep === 0 ? baseOffset[1] : (isActiveNode ? (isMobile ? 0.68 : 0.86) : baseOffset[1] * 0.45);
          const targetOffsetZ = baseOffset[2];

          sprite.position.x = THREE.MathUtils.lerp(sprite.position.x, targetOffsetX, 0.12);
          sprite.position.y = THREE.MathUtils.lerp(sprite.position.y, targetOffsetY, 0.12);
          sprite.position.z = THREE.MathUtils.lerp(sprite.position.z, targetOffsetZ, 0.12);
        }
      }
    }

    // Share real-time neuron world positions and lines for Text Dynamic Inversion Shader
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
        worldPosVec.copy(neurons[i].position).applyMatrix4(groupWorldMatrix);
        neuronDataRef.current.positions[i].copy(worldPosVec);
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

    // Update hover state for parent (story index, -1 = none)
    if (hoveredNeuronRef) {
      hoveredNeuronRef.current = hoveredStoryIdx;
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

  const badgePlaneGeom = useMemo(() => new THREE.PlaneGeometry(1, 1), []);

  // Multi-channel materials: Pure Red (R=1) for Neurons/Lines in Mask Pass, Pure White on Screen
  const neuronMeshMat = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uIsMask: maskModeUniform,
      },
      vertexShader: `
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uIsMask;
        void main() {
          if (uIsMask > 0.5) {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
          } else {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
          }
        }
      `,
      toneMapped: false,
    });
  }, []);

  const lineMat = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uIsMask: maskModeUniform,
      },
      vertexShader: `
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uIsMask;
        void main() {
          if (uIsMask > 0.5) {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 0.9);
          } else {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 0.65);
          }
        }
      `,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
    });
  }, []);

  const sparkMat = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uIsMask: maskModeUniform,
      },
      vertexShader: `
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uIsMask;
        void main() {
          if (uIsMask > 0.5) {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
          } else {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
          }
        }
      `,
      toneMapped: false,
    });
  }, []);

  // Multi-channel badge materials: Green (G=1) for Card Pill, Blue (B=1) for Text in Mask Pass
  const badgeMaterials = useMemo(() => {
    return badgeTextures.map(({ displayTexture, maskTexture }) => {
      return new THREE.ShaderMaterial({
        uniforms: {
          uDisplayMap: { value: displayTexture },
          uMaskMap: { value: maskTexture },
          uIsMask: maskModeUniform,
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            vec4 mvPosition = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
            vec2 scale = vec2(
              length(vec3(modelMatrix[0].x, modelMatrix[0].y, modelMatrix[0].z)),
              length(vec3(modelMatrix[1].x, modelMatrix[1].y, modelMatrix[1].z))
            );
            mvPosition.xy += position.xy * scale;
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform sampler2D uDisplayMap;
          uniform sampler2D uMaskMap;
          uniform float uIsMask;
          varying vec2 vUv;
          void main() {
            if (uIsMask > 0.5) {
              vec4 m = texture2D(uMaskMap, vUv);
              if (m.a < 0.05) discard;
              gl_FragColor = m;
            } else {
              vec4 d = texture2D(uDisplayMap, vUv);
              if (d.a < 0.05) discard;
              gl_FragColor = d;
            }
          }
        `,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        toneMapped: false,
      });
    });
  }, [badgeTextures]);

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
            {/* Pure Solid Flat White Abstract Geometry (Layer 1 enabled) */}
            <mesh
              ref={(el) => (meshRefs.current[i] = el)}
              geometry={geom}
              material={neuronMeshMat}
              scale={0.001}
              renderOrder={1}
              onUpdate={(self) => self.layers.enable(1)}
            />

            {/* Clean Solid White 3D Billboard Badge (Layer 1 enabled for parity inversion) */}
            {n.isMain && (
              <mesh
                ref={(el) => (spriteRefs.current[i] = el as unknown as THREE.Sprite)}
                geometry={badgePlaneGeom}
                material={badgeMaterials[i]}
                position={TAG_OFFSETS[n.storyIndex] || [0, n.radius + 0.38, 0.15]}
                renderOrder={1}
                onUpdate={(self) => self.layers.enable(1)}
              />
            )}
          </group>
        );
      })}

      {/* ── Solid White Axon Connection Lines (Layer 1 enabled) ── */}
      <lineSegments
        ref={linesRef}
        material={lineMat}
        frustumCulled={false}
        renderOrder={1}
        onUpdate={(self) => self.layers.enable(1)}
      >
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={connections.length * 2}
            array={linePositionsArray}
            itemSize={3}
          />
        </bufferGeometry>
      </lineSegments>

      {/* ── Solid White Synaptic Action Potential Sparks (Layer 1 enabled) ── */}
      <group ref={sparkGroupRef} onUpdate={(self) => self.traverse((c) => c.layers.enable(1))}>
        {sparks.map((spark, s) => (
          <mesh
            key={`spark-${s}`}
            geometry={geometries.spark}
            material={sparkMat}
            scale={0.001}
            renderOrder={1}
            onUpdate={(self) => self.layers.enable(1)}
          />
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
