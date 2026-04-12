'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Link2, Search, Plus, Building2, MapPin, DollarSign, Loader2, ExternalLink, Bookmark } from 'lucide-react';
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Jobs</h1>
          <p className="text-muted-foreground">Import, search, and manage job listings</p>
        </div>
        <Dialog open={manualOpen} onOpenChange={setManualOpen}>
          <DialogTrigger >
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
                <Input
                  value={manualJob.title}
                  onChange={(e) => setManualJob({ ...manualJob, title: e.target.value })}
                  placeholder="Frontend Developer"
                />
              </div>
              <div className="space-y-2">
                <Label>Company</Label>
                <Input
                  value={manualJob.company}
                  onChange={(e) => setManualJob({ ...manualJob, company: e.target.value })}
                  placeholder="Acme Inc."
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={manualJob.description}
                  onChange={(e) => setManualJob({ ...manualJob, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>URL (optional)</Label>
                <Input
                  value={manualJob.url}
                  onChange={(e) => setManualJob({ ...manualJob, url: e.target.value })}
                />
              </div>
              <Button onClick={addManualJob} disabled={!manualJob.title}>
                Add Job
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="import">
        <TabsList>
          <TabsTrigger value="import">Import from URL</TabsTrigger>
          <TabsTrigger value="search">Search Jobs</TabsTrigger>
          <TabsTrigger value="saved">Saved ({jobs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste job URL (hh.ru, staff.am, or any job page)"
                    onKeyDown={(e) => e.key === 'Enter' && importFromUrl()}
                  />
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
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hh.ru">hh.ru</SelectItem>
                    <SelectItem value="staff.am">staff.am</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  className="flex-1"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Search keyword (e.g. React developer)"
                  onKeyDown={(e) => e.key === 'Enter' && searchJobs()}
                />
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
                        {job.company && (
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" /> {job.company}
                          </span>
                        )}
                        {job.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {job.location}
                          </span>
                        )}
                        {job.salary && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" /> {job.salary}
                          </span>
                        )}
                      </div>
                      {job.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {job.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      {job.url && (
                        <a href={job.url} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="icon">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
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
          {jobs.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No saved jobs yet. Import or search for jobs to get started.
              </CardContent>
            </Card>
          ) : (
            jobs.map((job) => (
              <Card key={job.id}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{job.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {job.source}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        {job.company && (
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" /> {job.company}
                          </span>
                        )}
                        {job.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {job.location}
                          </span>
                        )}
                        {job.salary && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" /> {job.salary}
                          </span>
                        )}
                      </div>
                      {job.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {job.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      {job.url && (
                        <a href={job.url} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="icon">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
