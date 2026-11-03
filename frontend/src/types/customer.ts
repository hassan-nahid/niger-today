export type SubscriptionStatus = "active" | "expiring" | "expired";

export interface Customer {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  startDate: string;
  durationMonths: number;
  expiryDate: string; // ISO string or format e.g. "2026-10-08"
  displayExpires: string; // e.g. "Oct 8"
  status: SubscriptionStatus;
  daysRemaining: number; // positive = days left, negative = days ago
  planName: string; // e.g. "TV Subscription", "Standard", "Pro"
  price: number;
  notes?: string;
  createdAt: string;
}

export interface CustomerStats {
  total: number;
  active: number;
  expiring: number;
  expired: number;
}

