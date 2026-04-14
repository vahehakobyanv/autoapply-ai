import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient as createClient, createServiceRoleClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { action } = await req.json();

    if (action === 'export_data') {
      const [profile, apps, jobs, resumes, contacts, documents] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', user.id).single(),
        supabase.from('applications').select('*, job:jobs(*)').eq('user_id', user.id),
        supabase.from('jobs').select('*').eq('user_id', user.id),
        supabase.from('resumes').select('*').eq('user_id', user.id),
        supabase.from('contacts').select('*').eq('user_id', user.id),
        supabase.from('documents').select('*').eq('user_id', user.id),
      ]);

      return NextResponse.json({
        exported_at: new Date().toISOString(),
        profile: profile.data,
        applications: apps.data || [],
        jobs: jobs.data || [],
        resumes: resumes.data || [],
        contacts: contacts.data || [],
        documents: documents.data || [],
      });
    }

    if (action === 'delete_account') {
      // Delete all user data
      const tables = ['applications', 'jobs', 'resumes', 'contacts', 'documents', 'portfolios', 'job_agents', 'rejection_analyses', 'user_gamification', 'subscriptions', 'profiles'];
      for (const table of tables) {
        await supabase.from(table).delete().eq('user_id', user.id);
      }

      // Delete auth user via service role
      const serviceClient = await createServiceRoleClient();
      await serviceClient.auth.admin.deleteUser(user.id);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
