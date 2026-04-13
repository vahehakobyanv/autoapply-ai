import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

async function sendTelegramNotification(chatId: string, message: string): Promise<boolean> {
  if (!BOT_TOKEN || !chatId) return false;

  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Send notification to a user (looks up their telegram_chat_id automatically)
export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { type, userId, data } = await request.json();

  // Look up user's telegram chat ID
  let chatId = data?.telegramChatId;
  if (!chatId && userId) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('telegram_chat_id')
      .eq('user_id', userId)
      .single();
    chatId = profile?.telegram_chat_id;
  }

  let message = '';
  let emoji = '';

  switch (type) {
    case 'application_sent':
      emoji = '📨';
      message = `${emoji} <b>Application Sent!</b>\n\nPosition: <b>${data.title}</b>\nCompany: ${data.company}`;
      break;
    case 'new_job_found':
      emoji = '🔍';
      message = `${emoji} <b>New Job Found!</b>\n\nPosition: <b>${data.title}</b>\nCompany: ${data.company}${data.url ? '\n\n🔗 ' + data.url : ''}`;
      break;
    case 'interview_reminder':
      emoji = '📅';
      message = `${emoji} <b>Interview Reminder!</b>\n\nPosition: <b>${data.title}</b>\nCompany: ${data.company}\nDate: ${data.date}`;
      break;
    case 'status_update':
      emoji = '📊';
      message = `${emoji} <b>Status Update</b>\n\n<b>${data.title}</b> at ${data.company}\nNew status: ${data.status}`;
      break;
    default:
      return NextResponse.json({ error: 'Invalid notification type' }, { status: 400 });
  }

  let sent = false;
  if (chatId) {
    sent = await sendTelegramNotification(chatId, message);
  }

  return NextResponse.json({ success: true, telegramSent: sent });
}
