import Link from 'next/link';
import { Zap, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — Job Search Tips & Career Advice',
  description: 'Expert tips on resumes, cover letters, job hunting on hh.ru and staff.am, interview prep, and career growth.',
};

const POSTS = [
  {
    slug: 'how-to-write-perfect-resume-2024',
    title: 'How to Write the Perfect Resume in 2024',
    excerpt: 'Learn the key elements that make your resume stand out to both ATS systems and hiring managers.',
    category: 'Resume',
    date: 'Apr 10, 2026',
    readTime: '5 min',
  },
  {
    slug: 'top-10-hh-ru-tips',
    title: 'Top 10 Tips for Finding Jobs on hh.ru',
    excerpt: 'Maximize your success on Russia\'s largest job platform with these proven strategies.',
    category: 'Job Search',
    date: 'Apr 8, 2026',
    readTime: '4 min',
  },
  {
    slug: 'ai-cover-letter-guide',
    title: 'How AI Cover Letters Get You More Interviews',
    excerpt: 'Why personalized AI-generated cover letters outperform generic templates every time.',
    category: 'Cover Letters',
    date: 'Apr 5, 2026',
    readTime: '3 min',
  },
  {
    slug: 'staff-am-guide-armenia',
    title: 'Complete Guide to Job Hunting on staff.am in Armenia',
    excerpt: 'Everything you need to know about Armenia\'s top job platform and how to stand out.',
    category: 'Job Search',
    date: 'Apr 2, 2026',
    readTime: '6 min',
  },
  {
    slug: 'interview-preparation-checklist',
    title: 'The Ultimate Interview Preparation Checklist',
    excerpt: 'A step-by-step guide to prepare for any job interview, from research to follow-up.',
    category: 'Interviews',
    date: 'Mar 28, 2026',
    readTime: '7 min',
  },
  {
    slug: 'salary-negotiation-cis',
    title: 'Salary Negotiation Tips for the CIS Market',
    excerpt: 'How to negotiate your salary effectively in Russia, Armenia, and other CIS countries.',
    category: 'Career',
    date: 'Mar 25, 2026',
    readTime: '5 min',
  },
  {
    slug: 'ai-resume-builder-guide-2026',
    title: 'AI Resume Builder: How to Create a Professional CV in 30 Seconds',
    excerpt: 'Step-by-step guide to using AI to generate ATS-optimized resumes that actually get interviews.',
    category: 'Resume',
    date: 'Apr 14, 2026',
    readTime: '6 min',
  },
  {
    slug: 'hh-ru-auto-apply-guide',
    title: 'How to Auto-Apply to 100+ Jobs on hh.ru (Without Getting Banned)',
    excerpt: 'Use automation smartly on hh.ru — human-like delays, personalized cover letters, and tracking.',
    category: 'Job Search',
    date: 'Apr 14, 2026',
    readTime: '7 min',
  },
  {
    slug: 'remote-jobs-russia-armenia-2026',
    title: 'Best Remote Job Opportunities in Russia and Armenia (2026)',
    excerpt: 'Top companies hiring remotely, salary ranges, and how to land a remote position from the CIS.',
    category: 'Job Search',
    date: 'Apr 13, 2026',
    readTime: '8 min',
  },
  {
    slug: 'ats-resume-optimization',
    title: 'ATS Resume Optimization: Beat the Bots and Get Seen by Recruiters',
    excerpt: '98% of Fortune 500 use ATS. Learn exactly how to format and keyword-optimize your resume.',
    category: 'Resume',
    date: 'Apr 13, 2026',
    readTime: '6 min',
  },
  {
    slug: 'career-change-guide-2026',
    title: 'How to Successfully Change Careers in 2026: A Complete Playbook',
    excerpt: 'From identifying transferable skills to landing your first role in a new field — with AI tools.',
    category: 'Career',
    date: 'Apr 12, 2026',
    readTime: '9 min',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <nav className="border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-bold">AutoApply AI</span>
          </Link>
          <Link href="/register" className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700">
            Start Free
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-3">Blog</h1>
          <p className="text-muted-foreground">Tips, guides, and insights for your job search</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {POSTS.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.slug}>
            <article className="border rounded-xl overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="h-40 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 flex items-center justify-center">
                <span className="text-4xl opacity-50">
                  {post.category === 'Resume' ? '📄' :
                   post.category === 'Job Search' ? '🔍' :
                   post.category === 'Cover Letters' ? '✉️' :
                   post.category === 'Interviews' ? '🎯' : '📈'}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                    {post.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{post.readTime}</span>
                </div>
                <h2 className="font-semibold mb-2 group-hover:text-blue-600 transition-colors">{post.title}</h2>
                <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{post.date}</span>
                  <span className="text-sm text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </article>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-blue-50 dark:bg-blue-950/30 rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-2">Ready to automate your job search?</h2>
          <p className="text-muted-foreground mb-4">Join thousands of professionals using AI to land their dream job.</p>
          <Link href="/register" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700">
            Start Free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
