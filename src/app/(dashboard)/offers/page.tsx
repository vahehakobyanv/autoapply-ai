'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Scale, Plus, Loader2, Trophy, Trash2, Star } from 'lucide-react';
import { toast } from 'sonner';
import type { JobOffer } from '@/types';

export default function OffersPage() {
  const [offers, setOffers] = useState<(JobOffer & { scoring?: { score: number; breakdown: { category: string; score: number; notes: string }[]; verdict: string } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ company: '', role: '', salary: '', currency: 'USD', bonus: '', equity: '', benefits: '', remote_policy: 'onsite', pto_days: '', commute_time: '', start_date: '', deadline: '' });

  useEffect(() => { fetch('/api/offers').then(r => r.json()).then(d => { if (Array.isArray(d)) setOffers(d); }).finally(() => setLoading(false)); }, []);

  const saveOffer = async () => {
    if (!form.company || !form.role || !form.salary) { toast.error('Fill company, role, and salary'); return; }
    try {
      const res = await fetch('/api/offers', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, salary: Number(form.salary), bonus: form.bonus ? Number(form.bonus) : undefined, pto_days: form.pto_days ? Number(form.pto_days) : undefined, commute_time: form.commute_time ? Number(form.commute_time) : undefined, benefits: form.benefits.split(',').map(b => b.trim()).filter(Boolean) }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setOffers(prev => [data, ...prev]);
      setShowForm(false);
      setForm({ company: '', role: '', salary: '', currency: 'USD', bonus: '', equity: '', benefits: '', remote_policy: 'onsite', pto_days: '', commute_time: '', start_date: '', deadline: '' });
      toast.success('Offer added and scored!');
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Failed'); }
  };

  const deleteOffer = async (id: string) => {
    await fetch('/api/offers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', id }) });
    setOffers(prev => prev.filter(o => o.id !== id));
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;

  const sorted = [...offers].sort((a, b) => (b.score || 0) - (a.score || 0));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Offer Comparison</h1><p className="text-muted-foreground">Compare job offers side by side with AI scoring</p></div>
        <Button onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4 mr-2" />Add Offer</Button>
      </div>

      {showForm && (
        <Card><CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input placeholder="Company *" value={form.company} onChange={e => setForm({...form, company: e.target.value})} />
            <Input placeholder="Role *" value={form.role} onChange={e => setForm({...form, role: e.target.value})} />
            <div className="flex gap-2">
              <Input placeholder="Salary *" type="number" value={form.salary} onChange={e => setForm({...form, salary: e.target.value})} />
              <select value={form.currency} onChange={e => setForm({...form, currency: e.target.value})} className="border rounded-lg px-3 text-sm">
                <option value="USD">USD</option><option value="EUR">EUR</option><option value="RUB">RUB</option><option value="AMD">AMD</option>
              </select>
            </div>
            <Input placeholder="Bonus" type="number" value={form.bonus} onChange={e => setForm({...form, bonus: e.target.value})} />
            <Input placeholder="Equity (e.g. 0.1%)" value={form.equity} onChange={e => setForm({...form, equity: e.target.value})} />
            <Input placeholder="Benefits (comma-separated)" value={form.benefits} onChange={e => setForm({...form, benefits: e.target.value})} />
            <div className="flex gap-2">
              {(['remote', 'hybrid', 'onsite'] as const).map(p => (
                <Button key={p} variant={form.remote_policy === p ? 'default' : 'outline'} size="sm" onClick={() => setForm({...form, remote_policy: p})} className="capitalize">{p}</Button>
              ))}
            </div>
            <Input placeholder="PTO days" type="number" value={form.pto_days} onChange={e => setForm({...form, pto_days: e.target.value})} />
            <Input placeholder="Commute (min)" type="number" value={form.commute_time} onChange={e => setForm({...form, commute_time: e.target.value})} />
            <Input type="date" placeholder="Start date" value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})} />
            <Input type="date" placeholder="Deadline" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} />
          </div>
          <Button onClick={saveOffer}><Scale className="h-4 w-4 mr-2" />Add & Score Offer</Button>
        </CardContent></Card>
      )}

      {/* Comparison Grid */}
      {sorted.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((offer, i) => (
            <Card key={offer.id} className={i === 0 && sorted.length > 1 ? 'ring-2 ring-green-500' : ''}>
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      {i === 0 && sorted.length > 1 && <Trophy className="h-4 w-4 text-green-500" />}
                      <h3 className="font-semibold">{offer.company}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{offer.role}</p>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${(offer.score || 0) >= 75 ? 'text-green-600' : (offer.score || 0) >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>{offer.score || '—'}</div>
                    <p className="text-[10px] text-muted-foreground">AI Score</p>
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Salary</span><span className="font-medium">{Number(offer.salary).toLocaleString()} {offer.currency}</span></div>
                  {offer.bonus && <div className="flex justify-between"><span className="text-muted-foreground">Bonus</span><span>{Number(offer.bonus).toLocaleString()}</span></div>}
                  {offer.equity && <div className="flex justify-between"><span className="text-muted-foreground">Equity</span><span>{offer.equity}</span></div>}
                  <div className="flex justify-between"><span className="text-muted-foreground">Remote</span><Badge variant="outline" className="capitalize text-xs">{offer.remote_policy}</Badge></div>
                  {offer.pto_days && <div className="flex justify-between"><span className="text-muted-foreground">PTO</span><span>{offer.pto_days} days</span></div>}
                </div>
                {offer.benefits?.length > 0 && (
                  <div className="flex flex-wrap gap-1">{offer.benefits.map((b, j) => <Badge key={j} variant="secondary" className="text-xs">{b}</Badge>)}</div>
                )}
                <Button variant="outline" size="sm" className="w-full" onClick={() => deleteOffer(offer.id)}><Trash2 className="h-3 w-3 mr-1" />Remove</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card><CardContent className="py-12 text-center"><Scale className="h-12 w-12 mx-auto mb-4 text-muted-foreground" /><h3 className="font-semibold mb-1">No offers to compare</h3><p className="text-sm text-muted-foreground">Add job offers to compare them side by side with AI scoring</p></CardContent></Card>
      )}
    </div>
  );
}
