import Link from 'next/link';
import {
  Zap,
  FileText,
  Bot,
  BarChart3,
  Globe,
  Check,
  Star,
  ArrowRight,
  Sparkles,
  Target,
} from 'lucide-react';
import { TypingAnimation } from '@/components/ui/typing-animation';
import { AnimatedCounter } from '@/components/ui/animated-counter';

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
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
              Log In
            </Link>
            <Link
              href="/register"
              className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-blue-50/50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-sm px-4 py-1.5 rounded-full mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Sparkles className="h-4 w-4" />
            Powered by AI &mdash; Optimized for hh.ru &amp; staff.am
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            AI that{' '}
            <span className="text-blue-600">
              <TypingAnimation
                texts={['writes your resume', 'applies to jobs', 'preps your interview', 'negotiates salary', 'tracks applications']}
                speed={70}
                deleteSpeed={35}
                pauseTime={1500}
              />
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            AutoApply AI finds jobs, generates tailored resumes and cover letters, and submits
            applications automatically. Stop wasting hours — let AI handle the busywork.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Start Free <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 border border-slate-200 text-slate-700 px-8 py-3.5 rounded-lg text-lg font-medium hover:bg-slate-50 transition-colors"
            >
              See How It Works
            </a>
          </div>
          <p className="text-sm text-slate-400 mt-4">
            Free plan includes 5 applications/month. No credit card required.
          </p>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-1000 delay-500">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900 dark:text-white"><AnimatedCounter value={50847} duration={2000} /></p>
              <p className="text-xs text-slate-500">Applications Sent</p>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">1,200+</p>
              <p className="text-xs text-slate-500">Users</p>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">340</p>
              <p className="text-xs text-slate-500">Interviews Landed</p>
            </div>
          </div>
        </div>

        {/* Hero Demo */}
        <div className="max-w-5xl mx-auto mt-16 relative">
          <div className="bg-gradient-to-b from-slate-100 to-slate-50 rounded-2xl p-6 shadow-2xl shadow-slate-200/50 border">
            <div className="bg-white rounded-xl p-4 space-y-4">
              <div className="flex items-center gap-3 border-b pb-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="bg-slate-100 rounded-md px-3 py-1 text-xs text-slate-500 flex-1 max-w-md">
                  autoapply.ai/dashboard
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">247</div>
                  <div className="text-xs text-slate-500">Applications</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">34%</div>
                  <div className="text-xs text-slate-500">Response Rate</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">18</div>
                  <div className="text-xs text-slate-500">Interviews</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">3</div>
                  <div className="text-xs text-slate-500">Offers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need to Land Your Dream Job</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              From resume building to auto-applying, AutoApply AI handles the entire job search process.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                title: 'AI Resume Builder',
                description: 'Generate professional resumes in English and Russian. Multiple templates, instant PDF export.',
              },
              {
                icon: Bot,
                title: 'Auto-Apply Bot',
                description: 'Automatically fills and submits applications on hh.ru and staff.am with human-like behavior.',
              },
              {
                icon: Sparkles,
                title: 'AI Cover Letters',
                description: 'Personalized cover letters generated from your profile and the job description.',
              },
              {
                icon: Target,
                title: 'Job Import & Search',
                description: 'Import jobs by URL or search directly from hh.ru. AI extracts all job details instantly.',
              },
              {
                icon: BarChart3,
                title: 'Application Tracker',
                description: 'Kanban board to track every application. Drag and drop between stages.',
              },
              {
                icon: Globe,
                title: 'Multi-Language',
                description: 'Full support for English and Russian. Optimized for Russia and Armenia job markets.',
              },
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
                <feature.icon className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-slate-600">Three simple steps to automate your job search</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Create Your Profile',
                description: 'Fill in your skills, experience, and preferences. AI generates your resume instantly.',
              },
              {
                step: '2',
                title: 'Find Jobs',
                description: 'Search or import jobs from hh.ru and staff.am. AI parses every detail automatically.',
              },
              {
                step: '3',
                title: 'Auto Apply',
                description: 'Click apply and our bot handles the rest — cover letter, form filling, and submission.',
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 text-blue-600 text-xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What People Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Artem K.',
                role: 'Frontend Developer, Moscow',
                text: 'Applied to 50 jobs in one evening. Got 8 interviews within a week. This tool is insane.',
                rating: 5,
              },
              {
                name: 'Maria S.',
                role: 'Product Manager, Yerevan',
                text: 'The AI cover letters are surprisingly good. Every letter feels personalized to the job.',
                rating: 5,
              },
              {
                name: 'Dmitry V.',
                role: 'Backend Developer, Saint Petersburg',
                text: 'I was spending 3 hours daily applying to jobs. Now it takes 10 minutes. Game changer.',
                rating: 5,
              },
            ].map((testimonial, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-700 mb-4 text-sm italic">&ldquo;{testimonial.text}&rdquo;</p>
                <div>
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-xs text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-slate-600">Start free, upgrade when you need more power.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="rounded-2xl border p-8">
              <h3 className="font-semibold text-lg mb-1">Free</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-slate-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['5 applications/month', 'Basic job tracking', 'Manual job import'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" /> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block text-center border border-slate-200 text-slate-700 px-6 py-2.5 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Get Started
              </Link>
            </div>

            <div className="rounded-2xl border-2 border-blue-600 p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                Most Popular
              </div>
              <h3 className="font-semibold text-lg mb-1">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$9.99</span>
                <span className="text-slate-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'Unlimited applications',
                  'AI resume generator',
                  'AI cover letters',
                  'Auto-apply bot',
                  'All resume templates',
                  'Priority support',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" /> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block text-center bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Automate Your Job Search?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join thousands of professionals who save hours every week with AutoApply AI.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3.5 rounded-lg text-lg font-medium hover:bg-blue-50 transition-colors"
          >
            Start Free <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            <span className="font-semibold">AutoApply AI</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#pricing" className="hover:text-slate-900">Pricing</a>
            <Link href="/blog" className="hover:text-slate-900">Blog</Link>
            <Link href="/changelog" className="hover:text-slate-900">Changelog</Link>
            <Link href="/terms" className="hover:text-slate-900">Terms</Link>
            <Link href="/privacy" className="hover:text-slate-900">Privacy</Link>
          </div>
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} AutoApply AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
