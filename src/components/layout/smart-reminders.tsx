'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, Flame, UserCircle, AlertTriangle, Clock, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Reminder {
  type: string; title: string; message: string; action_url: string; priority: string;
}

const typeIcons: Record<string, React.ReactNode> = {
  follow_up: <Clock className="h-4 w-4 text-blue-500" />,
  streak: <Flame className="h-4 w-4 text-orange-500" />,
  inactive: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
  contact: <UserCircle className="h-4 w-4 text-purple-500" />,
  profile: <Bell className="h-4 w-4 text-slate-400" />,
};

const priorityBorder: Record<string, string> = {
  high: 'border-l-red-500', medium: 'border-l-yellow-500', low: 'border-l-slate-300',
};

export function SmartReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch('/api/reminders').then(r => r.json()).then(d => { if (Array.isArray(d)) setReminders(d); }).catch(() => {});
  }, []);

  const visible = reminders.filter(r => !dismissed.has(r.title));
  if (visible.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
        <Bell className="h-3.5 w-3.5" /> Smart Reminders
      </h3>
      {visible.slice(0, 4).map((r, i) => (
        <Link key={i} href={r.action_url}>
          <div className={cn(
            'flex items-center gap-3 p-3 rounded-lg border-l-4 bg-white dark:bg-slate-900 border dark:border-slate-800 hover:shadow-sm transition-all cursor-pointer group',
            priorityBorder[r.priority]
          )}>
            {typeIcons[r.type] || <Bell className="h-4 w-4" />}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{r.title}</p>
              <p className="text-xs text-muted-foreground truncate">{r.message}</p>
            </div>
            <div className="flex items-center gap-1">
              <ChevronRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              <button onClick={(e) => { e.preventDefault(); setDismissed(prev => new Set(prev).add(r.title)); }} className="text-slate-300 hover:text-slate-500 p-0.5">
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
