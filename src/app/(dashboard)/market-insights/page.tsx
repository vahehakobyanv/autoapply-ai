'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { TrendingUp, Search, Loader2, DollarSign, Briefcase, MapPin, Lightbulb, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

interface InsightData {
  role: string; location: string; avg_salary: string; demand_level: string;
  top_skills: string[]; trending: boolean; openings_count: number;
  salary_trend: string; competing_roles: string[]; advice: string;
}

const demandColors: Record<string, string> = {
  low: 'bg-red-100 text-red-700', medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-green-100 text-green-700', very_high: 'bg-emerald-100 text-emerald-700',
};

export default function MarketInsightsPage() {
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<InsightData | null>(null);
  const [history, setHistory] = useState<InsightData[]>([]);

  const search = async () => {
    if (!role.trim()) { toast.error('Enter a job role'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/market-insights', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, location }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setInsight(data);
      setHistory(prev => [data, ...prev.filter(h => h.role !== data.role || h.location !== data.location)].slice(0, 10));
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Job Market Insights</h1><p className="text-muted-foreground">Explore salary trends, demand levels, and top skills by role and location</p></div>

      <Card><CardContent className="pt-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={role} onChange={e => setRole(e.target.value)} onKeyDown={e => e.key === 'Enter' && search()} placeholder="Job role (e.g. Frontend Developer)" className="pl-10" />
          </div>
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={location} onChange={e => setLocation(e.target.value)} onKeyDown={e => e.key === 'Enter' && search()} placeholder="Location (e.g. Moscow, Remote)" className="pl-10" />
          </div>
          <Button onClick={search} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            <span className="ml-2">Analyze</span>
          </Button>
        </div>
      </CardContent></Card>

      {insight && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
              <CardContent className="pt-6 text-center">
                <DollarSign className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-2xl font-bold">{insight.avg_salary}</p>
                <p className="text-sm text-green-100">Average Salary</p>
              </CardContent>
            </Card>
            <Card><CardContent className="pt-6 text-center">
              <BarChart3 className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <Badge className={`text-sm ${demandColors[insight.demand_level] || ''}`}>{insight.demand_level.replace('_', ' ')}</Badge>
              <p className="text-sm text-muted-foreground mt-1">Demand Level</p>
            </CardContent></Card>
            <Card><CardContent className="pt-6 text-center">
              <Briefcase className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <p className="text-2xl font-bold">{insight.openings_count?.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Open Positions</p>
            </CardContent></Card>
            <Card><CardContent className="pt-6 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <Badge variant={insight.salary_trend === 'rising' ? 'default' : 'secondary'} className="capitalize">{insight.salary_trend}</Badge>
              <p className="text-sm text-muted-foreground mt-1">Salary Trend</p>
            </CardContent></Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle className="text-base">Top Skills in Demand</CardTitle></CardHeader>
              <CardContent><div className="flex flex-wrap gap-2">{insight.top_skills?.map((s, i) => <Badge key={i} variant="secondary">{s}</Badge>)}</div></CardContent>
            </Card>
            <Card><CardHeader><CardTitle className="text-base">Similar Roles</CardTitle></CardHeader>
              <CardContent><div className="flex flex-wrap gap-2">{insight.competing_roles?.map((r, i) => <Badge key={i} variant="outline">{r}</Badge>)}</div></CardContent>
            </Card>
          </div>

          <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><Lightbulb className="h-4 w-4 text-yellow-500" />Career Advice</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">{insight.advice}</p></CardContent>
          </Card>
        </div>
      )}

      {history.length > 1 && (
        <Card><CardHeader><CardTitle className="text-base">Recent Searches</CardTitle></CardHeader>
          <CardContent><div className="flex flex-wrap gap-2">{history.map((h, i) => (
            <Button key={i} variant="outline" size="sm" onClick={() => setInsight(h)}>{h.role} — {h.location}</Button>
          ))}</div></CardContent>
        </Card>
      )}
    </div>
  );
}
