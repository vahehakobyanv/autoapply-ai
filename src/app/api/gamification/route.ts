import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient as createClient } from '@/lib/supabase/server';

const ACHIEVEMENTS = [
  { id: 'first_apply', name: 'First Steps', description: 'Submit your first application', icon: '🚀', xp: 50, condition: 'applications >= 1' },
  { id: 'apply_10', name: 'Getting Serious', description: 'Submit 10 applications', icon: '💪', xp: 100, condition: 'applications >= 10' },
  { id: 'apply_50', name: 'Job Hunter', description: 'Submit 50 applications', icon: '🎯', xp: 250, condition: 'applications >= 50' },
  { id: 'apply_100', name: 'Application Machine', description: 'Submit 100 applications', icon: '🏆', xp: 500, condition: 'applications >= 100' },
  { id: 'first_interview', name: 'Phone Ringing', description: 'Get your first interview', icon: '📞', xp: 150, condition: 'interviews >= 1' },
  { id: 'first_offer', name: 'Winner', description: 'Receive your first offer', icon: '🎉', xp: 500, condition: 'offers >= 1' },
  { id: 'streak_3', name: 'Consistent', description: '3-day application streak', icon: '🔥', xp: 75, condition: 'streak >= 3' },
  { id: 'streak_7', name: 'On Fire', description: '7-day application streak', icon: '🔥🔥', xp: 200, condition: 'streak >= 7' },
  { id: 'streak_30', name: 'Unstoppable', description: '30-day application streak', icon: '⚡', xp: 1000, condition: 'streak >= 30' },
  { id: 'resume_created', name: 'Resume Ready', description: 'Create your first AI resume', icon: '📄', xp: 75, condition: 'resumes >= 1' },
  { id: 'portfolio_live', name: 'Online Presence', description: 'Publish your portfolio', icon: '🌐', xp: 150, condition: 'portfolio_published' },
  { id: 'agent_created', name: 'Automated', description: 'Create a job search agent', icon: '🤖', xp: 100, condition: 'agents >= 1' },
];

const XP_PER_LEVEL = 200;

function calculateLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: gamification } = await supabase
      .from('user_gamification')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!gamification) {
      // Create if doesn't exist
      const { data: newG } = await supabase
        .from('user_gamification')
        .insert({ user_id: user.id })
        .select()
        .single();

      return NextResponse.json({
        ...newG,
        all_achievements: ACHIEVEMENTS,
        xp_for_next_level: XP_PER_LEVEL,
      });
    }

    return NextResponse.json({
      ...gamification,
      all_achievements: ACHIEVEMENTS,
      xp_for_next_level: XP_PER_LEVEL,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch gamification' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { action } = body;

    const { data: gamification } = await supabase
      .from('user_gamification')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!gamification) {
      return NextResponse.json({ error: 'Gamification not found' }, { status: 404 });
    }

    if (action === 'add_xp') {
      const newXp = gamification.xp + (body.amount || 0);
      const newLevel = calculateLevel(newXp);

      const { data } = await supabase
        .from('user_gamification')
        .update({ xp: newXp, level: newLevel })
        .eq('user_id', user.id)
        .select()
        .single();

      return NextResponse.json({ ...data, leveled_up: newLevel > gamification.level });
    }

    if (action === 'update_streak') {
      const today = new Date().toISOString().split('T')[0];
      const lastActive = gamification.last_active_date;

      let streakDays = gamification.streak_days;
      if (lastActive !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (lastActive === yesterdayStr) {
          streakDays += 1;
        } else {
          streakDays = 1;
        }
      }

      const longestStreak = Math.max(gamification.longest_streak, streakDays);

      const { data } = await supabase
        .from('user_gamification')
        .update({
          streak_days: streakDays,
          longest_streak: longestStreak,
          last_active_date: today,
        })
        .eq('user_id', user.id)
        .select()
        .single();

      return NextResponse.json(data);
    }

    if (action === 'check_achievements') {
      // Get user stats
      const [appsRes, resumesRes, agentsRes, portfoliosRes] = await Promise.all([
        supabase.from('applications').select('status').eq('user_id', user.id),
        supabase.from('resumes').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('job_agents').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('portfolios').select('published').eq('user_id', user.id).eq('published', true),
      ]);

      const apps = appsRes.data || [];
      const totalApps = apps.filter((a) => a.status !== 'saved').length;
      const interviews = apps.filter((a) => a.status === 'interview').length;
      const offers = apps.filter((a) => a.status === 'offer').length;

      const stats = {
        applications: totalApps,
        interviews,
        offers,
        streak: gamification.streak_days,
        resumes: resumesRes.count || 0,
        agents: agentsRes.count || 0,
        portfolio_published: (portfoliosRes.data?.length || 0) > 0,
      };

      const currentAchievements = gamification.achievements || [];
      const newAchievements: string[] = [];
      let xpGained = 0;

      for (const achievement of ACHIEVEMENTS) {
        if (currentAchievements.includes(achievement.id)) continue;

        let earned = false;
        if (achievement.condition === 'portfolio_published') {
          earned = stats.portfolio_published;
        } else {
          const match = achievement.condition.match(/(\w+) >= (\d+)/);
          if (match) {
            const key = match[1] as keyof typeof stats;
            const threshold = parseInt(match[2]);
            earned = (stats[key] as number) >= threshold;
          }
        }

        if (earned) {
          newAchievements.push(achievement.id);
          xpGained += achievement.xp;
        }
      }

      if (newAchievements.length > 0) {
        const allAchievements = [...currentAchievements, ...newAchievements];
        const newXp = gamification.xp + xpGained;
        const newLevel = calculateLevel(newXp);

        await supabase
          .from('user_gamification')
          .update({ achievements: allAchievements, xp: newXp, level: newLevel })
          .eq('user_id', user.id);

        return NextResponse.json({
          new_achievements: newAchievements.map((id) => ACHIEVEMENTS.find((a) => a.id === id)),
          xp_gained: xpGained,
          leveled_up: newLevel > gamification.level,
        });
      }

      return NextResponse.json({ new_achievements: [], xp_gained: 0, leveled_up: false });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Failed to process gamification' }, { status: 500 });
  }
}
