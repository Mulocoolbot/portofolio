import { LucideIcon } from 'lucide-react';

export interface NeuronStoryItem {
  id: string;
  stepNumber: number;
  label: string;
  title: string;
  subtitle: string;
  category: 'overview' | 'about' | 'experience' | 'project' | 'skill' | 'education' | 'certificate' | 'contact';
  description: string;
  details: {
    highlight?: string;
    points?: { label: string; value: string; desc?: string }[];
    tags?: string[];
    timeline?: { period: string; role: string; org: string; summary: string }[];
  };
  stats?: { label: string; value: string }[];
  actionLabel?: string;
  actionUrl?: string;
}

export const NEURON_STORY_DATA: NeuronStoryItem[] = [
  // ── 01. MULLO (Overview Profile) ──────────────────────────────────────────
  {
    id: 'mullo',
    stepNumber: 1,
    label: 'MULLO',
    title: 'Mullo — Creative Technologist & 3D Web Architect',
    subtitle: 'PROFILE & EXECUTIVE OVERVIEW',
    category: 'overview',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    details: {
      highlight: 'Menggabungkan rekayasa komputasi grafis spasial 3D dengan antarmuka digital performa tinggi.',
      points: [
        { label: 'Spesialisasi', value: 'Creative WebGL & Spatial Frontend Engineering' },
        { label: 'Fokus Riset', value: 'Interactive Real-time Shaders, Web Audio & Three.js' },
        { label: 'Status Saat Ini', value: 'Tersedia untuk kolaborasi proyek inovatif & freelance' },
        { label: 'Lokasi & Zona Waktu', value: 'Indonesia • GMT+7 (WIB)' },
      ],
      tags: ['Creative Technologist', 'WebGL Architect', 'Three.js Specialist', 'TypeScript'],
    },
    stats: [
      { label: 'Tahun Eksplorasi', value: '3+ Thn' },
      { label: 'Proyek Selesai', value: '25+' },
      { label: 'FPS 3D Rata-rata', value: '60 FPS' },
      { label: 'Kepuasan Klien', value: '100%' },
    ],
    actionLabel: 'Jelajahi Profil Lengkap',
  },

  // ── 02. ABOUT ME ──────────────────────────────────────────────────────────
  {
    id: 'about-me',
    stepNumber: 2,
    label: 'ABOUT ME',
    title: 'Filosofi Desain & Latar Belakang Eksplorasi',
    subtitle: 'CREATIVE PHILOSOPHY & VISION',
    category: 'about',
    description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    details: {
      highlight: '"Bukan sekadar website biasa, tapi pengalaman visual spasial yang berkesan dan imersif."',
      points: [
        { label: 'Visi Kreatif', value: 'Membawa kedalaman 3D ke web modern tanpa mengorbankan kecepatan aksesibilitas.', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod.' },
        { label: 'Pendekatan Kode', value: 'Clean Code, Strict Typing, dan Optimalisasi Memory Buffer GPU.', desc: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco.' },
        { label: 'Eksperimen Berkelanjutan', value: 'Eksplorasi audio FFT, GLSL fragment distortion, dan generative mesh.', desc: 'Duis aute irure dolor in reprehenderit in voluptate.' },
      ],
      tags: ['Digital Aesthetics', 'GPU Optimization', 'Design Systems', 'Micro-Interactions'],
    },
    stats: [
      { label: 'Eksperimen Lab', value: '40+' },
      { label: 'Lines of Shader Code', value: '12k+' },
    ],
    actionLabel: 'Baca Filosofi Lengkap',
  },

  // ── 03. EXPERIENCE (ORGANIZATIONAL) ───────────────────────────────────────
  {
    id: 'experience-org',
    stepNumber: 3,
    label: 'ORGANIZATION',
    title: 'Pengalaman Organisasi & Kepemimpinan',
    subtitle: 'LEADERSHIP & COMMUNITY ROLES',
    category: 'experience',
    description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
    details: {
      highlight: 'Aktif berkontribusi dalam kepemimpinan teknologi komunitas dan inkubasi talenta kreatif.',
      timeline: [
        {
          period: '2023 - 2024',
          role: 'Head of Creative Technology & Research',
          org: 'Komunitas Digital & Web Inovatif',
          summary: 'Memimpin divisi riset teknologi 3D Web, mengoordinasi workshop teknis untuk 200+ partisipan, dan membina tim frontend.',
        },
        {
          period: '2022 - 2023',
          role: 'Lead Project Coordinator & Event Tech',
          org: 'Himpunan Mahasiswa Komputasi',
          summary: 'Mengelola infrastruktur teknis konferensi digital nasional dan mengorkestrasi sistem pendaftaran interaktif realtime.',
        },
        {
          period: '2021 - 2022',
          role: 'Divisi Publikasi & Desain Spasial',
          org: 'Klub Rekayasa Grafis & Multimedia',
          summary: 'Bertanggung jawab atas visual branding interaktif, pameran virtual 3D, dan publikasi aset digital komputasi.',
        },
      ],
      tags: ['Team Leadership', 'Tech Speaker', 'Event Coordinator', 'Community Mentor'],
    },
    actionLabel: 'Lihat Dokumentasi Organisasi',
  },

  // ── 04. EXPERIENCE (PROFESSIONAL) ─────────────────────────────────────────
  {
    id: 'experience-pro',
    stepNumber: 4,
    label: 'PROFESSIONAL',
    title: 'Pengalaman Profesional & Rekayasa Industri',
    subtitle: 'CAREER & INDUSTRY EXPERIENCE',
    category: 'experience',
    description: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.',
    details: {
      highlight: 'Pengalaman memimpin implementasi antarmuka 3D interaktif pada skala produksi komersial.',
      timeline: [
        {
          period: '2024 - Sekarang',
          role: 'Lead Creative Frontend Engineer',
          org: 'Studio Digital Innovasi (Global Projects)',
          summary: 'Merancang arsitektur Three.js / R3F untuk interactive showcase, mengoptimalkan pipeline WebGL hingga 60 FPS pada mobile devices.',
        },
        {
          period: '2023 - 2024',
          role: 'Senior Frontend & WebGL Specialist',
          org: 'Tech Nexus Enterprise Solution',
          summary: 'Mengembangkan dashboard analitik holografis interaktif, micro-frontend modular, dan sistem rendering data spasial berkecepatan tinggi.',
        },
        {
          period: '2022 - 2023',
          role: 'Frontend UI/UX & Interaction Developer',
          org: 'Digital Creative Studio',
          summary: 'Membangun landing page award-winning dengan animasi scroll kompleks, GLSL post-processing, dan dynamic state management.',
        },
      ],
      tags: ['Production Three.js', 'React Architecture', 'Shader Optimization', 'Cross-Browser WebGL'],
    },
    actionLabel: 'Unduh Resume Lengkap',
  },

  // ── 05. PROJECT ───────────────────────────────────────────────────────────
  {
    id: 'project',
    stepNumber: 5,
    label: 'PROJECTS',
    title: 'Koleksi Portofolio Karya & Eksperimen 3D',
    subtitle: 'FEATURED WORKS & DIGITAL PRODUCTS',
    category: 'project',
    description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
    details: {
      highlight: 'Koleksi aplikasi web mutakhir dengan integrasi WebGL 3D, physics engine, dan interaktivitas real-time.',
      points: [
        { label: 'Quantum 3D Nexus', value: 'Interactive WebGL Space & Data Visualization (15,000 Particle Nodes, 60 FPS)' },
        { label: 'Minimalist Analytics UI', value: 'High-Frequency Financial Dashboard dengan grafik holografis & glassmorphism' },
        { label: 'Spatial Audio Visualizer', value: 'Generative Audio Reactive Mesh Sandbox menggunakan Web Audio API & FFT' },
        { label: 'Monochrome 3D Card Engine', value: 'Physically-Based Card Tilting, Gyroscope & Specular Shimmer System' },
      ],
      tags: ['Three.js', 'React Three Fiber', 'GLSL', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    },
    stats: [
      { label: 'Karya Unggulan', value: '4 Showcase' },
      { label: 'Lighthouse Score', value: '99/100' },
    ],
    actionLabel: 'Buka Interactive 3D Lab',
  },

  // ── 06. SKILL ─────────────────────────────────────────────────────────────
  {
    id: 'skill',
    stepNumber: 6,
    label: 'SKILLS',
    title: 'Keahlian Teknis & Spesialisasi Creative Tech',
    subtitle: 'TECHNICAL STACK & CAPABILITIES',
    category: 'skill',
    description: 'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.',
    details: {
      highlight: 'Kombinasi mendalam antara arsitektur rekayasa software modern dan seni visual 3D spasial.',
      points: [
        { label: '3D & Creative WebGL', value: 'Three.js, React Three Fiber, GLSL Shaders, Blender Pipeline, Web Audio API' },
        { label: 'Modern Frontend', value: 'React, Next.js, TypeScript, Tailwind CSS, Framer Motion, GSAP' },
        { label: 'Performance & Tooling', value: 'Vite, Webpack, GPU Buffer Optimization, Chrome DevTools Profiling, Git CI/CD' },
        { label: 'UI/UX & Design', value: 'Figma, Glassmorphism, Micro-interactions, Accessibility (a11y), Dark Mode Architecture' },
      ],
      tags: ['Three.js (95%)', 'React / TS (96%)', 'GLSL Shaders (85%)', 'Tailwind CSS (98%)', 'WebGL (92%)'],
    },
    stats: [
      { label: 'Core Frameworks', value: '8+' },
      { label: 'Tech Proficiency', value: 'Advanced' },
    ],
    actionLabel: 'Lihat Matriks Kompetensi',
  },

  // ── 07. EDUCATION ─────────────────────────────────────────────────────────
  {
    id: 'education',
    stepNumber: 7,
    label: 'EDUCATION',
    title: 'Latar Belakang Pendidikan & Akademis',
    subtitle: 'ACADEMIC BACKGROUND & FORMAL STUDIES',
    category: 'education',
    description: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.',
    details: {
      highlight: 'Landasan ilmu komputer yang kuat dengan fokus pada rekayasa perangkat lunak dan grafika komputasi.',
      timeline: [
        {
          period: '2020 - 2024',
          role: 'Sarjana Ilmu Komputer / Teknik Informatika (S.Kom)',
          org: 'Universitas Terkemuka — Fakultas Ilmu Komputer',
          summary: 'Fokus Riset: Algoritma Rendering Grafika Komputer 3D Web & Optimasi Shaders. Lulus dengan predikat Sangat Memuaskan (Cum Laude).',
        },
        {
          period: '2017 - 2020',
          role: 'Jurusan Sains & Rekayasa Matematika/Komputasi',
          org: 'Sekolah Menengah Tingkat Atas Unggulan',
          summary: 'Aktif dalam olimpiade informatika dan klub pengembangan perangkat lunak matematika komputasional.',
        },
      ],
      tags: ['Computer Science', 'Computer Graphics', 'Software Engineering', 'Algorithms & Data Structures'],
    },
    stats: [
      { label: 'Predikat Kelulusan', value: 'Cum Laude' },
      { label: 'IPK / GPA', value: '3.85 / 4.0' },
    ],
    actionLabel: 'Lihat Riwayat Akademik',
  },

  // ── 08. CERTIFICATE ───────────────────────────────────────────────────────
  {
    id: 'certificate',
    stepNumber: 8,
    label: 'CERTIFICATE',
    title: 'Sertifikasi Keahlian & Lisensi Profesional',
    subtitle: 'LICENSES, CREDENTIALS & HONORS',
    category: 'certificate',
    description: 'Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.',
    details: {
      highlight: 'Kredensial tervalidasi dari institusi internasional dan platform teknologi terkemuka.',
      points: [
        { label: 'Meta Certified Senior Frontend Architect', value: 'Advanced React, State Architecture, Web Performance & UI Engineering' },
        { label: 'Three.js & Creative WebGL Journey Certification', value: 'Mastery in Shader Coding, Physics, Post-Processing & 3D Web Pipeline' },
        { label: 'Google Professional Web Developer Specialist', value: 'Core Web Vitals Optimization, PWA, Browser Performance & a11y Standards' },
        { label: 'TypeScript Advanced Systems Specialist', value: 'Enterprise Strict Typing, Generic Patterns & Fullstack Architecture' },
      ],
      tags: ['Meta Certified', 'Three.js Journey', 'Google Certified', 'TypeScript Expert'],
    },
    stats: [
      { label: 'Sertifikasi Aktif', value: '6+' },
      { label: 'Lisensi Terverifikasi', value: '100%' },
    ],
    actionLabel: 'Verifikasi Kredensial Online',
  },

  // ── 09. CONTACT ───────────────────────────────────────────────────────────
  {
    id: 'contact',
    stepNumber: 9,
    label: 'CONTACT',
    title: 'Mari Terhubung & Mulai Kolaborasi Digital',
    subtitle: 'GET IN TOUCH & INITIATE PROJECT',
    category: 'contact',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.',
    details: {
      highlight: 'Terbuka untuk kesempatan kerja sama proyek kreatif, konsultasi teknis 3D Web, atau peran teknologi strategis.',
      points: [
        { label: 'Alamat Email Resmi', value: 'mullo.creative@example.com' },
        { label: 'LinkedIn Professional', value: 'linkedin.com/in/mullo-developer' },
        { label: 'GitHub Repository', value: 'github.com/Mulocoolbot' },
        { label: 'Ketersediaan Respon', value: 'Biasanya membalas dalam waktu < 24 Jam kerja' },
      ],
      tags: ['Collaboration', 'Freelance 3D Web', 'Consulting', 'Full-time Opportunities'],
    },
    stats: [
      { label: 'Waktu Respon', value: '< 24 Jam' },
      { label: 'Status Ketersediaan', value: 'Open for Work' },
    ],
    actionLabel: 'Kirim Pesan Langsung',
  },
];
