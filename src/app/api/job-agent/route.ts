import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient as createClient } from '@/lib/supabase/server';
import { searchJobsAI } from '@/lib/ai';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: agents } = await supabase
      .from('job_agents')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    return NextResponse.json(agents || []);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { action } = body;

    if (action === 'create') {
      const { data, error } = await supabase
        .from('job_agents')
        .insert({
          user_id: user.id,
          name: body.name || 'My Agent',
          keywords: body.keywords || [],
          locations: body.locations || [],
          salary_min: body.salary_min,
          salary_max: body.salary_max,
          sources: body.sources || ['hh.ru', 'staff.am'],
          frequency: body.frequency || 'daily',
        })
        .select()
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json(data);
    }

    if (action === 'run') {
      const { agent_id } = body;

      const { data: agent } = await supabase
        .from('job_agents')
        .select('*')
        .eq('id', agent_id)
        .eq('user_id', user.id)
        .single();

      if (!agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 });

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const results = await searchJobsAI(
        agent.keywords,
        agent.locations,
        { role: profile?.role || '', skills: profile?.skills || [] }
      );

      // Save results
      const inserts = results.jobs.map((job) => ({
        agent_id: agent.id,
        user_id: user.id,
        job_title: job.title,
        company: job.company,
        url: job.url,
        salary: job.salary,
        location: job.location,
        match_score: job.match_score,
      }));

      if (inserts.length > 0) {
        await supabase.from('job_agent_results').insert(inserts);
      }

      // Update agent
      await supabase
        .from('job_agents')
        .update({ last_run_at: new Date().toISOString(), results_count: (agent.results_count || 0) + inserts.length })
        .eq('id', agent.id);

      return NextResponse.json({ results: results.jobs, count: inserts.length });
    }

    if (action === 'toggle') {
      const { data, error } = await supabase
        .from('job_agents')
        .update({ active: body.active })
        .eq('id', body.agent_id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json(data);
    }

    if (action === 'results') {
      const { data } = await supabase
        .from('job_agent_results')
        .select('*')
        .eq('agent_id', body.agent_id)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      return NextResponse.json(data || []);
    }

    if (action === 'delete') {
      await supabase.from('job_agents').delete().eq('id', body.agent_id).eq('user_id', user.id);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Failed to process agent request' }, { status: 500 });
  }
}
