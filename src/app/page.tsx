import Link from 'next/link';
import { ExitIntent } from '@/components/layout/exit-intent';
import {
  Zap, FileText, Bot, BarChart3, Globe, Check, Star, ArrowRight, Sparkles,
  Target, Shield, Users, Send, Mic, DollarSign, Brain, Mail, Scale,
} from 'lucide-react';
import { TypingAnimation } from '@/components/ui/typing-animation';
import { AnimatedCounter } from '@/components/ui/animated-counter';

const FEATURES = [
  { icon: FileText, title: '18 Resume Templates', desc: 'From Modern to Dubai to Seoul. AI fills content, you pick the design. PDF export in 1 click.' },
  { icon: Bot, title: 'Auto-Apply Bot', desc: 'Submits 100+ applications on hh.ru and staff.am with human-like typing and unique cover letters.' },
  { icon: Target, title: 'ATS Score Checker', desc: 'Know your match rate before applying. AI analyzes keywords, formatting, and sections.' },
  { icon: Mic, title: 'Mock Interview AI', desc: 'Practice with an AI interviewer. Get scored 1-10 on answers, communication, and confidence.' },
  { icon: DollarSign, title: 'Salary Negotiation', desc: 'AI generates counter-offer strategy with market data, talking points, and email scripts.' },
  { icon: Brain, title: 'Career Path Planner', desc: 'AI maps your progression with milestones, skills to learn, and salary targets at each stage.' },
  { icon: Scale, title: 'Offer Comparison', desc: 'Compare multiple offers side-by-side. AI scores each on compensation, benefits, and growth.' },
  { icon: Mail, title: 'Follow-Up Emails', desc: '10 professional templates + AI generator for every situation: interviews, rejections, networking.' },
  { icon: Globe, title: 'Portfolio Generator', desc: 'AI builds your personal website with 4 themes. Published with a shareable public link.' },
];

const TESTIMONIALS = [
  { name: 'Artem K.', role: 'Frontend Developer', location: 'Moscow', text: 'Applied to 50 jobs in one evening. Got 8 interviews within a week. The resume tailoring feature alone is worth it.', rating: 5, stat: '8 interviews/week' },
  { name: 'Maria S.', role: 'Product Manager', location: 'Yerevan', text: 'The AI cover letters are surprisingly good. Every letter feels personalized to the job. My response rate tripled.', rating: 5, stat: '3x response rate' },
  { name: 'Dmitry V.', role: 'Backend Developer', location: 'Saint Petersburg', text: 'I was spending 3 hours daily applying to jobs. Now it takes 10 minutes. The auto-apply bot is a game changer.', rating: 5, stat: '10 min/day' },
  { name: 'Elena R.', role: 'UX Designer', location: 'Remote', text: 'The mock interview simulator prepared me so well. Every interviewer commented on how structured my answers were.', rating: 5, stat: '5 offers in 1 month' },
];

const STEPS = [
  { step: '1', title: 'Create Your Profile', desc: 'Fill in skills and experience, or upload your existing CV. AI parses everything in seconds.' },
  { step: '2', title: 'Find & Import Jobs', desc: 'Paste any job URL or let the AI Agent search 24/7. Import from hh.ru, staff.am, or any site.' },
  { step: '3', title: 'Apply with AI', desc: 'AI generates a tailored resume + cover letter for each job and submits automatically.' },
];

const ALL_FEATURES = [
  'AI Resume Builder (18 templates)', 'Resume Tailoring per job', 'Generate resume from job URL',
  'AI Cover Letters', 'Auto-Apply Bot', 'AI Job Search Agent', 'ATS Score Analyzer',
  'Mock Interview Simulator', 'Voice Interview Practice', 'Salary Negotiation Coach',
  'Company Insights', 'Market Insights', 'Skill Gap Dashboard', 'Career Path Planner',
  'Skill Assessment Quizzes', 'Reference Letter Generator', 'Follow-Up Emails (5 types)',
  'Email Templates Library (10)', 'Contact CRM', 'Document Vault', 'Offer Comparison',
  'Relocation Calculator', 'Salary History Tracker', 'Work Portfolio', 'Portfolio Generator',
  'LinkedIn Optimizer', 'Video Resume Script', 'Networking Event Finder', 'CV Import (PDF/DOCX)',
  'Chrome Extension v2', 'CMD+K Command Palette', 'Advanced Analytics', 'Gamification (XP, Achievements)',
  'Team Mode (B2B)', 'Calendar + ICS Export', 'CSV Import/Export', 'AI Chat Assistant',
  'Smart Reminders', 'Dark Mode', 'Multi-Language (EN/RU/HY)', 'Keyboard Shortcuts',
  'PWA Offline Support', 'Referral Program', 'Global Search', 'Breadcrumbs Navigation',
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Navbar */}
      <nav className="border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm fixed top-0 w-full z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-7 w-7 text-blue-600" />
            <span className="text-xl font-bold">AutoApply AI</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Features</a>
            <a href="#how-it-works" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">How It Works</a>
            <Link href="/pricing" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Pricing</Link>
            <Link href="/success-stories" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Success Stories</Link>
            <Link href="/blog" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Blog</Link>
            <Link href="/resources" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Resources</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Log In</Link>
            <Link href="/register" className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Start Free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-blue-50/50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-sm px-4 py-1.5 rounded-full mb-6">
            <Sparkles className="h-4 w-4" />
            45+ AI tools &mdash; 18 resume templates &mdash; Free to start
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
            AI that{' '}
            <span className="text-blue-600">
              <TypingAnimation
                texts={['writes your resume', 'applies to 100 jobs', 'preps your interview', 'negotiates salary', 'tracks everything']}
                speed={70}
                deleteSpeed={35}
                pauseTime={1500}
              />
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
            Stop spending hours on applications. AutoApply AI generates tailored resumes, writes cover letters, auto-applies to jobs, and preps you for interviews — all from one platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register" className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-xl text-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
              Start Free — No Credit Card <ArrowRight className="h-5 w-5" />
            </Link>
            <a href="#how-it-works" className="inline-flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-8 py-3.5 rounded-xl text-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              See How It Works
            </a>
          </div>
          <p className="text-sm text-slate-400 mt-4">Free plan: 5 applications/month. No credit card required.</p>

          {/* Social Proof Bar */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-10 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900 dark:text-white"><AnimatedCounter value={50847} duration={2000} /></p>
              <p className="text-xs text-slate-500">Applications Sent</p>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900 dark:text-white"><AnimatedCounter value={8200} duration={1800} /></p>
              <p className="text-xs text-slate-500">Interviews Landed</p>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900 dark:text-white"><AnimatedCounter value={2500} duration={1500} /></p>
              <p className="text-xs text-slate-500">Active Users</p>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
            <div className="text-center flex items-center gap-1">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span className="text-2xl font-bold text-slate-900 dark:text-white">4.8</span>
              <span className="text-xs text-slate-500">/5 rating</span>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="max-w-5xl mx-auto mt-16 relative">
          <div className="bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50 border dark:border-slate-700">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 space-y-4">
              <div className="flex items-center gap-3 border-b dark:border-slate-800 pb-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-md px-3 py-1 text-xs text-slate-500 flex-1 max-w-md">autoapply-ai-vert.vercel.app/dashboard</div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-blue-50 dark:bg-blue-950/50 rounded-lg p-4 text-center"><div className="text-2xl font-bold text-blue-600">247</div><div className="text-xs text-slate-500">Applications</div></div>
                <div className="bg-green-50 dark:bg-green-950/50 rounded-lg p-4 text-center"><div className="text-2xl font-bold text-green-600">34%</div><div className="text-xs text-slate-500">Response Rate</div></div>
                <div className="bg-purple-50 dark:bg-purple-950/50 rounded-lg p-4 text-center"><div className="text-2xl font-bold text-purple-600">18</div><div className="text-xs text-slate-500">Interviews</div></div>
                <div className="bg-yellow-50 dark:bg-yellow-950/50 rounded-lg p-4 text-center"><div className="text-2xl font-bold text-yellow-600">3</div><div className="text-xs text-slate-500">Offers</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By / Logos */}
      <section className="py-10 px-4 border-b dark:border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-4">Optimized for top job platforms</p>
          <div className="flex items-center justify-center gap-10 text-slate-400">
            <span className="text-lg font-bold">hh.ru</span>
            <span className="text-lg font-bold">staff.am</span>
            <span className="text-lg font-bold">LinkedIn</span>
            <span className="text-lg font-bold">Indeed</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 dark:text-white">Everything You Need to Land Your Dream Job</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">45+ AI-powered tools. From resume building to salary negotiation, AutoApply AI handles the entire job search.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border dark:border-slate-700 hover:shadow-lg transition-shadow group">
                <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center mb-4 group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors">
                  <f.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2 dark:text-white">{f.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 dark:text-white">How It Works</h2>
            <p className="text-slate-600 dark:text-slate-400">Three steps. Five minutes. Your entire job search on autopilot.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((item, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xl font-bold mb-4 shadow-lg shadow-blue-500/20">{item.step}</div>
                <h3 className="font-semibold text-lg mb-2 dark:text-white">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 dark:text-white">Real People. Real Results.</h2>
            <p className="text-slate-600 dark:text-slate-400">See how job seekers are landing interviews faster with AutoApply AI.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border dark:border-slate-700">
                <div className="flex gap-1 mb-3">{Array.from({ length: t.rating }).map((_, j) => <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}</div>
                <p className="text-slate-700 dark:text-slate-300 mb-4 text-sm italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm dark:text-white">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}, {t.location}</p>
                  </div>
                  <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-950 px-2 py-0.5 rounded-full">{t.stat}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full Feature List */}
      <section className="py-20 px-4 dark:bg-slate-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 dark:text-white">45+ Features. Zero Compromise.</h2>
            <p className="text-slate-600 dark:text-slate-400">More tools than Teal, Huntr, Simplify, and LazyApply combined.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {ALL_FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5 px-2">
                <Check className="h-4 w-4 text-green-500 shrink-0" />
                <span className="text-sm dark:text-slate-300">{f}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/vs/teal" className="text-sm text-blue-600 hover:underline">See how we compare to competitors →</Link>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 dark:text-white">Simple, Transparent Pricing</h2>
            <p className="text-slate-600 dark:text-slate-400">Start free forever. Upgrade when you need more power.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="rounded-2xl border dark:border-slate-700 p-6 bg-white dark:bg-slate-800">
              <h3 className="font-bold text-lg mb-1 dark:text-white">Free</h3>
              <div className="mb-4"><span className="text-3xl font-bold dark:text-white">$0</span><span className="text-slate-500 text-sm">/forever</span></div>
              <ul className="space-y-2 mb-6 text-sm">{['5 applications/month', '2 resume templates', 'Application tracker', 'Chrome extension'].map(f => <li key={f} className="flex gap-2 dark:text-slate-300"><Check className="h-4 w-4 text-green-500 shrink-0" />{f}</li>)}</ul>
              <Link href="/register" className="block text-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-2.5 rounded-lg font-semibold hover:bg-slate-800 dark:hover:bg-slate-100">Start Free</Link>
              <p className="text-xs text-center text-slate-400 mt-2">No credit card required</p>
            </div>
            <div className="rounded-2xl border-2 border-blue-500 p-6 bg-white dark:bg-slate-800 relative shadow-lg shadow-blue-100 dark:shadow-blue-950 md:-mt-4 md:pb-8">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</div>
              <h3 className="font-bold text-lg mb-1 dark:text-white">Pro</h3>
              <div className="mb-4"><span className="text-3xl font-bold dark:text-white">$9.99</span><span className="text-slate-500 text-sm">/month</span></div>
              <ul className="space-y-2 mb-6 text-sm">{['Unlimited applications', 'All 18 templates + tailoring', 'Auto-apply bot', 'All AI tools (45+)', 'Advanced analytics', 'Priority support'].map(f => <li key={f} className="flex gap-2 dark:text-slate-300"><Check className="h-4 w-4 text-green-500 shrink-0" />{f}</li>)}</ul>
              <Link href="/register" className="block text-center bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700">Start Pro Trial</Link>
              <p className="text-xs text-center text-slate-400 mt-2">7-day money-back guarantee</p>
            </div>
            <div className="rounded-2xl border dark:border-slate-700 p-6 bg-white dark:bg-slate-800">
              <h3 className="font-bold text-lg mb-1 dark:text-white">Team</h3>
              <div className="mb-4"><span className="text-3xl font-bold dark:text-white">$29.99</span><span className="text-slate-500 text-sm">/month</span></div>
              <ul className="space-y-2 mb-6 text-sm">{['Everything in Pro', 'Up to 10 members', 'Team dashboard', 'Role-based access', 'Recruiter tools'].map(f => <li key={f} className="flex gap-2 dark:text-slate-300"><Check className="h-4 w-4 text-green-500 shrink-0" />{f}</li>)}</ul>
              <Link href="/register" className="block text-center bg-slate-100 dark:bg-slate-700 py-2.5 rounded-lg font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 dark:text-white">Start Team Plan</Link>
              <p className="text-xs text-center text-slate-400 mt-2">$3/seat for 10 members</p>
            </div>
          </div>
          <div className="text-center mt-6">
            <Link href="/pricing" className="text-sm text-blue-600 hover:underline">See full pricing comparison →</Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Automate Your Job Search?</h2>
          <p className="text-blue-100 mb-8 text-lg">Join thousands of professionals who save 20+ hours every week with AutoApply AI.</p>
          <Link href="/register" className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-xl text-lg font-bold hover:bg-yellow-300 transition-all shadow-xl">
            Start Free — No Credit Card <ArrowRight className="h-5 w-5" />
          </Link>
          <div className="flex items-center justify-center gap-4 mt-6 text-sm text-blue-200">
            <span className="flex items-center gap-1"><Shield className="h-4 w-4" /> Stripe secured</span>
            <span className="flex items-center gap-1"><Users className="h-4 w-4" /> 2,500+ users</span>
            <span className="flex items-center gap-1"><Star className="h-4 w-4" /> 4.8/5 rating</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t dark:border-slate-800 dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4"><Zap className="h-5 w-5 text-blue-600" /><span className="font-bold dark:text-white">AutoApply AI</span></div>
              <p className="text-sm text-slate-500">The world&apos;s most complete AI-powered job application platform.</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3 dark:text-white">Product</h4>
              <div className="space-y-2 text-sm text-slate-500">
                <Link href="/pricing" className="block hover:text-slate-900 dark:hover:text-white">Pricing</Link>
                <Link href="/success-stories" className="block hover:text-slate-900 dark:hover:text-white">Success Stories</Link>
                <Link href="/changelog" className="block hover:text-slate-900 dark:hover:text-white">Changelog</Link>
                <Link href="/resources" className="block hover:text-slate-900 dark:hover:text-white">Resources</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3 dark:text-white">Compare</h4>
              <div className="space-y-2 text-sm text-slate-500">
                <Link href="/vs/teal" className="block hover:text-slate-900 dark:hover:text-white">vs Teal</Link>
                <Link href="/vs/huntr" className="block hover:text-slate-900 dark:hover:text-white">vs Huntr</Link>
                <Link href="/vs/lazyapply" className="block hover:text-slate-900 dark:hover:text-white">vs LazyApply</Link>
                <Link href="/vs/jobscan" className="block hover:text-slate-900 dark:hover:text-white">vs Jobscan</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3 dark:text-white">Legal</h4>
              <div className="space-y-2 text-sm text-slate-500">
                <Link href="/privacy" className="block hover:text-slate-900 dark:hover:text-white">Privacy Policy</Link>
                <Link href="/terms" className="block hover:text-slate-900 dark:hover:text-white">Terms of Service</Link>
                <Link href="/blog" className="block hover:text-slate-900 dark:hover:text-white">Blog</Link>
              </div>
            </div>
          </div>
          <div className="border-t dark:border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
            <p>&copy; 2026 AutoApply AI. All rights reserved.</p>
            <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-green-500" /><span>Payments secured by Stripe</span></div>
          </div>
        </div>
      </footer>
      <ExitIntent />
    </div>
  );
}
