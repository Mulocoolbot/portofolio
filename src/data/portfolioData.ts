import { Project, SkillCategory, ExperimentPreset, ExperienceItem } from '../types';

export const personalInfo = {
  name: "Creative Developer",
  tagline: "Building immersive 3D web experiences & futuristic digital products",
  status: "Available for creative collaborations & high-impact projects",
  bio: "Spesialis dalam rekayasa frontend modern, visual grafis 3D WebGL (Three.js), dan perancangan antarmuka pengguna yang imersif. Menggabungkan estetika seni digital dengan kode berkinerja tinggi.",
  location: "Indonesia (GMT+7)",
  socials: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "developer@example.com",
  },
  stats: [
    { label: "Tahun Eksplorasi", value: "3+" },
    { label: "Proyek & Eksperimen", value: "24+" },
    { label: "FPS Rata-rata 3D", value: "60 FPS" },
    { label: "Kepuasan Klien", value: "100%" },
  ]
};

export const skillsData: SkillCategory[] = [
  {
    title: "3D & Creative WebGL",
    skills: [
      { name: "Three.js / WebGL", level: 90, description: "Custom shaders, lighting, physics & particle systems" },
      { name: "React Three Fiber", level: 92, description: "Declarative 3D scenes with @react-three/drei" },
      { name: "GLSL Shaders", level: 80, description: "Procedural vertex & fragment shader transformations" },
      { name: "Blender to Web Pipeline", level: 75, description: "3D asset optimization (GLB/GLTF compression & bake)" },
    ]
  },
  {
    title: "Modern Frontend Engineering",
    skills: [
      { name: "React & Next.js", level: 95, description: "Server components, hooks, high performance UI" },
      { name: "TypeScript", level: 92, description: "Strict type architecture & reliable design systems" },
      { name: "Tailwind CSS & CSS Art", level: 94, description: "Responsive layouts, micro-animations & glassmorphism" },
      { name: "Framer Motion & GSAP", level: 88, description: "Scroll-driven sequences and complex timeline motions" },
    ]
  },
  {
    title: "Core & Infrastructure",
    skills: [
      { name: "Vite / Modern Bundlers", level: 90, description: "Lightning fast HMR & tree-shaking optimizations" },
      { name: "REST / GraphQL API", level: 85, description: "Realtime data sync & robust API integrations" },
      { name: "Git & CI/CD Workflows", level: 88, description: "Automated testing, versioning & deployments" },
    ]
  }
];

export const projectsData: Project[] = [
  {
    id: "quantum-3d-nexus",
    title: "Quantum 3D Nexus",
    subtitle: "Interactive WebGL Space & Data Visualization",
    description: "Eksplorasi visualisasi data 3D dengan partikel dinamis yang merespons audio dan input gerakan mouse pengguna. Menggunakan custom vertex shaders dan post-processing bloom effect.",
    tags: ["Three.js", "React Three Fiber", "GLSL Shaders", "Tailwind CSS"],
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80",
    demoUrl: "#",
    githubUrl: "#",
    featured: true,
    category: "3d-web",
    metrics: [
      { label: "Rendering", value: "60 FPS WebGL" },
      { label: "Partikel", value: "15,000 Nodes" }
    ]
  },
  {
    id: "cyber-defi-terminal",
    title: "Cyberpunk Terminal UI",
    subtitle: "High-Frequency Dashboard with Holographic Charts",
    description: "Antarmuka dashboard bertema futuristik dengan komponen modular, grafik interaktif real-time, glassmorphism ultra-halus, dan micro-interactions.",
    tags: ["React", "TypeScript", "Tailwind", "Framer Motion"],
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80",
    demoUrl: "#",
    githubUrl: "#",
    featured: true,
    category: "fullstack",
    metrics: [
      { label: "Lighthouse Score", value: "99/100" },
      { label: "Latency", value: "<15ms" }
    ]
  },
  {
    id: "neural-sound-visualizer",
    title: "Neural Audio Visualizer 3D",
    subtitle: "Generative Audio Reactive Mesh Sandbox",
    description: "Eksperimen sintetis yang merubah sinyal audio frekuensi nyata menjadi deformasi gelombang mesh 3D secara instan menggunakan Web Audio API dan Three.js.",
    tags: ["Web Audio API", "Three.js", "Canvas", "Creative Coding"],
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80",
    demoUrl: "#",
    githubUrl: "#",
    featured: false,
    category: "ai-experiment",
    metrics: [
      { label: "Audio FFT", value: "1024 Bins" },
      { label: "Mesh Resolution", value: "128x128" }
    ]
  },
  {
    id: "hologram-card-engine",
    title: "Hologram 3D Card Engine",
    subtitle: "Physically-Based Card Tilting & Shimmer Effects",
    description: "Engine kartu interaktif dengan efek pantulan cahaya spekular dinamis, depth mapping pseudo-3D, dan sensor orientasi perangkat seluler.",
    tags: ["TypeScript", "CSS 3D", "Framer Motion", "WebGL"],
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1000&q=80",
    demoUrl: "#",
    githubUrl: "#",
    featured: false,
    category: "creative",
    metrics: [
      { label: "Bundle Size", value: "<8KB" },
      { label: "Multi-touch", value: "Supported" }
    ]
  }
];

export const experimentPresets: ExperimentPreset[] = [
  {
    id: "icosahedron",
    title: "Cyber Icosahedron",
    description: "Polihedron geometris dengan material metalik dinamis, wireframe neon, dan respon gravitasi terhadap kursor.",
    type: "icosahedron",
    defaultWireframe: false,
    defaultSpeed: 1.2,
    colorScheme: "#00f2fe",
    tags: ["Geometry", "Metals", "Lighting"]
  },
  {
    id: "torusKnot",
    title: "Quantum Torus Knot",
    description: "Simpul topologi kuantum dengan transisi kelengkungan kompleks dan pantulan cahaya ganda.",
    type: "torusKnot",
    defaultWireframe: true,
    defaultSpeed: 1.8,
    colorScheme: "#8a2be2",
    tags: ["Topology", "Wireframe", "Glow"]
  },
  {
    id: "wavePlane",
    title: "Deforming Cyber Wave",
    description: "Permukaan bidang bergelombang (vertex wave) yang terdeformasi oleh persamaan matematika sinusoidal.",
    type: "wavePlane",
    defaultWireframe: true,
    defaultSpeed: 2.0,
    colorScheme: "#10b981",
    tags: ["Waveform", "Mathematics", "Sine"]
  },
  {
    id: "quantumCube",
    title: "Tesseract Matrix Cube",
    description: "Struktur kubus bersarang berlapis dengan rotasi multi-aksial dan translasi interior.",
    type: "quantumCube",
    defaultWireframe: false,
    defaultSpeed: 0.8,
    colorScheme: "#f72585",
    tags: ["Dimension", "Matrix", "Abstract"]
  },
  {
    id: "particleVortex",
    title: "Particle Vortex Swarm",
    description: "Ribuan partikel bercahaya yang berputar dalam pusaran gravitasi spiral.",
    type: "particleVortex",
    defaultWireframe: false,
    defaultSpeed: 2.5,
    colorScheme: "#fbbf24",
    tags: ["Particles", "Vortex", "Physics"]
  }
];

export const experienceTimeline: ExperienceItem[] = [
  {
    year: "2024 - Sekarang",
    role: "Lead Creative Frontend Engineer",
    company: "Studio Digital Innovasi",
    description: "Memimpin perancangan arsitektur antarmuka 3D web generasi baru dan eksperimen interaktif untuk klien global.",
    technologies: ["React", "Three.js", "R3F", "TypeScript", "Tailwind CSS"]
  },
  {
    year: "2023 - 2024",
    role: "Fullstack & Creative Web Developer",
    company: "Tech Nexus Lab",
    description: "Membangun aplikasi web interaktif, sistem dashboard performa tinggi, dan animasi visual grafis.",
    technologies: ["Vue.js", "React", "Node.js", "WebGL", "CSS Art"]
  },
  {
    year: "2022 - 2023",
    role: "Frontend Developer & UI Explorer",
    company: "Digital Creations",
    description: "Mengembangkan berbagai landing page award-winning dengan transisi dinamis dan desain responsif.",
    technologies: ["JavaScript", "HTML5", "CSS3", "GSAP", "Tailwind"]
  }
];
