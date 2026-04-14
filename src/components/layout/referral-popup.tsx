'use client';

import { useState, useEffect } from 'react';
import { X, Gift, Copy, Check, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function ReferralPopup() {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    // Show after 3rd application
    const checkTrigger = async () => {
      try {
        const dismissed = localStorage.getItem('referral-popup-dismissed');
        if (dismissed) return;

        const res = await fetch('/api/applications');
        const apps = await res.json();
        if (Array.isArray(apps) && apps.length >= 3) {
          const shown = localStorage.getItem('referral-popup-shown');
          if (!shown) {
            setTimeout(() => setShow(true), 2000);
            localStorage.setItem('referral-popup-shown', 'true');
          }
        }

        const profileRes = await fetch('/api/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'get' }),
        });
        const profile = await profileRes.json();
        if (profile?.user_id) setUserId(profile.user_id);
      } catch {}
    };
    checkTrigger();
  }, []);

  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/register?ref=${userId}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const dismiss = () => {
    setShow(false);
    localStorage.setItem('referral-popup-dismissed', 'true');
  };

  if (!show) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[80] backdrop-blur-sm" onClick={dismiss} />
      <div className="fixed bottom-24 right-6 z-[81] w-[340px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              <span className="font-bold">Share & Get Rewarded!</span>
            </div>
            <button onClick={dismiss} className="hover:bg-white/20 rounded p-1"><X className="h-4 w-4" /></button>
          </div>
        </div>
        <div className="p-4 space-y-3">
          <p className="text-sm text-muted-foreground">
            Love AutoApply AI? Share with friends and get <strong className="text-green-600">5 free applications</strong> for each signup!
          </p>
          <div className="flex gap-2">
            <input
              readOnly
              value={referralLink}
              className="flex-1 text-xs px-3 py-2 rounded-lg border bg-slate-50 dark:bg-slate-800 font-mono truncate"
            />
            <Button size="sm" onClick={copyLink}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-xs"
              onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('I\'m using AutoApply AI to automate my job search — AI resumes, cover letters, and auto-apply! Try it free:')}&url=${encodeURIComponent(referralLink)}`, '_blank')}
            >
              <Share2 className="h-3 w-3 mr-1" />Twitter
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-xs"
              onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`, '_blank')}
            >
              <Share2 className="h-3 w-3 mr-1" />LinkedIn
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-xs"
              onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent('Check out AutoApply AI — AI-powered job applications!')}`, '_blank')}
            >
              <Share2 className="h-3 w-3 mr-1" />Telegram
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
