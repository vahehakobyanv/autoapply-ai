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

  const { jobTitle, company, jobDescription, language = 'en' } = await request.json();

  if (!jobTitle && !jobDescription) {
    return NextResponse.json({ error: 'Job title or description required' }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, role, skills, experience')
    .eq('user_id', user.id)
    .single();

  const langLabel = language === 'ru' ? 'Russian' : 'English';

  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are an expert interview coach. Generate interview preparation materials in ${langLabel}. Return valid JSON with this structure:
{
  "questions": [
    {
      "question": "The interview question",
      "category": "technical|behavioral|situational",
      "difficulty": "easy|medium|hard",
      "suggestedAnswer": "A strong sample answer",
      "tips": "Brief tip for answering well"
    }
  ],
  "companyResearch": "Key things to know about the company",
  "talkingPoints": ["Key point 1", "Key point 2"],
  "questionsToAsk": ["Smart question to ask the interviewer"]
}
Generate 8-10 questions covering technical, behavioral, and situational categories.`,
        },
        {
          role: 'user',
          content: `Prepare interview questions for:
Position: ${jobTitle}
Company: ${company || 'Not specified'}
Job Description: ${jobDescription || 'Not provided'}
Candidate Profile: ${profile?.name || 'Candidate'}, ${profile?.role || jobTitle}
Skills: ${profile?.skills?.join(', ') || 'General'}
Experience: ${profile?.experience || 'Mid-level'}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const content = JSON.parse(response.choices[0].message.content || '{}');
    return NextResponse.json(content);
  } catch {
    return NextResponse.json({ error: 'Failed to generate interview prep' }, { status: 500 });
  }
}
