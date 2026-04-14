import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient as createClient } from '@/lib/supabase/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { job_id } = await req.json();

    const [profileRes, jobRes, resumeRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('user_id', user.id).single(),
      supabase.from('jobs').select('*').eq('id', job_id).single(),
      supabase.from('resumes').select('content').eq('user_id', user.id).order('updated_at', { ascending: false }).limit(1).single(),
    ]);

    const profile = profileRes.data;
    const job = jobRes.data;
    if (!profile || !job) return NextResponse.json({ error: 'Profile or job not found' }, { status: 404 });

    const resumeContent = resumeRes.data?.content as Record<string, unknown> | undefined;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `Score how well a candidate matches a job. Return ONLY valid JSON:
{
  "score": 0-100,
  "breakdown": {"skills": 0-100, "experience": 0-100, "education": 0-100, "location": 0-100},
  "matching_skills": ["skills the candidate has that match"],
  "missing_skills": ["skills the job needs that candidate lacks"],
  "summary": "1 sentence assessment"
}`,
        },
        {
          role: 'user',
          content: `Candidate: ${profile.name}, ${profile.role}\nSkills: ${(profile.skills || []).join(', ')}\nExperience: ${profile.experience}\nLocation: ${profile.location}\n${resumeContent ? `Resume summary: ${(resumeContent as Record<string, string>).summary || ''}` : ''}\n\nJob: ${job.title} at ${job.company}\nDescription: ${(job.description || '').slice(0, 2000)}\nRequirements: ${(job.requirements || '').slice(0, 1000)}\nLocation: ${job.location || 'Not specified'}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.4,
    });

    return NextResponse.json(JSON.parse(response.choices[0].message.content || '{}'));
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
