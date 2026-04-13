'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Link2, Loader2, Sparkles, CheckCircle, XCircle, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface OptResult {
  headline: string; about: string; skills_to_add: string[];
  skills_to_remove: string[]; tips: string[]; score: number;
}

export default function LinkedInOptimizerPage() {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OptResult | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const optimize = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/linkedin-optimizer', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_summary: summary }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Failed'); }
    finally { setLoading(false); }
  };

  const copy = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(field);
    toast.success('Copied!');
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">LinkedIn Profile Optimizer</h1><p className="text-muted-foreground">AI analyzes your profile and suggests improvements for more visibility</p></div>

      <Card><CardContent className="pt-6 space-y-4">
        <div>
          <label className="text-sm font-medium">Current LinkedIn About/Summary (optional)</label>
          <Textarea value={summary} onChange={e => setSummary(e.target.value)} placeholder="Paste your current LinkedIn About section here for better optimization..." rows={3} />
        </div>
        <Button onClick={optimize} disabled={loading} size="lg">
          {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Link2 className="h-4 w-4 mr-2" />}
          Optimize My Profile
        </Button>
        <p className="text-xs text-muted-foreground">Uses your AutoApply profile data (name, role, skills, experience)</p>
      </CardContent></Card>

      {result && (
        <div className="space-y-4">
          {/* Score */}
          <Card className={`${result.score >= 80 ? 'bg-green-50 dark:bg-green-950/20' : result.score >= 60 ? 'bg-yellow-50 dark:bg-yellow-950/20' : 'bg-red-50 dark:bg-red-950/20'}`}>
            <CardContent className="pt-6 text-center">
              <div className={`text-4xl font-bold ${result.score >= 80 ? 'text-green-600' : result.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>{result.score}/100</div>
              <p className="text-sm text-muted-foreground">LinkedIn Profile Score</p>
            </CardContent>
          </Card>

          {/* Headline */}
          <Card><CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Optimized Headline</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => copy(result.headline, 'headline')}>
              {copied === 'headline' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
            </Button>
          </CardHeader><CardContent><p className="text-sm font-medium">{result.headline}</p></CardContent></Card>

          {/* About */}
          <Card><CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Optimized About Section</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => copy(result.about, 'about')}>
              {copied === 'about' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
            </Button>
          </CardHeader><CardContent><p className="text-sm whitespace-pre-wrap">{result.about}</p></CardContent></Card>

          {/* Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />Skills to Add</CardTitle></CardHeader>
              <CardContent><div className="flex flex-wrap gap-2">{result.skills_to_add?.map((s, i) => <Badge key={i} className="bg-green-100 text-green-700">{s}</Badge>)}</div></CardContent>
            </Card>
            <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><XCircle className="h-4 w-4 text-red-500" />Skills to Remove</CardTitle></CardHeader>
              <CardContent><div className="flex flex-wrap gap-2">{result.skills_to_remove?.map((s, i) => <Badge key={i} variant="outline" className="text-red-500 line-through">{s}</Badge>)}</div></CardContent>
            </Card>
          </div>

          {/* Tips */}
          <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><Sparkles className="h-4 w-4 text-yellow-500" />Improvement Tips</CardTitle></CardHeader>
            <CardContent><ul className="space-y-2">{result.tips?.map((tip, i) => (
              <li key={i} className="text-sm flex items-start gap-2"><span className="text-blue-500 mt-0.5">&#8226;</span>{tip}</li>
            ))}</ul></CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
