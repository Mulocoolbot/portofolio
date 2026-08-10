export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  image: string;
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  category: '3d-web' | 'fullstack' | 'ai-experiment' | 'creative';
  metrics?: { label: string; value: string }[];
}

export interface SkillCategory {
  title: string;
  skills: {
    name: string;
    level: number; // 0 - 100
    icon?: string;
    description: string;
  }[];
}

export interface ExperimentPreset {
  id: string;
  title: string;
  description: string;
  type: 'icosahedron' | 'torusKnot' | 'wavePlane' | 'quantumCube' | 'particleVortex';
  defaultWireframe: boolean;
  defaultSpeed: number;
  colorScheme: string;
  tags: string[];
}

export interface ExperienceItem {
  year: string;
  role: string;
  company: string;
  description: string;
  technologies: string[];
}
