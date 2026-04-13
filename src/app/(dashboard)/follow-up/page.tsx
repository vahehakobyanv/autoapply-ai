'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Mail, Loader2, Copy, Check, RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';

const EMAIL_TYPES = [
  { id: 'after_interview', label: 'After Interview', desc: 'Thank you email after an interview' },
  { id: 'after_application', label: 'After Application', desc: 'Follow up on a submitted application' },
  { id: 'no_response', label: 'No Response', desc: 'Haven\'t heard back after interview' },
  { id: 'after_rejection', label: 'After Rejection', desc: 'Graceful response to a rejection' },
  { id: 'networking', label: 'Networking', desc: 'Follow up with a professional contact' },
];

export default function FollowUpPage() {
  const [emailType, setEmailType] = useState('after_interview');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [notes, setNotes] = useState('');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ subject: string; body: string } | null>(null);
  const [copied, setCopied] = useState<'subject' | 'body' | null>(null);

  const generate = async () => {
    if (!jobTitle.trim() || !company.trim()) {
      toast.error('Please fill in job title and company');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/follow-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: emailType, jobTitle, company, interviewDate, notes, language }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, field: 'subject' | 'body') => {
    await navigator.clipboard.writeText(text);
    setCopied(field);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Follow-Up Emails</h1>
        <p className="text-muted-foreground">Generate professional follow-up emails for any situation</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {EMAIL_TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => setEmailType(t.id)}
                className={`text-left p-3 rounded-lg border-2 transition-all ${
                  emailType === t.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                    : 'border-transparent bg-slate-50 dark:bg-slate-800 hover:border-slate-200'
                }`}
              >
                <p className="text-sm font-medium">{t.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Job Title *</label>
              <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Senior Developer" />
            </div>
            <div>
              <label className="text-sm font-medium">Company *</label>
              <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Yandex" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Interview/Application Date</label>
              <Input type="date" value={interviewDate} onChange={(e) => setInterviewDate(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Language</label>
              <div className="flex gap-2 mt-1">
                <Button variant={language === 'en' ? 'default' : 'outline'} size="sm" onClick={() => setLanguage('en')}>English</Button>
                <Button variant={language === 'ru' ? 'default' : 'outline'} size="sm" onClick={() => setLanguage('ru')}>Russian</Button>
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Additional Notes (optional)</label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any specific points to mention..." rows={2} />
          </div>
          <Button onClick={generate} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Mail className="h-4 w-4 mr-2" />}
            Generate Email
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Generated Email</CardTitle>
              <Button variant="outline" size="sm" onClick={generate} disabled={loading}>
                <RefreshCw className="h-3 w-3 mr-1" /> Regenerate
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium">Subject</label>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.subject, 'subject')}>
                  {copied === 'subject' ? <Check className="h-3 w-3 mr-1 text-green-500" /> : <Copy className="h-3 w-3 mr-1" />}
                  Copy
                </Button>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm font-medium">
                {result.subject}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium">Body</label>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.body, 'body')}>
                  {copied === 'body' ? <Check className="h-3 w-3 mr-1 text-green-500" /> : <Copy className="h-3 w-3 mr-1" />}
                  Copy
                </Button>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm whitespace-pre-wrap leading-relaxed">
                {result.body}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
