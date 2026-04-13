import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { parseJobDescription, generateCoverLetter } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Support both cookie auth and bearer token
    const authHeader = req.headers.get('authorization');
    let user;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const { data } = await supabase.auth.getUser(token);
      user = data.user;
    } else {
      const { data } = await supabase.auth.getUser();
      user = data.user;
    }

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { action } = body;

    if (action === 'save_job') {
      const { url, title, company, salary } = body;

      let jobData = { title: title || '', company: company || '', description: '', requirements: '', salary, location: '' };

      // If we have a URL but no title, try to parse
      if (url && !title) {
        try {
          const res = await fetch(url);
          const html = await res.text();
          const parsed = await parseJobDescription(html);
          jobData = { ...jobData, ...parsed };
        } catch {
          // Use what we have
        }
      }

      const { data, error } = await supabase
        .from('jobs')
        .insert({
          user_id: user.id,
          title: jobData.title || 'Untitled Job',
          company: jobData.company,
          description: jobData.description,
          requirements: jobData.requirements,
          url: url || '',
          source: url?.includes('hh.ru') ? 'hh.ru' : url?.includes('staff.am') ? 'staff.am' : 'manual',
          salary: jobData.salary,
          location: jobData.location,
        })
        .select()
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json(data);
    }

    if (action === 'quick_apply') {
      const { job_id, url } = body;

      let targetJobId = job_id;

      // If no job_id, save job first
      if (!targetJobId && url) {
        const res = await fetch(url);
        const html = await res.text();
        const parsed = await parseJobDescription(html);

        const { data: job } = await supabase
          .from('jobs')
          .insert({
            user_id: user.id,
            ...parsed,
            url,
            source: url.includes('hh.ru') ? 'hh.ru' : url.includes('staff.am') ? 'staff.am' : 'manual',
          })
          .select()
          .single();

        if (!job) return NextResponse.json({ error: 'Failed to save job' }, { status: 500 });
        targetJobId = job.id;
      }

      // Get profile for cover letter
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const { data: job } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', targetJobId)
        .single();

      let coverLetter = '';
      if (profile && job) {
        coverLetter = await generateCoverLetter(profile, job.description, 'en');
      }

      const { data: app, error } = await supabase
        .from('applications')
        .insert({
          user_id: user.id,
          job_id: targetJobId,
          status: 'applied',
          cover_letter: coverLetter,
        })
        .select()
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json(app);
    }

    if (action === 'get_stats') {
      const { data: apps } = await supabase
        .from('applications')
        .select('status')
        .eq('user_id', user.id);

      return NextResponse.json({
        total: apps?.length || 0,
        applied: apps?.filter((a) => a.status === 'applied').length || 0,
        saved: apps?.filter((a) => a.status === 'saved').length || 0,
        interviews: apps?.filter((a) => a.status === 'interview').length || 0,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Extension request failed' }, { status: 500 });
  }
}
