'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Globe, Loader2, Sparkles, Eye, ExternalLink, Palette,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Portfolio } from '@/types';

const THEMES = [
  { id: 'minimal', name: 'Minimal', color: 'bg-slate-100' },
  { id: 'modern', name: 'Modern', color: 'bg-blue-100' },
  { id: 'bold', name: 'Bold', color: 'bg-purple-100' },
  { id: 'elegant', name: 'Elegant', color: 'bg-amber-100' },
];

export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('modern');

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      const res = await fetch('/api/portfolio');
      const data = await res.json();
      if (Array.isArray(data)) setPortfolios(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const generatePortfolio = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate', theme: selectedTheme }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPortfolios((prev) => [data, ...prev]);
      toast.success('Portfolio generated!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate');
    } finally {
      setGenerating(false);
    }
  };

  const togglePublish = async (portfolio: Portfolio) => {
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...portfolio, published: !portfolio.published }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPortfolios((prev) => prev.map((p) => (p.id === data.id ? data : p)));
      toast.success(data.published ? 'Portfolio published!' : 'Portfolio unpublished');
    } catch {
      toast.error('Failed to update');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Portfolio Generator</h1>
          <p className="text-muted-foreground">Create a personal portfolio site from your profile</p>
        </div>
      </div>

      {/* Generate Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Generate New Portfolio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Choose Theme</label>
            <div className="flex gap-3">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                    selectedTheme === theme.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                      : 'border-transparent bg-slate-50 dark:bg-slate-800'
                  }`}
                >
                  <Palette className="h-4 w-4" />
                  {theme.name}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={generatePortfolio} disabled={generating} size="lg">
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating with AI...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Portfolio from Profile
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Existing Portfolios */}
      {portfolios.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Your Portfolios</h2>
          {portfolios.map((portfolio) => (
            <Card key={portfolio.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{portfolio.title}</h3>
                      <Badge variant={portfolio.published ? 'default' : 'secondary'}>
                        {portfolio.published ? 'Published' : 'Draft'}
                      </Badge>
                      <Badge variant="outline">{portfolio.theme}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{portfolio.bio}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Globe className="h-3 w-3" />
                      <span>/{portfolio.slug}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => togglePublish(portfolio)}>
                      {portfolio.published ? 'Unpublish' : 'Publish'}
                    </Button>
                    {portfolio.published && (
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Section Preview */}
                {portfolio.sections && (
                  <div className="mt-4 flex gap-2">
                    {(portfolio.sections as { type: string; visible: boolean }[]).map((section, i) => (
                      <Badge
                        key={i}
                        variant={section.visible ? 'secondary' : 'outline'}
                        className="text-xs capitalize"
                      >
                        {section.type}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
