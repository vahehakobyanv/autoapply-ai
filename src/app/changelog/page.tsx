import Link from 'next/link';
import { Zap } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Changelog — What\'s New',
  description: 'See the latest features and improvements to AutoApply AI.',
};

const ENTRIES = [
  {
    date: 'Apr 13, 2026',
    version: 'v1.5',
    title: 'ATS Score, Blog, Calendar & More',
    changes: [
      { type: 'new', text: 'ATS Resume Score — check how your resume performs in tracking systems' },
      { type: 'new', text: 'Application Calendar — month view of all your applications' },
      { type: 'new', text: 'Company Insights — AI-powered research on any company' },
      { type: 'new', text: 'Blog — job search tips and career advice' },
      { type: 'new', text: 'Changelog page — track what\'s new' },
      { type: 'improved', text: 'Social proof counter on landing page' },
    ],
  },
  {
    date: 'Apr 12, 2026',
    version: 'v1.4',
    title: 'LinkedIn Import, Bulk Apply & Interview Prep',
    changes: [
      { type: 'new', text: 'LinkedIn PDF Import — upload your profile, auto-fill everything' },
      { type: 'new', text: 'Bulk Apply — select multiple jobs, apply to all at once' },
      { type: 'new', text: 'Interview Prep AI — personalized questions, answers, and tips' },
      { type: 'new', text: 'Job Match Score — AI rates how well you match a job' },
      { type: 'new', text: 'Salary Estimator — AI-powered salary range estimates' },
      { type: 'new', text: 'Public Resume Pages — shareable /r/[id] links' },
      { type: 'new', text: 'Admin Dashboard — business metrics and user analytics' },
      { type: 'new', text: '3 new resume templates: Executive, Creative, Minimal' },
    ],
  },
  {
    date: 'Apr 12, 2026',
    version: 'v1.3',
    title: 'Telegram, Google OAuth & Polish',
    changes: [
      { type: 'new', text: 'Telegram bot notifications (@autoapply_ai_bot)' },
      { type: 'new', text: 'Google OAuth login' },
      { type: 'new', text: 'Google Analytics integration' },
      { type: 'new', text: 'Dark mode toggle' },
      { type: 'new', text: 'Terms of Service & Privacy Policy' },
      { type: 'new', text: 'PWA manifest — installable as app' },
      { type: 'improved', text: 'Custom 404 page and error boundaries' },
    ],
  },
  {
    date: 'Apr 12, 2026',
    version: 'v1.0',
    title: 'Initial Launch',
    changes: [
      { type: 'new', text: 'AI Resume Builder with 2 templates' },
      { type: 'new', text: 'Job import from hh.ru and staff.am' },
      { type: 'new', text: 'AI Cover Letter generator' },
      { type: 'new', text: 'Auto-Apply bot with Playwright' },
      { type: 'new', text: 'Kanban application tracker' },
      { type: 'new', text: 'Dashboard with analytics' },
      { type: 'new', text: 'Stripe payment integration' },
      { type: 'new', text: 'Multi-language support (EN/RU)' },
      { type: 'new', text: 'Referral system' },
      { type: 'new', text: 'Landing page' },
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <nav className="border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-bold">AutoApply AI</span>
          </Link>
          <Link href="/register" className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700">
            Start Free
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Changelog</h1>
        <p className="text-muted-foreground mb-12">New features, improvements, and fixes.</p>

        <div className="space-y-12">
          {ENTRIES.map((entry, i) => (
            <div key={i} className="relative pl-8 border-l-2 border-blue-100 dark:border-blue-900">
              <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-blue-600" />
              <div className="mb-2 flex items-center gap-3">
                <span className="text-sm font-mono text-blue-600 font-medium">{entry.version}</span>
                <span className="text-sm text-muted-foreground">{entry.date}</span>
              </div>
              <h2 className="text-lg font-semibold mb-3">{entry.title}</h2>
              <ul className="space-y-2">
                {entry.changes.map((change, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded mt-0.5 ${
                      change.type === 'new' ? 'bg-green-100 text-green-700' :
                      change.type === 'improved' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {change.type}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">{change.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
