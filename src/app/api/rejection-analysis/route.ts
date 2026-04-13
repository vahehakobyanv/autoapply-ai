import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyzeRejection } from '@/lib/ai';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data } = await supabase
      .from('rejection_analyses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch analyses' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    let jobTitle = body.job_title || '';
    let jobDescription = body.job_description || '';
    let jobRequirements = body.job_requirements || '';
    let jobId = body.job_id || null;
    let company = body.company || '';

    // If job_id provided, fetch job details
    if (jobId) {
      const { data: job } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (job) {
        jobTitle = job.title;
        jobDescription = job.description;
        jobRequirements = job.requirements;
        company = job.company;
      }
    }

    const analysis = await analyzeRejection(
      profile,
      jobTitle,
      jobDescription,
      jobRequirements
    );

    const { data, error } = await supabase
      .from('rejection_analyses')
      .insert({
        user_id: user.id,
        job_id: jobId,
        job_title: jobTitle,
        company,
        match_score: analysis.match_score,
        gaps: analysis.gaps,
        suggestions: analysis.suggestions,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to analyze' }, { status: 500 });
  }
}
