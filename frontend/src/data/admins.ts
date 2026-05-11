// Add emails or wallet addresses of admins here.
// Email match is case-insensitive.
export const ADMIN_EMAILS: string[] = [
  'obisopulu1@gmail.com',
  'ezeigbod@gmail.com',
];

export const ADMIN_WALLETS: string[] = [
  // e.g. '0xYourWalletAddress'
];

export function isAdmin(email?: string | null, wallet?: string | null): boolean {
  if (email && ADMIN_EMAILS.some(e => e.toLowerCase() === email.toLowerCase())) return true;
  if (wallet && ADMIN_WALLETS.some(w => w.toLowerCase() === wallet.toLowerCase())) return true;
  return false;
}
