import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResumeData, emptyResume } from '@/types/resume';
import { resumeToPlainText } from '@/lib/resumeToText';
import { validateResume, ValidationWarning } from '@/lib/resumeValidation';
import ResumePreviewContent from '@/components/ResumePreviewContent';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer, Copy, AlertTriangle, Check } from 'lucide-react';

const RESUME_STORAGE_KEY = 'ai-resume-data';

const PreviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<ResumeData>(emptyResume);
  const [warnings, setWarnings] = useState<ValidationWarning[]>([]);
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RESUME_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setData(parsed);
        setWarnings(validateResume(parsed));
      }
    } catch {}
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = async () => {
    const text = resumeToPlainText(data);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="no-print sticky top-0 z-10 border-b bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Editor
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleCopy} className="gap-2">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy Resume as Text'}
            </Button>
            <Button onClick={handlePrint} className="gap-2">
              <Printer className="h-4 w-4" /> Print / Save as PDF
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        {/* Validation warnings */}
        {warnings.length > 0 && (
          <div className="no-print mb-6 rounded-md border border-[hsl(var(--warning)/0.4)] bg-[hsl(var(--warning)/0.08)] px-4 py-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 text-[hsl(var(--warning))]" />
              <div>
                <p className="text-sm font-medium">Your resume may look incomplete.</p>
                <ul className="mt-1 text-sm text-muted-foreground">
                  {warnings.map((w, i) => (
                    <li key={i}>• {w.message}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Resume */}
        <div className="bg-card border rounded-lg shadow-sm p-8 sm:p-12">
          <ResumePreviewContent data={data} />
        </div>
      </main>
    </div>
  );
};

export default PreviewPage;
