import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Send welcome message after onboarding completion
export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, role, telegram_chat_id')
    .eq('user_id', user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 400 });
  }

  const results: { telegram?: boolean } = {};

  // Send Telegram welcome if connected
  if (profile.telegram_chat_id && BOT_TOKEN) {
    const telegramMessage =
      `🎉 <b>Welcome to AutoApply AI, ${profile.name}!</b>\n\n` +
      `Your profile is set up as <b>${profile.role}</b>.\n\n` +
      `Here's what you can do now:\n` +
      `📄 Generate an AI resume → /resume\n` +
      `🔍 Search & import jobs → /jobs\n` +
      `✉️ Auto-apply with cover letters\n` +
      `📊 Track everything in the dashboard\n\n` +
      `Let's get you hired! 🚀`;

    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: profile.telegram_chat_id,
        text: telegramMessage,
        parse_mode: 'HTML',
      }),
    });
    results.telegram = res.ok;
  }

  return NextResponse.json({ success: true, ...results });
}
