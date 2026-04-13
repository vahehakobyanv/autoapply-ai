'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, Search, Lightbulb, RefreshCw, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Recommendation { title: string; company_type: string; why: string; search_query: string; }

export default function RecommendationsPage() {
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/recommendations');
      const data = await res.json();
      if (data.recommendations) setRecs(data.recommendations);
      if (data.insights) setInsights(data.insights);
    } catch { toast.error('Failed to load recommendations'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRecs(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">AI Recommendations</h1><p className="text-muted-foreground">Personalized job suggestions based on your profile and history</p></div>
        <Button variant="outline" onClick={fetchRecs} disabled={loading}><RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />Refresh</Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /><span className="ml-3 text-muted-foreground">AI is analyzing your profile...</span></div>
      ) : (
        <>
          {insights.length > 0 && (
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800">
              <CardContent className="pt-6">
                {insights.map((insight, i) => (
                  <div key={i} className="flex items-start gap-2"><Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" /><p className="text-sm">{insight}</p></div>
                ))}
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recs.map((rec, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{rec.title}</h3>
                      <Badge variant="outline" className="text-xs mt-1">{rec.company_type}</Badge>
                    </div>
                    <Sparkles className="h-4 w-4 text-yellow-500 shrink-0" />
                  </div>
                  <p className="text-sm text-muted-foreground">{rec.why}</p>
                  <Link href={`/jobs?search=${encodeURIComponent(rec.search_query)}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      <Search className="h-3 w-3 mr-2" />Search: {rec.search_query}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {recs.length === 0 && (
            <Card><CardContent className="py-12 text-center">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-1">Complete your profile first</h3>
              <p className="text-sm text-muted-foreground mb-4">AI needs your skills and experience to make recommendations</p>
              <Link href="/settings"><Button>Complete Profile <ArrowRight className="h-4 w-4 ml-2" /></Button></Link>
            </CardContent></Card>
          )}
        </>
      )}
    </div>
  );
}
