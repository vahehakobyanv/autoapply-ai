'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  LayoutDashboard, FileText, Briefcase, Kanban, Settings, CreditCard,
  GraduationCap, CalendarDays, ScanSearch, Globe, Bot, Building2,
  Target, Trophy, Users, Upload, Mic, Mail, Search,
} from 'lucide-react';

const pages = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, group: 'Navigation' },
  { name: 'Resume Builder', href: '/resume', icon: FileText, group: 'Navigation' },
  { name: 'CV Import', href: '/cv-import', icon: Upload, group: 'Navigation' },
  { name: 'Jobs', href: '/jobs', icon: Briefcase, group: 'Navigation' },
  { name: 'Job Agent', href: '/job-agent', icon: Bot, group: 'Navigation' },
  { name: 'Tracker', href: '/tracker', icon: Kanban, group: 'Navigation' },
  { name: 'ATS Score', href: '/ats-score', icon: ScanSearch, group: 'AI Tools' },
  { name: 'Why Rejected', href: '/rejection-analysis', icon: Target, group: 'AI Tools' },
  { name: 'Company Insights', href: '/company-insights', icon: Building2, group: 'AI Tools' },
  { name: 'Interview Prep', href: '/interview-prep', icon: GraduationCap, group: 'AI Tools' },
  { name: 'Interview Simulator', href: '/interview-simulator', icon: Mic, group: 'AI Tools' },
  { name: 'Follow-Up Emails', href: '/follow-up', icon: Mail, group: 'AI Tools' },
  { name: 'Portfolio', href: '/portfolio', icon: Globe, group: 'Tools' },
  { name: 'Progress & Achievements', href: '/gamification', icon: Trophy, group: 'Tools' },
  { name: 'Teams', href: '/teams', icon: Users, group: 'Tools' },
  { name: 'Calendar', href: '/calendar', icon: CalendarDays, group: 'Tools' },
  { name: 'Billing', href: '/payments', icon: CreditCard, group: 'Settings' },
  { name: 'Settings', href: '/settings', icon: Settings, group: 'Settings' },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const navigate = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  const groups = [...new Set(pages.map((p) => p.group))];

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages, tools, actions..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {groups.map((group, i) => (
          <div key={group}>
            {i > 0 && <CommandSeparator />}
            <CommandGroup heading={group}>
              {pages
                .filter((p) => p.group === group)
                .map((page) => {
                  const Icon = page.icon;
                  return (
                    <CommandItem
                      key={page.href}
                      onSelect={() => navigate(page.href)}
                      className="cursor-pointer"
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      <span>{page.name}</span>
                    </CommandItem>
                  );
                })}
            </CommandGroup>
          </div>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
