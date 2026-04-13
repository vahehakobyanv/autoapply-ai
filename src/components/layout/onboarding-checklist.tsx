'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, Circle, X, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChecklistItem {
  id: string;
  label: string;
  href: string;
  check: () => Promise<boolean>;
}

export function OnboardingChecklist() {
  const [items, setItems] = useState<{ id: string; label: string; href: string; done: boolean }[]>([]);
  const [visible, setVisible] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkProgress();
  }, []);

  const checkProgress = async () => {
    try {
      const [profileRes, resumeRes, appsRes] = await Promise.all([
        fetch('/api/profile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'get' }) }),
        fetch('/api/resumes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'list' }) }),
        fetch('/api/applications'),
      ]);

      const profile = await profileRes.json();
      const resumes = await resumeRes.json();
      const apps = await appsRes.json();

      const hasProfile = !!(profile?.name && profile?.role && profile?.skills?.length > 0);
      const hasResume = Array.isArray(resumes) && resumes.length > 0;
      const hasApp = Array.isArray(apps) && apps.length > 0;
      const hasApplied = Array.isArray(apps) && apps.some((a: { status: string }) => a.status === 'applied');

      const checklist = [
        { id: 'profile', label: 'Complete your profile', href: '/settings', done: hasProfile },
        { id: 'resume', label: 'Create your first resume', href: '/resume', done: hasResume },
        { id: 'job', label: 'Import or search for a job', href: '/jobs', done: hasApp },
        { id: 'apply', label: 'Apply to your first job', href: '/jobs', done: hasApplied },
      ];

      setItems(checklist);

      // Hide if all done
      const allDone = checklist.every((c) => c.done);
      if (allDone) {
        const dismissed = localStorage.getItem('checklist-dismissed');
        if (dismissed) setVisible(false);
      }
    } catch {
      setVisible(false);
    } finally {
      setLoading(false);
    }
  };

  const dismiss = () => {
    localStorage.setItem('checklist-dismissed', 'true');
    setVisible(false);
  };

  if (!visible || loading || items.length === 0) return null;

  const completed = items.filter((i) => i.done).length;
  const allDone = completed === items.length;
  const progress = (completed / items.length) * 100;

  return (
    <div className="bg-white dark:bg-slate-900 border rounded-xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 cursor-pointer" onClick={() => setCollapsed(!collapsed)}>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-bold text-blue-600">
            {completed}/{items.length}
          </div>
          <div>
            <p className="text-sm font-semibold">{allDone ? 'All set!' : 'Getting Started'}</p>
            <div className="w-32 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-1">
              <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {allDone && (
            <button onClick={(e) => { e.stopPropagation(); dismiss(); }} className="text-slate-400 hover:text-slate-600 p-1">
              <X className="h-4 w-4" />
            </button>
          )}
          {collapsed ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronUp className="h-4 w-4 text-slate-400" />}
        </div>
      </div>

      {!collapsed && (
        <div className="px-4 pb-3 space-y-2">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                item.done
                  ? 'text-slate-400 dark:text-slate-500'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950'
              )}
            >
              {item.done ? (
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
              ) : (
                <Circle className="h-4 w-4 text-slate-300 shrink-0" />
              )}
              <span className={item.done ? 'line-through' : ''}>{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
