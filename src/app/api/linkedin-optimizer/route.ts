import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient as createClient } from '@/lib/supabase/server';
import { optimizeLinkedInProfile } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    const body = await req.json();
    const result = await optimizeLinkedInProfile({ ...profile, summary: body.current_summary || '' });
    return NextResponse.json(result);
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
