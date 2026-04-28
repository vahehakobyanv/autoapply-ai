// Auto-upgrade admin users to Pro plan in the database.
// Called automatically on every authenticated request via middleware-like pattern.
// Idempotent — safe to call multiple times.

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { isAdminEmail } from '@/lib/admin';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!isAdminEmail(user.email)) {
      return NextResponse.json({ admin: false });
    }

    // Upsert subscription as Pro for admin
    const { data: existing } = await supabase
      .from('subscriptions')
      .select('plan')
      .eq('user_id', user.id)
      .single();

    if (existing?.plan !== 'pro') {
      await supabase
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          plan: 'pro',
          status: 'active',
          current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        }, { onConflict: 'user_id' });
    }

    return NextResponse.json({ admin: true, upgraded: existing?.plan !== 'pro' });
  } catch {
    return NextResponse.json({ error: 'Failed to sync admin' }, { status: 500 });
  }
}
