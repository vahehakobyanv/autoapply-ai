'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Users, Loader2, ExternalLink, Lightbulb, Globe } from 'lucide-react';
import { toast } from 'sonner';

export default function EventsPage() {
  const [industry, setIndustry] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const find = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ industry }) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch { toast.error('Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Networking Events & Communities</h1><p className="text-muted-foreground">AI finds relevant meetups, conferences, and online communities for your career</p></div>
      <Card><CardContent className="pt-6 flex gap-3">
        <Input placeholder="Industry (e.g. Fintech, AI, Web3)" value={industry} onChange={e => setIndustry(e.target.value)} />
        <Button onClick={find} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Users className="h-4 w-4 mr-2" />}Find Events</Button>
      </CardContent></Card>

      {result && (<>
        {result.events?.length > 0 && (
          <Card><CardHeader><CardTitle className="text-base">Recommended Events</CardTitle></CardHeader>
            <CardContent className="space-y-3">{result.events.map((e: any, i: number) => (
              <div key={i} className="flex items-start justify-between p-3 border rounded-lg">
                <div><div className="flex items-center gap-2 mb-1"><h3 className="font-medium text-sm">{e.name}</h3><Badge variant="outline" className="text-xs capitalize">{e.type}</Badge><Badge variant="secondary" className="text-xs">{e.cost}</Badge></div><p className="text-xs text-muted-foreground">{e.description}</p><p className="text-xs text-blue-600 mt-1">{e.relevance}</p></div>
                <div className="text-right shrink-0 ml-4"><Badge variant="outline" className="text-xs">{e.frequency}</Badge><p className="text-[10px] text-muted-foreground mt-1">{e.url_hint}</p></div>
              </div>
            ))}</CardContent>
          </Card>
        )}
        {result.communities?.length > 0 && (
          <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><Globe className="h-4 w-4" />Online Communities</CardTitle></CardHeader>
            <CardContent className="space-y-2">{result.communities.map((c: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg"><div><h3 className="text-sm font-medium">{c.name}</h3><p className="text-xs text-muted-foreground">{c.description}</p></div><Badge variant="outline">{c.platform}</Badge></div>
            ))}</CardContent>
          </Card>
        )}
        {result.tips?.length > 0 && (
          <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><Lightbulb className="h-4 w-4 text-yellow-500" />Networking Tips</CardTitle></CardHeader>
            <CardContent><ul className="space-y-1">{result.tips.map((t: string, i: number) => <li key={i} className="text-sm flex gap-2"><span className="text-blue-500">&#8226;</span>{t}</li>)}</ul></CardContent>
          </Card>
        )}
      </>)}
    </div>
  );
}
