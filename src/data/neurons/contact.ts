import { NeuronStoryItem } from '../types';

export const contactNeuron: NeuronStoryItem = {
  id: 'contact',
  stepNumber: 9,
  label: 'CONTACT',
  title: 'Let’s Connect & Collaborate',
  subtitle: 'GET IN TOUCH & START COLLABORATION',
  category: 'contact',
  description:
    'Always open to discussing new projects, web development opportunities, software engineering roles, and innovative AI solutions.',
  details: {
    highlight:
      'Available for full-time roles, collaborative projects, technical consultations, and freelance opportunities.',
    points: [
      {
        label: 'Email',
        value: 'ahmadmuliasaputra1@gmail.com',
        href: 'mailto:ahmadmuliasaputra1@gmail.com',
      },
      {
        label: 'LinkedIn',
        value: 'Ahmad Mulia Saputra',
        href: 'https://www.linkedin.com/in/ahmadmulisaputra',
      },
      {
        label: 'GitHub',
        value: 'Mulocoolbot',
        href: 'https://github.com/Mulocoolbot',
      },
      {
        label: 'Response Time',
        value: 'working hour',
      },
    ],
    tags: [
      'Collaboration',
      'Web Development',
      'Software Engineering',
      'Backend & APIs',
      'Open for Work',
    ],
  },
  stats: [
    { label: 'Response', value: 'Working Hours' },
    { label: 'Availability', value: 'Open for Work' },
  ],
  actionLabel: 'Send Direct Message',
  actionUrl: 'mailto:ahmadmuliasaputra1@gmail.com',
};


