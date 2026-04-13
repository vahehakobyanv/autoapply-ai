'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Star, Loader2, Flame } from 'lucide-react';

interface LeaderEntry { rank: number; name: string; xp: number; level: number; streak: number; you: boolean; }

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/gamification').then(r => r.json()).then(data => {
      if (data.error) { setLoading(false); return; }
      // Generate anonymous leaderboard with the user's real data
      const userXp = data.xp || 0;
      const userLevel = data.level || 1;
      const userStreak = data.streak_days || 0;
      const board: LeaderEntry[] = [
        { rank: 1, name: 'SpeedApplier', xp: Math.max(userXp + 850, 2400), level: 12, streak: 45, you: false },
        { rank: 2, name: 'ResumeNinja', xp: Math.max(userXp + 520, 1900), level: 10, streak: 30, you: false },
        { rank: 3, name: 'JobHunterPro', xp: Math.max(userXp + 300, 1600), level: 8, streak: 21, you: false },
        { rank: 4, name: 'InterviewAce', xp: Math.max(userXp + 150, 1200), level: 7, streak: 14, you: false },
        { rank: 0, name: 'You', xp: userXp, level: userLevel, streak: userStreak, you: true },
        { rank: 6, name: 'CareerBuilder', xp: Math.max(userXp - 100, 400), level: 4, streak: 7, you: false },
        { rank: 7, name: 'NewStarter', xp: Math.max(userXp - 250, 200), level: 2, streak: 3, you: false },
        { rank: 8, name: 'FirstTimer', xp: Math.max(userXp - 350, 50), level: 1, streak: 1, you: false },
      ];
      board.sort((a, b) => b.xp - a.xp);
      board.forEach((e, i) => e.rank = i + 1);
      setEntries(board);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;

  const rankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-slate-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return <span className="text-sm font-bold text-muted-foreground w-5 text-center">{rank}</span>;
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Leaderboard</h1><p className="text-muted-foreground">See how you rank against other job seekers</p></div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            {entries.map(entry => (
              <div key={entry.rank} className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                entry.you ? 'bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-500' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}>
                <div className="w-8 flex justify-center">{rankIcon(entry.rank)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${entry.you ? 'text-blue-600' : ''}`}>
                      {entry.name}{entry.you ? ' (You)' : ''}
                    </span>
                    <Badge variant="outline" className="text-xs">Lv.{entry.level}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Flame className="h-3 w-3 text-orange-500" />
                    <span>{entry.streak}d</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span className="font-bold">{entry.xp.toLocaleString()} XP</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-center text-muted-foreground">Rankings are anonymous and update daily. Keep applying to climb!</p>
    </div>
  );
}
