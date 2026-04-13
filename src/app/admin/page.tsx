'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Users, FileText, Briefcase, Send, Crown, TrendingUp, Loader2, Zap, Shield } from 'lucide-react';

export default function AdminPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin')
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setData(d);
      })
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  const { stats, recentSignups, dailySignups } = data;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Zap className="h-7 w-7 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">AutoApply AI — Business Metrics</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500' },
            { label: 'Applications', value: stats.totalApplications, icon: Send, color: 'text-green-500' },
            { label: 'Resumes', value: stats.totalResumes, icon: FileText, color: 'text-purple-500' },
            { label: 'Jobs Saved', value: stats.totalJobs, icon: Briefcase, color: 'text-orange-500' },
            { label: 'Pro Users', value: stats.proUsers, icon: Crown, color: 'text-yellow-500' },
            { label: 'Conversion', value: `${stats.conversionRate}%`, icon: TrendingUp, color: 'text-emerald-500' },
            { label: 'Onboarded', value: `${stats.onboardingRate}%`, icon: Users, color: 'text-cyan-500' },
            { label: 'Active Users', value: stats.onboardedUsers, icon: Users, color: 'text-indigo-500' },
          ].map((stat, i) => (
            <Card key={i}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 opacity-20 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Signups Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Signups (Last 14 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailySignups}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Signups */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Signups (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            {recentSignups.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No recent signups</p>
            ) : (
              <div className="space-y-3">
                {recentSignups.map((user: any, i: number) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium text-sm">{user.name || 'New User'}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.role || 'No role'} · {user.location || 'No location'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={user.onboarding_completed ? 'default' : 'secondary'} className="text-xs">
                        {user.onboarding_completed ? 'Onboarded' : 'Pending'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </div>
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
