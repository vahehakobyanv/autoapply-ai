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
    const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `Write a professional reference/recommendation letter. Make it specific and genuine. Return ONLY valid JSON: {"letter": "full letter text with proper greeting and sign-off", "word_count": 250}`,
        },
        {
          role: 'user',
          content: `Candidate: ${profile?.name || body.candidate_name}, ${profile?.role || body.candidate_role}\nSkills: ${(profile?.skills || []).join(', ')}\nExperience: ${profile?.experience}\n\nReference written by: ${body.referee_name}, ${body.referee_title} at ${body.referee_company}\nRelationship: ${body.relationship || 'colleague'}\nDuration: ${body.duration || '2 years'}\nKey qualities to highlight: ${body.qualities || 'leadership, technical skills, teamwork'}\nTarget role: ${body.target_role || ''}\nLanguage: ${body.language === 'ru' ? 'Russian' : 'English'}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    return NextResponse.json(JSON.parse(response.choices[0].message.content || '{}'));
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
