import { createServerSupabaseClient as createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Props { params: Promise<{ id: string }>; }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('resumes').select('title, content').eq('id', id).single();
  const content = data?.content as Record<string, string> | null;
  return { title: content?.name ? `${content.name} — Resume` : 'Resume', description: content?.summary || '' };
}

export default async function PublicResumePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: resume } = await supabase.from('resumes').select('*').eq('id', id).single();

  if (!resume) notFound();

  const c = (resume.content || {}) as {
    name?: string; role?: string; email?: string; phone?: string; location?: string; summary?: string;
    experience?: { title: string; company: string; startDate: string; endDate: string; description: string }[];
    education?: { degree: string; institution: string; year: string }[];
    skills?: string[]; languages?: string[];
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4">
      <div className="max-w-[800px] mx-auto bg-white dark:bg-slate-900 shadow-xl rounded-xl p-8 print:shadow-none print:rounded-none">
        {/* Header */}
        <div className="border-b pb-6 mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{c.name || 'Name'}</h1>
          <p className="text-lg text-blue-600 mt-1">{c.role || 'Role'}</p>
          <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
            {c.email && <span>{c.email}</span>}
            {c.phone && <span>{c.phone}</span>}
            {c.location && <span>{c.location}</span>}
          </div>
        </div>

        {/* Summary */}
        {c.summary && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Summary</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{c.summary}</p>
          </div>
        )}

        {/* Experience */}
        {c.experience && c.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Experience</h2>
            {c.experience.map((exp, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold text-sm">{exp.title}</h3>
                  <span className="text-xs text-slate-400">{exp.startDate} – {exp.endDate}</span>
                </div>
                <p className="text-xs text-blue-600 font-medium">{exp.company}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {c.education && c.education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Education</h2>
            {c.education.map((edu, i) => (
              <div key={i} className="mb-2">
                <p className="text-sm font-medium">{edu.degree}</p>
                <p className="text-xs text-slate-500">{edu.institution} — {edu.year}</p>
              </div>
            ))}
          </div>
        )}

        {/* Skills & Languages */}
        <div className="grid grid-cols-2 gap-6">
          {c.skills && c.skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Skills</h2>
              <div className="flex flex-wrap gap-1.5">
                {c.skills.map((s, i) => (
                  <span key={i} className="text-xs bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">{s}</span>
                ))}
              </div>
            </div>
          )}
          {c.languages && c.languages.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Languages</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">{c.languages.join(' · ')}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t text-center">
          <a href="https://autoapply-ai-vert.vercel.app?ref=resume" className="text-xs text-blue-500 hover:underline">
            Created with AutoApply AI
          </a>
        </div>
      </div>
    </div>
  );
}
