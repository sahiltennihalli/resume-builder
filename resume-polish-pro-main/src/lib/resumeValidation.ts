import { ResumeData } from '@/types/resume';

export interface ValidationWarning {
  message: string;
}

export function validateResume(data: ResumeData): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  if (!data.name.trim()) {
    warnings.push({ message: 'Name is missing.' });
  }

  if (data.projects.length === 0 && data.experience.length === 0) {
    warnings.push({ message: 'No projects or experience listed.' });
  }

  return warnings;
}
