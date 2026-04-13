import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient as createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { data } = await supabase.from('documents').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
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
      await supabase.from('documents').delete().eq('id', body.id).eq('user_id', user.id);
      return NextResponse.json({ success: true });
    }

    const { data, error } = await supabase.from('documents').insert({
      user_id: user.id, name: body.name, type: body.type || 'other',
      file_url: body.file_url || '', file_size: body.file_size || 0,
      job_id: body.job_id, notes: body.notes || '',
    }).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
