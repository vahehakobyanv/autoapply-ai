import { NextResponse } from 'next/server';
import { createServerSupabaseClient as createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weekStr = oneWeekAgo.toISOString();

    const { data: apps } = await supabase.from('applications').select('*, job:jobs(title, company)').eq('user_id', user.id).gte('applied_at', weekStr);
    const { data: allApps } = await supabase.from('applications').select('status').eq('user_id', user.id);
    const { data: gamification } = await supabase.from('user_gamification').select('*').eq('user_id', user.id).single();

    const weekApps = apps || [];
    const total = allApps?.length || 0;

    const digest = {
      period: `${oneWeekAgo.toLocaleDateString()} - ${new Date().toLocaleDateString()}`,
      this_week: {
        applications: weekApps.length,
        interviews: weekApps.filter(a => a.status === 'interview').length,
        offers: weekApps.filter(a => a.status === 'offer').length,
        rejections: weekApps.filter(a => a.status === 'rejected').length,
      },
      all_time: {
        total,
        interviews: allApps?.filter(a => a.status === 'interview').length || 0,
        offers: allApps?.filter(a => a.status === 'offer').length || 0,
      },
      streak: gamification?.streak_days || 0,
      xp: gamification?.xp || 0,
      level: gamification?.level || 1,
      recent_applications: weekApps.slice(0, 5).map(a => ({
        title: (a.job as Record<string, string>)?.title || 'Job',
        company: (a.job as Record<string, string>)?.company || '',
        status: a.status,
        date: a.applied_at?.split('T')[0],
      })),
    };

    return NextResponse.json(digest);
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
