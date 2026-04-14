import Link from 'next/link';
import { Zap, ArrowRight, Check, Star, Users, Send, TrendingUp, Sparkles, Bot, FileText, Target, Mic, DollarSign, Globe } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AutoApply AI — Apply to 100 Jobs in 1 Click with AI',
  description: 'The world\'s most complete AI job application platform. 18 resume templates, AI cover letters, auto-apply bot, mock interviews, salary negotiation, and 45+ tools. Free to start.',
  openGraph: {
    title: 'AutoApply AI — Apply to 100 Jobs in 1 Click',
    description: '45 tools. 18 resume templates. 1 platform. AI that writes resumes, applies to jobs, preps interviews, and negotiates salary.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
};

const FEATURES = [
  { icon: FileText, title: '18 Resume Templates', desc: 'From Modern to Tokyo to Dubai — pick your style, AI fills the content' },
  { icon: Bot, title: 'Auto-Apply Bot', desc: 'AI applies to 100+ jobs on hh.ru and staff.am with unique cover letters' },
  { icon: Target, title: 'ATS Score Checker', desc: 'Know your match rate before applying — never get filtered out again' },
  { icon: Mic, title: 'Mock Interview AI', desc: 'Practice with AI interviewer, get scored on answers and communication' },
  { icon: DollarSign, title: 'Salary Negotiation', desc: 'AI generates counter-offer strategy with market data and email scripts' },
  { icon: Globe, title: 'Portfolio Generator', desc: 'AI builds your personal website — published with a shareable link' },
];

const STATS = [
  { value: '45+', label: 'AI Tools' },
  { value: '18', label: 'Resume Templates' },
  { value: '63', label: 'API Endpoints' },
  { value: '50K+', label: 'Applications Sent' },
];

export default function LaunchPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoLTZ2LTZoNnptMC0zMHY2aC02VjRoNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        <div className="relative max-w-5xl mx-auto px-4 py-20 text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-1.5 rounded-full text-sm mb-6">
            <Sparkles className="h-4 w-4" /> Now Live on Product Hunt
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Stop Applying Manually.<br />
            <span className="text-yellow-300">Let AI Do It.</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto mb-8">
            AutoApply AI writes your resume, generates cover letters, auto-applies to jobs, preps your interviews, and negotiates your salary. All in one platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/register" className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-xl text-lg font-bold hover:bg-yellow-300 hover:text-blue-800 transition-all shadow-xl">
              Start Free — No Credit Card <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {STATS.map(s => (
              <div key={s.label} className="bg-white/10 backdrop-blur rounded-xl p-4">
                <p className="text-3xl font-black">{s.value}</p>
                <p className="text-sm text-blue-200">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Everything You Need to Land Your Dream Job</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="border rounded-2xl p-6 hover:shadow-lg transition-shadow group">
                <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center gap-1 mb-4">{[1,2,3,4,5].map(i => <Star key={i} className="h-6 w-6 text-yellow-500 fill-yellow-500" />)}</div>
          <p className="text-xl font-medium mb-2">&ldquo;I applied to 50 jobs in one afternoon. Got 6 interviews in the first week.&rdquo;</p>
          <p className="text-sm text-muted-foreground">Anna K., Frontend Developer — Moscow</p>
        </div>
      </section>

      {/* Full Feature List */}
      <section className="py-20 px-4 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">45+ Features. Zero Compromise.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'AI Resume Builder (18 templates)', 'AI Resume Tailoring per job', 'Generate resume from job URL',
            'AI Cover Letter Generator', 'Auto-Apply Bot (hh.ru, staff.am)', 'AI Job Search Agent (24/7)',
            'Kanban Application Tracker', 'ATS Score Analyzer', 'AI Mock Interview Simulator',
            'Voice Interview Practice', 'Salary Negotiation Coach', 'Company Insights Research',
            'Job Market Insights', 'Skill Gap Dashboard', 'Career Path Planner',
            'Skill Assessment Quizzes', 'Reference Letter Generator', 'Follow-Up Email Generator',
            'Email Templates Library (10)', 'Contact CRM', 'Document Vault',
            'Offer Comparison (AI scored)', 'Relocation Cost Calculator', 'Salary History Tracker',
            'Work Portfolio Showcase', 'Portfolio Generator + Public Pages', 'LinkedIn Profile Optimizer',
            'Video Resume Script Generator', 'Networking Event Finder', 'CV Import (PDF/DOCX)',
            'Chrome Extension v2', 'CMD+K Command Palette', 'Advanced Analytics Dashboard',
            'Gamification (XP, Streaks, Achievements)', 'Team Mode (B2B)', 'Calendar + ICS Export',
            'CSV Import/Export', 'Weekly Email Digest', 'AI Chat Assistant',
            'Smart Reminders', 'Dark Mode', 'Multi-Language (EN/RU/HY)',
            'Keyboard Shortcuts', 'PWA Offline Support', 'Referral Program',
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-2 py-1.5">
              <Check className="h-4 w-4 text-green-500 shrink-0" />
              <span className="text-sm">{f}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-purple-600 text-white text-center">
        <h2 className="text-4xl font-black mb-4">Ready to Transform Your Job Search?</h2>
        <p className="text-xl text-blue-100 mb-8">Free plan includes 5 applications/month. No credit card required.</p>
        <Link href="/register" className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-xl text-lg font-bold hover:bg-yellow-300 transition-all shadow-xl">
          Start Free Now <ArrowRight className="h-5 w-5" />
        </Link>
      </section>

      <footer className="py-8 text-center text-sm text-muted-foreground border-t">
        <div className="flex justify-center gap-4 mb-2">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <Link href="/pricing" className="hover:text-foreground">Pricing</Link>
          <Link href="/blog" className="hover:text-foreground">Blog</Link>
          <Link href="/success-stories" className="hover:text-foreground">Success Stories</Link>
          <Link href="/changelog" className="hover:text-foreground">Changelog</Link>
        </div>
        <p>AutoApply AI &copy; 2026</p>
      </footer>
    </div>
  );
}
