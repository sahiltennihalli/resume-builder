import { ResumeData, SKILL_CATEGORY_LABELS, SkillCategory } from '@/types/resume';

export function resumeToPlainText(data: ResumeData): string {
  const lines: string[] = [];

  if (data.name) lines.push(data.name.toUpperCase(), '');

  const contact = [data.email, data.phone, data.location].filter(Boolean);
  if (contact.length) lines.push(contact.join(' | '), '');

  if (data.summary) {
    lines.push('SUMMARY', '─'.repeat(40), data.summary, '');
  }

  if (data.education.length) {
    lines.push('EDUCATION', '─'.repeat(40));
    data.education.forEach((e) => {
      lines.push(`${e.degree} in ${e.field}`);
      lines.push(`${e.school} | ${e.startDate} – ${e.endDate}`);
      lines.push('');
    });
  }

  if (data.experience.length) {
    lines.push('EXPERIENCE', '─'.repeat(40));
    data.experience.forEach((e) => {
      lines.push(`${e.role} — ${e.company}`);
      lines.push(`${e.startDate} – ${e.endDate}`);
      e.bullets.forEach((b) => lines.push(`  • ${b}`));
      lines.push('');
    });
  }

  if (data.projects.length) {
    lines.push('PROJECTS', '─'.repeat(40));
    data.projects.forEach((p) => {
      const urls = [p.liveUrl, p.githubUrl].filter(Boolean);
      lines.push(p.name + (urls.length ? ` (${urls.join(', ')})` : ''));
      if (p.description) lines.push(p.description);
      if (p.techStack && p.techStack.length) lines.push(`Tech: ${p.techStack.join(', ')}`);
      lines.push('');
    });
  }

  // Categorized skills
  const cats = data.categorizedSkills;
  if (cats) {
    const hasAny = cats.technical.length || cats.soft.length || cats.tools.length;
    if (hasAny) {
      lines.push('SKILLS', '─'.repeat(40));
      (Object.keys(SKILL_CATEGORY_LABELS) as SkillCategory[]).forEach((cat) => {
        if (cats[cat].length) {
          lines.push(`${SKILL_CATEGORY_LABELS[cat]}: ${cats[cat].join(', ')}`);
        }
      });
      lines.push('');
    }
  }

  if (data.links.length) {
    lines.push('LINKS', '─'.repeat(40));
    data.links.forEach((l) => lines.push(`${l.label}: ${l.url}`));
    lines.push('');
  }

  return lines.join('\n').trim();
}
