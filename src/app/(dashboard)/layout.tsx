import { Sidebar } from '@/components/layout/sidebar';
import { CommandPalette } from '@/components/layout/command-palette';
import { Toaster } from '@/components/ui/sonner';

export const dynamic = 'force-dynamic';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      <CommandPalette />
      <main className="md:pl-64">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
      <Toaster />
    </div>
  );
}
