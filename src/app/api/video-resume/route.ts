import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient as createClient } from '@/lib/supabase/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
    const body = await req.json();

    if (body.action === 'generate_script') {
      const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: `Write a 60-second video resume script. It should be conversational, confident, and memorable. Return ONLY valid JSON:
{"script": "full script text with [PAUSE] markers", "duration_estimate": "55-65 seconds", "tips": ["delivery tip"], "sections": [{"label": "Intro", "text": "...", "duration": "10s"}, {"label": "Experience", "text": "...", "duration": "20s"}, {"label": "Skills", "text": "...", "duration": "15s"}, {"label": "Close", "text": "...", "duration": "10s"}]}` },
          { role: 'user', content: `Name: ${profile?.name}\nRole: ${profile?.role}\nSkills: ${(profile?.skills || []).join(', ')}\nExperience: ${profile?.experience}\nTarget role: ${body.target_role || profile?.role}\nTone: ${body.tone || 'professional but friendly'}` },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      });
      return NextResponse.json(JSON.parse(response.choices[0].message.content || '{}'));
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
