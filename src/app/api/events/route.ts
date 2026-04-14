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

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: `Suggest relevant networking events, meetups, conferences, and communities for a job seeker. Return ONLY valid JSON:
{
  "events": [{"name": "event name", "type": "meetup|conference|webinar|community", "description": "1 sentence", "url_hint": "where to find it", "frequency": "weekly|monthly|annual", "cost": "free|paid", "relevance": "why it's good for this person"}],
  "communities": [{"name": "community name", "platform": "Telegram|Discord|Slack|LinkedIn", "description": "1 sentence", "url_hint": "search term"}],
  "tips": ["networking tip"]
}` },
        { role: 'user', content: `Role: ${profile?.role || body.role}\nSkills: ${(profile?.skills || []).join(', ')}\nLocation: ${profile?.location || body.location || 'Remote'}\nIndustry: ${body.industry || 'Tech'}` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    return NextResponse.json(JSON.parse(response.choices[0].message.content || '{}'));
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
