import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient as createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const q = req.nextUrl.searchParams.get('q')?.toLowerCase() || '';
    if (!q || q.length < 2) return NextResponse.json({ jobs: [], applications: [], contacts: [], documents: [] });

    const [jobsRes, appsRes, contactsRes, docsRes] = await Promise.all([
      supabase.from('jobs').select('id, title, company, source, url').eq('user_id', user.id).or(`title.ilike.%${q}%,company.ilike.%${q}%`).limit(10),
      supabase.from('applications').select('id, status, applied_at, job:jobs(title, company)').eq('user_id', user.id).limit(20),
      supabase.from('contacts').select('id, name, company, role, email').eq('user_id', user.id).or(`name.ilike.%${q}%,company.ilike.%${q}%,email.ilike.%${q}%`).limit(10),
      supabase.from('documents').select('id, name, type').eq('user_id', user.id).ilike('name', `%${q}%`).limit(10),
    ]);

    // Filter applications client-side (job join makes ilike complex)
    const apps = (appsRes.data || []).filter(a => {
      const job = a.job as Record<string, string> | null;
      return job?.title?.toLowerCase().includes(q) || job?.company?.toLowerCase().includes(q);
    }).slice(0, 10);

    return NextResponse.json({
      jobs: jobsRes.data || [],
      applications: apps,
      contacts: contactsRes.data || [],
      documents: docsRes.data || [],
    });
  } catch { return NextResponse.json({ error: 'Search failed' }, { status: 500 }); }
}
