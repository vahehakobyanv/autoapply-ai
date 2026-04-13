'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Briefcase, Kanban, FileText, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/tracker', label: 'Tracker', icon: Kanban },
  { href: '/resume', label: 'Resume', icon: FileText },
  { href: '/gamification', label: 'Progress', icon: Trophy },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white dark:bg-slate-950 border-t safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors min-w-[56px]',
                active ? 'text-blue-600' : 'text-slate-400'
              )}
            >
              <Icon className={cn('h-5 w-5', active && 'scale-110')} />
              <span className="text-[10px] font-medium">{tab.label}</span>
              {active && <div className="h-0.5 w-4 bg-blue-600 rounded-full" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
