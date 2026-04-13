import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generatePortfolio } from '@/lib/ai';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch portfolios' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { action } = body;

    if (action === 'generate') {
      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

      const generated = await generatePortfolio(profile);
      const slug = profile.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '') || `portfolio-${Date.now()}`;

      const { data, error } = await supabase
        .from('portfolios')
        .insert({
          user_id: user.id,
          slug,
          title: generated.title,
          bio: generated.bio,
          sections: generated.sections,
          theme: body.theme || 'modern',
        })
        .select()
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json(data);
    }

    // Manual create/update
    const { data, error } = await supabase
      .from('portfolios')
      .upsert({
        id: body.id || undefined,
        user_id: user.id,
        slug: body.slug,
        title: body.title,
        bio: body.bio,
        theme: body.theme || 'modern',
        sections: body.sections || [],
        published: body.published ?? false,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to save portfolio' }, { status: 500 });
  }
}
