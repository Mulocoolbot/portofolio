import { NeuronStoryItem } from '../types';

export const projectNeuron: NeuronStoryItem = {
  id: 'project',
  stepNumber: 5,
  label: 'PROJECTS',
  title: 'Featured Projects & Digital Works',
  subtitle: 'PRODUCTION APPS & SYSTEMS ARCHITECTURE',
  category: 'project',
  description:
    'A curated portfolio of production web applications, government information systems, AI-powered reasoning platforms, and interactive digital products.',
  details: {
    highlight:
      'Engineered with a strong emphasis on backend scalability, robust database architectures, and intuitive modern interfaces.',
    projects: [
      {
        title: 'Central Bangka Regency Government Super App',
        type: 'Government Project',
        role: 'Backend Developer Intern',
        duration: '2024 - 2025',
        description:
          'A centralized municipal Super App integrating multi-department public digital services, executive leader dashboards, citizen dispute/complaint reporting, and real-time CCTV monitoring.',
        techStack: [
          'Laravel 10',
          'PHP 8.2',
          'MySQL',
          'RESTful APIs',
          'Tailwind CSS',
          'Docker',
          'Kubernetes',
          'GitLab CI/CD',
        ],
        contributions: [
          'Engineered backend API architecture and database models for public services, sectoral data, and executive leadership dashboards.',
          'Implemented the citizen complaint management system with workflow status tracking, role-based reviews, and notification services.',
          'Developed municipal CCTV streaming proxy services and integrated regional government information endpoints.',
          'Collaborated on Kubernetes container deployment pipelines and automated testing via GitLab CI/CD.',
        ],
      },
      {
        title: 'Interharko — Integrated Commodity Market & Price Monitoring System',
        type: 'Government / Information System',
        role: 'Backend & Fullstack Developer',
        duration: '2024 - 2025',
        description:
          'A web-based commodity price and market monitoring system designed for regional market oversight, merchant stock tracking, price trend analytics, and public economic transparency.',
        techStack: [
          'Laravel',
          'PHP',
          'MySQL',
          'REST APIs',
          'JavaScript',
          'Tailwind CSS / Bootstrap',
          'Docker',
        ],
        contributions: [
          'Developed core merchant commodity price management modules, daily stock tracking, and merchant profile systems.',
          'Engineered date and market filter engines to compute real-time price fluctuations, variance percentages, and historical trends.',
          'Built administrative CMS portals for regional news, event agendas, sectoral bank data, and tourism destination registries.',
          'Architected REST API endpoints supporting cross-platform web and mobile data synchronization.',
        ],
      },
      {
        title: 'AI-Powered Fake News & Hoax Detection Platform',
        type: 'AI & NLP / Research Project',
        role: 'AI Engineer & Fullstack Developer',
        duration: '2025 - 2026',
        description:
          'An intelligent web verification platform that analyzes news articles, extracts core factual claims, cross-references digital sources, and synthesizes detailed credibility investigation reports.',
        techStack: [
          'Next.js 15',
          'React 19',
          'TypeScript',
          'Tailwind CSS',
          'Google Gemini API',
          'NLP Fact-Checking Engine',
        ],
        contributions: [
          'Integrated LLM reasoning pipeline for automated statement extraction and real-time factual claim verification.',
          'Built an interactive multi-step analysis timeline UI with confidence scoring and verifiable evidence citation cards.',
          'Implemented bilingual localization (Indonesian / English) and responsive dark-mode user experience.',
          'Designed structured JSON output schemas for consistent report synthesis, source citations, and claim debunking.',
        ],
      },
      {
        title: 'Autonomous Voice AI Assistant & Desktop Node ("Jarvis")',
        type: 'AI & Systems / Personal Project',
        role: 'AI & Systems Engineer',
        duration: '2025 - 2026',
        description:
          'An autonomous localized voice assistant system featuring real-time wake-word detection, bidirectional WebSocket audio streaming, vector database memory, and desktop control automation.',
        techStack: [
          'Python 3.11',
          'WebSockets',
          'OpenWakeWord',
          'SpeechRecognition',
          'Google TTS',
          'ChromaDB',
          'LangChain',
        ],
        contributions: [
          'Implemented real-time wake-word activation and dynamic voice recording with adaptive silence threshold detection.',
          'Built bidirectional WebSocket communication between desktop client nodes and the central LangChain AI agent.',
          'Integrated ChromaDB vector database for long-term semantic memory and contextual conversational recall.',
          'Engineered low-latency text-to-speech audio feedback pipelines using Google TTS and Pygame audio playback.',
        ],
      },
      {
        title: 'School Attendance & Academic Management System',
        type: 'Academic / Educational Web App',
        role: 'Fullstack Developer',
        duration: '2025 - 2026',
        description:
          'A modern digital attendance and academic management system for educational institutions with role-based access control, attendance logging, automated summaries, and Excel data export.',
        techStack: [
          'Next.js 16',
          'React 19',
          'TypeScript',
          'Prisma ORM',
          'PostgreSQL',
          'Tailwind CSS',
          'JWT Authentication',
        ],
        contributions: [
          'Designed Prisma relational database schema for students, classes, attendance records, and faculty members.',
          'Implemented secure JWT authentication and role-based access control (Admin, Teacher, Student).',
          'Built attendance logging workflows with automated daily summaries and Excel (.xlsx) report generation.',
          'Engineered responsive data tables with real-time filtering, search, and status badges.',
        ],
      },
      {
        title: 'Personal Trading & Finance Management OS',
        type: 'Financial Web Application',
        role: 'Frontend & Fullstack Developer',
        duration: '2025 - 2026',
        description:
          'A personal financial management and trade journaling system featuring multi-account tracking, P/L calendars, performance analytics, and cash flow visualization.',
        techStack: [
          'React 19',
          'Vite',
          'TypeScript',
          'Tailwind CSS',
          'Recharts',
          'LocalStorage / Supabase',
        ],
        contributions: [
          'Engineered mathematical financial engines for automated Current Balance, Balance Growth, and Trading ROI calculation.',
          'Built interactive P/L calendar views, trade position loggers, and daily/weekly/monthly performance reports.',
          'Developed visual analytics charts with Recharts and lightweight client-side data persistence with JSON export/import.',
        ],
      },
      {
        title: 'World of Mullo — Spatial 3D Neural Web Portfolio',
        type: 'Creative Tech / 3D Web Portfolio',
        role: 'Creative Developer & 3D Web Engineer',
        duration: '2026',
        description:
          'An interactive 3D neural universe portfolio featuring procedural shaders, glowing synapsing neurons, spatial audio engine, and fluid glassmorphism UI.',
        techStack: [
          'React 19',
          'Three.js',
          'React Three Fiber',
          'GLSL Shaders',
          'TypeScript',
          'Tailwind CSS',
          'Web Audio API',
          'Framer Motion',
        ],
        contributions: [
          'Built procedural 3D neural networks with custom GLSL shaders, camera transitions, and dynamic node focus.',
          'Designed glassmorphism UI with responsive detail cards, audio synthesizers, and continuous background soundtrack marquee.',
          'Engineered high-performance 60 FPS rendering pipeline with responsive mobile/desktop adaptation.',
        ],
      },
    ],
    tags: [
      'Government Super App',
      'Interharko System',
      'AI Hoax Detector',
      'Voice AI Jarvis',
      'Academic Attendance',
      'Trading Finance OS',
      '3D Neural WebGL',
    ],
  },
  stats: [
    { label: 'Completed Projects', value: '7 Apps' },
    { label: 'Stack Expertise', value: 'Fullstack' },
  ],
};


