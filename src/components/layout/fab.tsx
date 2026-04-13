'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, FileText, Briefcase, Upload, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

const actions = [
  { label: 'Import Job', icon: Briefcase, href: '/jobs', color: 'bg-blue-500 hover:bg-blue-600' },
  { label: 'Create Resume', icon: FileText, href: '/resume', color: 'bg-green-500 hover:bg-green-600' },
  { label: 'Import CV', icon: Upload, href: '/cv-import', color: 'bg-purple-500 hover:bg-purple-600' },
  { label: 'Job Agent', icon: Bot, href: '/job-agent', color: 'bg-orange-500 hover:bg-orange-600' },
];

export function FAB() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-3">
      {/* Main button */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300',
          open
            ? 'bg-slate-800 dark:bg-slate-200 rotate-45'
            : 'bg-blue-600 hover:bg-blue-700'
        )}
      >
        {open ? (
          <X className="h-6 w-6 text-white dark:text-slate-900" />
        ) : (
          <Plus className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Action buttons */}
      {open && (
        <div className="flex flex-col gap-2 mb-1">
          {actions.map((action, i) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => { router.push(action.href); setOpen(false); }}
                className={cn(
                  'flex items-center gap-3 pl-4 pr-5 py-2.5 rounded-full text-white shadow-lg transition-all',
                  action.color,
                  'animate-in slide-in-from-bottom-2 fade-in',
                )}
                style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'backwards' }}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium whitespace-nowrap">{action.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 -z-10" onClick={() => setOpen(false)} />
      )}
    </div>
  );
}
