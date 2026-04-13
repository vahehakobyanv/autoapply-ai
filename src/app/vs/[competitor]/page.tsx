import Link from 'next/link';
import { Zap, Check, X, ArrowRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

const COMPETITORS: Record<string, { name: string; description: string; features: Record<string, [boolean, boolean]> }> = {
  teal: {
    name: 'Teal', description: 'Teal is a job tracking and resume tool.',
    features: {
      'AI Resume Builder': [true, true], 'Resume Tailoring per Job': [true, false], 'AI Cover Letters': [true, false],
      'Auto-Apply Bot': [true, false], 'Mock Interview Simulator': [true, false], 'ATS Score Analyzer': [true, true],
      'Salary Negotiation Coach': [true, false], 'Company Insights': [true, false], 'Kanban Tracker': [true, true],
      'Chrome Extension': [true, true], 'Gamification': [true, false], 'Team Mode': [true, false],
      'Contact CRM': [true, false], 'Portfolio Generator': [true, false], 'Free Plan': [true, true],
    },
  },
  huntr: {
    name: 'Huntr', description: 'Huntr is a job search organizer.',
    features: {
      'AI Resume Builder': [true, false], 'Resume Tailoring per Job': [true, false], 'AI Cover Letters': [true, false],
      'Auto-Apply Bot': [true, false], 'Mock Interview Simulator': [true, false], 'ATS Score Analyzer': [true, false],
      'Salary Negotiation Coach': [true, false], 'Company Insights': [true, false], 'Kanban Tracker': [true, true],
      'Chrome Extension': [true, true], 'Gamification': [true, false], 'Team Mode': [true, false],
      'Document Vault': [true, true], 'Advanced Analytics': [true, false], 'Free Plan': [true, true],
    },
  },
  lazyapply: {
    name: 'LazyApply', description: 'LazyApply is an auto-apply tool.',
    features: {
      'AI Resume Builder': [true, false], 'Resume Tailoring per Job': [true, false], 'AI Cover Letters': [true, true],
      'Auto-Apply Bot': [true, true], 'Mock Interview Simulator': [true, false], 'ATS Score Analyzer': [true, false],
      'Salary Negotiation Coach': [true, false], 'Company Insights': [true, false], 'Kanban Tracker': [true, false],
      'Chrome Extension': [true, true], 'Gamification': [true, false], 'LinkedIn Optimizer': [true, false],
      'Skill Gap Analysis': [true, false], 'Market Insights': [true, false], 'Free Plan': [true, false],
    },
  },
  jobscan: {
    name: 'Jobscan', description: 'Jobscan is an ATS optimization tool.',
    features: {
      'AI Resume Builder': [true, true], 'Resume Tailoring per Job': [true, true], 'AI Cover Letters': [true, true],
      'Auto-Apply Bot': [true, false], 'Mock Interview Simulator': [true, false], 'ATS Score Analyzer': [true, true],
      'Salary Negotiation Coach': [true, false], 'Company Insights': [true, false], 'Kanban Tracker': [true, false],
      'Gamification': [true, false], 'LinkedIn Optimizer': [true, true], 'Portfolio Generator': [true, false],
      'Contact CRM': [true, false], 'Team Mode': [true, false], 'Free Plan': [true, true],
    },
  },
};

interface Props { params: Promise<{ competitor: string }>; }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { competitor } = await params;
  const comp = COMPETITORS[competitor];
  return { title: comp ? `AutoApply AI vs ${comp.name} — Feature Comparison` : 'Comparison', description: comp ? `See how AutoApply AI compares to ${comp.name}` : '' };
}

export default async function ComparisonPage({ params }: Props) {
  const { competitor } = await params;
  const comp = COMPETITORS[competitor];
  if (!comp) notFound();

  const ourWins = Object.values(comp.features).filter(([us, them]) => us && !them).length;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <nav className="border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2"><Zap className="h-6 w-6 text-blue-600" /><span className="text-lg font-bold">AutoApply AI</span></Link>
          <Link href="/register" className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700">Start Free</Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-3">AutoApply AI vs {comp.name}</h1>
          <p className="text-muted-foreground">{comp.description} See how we compare feature by feature.</p>
          <p className="mt-2 text-sm text-blue-600 font-medium">AutoApply AI wins in {ourWins} out of {Object.keys(comp.features).length} features</p>
        </div>

        <div className="border rounded-2xl overflow-hidden mb-12">
          <div className="grid grid-cols-3 bg-slate-50 dark:bg-slate-800 font-semibold text-sm">
            <div className="p-4">Feature</div>
            <div className="p-4 text-center text-blue-600">AutoApply AI</div>
            <div className="p-4 text-center">{comp.name}</div>
          </div>
          {Object.entries(comp.features).map(([feature, [us, them]], i) => (
            <div key={i} className="grid grid-cols-3 border-t text-sm">
              <div className="p-4">{feature}</div>
              <div className="p-4 text-center">{us ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-slate-300 mx-auto" />}</div>
              <div className="p-4 text-center">{them ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-slate-300 mx-auto" />}</div>
            </div>
          ))}
        </div>

        {/* Other comparisons */}
        <div className="mb-12">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Other Comparisons</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(COMPETITORS).filter(([k]) => k !== competitor).map(([slug, c]) => (
              <Link key={slug} href={`/vs/${slug}`} className="px-4 py-2 border rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800">vs {c.name}</Link>
            ))}
          </div>
        </div>

        <div className="text-center bg-blue-50 dark:bg-blue-950/30 rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-2">Ready to switch to AutoApply AI?</h2>
          <p className="text-muted-foreground mb-4">Get all the features you need in one platform. Start free.</p>
          <Link href="/register" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-medium">Start Free <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </main>
    </div>
  );
}
