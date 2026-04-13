'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { ProgressRing } from '@/components/ui/progress-ring';
import { HeatmapCalendar } from '@/components/ui/heatmap-calendar';
import { OnboardingChecklist } from '@/components/layout/onboarding-checklist';
import { SmartReminders } from '@/components/layout/smart-reminders';
import { ShareCard } from '@/components/layout/share-card';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  FunnelChart, Funnel, LabelList, Cell,
} from 'recharts';
import { Send, TrendingUp, Users, Zap, ArrowRight, Loader2, Target, Flame } from 'lucide-react';
import Link from 'next/link';
import type { Application, DashboardStats } from '@/types';

const FUNNEL_COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentApps, setRecentApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [heatmapData, setHeatmapData] = useState<Record<string, number>>({});
  const [gamification, setGamification] = useState<{ xp: number; level: number; streak_days: number } | null>(null);

  useEffect(() => {
    fetchData();
    fetchGamification();
  }, []);

  const fetchGamification = async () => {
    try {
      const res = await fetch('/api/gamification');
      const data = await res.json();
      if (!data.error) setGamification(data);
    } catch {}
  };

  const fetchData = async () => {
    try {
      const res = await fetch('/api/applications');
      const apps: Application[] = await res.json();

      if (!Array.isArray(apps)) { setLoading(false); return; }

      setRecentApps(apps.slice(0, 5));

      // Build heatmap data
      const heatmap: Record<string, number> = {};
      apps.forEach((a) => {
        const date = a.applied_at?.split('T')[0];
        if (date) heatmap[date] = (heatmap[date] || 0) + 1;
      });
      setHeatmapData(heatmap);

      const total = apps.length;
      const interviews = apps.filter((a) => a.status === 'interview').length;
      const offers = apps.filter((a) => a.status === 'offer').length;
      const responseRate = total > 0 ? Math.round(((interviews + offers) / total) * 100) : 0;

      const now = new Date();
      const weeklyActivity = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now);
        date.setDate(date.getDate() - (6 - i));
        const dateStr = date.toISOString().split('T')[0];
        const count = apps.filter((a) => a.applied_at?.split('T')[0] === dateStr).length;
        return { date: date.toLocaleDateString('en', { weekday: 'short' }), count };
      });

      const statusBreakdown = {
        saved: apps.filter((a) => a.status === 'saved').length,
        applied: apps.filter((a) => a.status === 'applied').length,
        interview: interviews,
        offer: offers,
        rejected: apps.filter((a) => a.status === 'rejected').length,
      };

      setStats({ totalApplications: total, responseRate, interviewCount: interviews, weeklyActivity, statusBreakdown });
    } catch {} finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const funnelData = stats ? [
    { name: 'Saved', value: stats.statusBreakdown.saved, fill: FUNNEL_COLORS[0] },
    { name: 'Applied', value: stats.statusBreakdown.applied, fill: FUNNEL_COLORS[1] },
    { name: 'Interview', value: stats.statusBreakdown.interview, fill: FUNNEL_COLORS[2] },
    { name: 'Offer', value: stats.statusBreakdown.offer, fill: FUNNEL_COLORS[3] },
  ].filter((d) => d.value > 0) : [];

  const monthlyGoal = 20;
  const thisMonthApps = stats?.totalApplications || 0;

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Your job application overview</p>
        </div>
        <div className="flex items-center gap-2">
          <ShareCard />
          <Link href="/jobs">
            <Button>
              <Zap className="h-4 w-4 mr-2" />
              Apply to Jobs
            </Button>
          </Link>
        </div>
      </div>

      {/* Onboarding Checklist */}
      <OnboardingChecklist />

      {/* Smart Reminders */}
      <SmartReminders />

      {/* Stats Cards with gradients and animated counters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-100">Total Applications</p>
                <AnimatedCounter value={stats?.totalApplications || 0} className="text-3xl font-bold" />
              </div>
              <Send className="h-10 w-10 opacity-30" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-100">Response Rate</p>
                <AnimatedCounter value={stats?.responseRate || 0} suffix="%" className="text-3xl font-bold" />
              </div>
              <TrendingUp className="h-10 w-10 opacity-30" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-violet-600 text-white border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-100">Interviews</p>
                <AnimatedCounter value={stats?.interviewCount || 0} className="text-3xl font-bold" />
              </div>
              <Users className="h-10 w-10 opacity-30" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-amber-600 text-white border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-100">Streak</p>
                <div className="flex items-center gap-2">
                  <AnimatedCounter value={gamification?.streak_days || 0} className="text-3xl font-bold" />
                  <span className="text-sm text-orange-100">days</span>
                </div>
              </div>
              <Flame className="h-10 w-10 opacity-30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Ring + Funnel + Weekly Chart */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Monthly Goal */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Monthly Goal</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ProgressRing
              value={Math.min(thisMonthApps, monthlyGoal)}
              max={monthlyGoal}
              label={`of ${monthlyGoal}`}
              sublabel="applications"
              color={thisMonthApps >= monthlyGoal ? '#10b981' : '#3b82f6'}
            />
          </CardContent>
        </Card>

        {/* Application Funnel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Application Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            {funnelData.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <FunnelChart>
                  <Tooltip />
                  <Funnel dataKey="value" data={funnelData} isAnimationActive>
                    <LabelList position="right" fill="#000" stroke="none" dataKey="name" fontSize={12} />
                    {funnelData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8 text-sm text-muted-foreground">
                No data yet. Start applying!
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.weeklyActivity && stats.weeklyActivity.some((d) => d.count > 0) ? (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={stats.weeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={11} />
                  <YAxis allowDecimals={false} fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8 text-sm text-muted-foreground">
                No activity this week
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Heatmap Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Activity Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <HeatmapCalendar data={heatmapData} weeks={20} />
        </CardContent>
      </Card>

      {/* Status Breakdown + Recent */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats?.statusBreakdown &&
              Object.entries(stats.statusBreakdown).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="capitalize text-sm">{status}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                        style={{
                          width: `${stats.totalApplications > 0 ? (count / stats.totalApplications) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Applications</CardTitle>
            <Link href="/tracker">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentApps.length === 0 ? (
              <div className="text-center py-8">
                <Target className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">No applications yet</p>
                <Link href="/jobs">
                  <Button variant="link" size="sm" className="mt-1">Start applying</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentApps.map((app) => (
                  <div key={app.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{app.job?.title || 'Job'}</p>
                      <p className="text-xs text-muted-foreground">{app.job?.company}</p>
                    </div>
                    <Badge variant="outline" className="capitalize text-xs">{app.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
