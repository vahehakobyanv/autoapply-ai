import Link from 'next/link';
import { Zap, Check, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Pricing — Plans for Every Job Seeker', description: 'Free and Pro plans. Start with 5 free applications per month, upgrade for unlimited AI-powered job applications.' };

const PLANS = [
  {
    name: 'Free', price: '$0', period: 'forever', cta: 'Start Free', href: '/register', popular: false,
    features: ['5 applications/month', 'AI Resume Builder (2 templates)', 'Job Import from URL', 'Application Tracker', 'Basic Dashboard', 'Chrome Extension'],
  },
  {
    name: 'Pro', price: '$9.99', period: '/month', cta: 'Start Pro Trial', href: '/register', popular: true,
    features: ['Unlimited applications', 'All 5 resume templates', 'AI Resume Tailoring per job', 'AI Cover Letters', 'Auto-Apply Bot', 'Mock Interview Simulator', 'Salary Negotiation Coach', 'Company Insights', 'ATS Score Analyzer', 'Advanced Analytics', 'LinkedIn Optimizer', 'Offer Comparison', 'Contact CRM', 'Document Vault', 'Priority Support'],
  },
  {
    name: 'Team', price: '$29.99', period: '/month', cta: 'Contact Us', href: '/register', popular: false,
    features: ['Everything in Pro', 'Up to 10 team members', 'Team Dashboard & Analytics', 'Member Progress Tracking', 'Bulk Invite via Email', 'Role-based Access (Owner/Admin/Member)', 'Recruiter & Coach Tools', 'Custom Branding (coming soon)'],
  },
];

const FAQ = [
  { q: 'Can I cancel anytime?', a: 'Yes, cancel your subscription anytime from Settings. You keep access until the end of your billing period.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit cards via Stripe. All payments are secure and encrypted.' },
  { q: 'Is there a free trial for Pro?', a: 'The Free plan lets you try core features. Upgrade to Pro anytime for the full experience.' },
  { q: 'Can I switch between plans?', a: 'Yes, upgrade or downgrade anytime. Changes take effect at the next billing cycle.' },
  { q: 'Do you offer annual pricing?', a: 'Annual plans are coming soon with a 20% discount. Join the waitlist in Settings.' },
];

export default function PricingPage() {
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
          <h1 className="text-4xl font-bold mb-3">Simple, Transparent Pricing</h1>
          <p className="text-lg text-muted-foreground">Start free. Upgrade when you need more power.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {PLANS.map(plan => (
            <div key={plan.name} className={`relative border rounded-2xl p-6 ${plan.popular ? 'border-blue-500 shadow-lg shadow-blue-100 dark:shadow-blue-950' : ''}`}>
              {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</div>}
              <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>
              <Link href={plan.href} className={`block w-full text-center py-2.5 rounded-lg font-semibold mb-6 transition-colors ${plan.popular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200'}`}>
                {plan.cta}
              </Link>
              <ul className="space-y-2.5">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />{f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
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
      </main>
    </div>
  );
}
