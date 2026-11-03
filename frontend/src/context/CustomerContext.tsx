import React, { createContext, useContext, useState, useMemo } from "react";
import type { Customer, CustomerStats } from "../types/customer";

interface CustomerContextType {
  customers: Customer[];
  stats: CustomerStats;
  addCustomer: (data: Omit<Customer, "id" | "initials" | "status" | "daysRemaining" | "displayExpires" | "createdAt">) => void;
  renewCustomer: (id: string, additionalMonths: number) => void;
  deleteCustomer: (id: string) => void;
  getCustomerById: (id: string) => Customer | undefined;
  activeRemindingCustomer: Customer | null;
  setActiveRemindingCustomer: (customer: Customer | null) => void;
  activeRenewingCustomer: Customer | null;
  setActiveRenewingCustomer: (customer: Customer | null) => void;
  activeDeletingCustomer: Customer | null;
  setActiveDeletingCustomer: (customer: Customer | null) => void;
}

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: "1",
    name: "John Smith",
    initials: "JS",
    email: "john@email.com",
    phone: "+1 555 012 3456",
    startDate: "2026-07-08",
    durationMonths: 3,
    expiryDate: "2026-10-08",
    displayExpires: "Oct 8",
    status: "expiring",
    daysRemaining: 3,
    planName: "TV Subscription",
    price: 45,
    createdAt: "2026-04-08",
  },
  {
    id: "2",
    name: "Michael Brown",
    initials: "MB",
    email: "michael@email.com",
    phone: "+1 555 013 7788",
    startDate: "2026-07-12",
    durationMonths: 3,
    expiryDate: "2026-10-12",
    displayExpires: "Oct 12",
    status: "expiring",
    daysRemaining: 7,
    planName: "TV + Internet",
    price: 60,
    createdAt: "2026-01-12",
  },
  {
    id: "3",
    name: "Sarah Khan",
    initials: "SK",
    email: "sarah@email.com",
    phone: "+1 555 019 2210",
    startDate: "2026-10-05",
    durationMonths: 3,
    expiryDate: "2027-01-05",
    displayExpires: "Jan 5, 2027",
    status: "active",
    daysRemaining: 92,
    planName: "Standard Plan",
    price: 35,
    createdAt: "2026-05-10",
  },
  {
    id: "4",
    name: "David Lee",
    initials: "DL",
    email: "david@email.com",
    phone: "+1 555 014 6621",
    startDate: "2026-04-15",
    durationMonths: 6,
    expiryDate: "2026-10-15",
    displayExpires: "Oct 15",
    status: "expiring",
    daysRemaining: 10,
    planName: "Premium Bundle",
    price: 75,
    createdAt: "2025-10-15",
  },
  {
    id: "5",
    name: "Priya Das",
    initials: "PD",
    email: "priya@email.com",
    phone: "+1 555 016 8802",
    startDate: "2026-04-15",
    durationMonths: 6,
    expiryDate: "2026-10-15",
    displayExpires: "Oct 15",
    status: "expiring",
    daysRemaining: 10,
    planName: "Basic Plan",
    price: 25,
    createdAt: "2026-02-14",
  },
  {
    id: "6",
    name: "Emma Wilson",
    initials: "EW",
    email: "emma@email.com",
    phone: "+1 555 011 9034",
    startDate: "2026-06-01",
    durationMonths: 12,
    expiryDate: "2027-06-01",
    displayExpires: "Jun 1, 2027",
    status: "active",
    daysRemaining: 239,
    planName: "Annual Family Plan",
    price: 120,
    createdAt: "2026-06-01",
  },
  {
    id: "7",
    name: "Robert Hall",
    initials: "RH",
    email: "robert@email.com",
    phone: "+1 555 017 4410",
    startDate: "2026-04-03",
    durationMonths: 6,
    expiryDate: "2026-10-03",
    displayExpires: "Oct 3",
    status: "expired",
    daysRemaining: -2,
    planName: "TV Subscription",
    price: 45,
    createdAt: "2025-10-03",
  },
  {
    id: "8",
    name: "James Cole",
    initials: "JC",
    email: "james@email.com",
    phone: "+1 555 018 2965",
    startDate: "2026-01-30",
    durationMonths: 6,
    expiryDate: "2026-09-30",
    displayExpires: "Sep 30",
    status: "expired",
    daysRemaining: -5,
    planName: "Basic Plan",
    price: 25,
    createdAt: "2025-07-30",
  },
  // Additional active members to match the 30 total in Figma
  {
    id: "9",
    name: "Alice Freeman",
    initials: "AF",
    email: "alice@email.com",
    phone: "+1 555 019 3321",
    startDate: "2026-08-01",
    durationMonths: 6,
    expiryDate: "2027-02-01",
    displayExpires: "Feb 1, 2027",
    status: "active",
    daysRemaining: 119,
    planName: "Standard Plan",
    price: 35,
    createdAt: "2026-08-01",
  },
  {
    id: "10",
    name: "Brian Miller",
    initials: "BM",
    email: "brian@email.com",
    phone: "+1 555 020 4455",
    startDate: "2026-09-10",
    durationMonths: 3,
    expiryDate: "2026-12-10",
    displayExpires: "Dec 10, 2026",
    status: "active",
    daysRemaining: 66,
    planName: "Premium Bundle",
    price: 75,
    createdAt: "2026-09-10",
  },
];

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [activeRemindingCustomer, setActiveRemindingCustomer] = useState<Customer | null>(null);
  const [activeRenewingCustomer, setActiveRenewingCustomer] = useState<Customer | null>(null);
  const [activeDeletingCustomer, setActiveDeletingCustomer] = useState<Customer | null>(null);

  const stats = useMemo<CustomerStats>(() => {
    return {
      total: customers.length,
      active: customers.filter((c) => c.status === "active").length,
      expiring: customers.filter((c) => c.status === "expiring").length,
      expired: customers.filter((c) => c.status === "expired").length,
    };
  }, [customers]);

  const addCustomer: CustomerContextType["addCustomer"] = (data) => {
    const initials = data.name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const newCustomer: Customer = {
      ...data,
      id: Date.now().toString(),
      initials,
      status: "active",
      daysRemaining: data.durationMonths * 30,
      displayExpires: new Date(data.expiryDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      createdAt: new Date().toISOString().split("T")[0],
    };

    setCustomers((prev) => [newCustomer, ...prev]);
  };

  const renewCustomer = (id: string, additionalMonths: number) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const currentExp = new Date(c.expiryDate);
        currentExp.setMonth(currentExp.getMonth() + additionalMonths);
        const newExpiryStr = currentExp.toISOString().split("T")[0];
        return {
          ...c,
          status: "active",
          durationMonths: c.durationMonths + additionalMonths,
          expiryDate: newExpiryStr,
          displayExpires: currentExp.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          daysRemaining: additionalMonths * 30,
        };
      })
    );
  };

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  const getCustomerById = (id: string) => {
    return customers.find((c) => c.id === id);
  };

  return (
    <CustomerContext.Provider
      value={{
        customers,
        stats,
        addCustomer,
        renewCustomer,
        deleteCustomer,
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
