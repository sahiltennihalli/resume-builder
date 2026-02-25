import React, { useState, KeyboardEvent } from 'react';
import { ResumeProject } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Plus, Trash2, ChevronDown, X } from 'lucide-react';

interface Props {
  projects: ResumeProject[];
  onChange: (projects: ResumeProject[]) => void;
}

const TechStackInput: React.FC<{
  items: string[];
  onChange: (items: string[]) => void;
}> = ({ items, onChange }) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = input.trim();
      if (trimmed && !items.includes(trimmed)) {
        onChange([...items, trimmed]);
        setInput('');
      }
    }
  };

  return (
    <div>
      <Label>Tech Stack</Label>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type tech and press Enter"
        maxLength={60}
        className="mb-1.5"
      />
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {items.map((t, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground"
            >
              {t}
              <button
                type="button"
                onClick={() => onChange(items.filter((_, j) => j !== i))}
                className="ml-0.5 rounded-full hover:bg-accent p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const ProjectsSection: React.FC<Props> = ({ projects, onChange }) => {
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set(projects.map((_, i) => i)));

  const addProject = () => {
    const newProjects = [
      ...projects,
      { name: '', description: '', bullets: [], techStack: [], liveUrl: '', githubUrl: '' },
    ];
    onChange(newProjects);
    setOpenIndexes((prev) => new Set([...prev, newProjects.length - 1]));
  };

  const updateProject = (i: number, patch: Partial<ResumeProject>) => {
    const arr = [...projects];
    arr[i] = { ...arr[i], ...patch };
    onChange(arr);
  };

  const removeProject = (i: number) => {
    onChange(projects.filter((_, j) => j !== i));
    setOpenIndexes((prev) => {
      const next = new Set<number>();
      prev.forEach((idx) => {
        if (idx < i) next.add(idx);
        else if (idx > i) next.add(idx - 1);
      });
      return next;
    });
  };

  const toggleOpen = (i: number) => {
    setOpenIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3 mt-8">
        <h2 className="font-[var(--font-display)] text-lg font-semibold tracking-tight">Projects</h2>
        <Button type="button" variant="outline" size="sm" onClick={addProject} className="gap-1">
          <Plus className="h-3.5 w-3.5" /> Add Project
        </Button>
      </div>

      {projects.map((proj, i) => (
        <Collapsible
          key={i}
          open={openIndexes.has(i)}
          onOpenChange={() => toggleOpen(i)}
          className="border rounded-md mb-3 bg-card"
        >
          <div className="flex items-center justify-between px-4 py-3">
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 text-sm font-medium text-left flex-1 min-w-0"
              >
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                    openIndexes.has(i) ? 'rotate-0' : '-rotate-90'
                  }`}
                />
                <span className="truncate">
                  {proj.name || 'Untitled Project'}
                </span>
              </button>
            </CollapsibleTrigger>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeProject(i);
              }}
              className="text-muted-foreground hover:text-destructive ml-2 shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <CollapsibleContent className="px-4 pb-4">
            <div className="space-y-3">
              <div>
                <Label>Project Title</Label>
                <Input
                  value={proj.name}
                  onChange={(e) => updateProject(i, { name: e.target.value })}
                  maxLength={150}
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label>Description</Label>
                  <span className="text-xs text-muted-foreground">
                    {proj.description.length}/200
                  </span>
                </div>
                <Textarea
                  value={proj.description}
                  onChange={(e) => {
                    if (e.target.value.length <= 200) {
                      updateProject(i, { description: e.target.value });
                    }
                  }}
                  rows={2}
                  maxLength={200}
                />
              </div>

              <TechStackInput
                items={proj.techStack || []}
                onChange={(techStack) => updateProject(i, { techStack })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label>Live URL (optional)</Label>
                  <Input
                    value={proj.liveUrl || ''}
                    onChange={(e) => updateProject(i, { liveUrl: e.target.value })}
                    placeholder="https://…"
                    maxLength={500}
                  />
                </div>
                <div>
                  <Label>GitHub URL (optional)</Label>
                  <Input
                    value={proj.githubUrl || ''}
                    onChange={(e) => updateProject(i, { githubUrl: e.target.value })}
                    placeholder="https://github.com/…"
                    maxLength={500}
                  />
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
};

export default ProjectsSection;
