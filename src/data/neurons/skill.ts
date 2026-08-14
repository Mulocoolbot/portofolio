import { NeuronStoryItem } from '../types';

export const skillNeuron: NeuronStoryItem = {
  id: 'skill',
  stepNumber: 6,
  label: 'SKILLS',
  title: 'Skills & Core Competencies',
  subtitle: 'TECHNICAL HARD SKILLS & PROFESSIONAL SOFT SKILLS',
  category: 'skill',
  description:
    'A well-rounded profile combining solid backend architecture, fullstack web development, emerging AI integration, and proven leadership and communication abilities.',
  details: {
    highlight:
      'Proven ability to build scalable software solutions from database to UI, reinforced by active team leadership and project coordination.',
    sections: [
      {
        title: 'Hard Skills — Backend Engineering & APIs',
        content:
          'Engineered production RESTful APIs, MVC backend architectures, role-based access control (RBAC), and municipal service microservices across government and commercial projects.',
        items: [
          'PHP 8.x',
          'Laravel 10 / 11',
          'Node.js',
          'RESTful API Architecture',
          'JWT Authentication',
          'Role-Based Access Control (RBAC)',
          'API Testing & Debugging',
        ],
      },
      {
        title: 'Hard Skills — Database Architecture & Data Systems',
        content:
          'Designed relational database schemas, optimized complex multi-table SQL queries, migrations, seeders, and integrated vector embedding databases for AI workflows.',
        items: [
          'MySQL',
          'PostgreSQL',
          'Prisma ORM',
          'Eloquent ORM',
          'ChromaDB (Vector DB)',
          'Database Schema Design',
          'Query Optimization',
        ],
      },
      {
        title: 'Hard Skills — Frontend & UI Engineering',
        content:
          'Built responsive, interactive modern web interfaces, state management architectures, data visualization dashboards, and creative 3D spatial web applications.',
        items: [
          'React 19',
          'Next.js 15 / 16',
          'TypeScript',
          'Tailwind CSS',
          'Vite',
          'Recharts Data Viz',
          'Three.js & WebGL',
          'Responsive UI/UX',
        ],
      },
      {
        title: 'Hard Skills — Artificial Intelligence & Systems',
        content:
          'Integrated generative AI reasoning pipelines, automated NLP fact-checking systems, wake-word detection, and real-time bidirectional WebSocket audio streaming.',
        items: [
          'Google Gemini API',
          'Python 3.11',
          'LangChain Agents',
          'OpenWakeWord',
          'Speech Recognition & TTS',
          'WebSockets Streaming',
          'Vector Semantic Search',
        ],
      },
      {
        title: 'Hard Skills — DevOps, Tools & Infrastructure',
        content:
          'Utilized containerization tools, CI/CD automated deployment pipelines, package managers, and production hosting platforms.',
        items: [
          'Docker & Docker Compose',
          'Kubernetes',
          'GitLab CI/CD',
          'Git / GitHub',
          'Composer & npm',
          'Postman',
          'Vercel & Netlify',
        ],
      },
      {
        title: 'Professional Soft Skills',
        content:
          '• Leadership — Experienced in leading divisions, coordinating teams, and managing events and organizational programs.\n• Teamwork & Collaboration — Able to work effectively with team members and collaborate with internal and external stakeholders.\n• Communication — Skilled in communicating ideas, coordinating activities, and maintaining professional relationships with diverse stakeholders.\n• Project Coordination — Experienced in planning, organizing, and coordinating projects and events from preparation through execution.\n• Problem Solving — Able to identify challenges, evaluate situations, and develop practical solutions throughout project and organizational activities.\n• Time Management — Capable of managing multiple responsibilities, prioritizing tasks, and meeting deadlines effectively.\n• Adaptability — Able to adapt to different roles, working environments, responsibilities, and project requirements.\n• Initiative & Responsibility — Proactive in taking responsibility, contributing ideas, and supporting projects beyond assigned tasks.',
        items: [
          'Leadership',
          'Teamwork & Collaboration',
          'Communication',
          'Project Coordination',
          'Problem Solving',
          'Time Management',
          'Adaptability',
          'Initiative & Responsibility',
        ],
      },
    ],
    tags: [
      'Backend Engineering',
      'Laravel & PHP',
      'React & Next.js',
      'Database Architecture',
      'Artificial Intelligence',
      'DevOps & Docker',
      'Leadership & Teamwork',
    ],
  },
  stats: [
    { label: 'Hard Skill Domains', value: '5 Domains' },
    { label: 'Core Focus', value: 'Backend & AI' },
    { label: 'Soft Skills', value: '8 Pillars' },
    { label: 'Stack Profile', value: 'Fullstack' },
  ],
};


