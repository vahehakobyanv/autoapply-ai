'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Loader2, AlertTriangle, CheckCircle2, Info, ArrowUp } from 'lucide-react';
import { toast } from 'sonner';
import type { Resume } from '@/types';

interface ATSResult {
  score: number;
  grade: string;
  sections: Record<string, { score: number; feedback: string; missing?: string[] }>;
  improvements: { priority: string; suggestion: string }[];
  keywordMatch: number;
  readability: string;
}

export default function ATSScorePage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ATSResult | null>(null);

  useEffect(() => {
    fetch('/api/resumes')
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setResumes(d); });
  }, []);

  const analyze = async () => {
    const resume = resumes.find((r) => r.id === selectedResumeId);
    if (!resume) { toast.error('Select a resume first'); return; }

    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/ats-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeContent: resume.content, jobDescription: jobDescription || undefined }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const scoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const priorityIcon = (p: string) => {
    switch (p) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium': return <Info className="h-4 w-4 text-yellow-500" />;
      default: return <ArrowUp className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">ATS Resume Score</h1>
        <p className="text-muted-foreground">Check how well your resume passes Applicant Tracking Systems</p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label>Select Resume</Label>
            <Select value={selectedResumeId} onValueChange={(v) => { if (v) setSelectedResumeId(v); }}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a resume to analyze" />
              </SelectTrigger>
              <SelectContent>
                {resumes.map((r) => (
                  <SelectItem key={r.id} value={r.id}>{r.title} ({r.language.toUpperCase()})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Job Description (optional — improves accuracy)</Label>
            <Textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={3}
              placeholder="Paste the job description to check keyword match..."
            />
          </div>
          <Button onClick={analyze} disabled={loading || !selectedResumeId}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
            {loading ? 'Analyzing...' : 'Analyze Resume'}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <>
          {/* Overall Score */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-8">
                <div className="relative">
                  <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                    <circle
                      cx="60" cy="60" r="50" fill="none"
                      stroke={result.score >= 80 ? '#22c55e' : result.score >= 60 ? '#eab308' : '#ef4444'}
                      strokeWidth="10" strokeLinecap="round"
                      strokeDasharray={`${(result.score / 100) * 314} 314`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-bold ${scoreColor(result.score)}`}>{result.score}</span>
                    <span className="text-sm text-muted-foreground">{result.grade}</span>
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-lg">ATS Compatibility Score</h3>
                  <p className="text-sm text-muted-foreground">
                    {result.score >= 80 ? 'Excellent! Your resume is well-optimized for ATS.' :
                     result.score >= 60 ? 'Good, but there are improvements to make.' :
                     'Needs work. Follow the suggestions below to improve your score.'}
                  </p>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Keyword Match: </span>
                      <span className="font-medium">{result.keywordMatch}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Readability: </span>
                      <span className="font-medium capitalize">{result.readability}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Section Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(result.sections || {}).map(([key, section]) => (
                <div key={key} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{key}</span>
                    <span className={`text-sm font-bold ${scoreColor(section.score)}`}>{section.score}/100</span>
                  </div>
                  <Progress value={section.score} className="h-2" />
                  <p className="text-xs text-muted-foreground">{section.feedback}</p>
                  {section.missing?.length ? (
                    <div className="flex gap-1 flex-wrap">
                      {section.missing.map((m, i) => (
                        <Badge key={i} variant="outline" className="text-xs text-red-600 border-red-200">
                          Missing: {m}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Improvements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recommended Improvements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.improvements?.map((imp, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  {priorityIcon(imp.priority)}
                  <div>
                    <Badge variant="outline" className="text-xs capitalize mb-1">{imp.priority} priority</Badge>
                    <p className="text-sm">{imp.suggestion}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
