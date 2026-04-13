'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sparkles, Download, FileText, Plus, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Resume, ResumeContent } from '@/types';

const emptyContent: ResumeContent = {
  name: '', role: '', email: '', phone: '', location: '',
  summary: '', experience: [], education: [], skills: [], languages: [],
};

export default function ResumePage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [activeResume, setActiveResume] = useState<Resume | null>(null);
  const [content, setContent] = useState<ResumeContent>(emptyContent);
  const [language, setLanguage] = useState<'en' | 'ru'>('en');
  const [template, setTemplate] = useState<string>('modern');
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState('edit');
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    const res = await fetch('/api/resumes');
    const data = await res.json();
    if (Array.isArray(data)) {
      setResumes(data);
      if (data.length > 0) {
        setActiveResume(data[0]);
        setContent(data[0].content);
        setLanguage(data[0].language);
        setTemplate(data[0].template);
      }
    }
  };

  const generateResume = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, template, generateWithAI: true }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setActiveResume(data);
      setContent(data.content);
      setResumes((prev) => [data, ...prev]);
      toast.success('Resume generated!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate resume');
    } finally {
      setGenerating(false);
    }
  };

  const saveResume = async () => {
    if (!activeResume) return;
    setSaving(true);
    try {
      const res = await fetch('/api/resumes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: activeResume.id, content, language, template }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast.success('Resume saved!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const exportPdf = async () => {
    const el = previewRef.current;
    if (!el) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;
      const canvas = await html2canvas(el, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const w = pdf.internal.pageSize.getWidth();
      const h = (canvas.height * w) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, w, h);
      pdf.save(`resume-${language}.pdf`);
      toast.success('PDF exported!');
    } catch {
      toast.error('Failed to export PDF');
    }
  };

  const updateField = (field: keyof ResumeContent, value: unknown) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Resume Builder</h1>
          <p className="text-muted-foreground">Create and manage your resumes with AI</p>
        </div>
        <div className="flex gap-2">
          <Select value={language} onValueChange={(v) => { if (v) setLanguage(v as 'en' | 'ru'); }}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ru">Русский</SelectItem>
            </SelectContent>
          </Select>
          <Select value={template} onValueChange={(v) => { if (v) setTemplate(v); }}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="simple">Simple</SelectItem>
              <SelectItem value="executive">Executive</SelectItem>
              <SelectItem value="creative">Creative</SelectItem>
              <SelectItem value="minimal">Minimal</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={generateResume} disabled={generating}>
            {generating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
            {generating ? 'Generating...' : 'Generate with AI'}
          </Button>
        </div>
      </div>

      {/* Resume list */}
      {resumes.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {resumes.map((r) => (
            <Badge
              key={r.id}
              variant={activeResume?.id === r.id ? 'default' : 'outline'}
              className="cursor-pointer whitespace-nowrap"
              onClick={() => {
                setActiveResume(r);
                setContent(r.content);
                setLanguage(r.language);
                setTemplate(r.template);
              }}
            >
              <FileText className="h-3 w-3 mr-1" />
              {r.title}
            </Badge>
          ))}
        </div>
      )}

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={content.name} onChange={(e) => updateField('name', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Job Title</Label>
                <Input value={content.role} onChange={(e) => updateField('role', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={content.email} onChange={(e) => updateField('email', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={content.phone} onChange={(e) => updateField('phone', e.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Location</Label>
                <Input value={content.location} onChange={(e) => updateField('location', e.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Professional Summary</Label>
                <Textarea
                  value={content.summary}
                  onChange={(e) => updateField('summary', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Work Experience</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateField('experience', [
                    ...content.experience,
                    { title: '', company: '', startDate: '', endDate: '', description: '' },
                  ])
                }
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.experience.map((exp, i) => (
                <div key={i} className="space-y-3 p-4 border rounded-lg relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() =>
                      updateField(
                        'experience',
                        content.experience.filter((_, j) => j !== i)
                      )
                    }
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Job Title</Label>
                      <Input
                        value={exp.title}
                        onChange={(e) => {
                          const updated = [...content.experience];
                          updated[i] = { ...updated[i], title: e.target.value };
                          updateField('experience', updated);
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Company</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => {
                          const updated = [...content.experience];
                          updated[i] = { ...updated[i], company: e.target.value };
                          updateField('experience', updated);
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Start Date</Label>
                      <Input
                        value={exp.startDate}
                        onChange={(e) => {
                          const updated = [...content.experience];
                          updated[i] = { ...updated[i], startDate: e.target.value };
                          updateField('experience', updated);
                        }}
                        placeholder="Jan 2022"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">End Date</Label>
                      <Input
                        value={exp.endDate}
                        onChange={(e) => {
                          const updated = [...content.experience];
                          updated[i] = { ...updated[i], endDate: e.target.value };
                          updateField('experience', updated);
                        }}
                        placeholder="Present"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Description</Label>
                    <Textarea
                      value={exp.description}
                      onChange={(e) => {
                        const updated = [...content.experience];
                        updated[i] = { ...updated[i], description: e.target.value };
                        updateField('experience', updated);
                      }}
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Education</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateField('education', [
                    ...content.education,
                    { degree: '', institution: '', year: '' },
                  ])
                }
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.education.map((edu, i) => (
                <div key={i} className="grid grid-cols-3 gap-3 p-4 border rounded-lg relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() =>
                      updateField(
                        'education',
                        content.education.filter((_, j) => j !== i)
                      )
                    }
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                  <div className="space-y-1">
                    <Label className="text-xs">Degree</Label>
                    <Input
                      value={edu.degree}
                      onChange={(e) => {
                        const updated = [...content.education];
                        updated[i] = { ...updated[i], degree: e.target.value };
                        updateField('education', updated);
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Institution</Label>
                    <Input
                      value={edu.institution}
                      onChange={(e) => {
                        const updated = [...content.education];
                        updated[i] = { ...updated[i], institution: e.target.value };
                        updateField('education', updated);
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Year</Label>
                    <Input
                      value={edu.year}
                      onChange={(e) => {
                        const updated = [...content.education];
                        updated[i] = { ...updated[i], year: e.target.value };
                        updateField('education', updated);
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button onClick={saveResume} disabled={saving || !activeResume}>
              {saving ? 'Saving...' : 'Save Resume'}
            </Button>
            <Button variant="outline" onClick={() => setTab('preview')}>
              Preview
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <div className="flex justify-end gap-2 mb-4">
            <Button variant="outline" onClick={exportPdf}>
              <Download className="h-4 w-4 mr-2" /> Export PDF
            </Button>
          </div>
          <div ref={previewRef}>
            {template === 'modern' && <ModernTemplate content={content} />}
            {template === 'simple' && <SimpleTemplate content={content} />}
            {template === 'executive' && <ExecutiveTemplate content={content} />}
            {template === 'creative' && <CreativeTemplate content={content} />}
            {template === 'minimal' && <MinimalTemplate content={content} />}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ModernTemplate({ content }: { content: ResumeContent }) {
  return (
    <div className="bg-white p-8 shadow-lg rounded-lg max-w-[800px] mx-auto text-black">
      <div className="border-b-2 border-blue-600 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-slate-900">{content.name || 'Your Name'}</h1>
        <p className="text-lg text-blue-600 mt-1">{content.role || 'Your Role'}</p>
        <div className="flex gap-4 text-sm text-slate-500 mt-2">
          {content.email && <span>{content.email}</span>}
          {content.phone && <span>{content.phone}</span>}
          {content.location && <span>{content.location}</span>}
        </div>
      </div>

      {content.summary && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">Summary</h2>
          <p className="text-sm text-slate-700 leading-relaxed">{content.summary}</p>
        </div>
      )}

      {content.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-3">Experience</h2>
          <div className="space-y-4">
            {content.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">{exp.title}</h3>
                    <p className="text-sm text-slate-600">{exp.company}</p>
                  </div>
                  <span className="text-sm text-slate-400">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <p className="text-sm text-slate-700 mt-1">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {content.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-3">Education</h2>
          {content.education.map((edu, i) => (
            <div key={i} className="flex justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">{edu.degree}</h3>
                <p className="text-sm text-slate-600">{edu.institution}</p>
              </div>
              <span className="text-sm text-slate-400">{edu.year}</span>
            </div>
          ))}
        </div>
      )}

      {content.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {content.skills.map((skill, i) => (
              <span key={i} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {content.languages.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">Languages</h2>
          <p className="text-sm text-slate-700">{content.languages.join(' • ')}</p>
        </div>
      )}
    </div>
  );
}

function SimpleTemplate({ content }: { content: ResumeContent }) {
  return (
    <div className="bg-white p-8 shadow-lg rounded-lg max-w-[800px] mx-auto text-black">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">{content.name || 'Your Name'}</h1>
        <p className="text-slate-600">{content.role || 'Your Role'}</p>
        <div className="text-sm text-slate-500 mt-1">
          {[content.email, content.phone, content.location].filter(Boolean).join(' | ')}
        </div>
      </div>
      <Separator className="mb-4" />

      {content.summary && (
        <>
          <p className="text-sm mb-4">{content.summary}</p>
          <Separator className="mb-4" />
        </>
      )}

      {content.experience.length > 0 && (
        <>
          <h2 className="font-bold mb-3">WORK EXPERIENCE</h2>
          {content.experience.map((exp, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between">
                <strong>{exp.title}</strong>
                <span className="text-sm text-slate-500">{exp.startDate} - {exp.endDate}</span>
              </div>
              <p className="text-sm text-slate-600 italic">{exp.company}</p>
              <p className="text-sm mt-1">{exp.description}</p>
            </div>
          ))}
          <Separator className="mb-4" />
        </>
      )}

      {content.education.length > 0 && (
        <>
          <h2 className="font-bold mb-3">EDUCATION</h2>
          {content.education.map((edu, i) => (
            <div key={i} className="mb-2">
              <div className="flex justify-between">
                <strong>{edu.degree}</strong>
                <span className="text-sm text-slate-500">{edu.year}</span>
              </div>
              <p className="text-sm text-slate-600">{edu.institution}</p>
            </div>
          ))}
          <Separator className="mb-4" />
        </>
      )}

      {content.skills.length > 0 && (
        <>
          <h2 className="font-bold mb-2">SKILLS</h2>
          <p className="text-sm mb-4">{content.skills.join(', ')}</p>
        </>
      )}

      {content.languages.length > 0 && (
        <>
          <h2 className="font-bold mb-2">LANGUAGES</h2>
          <p className="text-sm">{content.languages.join(', ')}</p>
        </>
      )}
    </div>
  );
}

function ExecutiveTemplate({ content }: { content: ResumeContent }) {
  return (
    <div className="bg-white shadow-lg rounded-lg max-w-[800px] mx-auto text-black overflow-hidden">
      <div className="bg-slate-900 text-white px-8 py-8">
        <h1 className="text-3xl font-light tracking-wide">{content.name || 'Your Name'}</h1>
        <p className="text-slate-300 text-lg mt-1">{content.role || 'Your Role'}</p>
        <div className="flex gap-6 text-sm text-slate-400 mt-3">
          {content.email && <span>{content.email}</span>}
          {content.phone && <span>{content.phone}</span>}
          {content.location && <span>{content.location}</span>}
        </div>
      </div>
      <div className="p-8 space-y-6">
        {content.summary && (
          <div className="border-l-4 border-slate-900 pl-4">
            <p className="text-sm text-slate-700 italic leading-relaxed">{content.summary}</p>
          </div>
        )}
        {content.experience.length > 0 && (
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Professional Experience</h2>
            {content.experience.map((exp, i) => (
              <div key={i} className="mb-5">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-slate-900">{exp.title}</h3>
                  <span className="text-xs text-slate-500">{exp.startDate} - {exp.endDate}</span>
                </div>
                <p className="text-sm text-slate-500 font-medium">{exp.company}</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        )}
        <div className="grid grid-cols-2 gap-8">
          {content.education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Education</h2>
              {content.education.map((edu, i) => (
                <div key={i} className="mb-2">
                  <p className="font-semibold text-sm">{edu.degree}</p>
                  <p className="text-xs text-slate-500">{edu.institution} · {edu.year}</p>
                </div>
              ))}
            </div>
          )}
          <div>
            {content.skills.length > 0 && (
              <div className="mb-4">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Core Competencies</h2>
                <div className="flex flex-wrap gap-1.5">
                  {content.skills.map((s, i) => (
                    <span key={i} className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {content.languages.length > 0 && (
              <div>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Languages</h2>
                <p className="text-sm text-slate-600">{content.languages.join(' · ')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CreativeTemplate({ content }: { content: ResumeContent }) {
  return (
    <div className="bg-white shadow-lg rounded-lg max-w-[800px] mx-auto text-black overflow-hidden">
      <div className="grid grid-cols-3">
        {/* Left sidebar */}
        <div className="bg-indigo-600 text-white p-6 space-y-6">
          <div>
            <h1 className="text-xl font-bold">{content.name || 'Your Name'}</h1>
            <p className="text-indigo-200 text-sm mt-1">{content.role || 'Your Role'}</p>
          </div>
          <div className="space-y-2 text-sm text-indigo-100">
            {content.email && <p>{content.email}</p>}
            {content.phone && <p>{content.phone}</p>}
            {content.location && <p>{content.location}</p>}
          </div>
          {content.skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2 text-indigo-200">Skills</h2>
              <div className="space-y-1.5">
                {content.skills.map((s, i) => (
                  <div key={i} className="text-sm">
                    <span>{s}</span>
                    <div className="w-full bg-indigo-500 rounded-full h-1.5 mt-1">
                      <div className="bg-white rounded-full h-1.5" style={{ width: `${75 + Math.random() * 25}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {content.languages.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2 text-indigo-200">Languages</h2>
              <div className="space-y-1 text-sm">{content.languages.map((l, i) => <p key={i}>{l}</p>)}</div>
            </div>
          )}
        </div>

        {/* Right content */}
        <div className="col-span-2 p-6 space-y-5">
          {content.summary && (
            <div>
              <h2 className="text-sm font-bold text-indigo-600 uppercase mb-2">About Me</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{content.summary}</p>
            </div>
          )}
          {content.experience.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-indigo-600 uppercase mb-3">Experience</h2>
              {content.experience.map((exp, i) => (
                <div key={i} className="mb-4 relative pl-4 border-l-2 border-indigo-200">
                  <div className="absolute -left-1.5 top-1 h-2.5 w-2.5 rounded-full bg-indigo-600" />
                  <h3 className="font-semibold text-sm">{exp.title}</h3>
                  <p className="text-xs text-indigo-500">{exp.company} · {exp.startDate} - {exp.endDate}</p>
                  <p className="text-xs text-slate-600 mt-1">{exp.description}</p>
                </div>
              ))}
            </div>
          )}
          {content.education.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-indigo-600 uppercase mb-2">Education</h2>
              {content.education.map((edu, i) => (
                <div key={i} className="mb-2">
                  <p className="font-semibold text-sm">{edu.degree}</p>
                  <p className="text-xs text-slate-500">{edu.institution} · {edu.year}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MinimalTemplate({ content }: { content: ResumeContent }) {
  return (
    <div className="bg-white p-8 shadow-lg rounded-lg max-w-[800px] mx-auto text-black">
      <div className="mb-8">
        <h1 className="text-2xl font-light text-slate-900">{content.name || 'Your Name'}</h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-slate-500">{content.role || 'Your Role'}</span>
          {content.location && <><span className="text-slate-300">·</span><span className="text-slate-500 text-sm">{content.location}</span></>}
        </div>
        <div className="text-xs text-slate-400 mt-1">
          {[content.email, content.phone].filter(Boolean).join(' · ')}
        </div>
      </div>

      {content.summary && (
        <p className="text-sm text-slate-500 mb-8 max-w-xl leading-relaxed">{content.summary}</p>
      )}

      {content.experience.length > 0 && (
        <div className="mb-8">
          {content.experience.map((exp, i) => (
            <div key={i} className="grid grid-cols-[140px_1fr] gap-4 mb-4">
              <div className="text-xs text-slate-400 pt-0.5">
                {exp.startDate}<br />{exp.endDate}
              </div>
              <div>
                <h3 className="font-medium text-sm">{exp.title}</h3>
                <p className="text-xs text-slate-400">{exp.company}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {content.education.length > 0 && (
        <div className="mb-8">
          {content.education.map((edu, i) => (
            <div key={i} className="grid grid-cols-[140px_1fr] gap-4 mb-2">
              <div className="text-xs text-slate-400">{edu.year}</div>
              <div>
                <p className="text-sm font-medium">{edu.degree}</p>
                <p className="text-xs text-slate-400">{edu.institution}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {content.skills.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-slate-400">{content.skills.join(' · ')}</p>
        </div>
      )}

      {content.languages.length > 0 && (
        <p className="text-xs text-slate-400">{content.languages.join(' · ')}</p>
      )}
    </div>
  );
}
