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
import { Sparkles, Download, FileText, Plus, Trash2, Loader2, Link2 } from 'lucide-react';
import { TemplateGallery } from '@/components/ui/template-gallery';
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
              <SelectItem value="hy">Հայերեն</SelectItem>
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
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="tech">Tech</SelectItem>
              <SelectItem value="elegant">Elegant</SelectItem>
              <SelectItem value="compact">Compact</SelectItem>
              <SelectItem value="bold">Bold</SelectItem>
            </SelectContent>
          </Select>
          {selectedResume && (
            <Button variant="outline" size="sm" onClick={() => {
              const url = `${window.location.origin}/r/${selectedResume}`;
              navigator.clipboard.writeText(url);
              toast.success('Resume link copied!');
            }}>
              <Link2 className="h-4 w-4 mr-1" /> Share Link
            </Button>
          )}
          <Button onClick={generateResume} disabled={generating}>
            {generating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
            {generating ? 'Generating...' : 'Generate with AI'}
          </Button>
        </div>
      </div>

      {/* Template Gallery */}
      <TemplateGallery selected={template} onSelect={(id) => setTemplate(id)} />

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
            {template === 'professional' && <ProfessionalTemplate content={content} />}
            {template === 'tech' && <TechTemplate content={content} />}
            {template === 'elegant' && <ElegantTemplate content={content} />}
            {template === 'compact' && <CompactTemplate content={content} />}
            {template === 'bold' && <BoldTemplate content={content} />}
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

// Template 6: Professional — Navy blue header, two-column layout, clean sections
function ProfessionalTemplate({ content }: { content: ResumeContent }) {
  return (
    <div className="bg-white shadow-lg rounded-lg max-w-[800px] mx-auto text-black">
      <div className="bg-[#1e3a5f] text-white p-8 rounded-t-lg">
        <h1 className="text-3xl font-bold tracking-wide">{content.name || 'Your Name'}</h1>
        <p className="text-blue-200 text-lg mt-1">{content.role || 'Your Role'}</p>
        <div className="flex gap-4 mt-3 text-xs text-blue-100">
          {content.email && <span>{content.email}</span>}
          {content.phone && <span>{content.phone}</span>}
          {content.location && <span>{content.location}</span>}
        </div>
      </div>
      <div className="p-8 grid grid-cols-[1fr_250px] gap-8">
        <div>
          {content.summary && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#1e3a5f] border-b-2 border-[#1e3a5f] pb-1 mb-3">Profile</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{content.summary}</p>
            </div>
          )}
          {content.experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#1e3a5f] border-b-2 border-[#1e3a5f] pb-1 mb-3">Experience</h2>
              {content.experience.map((exp, i) => (
                <div key={i} className="mb-4">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-sm">{exp.title}</h3>
                    <span className="text-xs text-slate-400">{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <p className="text-xs text-[#1e3a5f] font-medium">{exp.company}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          )}
          {content.education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#1e3a5f] border-b-2 border-[#1e3a5f] pb-1 mb-3">Education</h2>
              {content.education.map((edu, i) => (
                <div key={i} className="mb-2">
                  <p className="text-sm font-medium">{edu.degree}</p>
                  <p className="text-xs text-slate-500">{edu.institution} — {edu.year}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border-l pl-6">
          {content.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#1e3a5f] border-b-2 border-[#1e3a5f] pb-1 mb-3">Skills</h2>
              <div className="space-y-1.5">
                {content.skills.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#1e3a5f]" />
                    <span className="text-xs">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {content.languages.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#1e3a5f] border-b-2 border-[#1e3a5f] pb-1 mb-3">Languages</h2>
              {content.languages.map((l, i) => <p key={i} className="text-xs mb-1">{l}</p>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Template 7: Tech — Dark sidebar, monospace accents, code-inspired
function TechTemplate({ content }: { content: ResumeContent }) {
  return (
    <div className="bg-white shadow-lg rounded-lg max-w-[800px] mx-auto text-black grid grid-cols-[220px_1fr]">
      <div className="bg-slate-900 text-white p-6 rounded-l-lg">
        <div className="mb-6">
          <h1 className="text-lg font-bold">{content.name || 'Your Name'}</h1>
          <p className="text-emerald-400 text-xs font-mono mt-1">{content.role || 'role'}</p>
        </div>
        <div className="space-y-1 text-xs text-slate-300 mb-6">
          {content.email && <p className="font-mono">{content.email}</p>}
          {content.phone && <p className="font-mono">{content.phone}</p>}
          {content.location && <p>{content.location}</p>}
        </div>
        {content.skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-emerald-400 text-[10px] font-mono uppercase tracking-wider mb-2">// skills</h2>
            <div className="space-y-1">
              {content.skills.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-emerald-400 font-mono text-xs">&#8250;</span>
                  <span className="text-xs">{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {content.languages.length > 0 && (
          <div>
            <h2 className="text-emerald-400 text-[10px] font-mono uppercase tracking-wider mb-2">// languages</h2>
            {content.languages.map((l, i) => <p key={i} className="text-xs mb-1">{l}</p>)}
          </div>
        )}
      </div>
      <div className="p-6">
        {content.summary && (
          <div className="mb-5 p-3 bg-slate-50 rounded border-l-2 border-emerald-500">
            <p className="text-sm text-slate-600">{content.summary}</p>
          </div>
        )}
        {content.experience.length > 0 && (
          <div className="mb-5">
            <h2 className="text-xs font-mono text-emerald-600 uppercase tracking-wider mb-3">experience</h2>
            {content.experience.map((exp, i) => (
              <div key={i} className="mb-4 pl-3 border-l-2 border-slate-200">
                <div className="flex justify-between">
                  <h3 className="text-sm font-semibold">{exp.title}</h3>
                  <span className="text-[10px] font-mono text-slate-400">{exp.startDate}–{exp.endDate}</span>
                </div>
                <p className="text-xs text-emerald-600 font-medium">{exp.company}</p>
                <p className="text-xs text-slate-500 mt-1">{exp.description}</p>
              </div>
            ))}
          </div>
        )}
        {content.education.length > 0 && (
          <div>
            <h2 className="text-xs font-mono text-emerald-600 uppercase tracking-wider mb-3">education</h2>
            {content.education.map((edu, i) => (
              <div key={i} className="mb-2 pl-3 border-l-2 border-slate-200">
                <p className="text-sm font-medium">{edu.degree}</p>
                <p className="text-xs text-slate-500">{edu.institution} · {edu.year}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Template 8: Elegant — Serif fonts, gold accents, refined spacing
function ElegantTemplate({ content }: { content: ResumeContent }) {
  return (
    <div className="bg-white shadow-lg rounded-lg max-w-[800px] mx-auto text-black p-10" style={{ fontFamily: 'Georgia, serif' }}>
      <div className="text-center mb-8 pb-6 border-b border-[#c9a96e]">
        <h1 className="text-3xl font-normal tracking-wide text-slate-800">{content.name || 'Your Name'}</h1>
        <p className="text-[#c9a96e] text-sm mt-2 tracking-widest uppercase">{content.role || 'Your Role'}</p>
        <div className="flex justify-center gap-6 mt-3 text-xs text-slate-500">
          {content.email && <span>{content.email}</span>}
          {content.phone && <span>{content.phone}</span>}
          {content.location && <span>{content.location}</span>}
        </div>
      </div>
      {content.summary && (
        <div className="mb-8 text-center max-w-lg mx-auto">
          <p className="text-sm text-slate-600 leading-relaxed italic">{content.summary}</p>
        </div>
      )}
      {content.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-center text-xs uppercase tracking-[0.3em] text-[#c9a96e] mb-4">Professional Experience</h2>
          {content.experience.map((exp, i) => (
            <div key={i} className="mb-5">
              <div className="flex justify-between items-baseline">
                <h3 className="text-sm font-semibold" style={{ fontFamily: 'Georgia, serif' }}>{exp.title}</h3>
                <span className="text-xs text-slate-400 italic">{exp.startDate} – {exp.endDate}</span>
              </div>
              <p className="text-xs text-[#c9a96e]">{exp.company}</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      )}
      <div className="grid grid-cols-2 gap-8">
        {content.education.length > 0 && (
          <div>
            <h2 className="text-xs uppercase tracking-[0.3em] text-[#c9a96e] mb-3">Education</h2>
            {content.education.map((edu, i) => (
              <div key={i} className="mb-2">
                <p className="text-sm font-medium">{edu.degree}</p>
                <p className="text-xs text-slate-500">{edu.institution}, {edu.year}</p>
              </div>
            ))}
          </div>
        )}
        <div>
          {content.skills.length > 0 && (
            <div className="mb-4">
              <h2 className="text-xs uppercase tracking-[0.3em] text-[#c9a96e] mb-3">Expertise</h2>
              <p className="text-xs text-slate-600 leading-relaxed">{content.skills.join(' · ')}</p>
            </div>
          )}
          {content.languages.length > 0 && (
            <div>
              <h2 className="text-xs uppercase tracking-[0.3em] text-[#c9a96e] mb-3">Languages</h2>
              <p className="text-xs text-slate-600">{content.languages.join(' · ')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Template 9: Compact — Dense one-page layout, maximizes content in small space
function CompactTemplate({ content }: { content: ResumeContent }) {
  return (
    <div className="bg-white shadow-lg rounded-lg max-w-[800px] mx-auto text-black p-6">
      <div className="flex justify-between items-start mb-4 pb-3 border-b">
        <div>
          <h1 className="text-xl font-bold">{content.name || 'Your Name'}</h1>
          <p className="text-sm text-blue-600">{content.role || 'Your Role'}</p>
        </div>
        <div className="text-right text-[11px] text-slate-500">
          {content.email && <p>{content.email}</p>}
          {content.phone && <p>{content.phone}</p>}
          {content.location && <p>{content.location}</p>}
        </div>
      </div>
      {content.summary && <p className="text-[11px] text-slate-600 mb-3 leading-relaxed">{content.summary}</p>}
      <div className="grid grid-cols-[1fr_200px] gap-4">
        <div>
          {content.experience.length > 0 && (
            <div className="mb-3">
              <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Experience</h2>
              {content.experience.map((exp, i) => (
                <div key={i} className="mb-2.5">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-semibold">{exp.title}</span>
                    <span className="text-[10px] text-slate-400">{exp.startDate}–{exp.endDate}</span>
                  </div>
                  <p className="text-[10px] text-blue-600">{exp.company}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          )}
          {content.education.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Education</h2>
              {content.education.map((edu, i) => (
                <div key={i} className="flex justify-between items-baseline mb-1">
                  <span className="text-xs font-medium">{edu.degree} <span className="text-slate-400 font-normal">— {edu.institution}</span></span>
                  <span className="text-[10px] text-slate-400">{edu.year}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border-l pl-4">
          {content.skills.length > 0 && (
            <div className="mb-3">
              <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Skills</h2>
              <div className="flex flex-wrap gap-1">
                {content.skills.map((s, i) => (
                  <span key={i} className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">{s}</span>
                ))}
              </div>
            </div>
          )}
          {content.languages.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Languages</h2>
              {content.languages.map((l, i) => <p key={i} className="text-[10px] mb-0.5">{l}</p>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Template 10: Bold — Large typography, strong color blocks, high impact
function BoldTemplate({ content }: { content: ResumeContent }) {
  return (
    <div className="bg-white shadow-lg rounded-lg max-w-[800px] mx-auto text-black">
      <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white p-8 rounded-t-lg">
        <h1 className="text-4xl font-black">{content.name || 'YOUR NAME'}</h1>
        <p className="text-xl font-light mt-1 text-violet-100">{content.role || 'Your Role'}</p>
        <div className="flex gap-4 mt-4 text-xs text-violet-200">
          {content.email && <span>{content.email}</span>}
          {content.phone && <span>{content.phone}</span>}
          {content.location && <span>{content.location}</span>}
        </div>
      </div>
      <div className="p-8">
        {content.summary && (
          <div className="mb-6 p-4 bg-violet-50 rounded-xl border-l-4 border-violet-600">
            <p className="text-sm text-slate-700 leading-relaxed">{content.summary}</p>
          </div>
        )}
        {content.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-black text-violet-600 mb-4">EXPERIENCE</h2>
            {content.experience.map((exp, i) => (
              <div key={i} className="mb-4 pl-4 border-l-2 border-violet-200">
                <h3 className="font-bold">{exp.title}</h3>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-violet-600 font-semibold">{exp.company}</p>
                  <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">{exp.startDate} – {exp.endDate}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{exp.description}</p>
              </div>
            ))}
          </div>
        )}
        <div className="grid grid-cols-2 gap-6">
          {content.education.length > 0 && (
            <div>
              <h2 className="text-sm font-black text-violet-600 mb-3">EDUCATION</h2>
              {content.education.map((edu, i) => (
                <div key={i} className="mb-2">
                  <p className="text-sm font-bold">{edu.degree}</p>
                  <p className="text-xs text-slate-500">{edu.institution} · {edu.year}</p>
                </div>
              ))}
            </div>
          )}
          <div>
            {content.skills.length > 0 && (
              <div className="mb-4">
                <h2 className="text-sm font-black text-violet-600 mb-3">SKILLS</h2>
                <div className="flex flex-wrap gap-1.5">
                  {content.skills.map((s, i) => (
                    <span key={i} className="text-xs bg-gradient-to-r from-violet-100 to-fuchsia-100 text-violet-700 px-2.5 py-1 rounded-full font-medium">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {content.languages.length > 0 && (
              <div>
                <h2 className="text-sm font-black text-violet-600 mb-3">LANGUAGES</h2>
                <div className="flex flex-wrap gap-1.5">
                  {content.languages.map((l, i) => (
                    <span key={i} className="text-xs bg-violet-50 text-violet-600 px-2.5 py-1 rounded-full">{l}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
