import Link from 'next/link';
import { Zap, ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

const POSTS: Record<string, { title: string; category: string; date: string; readTime: string; content: string[] }> = {
  'how-to-write-perfect-resume-2024': {
    title: 'How to Write the Perfect Resume in 2024', category: 'Resume', date: 'Apr 10, 2026', readTime: '5 min',
    content: [
      'Your resume is your first impression. In today\'s competitive job market, a well-crafted resume can be the difference between landing an interview and being overlooked.',
      '## 1. Start with a Strong Summary\nYour professional summary should be 2-3 sentences that highlight your key achievements and what you bring to the table. Avoid generic statements — be specific about your impact.',
      '## 2. Quantify Your Achievements\nInstead of "Managed a team," write "Led a team of 8 engineers, delivering 3 major projects 15% ahead of schedule." Numbers make your accomplishments concrete.',
      '## 3. Tailor for Each Application\nCustomize your resume keywords to match each job description. ATS systems scan for specific terms — use tools like AutoApply AI\'s ATS Score to check your match rate.',
      '## 4. Keep it Clean and Scannable\nUse clear section headers, bullet points, and consistent formatting. Recruiters spend an average of 7.4 seconds on initial resume screening.',
      '## 5. Include the Right Keywords\nStudy the job posting carefully. Mirror the language used in requirements. If they say "cross-functional collaboration," use that exact phrase in your experience.',
      '## Pro Tip\nUse AutoApply AI\'s Resume Tailoring feature to automatically optimize your resume for each job application. It adds missing keywords and rephrases your experience to match.',
    ],
  },
  'top-10-hh-ru-tips': {
    title: 'Top 10 Tips for Finding Jobs on hh.ru', category: 'Job Search', date: 'Apr 8, 2026', readTime: '4 min',
    content: [
      'hh.ru is Russia\'s largest job platform with millions of listings. Here\'s how to maximize your success.',
      '## 1. Complete Your Profile 100%\nFully completed profiles get 3x more views from recruiters. Include a photo, detailed experience, and all skills.',
      '## 2. Use Advanced Search Filters\nFilter by salary range, experience level, and remote options. Save your searches for quick access.',
      '## 3. Apply Early\nJobs posted in the last 24 hours get the most attention. Set up alerts to be first to apply.',
      '## 4. Write Custom Cover Letters\nGeneric cover letters get ignored. Use AI to generate personalized ones that reference the specific company and role.',
      '## 5. Track Your Applications\nUse a tracker to monitor application statuses. Follow up after 5-7 days if you haven\'t heard back.',
      '## 6-10: Advanced Strategies\nOptimize your resume for hh.ru\'s ATS, research companies before applying, negotiate salary confidently, build your network, and stay consistent with daily applications.',
    ],
  },
  'ai-cover-letter-guide': {
    title: 'How AI Cover Letters Get You More Interviews', category: 'Cover Letters', date: 'Apr 5, 2026', readTime: '3 min',
    content: [
      'AI-generated cover letters outperform generic templates by 40% in response rates. Here\'s why.',
      '## Personalization at Scale\nAI reads the job description and tailors every paragraph to the specific role, company, and requirements. No two cover letters are the same.',
      '## Keyword Optimization\nAI naturally incorporates keywords from the job posting, improving your chances with ATS systems.',
      '## Professional Tone\nAI maintains a consistent professional tone while sounding natural — avoiding the robotic feel of old template generators.',
      '## How to Use AI Cover Letters Effectively\n1. Always review and personalize the AI output\n2. Add a specific detail about the company\n3. Mention a mutual connection if possible\n4. Keep it under 300 words',
    ],
  },
  'staff-am-guide-armenia': {
    title: 'Complete Guide to Job Hunting on staff.am in Armenia', category: 'Job Search', date: 'Apr 2, 2026', readTime: '6 min',
    content: [
      'staff.am is Armenia\'s premier job platform. Whether you\'re local or looking to relocate, here\'s your complete guide.',
      '## Understanding the Armenian Job Market\nArmenia\'s tech sector is booming, with companies like PicsArt, Krisp, and ServiceTitan leading the way. Average tech salaries range from $1,500-$5,000/month.',
      '## Setting Up Your Profile\nComplete your staff.am profile in both English and Armenian if possible. Many international companies hire through the platform.',
      '## Top Industries on staff.am\nIT & Software, Finance, Marketing, Engineering, and Customer Service are the most active sectors.',
      '## Application Tips\n1. Apply within the first 48 hours of posting\n2. Customize your CV for Armenian companies\n3. Highlight relevant language skills\n4. Follow up via LinkedIn if possible',
    ],
  },
  'interview-preparation-checklist': {
    title: 'The Ultimate Interview Preparation Checklist', category: 'Interviews', date: 'Mar 28, 2026', readTime: '7 min',
    content: [
      'Proper preparation is the key to interview success. Follow this comprehensive checklist.',
      '## Before the Interview\n- Research the company thoroughly\n- Review the job description and match your experience\n- Prepare 5-7 STAR format stories\n- Practice with AI mock interviews\n- Prepare questions to ask the interviewer',
      '## Day of the Interview\n- Test your tech setup (camera, mic, internet)\n- Dress professionally (even for video calls)\n- Have your resume and notes ready\n- Join 5 minutes early',
      '## During the Interview\n- Listen carefully before answering\n- Use specific examples with metrics\n- Show enthusiasm for the role\n- Take notes on key points',
      '## After the Interview\n- Send a thank-you email within 24 hours\n- Reference specific topics discussed\n- Follow up after 5-7 business days if no response',
    ],
  },
  'salary-negotiation-cis': {
    title: 'Salary Negotiation Tips for the CIS Market', category: 'Career', date: 'Mar 25, 2026', readTime: '5 min',
    content: [
      'Salary negotiation in Russia, Armenia, and other CIS countries has its own dynamics. Here\'s how to maximize your compensation.',
      '## Know Your Market Value\nResearch salary ranges on hh.ru, Glassdoor, and habr.com for your role and experience level. Location matters significantly.',
      '## When to Negotiate\nAlways negotiate after receiving an offer, never during the interview. The best time is when you have competing offers.',
      '## What to Negotiate Beyond Salary\n- Remote work options\n- Signing bonus\n- Annual bonus structure\n- Professional development budget\n- Flexible hours\n- Extra vacation days',
      '## Cultural Considerations\nIn CIS markets, direct negotiation is respected but should be done professionally. Frame requests in terms of market data and your value, not personal needs.',
    ],
  },
};

interface Props { params: Promise<{ slug: string }>; }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS[slug];
  return { title: post?.title || 'Blog Post', description: post?.content[0] || '' };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <nav className="border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2"><Zap className="h-6 w-6 text-blue-600" /><span className="text-lg font-bold">AutoApply AI</span></Link>
          <Link href="/blog" className="text-sm text-muted-foreground hover:text-blue-600 flex items-center gap-1"><ArrowLeft className="h-3 w-3" />All Posts</Link>
        </div>
      </nav>
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">{post.category}</span>
            <span className="text-xs text-muted-foreground">{post.readTime}</span>
            <span className="text-xs text-muted-foreground">{post.date}</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        </div>
        <div className="prose dark:prose-invert max-w-none">
          {post.content.map((block, i) => {
            if (block.startsWith('## ')) {
              const [heading, ...rest] = block.split('\n');
              return (<div key={i}><h2 className="text-xl font-semibold mt-8 mb-3">{heading.replace('## ', '')}</h2>{rest.map((p, j) => <p key={j} className="text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">{p}</p>)}</div>);
            }
            return <p key={i} className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">{block}</p>;
          })}
        </div>
        <div className="mt-16 p-8 bg-blue-50 dark:bg-blue-950/30 rounded-2xl text-center">
          <h2 className="text-xl font-bold mb-2">Ready to automate your job search?</h2>
          <p className="text-muted-foreground mb-4">Join thousands using AI to land their dream job.</p>
          <Link href="/register" className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-medium">Start Free</Link>
        </div>
      </main>
    </div>
  );
}
