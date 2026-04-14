import { createServerSupabaseClient } from '@/lib/supabase/server';
import { generateResume, parseJobDescription } from '@/lib/ai';
import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { language = 'en', template = 'modern', generateWithAI = false, jobDescription, jobUrl } = body;

  let content = body.content || {};

  if (generateWithAI) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found. Complete onboarding first.' }, { status: 400 });
    }

    try {
      // If job URL provided, fetch and parse it first
      let jobContext = jobDescription || '';
      if (jobUrl && !jobContext) {
        try {
          const response = await fetch(jobUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
          const html = await response.text();
          const parsed = await parseJobDescription(html);
          jobContext = `${parsed.title} at ${parsed.company}. ${parsed.description}. Requirements: ${parsed.requirements}`;
        } catch { /* use empty job context */ }
      }

      if (jobContext) {
        // Generate resume TAILORED to the job description
        const langLabel = language === 'ru' ? 'Russian' : language === 'hy' ? 'Armenian' : 'English';
        const res = await groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `You are a professional resume writer. Generate a resume in ${langLabel} TAILORED to the provided job description. Highlight matching skills, use keywords from the job, and emphasize relevant experience. Return ONLY valid JSON:
{
  "name": "string", "role": "string matching the job title", "email": "", "phone": "", "location": "string",
  "summary": "2-3 sentence summary tailored to this specific job",
  "experience": [{"title": "string", "company": "string", "startDate": "string", "endDate": "string", "description": "string with keywords from the job"}],
  "education": [{"degree": "string", "institution": "string", "year": "string"}],
  "skills": ["prioritized skills matching the job requirements"],
  "languages": ["string"]
}`,
            },
            {
              role: 'user',
              content: `Candidate profile:\nName: ${profile.name}\nRole: ${profile.role}\nSkills: ${(profile.skills || []).join(', ')}\nExperience: ${profile.experience}\nLanguages: ${(profile.languages || []).join(', ')}\nLocation: ${profile.location}\n\nJOB DESCRIPTION TO TAILOR FOR:\n${jobContext.slice(0, 3000)}`,
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.6,
        });
        content = JSON.parse(res.choices[0].message.content || '{}');
      } else {
        // Standard generation without job context
        const generated = await generateResume(
          {
            name: profile.name,
            role: profile.role,
            skills: profile.skills,
            experience: profile.experience,
            languages: profile.languages,
            location: profile.location,
          },
          language
        );
        content = JSON.parse(generated);
      }
    } catch {
      return NextResponse.json({ error: 'Failed to generate resume' }, { status: 500 });
    }
  }

  const { data, error } = await supabase
    .from('resumes')
    .insert({
      user_id: user.id,
      title: (jobDescription || jobUrl) ? `Resume — ${(content as Record<string, string>).role || 'Tailored'} (${language.toUpperCase()})` : `Resume - ${language.toUpperCase()}`,
      content,
      language,
      template,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { id, ...updates } = body;

  const { data, error } = await supabase
    .from('resumes')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
