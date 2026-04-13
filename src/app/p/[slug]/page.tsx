import { createServerSupabaseClient as createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from('portfolios')
    .select('title, bio')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  return {
    title: data?.title || 'Portfolio',
    description: data?.bio || '',
  };
}

export default async function PortfolioPublicPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: portfolio } = await supabase
    .from('portfolios')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (!portfolio) notFound();

  const sections = (portfolio.sections || []) as {
    type: string;
    visible: boolean;
    content: Record<string, unknown>;
  }[];

  const theme = portfolio.theme || 'modern';
  const themeColors: Record<string, { bg: string; accent: string; text: string }> = {
    minimal: { bg: 'bg-white dark:bg-slate-950', accent: 'text-slate-900', text: 'text-slate-600' },
    modern: { bg: 'bg-slate-50 dark:bg-slate-900', accent: 'text-blue-600', text: 'text-slate-600' },
    bold: { bg: 'bg-purple-50 dark:bg-slate-900', accent: 'text-purple-600', text: 'text-slate-600' },
    elegant: { bg: 'bg-amber-50/30 dark:bg-slate-900', accent: 'text-amber-700', text: 'text-slate-600' },
  };
  const t = themeColors[theme] || themeColors.modern;

  return (
    <div className={`min-h-screen ${t.bg}`}>
      {sections.filter((s) => s.visible).map((section, i) => {
        if (section.type === 'hero') {
          const content = section.content as { headline?: string; subheadline?: string };
          return (
            <section key={i} className="py-20 px-6 text-center">
              <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${t.accent}`}>
                {content.headline || portfolio.title}
              </h1>
              <p className={`text-lg md:text-xl max-w-2xl mx-auto ${t.text}`}>
                {content.subheadline || portfolio.bio}
              </p>
            </section>
          );
        }

        if (section.type === 'about') {
          const content = section.content as { text?: string };
          return (
            <section key={i} className="py-16 px-6 max-w-3xl mx-auto">
              <h2 className={`text-2xl font-bold mb-4 ${t.accent}`}>About</h2>
              <p className={`text-base leading-relaxed ${t.text}`}>{content.text}</p>
            </section>
          );
        }

        if (section.type === 'experience') {
          const content = section.content as { items?: { title: string; company: string; period: string; description: string }[] };
          return (
            <section key={i} className="py-16 px-6 max-w-3xl mx-auto">
              <h2 className={`text-2xl font-bold mb-6 ${t.accent}`}>Experience</h2>
              <div className="space-y-6">
                {content.items?.map((exp, j) => (
                  <div key={j} className="border-l-2 border-blue-200 pl-4">
                    <h3 className="font-semibold">{exp.title}</h3>
                    <p className="text-sm text-muted-foreground">{exp.company} &middot; {exp.period}</p>
                    <p className={`mt-1 text-sm ${t.text}`}>{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (section.type === 'skills') {
          const content = section.content as { categories?: { name: string; items: string[] }[] };
          return (
            <section key={i} className="py-16 px-6 max-w-3xl mx-auto">
              <h2 className={`text-2xl font-bold mb-6 ${t.accent}`}>Skills</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {content.categories?.map((cat, j) => (
                  <div key={j}>
                    <h3 className="font-semibold mb-2">{cat.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {cat.items?.map((skill, k) => (
                        <span key={k} className="px-3 py-1 bg-white dark:bg-slate-800 border rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (section.type === 'projects') {
          const content = section.content as { items?: { name: string; description: string; tech: string[] }[] };
          return (
            <section key={i} className="py-16 px-6 max-w-3xl mx-auto">
              <h2 className={`text-2xl font-bold mb-6 ${t.accent}`}>Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.items?.map((proj, j) => (
                  <div key={j} className="border rounded-xl p-5 bg-white dark:bg-slate-800">
                    <h3 className="font-semibold mb-1">{proj.name}</h3>
                    <p className={`text-sm mb-3 ${t.text}`}>{proj.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {proj.tech?.map((tech, k) => (
                        <span key={k} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs">{tech}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (section.type === 'contact') {
          const content = section.content as { email?: string; message?: string };
          return (
            <section key={i} className="py-16 px-6 max-w-3xl mx-auto text-center">
              <h2 className={`text-2xl font-bold mb-4 ${t.accent}`}>Get in Touch</h2>
              <p className={`mb-4 ${t.text}`}>{content.message}</p>
              {content.email && (
                <a href={`mailto:${content.email}`} className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                  Send Email
                </a>
              )}
            </section>
          );
        }

        return null;
      })}

      <footer className="py-8 text-center text-sm text-muted-foreground border-t">
        Built with <a href="https://autoapply-ai-vert.vercel.app" className="text-blue-500 hover:underline">AutoApply AI</a>
      </footer>
    </div>
  );
}
