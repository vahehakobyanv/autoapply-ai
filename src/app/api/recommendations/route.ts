import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
    const { data: apps } = await supabase.from('applications').select('*, job:jobs(title, company, source)').eq('user_id', user.id).limit(20);

    const appliedJobs = (apps || []).map(a => {
      const job = a.job as Record<string, string> | null;
      return `${job?.title || ''} at ${job?.company || ''}`;
    }).filter(Boolean).join(', ');

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `Based on the user's profile and past applications, suggest 5 specific job recommendations they should apply to. Return ONLY valid JSON:
{
  "recommendations": [
    {"title": "job title", "company_type": "type of company", "why": "1 sentence why this is a good fit", "search_query": "what to search for"}
  ],
  "insights": ["1 insight about their job search pattern"]
}`,
        },
        {
          role: 'user',
          content: `Profile: ${profile?.name}, ${profile?.role}\nSkills: ${(profile?.skills || []).join(', ')}\nExperience: ${profile?.experience}\nLocation: ${profile?.location}\nPast applications: ${appliedJobs || 'none yet'}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    return NextResponse.json(JSON.parse(response.choices[0].message.content || '{}'));
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
