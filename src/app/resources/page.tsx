import Link from 'next/link';
import { Zap, Download, FileText, CheckSquare, DollarSign, ArrowRight, BookOpen, Target } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Free Resources — Templates, Checklists & Guides', description: 'Download free resume templates, interview checklists, and salary negotiation guides.' };

const RESOURCES = [
  { title: 'ATS-Friendly Resume Template', description: 'Clean, professional resume template optimized for applicant tracking systems. Works for any industry.', icon: FileText, category: 'Template', cta: 'Use Template', href: '/resume' },
  { title: 'Interview Preparation Checklist', description: 'Step-by-step checklist covering research, STAR stories, questions to ask, and follow-up actions.', icon: CheckSquare, category: 'Checklist', cta: 'Read Guide', href: '/blog/interview-preparation-checklist' },
  { title: 'Salary Negotiation Script', description: 'Word-for-word script for counter-offers via email and phone. Customizable for your situation.', icon: DollarSign, category: 'Guide', cta: 'Use Tool', href: '/salary-negotiation' },
  { title: 'hh.ru Success Guide', description: '10 proven tips for maximizing your success on Russia\'s largest job platform.', icon: BookOpen, category: 'Guide', cta: 'Read Guide', href: '/blog/top-10-hh-ru-tips' },
  { title: 'AI Cover Letter Framework', description: 'How to write cover letters that get 40% more responses using AI personalization.', icon: FileText, category: 'Guide', cta: 'Read Guide', href: '/blog/ai-cover-letter-guide' },
  { title: 'Job Search Tracker Template', description: 'Kanban-style application tracker with status columns, notes, and follow-up dates.', icon: Target, category: 'Tool', cta: 'Use Tracker', href: '/tracker' },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <nav className="border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2"><Zap className="h-6 w-6 text-blue-600" /><span className="text-lg font-bold">AutoApply AI</span></Link>
          <Link href="/register" className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700">Start Free</Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-3">Free Resources</h1>
          <p className="text-lg text-muted-foreground">Templates, checklists, and guides to supercharge your job search</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {RESOURCES.map((res, i) => {
            const Icon = res.icon;
            return (
              <div key={i} className="border rounded-2xl p-6 hover:shadow-lg transition-shadow group">
                <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">{res.category}</span>
                <h3 className="font-semibold mt-2 mb-2">{res.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{res.description}</p>
                <Link href={res.href} className="text-sm text-blue-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  {res.cta} <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            );
          })}
        </div>

        <div className="text-center bg-blue-50 dark:bg-blue-950/30 rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-2">Want AI to do the work for you?</h2>
          <p className="text-muted-foreground mb-4">AutoApply AI generates resumes, cover letters, and applies to jobs automatically.</p>
          <Link href="/register" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-medium">Start Free <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </main>
    </div>
  );
}
