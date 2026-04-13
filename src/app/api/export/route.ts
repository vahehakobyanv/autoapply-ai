import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: apps } = await supabase.from('applications').select('*, job:jobs(*)').eq('user_id', user.id).order('applied_at', { ascending: false });

    if (!apps?.length) return NextResponse.json({ error: 'No data to export' }, { status: 404 });

    const headers = ['Date', 'Job Title', 'Company', 'Status', 'Source', 'Salary', 'Location', 'URL'];
    const rows = apps.map((a) => {
      const j = a.job as Record<string, string> | null;
      return [
        a.applied_at?.split('T')[0] || '', j?.title || '', j?.company || '',
        a.status, j?.source || '', j?.salary || '', j?.location || '', j?.url || '',
      ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');
    return new NextResponse(csv, {
      headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="applications.csv"' },
    });
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
