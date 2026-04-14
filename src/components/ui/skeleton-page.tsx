'use client';

export function SkeletonPage() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-4 w-72 bg-slate-100 dark:bg-slate-800 rounded" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800 rounded-xl" />
        ))}
      </div>

      {/* Content cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-xl" />
        <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-xl" />
      </div>

      {/* List */}
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="animate-pulse border rounded-xl p-6 space-y-3">
      <div className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
      <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded" />
      <div className="h-4 w-3/4 bg-slate-100 dark:bg-slate-800 rounded" />
    </div>
  );
}

export function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border rounded-xl">
          <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-3 w-32 bg-slate-100 dark:bg-slate-800 rounded" />
          </div>
          <div className="h-6 w-16 bg-slate-100 dark:bg-slate-800 rounded-full" />
        </div>
      ))}
    </div>
  );
}
