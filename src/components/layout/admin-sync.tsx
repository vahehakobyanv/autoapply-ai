'use client';

import { useEffect } from 'react';

// Fires once on dashboard mount to auto-upgrade admin users to Pro.
// No-op for non-admin users.
export function AdminSync() {
  useEffect(() => {
    fetch('/api/admin-sync').catch(() => {});
  }, []);
  return null;
}
