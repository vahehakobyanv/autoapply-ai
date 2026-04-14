import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient as createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { data } = await supabase.from('salary_history').select('*').eq('user_id', user.id).order('date', { ascending: true });
    return NextResponse.json(data || []);
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json();

    if (body.action === 'delete') {
      await supabase.from('salary_history').delete().eq('id', body.id).eq('user_id', user.id);
      return NextResponse.json({ success: true });
    }

    const { data, error } = await supabase.from('salary_history').insert({
      user_id: user.id, company: body.company, role: body.role,
      salary: body.salary, currency: body.currency || 'USD',
      date: body.date, type: body.type || 'salary', notes: body.notes || '',
    }).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
