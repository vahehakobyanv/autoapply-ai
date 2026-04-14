'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mic, Plus, Loader2, Trash2, SmilePlus, Meh, Frown, X } from 'lucide-react';
import { toast } from 'sonner';

interface InterviewNote {
  id: string; company: string; role: string; interview_date: string;
  interview_type: string; interviewer_name: string; questions_asked: string[];
  my_answers: string; overall_feeling: string; next_steps: string; notes: string;
}

const FEELINGS = [
  { id: 'positive', label: 'Went well', icon: SmilePlus, color: 'text-green-500' },
  { id: 'neutral', label: 'Okay', icon: Meh, color: 'text-yellow-500' },
  { id: 'negative', label: 'Tough', icon: Frown, color: 'text-red-500' },
];

const TYPES = ['phone', 'video', 'onsite', 'technical', 'behavioral', 'panel'];

export default function InterviewNotesPage() {
  const [notes, setNotes] = useState<InterviewNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ company: '', role: '', interview_date: '', interview_type: 'video', interviewer_name: '', questions_asked: '', my_answers: '', overall_feeling: 'neutral', next_steps: '', notes: '' });

  useEffect(() => { fetch('/api/interview-notes').then(r => r.json()).then(d => { if (Array.isArray(d)) setNotes(d); }).finally(() => setLoading(false)); }, []);

  const save = async () => {
    if (!form.company || !form.interview_date) { toast.error('Company and date required'); return; }
    try {
      const res = await fetch('/api/interview-notes', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, questions_asked: form.questions_asked.split('\n').filter(Boolean) }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setNotes(prev => [data, ...prev]);
      setShowForm(false);
      setForm({ company: '', role: '', interview_date: '', interview_type: 'video', interviewer_name: '', questions_asked: '', my_answers: '', overall_feeling: 'neutral', next_steps: '', notes: '' });
      toast.success('Interview logged!');
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Failed'); }
  };

  const deleteNote = async (id: string) => {
    await fetch('/api/interview-notes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', id }) });
    setNotes(prev => prev.filter(n => n.id !== id));
    toast.success('Deleted');
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Interview Notes</h1><p className="text-muted-foreground">Log questions, feelings, and next steps after each interview</p></div>
        <Button onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4 mr-2" />Log Interview</Button>
      </div>

      {showForm && (
        <Card><CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input placeholder="Company *" value={form.company} onChange={e => setForm({...form, company: e.target.value})} />
            <Input placeholder="Role" value={form.role} onChange={e => setForm({...form, role: e.target.value})} />
            <Input type="date" value={form.interview_date} onChange={e => setForm({...form, interview_date: e.target.value})} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="Interviewer name" value={form.interviewer_name} onChange={e => setForm({...form, interviewer_name: e.target.value})} />
            <div className="flex gap-1">{TYPES.map(t => (
              <Button key={t} size="sm" variant={form.interview_type === t ? 'default' : 'outline'} onClick={() => setForm({...form, interview_type: t})} className="capitalize text-xs">{t}</Button>
            ))}</div>
          </div>
          <div>
            <label className="text-sm font-medium">Questions Asked (one per line)</label>
            <Textarea value={form.questions_asked} onChange={e => setForm({...form, questions_asked: e.target.value})} placeholder="What's your biggest weakness?\nTell me about a challenging project..." rows={3} />
          </div>
          <Textarea placeholder="My key answers / talking points..." value={form.my_answers} onChange={e => setForm({...form, my_answers: e.target.value})} rows={2} />
          <div>
            <label className="text-sm font-medium mb-2 block">How did it go?</label>
            <div className="flex gap-3">{FEELINGS.map(f => {
              const Icon = f.icon;
              return <Button key={f.id} variant={form.overall_feeling === f.id ? 'default' : 'outline'} size="sm" onClick={() => setForm({...form, overall_feeling: f.id})}><Icon className={`h-4 w-4 mr-1 ${form.overall_feeling === f.id ? '' : f.color}`} />{f.label}</Button>;
            })}</div>
          </div>
          <Input placeholder="Next steps (e.g. 'Waiting for call back by Friday')" value={form.next_steps} onChange={e => setForm({...form, next_steps: e.target.value})} />
          <Textarea placeholder="Additional notes..." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={2} />
          <div className="flex gap-2">
            <Button onClick={save}><Mic className="h-4 w-4 mr-2" />Save Interview</Button>
            <Button variant="ghost" onClick={() => setShowForm(false)}><X className="h-4 w-4" /></Button>
          </div>
        </CardContent></Card>
      )}

      {notes.length === 0 && !showForm ? (
        <Card><CardContent className="py-16 text-center"><Mic className="h-12 w-12 mx-auto mb-4 text-muted-foreground" /><h3 className="font-semibold mb-1">No interviews logged yet</h3><p className="text-sm text-muted-foreground mb-4">After each interview, log questions and your impressions</p><Button onClick={() => setShowForm(true)}><Plus className="h-4 w-4 mr-2" />Log Your First Interview</Button></CardContent></Card>
      ) : (
        <div className="space-y-4">{notes.map(note => {
          const feeling = FEELINGS.find(f => f.id === note.overall_feeling);
          const FeelingIcon = feeling?.icon || Meh;
          return (
            <Card key={note.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{note.company}</h3>
                      {note.role && <span className="text-sm text-muted-foreground">— {note.role}</span>}
                      <Badge variant="outline" className="capitalize text-xs">{note.interview_type}</Badge>
                      <FeelingIcon className={`h-4 w-4 ${feeling?.color}`} />
                    </div>
                    <p className="text-xs text-muted-foreground">{note.interview_date}{note.interviewer_name ? ` · with ${note.interviewer_name}` : ''}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => deleteNote(note.id)}><Trash2 className="h-3 w-3" /></Button>
                </div>
                {note.questions_asked?.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Questions Asked:</p>
                    <ul className="space-y-0.5">{note.questions_asked.map((q, i) => <li key={i} className="text-sm flex gap-2"><span className="text-blue-500">Q{i+1}.</span>{q}</li>)}</ul>
                  </div>
                )}
                {note.my_answers && <p className="text-sm text-muted-foreground mb-2"><strong>My Answers:</strong> {note.my_answers}</p>}
                {note.next_steps && <p className="text-sm"><strong>Next Steps:</strong> {note.next_steps}</p>}
                {note.notes && <p className="text-xs text-muted-foreground mt-2">{note.notes}</p>}
              </CardContent>
            </Card>
          );
        })}</div>
      )}
    </div>
  );
}
