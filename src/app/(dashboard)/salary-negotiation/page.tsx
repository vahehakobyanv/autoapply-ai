'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DollarSign, Loader2, Shield, Lightbulb, Copy, Check, TrendingUp, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface NegotiationResult {
  recommended_counter: string; strategy: string; talking_points: string[];
  email_script: string; risk_level: string; leverage_factors: string[];
  market: { avg_salary: string; demand_level: string };
}

const riskColors: Record<string, string> = { low: 'bg-green-100 text-green-700', medium: 'bg-yellow-100 text-yellow-700', high: 'bg-red-100 text-red-700' };

export default function SalaryNegotiationPage() {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [salary, setSalary] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [location, setLocation] = useState('');
  const [benefits, setBenefits] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NegotiationResult | null>(null);
  const [copied, setCopied] = useState(false);

  const negotiate = async () => {
    if (!company || !role || !salary) { toast.error('Fill company, role, and salary'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/salary-negotiation', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, role, salary: Number(salary), currency, location, benefits: benefits.split(',').map(b => b.trim()).filter(Boolean) }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Failed'); }
    finally { setLoading(false); }
  };

  const copyScript = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.email_script);
    setCopied(true);
    toast.success('Counter-offer script copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Salary Negotiation Coach</h1><p className="text-muted-foreground">AI generates a counter-offer strategy based on market data and your profile</p></div>

      <Card><CardHeader><CardTitle>Enter Your Offer</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input placeholder="Company *" value={company} onChange={e => setCompany(e.target.value)} />
            <Input placeholder="Role *" value={role} onChange={e => setRole(e.target.value)} />
            <div className="flex gap-2">
              <Input placeholder="Salary *" type="number" value={salary} onChange={e => setSalary(e.target.value)} />
              <select value={currency} onChange={e => setCurrency(e.target.value)} className="border rounded-lg px-3 text-sm"><option>USD</option><option>EUR</option><option>RUB</option><option>AMD</option></select>
            </div>
            <Input placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
            <Input placeholder="Benefits (comma-separated)" value={benefits} onChange={e => setBenefits(e.target.value)} className="md:col-span-2" />
          </div>
          <Button onClick={negotiate} disabled={loading} size="lg">
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <DollarSign className="h-4 w-4 mr-2" />}
            Generate Negotiation Strategy
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          {/* Counter Offer + Market */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
              <CardContent className="pt-6 text-center">
                <DollarSign className="h-8 w-8 mx-auto mb-1 opacity-50" />
                <p className="text-2xl font-bold">{result.recommended_counter}</p>
                <p className="text-sm text-green-100">Recommended Counter</p>
              </CardContent>
            </Card>
            <Card><CardContent className="pt-6 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-1 text-blue-500" />
              <p className="text-lg font-bold">{result.market.avg_salary}</p>
              <p className="text-sm text-muted-foreground">Market Average</p>
            </CardContent></Card>
            <Card><CardContent className="pt-6 text-center">
              <Shield className="h-8 w-8 mx-auto mb-1 text-purple-500" />
              <Badge className={`text-sm ${riskColors[result.risk_level] || ''}`}>{result.risk_level} risk</Badge>
              <p className="text-sm text-muted-foreground mt-1">Negotiation Risk</p>
            </CardContent></Card>
          </div>

          {/* Strategy */}
          <Card><CardHeader><CardTitle className="text-base">Negotiation Strategy</CardTitle></CardHeader>
            <CardContent><p className="text-sm whitespace-pre-wrap">{result.strategy}</p></CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Talking Points */}
            <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><Lightbulb className="h-4 w-4 text-yellow-500" />Talking Points</CardTitle></CardHeader>
              <CardContent><ul className="space-y-2">{result.talking_points?.map((p, i) => (
                <li key={i} className="text-sm flex items-start gap-2"><span className="text-blue-500 font-bold mt-0.5">{i + 1}.</span>{p}</li>
              ))}</ul></CardContent>
            </Card>
            {/* Leverage */}
            <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><Shield className="h-4 w-4 text-green-500" />Your Leverage</CardTitle></CardHeader>
              <CardContent><ul className="space-y-2">{result.leverage_factors?.map((f, i) => (
                <li key={i} className="text-sm flex items-start gap-2"><span className="text-green-500">&#10003;</span>{f}</li>
              ))}</ul></CardContent>
            </Card>
          </div>

          {/* Email Script */}
          <Card><CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Counter-Offer Email Script</CardTitle>
            <Button variant="ghost" size="sm" onClick={copyScript}>{copied ? <Check className="h-3 w-3 mr-1 text-green-500" /> : <Copy className="h-3 w-3 mr-1" />}Copy</Button>
          </CardHeader>
            <CardContent><div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm whitespace-pre-wrap leading-relaxed">{result.email_script}</div></CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
