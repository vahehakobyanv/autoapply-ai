import { createServerSupabaseClient } from '@/lib/supabase/server';
import { generateCoverLetter } from '@/lib/ai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { jobDescription, language = 'en' } = await request.json();

  if (!jobDescription) {
    return NextResponse.json({ error: 'Job description required' }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 400 });
  }

  try {
    const coverLetter = await generateCoverLetter(
      {
        name: profile.name,
        role: profile.role,
        skills: profile.skills,
        experience: profile.experience,
      },
      jobDescription,
      language
    );

    return NextResponse.json({ coverLetter });
  } catch {
    return NextResponse.json({ error: 'Failed to generate cover letter' }, { status: 500 });
  }
}
