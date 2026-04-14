import { createServerSupabaseClient } from '@/lib/supabase/server';
import { parseJobDescription } from '@/lib/ai';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  // If URL provided, scrape the job
  if (body.url && !body.title) {
    try {
      const response = await fetch(body.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });
      const html = await response.text();
      const parsed = await parseJobDescription(html);

      let source: 'hh.ru' | 'staff.am' | 'manual' = 'manual';
      if (body.url.includes('hh.ru')) source = 'hh.ru';
      else if (body.url.includes('staff.am')) source = 'staff.am';

      const { data, error } = await supabase
        .from('jobs')
        .insert({
          user_id: user.id,
          title: parsed.title || 'Untitled',
          company: parsed.company || '',
          description: parsed.description || '',
          requirements: parsed.requirements || '',
          salary: parsed.salary || null,
          location: parsed.location || null,
          url: body.url,
          source,
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(data);
    } catch (err) {
      return NextResponse.json(
        { error: 'Failed to scrape job. You can add it manually.' },
        { status: 400 }
      );
    }
  }

  // Manual job entry
  const { data, error } = await supabase
    .from('jobs')
    .insert({
      user_id: user.id,
      title: body.title,
      company: body.company || '',
      description: body.description || '',
      requirements: body.requirements || '',
      url: body.url || '',
      source: body.source || 'manual',
      salary: body.salary,
      location: body.location,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// Search jobs (simulated for hh.ru / staff.am)
export async function PUT(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { keyword, source = 'hh.ru' } = await request.json();

  // Build search URL based on source
  let searchUrl = '';
  if (source === 'hh.ru') {
    searchUrl = `https://api.hh.ru/vacancies?text=${encodeURIComponent(keyword)}&per_page=10`;
  } else if (source === 'staff.am') {
    searchUrl = `https://staff.am/en/jobs?search=${encodeURIComponent(keyword)}`;
  }

  try {
    // For hh.ru, use their public API
    if (source === 'hh.ru') {
      const response = await fetch(searchUrl, {
        headers: { 'User-Agent': 'AutoApplyAI/1.0' },
      });
      const data = await response.json();

      const jobs = (data.items || []).slice(0, 10).map((item: any) => ({
        title: item.name,
        company: item.employer?.name || '',
        description: item.snippet?.responsibility || '',
        requirements: item.snippet?.requirement || '',
        url: item.alternate_url,
        source: 'hh.ru',
        salary: item.salary
          ? `${item.salary.from || ''}-${item.salary.to || ''} ${item.salary.currency}`
          : null,
        location: item.area?.name || '',
      }));

      return NextResponse.json(jobs);
    }

    // For staff.am, return placeholder since no public API
    return NextResponse.json([
      {
        title: `${keyword} position`,
        company: 'Company from staff.am',
        description: 'Job found on staff.am — click to view details',
        url: searchUrl,
        source: 'staff.am',
      },
    ]);
  } catch {
    return NextResponse.json({ error: 'Failed to search jobs' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
