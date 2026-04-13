'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SHORTCUTS: Record<string, string> = {
  'g d': '/dashboard',
  'g j': '/jobs',
  'g t': '/tracker',
  'g r': '/resume',
  'g a': '/analytics',
  'g c': '/contacts',
  'g s': '/settings',
  'g i': '/interview-simulator',
  'g p': '/portfolio',
};

export function KeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    let buffer = '';
    let timer: ReturnType<typeof setTimeout>;

    const handler = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      clearTimeout(timer);
      buffer += e.key;

      // Check for 2-char shortcuts like "g d"
      const combo = buffer.length >= 2 ? buffer.slice(-3) : buffer;
      const route = SHORTCUTS[combo] || SHORTCUTS[combo.replace(/\s/g, ' ')];

      if (route) {
        e.preventDefault();
        router.push(route);
        buffer = '';
        return;
      }

      // Single key shortcuts
      if (e.key === '?' && buffer.length === 1) {
        // Could show shortcuts modal
        buffer = '';
        return;
      }

      // Reset buffer after 800ms
      timer = setTimeout(() => { buffer = ''; }, 800);
    };

    document.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener('keydown', handler);
      clearTimeout(timer);
    };
  }, [router]);

  return null;
}
