import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient as createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { data } = await supabase.from('contacts').select('*').eq('user_id', user.id).order('updated_at', { ascending: false });
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
      await supabase.from('contacts').delete().eq('id', body.id).eq('user_id', user.id);
      return NextResponse.json({ success: true });
    }

    const { data, error } = await supabase.from('contacts').upsert({
      id: body.id || undefined, user_id: user.id, name: body.name, email: body.email || '',
      company: body.company || '', role: body.role || '', linkedin_url: body.linkedin_url,
      phone: body.phone, notes: body.notes || '', tags: body.tags || [],
      last_contacted: body.last_contacted, next_follow_up: body.next_follow_up, source: body.source || 'other',
    }).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
