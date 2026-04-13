import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Admin emails that can access the dashboard
const ADMIN_EMAILS = ['vahehakobyanv@gmail.com'];

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const serviceClient = await createServiceRoleClient();

  // Get total users
  const { count: totalUsers } = await serviceClient
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  // Get users who completed onboarding
  const { count: onboardedUsers } = await serviceClient
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('onboarding_completed', true);

  // Get total applications
  const { count: totalApplications } = await serviceClient
    .from('applications')
    .select('*', { count: 'exact', head: true });

  // Get total resumes
  const { count: totalResumes } = await serviceClient
    .from('resumes')
    .select('*', { count: 'exact', head: true });

  // Get total jobs
  const { count: totalJobs } = await serviceClient
    .from('jobs')
    .select('*', { count: 'exact', head: true });

  // Get pro subscribers
  const { count: proUsers } = await serviceClient
    .from('subscriptions')
    .select('*', { count: 'exact', head: true })
    .eq('plan', 'pro');

  // Get recent signups (last 7 days)
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data: recentProfiles } = await serviceClient
    .from('profiles')
    .select('name, role, location, created_at, onboarding_completed')
    .gte('created_at', weekAgo)
    .order('created_at', { ascending: false })
    .limit(20);

  // Get daily signups for chart (last 14 days)
  const { data: allProfiles } = await serviceClient
    .from('profiles')
    .select('created_at')
    .gte('created_at', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString());

  const dailySignups: Record<string, number> = {};
  for (let i = 13; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    dailySignups[date.toISOString().split('T')[0]] = 0;
  }
  allProfiles?.forEach((p) => {
    const date = p.created_at.split('T')[0];
    if (dailySignups[date] !== undefined) dailySignups[date]++;
  });

  return NextResponse.json({
    stats: {
      totalUsers: totalUsers || 0,
      onboardedUsers: onboardedUsers || 0,
      totalApplications: totalApplications || 0,
      totalResumes: totalResumes || 0,
      totalJobs: totalJobs || 0,
      proUsers: proUsers || 0,
      conversionRate: totalUsers ? Math.round(((proUsers || 0) / totalUsers) * 100) : 0,
      onboardingRate: totalUsers ? Math.round(((onboardedUsers || 0) / totalUsers) * 100) : 0,
    },
    recentSignups: recentProfiles || [],
    dailySignups: Object.entries(dailySignups).map(([date, count]) => ({
      date: new Date(date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      count,
    })),
  });
}
