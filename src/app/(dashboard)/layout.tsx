import { Sidebar } from '@/components/layout/sidebar';
import { CommandPalette } from '@/components/layout/command-palette';
import { FAB } from '@/components/layout/fab';
import { MobileNav } from '@/components/layout/mobile-nav';
import { ProductTour } from '@/components/layout/product-tour';
import { Toaster } from '@/components/ui/sonner';

export const dynamic = 'force-dynamic';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      <CommandPalette />
      <ProductTour />
      <main className="md:pl-64 pb-20 md:pb-0">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
      <FAB />
      <MobileNav />
      <Toaster />
    </div>
  );
}
