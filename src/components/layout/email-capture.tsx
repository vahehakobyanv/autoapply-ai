'use client';

import { useState } from 'react';
import { Mail, ArrowRight, Check } from 'lucide-react';

export function EmailCapture() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    // Store in localStorage for now (could connect to Mailchimp, ConvertKit, etc.)
    const emails = JSON.parse(localStorage.getItem('captured-emails') || '[]');
    emails.push({ email, date: new Date().toISOString() });
    localStorage.setItem('captured-emails', JSON.stringify(emails));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center">
        <Check className="h-8 w-8 mx-auto mb-2 text-green-500" />
        <p className="font-semibold text-green-700 dark:text-green-300">You&apos;re in!</p>
        <p className="text-sm text-green-600 dark:text-green-400">Check your inbox for job search tips.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-2">
        <Mail className="h-5 w-5 text-blue-600" />
        <h3 className="font-semibold">Get Job Search Tips</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Weekly tips on resumes, interviews, and landing your dream job. Free forever.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 px-4 py-2 rounded-lg border text-sm bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 text-sm font-medium">
          Subscribe <ArrowRight className="h-3 w-3" />
        </button>
      </form>
    </div>
  );
}
