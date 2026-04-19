import Link from 'next/link';
import { Zap, Check, ArrowRight, Star, Shield, Users, Send, X } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Pricing — Land More Interviews, Faster', description: 'Free and Pro plans for AI-powered job applications. Start with 5 free applications, upgrade for unlimited AI resumes, auto-apply, mock interviews, and salary negotiation.' };

const PLANS = [
  {
    name: 'Free', price: '$0', period: 'forever', cta: 'Start Free', ctaSub: 'No credit card required', href: '/register', popular: false, color: 'border-slate-200',
    highlights: ['5 applications/month', '2 resume templates', 'Job import from URL', 'Application tracker', 'Chrome extension'],
  },
  {
    name: 'Pro', price: '$9.99', period: '/month', cta: 'Start Pro Trial', ctaSub: '7-day money-back guarantee', href: '/register', popular: true, color: 'border-blue-500',
    highlights: [
      'Unlimited applications',
      'All 18 resume templates',
      'Resume tailored to every job posting',
      'AI cover letters that reference the company',
      'Auto-apply bot (hh.ru & staff.am)',
      'Mock interviews with real-time scoring',
    ],
    more: [
      'Salary negotiation coach', 'ATS score analyzer', 'Company insights', 'LinkedIn optimizer',
      'Advanced analytics', 'Offer comparison', 'Contact CRM', 'Document vault', 'Priority support',
    ],
  },
  {
    name: 'Team', price: '$29.99', period: '/month', cta: 'Start Team Plan', ctaSub: 'Just $3/seat for 10 members', href: '/register', popular: false, color: 'border-slate-200',
    highlights: [
      'Everything in Pro',
      'Up to 10 team members',
      'Team dashboard & analytics',
      'Member progress tracking',
      'Role-based access control',
      'Recruiter & coach tools',
    ],
  },
];

const FAQ = [
  { q: 'Can I cancel anytime?', a: 'Yes, cancel from Settings anytime. You keep access until the end of your billing period. No hidden fees.' },
  { q: 'What payment methods do you accept?', a: 'All major credit cards via Stripe. Payments are encrypted and PCI-compliant. We never store your card details.' },
  { q: 'Is there a free trial for Pro?', a: 'The Free plan lets you try core features forever. Pro comes with a 7-day money-back guarantee — if you are not satisfied, we refund in full.' },
  { q: 'Can I switch between plans?', a: 'Yes, upgrade or downgrade anytime from Settings. Changes take effect at the next billing cycle.' },
  { q: 'Do you offer annual pricing?', a: 'Annual plans with 20% discount are coming soon. Sign up now and lock in the current price.' },
  { q: 'Is my data private and secure?', a: 'Yes. All data is stored on Supabase (PostgreSQL) with row-level security. Data is encrypted in transit and at rest. We never share your data with third parties.' },
  { q: 'What happens to my data if I cancel?', a: 'Your data remains accessible on the Free plan. You can export everything (CSV or JSON) anytime from Settings. If you delete your account, all data is permanently removed.' },
  { q: 'How does the Auto-Apply Bot work?', a: 'The bot uses Playwright to automate applications on hh.ru and staff.am with human-like typing delays (30-130ms per character). Each application gets a unique AI-generated cover letter. Companies cannot distinguish bot applications from manual ones.' },
  { q: 'What job boards do you support?', a: 'Currently hh.ru and staff.am for auto-apply. You can import jobs from any URL. The AI Job Agent searches across multiple sources.' },
  { q: 'How is this different from LinkedIn Easy Apply?', a: 'LinkedIn Easy Apply sends the same generic profile to every job. AutoApply AI generates a unique, tailored resume and cover letter for each application, significantly improving your response rate.' },
];

const COMPARISON = [
  { feature: 'Resume Templates', free: '2', pro: '18', team: '18' },
  { feature: 'Applications/month', free: '5', pro: 'Unlimited', team: 'Unlimited' },
  { feature: 'AI Resume Tailoring', free: false, pro: true, team: true },
  { feature: 'AI Cover Letters', free: false, pro: true, team: true },
  { feature: 'Auto-Apply Bot', free: false, pro: true, team: true },
  { feature: 'Mock Interview Simulator', free: false, pro: true, team: true },
  { feature: 'Salary Negotiation Coach', free: false, pro: true, team: true },
  { feature: 'ATS Score Analyzer', free: false, pro: true, team: true },
  { feature: 'Advanced Analytics', free: false, pro: true, team: true },
  { feature: 'LinkedIn Optimizer', free: false, pro: true, team: true },
  { feature: 'AI Chat Assistant', free: false, pro: true, team: true },
  { feature: 'Team Dashboard', free: false, pro: false, team: true },
  { feature: 'Member Tracking', free: false, pro: false, team: true },
  { feature: 'Role-based Access', free: false, pro: false, team: true },
  { feature: 'Chrome Extension', free: true, pro: true, team: true },
  { feature: 'Application Tracker', free: true, pro: true, team: true },
  { feature: 'Calendar + ICS Export', free: true, pro: true, team: true },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Nav */}
      <nav className="border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2"><Zap className="h-6 w-6 text-blue-600" /><span className="text-lg font-bold">AutoApply AI</span></Link>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Home</Link>
            <Link href="/blog" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Blog</Link>
            <Link href="/resources" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Resources</Link>
            <Link href="/success-stories" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Success Stories</Link>
            <Link href="/login" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Log In</Link>
          </div>
          <Link href="/register" className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700">Start Free</Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-16">
        {/* Header with value prop + social proof */}
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold mb-3">Land More Interviews, Faster</h1>
          <p className="text-lg text-muted-foreground mb-6">Pick the plan that fits your job search. Upgrade or downgrade anytime.</p>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Users className="h-4 w-4 text-blue-500" /> 50,000+ applications sent</span>
            <span className="flex items-center gap-1"><Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /> 4.8/5 average rating</span>
            <span className="flex items-center gap-1"><Shield className="h-4 w-4 text-green-500" /> Stripe-secured payments</span>
          </div>
        </div>

        {/* Introductory pricing badge */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1 bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 text-xs font-medium px-3 py-1 rounded-full">
            Introductory pricing — rates may increase soon
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 items-start">
          {PLANS.map(plan => (
            <div key={plan.name} className={`relative border-2 rounded-2xl p-6 ${plan.color} ${plan.popular ? 'shadow-xl shadow-blue-100 dark:shadow-blue-950 md:-mt-4 md:pb-8' : ''}`}>
              {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</div>}
              <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>
              {plan.name === 'Team' && <p className="text-xs text-green-600 font-medium mb-3">Just $3/seat for 10 members</p>}
              {plan.name !== 'Team' && <div className="mb-3" />}

              <Link href={plan.href} className={`block w-full text-center py-3 rounded-lg font-semibold mb-2 transition-colors ${plan.popular ? 'bg-blue-600 text-white hover:bg-blue-700' : plan.name === 'Free' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                {plan.cta}
              </Link>
              <p className="text-xs text-center text-muted-foreground mb-5">{plan.ctaSub}</p>

              <ul className="space-y-2.5">
                {plan.highlights.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />{f}</li>
                ))}
              </ul>

              {plan.more && (
                <details className="mt-3">
                  <summary className="text-xs text-blue-600 cursor-pointer hover:underline">+ {plan.more.length} more features</summary>
                  <ul className="space-y-2 mt-2">
                    {plan.more.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground"><Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />{f}</li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Compare Plans in Detail</h2>
          <div className="border rounded-2xl overflow-hidden">
            <div className="grid grid-cols-4 bg-slate-50 dark:bg-slate-900 font-semibold text-sm">
              <div className="p-4">Feature</div>
              <div className="p-4 text-center">Free</div>
              <div className="p-4 text-center text-blue-600">Pro</div>
              <div className="p-4 text-center">Team</div>
            </div>
            {COMPARISON.map((row, i) => (
              <div key={i} className="grid grid-cols-4 border-t text-sm">
                <div className="p-3 px-4">{row.feature}</div>
                {[row.free, row.pro, row.team].map((val, j) => (
                  <div key={j} className="p-3 text-center">
                    {val === true ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : val === false ? <X className="h-4 w-4 text-slate-300 mx-auto" /> : <span>{val}</span>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="mb-16 bg-blue-50 dark:bg-blue-950/30 rounded-2xl p-8 text-center">
          <div className="flex justify-center gap-1 mb-3">{[1,2,3,4,5].map(i => <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />)}</div>
          <p className="text-lg font-medium mb-2">&ldquo;I went from 2 interviews a month to 8 after switching to Pro. The resume tailoring and ATS checker alone are worth it.&rdquo;</p>
          <p className="text-sm text-muted-foreground">Anna K., Frontend Developer — Moscow</p>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQ.map((faq, i) => (
              <div key={i} className="border rounded-xl p-5">
                <h3 className="font-semibold mb-1">{faq.q}</h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-10 text-white mb-16">
          <h2 className="text-3xl font-bold mb-3">Ready to land your dream job?</h2>
          <p className="text-blue-100 mb-6">Start with 5 free applications. Upgrade anytime.</p>
          <Link href="/register" className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-3.5 rounded-xl text-lg font-bold hover:bg-yellow-300 transition-all">
            Start Free — No Credit Card <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-600" />
            <span>AutoApply AI &copy; 2026</span>
          </div>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
            <Link href="/blog" className="hover:text-foreground">Blog</Link>
            <Link href="/changelog" className="hover:text-foreground">Changelog</Link>
            <Link href="/success-stories" className="hover:text-foreground">Success Stories</Link>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-500" />
            <span>Secured by Stripe</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
