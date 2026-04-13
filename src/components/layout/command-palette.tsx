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
  Target, Trophy, Users, Upload, Mic, Mail, Search, Wand2, UserCircle,
  FolderOpen, Scale, TrendingUp, Linkedin, Download,
} from 'lucide-react';

const pages = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, group: 'Navigation' },
  { name: 'Jobs', href: '/jobs', icon: Briefcase, group: 'Navigation' },
  { name: 'Job Agent', href: '/job-agent', icon: Bot, group: 'Navigation' },
  { name: 'Tracker', href: '/tracker', icon: Kanban, group: 'Navigation' },
  { name: 'Calendar', href: '/calendar', icon: CalendarDays, group: 'Navigation' },
  { name: 'Resume Builder', href: '/resume', icon: FileText, group: 'Resume & Profile' },
  { name: 'Tailor Resume', href: '/resume-tailor', icon: Wand2, group: 'Resume & Profile' },
  { name: 'CV Import', href: '/cv-import', icon: Upload, group: 'Resume & Profile' },
  { name: 'Portfolio', href: '/portfolio', icon: Globe, group: 'Resume & Profile' },
  { name: 'LinkedIn Optimizer', href: '/linkedin-optimizer', icon: Linkedin, group: 'Resume & Profile' },
  { name: 'ATS Score', href: '/ats-score', icon: ScanSearch, group: 'AI Tools' },
  { name: 'Why Rejected', href: '/rejection-analysis', icon: Target, group: 'AI Tools' },
  { name: 'Company Insights', href: '/company-insights', icon: Building2, group: 'AI Tools' },
  { name: 'Market Insights', href: '/market-insights', icon: TrendingUp, group: 'AI Tools' },
  { name: 'Interview Prep', href: '/interview-prep', icon: GraduationCap, group: 'AI Tools' },
  { name: 'Mock Interview', href: '/interview-simulator', icon: Mic, group: 'AI Tools' },
  { name: 'Follow-Up Emails', href: '/follow-up', icon: Mail, group: 'AI Tools' },
  { name: 'Compare Offers', href: '/offers', icon: Scale, group: 'Tools' },
  { name: 'Contacts CRM', href: '/contacts', icon: UserCircle, group: 'Tools' },
  { name: 'Documents', href: '/documents', icon: FolderOpen, group: 'Tools' },
  { name: 'Progress', href: '/gamification', icon: Trophy, group: 'Tools' },
  { name: 'Teams', href: '/teams', icon: Users, group: 'Tools' },
  { name: 'Export Data', href: '/api/export', icon: Download, group: 'Tools' },
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
