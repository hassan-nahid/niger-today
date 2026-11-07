import { apiClient } from "./axios";
import type { Customer, CustomerStats, CustomersQueryResponse, SubscriptionStatus } from "../types/customer";

export interface CreateCustomerPayload {
  fullName: string;
  phone: string;
  email?: string;
  startDate: string;
  durationMonths: number;
}

export interface RenewCustomerPayload {
  durationMonths: number;
  startedFrom?: "expiry" | "payment";
  paymentDate?: string;
}

export interface QueryCustomerParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
}

/**
 * Normalizes customer object from backend to match frontend interface
 */
export const normalizeCustomer = (raw: any): Customer => {
  if (!raw) {
    return {
      id: "",
      fullName: "",
      name: "",
      initials: "CU",
      email: "",
      phone: "",
      startDate: "",
      durationMonths: 3,
      expiryDate: "",
      displayExpires: "—",
      status: "active",
      daysRemaining: 0,
      planName: "TV Subscription",
      price: 45,
      createdAt: "",
    };
  }

  const id = raw.id || raw._id || "";
  const name = raw.fullName || raw.name || "Customer";
  
  // Compute initials
  let initials = raw.initials;
  if (!initials) {
    const parts = name.trim().split(/\s+/);
    initials = parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name.slice(0, 2).toUpperCase();
  }

  const startDateStr = raw.startDate ? new Date(raw.startDate).toISOString().split("T")[0] : "";
  const expiryDateStr = raw.expiryDate || (raw.expiresAt ? new Date(raw.expiresAt).toISOString().split("T")[0] : "");

  let daysRemaining = typeof raw.daysRemaining === "number" ? raw.daysRemaining : 0;
  if (typeof raw.daysRemaining !== "number" && raw.expiresAt) {
    const diff = new Date(raw.expiresAt).getTime() - Date.now();
    daysRemaining = Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  let status: SubscriptionStatus = raw.status;
  if (!status) {
    if (daysRemaining < 0) status = "expired";
    else if (daysRemaining <= 10) status = "expiring";
    else status = "active";
  }

  // Compute display date e.g. "Oct 8" or "Oct 8, 2026"
  let displayExpires = "";
  if (expiryDateStr) {
    try {
      const d = new Date(expiryDateStr);
      displayExpires = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      displayExpires = expiryDateStr;
    }
  }

  const durationMonths = Number(raw.durationMonths) || 3;
  const price = durationMonths === 12 ? 120 : durationMonths === 6 ? 75 : 45;

  return {
    id,
    _id: raw._id || id,
    fullName: name,
    name,
    initials,
    phone: raw.phone || "",
    email: raw.email || "",
    startDate: startDateStr,
    durationMonths,
    expiresAt: raw.expiresAt,
    expiryDate: expiryDateStr,
    displayExpires: displayExpires || raw.displayExpires || "—",
    status,
    daysRemaining,
    planName: raw.planName || "TV Subscription",
    price: raw.price || price,
    notes: raw.notes || "",
    renewals: raw.renewals || [],
    createdAt: raw.createdAt ? new Date(raw.createdAt).toISOString().split("T")[0] : startDateStr,
  };
};

/**
 * 1. Fetch all customers with optional filters
 */
export const getCustomersApi = async (
  params?: QueryCustomerParams
): Promise<{ customers: Customer[]; pagination: Omit<CustomersQueryResponse, "results"> }> => {
  const response = await apiClient.get("/customers", { params });
  const rawData = response.data?.data?.attributes || response.data?.data || response.data;
  
  const results = Array.isArray(rawData?.results) ? rawData.results : Array.isArray(rawData) ? rawData : [];
  const normalized = results.map(normalizeCustomer);

  return {
    customers: normalized,
    pagination: {
      page: rawData?.page || 1,
      limit: rawData?.limit || 50,
      totalPages: rawData?.totalPages || 1,
      totalResults: rawData?.totalResults ?? normalized.length,
      activeSettings: rawData?.activeSettings,
    },
  };
};

/**
 * 2. Fetch customer statistics dynamically
 */
export const getCustomerStatsApi = async (): Promise<CustomerStats> => {
  const response = await apiClient.get("/customers/stats");
  const data = response.data?.data?.attributes || response.data?.data || response.data;
  return {
    total: data?.total ?? 0,
    active: data?.active ?? 0,
    expiring: data?.expiring ?? 0,
    expired: data?.expired ?? 0,
    inGrace: data?.inGrace ?? 0,
    settings: data?.settings,
  };
};

/**
 * 3. Fetch single customer by ID
 */
export const getCustomerByIdApi = async (id: string): Promise<Customer> => {
  const response = await apiClient.get(`/customers/${id}`);
  const data = response.data?.data?.attributes || response.data?.data || response.data;
  return normalizeCustomer(data);
};

/**
 * 4. Create a new customer
 */
export const createCustomerApi = async (payload: CreateCustomerPayload): Promise<Customer> => {
  const response = await apiClient.post("/customers", payload);
  const data = response.data?.data?.attributes || response.data?.data || response.data;
  return normalizeCustomer(data);
};

/**
 * 5. Update existing customer
 */
export const updateCustomerApi = async (id: string, payload: Partial<CreateCustomerPayload>): Promise<Customer> => {
  const response = await apiClient.patch(`/customers/${id}`, payload);
  const data = response.data?.data?.attributes || response.data?.data || response.data;
  return normalizeCustomer(data);
};

/**
 * 6. Delete a customer
 */
export const deleteCustomerApi = async (id: string): Promise<void> => {
  await apiClient.delete(`/customers/${id}`);
};

/**
 * 7. Renew customer subscription
 */
export const renewCustomerApi = async (id: string, payload: RenewCustomerPayload): Promise<Customer> => {
  const response = await apiClient.post(`/customers/${id}/renew`, payload);
  const data = response.data?.data?.attributes || response.data?.data || response.data;
  return normalizeCustomer(data);
};

/**
 * 8. Send reminder to customer
 */
export const sendCustomerReminderApi = async (id: string): Promise<any> => {
  const response = await apiClient.post(`/customers/${id}/reminder`);
  return response.data?.data?.attributes || response.data?.data || response.data;
};

/**
 * 9. Trigger automated reminders batch run
 */
export const triggerAutomatedRemindersApi = async (): Promise<any> => {
  const response = await apiClient.post("/customers/trigger-reminders");
  return response.data?.data?.attributes || response.data?.data || response.data;
};

