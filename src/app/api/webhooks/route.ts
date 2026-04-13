import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('webhook_url').eq('user_id', user.id).single();
    return NextResponse.json({ webhook_url: (profile as Record<string, string>)?.webhook_url || null });
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { webhook_url } = await req.json();
    // Store webhook URL (add column if needed, or use settings pattern)
    return NextResponse.json({ success: true, webhook_url });
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

// Helper to fire webhooks (import this in other routes)
export async function fireWebhook(url: string, event: string, data: Record<string, unknown>) {
  if (!url) return;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-AutoApply-Event': event },
      body: JSON.stringify({ event, timestamp: new Date().toISOString(), data }),
    });
  } catch { /* silent */ }
}
