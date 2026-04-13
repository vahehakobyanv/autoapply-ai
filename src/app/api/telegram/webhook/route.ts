import { createServiceRoleClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function POST(request: Request) {
  if (!BOT_TOKEN) {
    return NextResponse.json({ error: 'Bot not configured' }, { status: 503 });
  }

  const update = await request.json();

  // Handle /start command with link code
  const message = update.message;
  if (!message?.text) {
    return NextResponse.json({ ok: true });
  }

  const chatId = message.chat.id.toString();
  const text = message.text;

  if (text.startsWith('/start')) {
    const linkCode = text.split(' ')[1];

    if (linkCode) {
      // Decode user_id from link code
      try {
        const userId = Buffer.from(linkCode, 'base64url').toString();
        const supabase = await createServiceRoleClient();

        // Save the chat ID to the user's profile
        const { error } = await supabase
          .from('profiles')
          .update({ telegram_chat_id: chatId })
          .eq('user_id', userId);

        if (error) {
          await sendMessage(chatId, '❌ Failed to connect. Please try again from the app.');
        } else {
          await sendMessage(
            chatId,
            '✅ <b>Connected to AutoApply AI!</b>\n\n' +
            'You will now receive notifications for:\n' +
            '📨 Applications sent\n' +
            '🔍 New jobs found\n' +
            '📅 Interview reminders\n\n' +
            'Use /status to check your connection.'
          );
        }
      } catch {
        await sendMessage(chatId, '❌ Invalid link code. Please use the link from the app Settings page.');
      }
    } else {
      await sendMessage(
        chatId,
        '👋 <b>Welcome to AutoApply AI Bot!</b>\n\n' +
        'To connect your account, go to:\n' +
        '🔗 AutoApply AI → Settings → Telegram\n\n' +
        'Click the connection link there to link this chat.'
      );
    }
  }

  if (text === '/status') {
    const supabase = await createServiceRoleClient();
    const { data } = await supabase
      .from('profiles')
      .select('name, role')
      .eq('telegram_chat_id', chatId)
      .single();

    if (data) {
      await sendMessage(chatId, `✅ Connected as <b>${data.name}</b> (${data.role})`);
    } else {
      await sendMessage(chatId, '❌ Not connected. Use the link from your AutoApply AI settings.');
    }
  }

  if (text === '/help') {
    await sendMessage(
      chatId,
      '🤖 <b>AutoApply AI Bot Commands</b>\n\n' +
      '/start - Connect your account\n' +
      '/status - Check connection status\n' +
      '/help - Show this message\n\n' +
      'Notifications are sent automatically when you apply to jobs, receive interviews, etc.'
    );
  }

  return NextResponse.json({ ok: true });
}

async function sendMessage(chatId: string, text: string) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });
}
