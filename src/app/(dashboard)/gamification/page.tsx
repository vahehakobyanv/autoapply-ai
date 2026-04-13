'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Trophy, Flame, Star, Zap, Loader2, Lock, CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';

interface GamificationData {
  xp: number;
  level: number;
  streak_days: number;
  longest_streak: number;
  achievements: string[];
  all_achievements: {
    id: string;
    name: string;
    description: string;
    icon: string;
    xp: number;
    condition: string;
  }[];
  xp_for_next_level: number;
}

export default function GamificationPage() {
  const [data, setData] = useState<GamificationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/gamification');
      const json = await res.json();
      if (!json.error) setData(json);
    } catch {} finally {
      setLoading(false);
    }
  };

  const checkAchievements = async () => {
    setChecking(true);
    try {
      // Update streak first
      await fetch('/api/gamification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_streak' }),
      });

      // Then check achievements
      const res = await fetch('/api/gamification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check_achievements' }),
      });
      const result = await res.json();

      if (result.new_achievements?.length > 0) {
        result.new_achievements.forEach((a: { icon: string; name: string; xp: number }) => {
          toast.success(`${a.icon} Achievement Unlocked: ${a.name} (+${a.xp} XP)`);
        });
      } else {
        toast.info('No new achievements yet. Keep going!');
      }

      fetchData();
    } catch {
      toast.error('Failed to check achievements');
    } finally {
      setChecking(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const xpInLevel = data.xp % data.xp_for_next_level;
  const progressPercent = (xpInLevel / data.xp_for_next_level) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Your Progress</h1>
          <p className="text-muted-foreground">Track your job search journey with XP and achievements</p>
        </div>
        <Button onClick={checkAchievements} disabled={checking}>
          {checking ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trophy className="h-4 w-4 mr-2" />}
          Check Achievements
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <p className="text-3xl font-bold">Level {data.level}</p>
            <p className="text-sm text-muted-foreground">{data.xp} total XP</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <Flame className="h-8 w-8 mx-auto mb-2 text-orange-500" />
            <p className="text-3xl font-bold">{data.streak_days}</p>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <Zap className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <p className="text-3xl font-bold">{data.longest_streak}</p>
            <p className="text-sm text-muted-foreground">Best Streak</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <p className="text-3xl font-bold">{data.achievements?.length || 0}</p>
            <p className="text-sm text-muted-foreground">
              / {data.all_achievements?.length || 0} Achievements
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Level {data.level}</span>
            <span className="text-sm text-muted-foreground">
              {xpInLevel} / {data.xp_for_next_level} XP
            </span>
          </div>
          <Progress value={progressPercent} className="h-3" />
          <p className="text-xs text-muted-foreground mt-1">
            {data.xp_for_next_level - xpInLevel} XP to Level {data.level + 1}
          </p>
        </CardContent>
      </Card>

      {/* Achievements Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.all_achievements?.map((achievement) => {
              const unlocked = data.achievements?.includes(achievement.id);
              return (
                <div
                  key={achievement.id}
                  className={`border rounded-lg p-4 transition-all ${
                    unlocked
                      ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 dark:from-yellow-950 dark:to-orange-950 dark:border-yellow-800'
                      : 'opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{achievement.name}</p>
                        {unlocked ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Lock className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">+{achievement.xp} XP</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
