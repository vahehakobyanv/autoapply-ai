'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-7 w-40 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="h-4 w-60 bg-slate-100 dark:bg-slate-800 rounded mt-2" />
        </div>
        <div className="h-10 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded mb-2" />
              <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="h-5 w-36 bg-slate-200 dark:bg-slate-700 rounded" />
        </CardHeader>
        <CardContent>
          <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded" />
        </CardContent>
      </Card>
    </div>
  );
}

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardContent className="pt-4">
            <div className="h-5 w-48 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
            <div className="h-3 w-32 bg-slate-100 dark:bg-slate-800 rounded mb-1" />
            <div className="h-3 w-64 bg-slate-100 dark:bg-slate-800 rounded" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
