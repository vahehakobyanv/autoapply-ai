'use client';

import { useState, useEffect } from 'react';
import { Bell, Trophy, Briefcase, Send, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'achievement' | 'job_found' | 'application' | 'xp' | 'streak';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    checkNotifications();
    const interval = setInterval(checkNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const checkNotifications = async () => {
    try {
      // Check gamification for new achievements
      const res = await fetch('/api/gamification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_streak' }),
      });
      const streakData = await res.json();

      const achieveRes = await fetch('/api/gamification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check_achievements' }),
      });
      const achieveData = await achieveRes.json();

      const newNotifs: Notification[] = [];

      if (achieveData.new_achievements?.length > 0) {
        achieveData.new_achievements.forEach((a: { name: string; icon: string; xp: number }) => {
          newNotifs.push({
            id: `achieve-${a.name}-${Date.now()}`,
            type: 'achievement',
            title: `${a.icon} Achievement Unlocked!`,
            message: `${a.name} — +${a.xp} XP`,
            read: false,
            created_at: new Date().toISOString(),
          });
        });
      }

      if (achieveData.xp_gained > 0) {
        newNotifs.push({
          id: `xp-${Date.now()}`,
          type: 'xp',
          title: 'XP Earned!',
          message: `You earned ${achieveData.xp_gained} XP`,
          read: false,
          created_at: new Date().toISOString(),
        });
      }

      if (streakData?.streak_days > 0 && streakData?.last_active_date === new Date().toISOString().split('T')[0]) {
        const existing = notifications.find((n) => n.id.startsWith('streak-'));
        if (!existing) {
          newNotifs.push({
            id: `streak-${Date.now()}`,
            type: 'streak',
            title: 'Streak Active!',
            message: `${streakData.streak_days} day streak`,
            read: false,
            created_at: new Date().toISOString(),
          });
        }
      }

      if (newNotifs.length > 0) {
        setNotifications((prev) => [...newNotifs, ...prev].slice(0, 20));
      }
    } catch {
      // Silent fail
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const iconFor = (type: string) => {
    switch (type) {
      case 'achievement': return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 'job_found': return <Briefcase className="h-4 w-4 text-blue-500" />;
      case 'application': return <Send className="h-4 w-4 text-green-500" />;
      case 'xp': return <Star className="h-4 w-4 text-purple-500" />;
      case 'streak': return <Star className="h-4 w-4 text-orange-500" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => { setOpen(!open); if (!open) markAllRead(); }}
        className="relative flex items-center justify-center h-9 w-9 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full left-0 mb-2 w-72 bg-white dark:bg-slate-900 border rounded-xl shadow-xl z-50 overflow-hidden">
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <h3 className="text-sm font-semibold">Notifications</h3>
              {notifications.length > 0 && (
                <button onClick={markAllRead} className="text-xs text-blue-500 hover:underline">
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No notifications yet
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={cn(
                      'px-4 py-3 border-b last:border-0 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800',
                      !notif.read && 'bg-blue-50/50 dark:bg-blue-950/20'
                    )}
                  >
                    <div className="mt-0.5">{iconFor(notif.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{notif.title}</p>
                      <p className="text-xs text-muted-foreground">{notif.message}</p>
                    </div>
                    <button onClick={() => dismiss(notif.id)} className="text-slate-400 hover:text-slate-600">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
