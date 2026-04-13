'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UserPlus, Search, Loader2, Linkedin, Mail, Phone, Building2, Trash2, Calendar, Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { Contact } from '@/types';

const SOURCES = ['linkedin', 'referral', 'recruiter', 'networking', 'other'] as const;

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', company: '', role: '', linkedin_url: '', phone: '', notes: '', source: 'other' as string, tags: '' });

  useEffect(() => { fetchContacts(); }, []);

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/contacts');
      const data = await res.json();
      if (Array.isArray(data)) setContacts(data);
    } catch {} finally { setLoading(false); }
  };

  const saveContact = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setContacts(prev => [data, ...prev]);
      setShowForm(false);
      setForm({ name: '', email: '', company: '', role: '', linkedin_url: '', phone: '', notes: '', source: 'other', tags: '' });
      toast.success('Contact saved!');
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Failed'); }
  };

  const deleteContact = async (id: string) => {
    await fetch('/api/contacts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', id }) });
    setContacts(prev => prev.filter(c => c.id !== id));
    toast.success('Deleted');
  };

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase()) ||
    c.role.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Contacts CRM</h1>
          <p className="text-muted-foreground">Track recruiters, hiring managers, and networking contacts</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4 mr-2" />Add Contact</Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input placeholder="Name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              <Input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              <Input placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              <Input placeholder="Company" value={form.company} onChange={e => setForm({...form, company: e.target.value})} />
              <Input placeholder="Role/Title" value={form.role} onChange={e => setForm({...form, role: e.target.value})} />
              <Input placeholder="LinkedIn URL" value={form.linkedin_url} onChange={e => setForm({...form, linkedin_url: e.target.value})} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Tags (comma-separated)" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} />
              <div className="flex gap-2">
                {SOURCES.map(s => (
                  <Button key={s} variant={form.source === s ? 'default' : 'outline'} size="sm" onClick={() => setForm({...form, source: s})} className="capitalize text-xs">{s}</Button>
                ))}
              </div>
            </div>
            <Textarea placeholder="Notes..." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={2} />
            <Button onClick={saveContact}><UserPlus className="h-4 w-4 mr-2" />Save Contact</Button>
          </CardContent>
        </Card>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search contacts..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="space-y-3">
        {filtered.map(contact => (
          <Card key={contact.id}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{contact.name}</h3>
                    <Badge variant="outline" className="capitalize text-xs">{contact.source}</Badge>
                    {contact.tags?.map((tag, i) => <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {contact.role && <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{contact.role} at {contact.company}</span>}
                    {contact.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{contact.email}</span>}
                    {contact.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{contact.phone}</span>}
                  </div>
                  {contact.notes && <p className="text-xs text-muted-foreground mt-1">{contact.notes}</p>}
                </div>
                <div className="flex gap-2">
                  {contact.linkedin_url && <a href={contact.linkedin_url} target="_blank" rel="noopener noreferrer"><Button variant="outline" size="sm"><Linkedin className="h-3 w-3" /></Button></a>}
                  <Button variant="outline" size="sm" onClick={() => deleteContact(contact.id)}><Trash2 className="h-3 w-3" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <Card><CardContent className="py-12 text-center"><UserPlus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" /><h3 className="font-semibold mb-1">No contacts yet</h3><p className="text-sm text-muted-foreground">Add recruiters and networking contacts to track your relationships</p></CardContent></Card>
        )}
      </div>
    </div>
  );
}
