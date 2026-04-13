import { createServerSupabaseClient } from '@/lib/supabase/server';
import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { jobTitle, jobDescription, jobRequirements } = await request.json();

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, role, skills, experience, languages, location')
    .eq('user_id', user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 400 });
  }

  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a job matching expert. Analyze how well a candidate matches a job. Return valid JSON:
{
  "score": 85,
  "breakdown": {
    "skills": {"score": 90, "matched": ["React", "Node.js"], "missing": ["AWS"], "comment": "Strong technical match"},
    "experience": {"score": 80, "comment": "Mid-level, job asks for senior"},
    "location": {"score": 100, "comment": "Same city"},
    "languages": {"score": 75, "comment": "English required, candidate speaks it"}
  },
  "summary": "Strong candidate with 85% match. Good technical skills but may need more experience.",
  "tips": ["Emphasize leadership experience", "Mention any cloud projects"],
  "competitiveLevel": "strong"
}
The score should be 0-100. competitiveLevel: "weak" (<40), "moderate" (40-65), "strong" (65-85), "excellent" (>85).`,
        },
        {
          role: 'user',
          content: `CANDIDATE:
Name: ${profile.name}
Role: ${profile.role}
Skills: ${profile.skills.join(', ')}
Experience: ${profile.experience}
Languages: ${profile.languages.join(', ')}
Location: ${profile.location}

JOB:
Title: ${jobTitle}
Description: ${jobDescription || 'Not provided'}
Requirements: ${jobRequirements || 'Not provided'}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.4,
    });

    return NextResponse.json(JSON.parse(response.choices[0].message.content || '{}'));
  } catch {
    return NextResponse.json({ error: 'Failed to calculate match' }, { status: 500 });
  }
}
