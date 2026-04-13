import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient as createClient } from '@/lib/supabase/server';
import { generateCompanyInsights } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { company } = await req.json();
    if (!company?.trim()) {
      return NextResponse.json({ error: 'Company name required' }, { status: 400 });
    }

    // Check cache first
    const { data: cached } = await supabase
      .from('company_insights')
      .select('*')
      .ilike('company_name', company.trim())
      .single();

    if (cached) {
      return NextResponse.json(cached);
    }

    // Generate with AI
    const insights = await generateCompanyInsights(company.trim());

    // Cache the result
    const { data, error } = await supabase
      .from('company_insights')
      .insert({
        company_name: company.trim(),
        ...insights,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ company_name: company.trim(), ...insights });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to get company insights' }, { status: 500 });
  }
}
