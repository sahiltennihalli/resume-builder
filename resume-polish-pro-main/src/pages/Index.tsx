import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResumeData, ResumeEducation, ResumeExperience, ResumeLink, CategorizedSkills, emptyResume, emptyCategorizedSkills } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Eye } from 'lucide-react';
import SkillsSection from '@/components/SkillsSection';
import ProjectsSection from '@/components/ProjectsSection';

const RESUME_STORAGE_KEY = 'ai-resume-data';

function loadResume(): ResumeData {
  try {
    const raw = localStorage.getItem(RESUME_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Migrate: ensure categorizedSkills exists
      if (!parsed.categorizedSkills) {
        parsed.categorizedSkills = { ...emptyCategorizedSkills };
      }
      // Migrate: ensure projects have techStack
      if (parsed.projects) {
        parsed.projects = parsed.projects.map((p: any) => ({
          ...p,
          techStack: p.techStack || [],
          liveUrl: p.liveUrl || '',
          githubUrl: p.githubUrl || '',
        }));
      }
      return parsed;
    }
  } catch {}
  return { ...emptyResume, categorizedSkills: { ...emptyCategorizedSkills } };
}

function saveResume(data: ResumeData) {
  localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(data));
}

const SectionHeader: React.FC<{ title: string; onAdd?: () => void }> = ({ title, onAdd }) => (
  <div className="flex items-center justify-between mb-3 mt-8">
    <h2 className="font-[var(--font-display)] text-lg font-semibold tracking-tight">{title}</h2>
    {onAdd && (
      <Button type="button" variant="outline" size="sm" onClick={onAdd} className="gap-1">
        <Plus className="h-3.5 w-3.5" /> Add
      </Button>
    )}
  </div>
);

const Index: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<ResumeData>(loadResume);

  const update = <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => {
    setData((prev) => {
      const next = { ...prev, [key]: value };
      saveResume(next);
      return next;
    });
  };

  const handlePreview = () => {
    saveResume(data);
    navigate('/preview');
  };

  // Education helpers
  const addEducation = () => update('education', [...data.education, { school: '', degree: '', field: '', startDate: '', endDate: '' }]);
  const updateEducation = (i: number, patch: Partial<ResumeEducation>) => {
    const arr = [...data.education];
    arr[i] = { ...arr[i], ...patch };
    update('education', arr);
  };
  const removeEducation = (i: number) => update('education', data.education.filter((_, j) => j !== i));

  // Experience helpers
  const addExperience = () => update('experience', [...data.experience, { company: '', role: '', startDate: '', endDate: '', bullets: [''] }]);
  const updateExperience = (i: number, patch: Partial<ResumeExperience>) => {
    const arr = [...data.experience];
    arr[i] = { ...arr[i], ...patch };
    update('experience', arr);
  };
  const removeExperience = (i: number) => update('experience', data.experience.filter((_, j) => j !== i));
  const updateExpBullet = (ei: number, bi: number, val: string) => {
    const arr = [...data.experience];
    const bullets = [...arr[ei].bullets];
    bullets[bi] = val;
    arr[ei] = { ...arr[ei], bullets };
    update('experience', arr);
  };
  const addExpBullet = (ei: number) => {
    const arr = [...data.experience];
    arr[ei] = { ...arr[ei], bullets: [...arr[ei].bullets, ''] };
    update('experience', arr);
  };
  const removeExpBullet = (ei: number, bi: number) => {
    const arr = [...data.experience];
    arr[ei] = { ...arr[ei], bullets: arr[ei].bullets.filter((_, j) => j !== bi) };
    update('experience', arr);
  };

  // Links
  const addLink = () => update('links', [...data.links, { label: '', url: '' }]);
  const updateLink = (i: number, patch: Partial<ResumeLink>) => {
    const arr = [...data.links];
    arr[i] = { ...arr[i], ...patch };
    update('links', arr);
  };
  const removeLink = (i: number) => update('links', data.links.filter((_, j) => j !== i));

  return (
    <div className="min-h-screen bg-background">
      <header className="no-print sticky top-0 z-10 border-b bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <h1 className="font-[var(--font-display)] text-xl font-bold tracking-tight">Resume Builder</h1>
          <Button onClick={handlePreview} className="gap-2">
            <Eye className="h-4 w-4" /> Preview & Export
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8 pb-20">
        {/* Personal Info */}
        <section>
          <h2 className="font-[var(--font-display)] text-lg font-semibold tracking-tight mb-3">Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" value={data.name} onChange={(e) => update('name', e.target.value)} placeholder="Jane Smith" maxLength={100} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={data.email} onChange={(e) => update('email', e.target.value)} placeholder="jane@example.com" maxLength={255} />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={data.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+1 555-123-4567" maxLength={30} />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={data.location} onChange={(e) => update('location', e.target.value)} placeholder="San Francisco, CA" maxLength={100} />
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className="mt-8">
          <Label htmlFor="summary">Professional Summary</Label>
          <Textarea id="summary" value={data.summary} onChange={(e) => update('summary', e.target.value)} placeholder="Brief overview of your professional background…" className="mt-1" rows={3} maxLength={1000} />
        </section>

        {/* Education */}
        <SectionHeader title="Education" onAdd={addEducation} />
        {data.education.map((edu, i) => (
          <div key={i} className="border rounded-md p-4 mb-3 bg-card relative">
            <button type="button" onClick={() => removeEducation(i)} className="absolute top-3 right-3 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div><Label>School</Label><Input value={edu.school} onChange={(e) => updateEducation(i, { school: e.target.value })} maxLength={150} /></div>
              <div><Label>Degree</Label><Input value={edu.degree} onChange={(e) => updateEducation(i, { degree: e.target.value })} maxLength={100} /></div>
              <div><Label>Field of Study</Label><Input value={edu.field} onChange={(e) => updateEducation(i, { field: e.target.value })} maxLength={100} /></div>
              <div className="flex gap-2">
                <div className="flex-1"><Label>Start</Label><Input value={edu.startDate} onChange={(e) => updateEducation(i, { startDate: e.target.value })} placeholder="2020" maxLength={20} /></div>
                <div className="flex-1"><Label>End</Label><Input value={edu.endDate} onChange={(e) => updateEducation(i, { endDate: e.target.value })} placeholder="2024" maxLength={20} /></div>
              </div>
            </div>
          </div>
        ))}

        {/* Experience */}
        <SectionHeader title="Experience" onAdd={addExperience} />
        {data.experience.map((exp, i) => (
          <div key={i} className="border rounded-md p-4 mb-3 bg-card relative">
            <button type="button" onClick={() => removeExperience(i)} className="absolute top-3 right-3 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div><Label>Company</Label><Input value={exp.company} onChange={(e) => updateExperience(i, { company: e.target.value })} maxLength={150} /></div>
              <div><Label>Role</Label><Input value={exp.role} onChange={(e) => updateExperience(i, { role: e.target.value })} maxLength={150} /></div>
              <div className="flex gap-2">
                <div className="flex-1"><Label>Start</Label><Input value={exp.startDate} onChange={(e) => updateExperience(i, { startDate: e.target.value })} placeholder="Jan 2022" maxLength={20} /></div>
                <div className="flex-1"><Label>End</Label><Input value={exp.endDate} onChange={(e) => updateExperience(i, { endDate: e.target.value })} placeholder="Present" maxLength={20} /></div>
              </div>
            </div>
            <Label>Bullet Points</Label>
            {exp.bullets.map((b, bi) => (
              <div key={bi} className="flex items-center gap-2 mt-1">
                <span className="text-muted-foreground text-xs">•</span>
                <Input value={b} onChange={(e) => updateExpBullet(i, bi, e.target.value)} className="flex-1" maxLength={300} />
                <button type="button" onClick={() => removeExpBullet(i, bi)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            ))}
            <Button type="button" variant="ghost" size="sm" onClick={() => addExpBullet(i)} className="mt-1 gap-1 text-xs"><Plus className="h-3 w-3" /> Bullet</Button>
          </div>
        ))}

        {/* Projects */}
        <ProjectsSection
          projects={data.projects}
          onChange={(projects) => update('projects', projects)}
        />

        {/* Skills */}
        <SkillsSection
          skills={data.categorizedSkills}
          onChange={(categorizedSkills) => update('categorizedSkills', categorizedSkills)}
        />

        {/* Links */}
        <SectionHeader title="Links" onAdd={addLink} />
        {data.links.map((link, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <Input value={link.label} onChange={(e) => updateLink(i, { label: e.target.value })} placeholder="Label (e.g. GitHub)" className="w-1/3" maxLength={50} />
            <Input value={link.url} onChange={(e) => updateLink(i, { url: e.target.value })} placeholder="https://…" className="flex-1" maxLength={500} />
            <button type="button" onClick={() => removeLink(i)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Index;
