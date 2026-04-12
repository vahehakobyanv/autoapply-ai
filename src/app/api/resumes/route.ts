import { createServerSupabaseClient } from '@/lib/supabase/server';
import { generateResume } from '@/lib/ai';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('resumes')
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
  const { language = 'en', template = 'modern', generateWithAI = false } = body;

  let content = body.content || {};

  if (generateWithAI) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found. Complete onboarding first.' }, { status: 400 });
    }

    try {
      const generated = await generateResume(
        {
          name: profile.name,
          role: profile.role,
          skills: profile.skills,
          experience: profile.experience,
          languages: profile.languages,
          location: profile.location,
        },
        language
      );
      content = JSON.parse(generated);
    } catch (err) {
      return NextResponse.json({ error: 'Failed to generate resume' }, { status: 500 });
    }
  }

  const { data, error } = await supabase
    .from('resumes')
    .insert({
      user_id: user.id,
      title: `Resume - ${language.toUpperCase()}`,
      content,
      language,
      template,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { id, ...updates } = body;

  const { data, error } = await supabase
    .from('resumes')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
