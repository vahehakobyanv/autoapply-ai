import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient as createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const appId = req.nextUrl.searchParams.get('application_id');
    let query = supabase.from('interview_notes').select('*').eq('user_id', user.id).order('interview_date', { ascending: false });
    if (appId) query = query.eq('application_id', appId);

    const { data } = await query.limit(50);
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
      await supabase.from('interview_notes').delete().eq('id', body.id).eq('user_id', user.id);
      return NextResponse.json({ success: true });
    }

    const { data, error } = await supabase.from('interview_notes').upsert({
      id: body.id || undefined,
      user_id: user.id,
      application_id: body.application_id || null,
      company: body.company || '',
      role: body.role || '',
      interview_date: body.interview_date,
      interview_type: body.interview_type || 'phone',
      interviewer_name: body.interviewer_name || '',
      questions_asked: body.questions_asked || [],
      my_answers: body.my_answers || '',
      overall_feeling: body.overall_feeling || 'neutral',
      next_steps: body.next_steps || '',
      notes: body.notes || '',
    }).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
