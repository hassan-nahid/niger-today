export type SubscriptionStatus = "active" | "expiring" | "expired";

export interface Renewal {
  _id?: string;
  id?: string;
  periodStart: string | Date;
  periodEnd: string | Date;
  durationMonths: number;
  type: "initial" | "renewal";
  startedFrom: "expiry" | "payment";
  paymentDate?: string | Date;
  createdAt?: string | Date;
}

export interface Customer {
  id: string;
  _id?: string;
  fullName: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  startDate: string;
  durationMonths: number;
  expiresAt?: string;
  expiryDate: string; // ISO string e.g. "2026-10-08"
  displayExpires: string; // e.g. "Oct 8" or "Oct 8, 2026"
  status: SubscriptionStatus;
  daysRemaining: number; // positive = days left, negative = days ago
  planName: string; // e.g. "TV Subscription"
  price: number;
  notes?: string;
  renewals?: Renewal[];
  createdAt: string;
}

export interface CustomerStats {
  total: number;
  active: number;
  expiring: number;
  expired: number;
  inGrace?: number;
  settings?: {
    expiringWindowDays: number;
    graceEnabled: boolean;
    graceDays: number;
  };
}

export interface CustomersQueryResponse {
  results: Customer[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
  activeSettings?: {
    expiringWindowDays: number;
    graceEnabled: boolean;
    graceDays: number;
  };
}
