import React from 'react';
import { ResumeData, SKILL_CATEGORY_LABELS, SkillCategory } from '@/types/resume';
import { ExternalLink, Github } from 'lucide-react';

interface Props {
  data: ResumeData;
}

const ResumePreviewContent: React.FC<Props> = ({ data }) => {
  const hasSkills =
    data.categorizedSkills &&
    (data.categorizedSkills.technical.length > 0 ||
      data.categorizedSkills.soft.length > 0 ||
      data.categorizedSkills.tools.length > 0);

  return (
    <div className="resume-preview font-[var(--font-body)] text-foreground max-w-[720px] mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        {data.name && (
          <h1 className="font-[var(--font-display)] text-3xl font-bold tracking-tight mb-1">
            {data.name}
          </h1>
        )}
        {[data.email, data.phone, data.location].filter(Boolean).length > 0 && (
          <p className="text-sm text-muted-foreground">
            {[data.email, data.phone, data.location].filter(Boolean).join('  ·  ')}
          </p>
        )}
        {data.links.length > 0 && (
          <p className="text-sm text-muted-foreground mt-1">
            {data.links.map((l, i) => (
              <span key={i}>
                {i > 0 && '  ·  '}
                <a href={l.url} target="_blank" rel="noopener noreferrer" className="underline">
                  {l.label}
                </a>
              </span>
            ))}
          </p>
        )}
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="resume-section mb-5">
          <h2 className="font-[var(--font-display)] text-sm font-semibold uppercase tracking-widest border-b border-foreground pb-1 mb-2">
            Summary
          </h2>
          <p className="text-sm leading-relaxed">{data.summary}</p>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="resume-section mb-5">
          <h2 className="font-[var(--font-display)] text-sm font-semibold uppercase tracking-widest border-b border-foreground pb-1 mb-2">
            Education
          </h2>
          {data.education.map((e, i) => (
            <div key={i} className="resume-item mb-2">
              <div className="flex justify-between items-baseline">
                <p className="text-sm font-semibold">{e.degree}{e.field ? ` in ${e.field}` : ''}</p>
                <p className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                  {e.startDate} – {e.endDate}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">{e.school}</p>
            </div>
          ))}
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="resume-section mb-5">
          <h2 className="font-[var(--font-display)] text-sm font-semibold uppercase tracking-widest border-b border-foreground pb-1 mb-2">
            Experience
          </h2>
          {data.experience.map((e, i) => (
            <div key={i} className="resume-item mb-3">
              <div className="flex justify-between items-baseline">
                <p className="text-sm font-semibold">{e.role}</p>
                <p className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                  {e.startDate} – {e.endDate}
                </p>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{e.company}</p>
              {e.bullets.length > 0 && (
                <ul className="list-disc list-outside ml-4 space-y-0.5">
                  {e.bullets.map((b, j) => (
                    <li key={j} className="text-sm leading-snug">{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div className="resume-section mb-5">
          <h2 className="font-[var(--font-display)] text-sm font-semibold uppercase tracking-widest border-b border-foreground pb-1 mb-2">
            Projects
          </h2>
          {data.projects.map((p, i) => (
            <div key={i} className="resume-item mb-4 border border-border rounded-md p-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold">{p.name || 'Untitled Project'}</p>
                <div className="flex items-center gap-2">
                  {p.liveUrl && (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground"
                      title="Live demo"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {p.githubUrl && (
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground"
                      title="GitHub"
                    >
                      <Github className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
              {p.description && (
                <p className="text-sm text-muted-foreground mb-2">{p.description}</p>
              )}
              {p.techStack && p.techStack.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-1">
                  {p.techStack.map((t, j) => (
                    <span
                      key={j}
                      className="inline-block rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills - Categorized */}
      {hasSkills && (
        <div className="resume-section mb-5">
          <h2 className="font-[var(--font-display)] text-sm font-semibold uppercase tracking-widest border-b border-foreground pb-1 mb-2">
            Skills
          </h2>
          {(Object.keys(SKILL_CATEGORY_LABELS) as SkillCategory[]).map((cat) => {
            const items = data.categorizedSkills[cat];
            if (!items || items.length === 0) return null;
            return (
              <div key={cat} className="mb-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                  {SKILL_CATEGORY_LABELS[cat]}
                </p>
                <div className="flex flex-wrap gap-1">
                  {items.map((s, j) => (
                    <span
                      key={j}
                      className="inline-block rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ResumePreviewContent;
