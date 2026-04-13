'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Clock, Calendar, Target, Loader2, ArrowRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'];

interface AnalyticsData {
  total: number; response_rate: number; avg_response_days: number; best_day: string;
  conversion: { saved_to_applied: number; applied_to_interview: number; interview_to_offer: number };
  by_source: { source: string; total: number; interviews: number; offers: number }[];
  by_month: { month: string; count: number }[];
  response_time_buckets: { label: string; count: number }[];
  interviews: number; offers: number;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetch('/api/analytics').then(r => r.json()).then(d => { if (!d.error) setData(d); }).finally(() => setLoading(false)); }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  if (!data || data.total === 0) return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Advanced Analytics</h1><p className="text-muted-foreground">Deep insights into your job search performance</p></div>
      <Card><CardContent className="py-16 text-center"><Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" /><h3 className="font-semibold mb-1">No data yet</h3><p className="text-sm text-muted-foreground mb-4">Start applying to jobs to see your analytics</p><Link href="/jobs"><Button>Start Applying <ArrowRight className="h-4 w-4 ml-2" /></Button></Link></CardContent></Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Advanced Analytics</h1><p className="text-muted-foreground">Deep insights into your job search performance</p></div>
        <a href="/api/export"><Button variant="outline"><Download className="h-4 w-4 mr-2" />Export CSV</Button></a>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="pt-6 text-center">
            <TrendingUp className="h-6 w-6 mx-auto mb-1 opacity-50" />
            <AnimatedCounter value={data.response_rate} suffix="%" className="text-3xl font-bold" />
            <p className="text-sm text-blue-100">Response Rate</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-violet-600 text-white border-0">
          <CardContent className="pt-6 text-center">
            <Clock className="h-6 w-6 mx-auto mb-1 opacity-50" />
            <AnimatedCounter value={data.avg_response_days} className="text-3xl font-bold" />
            <p className="text-sm text-purple-100">Avg Response (days)</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
          <CardContent className="pt-6 text-center">
            <Calendar className="h-6 w-6 mx-auto mb-1 opacity-50" />
            <p className="text-3xl font-bold">{data.best_day}</p>
            <p className="text-sm text-green-100">Best Day to Apply</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500 to-amber-600 text-white border-0">
          <CardContent className="pt-6 text-center">
            <Target className="h-6 w-6 mx-auto mb-1 opacity-50" />
            <AnimatedCounter value={data.conversion.interview_to_offer} suffix="%" className="text-3xl font-bold" />
            <p className="text-sm text-orange-100">Interview→Offer</p>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader><CardTitle className="text-base">Conversion Funnel</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {[
              { label: 'Saved→Applied', value: data.conversion.saved_to_applied },
              { label: 'Applied→Interview', value: data.conversion.applied_to_interview },
              { label: 'Interview→Offer', value: data.conversion.interview_to_offer },
            ].map((step, i) => (
              <div key={i} className="flex-1 text-center">
                <div className="h-16 rounded-lg flex items-center justify-center font-bold text-white text-lg" style={{ background: `linear-gradient(135deg, ${COLORS[i]}, ${COLORS[i + 1]})` }}>
                  {step.value}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">{step.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Monthly Trend */}
        <Card>
          <CardHeader><CardTitle className="text-base">Monthly Applications</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data.by_month}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Response Time Distribution */}
        <Card>
          <CardHeader><CardTitle className="text-base">Response Time Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.response_time_buckets}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" fontSize={10} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* By Source */}
        <Card>
          <CardHeader><CardTitle className="text-base">Performance by Source</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.by_source.map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-sm font-medium">{s.source}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span>{s.total} apps</span>
                    <Badge variant="outline" className="text-xs">{s.interviews} interviews</Badge>
                    <Badge className="bg-green-100 text-green-700 text-xs">{s.offers} offers</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Source Pie Chart */}
        <Card>
          <CardHeader><CardTitle className="text-base">Applications by Source</CardTitle></CardHeader>
          <CardContent>
            {data.by_source.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={data.by_source} dataKey="total" nameKey="source" cx="50%" cy="50%" outerRadius={80} label fontSize={11}>
                    {data.by_source.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-center text-sm text-muted-foreground py-8">No source data</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
