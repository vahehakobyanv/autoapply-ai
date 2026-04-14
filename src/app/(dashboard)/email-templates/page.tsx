'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Copy, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Template { id: string; name: string; category: string; subject: string; body: string; }

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => { fetch('/api/email-templates').then(r => r.json()).then(d => { setTemplates(d.templates || []); setCategories(d.categories || []); }).finally(() => setLoading(false)); }, []);

  const copy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(null), 2000);
  };

  const filtered = filter === 'all' ? templates : templates.filter(t => t.category === filter);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Email Templates Library</h1><p className="text-muted-foreground">10 professional email templates for every job search situation</p></div>

      <div className="flex gap-2 flex-wrap">
        <Button variant={filter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('all')}>All ({templates.length})</Button>
        {categories.map(c => <Button key={c} variant={filter === c ? 'default' : 'outline'} size="sm" onClick={() => setFilter(c)}>{c}</Button>)}
      </div>

      <div className="space-y-4">{filtered.map(t => (
        <Card key={t.id}><CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-blue-500" /><CardTitle className="text-base">{t.name}</CardTitle><Badge variant="outline" className="text-xs">{t.category}</Badge></div>
            <Button variant="ghost" size="sm" onClick={() => copy(`Subject: ${t.subject}\n\n${t.body}`, t.id)}>{copied === t.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}</Button>
          </div>
        </CardHeader><CardContent className="space-y-3">
          <div><p className="text-xs font-medium text-muted-foreground mb-1">Subject Line:</p><p className="text-sm font-medium bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded">{t.subject}</p></div>
          <div><p className="text-xs font-medium text-muted-foreground mb-1">Body:</p><div className="text-sm bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded whitespace-pre-wrap leading-relaxed">{t.body}</div></div>
          <p className="text-[10px] text-muted-foreground">Replace placeholders in {'{curly braces}'} with your details</p>
        </CardContent></Card>
      ))}</div>
    </div>
  );
}
