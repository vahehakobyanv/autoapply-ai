import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateNegotiationStrategy, getMarketInsights } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();

    const market = await getMarketInsights(body.role, body.location || 'Global');
    const strategy = await generateNegotiationStrategy(
      { company: body.company, role: body.role, salary: body.salary, currency: body.currency || 'USD', benefits: body.benefits || [] },
      { avg_salary: market.avg_salary, demand_level: market.demand_level },
      { experience: profile?.experience || '', skills: profile?.skills || [] }
    );

    return NextResponse.json({ ...strategy, market });
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
