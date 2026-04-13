'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Building2, Search, Loader2, Star, Users, MapPin, Briefcase, ThumbsUp, ThumbsDown,
} from 'lucide-react';
import { toast } from 'sonner';
import type { CompanyInsight } from '@/types';

export default function CompanyInsightsPage() {
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<CompanyInsight | null>(null);
  const [history, setHistory] = useState<CompanyInsight[]>([]);

  const search = async () => {
    if (!company.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/company-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company: company.trim() }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setInsight(data);
      setHistory((prev) => {
        const filtered = prev.filter((h) => h.company_name !== data.company_name);
        return [data, ...filtered].slice(0, 10);
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to get insights');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Company Insights</h1>
        <p className="text-muted-foreground">AI-powered research on companies: culture, salaries, interviews</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && search()}
                placeholder="Enter company name (e.g. Yandex, EPAM, Google)"
                className="pl-10"
              />
            </div>
            <Button onClick={search} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              <span className="ml-2">Research</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {insight && (
        <div className="space-y-4">
          {/* Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold">{insight.company_name}</h2>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    {insight.industry && (
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />{insight.industry}
                      </span>
                    )}
                    {insight.headquarters && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />{insight.headquarters}
                      </span>
                    )}
                    {insight.employee_count && (
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />{insight.employee_count} employees
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-lg font-bold">{insight.rating}</span>
                  <span className="text-sm text-muted-foreground">/5</span>
                </div>
              </div>
              <p className="mt-3 text-sm">{insight.summary}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Culture */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Culture & Environment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{insight.culture}</p>
              </CardContent>
            </Card>

            {/* Salary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Salary Range</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{insight.salary_range}</p>
              </CardContent>
            </Card>

            {/* Interview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Interview Process</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{insight.interview_process}</p>
              </CardContent>
            </Card>

            {/* Pros & Cons */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Pros & Cons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  {insight.pros?.map((pro, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm mb-1">
                      <ThumbsUp className="h-3 w-3 text-green-500" />
                      <span>{pro}</span>
                    </div>
                  ))}
                </div>
                <div>
                  {insight.cons?.map((con, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm mb-1">
                      <ThumbsDown className="h-3 w-3 text-red-500" />
                      <span>{con}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Search History */}
      {history.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Searches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {history.map((h) => (
                <Button
                  key={h.company_name}
                  variant="outline"
                  size="sm"
                  onClick={() => setInsight(h)}
                >
                  {h.company_name}
                  <Star className="h-3 w-3 ml-1 text-yellow-500" />
                  {h.rating}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
