import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { tailorResumeForJob } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { resume_id, job_id, job_title, job_description, job_requirements } = await req.json();

    const { data: resume } = await supabase.from('resumes').select('*').eq('id', resume_id).eq('user_id', user.id).single();
    if (!resume) return NextResponse.json({ error: 'Resume not found' }, { status: 404 });

    let title = job_title || '';
    let description = job_description || '';
    let requirements = job_requirements || '';

    if (job_id) {
      const { data: job } = await supabase.from('jobs').select('*').eq('id', job_id).single();
      if (job) { title = job.title; description = job.description; requirements = job.requirements; }
    }

    const content = resume.content as { name?: string; role?: string; summary?: string; skills?: string[]; experience?: { title: string; company: string; description: string }[] };
    const tailored = await tailorResumeForJob(
      { name: content.name || '', role: content.role || '', summary: content.summary || '', skills: content.skills || [], experience: content.experience || [] },
      title, description, requirements
    );

    // Save as new resume
    const { data: newResume, error } = await supabase.from('resumes').insert({
      user_id: user.id,
      title: `${resume.title} — Tailored for ${title}`,
      content: { ...content, summary: tailored.summary, skills: tailored.skills, experience: tailored.experience.map((e, i) => ({ ...(content.experience?.[i] || {}), ...e })) },
      language: resume.language,
      template: resume.template,
    }).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ resume: newResume, keywords_added: tailored.keywords_added, match_improvement: tailored.match_improvement });
  } catch { return NextResponse.json({ error: 'Failed to tailor resume' }, { status: 500 }); }
}
