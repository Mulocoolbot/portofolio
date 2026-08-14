import { NeuronStoryItem } from '../types';
import { mulloNeuron } from './mullo';
import { aboutMeNeuron } from './aboutMe';
import { experienceOrgNeuron } from './experienceOrg';
import { experienceProNeuron } from './experiencePro';
import { projectNeuron } from './project';
import { skillNeuron } from './skill';
import { educationNeuron } from './education';
import { certificateNeuron } from './certificate';
import { contactNeuron } from './contact';

export {
  mulloNeuron,
  aboutMeNeuron,
  experienceOrgNeuron,
  experienceProNeuron,
  projectNeuron,
  skillNeuron,
  educationNeuron,
  certificateNeuron,
  contactNeuron,
};

export const NEURON_STORY_DATA: NeuronStoryItem[] = [
  mulloNeuron,
  aboutMeNeuron,
  experienceOrgNeuron,
  experienceProNeuron,
  projectNeuron,
  skillNeuron,
  educationNeuron,
  certificateNeuron,
  contactNeuron,
];

export default NEURON_STORY_DATA;
