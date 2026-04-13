import { createServiceRoleClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Zap, Mail, Phone, MapPin } from 'lucide-react';
import type { ResumeContent } from '@/types';

export default async function PublicResumePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServiceRoleClient();

  const { data: resume } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', id)
    .single();

  if (!resume) {
    notFound();
  }

  const content: ResumeContent = resume.content;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Branding banner */}
        <div className="flex items-center justify-center gap-2 mb-4 text-sm text-slate-400">
          <Zap className="h-4 w-4" />
          <span>Created with AutoApply AI</span>
        </div>

        {/* Resume */}
        <div className="bg-white dark:bg-slate-950 rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-10 text-white">
            <h1 className="text-3xl font-bold">{content.name || 'Name'}</h1>
            <p className="text-blue-100 text-lg mt-1">{content.role || 'Role'}</p>
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-blue-200">
              {content.email && (
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" /> {content.email}
                </span>
              )}
              {content.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" /> {content.phone}
                </span>
              )}
              {content.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {content.location}
                </span>
              )}
            </div>
          </div>

          <div className="px-8 py-8 space-y-8">
            {/* Summary */}
            {content.summary && (
              <div>
                <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">About</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{content.summary}</p>
              </div>
            )}

            {/* Experience */}
            {content.experience?.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4">Experience</h2>
                <div className="space-y-5">
                  {content.experience.map((exp, i) => (
                    <div key={i} className="relative pl-6 border-l-2 border-blue-100 dark:border-blue-900">
                      <div className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-blue-600" />
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">{exp.title}</h3>
                          <p className="text-sm text-slate-500">{exp.company}</p>
                        </div>
                        <span className="text-xs text-slate-400 whitespace-nowrap">
                          {exp.startDate} — {exp.endDate}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {content.education?.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-3">Education</h2>
                {content.education.map((edu, i) => (
                  <div key={i} className="flex justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{edu.degree}</h3>
                      <p className="text-sm text-slate-500">{edu.institution}</p>
                    </div>
                    <span className="text-sm text-slate-400">{edu.year}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Skills */}
            {content.skills?.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-3">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {content.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-sm px-3 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {content.languages?.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">Languages</h2>
                <p className="text-slate-600 dark:text-slate-400">{content.languages.join(' · ')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center mt-6">
          <a
            href="https://autoapply-ai-vert.vercel.app/register"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Zap className="h-4 w-4" />
            Create your resume with AutoApply AI
          </a>
        </div>
      </div>
    </div>
  );
}
