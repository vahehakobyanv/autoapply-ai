'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

const LABELS: Record<string, string> = {
  dashboard: 'Dashboard', jobs: 'Jobs', resume: 'Resume', tracker: 'Tracker',
  'ats-score': 'ATS Score', 'interview-prep': 'Interview Prep', calendar: 'Calendar',
  payments: 'Billing', settings: 'Settings', onboarding: 'Onboarding',
  'cv-import': 'CV Import', portfolio: 'Portfolio', 'job-agent': 'Job Agent',
  'company-insights': 'Companies', 'rejection-analysis': 'Why Rejected',
  gamification: 'Progress', teams: 'Teams', 'interview-simulator': 'Mock Interview',
  'follow-up': 'Follow-Up Emails', 'resume-tailor': 'Tailor Resume',
  contacts: 'Contacts CRM', documents: 'Documents', offers: 'Compare Offers',
  'market-insights': 'Market Insights', 'linkedin-optimizer': 'LinkedIn',
  analytics: 'Analytics', 'skill-gaps': 'Skill Gaps',
  'salary-negotiation': 'Salary Negotiation', leaderboard: 'Leaderboard',
  recommendations: 'For You',
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length <= 1) return null;

  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
      <Link href="/dashboard" className="hover:text-foreground transition-colors">
        <Home className="h-3.5 w-3.5" />
      </Link>
      {segments.map((segment, i) => {
        const href = '/' + segments.slice(0, i + 1).join('/');
        const label = LABELS[segment] || segment;
        const isLast = i === segments.length - 1;

        return (
          <span key={segment} className="flex items-center gap-1">
            <ChevronRight className="h-3 w-3" />
            {isLast ? (
              <span className="font-medium text-foreground">{label}</span>
            ) : (
              <Link href={href} className="hover:text-foreground transition-colors">{label}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
