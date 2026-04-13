'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const CURRENT_VERSION = 'v3.0';
const HIGHLIGHTS = [
  'AI Chat Assistant — ask anything about your job search',
  'Smart Reminders — follow-up nudges and streak alerts',
  'Salary Negotiation Coach with counter-offer scripts',
  'Advanced Analytics with conversion funnels',
  'Skill Gap Dashboard across all applications',
  'Social Share Cards for LinkedIn & Twitter',
];

export function WhatsNew() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('whats-new-seen');
    if (seen !== CURRENT_VERSION) {
      const timer = setTimeout(() => setShow(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem('whats-new-seen', CURRENT_VERSION);
    setShow(false);
  };

  if (!show) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[90] backdrop-blur-sm" onClick={dismiss} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[91] w-[400px] max-w-[90vw] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <span className="font-bold">What&apos;s New in {CURRENT_VERSION}</span>
            </div>
            <button onClick={dismiss} className="hover:bg-white/20 rounded p-1"><X className="h-4 w-4" /></button>
          </div>
        </div>
        <div className="p-6">
          <ul className="space-y-3 mb-6">
            {HIGHLIGHTS.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-green-500 font-bold mt-0.5">+</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <Button onClick={dismiss} className="flex-1">Got it!</Button>
            <Link href="/changelog">
              <Button variant="outline" onClick={dismiss}>
                Full Changelog <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
