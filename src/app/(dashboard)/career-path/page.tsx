'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Compass, Loader2, ArrowRight, Target, BookOpen, Lightbulb, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface CareerPlan {
  current_level: string; target_role: string; estimated_years: number;
  milestones: { title: string; timeframe: string; description: string; skills_to_learn: string[]; actions: string[]; salary_range: string }[];
  recommended_certifications: string[]; recommended_projects: string[]; advice: string;
}

export default function CareerPathPage() {
  const [targetRole, setTargetRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<CareerPlan | null>(null);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/career-path', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_role: targetRole }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPlan(data);
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Career Path Planner</h1><p className="text-muted-foreground">AI maps your career progression with milestones, skills, and salary targets</p></div>

      <Card><CardContent className="pt-6 space-y-4">
        <div>
          <label className="text-sm font-medium">Where do you want to be? (optional)</label>
          <Input value={targetRole} onChange={e => setTargetRole(e.target.value)} placeholder="e.g. Senior Frontend Developer, CTO, Product Manager..." />
          <p className="text-xs text-muted-foreground mt-1">Leave empty and AI will suggest the next logical step based on your profile</p>
        </div>
        <Button onClick={generate} disabled={loading} size="lg">
          {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Compass className="h-4 w-4 mr-2" />}
          Plan My Career Path
        </Button>
      </CardContent></Card>

      {plan && (
        <div className="space-y-4">
          {/* Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-blue-100">Current Level</p>
                <p className="text-xl font-bold">{plan.current_level}</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-purple-100">Target Role</p>
                <p className="text-xl font-bold">{plan.target_role}</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-green-100">Estimated Timeline</p>
                <p className="text-xl font-bold">{plan.estimated_years} years</p>
              </CardContent>
            </Card>
          </div>

          {/* Milestones */}
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Target className="h-5 w-5 text-blue-500" />Career Milestones</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-6">
                {plan.milestones?.map((m, i) => (
                  <div key={i} className="relative pl-8">
                    <div className="absolute left-0 top-0 h-full w-px bg-blue-200 dark:bg-blue-800" />
                    <div className="absolute left-[-4px] top-1 h-3 w-3 rounded-full bg-blue-500 border-2 border-white dark:border-slate-900" />
                    <div className="border rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{m.title}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{m.timeframe}</Badge>
                          <Badge className="bg-green-100 text-green-700 text-xs"><DollarSign className="h-3 w-3 mr-0.5" />{m.salary_range}</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{m.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs font-medium mb-1">Skills to Learn:</p>
                          <div className="flex flex-wrap gap-1">{m.skills_to_learn?.map((s, j) => <Badge key={j} variant="secondary" className="text-xs">{s}</Badge>)}</div>
                        </div>
                        <div>
                          <p className="text-xs font-medium mb-1">Actions:</p>
                          {m.actions?.map((a, j) => <p key={j} className="text-xs text-muted-foreground flex gap-1"><ArrowRight className="h-3 w-3 shrink-0 mt-0.5 text-blue-500" />{a}</p>)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Certs & Projects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plan.recommended_certifications?.length > 0 && (
              <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><BookOpen className="h-4 w-4 text-purple-500" />Recommended Certifications</CardTitle></CardHeader>
                <CardContent>{plan.recommended_certifications.map((c, i) => <p key={i} className="text-sm flex items-center gap-2 mb-1"><Badge variant="outline" className="text-xs">{i+1}</Badge>{c}</p>)}</CardContent>
              </Card>
            )}
            {plan.recommended_projects?.length > 0 && (
              <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><Lightbulb className="h-4 w-4 text-yellow-500" />Recommended Projects</CardTitle></CardHeader>
                <CardContent>{plan.recommended_projects.map((p, i) => <p key={i} className="text-sm flex items-center gap-2 mb-1"><Badge variant="outline" className="text-xs">{i+1}</Badge>{p}</p>)}</CardContent>
              </Card>
            )}
          </div>

          {/* Advice */}
          {plan.advice && (
            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-6"><p className="text-sm"><Lightbulb className="h-4 w-4 inline mr-2 text-blue-500" />{plan.advice}</p></CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
