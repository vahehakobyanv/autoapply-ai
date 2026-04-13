import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const reminders: { type: string; title: string; message: string; action_url: string; priority: string }[] = [];

    // Get applications
    const { data: apps } = await supabase.from('applications').select('*, job:jobs(title, company)').eq('user_id', user.id);
    const { data: gamification } = await supabase.from('user_gamification').select('*').eq('user_id', user.id).single();
    const { data: contacts } = await supabase.from('contacts').select('*').eq('user_id', user.id);
    const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();

    const now = new Date();
    const dayMs = 86400000;

    // Follow-up reminders (applied 5+ days ago, no status change)
    (apps || []).filter(a => a.status === 'applied').forEach(a => {
      const daysSince = Math.floor((now.getTime() - new Date(a.applied_at).getTime()) / dayMs);
      const job = a.job as Record<string, string> | null;
      if (daysSince >= 5 && daysSince <= 14) {
        reminders.push({
          type: 'follow_up', priority: daysSince >= 10 ? 'high' : 'medium',
          title: `Follow up with ${job?.company || 'company'}`,
          message: `You applied to ${job?.title || 'a job'} ${daysSince} days ago. Consider sending a follow-up.`,
          action_url: '/follow-up',
        });
      }
    });

    // Streak at risk
    if (gamification) {
      const lastActive = gamification.last_active_date;
      const today = now.toISOString().split('T')[0];
      if (lastActive !== today && gamification.streak_days > 0) {
        reminders.push({
          type: 'streak', priority: 'high',
          title: `${gamification.streak_days}-day streak at risk!`,
          message: 'Apply to at least one job today to keep your streak alive.',
          action_url: '/jobs',
        });
      }
    }

    // Inactive reminder
    const recentApps = (apps || []).filter(a => {
      const daysSince = Math.floor((now.getTime() - new Date(a.applied_at).getTime()) / dayMs);
      return daysSince <= 3;
    });
    if (recentApps.length === 0 && (apps || []).length > 0) {
      reminders.push({
        type: 'inactive', priority: 'medium',
        title: "You haven't applied recently",
        message: 'Consistency is key! Try to apply to at least a few jobs this week.',
        action_url: '/jobs',
      });
    }

    // Contact follow-up reminders
    (contacts || []).forEach(c => {
      if (c.next_follow_up) {
        const followUpDate = new Date(c.next_follow_up);
        const daysUntil = Math.floor((followUpDate.getTime() - now.getTime()) / dayMs);
        if (daysUntil <= 1 && daysUntil >= -3) {
          reminders.push({
            type: 'contact', priority: daysUntil < 0 ? 'high' : 'medium',
            title: `Follow up with ${c.name}`,
            message: `${c.role} at ${c.company}${daysUntil < 0 ? ' — overdue!' : daysUntil === 0 ? ' — today!' : ' — tomorrow'}`,
            action_url: '/contacts',
          });
        }
      }
    });

    // Profile incomplete
    if (profile && (!profile.name || !profile.role || !profile.skills?.length)) {
      reminders.push({
        type: 'profile', priority: 'low',
        title: 'Complete your profile',
        message: 'A complete profile improves AI-generated resumes and cover letters.',
        action_url: '/settings',
      });
    }

    // Sort by priority
    const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
    reminders.sort((a, b) => (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2));

    return NextResponse.json(reminders);
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
