'use client';

import { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TOUR_STEPS = [
  { title: 'Welcome to AutoApply AI!', description: 'Your AI-powered job application platform. Let us show you around.', target: 'dashboard', emoji: '👋' },
  { title: 'Import or Search Jobs', description: 'Paste a job URL or search across hh.ru and staff.am. AI extracts all details automatically.', target: 'jobs', emoji: '🔍' },
  { title: 'AI Resume Builder', description: '5 professional templates with AI-generated content. Export as PDF in one click.', target: 'resume', emoji: '📄' },
  { title: 'Tailor per Job', description: 'AI rewrites your resume keywords to match each specific job description.', target: 'resume-tailor', emoji: '🎯' },
  { title: 'Track Applications', description: 'Drag-and-drop Kanban board: Saved → Applied → Interview → Offer → Rejected.', target: 'tracker', emoji: '📋' },
  { title: 'AI Tools', description: 'ATS Score, Mock Interviews, Company Research, Salary Negotiation — all AI-powered.', target: 'ats-score', emoji: '🤖' },
  { title: 'Analytics & Progress', description: 'Advanced analytics, skill gaps, gamification with XP and achievements.', target: 'analytics', emoji: '📊' },
  { title: 'You\'re all set!', description: 'Start by importing your CV or creating a resume. Then search for jobs and apply!', target: 'cv-import', emoji: '🚀' },
];

export function ProductTour() {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem('tour-completed');
    if (!seen) {
      const timer = setTimeout(() => setActive(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const close = () => {
    setActive(false);
    localStorage.setItem('tour-completed', 'true');
  };

  const next = () => {
    if (step < TOUR_STEPS.length - 1) setStep(step + 1);
    else close();
  };

  const prev = () => { if (step > 0) setStep(step - 1); };

  if (!active) return null;

  const current = TOUR_STEPS[step];

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm" onClick={close} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[420px] max-w-[90vw] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-slate-100 dark:bg-slate-800">
          <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${((step + 1) / TOUR_STEPS.length) * 100}%` }} />
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <span className="text-4xl">{current.emoji}</span>
            <button onClick={close} className="text-slate-400 hover:text-slate-600 p-1">
              <X className="h-5 w-5" />
            </button>
          </div>

          <h2 className="text-xl font-bold mb-2">{current.title}</h2>
          <p className="text-sm text-muted-foreground mb-6">{current.description}</p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{step + 1} of {TOUR_STEPS.length}</span>
            <div className="flex gap-2">
              {step > 0 && (
                <Button variant="outline" size="sm" onClick={prev}>
                  <ChevronLeft className="h-4 w-4 mr-1" /> Back
                </Button>
              )}
              <Button size="sm" onClick={next}>
                {step === TOUR_STEPS.length - 1 ? (
                  <><Sparkles className="h-4 w-4 mr-1" /> Get Started</>
                ) : (
                  <>Next <ChevronRight className="h-4 w-4 ml-1" /></>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
