'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MapPin, Loader2, ArrowRight, TrendingUp, TrendingDown, ThumbsUp, ThumbsDown } from 'lucide-react';
import { toast } from 'sonner';

export default function RelocationPage() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [salary, setSalary] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const compare = async () => {
    if (!from || !to) { toast.error('Enter both cities'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/relocation', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ from_city: from, to_city: to, salary: salary || undefined }) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch { toast.error('Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Relocation Cost Calculator</h1><p className="text-muted-foreground">Compare cost of living between cities before accepting a job</p></div>

      <Card><CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className="flex-1"><label className="text-sm font-medium">From</label><Input placeholder="Current city (e.g. Moscow)" value={from} onChange={e => setFrom(e.target.value)} /></div>
          <ArrowRight className="h-5 w-5 text-muted-foreground mt-5" />
          <div className="flex-1"><label className="text-sm font-medium">To</label><Input placeholder="Target city (e.g. Yerevan)" value={to} onChange={e => setTo(e.target.value)} /></div>
          <div className="w-40"><label className="text-sm font-medium">Salary (optional)</label><Input placeholder="$80,000" value={salary} onChange={e => setSalary(e.target.value)} /></div>
          <Button onClick={compare} disabled={loading} className="mt-5">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}</Button>
        </div>
      </CardContent></Card>

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card><CardContent className="pt-6 text-center"><p className="text-sm text-muted-foreground">Cost Difference</p><p className={`text-3xl font-bold ${result.cost_difference_percent > 0 ? 'text-red-600' : 'text-green-600'}`}>{result.cost_difference_percent > 0 ? '+' : ''}{result.cost_difference_percent}%</p><p className="text-xs text-muted-foreground">{result.cost_difference_percent > 0 ? 'more expensive' : 'cheaper'}</p></CardContent></Card>
            {result.equivalent_salary && <Card><CardContent className="pt-6 text-center"><p className="text-sm text-muted-foreground">Equivalent Salary Needed</p><p className="text-2xl font-bold text-blue-600">{result.equivalent_salary}</p><p className="text-xs text-muted-foreground">to maintain lifestyle</p></CardContent></Card>}
            <Card><CardContent className="pt-6 text-center"><p className="text-sm text-muted-foreground">Summary</p><p className="text-sm mt-1">{result.summary}</p></CardContent></Card>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[result.from, result.to].map((city: any, i: number) => city && (
              <Card key={i}><CardHeader><CardTitle className="text-base">{city.city}</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Rent (1BR)</span><span className="font-medium">{city.avg_rent}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Food</span><span>{city.avg_food}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Transport</span><span>{city.transport}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Internet</span><span>{city.internet}</span></div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><ThumbsUp className="h-4 w-4 text-green-500" />Pros</CardTitle></CardHeader>
              <CardContent>{result.pros?.map((p: string, i: number) => <p key={i} className="text-sm mb-1 flex gap-2"><span className="text-green-500">+</span>{p}</p>)}</CardContent>
            </Card>
            <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><ThumbsDown className="h-4 w-4 text-red-500" />Cons</CardTitle></CardHeader>
              <CardContent>{result.cons?.map((c: string, i: number) => <p key={i} className="text-sm mb-1 flex gap-2"><span className="text-red-500">-</span>{c}</p>)}</CardContent>
            </Card>
          </div>

          {result.recommendation && <Card className="bg-blue-50 dark:bg-blue-950/20"><CardContent className="pt-6"><p className="text-sm">{result.recommendation}</p></CardContent></Card>}
        </div>
      )}
    </div>
  );
}
