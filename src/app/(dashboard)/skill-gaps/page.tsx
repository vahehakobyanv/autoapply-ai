'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2, Target, Lightbulb, TrendingUp, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface GapData {
  gaps: { description: string; count: number; category: string; frequency: number; top_severity: string; actions: string[] }[];
  top_suggestions: { text: string; count: number }[];
  user_skills: string[];
  total_analyses: number;
  avg_match_score: number;
}

const severityColors: Record<string, string> = { low: 'bg-yellow-100 text-yellow-700', medium: 'bg-orange-100 text-orange-700', high: 'bg-red-100 text-red-700' };

export default function SkillGapsPage() {
  const [data, setData] = useState<GapData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetch('/api/skill-gaps').then(r => r.json()).then(d => { if (!d.error) setData(d); }).finally(() => setLoading(false)); }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;

  if (!data || data.total_analyses === 0) return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Skill Gap Dashboard</h1><p className="text-muted-foreground">See which skills you're missing across all your applications</p></div>
      <Card><CardContent className="py-16 text-center">
        <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="font-semibold mb-1">No analyses yet</h3>
        <p className="text-sm text-muted-foreground mb-4">Run rejection analyses on jobs to identify your skill gaps</p>
        <Link href="/rejection-analysis"><Button>Analyze a Job <TrendingUp className="h-4 w-4 ml-2" /></Button></Link>
      </CardContent></Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Skill Gap Dashboard</h1><p className="text-muted-foreground">Aggregated insights from {data.total_analyses} job analyses</p></div>

      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={`${data.avg_match_score >= 70 ? 'bg-green-50 dark:bg-green-950/20' : data.avg_match_score >= 50 ? 'bg-yellow-50 dark:bg-yellow-950/20' : 'bg-red-50 dark:bg-red-950/20'}`}>
          <CardContent className="pt-6 text-center">
            <div className={`text-4xl font-bold ${data.avg_match_score >= 70 ? 'text-green-600' : data.avg_match_score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>{data.avg_match_score}%</div>
            <p className="text-sm text-muted-foreground">Average Match Score</p>
          </CardContent>
        </Card>
        <Card><CardContent className="pt-6 text-center">
          <div className="text-4xl font-bold text-blue-600">{data.gaps.length}</div>
          <p className="text-sm text-muted-foreground">Unique Gaps Identified</p>
        </CardContent></Card>
        <Card><CardContent className="pt-6 text-center">
          <div className="text-4xl font-bold text-purple-600">{data.user_skills.length}</div>
          <p className="text-sm text-muted-foreground">Your Current Skills</p>
        </CardContent></Card>
      </div>

      {/* Your Skills */}
      <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />Your Skills</CardTitle></CardHeader>
        <CardContent><div className="flex flex-wrap gap-1.5">{data.user_skills.map((s, i) => <Badge key={i} variant="secondary">{s}</Badge>)}</div></CardContent>
      </Card>

      {/* Gap List */}
      <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-orange-500" />Most Common Gaps</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {data.gaps.map((gap, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge className={severityColors[gap.top_severity] || ''}>{gap.top_severity}</Badge>
                  <Badge variant="outline" className="capitalize">{gap.category}</Badge>
                </div>
                <span className="text-sm font-medium">{gap.frequency}% of jobs</span>
              </div>
              <p className="text-sm mb-2">{gap.description}</p>
              <Progress value={gap.frequency} className="h-1.5 mb-2" />
              {gap.actions.length > 0 && (
                <div className="mt-2">
                  {gap.actions.slice(0, 2).map((action, j) => (
                    <p key={j} className="text-xs text-blue-600 flex items-center gap-1"><TrendingUp className="h-3 w-3" />{action}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Top Suggestions */}
      {data.top_suggestions.length > 0 && (
        <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><Lightbulb className="h-4 w-4 text-yellow-500" />Top Improvement Suggestions</CardTitle></CardHeader>
          <CardContent><ul className="space-y-2">{data.top_suggestions.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm"><span className="text-blue-500 mt-0.5 font-bold">{i + 1}.</span><span>{s.text}</span><Badge variant="outline" className="text-xs ml-auto">{s.count}x</Badge></li>
          ))}</ul></CardContent>
        </Card>
      )}
    </div>
  );
}
