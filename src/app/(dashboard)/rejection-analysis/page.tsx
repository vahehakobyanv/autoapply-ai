'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertTriangle, Loader2, Target, TrendingUp, Lightbulb, ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';
import type { RejectionAnalysis } from '@/types';

const severityColor = {
  low: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  medium: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export default function RejectionAnalysisPage() {
  const [analyses, setAnalyses] = useState<RejectionAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const res = await fetch('/api/rejection-analysis');
      const data = await res.json();
      if (Array.isArray(data)) setAnalyses(data);
    } catch {} finally {
      setLoading(false);
    }
  };

  const analyze = async () => {
    if (!jobTitle.trim() || !description.trim()) {
      toast.error('Please fill in job title and description');
      return;
    }

    setAnalyzing(true);
    try {
      const res = await fetch('/api/rejection-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_title: jobTitle,
          company,
          job_description: description,
          job_requirements: requirements,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAnalyses((prev) => [data, ...prev]);
      toast.success('Analysis complete!');
      setJobTitle('');
      setCompany('');
      setDescription('');
      setRequirements('');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setAnalyzing(false);
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
      <div>
        <h1 className="text-2xl font-bold">&quot;Why You Got Rejected&quot; AI</h1>
        <p className="text-muted-foreground">Analyze job descriptions vs your profile to identify gaps</p>
      </div>

      {/* Analysis Form */}
      <Card>
        <CardHeader>
          <CardTitle>Analyze a Job</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Job Title</label>
              <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Senior Frontend Developer" />
            </div>
            <div>
              <label className="text-sm font-medium">Company</label>
              <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Yandex" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Job Description</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Paste the full job description here..." rows={4} />
          </div>
          <div>
            <label className="text-sm font-medium">Requirements (optional)</label>
            <Textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} placeholder="Key requirements for the role..." rows={3} />
          </div>
          <Button onClick={analyze} disabled={analyzing}>
            {analyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Target className="h-4 w-4 mr-2" />
                Analyze Match
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {analyses.map((analysis) => (
        <Card key={analysis.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">{analysis.job_title}</CardTitle>
                <p className="text-sm text-muted-foreground">{analysis.company}</p>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  analysis.match_score >= 80 ? 'text-green-600' :
                  analysis.match_score >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {analysis.match_score}%
                </div>
                <p className="text-xs text-muted-foreground">Match Score</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Gaps */}
            {analysis.gaps && analysis.gaps.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  Identified Gaps
                </h4>
                <div className="space-y-2">
                  {analysis.gaps.map((gap, i) => (
                    <div key={i} className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={severityColor[gap.severity as keyof typeof severityColor] || ''}>
                          {gap.severity}
                        </Badge>
                        <Badge variant="outline" className="capitalize">{gap.category}</Badge>
                      </div>
                      <p className="text-sm">{gap.description}</p>
                      <p className="text-sm text-blue-600 mt-1 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {gap.action}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {analysis.suggestions && analysis.suggestions.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  Suggestions
                </h4>
                <ul className="space-y-1">
                  {analysis.suggestions.map((suggestion, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">&#8226;</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {analyses.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-1">No analyses yet</h3>
            <p className="text-sm text-muted-foreground">Paste a job description above to see why you might not match</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
