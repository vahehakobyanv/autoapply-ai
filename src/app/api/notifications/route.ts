import { NextResponse } from 'next/server';

// Notification service - supports email and Telegram
async function sendTelegramNotification(chatId: string, message: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return false;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
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

export async function POST(request: Request) {
  const { type, userId, data } = await request.json();

  let message = '';

  switch (type) {
    case 'application_sent':
      message = `Application sent to <b>${data.company}</b> for <b>${data.title}</b>`;
      break;
    case 'new_job_found':
      message = `New job found: <b>${data.title}</b> at <b>${data.company}</b>`;
      break;
    case 'interview_reminder':
      message = `Interview reminder: <b>${data.title}</b> at <b>${data.company}</b> on ${data.date}`;
      break;
    default:
      return NextResponse.json({ error: 'Invalid notification type' }, { status: 400 });
  }

  // Send via Telegram if configured
  if (data.telegramChatId) {
    await sendTelegramNotification(data.telegramChatId, message);
  }

  return NextResponse.json({ success: true, message });
}
