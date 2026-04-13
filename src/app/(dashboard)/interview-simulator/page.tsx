'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Mic, Loader2, Play, Send, Star, CheckCircle, AlertCircle, RotateCcw,
} from 'lucide-react';
import { toast } from 'sonner';

interface Evaluation {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  ideal_answer: string;
}

interface QA {
  question: string;
  answer: string;
  evaluation?: Evaluation;
}

export default function InterviewSimulatorPage() {
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [type, setType] = useState('mixed');
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [history, setHistory] = useState<QA[]>([]);
  const [questionNum, setQuestionNum] = useState(0);

  const startInterview = async () => {
    if (!role.trim()) { toast.error('Enter a job role'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/interview-simulator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start', role, company, difficulty, type }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setCurrentQuestion(data.question);
      setStarted(true);
      setQuestionNum(1);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to start');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    setEvaluating(true);
    try {
      const res = await fetch('/api/interview-simulator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'answer', question: currentQuestion, answer, role, company }),
      });
      const evaluation = await res.json();
      if (evaluation.error) throw new Error(evaluation.error);

      setHistory((prev) => [...prev, { question: currentQuestion, answer, evaluation }]);
      setAnswer('');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to evaluate');
    } finally {
      setEvaluating(false);
    }
  };

  const nextQuestion = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/interview-simulator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'next_question',
          previousQuestions: history.map((h) => h.question),
          role, company, difficulty, type,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setCurrentQuestion(data.question);
      setQuestionNum((n) => n + 1);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const resetInterview = () => {
    setStarted(false);
    setHistory([]);
    setCurrentQuestion('');
    setAnswer('');
    setQuestionNum(0);
  };

  const avgScore = history.length > 0
    ? Math.round(history.reduce((sum, h) => sum + (h.evaluation?.score || 0), 0) / history.length * 10)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Mock Interview</h1>
        <p className="text-muted-foreground">Practice with AI and get instant feedback on your answers</p>
      </div>

      {!started ? (
        <Card>
          <CardHeader>
            <CardTitle>Set Up Your Interview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Job Role *</label>
                <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Frontend Developer" />
              </div>
              <div>
                <label className="text-sm font-medium">Company (optional)</label>
                <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Google" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Difficulty</label>
              <div className="flex gap-2 mt-1">
                {['easy', 'medium', 'hard'].map((d) => (
                  <Button key={d} variant={difficulty === d ? 'default' : 'outline'} size="sm" onClick={() => setDifficulty(d)} className="capitalize">{d}</Button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Question Type</label>
              <div className="flex gap-2 mt-1">
                {['behavioral', 'technical', 'situational', 'mixed'].map((t) => (
                  <Button key={t} variant={type === t ? 'default' : 'outline'} size="sm" onClick={() => setType(t)} className="capitalize">{t}</Button>
                ))}
              </div>
            </div>
            <Button onClick={startInterview} disabled={loading} size="lg">
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
              Start Interview
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Score bar */}
          {history.length > 0 && (
            <div className="flex items-center gap-4">
              <Badge variant="outline">Question {questionNum}</Badge>
              <Badge variant="secondary">Avg Score: {avgScore}%</Badge>
              <Badge variant="secondary">{history.length} answered</Badge>
              <Button variant="ghost" size="sm" onClick={resetInterview}>
                <RotateCcw className="h-3 w-3 mr-1" /> Reset
              </Button>
            </div>
          )}

          {/* Current Question */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3 mb-4">
                <Mic className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Interviewer asks:</p>
                  <p className="font-medium">{currentQuestion}</p>
                </div>
              </div>

              {!history.length || history[history.length - 1]?.question !== currentQuestion ? (
                <div className="space-y-3">
                  <Textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    rows={4}
                  />
                  <Button onClick={submitAnswer} disabled={evaluating || !answer.trim()}>
                    {evaluating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                    Submit Answer
                  </Button>
                </div>
              ) : (
                <Button onClick={nextQuestion} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
                  Next Question
                </Button>
              )}
            </CardContent>
          </Card>

          {/* History */}
          {[...history].reverse().map((qa, i) => (
            <Card key={i}>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Q: {qa.question}</p>
                  <p className="text-sm mt-1">A: {qa.answer}</p>
                </div>
                {qa.evaluation && (
                  <div className="border-t pt-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`text-2xl font-bold ${qa.evaluation.score >= 7 ? 'text-green-600' : qa.evaluation.score >= 5 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {qa.evaluation.score}/10
                      </div>
                      <p className="text-sm text-muted-foreground">{qa.evaluation.feedback}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs font-medium text-green-600 mb-1 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" /> Strengths
                        </p>
                        {qa.evaluation.strengths?.map((s, j) => (
                          <p key={j} className="text-xs text-muted-foreground">- {s}</p>
                        ))}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-orange-600 mb-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> Improvements
                        </p>
                        {qa.evaluation.improvements?.map((s, j) => (
                          <p key={j} className="text-xs text-muted-foreground">- {s}</p>
                        ))}
                      </div>
                    </div>
                    {qa.evaluation.ideal_answer && (
                      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3">
                        <p className="text-xs font-medium text-blue-600 mb-1 flex items-center gap-1">
                          <Star className="h-3 w-3" /> Ideal Answer
                        </p>
                        <p className="text-xs text-muted-foreground">{qa.evaluation.ideal_answer}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </div>
  );
}
