export type NeuronCategory =
  | 'overview'
  | 'about'
  | 'experience'
  | 'project'
  | 'skill'
  | 'education'
  | 'certificate'
  | 'contact';

export interface NeuronPoint {
  label: string;
  value: string;
  desc?: string;
  href?: string;
  url?: string;
}

export interface NeuronTimelineItem {
  period: string;
  role: string;
  org: string;
  summary?: string;
  points?: string[];
}

export interface NeuronSection {
  title: string;
  content?: string;
  items?: string[];
}

export interface NeuronProjectItem {
  title: string;
  type?: string;
  role: string;
  duration?: string;
  description: string;
  techStack: string[];
  contributions: string[];
  links?: {
    github?: string;
    demo?: string;
    caseStudy?: string;
  };
}

export interface NeuronStat {
  label: string;
  value: string;
}

export interface NeuronStoryItem {
  id: string;
  stepNumber: number;
  label: string;
  title: string;
  subtitle: string;
  category: NeuronCategory;
  description: string;
  details: {
    highlight?: string;
    points?: NeuronPoint[];
    tags?: string[];
    timeline?: NeuronTimelineItem[];
    sections?: NeuronSection[];
    projects?: NeuronProjectItem[];
  };
  stats?: NeuronStat[];
  actionLabel?: string;
  actionUrl?: string;
}
