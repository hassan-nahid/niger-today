import React, { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useCustomerContext } from "../context/CustomerContext";
import { StatusBadge } from "../components/shared/StatusBadge";
import { EmptyState } from "../components/shared/EmptyState";
import { PageHeader } from "../components/shared/PageHeader";
import iconSearch from "../assets/icons/icon-search.svg";
import iconPlus from "../assets/icons/icon-plus.svg";

// Helper to format ISO date "2026-07-08" to "Jul 8, 2026" matching Figma
const formatStartDate = (dateStr: string) => {
  if (!dateStr) return "";
  if (dateStr.includes(",")) return dateStr; // Already formatted
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[parseInt(parts[1], 10) - 1];
    const day = parseInt(parts[2], 10);
    const year = parts[0];
    return `${month} ${day}, ${year}`;
  }
  return dateStr;
};

export const Customers: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialStatus = searchParams.get("status") || "all";

  const { customers, stats, setActiveRemindingCustomer, setActiveRenewingCustomer } =
    useCustomerContext();
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);

  const filteredCustomers = useMemo(() => {
    return customers.filter((cust) => {
      const matchesSearch =
        cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cust.phone.includes(searchTerm) ||
        cust.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && cust.status === "active") ||
        (statusFilter === "expiring" && cust.status === "expiring") ||
        (statusFilter === "expired" && cust.status === "expired");

      return matchesSearch && matchesStatus;
    });
  }, [customers, searchTerm, statusFilter]);

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC]">
      {/* ======================================================== */}
      {/* DESKTOP LAYOUT (FIGMA 03 Customers - 1440x900)           */}
      {/* ======================================================== */}
      <div className="hidden lg:block px-10 py-8 space-y-6 max-w-[1440px]">
        {/* Top Bar (Reusable PageHeader matching Figma 02 Dashboard & 03 Customers) */}
        <PageHeader
          title="Customers"
          subtitle={
            stats.total === 0
              ? "0 customers"
              : `${stats.total} customers · Manage subscriptions and renewals`
          }
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          showAddButton={stats.total > 0}
          onAddClick={() => navigate("/customers/new")}
        />

        {/* Filter Tabs (shown when customers exist) */}
        {stats.total > 0 && (
          <div className="flex items-center gap-2">
            {[
              { id: "all", label: "All", count: stats.total },
              { id: "active", label: "Active", count: stats.active },
              { id: "expiring", label: "Expiring soon", count: stats.expiring },
              { id: "expired", label: "Expired", count: stats.expired },
            ].map((tab) => {
              const isActive = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`flex items-center gap-2 h-10 px-4 rounded-full text-sm font-medium transition-all cursor-pointer ${isActive
                      ? "bg-[#4F46E5] text-white shadow-xs"
                      : "bg-white border border-[#E2E8F0] text-[#0F172A] hover:bg-slate-50"
                    }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-xs ${isActive ? "text-[#E0E7FF] font-normal" : "text-[#64748B] font-normal"
                      }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Customer Table (Figma 1:380 - 16px radius, solid white, exact borders) */}
        {filteredCustomers.length === 0 ? (
          <EmptyState type="no-customers" onAction={() => navigate("/customers/new")} />
        ) : (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F1F5F9]">
                <tr className="border-b border-[#E2E8F0]">
                  <th className="py-3 px-6 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                    CUSTOMER
                  </th>
                  <th className="py-3 px-4 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider w-[140px]">
                    PHONE
                  </th>
                  <th className="py-3 px-4 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider w-[120px]">
                    START DATE
                  </th>
                  <th className="py-3 px-4 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider w-[90px]">
                    DURATION
                  </th>
                  <th className="py-3 px-4 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider w-[110px]">
                    EXPIRES
                  </th>
                  <th className="py-3 px-4 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider w-[130px]">
                    STATUS
                  </th>
                  <th className="py-3 px-6 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider text-right w-[190px]">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredCustomers.map((cust) => {
                  const isExpired = cust.status === "expired";
                  return (
                    <tr
                      key={cust.id}
                      className="hover:bg-[#F8FAFC] transition-colors group cursor-pointer"
                      onClick={() => navigate(`/customers/${cust.id}`)}
                    >
                      {/* Customer info: 36x36px avatar + name + email */}
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#EEF2FF] text-[#4F46E5] font-medium text-[13px] flex items-center justify-center shrink-0">
                            {cust.initials}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-[#0F172A] leading-snug group-hover:text-[#4F46E5] transition-colors">
                              {cust.name}
                            </div>
                            <div className="text-xs text-[#64748B] mt-0.5">{cust.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 text-sm text-[#0F172A] whitespace-nowrap">
                        {cust.phone}
                      </td>

                      {/* Start Date */}
                      <td className="py-3.5 px-4 text-sm text-[#64748B] whitespace-nowrap">
                        {formatStartDate(cust.startDate)}
                      </td>

                      {/* Duration */}
                      <td className="py-3.5 px-4 text-sm text-[#64748B] whitespace-nowrap">
                        {cust.durationMonths} mo
                      </td>

                      {/* Expires */}
                      <td className="py-3.5 px-4 text-sm font-medium text-[#0F172A] whitespace-nowrap">
                        {cust.displayExpires}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={cust.status} daysRemaining={cust.daysRemaining} />
                      </td>

                      {/* Actions */}
                      <td
                        className="py-3.5 px-6 whitespace-nowrap text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-2">
                          {isExpired ? (
                            <>
                              {/* Renew First for Expired */}
                              <button
                                onClick={() => setActiveRenewingCustomer(cust)}
                                className="px-3.5 py-1.5 rounded-[10px] bg-[#4F46E5] hover:bg-[#4338CA] text-white text-[13px] font-semibold cursor-pointer transition-colors shadow-2xs"
                              >
                                Renew
                              </button>
                              {/* Message Second for Expired */}
                              <button
                                onClick={() => setActiveRemindingCustomer(cust)}
                                className="h-[34px] px-3.5 rounded-[10px] bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#4338CA] text-sm font-semibold cursor-pointer transition-colors"
                              >
                                Message
                              </button>
                            </>
                          ) : (
                            <>
                              {/* Message Button (Button/soft) */}
                              <button
                                onClick={() => setActiveRemindingCustomer(cust)}
                                className="h-[34px] px-3.5 rounded-[10px] bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#4338CA] text-sm font-semibold cursor-pointer transition-colors"
                              >
                                Message
                              </button>
                              {/* Renew Button (Button/secondary) */}
                              <button
                                onClick={() => setActiveRenewingCustomer(cust)}
                                className="h-[34px] px-3.5 rounded-[10px] bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#0F172A] text-sm font-semibold cursor-pointer transition-colors shadow-2xs"
                              >
                                Renew
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* MOBILE LAYOUT (FIGMA M3 Customers - 390x844)             */}
      {/* ======================================================== */}
      <div className="lg:hidden pt-14 px-5 pb-24 space-y-5 max-w-[420px] mx-auto">
        {/* Mobile Top bar (Figma 1:2711: Height 60px) */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-semibold text-[#0F172A] tracking-tight leading-tight">
              Customers
            </h1>
            <p className="text-sm text-[#64748B] mt-0.5 font-normal">
              {stats.total} customers
            </p>
          </div>

          <button
            onClick={() => navigate("/customers/new")}
            className="w-10 h-10 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white flex items-center justify-center shadow-xs cursor-pointer active:scale-95 transition-all shrink-0"
            aria-label="Add customer"
          >
            <img src={iconPlus} alt="" className="w-[18px] h-[18px] brightness-0 invert" />
          </button>
        </div>

        {/* Mobile Search (Figma 1:2716: Height 48px, radius 12px, border #E2E8F0, padding 12px 14px) */}
        <div className="relative w-full">
          <img
            src={iconSearch}
            alt=""
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#94A3B8]"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search name, phone or email"
            className="w-full h-12 rounded-xl border border-[#E2E8F0] bg-white pl-10 pr-3.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] shadow-2xs font-normal"
          />
        </div>

        {/* Mobile Filter Tabs (Figma 1:2720: Height 38px, rounded-full, gap 8px) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: "all", label: "All" },
            { id: "active", label: "Active" },
            { id: "expiring", label: "Expiring" },
            { id: "expired", label: "Expired" },
          ].map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`h-[38px] px-3.5 rounded-full text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#4F46E5] text-white shadow-xs"
                    : "bg-white border border-[#E2E8F0] text-[#334155] hover:border-slate-300"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Mobile Customer Cards (Figma M3 List Items - Height 72px, radius 14px, gap 10px) */}
        {filteredCustomers.length === 0 ? (
          <EmptyState type="no-customers" onAction={() => navigate("/customers/new")} />
        ) : (
          <div className="space-y-2.5">
            {filteredCustomers.map((cust) => {
              const isExpiring = cust.status === "expiring";
              const isExpired = cust.status === "expired";
              const isActive = cust.status === "active";

              return (
                <div
                  key={cust.id}
                  onClick={() => navigate(`/customers/${cust.id}`)}
                  className="h-[72px] px-3.5 rounded-[14px] bg-white border border-[#E2E8F0] flex items-center justify-between shadow-2xs active:scale-[0.99] cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar: 40x40px, bg #E0E7FF, text #4338CA, font 13px w500 */}
                    <div className="w-10 h-10 rounded-full bg-[#E0E7FF] text-[#4338CA] font-medium text-[13px] flex items-center justify-center shrink-0">
                      {cust.initials}
                    </div>

                    <div className="min-w-0">
                      <div className="text-sm font-medium text-[#0F172A] leading-tight truncate">
                        {cust.name}
                      </div>
                      <div className="text-xs text-[#64748B] mt-0.5 leading-tight truncate font-normal">
                        {isExpired
                          ? `Expired ${cust.displayExpires}`
                          : `Expires ${cust.displayExpires}`}
                      </div>
                    </div>
                  </div>

                  {/* Status Badge: exact Figma 1:2729 tokens */}
                  <div className="shrink-0 ml-2">
                    {isExpiring && (
                      <span className="h-[26px] px-2.5 rounded-full bg-[#FEF3C7] text-[#B45309] text-[13px] font-medium inline-flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                        <span>{cust.daysRemaining} days left</span>
                      </span>
                    )}
                    {isActive && (
                      <span className="h-[26px] px-2.5 rounded-full bg-[#DCFCE7] text-[#15803D] text-[13px] font-medium inline-flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                        <span>Active</span>
                      </span>
                    )}
                    {isExpired && (
                      <span className="h-[26px] px-2.5 rounded-full bg-[#FEE2E2] text-[#B91C1C] text-[13px] font-medium inline-flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                        <span>{Math.abs(cust.daysRemaining)} days ago</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
