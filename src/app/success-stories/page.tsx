import Link from 'next/link';
import { Zap, Star, ArrowRight, TrendingUp, Users, Send } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Success Stories — Real Results', description: 'See how AutoApply AI users are landing interviews and offers faster.' };

const STORIES = [
  { name: 'Anna K.', role: 'Frontend Developer', location: 'Moscow', avatar: 'A', stat: '3x more interviews', quote: 'I went from 2 interviews a month to 6 after using the AI resume tailoring. The ATS score feature was a game changer.', apps: 45, interviews: 12, offers: 3, days: 30 },
  { name: 'Mikhail S.', role: 'Data Analyst', location: 'Saint Petersburg', avatar: 'M', stat: 'Landed dream job in 2 weeks', quote: 'The auto-apply bot saved me hours. I set it up, went to lunch, and came back to 15 applications submitted.', apps: 78, interviews: 8, offers: 2, days: 14 },
  { name: 'Armen G.', role: 'Product Manager', location: 'Yerevan', avatar: 'A', stat: '40% higher response rate', quote: 'Company Insights helped me tailor every cover letter. Recruiters actually mentioned how personalized my applications were.', apps: 32, interviews: 9, offers: 2, days: 21 },
  { name: 'Elena V.', role: 'UX Designer', location: 'Remote', avatar: 'E', stat: 'Saved 20+ hours/week', quote: 'Between CV import, AI cover letters, and bulk apply, I cut my job search time from 4 hours to 30 minutes a day.', apps: 120, interviews: 15, offers: 4, days: 45 },
  { name: 'David T.', role: 'Backend Engineer', location: 'Tbilisi', avatar: 'D', stat: 'Negotiated 30% higher salary', quote: 'The salary negotiation coach gave me confidence to counter-offer. I ended up getting 30% more than the initial offer.', apps: 25, interviews: 6, offers: 2, days: 28 },
  { name: 'Sofia R.', role: 'Marketing Manager', location: 'Moscow', avatar: 'S', stat: '5 offers in 1 month', quote: 'The mock interview simulator prepared me so well that every interviewer commented on how articulate my answers were.', apps: 60, interviews: 18, offers: 5, days: 30 },
];

const STATS = [
  { label: 'Applications Sent', value: '50,000+', icon: Send },
  { label: 'Interviews Landed', value: '8,000+', icon: TrendingUp },
  { label: 'Active Users', value: '2,500+', icon: Users },
];

export default function SuccessStoriesPage() {
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
          <h1 className="text-4xl font-bold mb-3">Real People. Real Results.</h1>
          <p className="text-lg text-muted-foreground">See how job seekers are using AutoApply AI to land their dream jobs faster.</p>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {STATS.map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center p-6 border rounded-2xl">
                <Icon className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Stories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {STORIES.map((story, i) => (
            <div key={i} className="border rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">{story.avatar}</div>
                <div>
                  <h3 className="font-semibold">{story.name}</h3>
                  <p className="text-sm text-muted-foreground">{story.role} — {story.location}</p>
                </div>
                <div className="ml-auto bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-bold px-2.5 py-1 rounded-full">{story.stat}</div>
              </div>
              <div className="flex items-start gap-2 mb-4">
                <Star className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-sm italic text-muted-foreground">&ldquo;{story.quote}&rdquo;</p>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><p className="text-lg font-bold">{story.apps}</p><p className="text-[10px] text-muted-foreground">Apps</p></div>
                <div><p className="text-lg font-bold text-blue-600">{story.interviews}</p><p className="text-[10px] text-muted-foreground">Interviews</p></div>
                <div><p className="text-lg font-bold text-green-600">{story.offers}</p><p className="text-[10px] text-muted-foreground">Offers</p></div>
                <div><p className="text-lg font-bold text-purple-600">{story.days}d</p><p className="text-[10px] text-muted-foreground">Timeline</p></div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center bg-blue-50 dark:bg-blue-950/30 rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-2">Ready to write your success story?</h2>
          <p className="text-muted-foreground mb-4">Join thousands of professionals landing jobs faster with AI.</p>
          <Link href="/register" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-medium">Start Free <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </main>
    </div>
  );
}
