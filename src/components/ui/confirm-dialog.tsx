'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning';
  onConfirm: () => void | Promise<void>;
}

export function ConfirmDialog({
  open, onOpenChange, title, description,
  confirmText = 'Delete', cancelText = 'Cancel',
  variant = 'danger', onConfirm,
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${variant === 'danger' ? 'bg-red-100 dark:bg-red-900' : 'bg-yellow-100 dark:bg-yellow-900'}`}>
              <AlertTriangle className={`h-5 w-5 ${variant === 'danger' ? 'text-red-600' : 'text-yellow-600'}`} />
            </div>
            <DialogTitle>{title}</DialogTitle>
          </div>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex gap-2 justify-end mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>{cancelText}</Button>
          <Button
            variant={variant === 'danger' ? 'destructive' : 'default'}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Processing...' : confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
