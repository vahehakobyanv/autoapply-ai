// Auto-award XP for user actions. Call from API routes after successful actions.

const XP_REWARDS: Record<string, number> = {
  application_submitted: 25,
  resume_created: 50,
  cover_letter_generated: 15,
  job_saved: 5,
  interview_practice: 20,
  portfolio_published: 75,
  agent_created: 30,
  cv_imported: 40,
  company_researched: 10,
  rejection_analyzed: 15,
  follow_up_generated: 10,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function awardXP(
  supabase: any,
  userId: string,
  action: keyof typeof XP_REWARDS
) {
  const amount = XP_REWARDS[action];
  if (!amount) return;

  try {
    const { data: gamification } = await supabase
      .from('user_gamification')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!gamification) return;

    const newXp = (gamification.xp || 0) + amount;
    const newLevel = Math.floor(newXp / 200) + 1;

    const today = new Date().toISOString().split('T')[0];
    let streakDays = gamification.streak_days || 0;
    const lastActive = gamification.last_active_date;

    if (lastActive !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      streakDays = lastActive === yesterdayStr ? streakDays + 1 : 1;
    }

    await supabase
      .from('user_gamification')
      .update({
        xp: newXp,
        level: newLevel,
        streak_days: streakDays,
        longest_streak: Math.max(gamification.longest_streak || 0, streakDays),
        last_active_date: today,
      })
      .eq('user_id', userId);
  } catch {
    // Silent fail - gamification should never break core functionality
  }
}
