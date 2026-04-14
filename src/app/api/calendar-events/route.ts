import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient as createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data } = await supabase.from('calendar_events').select('*').eq('user_id', user.id).order('event_date', { ascending: true });
    return NextResponse.json(data || []);
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();

    if (body.action === 'delete') {
      await supabase.from('calendar_events').delete().eq('id', body.id).eq('user_id', user.id);
      return NextResponse.json({ success: true });
    }

    if (body.action === 'ics') {
      // Generate ICS file content
      const { data: events } = await supabase.from('calendar_events').select('*').eq('user_id', user.id);
      const { data: apps } = await supabase.from('applications').select('*, job:jobs(title, company)').eq('user_id', user.id).eq('status', 'interview');

      let ics = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//AutoApply AI//EN\n';

      (events || []).forEach(e => {
        const dt = (e.event_date as string).replace(/-/g, '').split('T')[0];
        ics += `BEGIN:VEVENT\nDTSTART:${dt}\nSUMMARY:${e.title}\nDESCRIPTION:${e.notes || ''}\nEND:VEVENT\n`;
      });

      (apps || []).forEach(a => {
        const job = a.job as Record<string, string> | null;
        const dt = (a.updated_at as string).replace(/-/g, '').split('T')[0];
        ics += `BEGIN:VEVENT\nDTSTART:${dt}\nSUMMARY:Interview - ${job?.title || 'Job'} at ${job?.company || ''}\nEND:VEVENT\n`;
      });

      ics += 'END:VCALENDAR';
      return new NextResponse(ics, { headers: { 'Content-Type': 'text/calendar', 'Content-Disposition': 'attachment; filename="autoapply-calendar.ics"' } });
    }

    const { data, error } = await supabase.from('calendar_events').insert({
      user_id: user.id, title: body.title, event_date: body.event_date,
      event_type: body.event_type || 'custom', notes: body.notes || '',
      job_id: body.job_id || null,
    }).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
