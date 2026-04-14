'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Brain, Loader2, CheckCircle, XCircle, Trophy, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface Question { id: number; question: string; options: string[]; correct: string; explanation: string; }

export default function SkillQuizPage() {
  const [skill, setSkill] = useState('');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);

  const generate = async () => {
    if (!skill) { toast.error('Enter a skill'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/skill-quiz', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'generate', skill, difficulty }) });
      const data = await res.json();
      if (data.questions) { setQuestions(data.questions); setCurrent(0); setAnswers({}); setShowResult(false); }
    } catch { toast.error('Failed'); }
    finally { setLoading(false); }
  };

  const answer = (option: string) => {
    const letter = option[0];
    setAnswers(prev => ({ ...prev, [current]: letter }));
  };

  const next = () => { if (current < questions.length - 1) setCurrent(current + 1); else setShowResult(true); };
  const score = questions.filter((q, i) => answers[i] === q.correct).length;
  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  if (showResult) {
    return (
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold">Quiz Results</h1></div>
        <Card className="text-center"><CardContent className="pt-8 pb-8">
          <Trophy className={`h-16 w-16 mx-auto mb-4 ${pct >= 80 ? 'text-yellow-500' : pct >= 60 ? 'text-blue-500' : 'text-slate-400'}`} />
          <div className="text-4xl font-bold mb-2">{score}/{questions.length}</div>
          <p className="text-lg text-muted-foreground">{pct}% correct — {skill} ({difficulty})</p>
          <Badge className="mt-2" variant={pct >= 80 ? 'default' : 'secondary'}>{pct >= 80 ? 'Expert' : pct >= 60 ? 'Intermediate' : 'Needs Practice'}</Badge>
        </CardContent></Card>
        <div className="space-y-3">{questions.map((q, i) => (
          <Card key={i}><CardContent className="pt-4">
            <div className="flex items-start gap-2">
              {answers[i] === q.correct ? <CheckCircle className="h-5 w-5 text-green-500 shrink-0" /> : <XCircle className="h-5 w-5 text-red-500 shrink-0" />}
              <div><p className="text-sm font-medium">{q.question}</p><p className="text-xs text-green-600 mt-1">Correct: {q.correct}) {q.explanation}</p>{answers[i] !== q.correct && <p className="text-xs text-red-500">Your answer: {answers[i]})</p>}</div>
            </div>
          </CardContent></Card>
        ))}</div>
        <Button onClick={() => { setQuestions([]); setShowResult(false); }}><RotateCcw className="h-4 w-4 mr-2" />New Quiz</Button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold">Skill Assessment Quiz</h1><p className="text-muted-foreground">Test your knowledge with AI-generated quizzes</p></div>
        <Card><CardContent className="pt-6 space-y-4">
          <Input placeholder="Skill to test (e.g. React, Python, SQL, AWS)" value={skill} onChange={e => setSkill(e.target.value)} />
          <div className="flex gap-2">{['beginner', 'intermediate', 'advanced'].map(d => <Button key={d} variant={difficulty === d ? 'default' : 'outline'} size="sm" onClick={() => setDifficulty(d)} className="capitalize">{d}</Button>)}</div>
          <Button onClick={generate} disabled={loading} size="lg">{loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Brain className="h-4 w-4 mr-2" />}Start Quiz</Button>
        </CardContent></Card>
      </div>
    );
  }

  const q = questions[current];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold">{skill} Quiz</h1><Badge>{current + 1}/{questions.length}</Badge></div>
      <Progress value={((current + 1) / questions.length) * 100} className="h-2" />
      <Card><CardContent className="pt-6 space-y-4">
        <p className="font-medium">{q.question}</p>
        <div className="space-y-2">{q.options.map((opt, i) => {
          const letter = opt[0];
          const selected = answers[current] === letter;
          const isCorrect = answers[current] && letter === q.correct;
          const isWrong = answers[current] && selected && letter !== q.correct;
          return (
            <button key={i} onClick={() => !answers[current] && answer(opt)} disabled={!!answers[current]}
              className={`w-full text-left p-3 rounded-lg border-2 text-sm transition-all ${isCorrect ? 'border-green-500 bg-green-50' : isWrong ? 'border-red-500 bg-red-50' : selected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
              {opt}
            </button>
          );
        })}</div>
        {answers[current] && <p className="text-sm text-muted-foreground bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">{q.explanation}</p>}
        {answers[current] && <Button onClick={next}>{current < questions.length - 1 ? 'Next Question' : 'See Results'}</Button>}
      </CardContent></Card>
    </div>
  );
}
