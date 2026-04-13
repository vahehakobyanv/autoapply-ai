import { NextResponse } from 'next/server';
import { createServerSupabaseClient as createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: apps } = await supabase.from('applications').select('*, job:jobs(*)').eq('user_id', user.id).order('applied_at', { ascending: true });
    if (!apps?.length) return NextResponse.json({ total: 0, response_rate: 0, avg_response_days: 0, best_day: 'N/A', conversion: {}, by_source: [], by_month: [], response_times: [] });

    const total = apps.length;
    const applied = apps.filter(a => a.status !== 'saved');
    const responses = apps.filter(a => ['interview', 'offer', 'rejected'].includes(a.status));
    const interviews = apps.filter(a => a.status === 'interview');
    const offers = apps.filter(a => a.status === 'offer');

    // Response rate
    const response_rate = applied.length > 0 ? Math.round((responses.length / applied.length) * 100) : 0;

    // Avg response time (days between applied and status change)
    const responseTimes = responses.map(a => {
      const applyDate = new Date(a.applied_at);
      const updateDate = new Date(a.updated_at);
      return Math.max(0, Math.round((updateDate.getTime() - applyDate.getTime()) / (1000 * 60 * 60 * 24)));
    }).filter(d => d > 0 && d < 365);
    const avg_response_days = responseTimes.length > 0 ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length) : 0;

    // Best day to apply (day of week with highest response rate)
    const dayStats: Record<number, { total: number; responses: number }> = {};
    applied.forEach(a => {
      const day = new Date(a.applied_at).getDay();
      if (!dayStats[day]) dayStats[day] = { total: 0, responses: 0 };
      dayStats[day].total++;
      if (['interview', 'offer'].includes(a.status)) dayStats[day].responses++;
    });
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let bestDay = 'N/A';
    let bestRate = 0;
    Object.entries(dayStats).forEach(([day, stat]) => {
      const rate = stat.total > 2 ? stat.responses / stat.total : 0;
      if (rate > bestRate) { bestRate = rate; bestDay = dayNames[parseInt(day)]; }
    });

    // Conversion funnel
    const conversion = {
      saved_to_applied: total > 0 ? Math.round((applied.length / total) * 100) : 0,
      applied_to_interview: applied.length > 0 ? Math.round((interviews.length / applied.length) * 100) : 0,
      interview_to_offer: interviews.length > 0 ? Math.round((offers.length / interviews.length) * 100) : 0,
    };

    // By source
    const sourceMap: Record<string, { total: number; interviews: number; offers: number }> = {};
    apps.forEach(a => {
      const source = (a.job as Record<string, string>)?.source || 'manual';
      if (!sourceMap[source]) sourceMap[source] = { total: 0, interviews: 0, offers: 0 };
      sourceMap[source].total++;
      if (a.status === 'interview') sourceMap[source].interviews++;
      if (a.status === 'offer') sourceMap[source].offers++;
    });
    const by_source = Object.entries(sourceMap).map(([source, stats]) => ({ source, ...stats }));

    // By month
    const monthMap: Record<string, number> = {};
    apps.forEach(a => {
      const month = a.applied_at?.slice(0, 7);
      if (month) monthMap[month] = (monthMap[month] || 0) + 1;
    });
    const by_month = Object.entries(monthMap).map(([month, count]) => ({ month, count })).slice(-6);

    // Response time distribution
    const response_time_buckets = [
      { label: '< 3 days', count: responseTimes.filter(d => d < 3).length },
      { label: '3-7 days', count: responseTimes.filter(d => d >= 3 && d <= 7).length },
      { label: '1-2 weeks', count: responseTimes.filter(d => d > 7 && d <= 14).length },
      { label: '2-4 weeks', count: responseTimes.filter(d => d > 14 && d <= 30).length },
      { label: '1+ month', count: responseTimes.filter(d => d > 30).length },
    ];

    return NextResponse.json({
      total, response_rate, avg_response_days, best_day, conversion,
      by_source, by_month, response_time_buckets,
      interviews: interviews.length, offers: offers.length,
    });
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
