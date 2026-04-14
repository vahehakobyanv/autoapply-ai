'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  Link2, Search, Plus, Building2, MapPin, DollarSign, Loader2,
  ExternalLink, Bookmark, Zap, CheckSquare, Square, X, Trash2, Star,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Job } from '@/types';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [url, setUrl] = useState('');
  const [keyword, setKeyword] = useState('');
  const [source, setSource] = useState<'hh.ru' | 'staff.am'>('hh.ru');
  const [importing, setImporting] = useState(false);
  const [searching, setSearching] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [manualJob, setManualJob] = useState({ title: '', company: '', description: '', url: '' });

  // Bulk apply state
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set());
  const [bulkApplying, setBulkApplying] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0, results: [] as { title: string; success: boolean }[] });

  // Filters & sort
  const [filterSource, setFilterSource] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [starredJobs, setStarredJobs] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('starred-jobs');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    }
    return new Set();
  });

  const toggleStar = (jobId: string) => {
    setStarredJobs(prev => {
      const next = new Set(prev);
      if (next.has(jobId)) next.delete(jobId); else next.add(jobId);
      localStorage.setItem('starred-jobs', JSON.stringify([...next]));
      return next;
    });
  };

  const filteredJobs = jobs
    .filter(j => filterSource === 'all' || j.source === filterSource)
    .sort((a, b) => {
      if (starredJobs.has(a.id) && !starredJobs.has(b.id)) return -1;
      if (!starredJobs.has(a.id) && starredJobs.has(b.id)) return 1;
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortBy === 'company') return a.company.localeCompare(b.company);
      return 0;
    });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const res = await fetch('/api/jobs');
    const data = await res.json();
    if (Array.isArray(data)) setJobs(data);
  };

  const importFromUrl = async () => {
    if (!url.trim()) return;
    setImporting(true);
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setJobs((prev) => [data, ...prev]);
      setUrl('');
      toast.success('Job imported!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setImporting(false);
    }
  };

  const searchJobs = async () => {
    if (!keyword.trim()) return;
    setSearching(true);
    try {
      const res = await fetch('/api/jobs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, source }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSearching(false);
    }
  };

  const saveSearchResult = async (job: any) => {
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setJobs((prev) => [data, ...prev]);
      toast.success('Job saved!');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const addManualJob = async () => {
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(manualJob),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setJobs((prev) => [data, ...prev]);
      setManualJob({ title: '', company: '', description: '', url: '' });
      setManualOpen(false);
      toast.success('Job added!');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const toggleSelect = (jobId: string) => {
    setSelectedJobs((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) next.delete(jobId);
      else next.add(jobId);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedJobs.size === jobs.length) {
      setSelectedJobs(new Set());
    } else {
      setSelectedJobs(new Set(jobs.map((j) => j.id)));
    }
  };

  const bulkApply = async () => {
    const selected = jobs.filter((j) => selectedJobs.has(j.id));
    if (selected.length === 0) return;

    setBulkApplying(true);
    setBulkProgress({ current: 0, total: selected.length, results: [] });

    for (let i = 0; i < selected.length; i++) {
      const job = selected[i];
      setBulkProgress((prev) => ({ ...prev, current: i + 1 }));

      try {
        // Create application with cover letter
        const clRes = await fetch('/api/cover-letter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jobDescription: `${job.title}\n${job.company}\n${job.description}`,
          }),
        });
        const clData = await clRes.json();

        // Create the application
        const appRes = await fetch('/api/applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            job_id: job.id,
            status: 'applied',
            cover_letter: clData.coverLetter || '',
          }),
        });
        const appData = await appRes.json();

        setBulkProgress((prev) => ({
          ...prev,
          results: [...prev.results, { title: job.title, success: !appData.error }],
        }));

        if (appData.error) {
          toast.error(`${job.title}: ${appData.error}`);
          break; // Stop if limit reached
        }
      } catch {
        setBulkProgress((prev) => ({
          ...prev,
          results: [...prev.results, { title: job.title, success: false }],
        }));
      }

      // Human-like delay between applications
      if (i < selected.length - 1) {
        await new Promise((r) => setTimeout(r, 1500 + Math.random() * 1000));
      }
    }

    setBulkApplying(false);
    setSelectedJobs(new Set());
    const successCount = bulkProgress.results.filter((r) => r.success).length + 1;
    toast.success(`Applied to ${successCount} jobs!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Jobs</h1>
          <p className="text-muted-foreground">Import, search, and manage job listings</p>
        </div>
        <div className="flex gap-2">
          {selectedJobs.size > 0 && (
            <Button onClick={bulkApply} disabled={bulkApplying} className="bg-green-600 hover:bg-green-700">
              <Zap className="h-4 w-4 mr-2" />
              Apply to {selectedJobs.size} Jobs
            </Button>
          )}
          <Dialog open={manualOpen} onOpenChange={setManualOpen}>
            <DialogTrigger>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" /> Add Manually
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Job Manually</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Job Title</Label>
                  <Input value={manualJob.title} onChange={(e) => setManualJob({ ...manualJob, title: e.target.value })} placeholder="Frontend Developer" />
                </div>
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input value={manualJob.company} onChange={(e) => setManualJob({ ...manualJob, company: e.target.value })} placeholder="Acme Inc." />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={manualJob.description} onChange={(e) => setManualJob({ ...manualJob, description: e.target.value })} rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>URL (optional)</Label>
                  <Input value={manualJob.url} onChange={(e) => setManualJob({ ...manualJob, url: e.target.value })} />
                </div>
                <Button onClick={addManualJob} disabled={!manualJob.title}>Add Job</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Bulk Apply Progress */}
      {bulkApplying && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Applying... {bulkProgress.current}/{bulkProgress.total}
                </span>
                <span className="text-sm text-muted-foreground">
                  {Math.round((bulkProgress.current / bulkProgress.total) * 100)}%
                </span>
              </div>
              <Progress value={(bulkProgress.current / bulkProgress.total) * 100} />
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {bulkProgress.results.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    {r.success ? (
                      <span className="text-green-600">&#10003;</span>
                    ) : (
                      <span className="text-red-500">&#10007;</span>
                    )}
                    <span className={r.success ? 'text-green-700' : 'text-red-600'}>{r.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="import">
        <TabsList>
          <TabsTrigger value="import">Import from URL</TabsTrigger>
          <TabsTrigger value="search">Search Jobs</TabsTrigger>
          <TabsTrigger value="saved">Saved ({filteredJobs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste job URL (hh.ru, staff.am, or any job page)" onKeyDown={(e) => e.key === 'Enter' && importFromUrl()} />
                </div>
                <Button onClick={importFromUrl} disabled={importing || !url.trim()}>
                  {importing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Link2 className="h-4 w-4 mr-2" />}
                  Import
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                We&apos;ll extract the job title, company, description, and requirements automatically using AI.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-2">
                <Select value={source} onValueChange={(v) => { if (v) setSource(v as 'hh.ru' | 'staff.am'); }}>
                  <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hh.ru">hh.ru</SelectItem>
                    <SelectItem value="staff.am">staff.am</SelectItem>
                  </SelectContent>
                </Select>
                <Input className="flex-1" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Search keyword (e.g. React developer)" onKeyDown={(e) => e.key === 'Enter' && searchJobs()} />
                <Button onClick={searchJobs} disabled={searching || !keyword.trim()}>
                  {searching ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {searchResults.length > 0 && (
            <div className="grid gap-3">
              {searchResults.map((job, i) => (
                <Card key={i}>
                  <CardContent className="pt-4 flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <h3 className="font-semibold">{job.title}</h3>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        {job.company && <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {job.company}</span>}
                        {job.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>}
                        {job.salary && <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> {job.salary}</span>}
                      </div>
                      {job.description && <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>}
                    </div>
                    <div className="flex gap-2 ml-4">
                      {job.url && (
                        <a href={job.url} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="icon"><ExternalLink className="h-4 w-4" /></Button>
                        </a>
                      )}
                      <Button variant="outline" size="sm" onClick={() => saveSearchResult(job)}>
                        <Bookmark className="h-3 w-3 mr-1" /> Save
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved" className="space-y-3">
          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex gap-1">
              {['all', 'hh.ru', 'staff.am', 'manual'].map(s => (
                <Button key={s} variant={filterSource === s ? 'default' : 'outline'} size="sm" onClick={() => setFilterSource(s)} className="text-xs capitalize">{s === 'all' ? 'All Sources' : s}</Button>
              ))}
            </div>
            <div className="flex gap-1 ml-auto">
              {[{ id: 'newest', label: 'Newest' }, { id: 'oldest', label: 'Oldest' }, { id: 'company', label: 'Company' }].map(s => (
                <Button key={s.id} variant={sortBy === s.id ? 'default' : 'outline'} size="sm" onClick={() => setSortBy(s.id)} className="text-xs">{s.label}</Button>
              ))}
            </div>
          </div>

          {filteredJobs.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No saved jobs yet. Import or search for jobs to get started.
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Bulk select controls */}
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={selectAll}>
                  {selectedJobs.size === filteredJobs.length ? (
                    <><CheckSquare className="h-4 w-4 mr-2" /> Deselect All</>
                  ) : (
                    <><Square className="h-4 w-4 mr-2" /> Select All ({filteredJobs.length})</>
                  )}
                </Button>
                {selectedJobs.size > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{selectedJobs.size} selected</span>
                    <Button size="sm" variant="ghost" onClick={() => setSelectedJobs(new Set())}>
                      <X className="h-3 w-3 mr-1" /> Clear
                    </Button>
                  </div>
                )}
              </div>

              {filteredJobs.map((job) => (
                <Card
                  key={job.id}
                  className={`cursor-pointer transition-colors ${selectedJobs.has(job.id) ? 'ring-2 ring-blue-500 bg-blue-50/50 dark:bg-blue-950/20' : ''}`}
                  onClick={() => toggleSelect(job.id)}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {selectedJobs.has(job.id) ? (
                            <CheckSquare className="h-5 w-5 text-blue-600" />
                          ) : (
                            <Square className="h-5 w-5 text-slate-300" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{job.title}</h3>
                            <Badge variant="outline" className="text-xs">{job.source}</Badge>
                          </div>
                          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                            {job.company && <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {job.company}</span>}
                            {job.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>}
                            {job.salary && <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> {job.salary}</span>}
                          </div>
                          {job.description && <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{job.description}</p>}
                        </div>
                      </div>
                      <div className="flex gap-1 ml-4" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" onClick={() => toggleStar(job.id)}>
                          <Star className={`h-4 w-4 ${starredJobs.has(job.id) ? 'fill-yellow-500 text-yellow-500' : 'text-slate-300'}`} />
                        </Button>
                        {job.url && (
                          <a href={job.url} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="icon"><ExternalLink className="h-4 w-4" /></Button>
                          </a>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-400 hover:text-red-600 hover:bg-red-50"
                          onClick={async () => {
                            try {
                              const res = await fetch(`/api/jobs?id=${job.id}`, { method: 'DELETE' });
                              const data = await res.json();
                              if (data.error) throw new Error(data.error);
                              setJobs((prev) => prev.filter((j) => j.id !== job.id));
                              selectedJobs.delete(job.id);
                              setSelectedJobs(new Set(selectedJobs));
                              toast.success('Job removed');
                            } catch { toast.error('Failed to delete'); }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
