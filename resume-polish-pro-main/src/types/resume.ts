export interface ResumeEducation {
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

export interface ResumeExperience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface ResumeProject {
  name: string;
  description: string;
  bullets: string[];
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  link?: string;
}

export interface ResumeLink {
  label: string;
  url: string;
}

export type SkillCategory = 'technical' | 'soft' | 'tools';

export interface CategorizedSkills {
  technical: string[];
  soft: string[];
  tools: string[];
}

export const SKILL_CATEGORY_LABELS: Record<SkillCategory, string> = {
  technical: 'Technical Skills',
  soft: 'Soft Skills',
  tools: 'Tools & Technologies',
};

export interface ResumeData {
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  education: ResumeEducation[];
  experience: ResumeExperience[];
  projects: ResumeProject[];
  skills: string[];
  categorizedSkills: CategorizedSkills;
  links: ResumeLink[];
}

export const emptyCategorizedSkills: CategorizedSkills = {
  technical: [],
  soft: [],
  tools: [],
};

export const emptyResume: ResumeData = {
  name: '',
  email: '',
  phone: '',
  location: '',
  summary: '',
  education: [],
  experience: [],
  projects: [],
  skills: [],
  categorizedSkills: { ...emptyCategorizedSkills },
  links: [],
};
