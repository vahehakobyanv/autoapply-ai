'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FolderOpen, Plus, Loader2, Trash2, ExternalLink, X } from 'lucide-react';
import { toast } from 'sonner';

interface Project { id: string; name: string; description: string; tech_stack: string[]; url: string; image_url: string; role_in_project: string; results: string; }

export default function WorkPortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', tech_stack: '', url: '', role_in_project: '', results: '' });

  useEffect(() => { fetch('/api/work-portfolio').then(r => r.json()).then(d => { if (Array.isArray(d)) setProjects(d); }).finally(() => setLoading(false)); }, []);

  const save = async () => {
    if (!form.name) { toast.error('Project name required'); return; }
    try {
      const res = await fetch('/api/work-portfolio', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, tech_stack: form.tech_stack.split(',').map(t => t.trim()).filter(Boolean) }) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setProjects(prev => [data, ...prev]);
      setShowForm(false);
      setForm({ name: '', description: '', tech_stack: '', url: '', role_in_project: '', results: '' });
      toast.success('Project added!');
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Failed'); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold">Work Portfolio</h1><p className="text-muted-foreground">Showcase your projects and achievements to employers</p></div><Button onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4 mr-2" />Add Project</Button></div>

      {showForm && (<Card><CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Project name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <Input placeholder="Your role (e.g. Lead Developer)" value={form.role_in_project} onChange={e => setForm({...form, role_in_project: e.target.value})} />
        </div>
        <Textarea placeholder="Project description..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Tech stack (comma-separated)" value={form.tech_stack} onChange={e => setForm({...form, tech_stack: e.target.value})} />
          <Input placeholder="Project URL (optional)" value={form.url} onChange={e => setForm({...form, url: e.target.value})} />
        </div>
        <Input placeholder="Key results (e.g. Increased revenue 30%)" value={form.results} onChange={e => setForm({...form, results: e.target.value})} />
        <div className="flex gap-2"><Button onClick={save}><FolderOpen className="h-4 w-4 mr-2" />Save Project</Button><Button variant="ghost" onClick={() => setShowForm(false)}><X className="h-4 w-4" /></Button></div>
      </CardContent></Card>)}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{projects.map(p => (
        <Card key={p.id} className="hover:shadow-lg transition-shadow"><CardContent className="pt-6">
          <div className="flex justify-between items-start mb-2">
            <div><h3 className="font-semibold">{p.name}</h3>{p.role_in_project && <p className="text-xs text-blue-600">{p.role_in_project}</p>}</div>
            <div className="flex gap-1">{p.url && <a href={p.url} target="_blank" rel="noopener noreferrer"><Button variant="ghost" size="sm"><ExternalLink className="h-3 w-3" /></Button></a>}<Button variant="ghost" size="sm" onClick={async () => { await fetch('/api/work-portfolio', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', id: p.id }) }); setProjects(prev => prev.filter(x => x.id !== p.id)); }}><Trash2 className="h-3 w-3" /></Button></div>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{p.description}</p>
          {p.tech_stack?.length > 0 && <div className="flex flex-wrap gap-1 mb-2">{p.tech_stack.map((t, i) => <Badge key={i} variant="secondary" className="text-xs">{t}</Badge>)}</div>}
          {p.results && <p className="text-xs text-green-600 font-medium">Results: {p.results}</p>}
        </CardContent></Card>
      ))}</div>

      {projects.length === 0 && !showForm && (
        <Card><CardContent className="py-16 text-center"><FolderOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" /><h3 className="font-semibold mb-1">No projects yet</h3><p className="text-sm text-muted-foreground mb-4">Add your best work to showcase to employers</p><Button onClick={() => setShowForm(true)}><Plus className="h-4 w-4 mr-2" />Add Your First Project</Button></CardContent></Card>
      )}
    </div>
  );
}
