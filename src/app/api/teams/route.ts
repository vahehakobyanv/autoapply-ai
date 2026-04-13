import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient as createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Get teams the user belongs to
    const { data: memberships } = await supabase
      .from('team_members')
      .select('team_id, role')
      .eq('user_id', user.id);

    if (!memberships?.length) return NextResponse.json([]);

    const teamIds = memberships.map((m) => m.team_id);
    const { data: teams } = await supabase
      .from('teams')
      .select('*')
      .in('id', teamIds);

    // Attach role and member count
    const result = await Promise.all(
      (teams || []).map(async (team) => {
        const { count } = await supabase
          .from('team_members')
          .select('*', { count: 'exact', head: true })
          .eq('team_id', team.id);

        const membership = memberships.find((m) => m.team_id === team.id);
        return { ...team, role: membership?.role, member_count: count || 0 };
      })
    );

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
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
      const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');

      const { data: team, error } = await supabase
        .from('teams')
        .insert({
          name: body.name,
          slug,
          owner_id: user.id,
        })
        .select()
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });

      // Add owner as member
      await supabase.from('team_members').insert({
        team_id: team.id,
        user_id: user.id,
        role: 'owner',
      });

      return NextResponse.json(team);
    }

    if (action === 'invite') {
      const { team_id, email, role } = body;

      const { data, error } = await supabase
        .from('team_invites')
        .insert({
          team_id,
          email,
          role: role || 'member',
        })
        .select()
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json(data);
    }

    if (action === 'members') {
      const { data } = await supabase
        .from('team_members')
        .select('*, profile:profiles(*)')
        .eq('team_id', body.team_id);

      return NextResponse.json(data || []);
    }

    if (action === 'remove_member') {
      await supabase
        .from('team_members')
        .delete()
        .eq('team_id', body.team_id)
        .eq('user_id', body.user_id);

      return NextResponse.json({ success: true });
    }

    if (action === 'dashboard') {
      // Get team member stats
      const { data: members } = await supabase
        .from('team_members')
        .select('user_id')
        .eq('team_id', body.team_id);

      const userIds = members?.map((m) => m.user_id) || [];

      const { data: apps } = await supabase
        .from('applications')
        .select('user_id, status')
        .in('user_id', userIds);

      const stats = userIds.map((uid) => {
        const userApps = apps?.filter((a) => a.user_id === uid) || [];
        return {
          user_id: uid,
          total: userApps.length,
          applied: userApps.filter((a) => a.status === 'applied').length,
          interviews: userApps.filter((a) => a.status === 'interview').length,
          offers: userApps.filter((a) => a.status === 'offer').length,
        };
      });

      return NextResponse.json(stats);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Failed to process team request' }, { status: 500 });
  }
}
