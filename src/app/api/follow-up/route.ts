import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient as createClient } from '@/lib/supabase/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { type, jobTitle, company, interviewDate, notes, language } = body;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    const langLabel = language === 'ru' ? 'Russian' : 'English';

    const templates: Record<string, string> = {
      after_interview: `Write a professional follow-up thank you email after a job interview in ${langLabel}. Be warm but professional. Keep it concise (3-4 short paragraphs).`,
      after_application: `Write a professional follow-up email after submitting a job application in ${langLabel}. Express continued interest. Keep it brief (2-3 paragraphs).`,
      no_response: `Write a polite follow-up email when you haven't heard back after an interview in ${langLabel}. Be professional, not pushy. Keep it brief (2-3 paragraphs).`,
      after_rejection: `Write a graceful response to a job rejection in ${langLabel}. Thank them, express continued interest for future roles. Keep it brief (2 paragraphs).`,
      networking: `Write a professional networking follow-up email in ${langLabel}. Reference the connection and express interest. Keep it brief (2-3 paragraphs).`,
    };

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `${templates[type] || templates.after_interview}\n\nReturn ONLY valid JSON:\n{"subject": "email subject line", "body": "full email body with proper greeting and sign-off"}`,
        },
        {
          role: 'user',
          content: `Candidate: ${profile?.name || 'Job Candidate'}, ${profile?.role || ''}\nPosition: ${jobTitle}\nCompany: ${company}\n${interviewDate ? `Interview Date: ${interviewDate}` : ''}\n${notes ? `Additional Context: ${notes}` : ''}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    return NextResponse.json(JSON.parse(response.choices[0].message.content || '{}'));
  } catch {
    return NextResponse.json({ error: 'Failed to generate follow-up' }, { status: 500 });
  }
}
