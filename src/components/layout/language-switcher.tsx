'use client';

import { useStore } from '@/store/use-store';
import { LOCALES, type Locale } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';

export function LanguageSwitcher({ variant = 'select' }: { variant?: 'select' | 'buttons' }) {
  const { locale, setLocale } = useStore();

  if (variant === 'buttons') {
    return (
      <div className="flex gap-1">
        {LOCALES.map((l) => (
          <Button
            key={l.code}
            variant={locale === l.code ? 'default' : 'ghost'}
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => setLocale(l.code)}
          >
            {l.flag}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <Select value={locale} onValueChange={(v) => { if (v) setLocale(v as Locale); }}>
      <SelectTrigger className="w-[130px] h-8 text-xs">
        <Globe className="h-3 w-3 mr-1" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {LOCALES.map((l) => (
          <SelectItem key={l.code} value={l.code}>
            {l.flag} {l.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
