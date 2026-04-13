import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Zap className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold">AutoApply AI</span>
        </div>
        <h1 className="text-7xl font-bold text-slate-200 dark:text-slate-800 mb-4">404</h1>
        <h2 className="text-xl font-semibold mb-2">Page not found</h2>
        <p className="text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Go Home
          </Link>
          <Link
            href="/dashboard"
            className="border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-6 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
