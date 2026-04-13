'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2, ChevronDown, ChevronUp, MessageSquare, Lightbulb, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Question {
  question: string;
  category: string;
  difficulty: string;
  suggestedAnswer: string;
  tips: string;
}

interface PrepData {
  questions: Question[];
  companyResearch: string;
  talkingPoints: string[];
  questionsToAsk: string[];
}

export default function InterviewPrepPage() {
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PrepData | null>(null);
  const [expandedQ, setExpandedQ] = useState<Set<number>>(new Set());

  const generate = async () => {
    if (!jobTitle.trim()) return;
    setLoading(true);
    setData(null);
    try {
      const res = await fetch('/api/interview-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle, company, jobDescription }),
      });
      const result = await res.json();
      if (result.error) throw new Error(result.error);
      setData(result);
      toast.success('Interview prep generated!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestion = (i: number) => {
    setExpandedQ((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const difficultyColor = (d: string) => {
    switch (d) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const categoryColor = (c: string) => {
    switch (c) {
      case 'technical': return 'bg-blue-100 text-blue-700';
      case 'behavioral': return 'bg-purple-100 text-purple-700';
      case 'situational': return 'bg-orange-100 text-orange-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Interview Prep</h1>
        <p className="text-muted-foreground">AI-generated interview questions, answers, and tips</p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Job Title</Label>
              <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Full Stack Developer" />
            </div>
            <div className="space-y-2">
              <Label>Company (optional)</Label>
              <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Google, Yandex, etc." />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Job Description (optional — improves accuracy)</Label>
            <Textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} rows={3} placeholder="Paste the job description here..." />
          </div>
          <Button onClick={generate} disabled={loading || !jobTitle.trim()}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
            {loading ? 'Generating...' : 'Generate Interview Prep'}
          </Button>
        </CardContent>
      </Card>

      {data && (
        <>
          {/* Company Research */}
          {data.companyResearch && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lightbulb className="h-5 w-5 text-yellow-500" /> Company Research
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{data.companyResearch}</p>
              </CardContent>
            </Card>
          )}

          {/* Talking Points */}
          {data.talkingPoints?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Talking Points</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {data.talkingPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-green-500 mt-0.5">&#10003;</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Questions */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Interview Questions ({data.questions?.length || 0})</h2>
            {data.questions?.map((q, i) => (
              <Card key={i} className="overflow-hidden">
                <div
                  className="p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  onClick={() => toggleQuestion(i)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-muted-foreground">Q{i + 1}</span>
                        <Badge className={`text-xs ${categoryColor(q.category)}`}>{q.category}</Badge>
                        <Badge className={`text-xs ${difficultyColor(q.difficulty)}`}>{q.difficulty}</Badge>
                      </div>
                      <h3 className="font-medium">{q.question}</h3>
                    </div>
                    {expandedQ.has(i) ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                  </div>
                </div>
                {expandedQ.has(i) && (
                  <div className="px-4 pb-4 border-t bg-slate-50/50 dark:bg-slate-800/20">
                    <div className="pt-3 space-y-3">
                      <div>
                        <div className="flex items-center gap-1 text-sm font-medium text-green-700 dark:text-green-400 mb-1">
                          <MessageSquare className="h-3 w-3" /> Suggested Answer
                        </div>
                        <p className="text-sm text-muted-foreground">{q.suggestedAnswer}</p>
                      </div>
                      {q.tips && (
                        <div>
                          <div className="flex items-center gap-1 text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">
                            <Lightbulb className="h-3 w-3" /> Tip
                          </div>
                          <p className="text-sm text-muted-foreground">{q.tips}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Questions to Ask */}
          {data.questionsToAsk?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <HelpCircle className="h-5 w-5 text-blue-500" /> Questions to Ask the Interviewer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {data.questionsToAsk.map((q, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-blue-500 mt-0.5">?</span>
                      {q}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
