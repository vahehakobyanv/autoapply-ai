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

  const { companyName, jobTitle } = await request.json();

  if (!companyName) {
    return NextResponse.json({ error: 'Company name required' }, { status: 400 });
  }

  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a company research expert. Provide insights about a company for a job seeker. Return valid JSON:
{
  "overview": "2-3 sentence company overview",
  "industry": "Tech / Finance / etc.",
  "size": "Startup / SMB / Enterprise",
  "culture": "Brief description of work culture",
  "interviewProcess": {
    "difficulty": "easy|moderate|hard",
    "stages": ["Phone screening", "Technical interview", "Final round"],
    "duration": "2-4 weeks typically",
    "tips": ["Prepare for system design questions", "Focus on cultural fit"]
  },
  "salaryRange": {
    "min": "estimate",
    "max": "estimate",
    "currency": "USD"
  },
  "pros": ["Good work-life balance", "Strong engineering culture"],
  "cons": ["Fast-paced", "High expectations"],
  "techStack": ["React", "Python", "AWS"],
  "glassdoorRating": "4.2/5 (estimated)",
  "interviewQuestions": ["Tell me about a challenging project", "Why this company?"]
}
Be helpful and realistic. Note these are AI-generated estimates.`,
        },
        {
          role: 'user',
          content: `Company: ${companyName}${jobTitle ? `\nPosition: ${jobTitle}` : ''}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.6,
    });

    return NextResponse.json(JSON.parse(response.choices[0].message.content || '{}'));
  } catch {
    return NextResponse.json({ error: 'Failed to get insights' }, { status: 500 });
  }
}
