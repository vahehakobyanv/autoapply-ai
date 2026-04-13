'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Wand2, Loader2, CheckCircle, TrendingUp, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function ResumeTailorPage() {
  const [resumes, setResumes] = useState<{ id: string; title: string }[]>([]);
  const [selectedResume, setSelectedResume] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobRequirements, setJobRequirements] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ resume: { id: string; title: string }; keywords_added: string[]; match_improvement: number } | null>(null);

  useEffect(() => {
    fetch('/api/resumes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'list' }) })
      .then(r => r.json()).then(d => { if (Array.isArray(d)) setResumes(d); });
  }, []);

  const tailor = async () => {
    if (!selectedResume || !jobTitle || !jobDescription) { toast.error('Select resume and fill job details'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/resume-tailor', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume_id: selectedResume, job_title: jobTitle, job_description: jobDescription, job_requirements: jobRequirements }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      toast.success('Resume tailored successfully!');
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">AI Resume Tailoring</h1><p className="text-muted-foreground">Auto-customize your resume keywords and content for each specific job</p></div>

      <Card><CardHeader><CardTitle>Select Resume & Job</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Choose Resume</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {resumes.map(r => (
                <Button key={r.id} variant={selectedResume === r.id ? 'default' : 'outline'} size="sm" onClick={() => setSelectedResume(r.id)}>
                  <FileText className="h-3 w-3 mr-1" />{r.title}
                </Button>
              ))}
              {resumes.length === 0 && <p className="text-sm text-muted-foreground">No resumes yet. Create one first.</p>}
            </div>
          </div>
          <Input placeholder="Job Title *" value={jobTitle} onChange={e => setJobTitle(e.target.value)} />
          <Textarea placeholder="Paste the full job description *" value={jobDescription} onChange={e => setJobDescription(e.target.value)} rows={4} />
          <Textarea placeholder="Key requirements (optional)" value={jobRequirements} onChange={e => setJobRequirements(e.target.value)} rows={2} />
          <Button onClick={tailor} disabled={loading} size="lg">
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Wand2 className="h-4 w-4 mr-2" />}
            Tailor Resume for This Job
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/10">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <div>
                <h3 className="font-semibold">Resume Tailored Successfully!</h3>
                <p className="text-sm text-muted-foreground">New resume: {result.resume.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">+{result.match_improvement}% match improvement</span>
              </div>
            </div>
            {result.keywords_added?.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Keywords Added:</p>
                <div className="flex flex-wrap gap-1.5">{result.keywords_added.map((k, i) => <Badge key={i} className="bg-green-100 text-green-700">{k}</Badge>)}</div>
              </div>
            )}
            <Button variant="outline" onClick={() => window.location.href = '/resume'}>
              <FileText className="h-4 w-4 mr-2" />View in Resume Builder
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
