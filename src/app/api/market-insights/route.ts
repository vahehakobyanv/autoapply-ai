import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getMarketInsights } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { role, location } = await req.json();
    if (!role) return NextResponse.json({ error: 'Role is required' }, { status: 400 });
    const insights = await getMarketInsights(role, location || 'Global');
    return NextResponse.json({ role, location: location || 'Global', ...insights });
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
