'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const TEMPLATES = [
  { id: 'modern', name: 'Modern', colors: ['#3b82f6', '#f8fafc'], desc: 'Blue accents, clean sections' },
  { id: 'simple', name: 'Simple', colors: ['#1e293b', '#ffffff'], desc: 'No colors, centered' },
  { id: 'executive', name: 'Executive', colors: ['#1e293b', '#f1f5f9'], desc: 'Dark header, professional' },
  { id: 'creative', name: 'Creative', colors: ['#4f46e5', '#eef2ff'], desc: 'Sidebar, progress bars' },
  { id: 'minimal', name: 'Minimal', colors: ['#94a3b8', '#ffffff'], desc: 'Ultra-light, grid' },
  { id: 'professional', name: 'Professional', colors: ['#1e3a5f', '#eff6ff'], desc: 'Navy, two-column' },
  { id: 'tech', name: 'Tech', colors: ['#0f172a', '#10b981'], desc: 'Dark, monospace, code' },
  { id: 'elegant', name: 'Elegant', colors: ['#c9a96e', '#fffbeb'], desc: 'Serif, gold accents' },
  { id: 'compact', name: 'Compact', colors: ['#3b82f6', '#f8fafc'], desc: 'Dense, one-page' },
  { id: 'bold', name: 'Bold', colors: ['#7c3aed', '#f5f3ff'], desc: 'Gradient, large type' },
  { id: 'berlin', name: 'Berlin', colors: ['#0d9488', '#f0fdfa'], desc: 'Teal sidebar, skill dots' },
  { id: 'tokyo', name: 'Tokyo', colors: ['#dc2626', '#ffffff'], desc: 'Red accent, minimal' },
  { id: 'stockholm', name: 'Stockholm', colors: ['#2563eb', '#eff6ff'], desc: 'Blue sidebar, skill bars' },
  { id: 'amsterdam', name: 'Amsterdam', colors: ['#ea580c', '#fff7ed'], desc: 'Orange, timeline dots' },
  { id: 'dubai', name: 'Dubai', colors: ['#18181b', '#d4a853'], desc: 'Black & gold, luxury' },
  { id: 'milan', name: 'Milan', colors: ['#f43f5e', '#fff1f2'], desc: 'Fashion, thin fonts' },
  { id: 'vancouver', name: 'Vancouver', colors: ['#16a34a', '#f0fdf4'], desc: 'Green, card-based' },
  { id: 'seoul', name: 'Seoul', colors: ['#a855f7', '#faf5ff'], desc: 'Purple/pink, K-style' },
];

interface TemplateGalleryProps {
  selected: string;
  onSelect: (id: string) => void;
}

export function TemplateGallery({ selected, onSelect }: TemplateGalleryProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {TEMPLATES.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelect(t.id)}
          className={cn(
            'relative border-2 rounded-xl p-2 transition-all text-left hover:shadow-md',
            selected === t.id ? 'border-blue-500 shadow-blue-100 dark:shadow-blue-900 shadow-md' : 'border-transparent hover:border-slate-200'
          )}
        >
          {/* Mini preview */}
          <div className="aspect-[3/4] rounded-lg overflow-hidden mb-2 relative">
            <div className="absolute inset-0" style={{ background: t.colors[1] }}>
              {/* Header block */}
              <div className="h-[30%]" style={{ background: t.id === 'minimal' || t.id === 'simple' ? t.colors[1] : t.colors[0] }}>
                <div className="p-2">
                  <div className="h-1.5 w-12 rounded-full bg-white/30 mb-1" />
                  <div className="h-1 w-8 rounded-full bg-white/20" />
                </div>
              </div>
              {/* Content lines */}
              <div className="p-2 space-y-1.5">
                <div className="h-1 w-full rounded-full" style={{ background: t.colors[0], opacity: 0.15 }} />
                <div className="h-1 w-3/4 rounded-full" style={{ background: t.colors[0], opacity: 0.1 }} />
                <div className="h-1 w-5/6 rounded-full" style={{ background: t.colors[0], opacity: 0.1 }} />
                <div className="h-0.5" />
                <div className="h-1 w-full rounded-full" style={{ background: t.colors[0], opacity: 0.08 }} />
                <div className="h-1 w-2/3 rounded-full" style={{ background: t.colors[0], opacity: 0.08 }} />
              </div>
            </div>
            {selected === t.id && (
              <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
                <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
              </div>
            )}
          </div>
          <p className="text-xs font-medium truncate">{t.name}</p>
          <p className="text-[10px] text-muted-foreground truncate">{t.desc}</p>
        </button>
      ))}
    </div>
  );
}
