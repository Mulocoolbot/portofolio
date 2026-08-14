import { NeuronStoryItem } from '../types';

export const educationNeuron: NeuronStoryItem = {
  id: 'education',
  stepNumber: 7,
  label: 'EDUCATION',
  title: 'Education & Academic Background',
  subtitle: 'ACADEMIC BACKGROUND & FORMAL STUDIES',
  category: 'education',
  description:
    'Academic journey in Informatics Engineering with a strong focus on software engineering, web architectures, information systems, and artificial intelligence.',
  details: {
    highlight:
      'Building strong computer science foundations and active leadership in academic student organizations.',
    timeline: [
      {
        period: '2021 - Present (Seventh Semester)',
        role: 'Bachelor of Informatics Engineering (S.Kom candidate)',
        org: 'Institut Teknologi Sumatera (ITERA)',
        summary:
          'Faculty of Industrial Technology — Informatics Engineering Study Program.',
        points: [
          'Seventh semester student pursuing a Bachelor of Engineering in Informatics.',
          'Core coursework: Algorithms, Data Structures, Web Development, Database Systems, Software Engineering, and AI.',
          'Active leadership in the Informatics Student Association (HMIF ITERA) and regional student bodies.',
        ],
      },
    ],
    tags: [
      'Informatics Engineering',
      'Institut Teknologi Sumatera',
      'Software Engineering',
      'Information Systems',
      'Artificial Intelligence',
    ],
  },
  stats: [
    { label: 'Current Level', value: 'Semester 7' },
    { label: 'Degree Track', value: 'S.Kom Cand.' },
  ],
};

