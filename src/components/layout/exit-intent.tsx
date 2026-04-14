'use client';

import { useState, useEffect } from 'react';
import { X, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function ExitIntent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('exit-intent-dismissed');
    if (dismissed) return;

    const handler = (e: MouseEvent) => {
      if (e.clientY <= 5) {
        setShow(true);
        document.removeEventListener('mouseleave', handler);
      }
    };

    // Only trigger on landing page, after 5 seconds
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handler);
    }, 5000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handler);
    };
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem('exit-intent-dismissed', 'true');
  };

  if (!show) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm" onClick={dismiss} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[440px] max-w-[90vw] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-8 text-white text-center">
          <Zap className="h-12 w-12 mx-auto mb-3 opacity-80" />
          <h2 className="text-2xl font-bold mb-2">Wait! Don&apos;t leave empty-handed</h2>
          <p className="text-sm text-blue-100">Get 5 free AI-powered job applications. No credit card needed.</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2"><span className="text-green-500 font-bold">&#10003;</span> AI generates your resume in 30 seconds</div>
            <div className="flex items-center gap-2"><span className="text-green-500 font-bold">&#10003;</span> Auto-apply to hh.ru and staff.am</div>
            <div className="flex items-center gap-2"><span className="text-green-500 font-bold">&#10003;</span> Track all applications in one place</div>
            <div className="flex items-center gap-2"><span className="text-green-500 font-bold">&#10003;</span> AI interview prep and salary negotiation</div>
          </div>
          <Link href="/register" onClick={dismiss}>
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              Start Free Now <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
          <button onClick={dismiss} className="w-full text-center text-xs text-muted-foreground hover:text-foreground">
            No thanks, I&apos;ll apply manually
          </button>
        </div>
      </div>
    </>
  );
}
