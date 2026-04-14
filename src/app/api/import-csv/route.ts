import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient as createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    const text = await file.text();
    const lines = text.split('\n').filter(l => l.trim());
    if (lines.length < 2) return NextResponse.json({ error: 'Empty CSV' }, { status: 400 });

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
    let imported = 0;

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].match(/(".*?"|[^,]+)/g)?.map(v => v.trim().replace(/^"|"$/g, '')) || [];
      const row: Record<string, string> = {};
      headers.forEach((h, j) => { row[h] = values[j] || ''; });

      const title = row['job title'] || row['title'] || row['position'] || '';
      const company = row['company'] || '';
      if (!title) continue;

      // Create job
      const { data: job } = await supabase.from('jobs').insert({
        user_id: user.id, title, company,
        description: row['description'] || '', requirements: row['requirements'] || '',
        url: row['url'] || row['link'] || '', source: 'manual',
        salary: row['salary'] || null, location: row['location'] || null,
      }).select('id').single();

      if (job) {
        const statusMap: Record<string, string> = { applied: 'applied', interview: 'interview', offer: 'offer', rejected: 'rejected', saved: 'saved' };
        const status = statusMap[row['status']?.toLowerCase()] || 'saved';

        await supabase.from('applications').insert({
          user_id: user.id, job_id: job.id, status,
          notes: row['notes'] || '', cover_letter: row['cover letter'] || '',
        });
        imported++;
      }
    }

    return NextResponse.json({ imported, total: lines.length - 1 });
  } catch { return NextResponse.json({ error: 'Import failed' }, { status: 500 }); }
}
