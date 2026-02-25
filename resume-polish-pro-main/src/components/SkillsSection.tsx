import React, { useState, KeyboardEvent } from 'react';
import { CategorizedSkills, SkillCategory, SKILL_CATEGORY_LABELS } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Sparkles, Loader2 } from 'lucide-react';

interface Props {
  skills: CategorizedSkills;
  onChange: (skills: CategorizedSkills) => void;
}

const SUGGESTED_SKILLS: Record<SkillCategory, string[]> = {
  technical: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'GraphQL'],
  soft: ['Team Leadership', 'Problem Solving'],
  tools: ['Git', 'Docker', 'AWS'],
};

const SkillCategoryInput: React.FC<{
  category: SkillCategory;
  items: string[];
  onAdd: (skill: string) => void;
  onRemove: (index: number) => void;
}> = ({ category, items, onAdd, onRemove }) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = input.trim();
      if (trimmed && !items.includes(trimmed)) {
        onAdd(trimmed);
        setInput('');
      }
    }
  };

  const handleAdd = () => {
    const trimmed = input.trim();
    if (trimmed && !items.includes(trimmed)) {
      onAdd(trimmed);
      setInput('');
    }
  };

  return (
    <div className="mb-4">
      <p className="text-sm font-medium mb-1.5">
        {SKILL_CATEGORY_LABELS[category]}{' '}
        <span className="text-muted-foreground font-normal">({items.length})</span>
      </p>
      <div className="flex items-center gap-2 mb-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type and press Enter"
          maxLength={60}
          className="flex-1"
        />
        <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
          Add
        </Button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {items.map((skill, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground"
            >
              {skill}
              <button
                type="button"
                onClick={() => onRemove(i)}
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

const SkillsSection: React.FC<Props> = ({ skills, onChange }) => {
  const [suggesting, setSuggesting] = useState(false);

  const addSkill = (category: SkillCategory, skill: string) => {
    onChange({ ...skills, [category]: [...skills[category], skill] });
  };

  const removeSkill = (category: SkillCategory, index: number) => {
    onChange({
      ...skills,
      [category]: skills[category].filter((_, i) => i !== index),
    });
  };

  const handleSuggest = () => {
    setSuggesting(true);
    setTimeout(() => {
      const next = { ...skills };
      (Object.keys(SUGGESTED_SKILLS) as SkillCategory[]).forEach((cat) => {
        const existing = new Set(next[cat]);
        SUGGESTED_SKILLS[cat].forEach((s) => {
          if (!existing.has(s)) {
            next[cat] = [...next[cat], s];
          }
        });
      });
      onChange(next);
      setSuggesting(false);
    }, 1000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3 mt-8">
        <h2 className="font-[var(--font-display)] text-lg font-semibold tracking-tight">Skills</h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSuggest}
          disabled={suggesting}
          className="gap-1.5"
        >
          {suggesting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Sparkles className="h-3.5 w-3.5" />
          )}
          {suggesting ? 'Suggesting…' : 'Suggest Skills'}
        </Button>
      </div>

      {(Object.keys(SKILL_CATEGORY_LABELS) as SkillCategory[]).map((cat) => (
        <SkillCategoryInput
          key={cat}
          category={cat}
          items={skills[cat]}
          onAdd={(s) => addSkill(cat, s)}
          onRemove={(i) => removeSkill(cat, i)}
        />
      ))}
    </div>
  );
};

export default SkillsSection;
