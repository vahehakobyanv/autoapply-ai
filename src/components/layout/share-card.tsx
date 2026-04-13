'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, ExternalLink, Link, Copy, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function ShareCard() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ share_text: string; share_url: string; stats: { total: number; interviews: number; offers: number }; level: number; streak: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const load = async () => {
    if (data) { setOpen(!open); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/share');
      const d = await res.json();
      if (!d.error) { setData(d); setOpen(true); }
    } catch {} finally { setLoading(false); }
  };

  const copyText = async () => {
    if (!data) return;
    await navigator.clipboard.writeText(data.share_text + '\n' + data.share_url);
    setCopied(true);
    toast.success('Copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinkedIn = () => {
    if (!data) return;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(data.share_url)}&summary=${encodeURIComponent(data.share_text)}`, '_blank');
  };

  const shareTwitter = () => {
    if (!data) return;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(data.share_text)}&url=${encodeURIComponent(data.share_url)}`, '_blank');
  };

  return (
    <div className="relative">
      <Button variant="outline" size="sm" onClick={load} disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
        <span className="ml-2">Share Progress</span>
      </Button>

      {open && data && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-slate-900 border rounded-xl shadow-xl z-50 overflow-hidden">
            {/* Preview card */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-5 text-white">
              <p className="text-xs opacity-70 mb-2">My Job Search Progress</p>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="text-center"><div className="text-2xl font-bold">{data.stats.total}</div><div className="text-[10px] opacity-70">Applied</div></div>
                <div className="text-center"><div className="text-2xl font-bold">{data.stats.interviews}</div><div className="text-[10px] opacity-70">Interviews</div></div>
                <div className="text-center"><div className="text-2xl font-bold">{data.stats.offers}</div><div className="text-[10px] opacity-70">Offers</div></div>
              </div>
              <div className="flex items-center gap-3 text-xs opacity-70">
                <span>Level {data.level}</span>
                <span>{data.streak}-day streak</span>
              </div>
            </div>
            <div className="p-3 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1" onClick={shareLinkedIn}><Link className="h-3 w-3 mr-1" />LinkedIn</Button>
              <Button size="sm" variant="outline" className="flex-1" onClick={shareTwitter}><ExternalLink className="h-3 w-3 mr-1" />Twitter</Button>
              <Button size="sm" variant="outline" onClick={copyText}>{copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
