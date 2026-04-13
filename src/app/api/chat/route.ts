import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient as createClient } from '@/lib/supabase/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { message, history } = await req.json();

    // Fetch user context
    const [profileRes, appsRes, gamRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('user_id', user.id).single(),
      supabase.from('applications').select('status').eq('user_id', user.id),
      supabase.from('user_gamification').select('xp, level, streak_days').eq('user_id', user.id).single(),
    ]);

    const profile = profileRes.data;
    const apps = appsRes.data || [];
    const gam = gamRes.data;

    const context = `User context:
Name: ${profile?.name || 'Unknown'}, Role: ${profile?.role || 'Unknown'}
Skills: ${(profile?.skills || []).join(', ')}
Experience: ${profile?.experience || 'Unknown'}
Location: ${profile?.location || 'Unknown'}
Applications: ${apps.length} total, ${apps.filter(a => a.status === 'applied').length} applied, ${apps.filter(a => a.status === 'interview').length} interviews, ${apps.filter(a => a.status === 'offer').length} offers
Level: ${gam?.level || 1}, XP: ${gam?.xp || 0}, Streak: ${gam?.streak_days || 0} days`;

    const messages = [
      {
        role: 'system' as const,
        content: `You are AutoApply AI Assistant — a friendly, knowledgeable career coach built into the AutoApply AI platform. You have access to the user's profile and application data. Help with job search strategy, resume tips, interview prep, salary negotiation, and using the platform features. Be concise, actionable, and encouraging. Reference specific data when helpful.\n\n${context}`,
      },
      ...(history || []).slice(-8).map((h: { role: string; content: string }) => ({
        role: h.role as 'user' | 'assistant',
        content: h.content,
      })),
      { role: 'user' as const, content: message },
    ];

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    return NextResponse.json({ reply: response.choices[0].message.content });
  } catch { return NextResponse.json({ error: 'Chat failed' }, { status: 500 }); }
}
