import { createServerSupabaseClient } from '@/lib/supabase/server';
import { HHBot } from '@/lib/bot/hh-bot';
import { StaffAmBot } from '@/lib/bot/staffam-bot';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { applicationId, jobUrl, coverLetter, source } = await request.json();

  if (!jobUrl) {
    return NextResponse.json({ error: 'Job URL required' }, { status: 400 });
  }

  let bot;
  if (source === 'hh.ru' || jobUrl.includes('hh.ru')) {
    bot = new HHBot();
  } else if (source === 'staff.am' || jobUrl.includes('staff.am')) {
    bot = new StaffAmBot();
  } else {
    // Generic fallback
    bot = new HHBot();
  }

  const result = await bot.apply({ jobUrl, coverLetter: coverLetter || '' });

  // Update application status if we have an applicationId
  if (applicationId) {
    await supabase
      .from('applications')
      .update({
        status: result.success ? 'applied' : 'saved',
        notes: result.message,
      })
      .eq('id', applicationId)
      .eq('user_id', user.id);
  }

  if (!result.success) {
    return NextResponse.json({
      ...result,
      fallback: bot.getFallbackInstructions(jobUrl),
    });
  }

  return NextResponse.json(result);
}
