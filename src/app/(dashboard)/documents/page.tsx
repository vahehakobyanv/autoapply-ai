'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { FolderOpen, Upload, Loader2, FileText, Trash2, Download, Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { Document } from '@/types';

const DOC_TYPES = [
  { id: 'offer_letter', label: 'Offer Letter', color: 'bg-green-100 text-green-700' },
  { id: 'contract', label: 'Contract', color: 'bg-blue-100 text-blue-700' },
  { id: 'certificate', label: 'Certificate', color: 'bg-purple-100 text-purple-700' },
  { id: 'reference', label: 'Reference', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'other', label: 'Other', color: 'bg-slate-100 text-slate-700' },
];

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('other');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetch('/api/documents').then(r => r.json()).then(d => { if (Array.isArray(d)) setDocs(d); }).finally(() => setLoading(false)); }, []);

  const save = async () => {
    if (!name.trim()) { toast.error('Name is required'); return; }
    try {
      const res = await fetch('/api/documents', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type, notes, file_size: file?.size || 0 }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setDocs(prev => [data, ...prev]);
      setShowForm(false);
      setName(''); setNotes(''); setFile(null);
      toast.success('Document saved!');
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Failed'); }
  };

  const deleteDoc = async (id: string) => {
    await fetch('/api/documents', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', id }) });
    setDocs(prev => prev.filter(d => d.id !== id));
    toast.success('Deleted');
  };

  const typeInfo = (t: string) => DOC_TYPES.find(d => d.id === t) || DOC_TYPES[4];

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Document Vault</h1><p className="text-muted-foreground">Store offer letters, contracts, certificates, and references</p></div>
        <Button onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4 mr-2" />Add Document</Button>
      </div>

      {showForm && (
        <Card><CardContent className="pt-6 space-y-4">
          <Input placeholder="Document name *" value={name} onChange={e => setName(e.target.value)} />
          <div className="flex flex-wrap gap-2">
            {DOC_TYPES.map(t => (
              <Button key={t.id} variant={type === t.id ? 'default' : 'outline'} size="sm" onClick={() => setType(t.id)}>{t.label}</Button>
            ))}
          </div>
          <Input placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} />
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => inputRef.current?.click()}>
              <Upload className="h-4 w-4 mr-2" />{file ? file.name : 'Attach File'}
            </Button>
            <input ref={inputRef} type="file" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
            <Button onClick={save}><FolderOpen className="h-4 w-4 mr-2" />Save</Button>
          </div>
        </CardContent></Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {docs.map(doc => {
          const ti = typeInfo(doc.type);
          return (
            <Card key={doc.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-sm">{doc.name}</p>
                      <Badge className={`text-xs ${ti.color}`}>{ti.label}</Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => deleteDoc(doc.id)}><Trash2 className="h-3 w-3" /></Button>
                </div>
                {doc.notes && <p className="text-xs text-muted-foreground">{doc.notes}</p>}
                <p className="text-[10px] text-muted-foreground mt-2">{new Date(doc.created_at).toLocaleDateString()}{doc.file_size > 0 && ` · ${(doc.file_size / 1024).toFixed(0)} KB`}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {docs.length === 0 && !showForm && (
        <Card><CardContent className="py-12 text-center"><FolderOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" /><h3 className="font-semibold mb-1">No documents yet</h3><p className="text-sm text-muted-foreground">Store your offer letters, contracts, and certificates</p></CardContent></Card>
      )}
    </div>
  );
}
