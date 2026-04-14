'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Loader2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function ReferenceLetterPage() {
  const [form, setForm] = useState({ referee_name: '', referee_title: '', referee_company: '', relationship: 'manager', duration: '2 years', qualities: '', target_role: '', language: 'en' });
  const [loading, setLoading] = useState(false);
  const [letter, setLetter] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!form.referee_name) { toast.error('Referee name required'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/reference-letter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setLetter(data.letter);
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Reference Letter Generator</h1><p className="text-muted-foreground">AI generates a professional reference letter from your referee's perspective</p></div>

      <Card><CardHeader><CardTitle>Referee Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input placeholder="Referee name *" value={form.referee_name} onChange={e => setForm({...form, referee_name: e.target.value})} />
            <Input placeholder="Referee title (e.g. CTO)" value={form.referee_title} onChange={e => setForm({...form, referee_title: e.target.value})} />
            <Input placeholder="Referee company" value={form.referee_company} onChange={e => setForm({...form, referee_company: e.target.value})} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="text-sm font-medium">Relationship</label><div className="flex gap-1 mt-1">{['manager', 'colleague', 'mentor', 'client'].map(r => <Button key={r} size="sm" variant={form.relationship === r ? 'default' : 'outline'} onClick={() => setForm({...form, relationship: r})} className="capitalize text-xs">{r}</Button>)}</div></div>
            <Input placeholder="Duration (e.g. 3 years)" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} />
            <Input placeholder="Target role (optional)" value={form.target_role} onChange={e => setForm({...form, target_role: e.target.value})} />
          </div>
          <Input placeholder="Key qualities to highlight (e.g. leadership, problem-solving)" value={form.qualities} onChange={e => setForm({...form, qualities: e.target.value})} />
          <div className="flex gap-2">
            <Button variant={form.language === 'en' ? 'default' : 'outline'} size="sm" onClick={() => setForm({...form, language: 'en'})}>English</Button>
            <Button variant={form.language === 'ru' ? 'default' : 'outline'} size="sm" onClick={() => setForm({...form, language: 'ru'})}>Russian</Button>
          </div>
          <Button onClick={generate} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileText className="h-4 w-4 mr-2" />}Generate Letter</Button>
        </CardContent>
      </Card>

      {letter && (
        <Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>Generated Letter</CardTitle><Button variant="ghost" size="sm" onClick={async () => { await navigator.clipboard.writeText(letter); setCopied(true); toast.success('Copied!'); setTimeout(() => setCopied(false), 2000); }}>{copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}</Button></CardHeader>
          <CardContent><div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm whitespace-pre-wrap leading-relaxed">{letter}</div></CardContent>
        </Card>
      )}
    </div>
  );
}
