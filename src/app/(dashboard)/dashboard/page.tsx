'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Send, TrendingUp, Users, Zap, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import type { Application, DashboardStats } from '@/types';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentApps, setRecentApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/applications');
      const apps: Application[] = await res.json();

      if (!Array.isArray(apps)) {
        setLoading(false);
        return;
      }

      setRecentApps(apps.slice(0, 5));

      // Calculate stats
      const total = apps.length;
      const interviews = apps.filter((a) => a.status === 'interview').length;
      const offers = apps.filter((a) => a.status === 'offer').length;
      const responseRate = total > 0 ? Math.round(((interviews + offers) / total) * 100) : 0;

      // Weekly activity (last 7 days)
      const now = new Date();
      const weeklyActivity = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now);
        date.setDate(date.getDate() - (6 - i));
        const dateStr = date.toISOString().split('T')[0];
        const count = apps.filter(
          (a) => a.applied_at?.split('T')[0] === dateStr
        ).length;
        return {
          date: date.toLocaleDateString('en', { weekday: 'short' }),
          count,
        };
      });

      const statusBreakdown = {
        saved: apps.filter((a) => a.status === 'saved').length,
        applied: apps.filter((a) => a.status === 'applied').length,
        interview: interviews,
        offer: offers,
        rejected: apps.filter((a) => a.status === 'rejected').length,
      };

      setStats({
        totalApplications: total,
        responseRate,
        interviewCount: interviews,
        weeklyActivity,
        statusBreakdown,
      });
    } catch {
      // Silently fail
    } finally {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Your job application overview</p>
        </div>
        <Link href="/jobs">
          <Button>
            <Zap className="h-4 w-4 mr-2" />
            Apply to 10 Jobs Now
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Applications</p>
                <p className="text-3xl font-bold">{stats?.totalApplications || 0}</p>
              </div>
              <Send className="h-10 w-10 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Response Rate</p>
                <p className="text-3xl font-bold">{stats?.responseRate || 0}%</p>
              </div>
              <TrendingUp className="h-10 w-10 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Interviews</p>
                <p className="text-3xl font-bold">{stats?.interviewCount || 0}</p>
              </div>
              <Users className="h-10 w-10 text-purple-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {stats?.weeklyActivity && stats.weeklyActivity.some((d) => d.count > 0) ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No activity yet. Start applying to see your stats!
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Breakdown + Recent */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats?.statusBreakdown &&
              Object.entries(stats.statusBreakdown).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="capitalize text-sm">{status}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
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
            <CardTitle>Recent Applications</CardTitle>
            <Link href="/tracker">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentApps.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No applications yet
              </p>
            ) : (
              <div className="space-y-3">
                {recentApps.map((app) => (
                  <div key={app.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{app.job?.title || 'Job'}</p>
                      <p className="text-xs text-muted-foreground">{app.job?.company}</p>
                    </div>
                    <Badge variant="outline" className="capitalize text-xs">
                      {app.status}
                    </Badge>
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
