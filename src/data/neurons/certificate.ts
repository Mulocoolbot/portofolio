import { NeuronStoryItem } from '../types';

export const certificateNeuron: NeuronStoryItem = {
  id: 'certificate',
  stepNumber: 8,
  label: 'CERTIFICATE',
  title: 'Certifications & Credentials',
  subtitle: 'LICENSES, CREDENTIALS & HONORS',
  category: 'certificate',
  description:
    'Verified technical credentials, completed professional courses, and domain competencies in software engineering and web technologies.',
  details: {
    highlight:
      'Validated skills and continuous learning across modern web engineering and data systems.',
    points: [
      {
        label: 'Web & Backend Development',
        value:
          'RESTful API Architecture, Database Engineering & Server-side Development',
      },
      {
        label: 'Fullstack & Frontend Systems',
        value:
          'Modern Frontend Engineering, React, TypeScript, and Responsive UI',
      },
      {
        label: 'Artificial Intelligence & Data',
        value:
          'Machine Learning Foundations, Python for Data, and Model Deployment',
      },
      {
        label: 'UI/UX & Product Design',
        value:
          'User Interface Design, Prototyping, Usability Principles, and Design Systems',
      },
    ],
    tags: [
      'Web Development',
      'Backend Engineering',
      'Artificial Intelligence',
      'UI/UX Design',
      'Fullstack',
    ],
  },
  stats: [
    { label: 'Certifications', value: 'Active' },
    { label: 'Verification', value: 'Verified' },
  ],
};

