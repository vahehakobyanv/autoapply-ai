import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient as createClient } from '@/lib/supabase/server';
import { scoreJobOffer } from '@/lib/ai';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { data } = await supabase.from('job_offers').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    return NextResponse.json(data || []);
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json();

    if (body.action === 'score') {
      const scored = await scoreJobOffer(body);
      return NextResponse.json(scored);
    }

    if (body.action === 'delete') {
      await supabase.from('job_offers').delete().eq('id', body.id).eq('user_id', user.id);
      return NextResponse.json({ success: true });
    }

    const scored = await scoreJobOffer({ company: body.company, role: body.role, salary: body.salary, currency: body.currency || 'USD', benefits: body.benefits || [], remote_policy: body.remote_policy || 'onsite', pto_days: body.pto_days });

    const { data, error } = await supabase.from('job_offers').upsert({
      id: body.id || undefined, user_id: user.id, job_id: body.job_id,
      company: body.company, role: body.role, salary: body.salary, currency: body.currency || 'USD',
      bonus: body.bonus, equity: body.equity, benefits: body.benefits || [],
      remote_policy: body.remote_policy || 'onsite', pto_days: body.pto_days,
      commute_time: body.commute_time, start_date: body.start_date, deadline: body.deadline,
      pros: body.pros || [], cons: body.cons || [], score: scored.score,
    }).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ...data, scoring: scored });
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
