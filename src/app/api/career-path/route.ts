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
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    const body = await req.json();
    const targetRole = body.target_role || '';

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a career advisor. Create a detailed career progression plan. Return ONLY valid JSON:
{
  "current_level": "Junior/Mid/Senior/Lead",
  "target_role": "target position",
  "estimated_years": 3,
  "milestones": [
    {
      "title": "milestone name",
      "timeframe": "0-6 months",
      "description": "what to achieve",
      "skills_to_learn": ["skill1", "skill2"],
      "actions": ["specific action"],
      "salary_range": "$X - $Y"
    }
  ],
  "recommended_certifications": ["cert name"],
  "recommended_projects": ["project idea"],
  "advice": "2-3 sentences of personalized advice"
}`,
        },
        {
          role: 'user',
          content: `Current: ${profile.name}, ${profile.role}\nExperience: ${profile.experience}\nSkills: ${(profile.skills || []).join(', ')}\nLocation: ${profile.location}\n${targetRole ? `Target role: ${targetRole}` : 'Suggest the next career level'}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.6,
    });

    return NextResponse.json(JSON.parse(response.choices[0].message.content || '{}'));
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
