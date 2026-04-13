import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Generate a unique link code for connecting Telegram
export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if already connected
  const { data: profile } = await supabase
    .from('profiles')
    .select('telegram_chat_id')
    .eq('user_id', user.id)
    .single();

  if (profile?.telegram_chat_id) {
    return NextResponse.json({ connected: true, chatId: profile.telegram_chat_id });
  }

  // Generate a link code (user_id encoded)
  const linkCode = Buffer.from(user.id).toString('base64url');

  return NextResponse.json({
    connected: false,
    botUsername: 'autoapply_ai_bot',
    linkUrl: `https://t.me/autoapply_ai_bot?start=${linkCode}`,
    linkCode,
  });
}

// Handle saving telegram chat ID after user starts bot
export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { action, chatId } = await request.json();

  if (action === 'connect' && chatId) {
    const { error } = await supabase
      .from('profiles')
      .update({ telegram_chat_id: chatId })
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Send welcome message
    if (BOT_TOKEN) {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: '✅ Connected to AutoApply AI!\n\nYou will receive notifications for:\n• Applications sent\n• New jobs found\n• Interview reminders',
          parse_mode: 'HTML',
        }),
      });
    }

    return NextResponse.json({ success: true });
  }

  if (action === 'disconnect') {
    await supabase
      .from('profiles')
      .update({ telegram_chat_id: null })
      .eq('user_id', user.id);

    return NextResponse.json({ success: true });
  }

  if (action === 'test') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('telegram_chat_id')
      .eq('user_id', user.id)
      .single();

    if (!profile?.telegram_chat_id || !BOT_TOKEN) {
      return NextResponse.json({ error: 'Telegram not connected' }, { status: 400 });
    }

    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: profile.telegram_chat_id,
        text: '🧪 Test notification from AutoApply AI — it works!',
      }),
    });

    const result = await res.json();
    return NextResponse.json({ success: result.ok });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
