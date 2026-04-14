'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Plus, Loader2, Trash2, TrendingUp, X } from 'lucide-react';
import { toast } from 'sonner';

interface SalaryEntry { id: string; company: string; role: string; salary: number; currency: string; date: string; type: string; notes: string; }

export default function SalaryHistoryPage() {
  const [entries, setEntries] = useState<SalaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ company: '', role: '', salary: '', currency: 'USD', date: '', type: 'salary', notes: '' });

  useEffect(() => { fetch('/api/salary-history').then(r => r.json()).then(d => { if (Array.isArray(d)) setEntries(d); }).finally(() => setLoading(false)); }, []);

  const save = async () => {
    if (!form.company || !form.salary || !form.date) { toast.error('Fill company, salary, and date'); return; }
    try {
      const res = await fetch('/api/salary-history', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, salary: Number(form.salary) }) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setEntries(prev => [...prev, data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      setShowForm(false);
      setForm({ company: '', role: '', salary: '', currency: 'USD', date: '', type: 'salary', notes: '' });
      toast.success('Entry added!');
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Failed'); }
  };

  const remove = async (id: string) => {
    await fetch('/api/salary-history', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', id }) });
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const growth = entries.length >= 2 ? Math.round(((entries[entries.length-1].salary - entries[0].salary) / entries[0].salary) * 100) : 0;

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Salary History</h1><p className="text-muted-foreground">Track your compensation growth over time</p></div>
        <Button onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4 mr-2" />Add Entry</Button>
      </div>

      {showForm && (<Card><CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input placeholder="Company *" value={form.company} onChange={e => setForm({...form, company: e.target.value})} />
          <Input placeholder="Role" value={form.role} onChange={e => setForm({...form, role: e.target.value})} />
          <div className="flex gap-2"><Input placeholder="Salary *" type="number" value={form.salary} onChange={e => setForm({...form, salary: e.target.value})} /><select value={form.currency} onChange={e => setForm({...form, currency: e.target.value})} className="border rounded px-2 text-sm"><option>USD</option><option>EUR</option><option>RUB</option><option>AMD</option></select></div>
          <Input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
        </div>
        <div className="flex gap-2"><Button onClick={save}><DollarSign className="h-4 w-4 mr-1" />Save</Button><Button variant="ghost" onClick={() => setShowForm(false)}><X className="h-4 w-4" /></Button></div>
      </CardContent></Card>)}

      {entries.length >= 2 && (<>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0"><CardContent className="pt-6 text-center"><TrendingUp className="h-6 w-6 mx-auto mb-1 opacity-50" /><p className="text-3xl font-bold">{growth > 0 ? '+' : ''}{growth}%</p><p className="text-sm text-green-100">Total Growth</p></CardContent></Card>
          <Card><CardContent className="pt-6 text-center"><p className="text-2xl font-bold">{entries[0].salary.toLocaleString()} {entries[0].currency}</p><p className="text-sm text-muted-foreground">Starting ({entries[0].date.slice(0,7)})</p></CardContent></Card>
          <Card><CardContent className="pt-6 text-center"><p className="text-2xl font-bold text-green-600">{entries[entries.length-1].salary.toLocaleString()} {entries[entries.length-1].currency}</p><p className="text-sm text-muted-foreground">Current ({entries[entries.length-1].date.slice(0,7)})</p></CardContent></Card>
        </div>
        <Card><CardHeader><CardTitle className="text-base">Salary Growth Chart</CardTitle></CardHeader><CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={entries.map(e => ({ date: e.date.slice(0,7), salary: e.salary, company: e.company }))}>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" fontSize={11} /><YAxis fontSize={11} /><Tooltip />
              <Line type="monotone" dataKey="salary" stroke="#16a34a" strokeWidth={2} dot={{ fill: '#16a34a', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent></Card>
      </>)}

      <div className="space-y-2">{entries.map(e => (
        <Card key={e.id}><CardContent className="pt-4 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-4"><div><p className="font-medium text-sm">{e.company}</p><p className="text-xs text-muted-foreground">{e.role}</p></div><Badge variant="outline">{e.date}</Badge></div>
          <div className="flex items-center gap-3"><span className="font-bold text-green-600">{e.salary.toLocaleString()} {e.currency}</span><Button variant="ghost" size="sm" onClick={() => remove(e.id)}><Trash2 className="h-3 w-3" /></Button></div>
        </CardContent></Card>
      ))}</div>

      {entries.length === 0 && !showForm && (
        <Card><CardContent className="py-16 text-center"><DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground" /><h3 className="font-semibold mb-1">No salary history yet</h3><p className="text-sm text-muted-foreground mb-4">Track your compensation growth over time</p><Button onClick={() => setShowForm(true)}><Plus className="h-4 w-4 mr-2" />Add Your First Entry</Button></CardContent></Card>
      )}
    </div>
  );
}
