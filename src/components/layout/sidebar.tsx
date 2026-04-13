'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, FileText, Briefcase, Kanban, Settings, CreditCard,
  LogOut, Zap, Menu, X, GraduationCap, CalendarDays, ScanSearch,
  Globe, Bot, Building2, Target, Trophy, Users, Upload, Mic, Mail,
  Search, ChevronDown, Wand2, UserCircle, FolderOpen, Scale,
  TrendingUp, Link2, Download, DollarSign, BarChart3, Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { LanguageSwitcher } from '@/components/layout/language-switcher';
import { NotificationCenter } from '@/components/layout/notification-center';
import { useState } from 'react';

const navSections = [
  {
    label: 'Main',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/analytics', label: 'Analytics', icon: TrendingUp },
      { href: '/jobs', label: 'Jobs', icon: Briefcase },
      { href: '/job-agent', label: 'Job Agent', icon: Bot },
      { href: '/tracker', label: 'Tracker', icon: Kanban },
      { href: '/calendar', label: 'Calendar', icon: CalendarDays },
    ],
  },
  {
    label: 'Resume & Profile',
    items: [
      { href: '/resume', label: 'Resume', icon: FileText },
      { href: '/resume-tailor', label: 'Tailor Resume', icon: Wand2 },
      { href: '/cv-import', label: 'CV Import', icon: Upload },
      { href: '/portfolio', label: 'Portfolio', icon: Globe },
      { href: '/linkedin-optimizer', label: 'LinkedIn', icon: Link2 },
    ],
  },
  {
    label: 'AI Tools',
    items: [
      { href: '/ats-score', label: 'ATS Score', icon: ScanSearch },
      { href: '/rejection-analysis', label: 'Why Rejected', icon: Target },
      { href: '/company-insights', label: 'Companies', icon: Building2 },
      { href: '/market-insights', label: 'Market Insights', icon: TrendingUp },
      { href: '/interview-prep', label: 'Interview Prep', icon: GraduationCap },
      { href: '/interview-simulator', label: 'Mock Interview', icon: Mic },
      { href: '/follow-up', label: 'Follow-Up Emails', icon: Mail },
      { href: '/salary-negotiation', label: 'Negotiate Salary', icon: DollarSign },
      { href: '/skill-gaps', label: 'Skill Gaps', icon: Target },
    ],
  },
  {
    label: 'More',
    items: [
      { href: '/offers', label: 'Compare Offers', icon: Scale },
      { href: '/contacts', label: 'Contacts CRM', icon: UserCircle },
      { href: '/documents', label: 'Documents', icon: FolderOpen },
      { href: '/recommendations', label: 'For You', icon: Sparkles },
      { href: '/gamification', label: 'Progress', icon: Trophy },
      { href: '/leaderboard', label: 'Leaderboard', icon: BarChart3 },
      { href: '/teams', label: 'Teams', icon: Users },
      { href: '/payments', label: 'Billing', icon: CreditCard },
      { href: '/settings', label: 'Settings', icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<string[]>([]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const toggleSection = (label: string) => {
    setCollapsedSections((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  };

  const NavContent = () => (
    <>
      <div className="flex items-center justify-between px-4 py-5">
        <div className="flex items-center gap-2">
          <Zap className="h-7 w-7 text-blue-600" />
          <span className="text-xl font-bold">AutoApply AI</span>
        </div>
        <div className="flex items-center gap-1">
          <NotificationCenter />
          <ThemeToggle />
        </div>
      </div>

      {/* CMD+K search hint */}
      <div className="px-3 mb-2">
        <button
          onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-muted-foreground bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <Search className="h-3 w-3" />
          <span>Search...</span>
          <kbd className="ml-auto text-[10px] bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border">
            ⌘K
          </kbd>
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-3 overflow-y-auto">
        {navSections.map((section) => {
          const isCollapsed = collapsedSections.includes(section.label);
          return (
            <div key={section.label}>
              <button
                onClick={() => toggleSection(section.label)}
                className="flex items-center justify-between w-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {section.label}
                <ChevronDown className={cn('h-3 w-3 transition-transform', isCollapsed && '-rotate-90')} />
              </button>
              {!isCollapsed && (
                <div className="mt-1 space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                          active
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="px-3 pb-4 space-y-2">
        <div className="px-3">
          <LanguageSwitcher />
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 w-full transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </button>
      </div>
    </>
  );

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-950 border-r flex flex-col transform transition-transform md:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <NavContent />
      </aside>

      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white dark:bg-slate-950 border-r">
        <NavContent />
      </aside>
    </>
  );
}
