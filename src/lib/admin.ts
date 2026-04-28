// Admin / VIP user system
// These users get unlimited Pro features regardless of subscription status.

export const ADMIN_EMAILS = [
  'vahe_h@mail.ru',
  'vahehakobyanv@gmail.com',
];

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

// Returns effective plan for a user. Admins always get 'pro' regardless of DB.
export function getEffectivePlan(
  email: string | null | undefined,
  dbPlan: string | null | undefined
): 'free' | 'pro' {
  if (isAdminEmail(email)) return 'pro';
  return dbPlan === 'pro' ? 'pro' : 'free';
}
