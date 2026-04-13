import { NextResponse } from 'next/server';
import { createServerSupabaseClient as createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: analyses } = await supabase.from('rejection_analyses').select('*').eq('user_id', user.id);
    const { data: profile } = await supabase.from('profiles').select('skills').eq('user_id', user.id).single();

    if (!analyses?.length) return NextResponse.json({ gaps: [], user_skills: profile?.skills || [], total_analyses: 0 });

    // Aggregate gaps across all analyses
    const gapMap: Record<string, { count: number; category: string; severity_counts: Record<string, number>; actions: string[] }> = {};

    analyses.forEach(a => {
      const gaps = (a.gaps || []) as { category: string; description: string; severity: string; action: string }[];
      gaps.forEach(gap => {
        const key = gap.description.toLowerCase().slice(0, 60);
        if (!gapMap[key]) gapMap[key] = { count: 0, category: gap.category, severity_counts: {}, actions: [] };
        gapMap[key].count++;
        gapMap[key].severity_counts[gap.severity] = (gapMap[key].severity_counts[gap.severity] || 0) + 1;
        if (gap.action && !gapMap[key].actions.includes(gap.action)) gapMap[key].actions.push(gap.action);
      });
    });

    const gaps = Object.entries(gapMap)
      .map(([description, data]) => ({
        description,
        ...data,
        frequency: Math.round((data.count / analyses.length) * 100),
        top_severity: Object.entries(data.severity_counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'medium',
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    // Aggregate suggestions
    const allSuggestions: Record<string, number> = {};
    analyses.forEach(a => {
      (a.suggestions || []).forEach((s: string) => {
        const key = s.slice(0, 80);
        allSuggestions[key] = (allSuggestions[key] || 0) + 1;
      });
    });
    const top_suggestions = Object.entries(allSuggestions).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([text, count]) => ({ text, count }));

    const avg_match = analyses.length > 0 ? Math.round(analyses.reduce((sum, a) => sum + (a.match_score || 0), 0) / analyses.length) : 0;

    return NextResponse.json({
      gaps,
      top_suggestions,
      user_skills: profile?.skills || [],
      total_analyses: analyses.length,
      avg_match_score: avg_match,
    });
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
