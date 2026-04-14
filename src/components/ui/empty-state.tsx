'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, actionHref, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Decorative circles */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-full scale-150 opacity-50" />
        <div className="absolute inset-0 bg-blue-50 dark:bg-blue-950/30 rounded-full scale-125 opacity-70" />
        <div className="relative h-16 w-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center">
          <Icon className="h-8 w-8 text-blue-500" />
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">{description}</p>

      {actionLabel && (actionHref ? (
        <Link href={actionHref}>
          <Button>{actionLabel}</Button>
        </Link>
      ) : onAction ? (
        <Button onClick={onAction}>{actionLabel}</Button>
      ) : null)}
    </div>
  );
}
