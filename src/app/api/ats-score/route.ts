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

  const { resumeContent, jobDescription } = await request.json();

  if (!resumeContent) {
    return NextResponse.json({ error: 'Resume content required' }, { status: 400 });
  }

  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are an ATS (Applicant Tracking System) expert. Analyze a resume for ATS compatibility and score it. Return valid JSON:
{
  "score": 78,
  "grade": "B+",
  "sections": {
    "formatting": {"score": 90, "feedback": "Clean formatting, ATS-friendly"},
    "keywords": {"score": 70, "feedback": "Missing some key terms", "missing": ["Docker", "CI/CD"]},
    "experience": {"score": 85, "feedback": "Good action verbs and quantified results"},
    "education": {"score": 80, "feedback": "Degree listed properly"},
    "skills": {"score": 75, "feedback": "Good skill list but could add more specific tools"},
    "summary": {"score": 80, "feedback": "Professional summary is well-written"}
  },
  "improvements": [
    {"priority": "high", "suggestion": "Add Docker and Kubernetes to skills"},
    {"priority": "medium", "suggestion": "Quantify achievements with numbers"},
    {"priority": "low", "suggestion": "Add a LinkedIn URL"}
  ],
  "keywordMatch": 72,
  "readability": "good",
  "lengthAssessment": "appropriate"
}
Score 0-100. Be specific and actionable with feedback.${jobDescription ? ' Compare against the provided job description.' : ''}`,
        },
        {
          role: 'user',
          content: `RESUME:\n${JSON.stringify(resumeContent).slice(0, 4000)}${jobDescription ? `\n\nJOB DESCRIPTION:\n${jobDescription.slice(0, 2000)}` : ''}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.4,
    });

    return NextResponse.json(JSON.parse(response.choices[0].message.content || '{}'));
  } catch {
    return NextResponse.json({ error: 'Failed to analyze resume' }, { status: 500 });
  }
}
