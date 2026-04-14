'use client';

import { useState, useEffect } from 'react';
import { Flame, Zap, Send, Star, Trophy } from 'lucide-react';

interface QuickStats {
  todayApps: number;
  streak: number;
  level: number;
  xp: number;
  totalApps: number;
}

export function QuickStatsBar() {
  const [stats, setStats] = useState<QuickStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [appsRes, gamRes] = await Promise.all([
          fetch('/api/applications').then(r => r.json()),
          fetch('/api/gamification').then(r => r.json()),
        ]);

        const apps = Array.isArray(appsRes) ? appsRes : [];
        const today = new Date().toISOString().split('T')[0];
        const todayApps = apps.filter((a: { applied_at?: string }) => a.applied_at?.startsWith(today)).length;

        setStats({
          todayApps,
          streak: gamRes?.streak_days || 0,
          level: gamRes?.level || 1,
          xp: gamRes?.xp || 0,
          totalApps: apps.length,
        });
      } catch {}
    };
    fetchStats();
  }, []);

  if (!stats) return null;

  return (
    <div className="flex items-center gap-4 text-xs text-muted-foreground bg-white dark:bg-slate-900 border-b px-4 py-1.5 -mx-6 md:-mx-8 -mt-6 md:-mt-8 mb-4">
      <div className="flex items-center gap-1" title="Applied today">
        <Send className="h-3 w-3 text-blue-500" />
        <span className="font-medium text-foreground">{stats.todayApps}</span> today
      </div>
      <div className="flex items-center gap-1" title="Streak">
        <Flame className={`h-3 w-3 ${stats.streak > 0 ? 'text-orange-500' : 'text-slate-300'}`} />
        <span className="font-medium text-foreground">{stats.streak}</span> streak
      </div>
      <div className="flex items-center gap-1" title="Level">
        <Star className="h-3 w-3 text-yellow-500" />
        Lv.<span className="font-medium text-foreground">{stats.level}</span>
      </div>
      <div className="flex items-center gap-1" title="XP">
        <Zap className="h-3 w-3 text-purple-500" />
        <span className="font-medium text-foreground">{stats.xp}</span> XP
      </div>
      <div className="flex items-center gap-1 ml-auto" title="Total applications">
        <Trophy className="h-3 w-3 text-green-500" />
        <span className="font-medium text-foreground">{stats.totalApps}</span> total
      </div>
    </div>
  );
}
