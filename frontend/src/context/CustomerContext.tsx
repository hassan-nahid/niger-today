import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import type { Customer, CustomerStats } from "../types/customer";
import {
  getCustomersApi,
  getCustomerStatsApi,
  createCustomerApi,
  renewCustomerApi,
  deleteCustomerApi,
  sendCustomerReminderApi,
  type QueryCustomerParams,
} from "../api/customer.api";

interface AddCustomerInput {
  name?: string;
  fullName?: string;
  phone: string;
  email?: string;
  startDate: string;
  durationMonths: number;
  planName?: string;
  price?: number;
  expiryDate?: string;
  notes?: string;
}

interface CustomerContextType {
  customers: Customer[];
  stats: CustomerStats;
  isLoading: boolean;
  error: string | null;
  refreshData: (params?: QueryCustomerParams) => Promise<void>;
  addCustomer: (data: AddCustomerInput) => Promise<Customer>;
  renewCustomer: (id: string, additionalMonths: number, startedFrom?: "expiry" | "payment", paymentDate?: string) => Promise<Customer>;
  deleteCustomer: (id: string) => Promise<void>;
  sendReminder: (id: string) => Promise<any>;
  getCustomerById: (id: string) => Customer | undefined;
  activeRemindingCustomer: Customer | null;
  setActiveRemindingCustomer: (customer: Customer | null) => void;
  activeRenewingCustomer: Customer | null;
  setActiveRenewingCustomer: (customer: Customer | null) => void;
  activeDeletingCustomer: Customer | null;
  setActiveDeletingCustomer: (customer: Customer | null) => void;
}

const DEFAULT_STATS: CustomerStats = {
  total: 0,
  active: 0,
  expiring: 0,
  expired: 0,
};

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<CustomerStats>(DEFAULT_STATS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [activeRemindingCustomer, setActiveRemindingCustomer] = useState<Customer | null>(null);
  const [activeRenewingCustomer, setActiveRenewingCustomer] = useState<Customer | null>(null);
  const [activeDeletingCustomer, setActiveDeletingCustomer] = useState<Customer | null>(null);

  /**
   * Fetch customers and stats from backend API
   */
  const refreshData = useCallback(async (params?: QueryCustomerParams) => {
    const token = localStorage.getItem("access_token");
    if (!token) return; // User not logged in yet

    setIsLoading(true);
    setError(null);

    try {
      const [customersRes, statsRes] = await Promise.all([
        getCustomersApi({ limit: 100, ...params }),
        getCustomerStatsApi(),
      ]);

      setCustomers(customersRes.customers);
      setStats(statsRes);
    } catch (err: any) {
      console.error("Failed to load customer data from API:", err);
      setError(err?.response?.data?.message || err?.message || "Failed to load customers");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load when component mounts or token changes
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      refreshData();
    }
  }, [refreshData]);

  /**
   * Add a new customer
   */
  const addCustomer = async (data: AddCustomerInput): Promise<Customer> => {
    setIsLoading(true);
    try {
      const payload = {
        fullName: data.fullName || data.name || "Customer",
        phone: data.phone,
        email: data.email,
        startDate: data.startDate,
        durationMonths: data.durationMonths,
      };

      const newCustomer = await createCustomerApi(payload);
      
      // Update local state immediately & refresh in background
      setCustomers((prev) => [newCustomer, ...prev]);
      await refreshData();
      return newCustomer;
    } catch (err: any) {
      console.error("Failed to create customer:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Renew customer subscription
   */
  const renewCustomer = async (
    id: string,
    additionalMonths: number,
    startedFrom: "expiry" | "payment" = "expiry",
    paymentDate?: string
  ): Promise<Customer> => {
    setIsLoading(true);
    try {
      const updatedCustomer = await renewCustomerApi(id, {
        durationMonths: additionalMonths,
        startedFrom,
        paymentDate,
      });

      // Update in state
      setCustomers((prev) =>
        prev.map((c) => (c.id === id || c._id === id ? updatedCustomer : c))
      );

      // Refresh stats and list
      await refreshData();
      return updatedCustomer;
    } catch (err: any) {
      console.error("Failed to renew customer:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete customer
   */
  const deleteCustomer = async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      await deleteCustomerApi(id);
      setCustomers((prev) => prev.filter((c) => c.id !== id && c._id !== id));
      await refreshData();
    } catch (err: any) {
      console.error("Failed to delete customer:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Send reminder to customer
   */
  const sendReminder = async (id: string): Promise<any> => {
    try {
      return await sendCustomerReminderApi(id);
    } catch (err: any) {
      console.error("Failed to send customer reminder:", err);
      throw err;
    }
  };

  /**
   * Helper to find customer by id
   */
  const getCustomerById = useCallback(
    (id: string) => {
      return customers.find((c) => c.id === id || c._id === id);
    },
    [customers]
  );

  // Compute stats fallback if stats API isn't loaded yet
  const computedStats = useMemo<CustomerStats>(() => {
    if (stats.total > 0 || customers.length === 0) {
      return stats;
    }
    return {
      total: customers.length,
      active: customers.filter((c) => c.status === "active").length,
      expiring: customers.filter((c) => c.status === "expiring").length,
      expired: customers.filter((c) => c.status === "expired").length,
    };
  }, [stats, customers]);

  return (
    <CustomerContext.Provider
      value={{
        customers,
        stats: computedStats,
        isLoading,
        error,
        refreshData,
        addCustomer,
        renewCustomer,
        deleteCustomer,
        sendReminder,
        getCustomerById,
        activeRemindingCustomer,
        setActiveRemindingCustomer,
        activeRenewingCustomer,
        setActiveRenewingCustomer,
        activeDeletingCustomer,
        setActiveDeletingCustomer,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomerContext = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error("useCustomerContext must be used within a CustomerProvider");
  }
  return context;
};
