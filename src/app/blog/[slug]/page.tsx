import Link from 'next/link';
import { Zap, ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import { EmailCapture } from '@/components/layout/email-capture';
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
  'ai-resume-builder-guide-2026': {
    title: 'AI Resume Builder: How to Create a Professional CV in 30 Seconds', category: 'Resume', date: 'Apr 14, 2026', readTime: '6 min',
    content: [
      'Creating a professional resume used to take hours of formatting and writing. Today, AI can generate a polished, ATS-optimized resume in under 30 seconds. Here is how to use it effectively.',
      '## Why AI Resume Builders Are Better Than Templates\nTraditional templates force you into rigid formats. AI resume builders analyze your profile, skills, and experience to create a unique, tailored document. They use natural language processing to write compelling bullet points that highlight your achievements, not just responsibilities.',
      '## Step 1: Set Up Your Profile\nBefore generating a resume, fill in your basic profile: name, desired role, skills, experience level, and languages. The more detail you provide, the better the AI output. Include specific technologies, tools, and methodologies you have worked with.',
      '## Step 2: Choose Your Template\nModern AI builders offer multiple professional templates. Choose based on your industry: corporate roles benefit from clean designs like "Professional" or "Executive," while creative roles suit "Bold" or "Creative" templates. Tech roles work well with "Tech" or "Minimal" designs.',
      '## Step 3: Generate and Customize\nClick generate and review the output. AI creates a strong foundation, but you should personalize it. Add specific metrics (increased revenue by 23 percent), remove irrelevant details, and ensure your contact information is current.',
      '## Step 4: Tailor for Each Job\nThe most powerful feature of AI resume builders is per-job tailoring. Paste a job description and the AI rewrites your resume to match keywords, rearrange skills by relevance, and adjust your summary. This dramatically improves ATS match rates.',
      '## Step 5: Export and Apply\nExport as PDF and review the final formatting. Ensure it is clean, single or two pages, and free of formatting artifacts. Then apply with confidence knowing your resume is optimized.',
      '## Pro Tip: Use the ATS Score Feature\nAfter generating your resume, run it through an ATS analyzer with the target job description. Aim for a match score above 80 percent. AutoApply AI includes this feature built-in so you can check before applying.',
    ],
  },
  'hh-ru-auto-apply-guide': {
    title: 'How to Auto-Apply to 100+ Jobs on hh.ru (Without Getting Banned)', category: 'Job Search', date: 'Apr 14, 2026', readTime: '7 min',
    content: [
      'Applying to jobs manually on hh.ru is exhausting. You find a listing, click respond, fill in details, write a cover letter, and repeat a hundred times. Automation can save you 20 plus hours per week, but you need to do it right to avoid account restrictions.',
      '## Why Auto-Apply Works\nData shows that applying to more jobs increases your chances of landing interviews. Job seekers who apply to 50 plus positions per week get 3 times more callbacks than those who apply to fewer than 10. Volume matters in the early stages of a job search.',
      '## Rule 1: Use Human-Like Delays\nNever blast 100 applications in 5 minutes. This flags your account immediately. Smart automation tools add random delays between 30 seconds and 3 minutes between each application, mimicking human behavior.',
      '## Rule 2: Personalize Every Cover Letter\nThe biggest mistake with auto-apply is sending the same generic message to every employer. Use AI to generate a unique cover letter for each job that references the company name, role requirements, and specific skills they are looking for.',
      '## Rule 3: Target the Right Jobs\nDo not apply to everything. Filter by your actual skills, experience level, and salary expectations. Irrelevant applications waste your time and lower your response rate, which hh.ru tracks.',
      '## Rule 4: Track Everything\nUse a Kanban-style tracker to monitor every application. Know which companies you have applied to, when, and what status each one is in. This prevents duplicate applications and helps you follow up at the right time.',
      '## Rule 5: Rotate Your Approach\nDo not apply to 100 jobs on Monday and zero for the rest of the week. Spread applications across the week. Apply to 15 to 20 per day, Monday through Friday. This looks natural to the platform.',
      '## The Right Tools\nAutoApply AI offers a Playwright-based auto-apply bot specifically designed for hh.ru. It types like a human with 30 to 130 millisecond character delays, generates unique cover letters, and tracks every application automatically. Combined with the Chrome extension for one-click saving, it is the most efficient way to manage a high-volume job search.',
      '## When to Stop Auto-Applying\nOnce you have 5 to 10 active interview processes, pause new applications. Focus on preparation. Use AI mock interview tools to practice, and follow up on pending applications. Quality over quantity matters once you have momentum.',
    ],
  },
  'remote-jobs-russia-armenia-2026': {
    title: 'Best Remote Job Opportunities in Russia and Armenia (2026)', category: 'Job Search', date: 'Apr 13, 2026', readTime: '8 min',
    content: [
      'Remote work has transformed the job market in Russia and Armenia. Tech professionals can now earn global salaries while living in cities with lower costs of living. Here is the current landscape and how to position yourself.',
      '## The Remote Work Boom in the CIS\nSince 2020, remote work adoption in Russia and Armenia has grown over 300 percent. Companies like Yandex, VK, Kaspersky, PicsArt, and Krisp now offer permanent remote options. International companies are also actively hiring from the region.',
      '## Top Remote-Friendly Companies Hiring from Russia\nYandex, VK Group, JetBrains, Kaspersky Lab, Parallels, and numerous international startups hire Russian developers remotely. Salary ranges for senior engineers are 250,000 to 500,000 RUB per month, with international companies paying even more.',
      '## Top Remote-Friendly Companies Hiring from Armenia\nPicsArt, Krisp, ServiceTitan, Workfront (Adobe), EPAM Systems, and Digitain are among the largest employers. The tech sector in Yerevan is growing rapidly with salaries ranging from 500,000 to 2,500,000 AMD per month for experienced professionals.',
      '## In-Demand Remote Skills\nThe most sought-after skills for remote positions include: React and TypeScript for frontend, Python and Go for backend, DevOps and cloud infrastructure (AWS, GCP), data science and machine learning, mobile development (React Native, Flutter), and product management.',
      '## How to Stand Out for Remote Roles\n1. Highlight async communication skills on your resume\n2. Showcase independent project work\n3. Include timezone flexibility in your application\n4. Build a portfolio or personal website\n5. Get certifications in cloud platforms\n6. Contribute to open-source projects',
      '## Where to Find Remote Jobs\nBesides hh.ru and staff.am, check remote-specific platforms: LinkedIn Remote filter, AngelList, We Work Remotely, Remote.co, and Telegram channels dedicated to CIS remote jobs. Use AutoApply AI Job Agent to automatically monitor multiple sources.',
      '## Salary Negotiation for Remote\nRemote salaries from international companies are often 2 to 5 times higher than local rates. Know your market value globally, not just locally. Use the Salary Negotiation Coach in AutoApply AI to prepare counter-offers backed by market data.',
    ],
  },
  'ats-resume-optimization': {
    title: 'ATS Resume Optimization: Beat the Bots and Get Seen by Recruiters', category: 'Resume', date: 'Apr 13, 2026', readTime: '6 min',
    content: [
      'Over 98 percent of Fortune 500 companies and most mid-size employers use Applicant Tracking Systems (ATS) to filter resumes. If your resume is not optimized for these systems, it may never reach a human recruiter, regardless of how qualified you are.',
      '## What Is an ATS and Why Does It Matter\nAn ATS scans your resume for keywords, formatting, and structure. It assigns a match score based on how closely your resume aligns with the job description. Resumes scoring below the threshold, typically 70 to 80 percent, are automatically rejected.',
      '## The 5 Biggest ATS Killers\n1. Fancy formatting: columns, tables, graphics, and text boxes confuse ATS parsers\n2. Wrong file format: always use PDF or DOCX, never images\n3. Missing keywords: if the job says "project management" and you say "PM," the ATS may not match\n4. Headers in images: ATS cannot read text embedded in images\n5. Unusual section names: use standard headings like "Experience," "Education," "Skills"',
      '## How to Optimize Your Resume for ATS\nStart by reading the job description carefully. Identify the key skills, qualifications, and terms used. Then mirror those exact phrases in your resume. If they say "cross-functional team leadership," use that phrase, not "led teams across departments."',
      '## Keyword Strategy\nDivide keywords into three categories:\n- Hard skills: specific technologies, tools, certifications (Python, AWS, PMP)\n- Soft skills: communication, leadership, problem-solving\n- Industry terms: agile methodology, CI/CD, KPI tracking\n\nInclude all three types naturally throughout your resume.',
      '## The Right Format\nUse a single-column layout with clear section headers. Standard fonts like Arial, Calibri, or Times New Roman. Black text on white background. Bullet points for achievements. No headers or footers with critical information since some ATS skip those areas.',
      '## Test Before You Apply\nUse an ATS scoring tool to check your resume against the job description before submitting. AutoApply AI ATS Score analyzer gives you a detailed breakdown: overall score, keyword match percentage, section-by-section analysis, and a prioritized list of improvements.',
      '## Pro Strategy: Tailor Per Application\nThe most effective approach is creating a base resume and tailoring it for each application. This sounds time-consuming, but AI makes it instant. AutoApply AI Resume Tailoring feature automatically adjusts keywords, reorders skills, and rephrases experience bullets to match each job.',
    ],
  },
  'career-change-guide-2026': {
    title: 'How to Successfully Change Careers in 2026: A Complete Playbook', category: 'Career', date: 'Apr 12, 2026', readTime: '9 min',
    content: [
      'Changing careers is one of the most challenging yet rewarding professional decisions you can make. Whether you are transitioning from marketing to tech, finance to product management, or any other path, this guide covers everything you need.',
      '## Step 1: Identify Your Transferable Skills\nEvery career builds skills that transfer. A teacher has presentation, curriculum design, and stakeholder management skills. A salesperson has negotiation, CRM proficiency, and data analysis abilities. Map your existing skills to your target role requirements.',
      '## Step 2: Research Your Target Industry\nBefore making the leap, understand the landscape. What are entry-level roles? What skills are mandatory vs nice-to-have? What is the salary range? Use tools like AutoApply AI Market Insights to get data on demand levels, top skills, and salary trends for any role in any location.',
      '## Step 3: Fill the Skill Gaps\nIdentify what you are missing and create a learning plan. For tech roles, online bootcamps and certifications carry weight. For business roles, MBA programs or professional certifications help. AutoApply AI Skill Gap Dashboard aggregates feedback from job analyses to show you exactly what skills you need.',
      '## Step 4: Build Proof\nEmployers want evidence you can do the job. Start side projects, volunteer work, or freelance gigs in your target field. Create a portfolio showcasing relevant work. Even personal projects demonstrate initiative and capability.',
      '## Step 5: Rebrand Your Resume\nThis is where most career changers fail. Do not use your old resume format. Rewrite it to emphasize transferable skills and relevant experience. Use a functional or combination resume format instead of chronological. AI resume builders can help reframe your experience for a new industry.',
      '## Step 6: Network Strategically\nInformational interviews are your most powerful tool. Reach out to people in your target role. Ask about their path, what they wish they knew, and what hiring managers look for. Use LinkedIn and professional communities. AutoApply AI Networking Events finder can suggest relevant meetups and communities.',
      '## Step 7: Apply Strategically\nDo not blast 200 applications. Target companies known for hiring career changers. Look for roles that say "diverse backgrounds welcome" or "non-traditional paths encouraged." Start with smaller companies where your unique perspective is valued.',
      '## Step 8: Ace the Interview\nPrepare your career change narrative. Why are you switching? What unique value do you bring? How does your past experience make you better at this new role? Practice with AI mock interviews to refine your story and build confidence.',
      '## The Timeline\nRealistic career changes take 3 to 12 months. Month 1 to 2: research and skill gap analysis. Month 3 to 6: learning and building proof. Month 6 to 9: networking and applying. Month 9 to 12: interviewing and landing the role. Stay patient and consistent.',
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
        <div className="mt-12">
          <EmailCapture />
        </div>
        <div className="mt-8 p-8 bg-blue-50 dark:bg-blue-950/30 rounded-2xl text-center">
          <h2 className="text-xl font-bold mb-2">Ready to automate your job search?</h2>
          <p className="text-muted-foreground mb-4">Join thousands using AI to land their dream job.</p>
          <Link href="/register" className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-medium">Start Free</Link>
        </div>
      </main>
    </div>
  );
}
