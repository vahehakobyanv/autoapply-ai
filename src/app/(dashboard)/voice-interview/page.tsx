'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Mic, MicOff, Loader2, Play, RotateCcw, Volume2 } from 'lucide-react';
import { toast } from 'sonner';

interface Evaluation {
  score: number; communication_score: number; clarity: string; feedback: string;
  filler_words: string[]; filler_count: number; strengths: string[];
  improvements: string[]; confidence_level: string;
}

export default function VoiceInterviewPage() {
  const [role, setRole] = useState('');
  const [question, setQuestion] = useState('');
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(false);
  const recognitionRef = useRef<any>(null);

  const getQuestion = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/interview-simulator', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start', role: role || 'Software Developer', difficulty: 'medium', type: 'behavioral' }),
      });
      const data = await res.json();
      setQuestion(data.question);
      setTranscript('');
      setEvaluation(null);
    } catch { toast.error('Failed to get question'); }
    finally { setLoading(false); }
  };

  const startRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { toast.error('Speech recognition not supported in this browser. Try Chrome.'); return; }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let text = '';
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);
    };

    recognition.onerror = () => { setRecording(false); toast.error('Recording error'); };
    recognition.onend = () => { setRecording(false); };

    recognitionRef.current = recognition;
    recognition.start();
    setRecording(true);
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setRecording(false);
  };

  const evaluate = async () => {
    if (!transcript.trim()) { toast.error('No answer recorded'); return; }
    setEvaluating(true);
    try {
      const res = await fetch('/api/voice-interview', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'evaluate_voice', transcript, question, role }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setEvaluation(data);
    } catch { toast.error('Evaluation failed'); }
    finally { setEvaluating(false); }
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Voice Interview Practice</h1><p className="text-muted-foreground">Speak your answers out loud and get AI feedback on content + communication</p></div>

      <Card><CardContent className="pt-6 space-y-4">
        <Input placeholder="Job role (e.g. Frontend Developer)" value={role} onChange={e => setRole(e.target.value)} />
        <Button onClick={getQuestion} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}Get Question</Button>
      </CardContent></Card>

      {question && (
        <Card><CardContent className="pt-6 space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl">
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2"><Volume2 className="h-4 w-4" />Interview Question:</p>
            <p className="mt-1">{question}</p>
          </div>

          <div className="flex items-center gap-4">
            {!recording ? (
              <Button onClick={startRecording} size="lg" className="bg-red-500 hover:bg-red-600">
                <Mic className="h-5 w-5 mr-2" />Start Speaking
              </Button>
            ) : (
              <Button onClick={stopRecording} size="lg" variant="outline" className="border-red-500 text-red-500">
                <MicOff className="h-5 w-5 mr-2 animate-pulse" />Stop Recording
              </Button>
            )}
            {recording && <div className="flex gap-1">{[1,2,3,4,5].map(i => <div key={i} className="w-1 bg-red-500 rounded-full animate-pulse" style={{height: `${12 + Math.random() * 20}px`, animationDelay: `${i * 100}ms`}} />)}</div>}
          </div>

          {transcript && (
            <div>
              <p className="text-sm font-medium mb-1">Your Answer (transcript):</p>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm">{transcript}</div>
              <div className="flex gap-2 mt-3">
                <Button onClick={evaluate} disabled={evaluating}>
                  {evaluating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}Evaluate My Answer
                </Button>
                <Button variant="outline" onClick={() => { setTranscript(''); setEvaluation(null); }}><RotateCcw className="h-4 w-4 mr-2" />Try Again</Button>
              </div>
            </div>
          )}
        </CardContent></Card>
      )}

      {evaluation && (
        <Card><CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div><div className={`text-3xl font-bold ${evaluation.score >= 7 ? 'text-green-600' : evaluation.score >= 5 ? 'text-yellow-600' : 'text-red-600'}`}>{evaluation.score}/10</div><p className="text-xs text-muted-foreground">Content Score</p></div>
            <div><div className={`text-3xl font-bold ${evaluation.communication_score >= 7 ? 'text-green-600' : 'text-yellow-600'}`}>{evaluation.communication_score}/10</div><p className="text-xs text-muted-foreground">Communication</p></div>
            <div><Badge className="text-sm capitalize">{evaluation.confidence_level}</Badge><p className="text-xs text-muted-foreground mt-1">Confidence</p></div>
          </div>
          <p className="text-sm">{evaluation.feedback}</p>
          <p className="text-sm text-muted-foreground">{evaluation.clarity}</p>
          {evaluation.filler_count > 0 && <p className="text-xs text-orange-600">Filler words detected: {evaluation.filler_count}x ({evaluation.filler_words.join(', ')})</p>}
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs font-medium text-green-600 mb-1">Strengths</p>{evaluation.strengths?.map((s,i) => <p key={i} className="text-xs text-muted-foreground">+ {s}</p>)}</div>
            <div><p className="text-xs font-medium text-orange-600 mb-1">Improvements</p>{evaluation.improvements?.map((s,i) => <p key={i} className="text-xs text-muted-foreground">- {s}</p>)}</div>
          </div>
        </CardContent></Card>
      )}
    </div>
  );
}
