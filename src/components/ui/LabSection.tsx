import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Check, Copy } from 'lucide-react';
import { Hero3DCanvas } from '../3d/Hero3DCanvas';
import { experimentPresets } from '../../data/portfolioData';
import { ExperimentPreset } from '../../types';
import { soundFX } from './SoundEffects';

export const LabSection: React.FC = () => {
  const [activePreset, setActivePreset] = useState<ExperimentPreset>(experimentPresets[0]);
  const [wireframe, setWireframe] = useState<boolean>(activePreset.defaultWireframe);
  const [speed, setSpeed] = useState<number>(activePreset.defaultSpeed);
  const [activeColor, setActiveColor] = useState<string>(activePreset.colorScheme);
  const [activeTab, setActiveTab] = useState<'canvas' | 'code'>('canvas');
  const [copiedCode, setCopiedCode] = useState(false);

  const colors = [
    { name: 'Cyan Glow', hex: '#4fc3f7' },
    { name: 'Pure White', hex: '#ffffff' },
    { name: 'Slate Gray', hex: '#52525b' },
    { name: 'Muted Zinc', hex: '#71717a' },
    { name: 'Silver Steel', hex: '#a1a1aa' },
  ];

  const handleSelectPreset = (preset: ExperimentPreset) => {
    soundFX.playClick();
    setActivePreset(preset);
    setWireframe(preset.defaultWireframe);
    setSpeed(preset.defaultSpeed);
    setActiveColor(preset.colorScheme);
  };

  const sampleSnippet = `// Eksperimen 3D: ${activePreset.title}
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float } from '@react-three/drei';

export function ${activePreset.title.replace(/\s+/g, '')}Scene() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[10, 10, 10]} intensity={1.5} />
      <Float speed={${speed}} rotationIntensity={1.0}>
        <mesh scale={1.5}>
          <${activePreset.type === 'torusKnot' ? 'torusKnotGeometry args={[1, 0.35, 128, 32]}' : 'icosahedronGeometry args={[1.4, 1]}'} />
          <meshStandardMaterial
            color="${activeColor}"
            wireframe={${wireframe}}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      </Float>
    </Canvas>
  );
}`;

  const copyCodeToClipboard = () => {
    soundFX.playSuccess();
    navigator.clipboard.writeText(sampleSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section id="lab" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Header with Dynamic 3D Inversion */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="blend-invert inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 text-xs font-mono font-bold mb-4 shadow-sm backdrop-blur-xs">
          <FlaskConical className="w-3.5 h-3.5" />
          <span>3D CREATIVE PLAYGROUND &amp; EXPERIMENT LAB</span>
        </div>
        <h2 className="blend-invert text-3xl sm:text-5xl font-extrabold tracking-tight select-none">
          Laboratorium Eksperimen 3D Interaktif
        </h2>
        <p className="blend-invert mt-4 max-w-2xl text-sm sm:text-base font-medium select-none">
          Tempat uji coba geometri spasial, material shader, dan partikel WebGL secara langsung. Pilih preset atau atur parameter secara real-time.
        </p>
      </div>

      {/* Main Lab Interface Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Preset Selector & Experiments List (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-mono text-white/50 font-bold uppercase tracking-wider">
              Eksperimen Presets ({experimentPresets.length})
            </span>
            <span className="text-[10px] font-mono text-cyan-400 font-bold">Three.js / R3F</span>
          </div>

          <div className="space-y-3">
            {experimentPresets.map((preset) => {
              const isSelected = activePreset.id === preset.id;
              return (
                <motion.div
                  key={preset.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border text-left ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-500/40 shadow-md ring-1 ring-cyan-500/30'
                      : 'glass-panel hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">
                      {preset.title}
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-cyan-400 font-medium">
                      {preset.type}
                    </span>
                  </div>
                  <p className="text-xs text-white/60 mt-2 line-clamp-2 leading-relaxed">
                    {preset.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {preset.tags.map((t) => (
                      <span key={t} className="text-[9px] font-mono text-white/40 font-medium">
                        #{t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Note */}
          <div className="p-4 rounded-2xl glass-panel text-xs text-white/70 shadow-sm text-left">
            <span className="text-cyan-400 font-bold block mb-1">💡 Tips Eksperimen:</span>
            Kamu bisa menambahkan model 3D kustom (GLTF/GLB) atau shader buatanmu sendiri ke dalam folder <code className="text-cyan-300 font-mono bg-white/10 px-1 py-0.5 rounded font-bold">src/components/3d/</code>.
          </div>
        </div>

        {/* Right Column: Interactive 3D Viewport & Realtime Controls (8 cols) */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 flex flex-col justify-between">
          
          {/* Top Viewport Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
              <div className="text-left">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>{activePreset.title}</span>
                </h3>
                <span className="text-[11px] font-mono text-white/40 font-medium">Active WebGL Shader &amp; Mesh</span>
              </div>
            </div>

            {/* View Mode Toggle: Canvas vs Code Snippet */}
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => {
                  soundFX.playClick();
                  setActiveTab('canvas');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeTab === 'canvas'
                    ? 'bg-cyan-500/20 text-white border border-cyan-500/30 shadow-sm'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                3D Viewport
              </button>
              <button
                onClick={() => {
                  soundFX.playClick();
                  setActiveTab('code');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeTab === 'code'
                    ? 'bg-cyan-500/20 text-white border border-cyan-500/30 shadow-sm'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                Code Snippet
              </button>
            </div>
          </div>

          {/* Main Stage */}
          <div className="relative w-full h-[400px] sm:h-[450px] my-6 rounded-2xl overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center">
            {activeTab === 'canvas' ? (
              <>
                <Hero3DCanvas
                  type={activePreset.type}
                  wireframe={wireframe}
                  color={activeColor}
                  speed={speed}
                  interactive={true}
                  className="w-full h-full"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 backdrop-blur-md text-[10px] font-mono text-cyan-400 font-bold shadow-sm">
                  FPS: ~60 | Drag/Hover to Rotate
                </div>
              </>
            ) : (
              <div className="w-full h-full p-4 overflow-auto text-left font-mono text-xs bg-[#0a0a0a] text-neutral-100 rounded-xl">
                <div className="flex justify-between items-center pb-2 mb-2 border-b border-white/10">
                  <span className="text-cyan-400 text-[11px]">// React Three Fiber Code</span>
                  <button
                    onClick={copyCodeToClipboard}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white text-[11px] transition-colors"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="text-neutral-200 leading-relaxed">{sampleSnippet}</pre>
              </div>
            )}
          </div>

          {/* Live Controller Panel */}
          <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            
            {/* Control 1: Wireframe Toggle */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono text-white/70 font-semibold">Wireframe</span>
                <span className="font-mono text-cyan-400 font-bold">{wireframe ? 'ON' : 'OFF'}</span>
              </div>
              <button
                onClick={() => {
                  soundFX.playClick();
                  setWireframe(!wireframe);
                }}
                className={`w-full py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  wireframe
                    ? 'bg-cyan-500/20 text-white border border-cyan-500/30 shadow-sm'
                    : 'bg-white/5 border border-white/10 text-white/70 hover:text-white'
                }`}
              >
                {wireframe ? 'Solid Mode' : 'Wireframe Mode'}
              </button>
            </div>

            {/* Control 2: Speed Slider */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono text-white/70 font-semibold">Rotation Speed</span>
                <span className="font-mono text-cyan-400 font-bold">{speed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="4.0"
                step="0.2"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Control 3: Color Palette */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono text-white/70 font-semibold">Monochrome Hue</span>
                <span className="text-[10px] font-mono text-cyan-400 font-bold">
                  {activeColor}
                </span>
              </div>
              <div className="flex items-center justify-between gap-1">
                {colors.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => {
                      soundFX.playClick();
                      setActiveColor(c.hex);
                    }}
                    style={{ backgroundColor: c.hex }}
                    className={`w-6 h-6 rounded-full transition-transform ${
                      activeColor === c.hex
                        ? 'scale-125 ring-2 ring-cyan-400 ring-offset-2 ring-offset-black'
                        : 'opacity-80 hover:opacity-100'
                    }`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
