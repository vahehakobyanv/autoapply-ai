'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Video, Loader2, Copy, Check, Clock, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';

export default function VideoResumePage() {
  const [targetRole, setTargetRole] = useState('');
  const [tone, setTone] = useState('professional');
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/video-resume', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'generate_script', target_role: targetRole, tone }) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setScript(data);
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Video Resume Script</h1><p className="text-muted-foreground">AI generates a 60-second video resume script you can record</p></div>
      <Card><CardContent className="pt-6 space-y-4">
        <Input placeholder="Target role (optional)" value={targetRole} onChange={e => setTargetRole(e.target.value)} />
        <div><label className="text-sm font-medium">Tone</label><div className="flex gap-2 mt-1">{['professional', 'friendly', 'confident', 'creative'].map(t => <Button key={t} size="sm" variant={tone === t ? 'default' : 'outline'} onClick={() => setTone(t)} className="capitalize">{t}</Button>)}</div></div>
        <Button onClick={generate} disabled={loading} size="lg">{loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Video className="h-4 w-4 mr-2" />}Generate Script</Button>
      </CardContent></Card>

      {script && (<>
        <Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>Your Script</CardTitle><div className="flex items-center gap-2"><Badge variant="outline"><Clock className="h-3 w-3 mr-1" />{script.duration_estimate}</Badge><Button variant="ghost" size="sm" onClick={async () => { await navigator.clipboard.writeText(script.script); setCopied(true); toast.success('Copied!'); setTimeout(() => setCopied(false), 2000); }}>{copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}</Button></div></CardHeader>
          <CardContent><div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm whitespace-pre-wrap leading-relaxed">{script.script}</div></CardContent>
        </Card>

        {script.sections && (
          <Card><CardHeader><CardTitle className="text-base">Script Breakdown</CardTitle></CardHeader>
            <CardContent><div className="space-y-3">{script.sections.map((s: any, i: number) => (
              <div key={i} className="flex gap-3 p-3 border rounded-lg"><Badge variant="outline" className="shrink-0">{s.duration}</Badge><div><p className="text-xs font-medium text-blue-600">{s.label}</p><p className="text-sm">{s.text}</p></div></div>
            ))}</div></CardContent>
          </Card>
        )}

        {script.tips && (
          <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><Lightbulb className="h-4 w-4 text-yellow-500" />Recording Tips</CardTitle></CardHeader>
            <CardContent><ul className="space-y-1">{script.tips.map((t: string, i: number) => <li key={i} className="text-sm flex gap-2"><span className="text-blue-500">&#8226;</span>{t}</li>)}</ul></CardContent>
          </Card>
        )}
      </>)}
    </div>
  );
}
