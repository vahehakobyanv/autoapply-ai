import { NextResponse } from 'next/server';
import { createServerSupabaseClient as createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: apps } = await supabase.from('applications').select('status').eq('user_id', user.id);
    const { data: gamification } = await supabase.from('user_gamification').select('*').eq('user_id', user.id).single();
    const { data: profile } = await supabase.from('profiles').select('name, role').eq('user_id', user.id).single();

    const total = apps?.length || 0;
    const interviews = apps?.filter(a => a.status === 'interview').length || 0;
    const offers = apps?.filter(a => a.status === 'offer').length || 0;

    const shareData = {
      name: profile?.name || 'Job Seeker',
      role: profile?.role || '',
      stats: { total, interviews, offers },
      level: gamification?.level || 1,
      xp: gamification?.xp || 0,
      streak: gamification?.streak_days || 0,
      share_text: `I've applied to ${total} jobs, got ${interviews} interviews and ${offers} offers using AutoApply AI! Level ${gamification?.level || 1} with a ${gamification?.streak_days || 0}-day streak.`,
      share_url: 'https://autoapply-ai-vert.vercel.app',
    };

    return NextResponse.json(shareData);
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
