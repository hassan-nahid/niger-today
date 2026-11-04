import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useCustomerContext } from "../context/CustomerContext";
import { StatusBadge } from "../components/shared/StatusBadge";
import { EmptyState } from "../components/shared/EmptyState";
import { PageHeader } from "../components/shared/PageHeader";
import iconSearch from "../assets/icons/icon-search.svg";
import iconMessage from "../assets/icons/icon-message.svg";

export const ExpiringSoon: React.FC = () => {
  const navigate = useNavigate();
  const { customers, setActiveRemindingCustomer, setActiveRenewingCustomer } =
    useCustomerContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [dayFilter, setDayFilter] = useState<"all" | "1-3" | "4-7" | "8-10">("all");

  const expiringList = useMemo(() => {
    return customers
      .filter((c) => c.status === "expiring")
      .filter((c) => {
        const matchesSearch =
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.phone.includes(searchTerm) ||
          c.email.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesDay = true;
        if (dayFilter === "1-3") matchesDay = c.daysRemaining >= 1 && c.daysRemaining <= 3;
        if (dayFilter === "4-7") matchesDay = c.daysRemaining >= 4 && c.daysRemaining <= 7;
        if (dayFilter === "8-10") matchesDay = c.daysRemaining >= 8 && c.daysRemaining <= 10;

        return matchesSearch && matchesDay;
      })
      .sort((a, b) => a.daysRemaining - b.daysRemaining);
  }, [customers, searchTerm, dayFilter]);

  const allExpiring = useMemo(
    () => customers.filter((c) => c.status === "expiring"),
    [customers]
  );

  const count1to3 = useMemo(
    () => allExpiring.filter((c) => c.daysRemaining >= 1 && c.daysRemaining <= 3).length,
    [allExpiring]
  );
  const count4to7 = useMemo(
    () => allExpiring.filter((c) => c.daysRemaining >= 4 && c.daysRemaining <= 7).length,
    [allExpiring]
  );
  const count8to10 = useMemo(
    () => allExpiring.filter((c) => c.daysRemaining >= 8 && c.daysRemaining <= 10).length,
    [allExpiring]
  );

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC]">
      {/* ======================================================== */}
      {/* DESKTOP LAYOUT (FIGMA 06 Expiring Soon - 1440x900)       */}
      {/* ======================================================== */}
      <div className="hidden lg:block px-10 py-8 space-y-6 max-w-[1440px]">
        {/* Top Bar (Reusable PageHeader matching Figma) */}
        <PageHeader
          title="Expiring Soon"
          subtitle={
            allExpiring.length === 0
              ? "Nothing expiring in the next 10 days"
              : `${allExpiring.length} subscriptions expire within the next 10 days`
          }
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          showAddButton={false}
        />

        {/* Filter Tabs (Figma: All 4, 1-3 days 1, 4-7 days 1, 8-10 days 2; hidden when 0 expiring) */}
        {allExpiring.length > 0 && (
          <div className="flex items-center gap-2">
            {[
              { id: "all", label: "All", count: allExpiring.length },
              { id: "1-3", label: "1-3 days", count: count1to3 },
              { id: "4-7", label: "4-7 days", count: count4to7 },
              { id: "8-10", label: "8-10 days", count: count8to10 },
            ].map((tab) => {
              const isActive = dayFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setDayFilter(tab.id as any)}
                  className={`flex items-center gap-2 h-10 px-4 rounded-full text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#4F46E5] text-white shadow-xs"
                      : "bg-white border border-[#E2E8F0] text-[#0F172A] hover:bg-slate-50"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-xs ${
                      isActive ? "text-[#E0E7FF] font-normal" : "text-[#64748B] font-normal"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Expiring Table (Figma 1:894 - 16px radius, header #F1F5F9) */}
        {expiringList.length === 0 ? (
          <EmptyState type="nothing-expiring" />
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
                  <th className="py-3 px-4 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider w-[110px]">
                    EXPIRES
                  </th>
                  <th className="py-3 px-4 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider w-[130px]">
                    REMAINING
                  </th>
                  <th className="py-3 px-6 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider text-right w-[240px]">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {expiringList.map((cust) => (
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

                    {/* Expires */}
                    <td className="py-3.5 px-4 text-sm font-medium text-[#0F172A] whitespace-nowrap">
                      {cust.displayExpires}
                    </td>

                    {/* Remaining */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status="expiring" daysRemaining={cust.daysRemaining} />
                    </td>

                    {/* Actions: Send Reminder (Button/soft) + Renew (Button/secondary) */}
                    <td
                      className="py-3.5 px-6 whitespace-nowrap text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-2">
                        {/* Send Reminder (Button/soft) */}
                        <button
                          onClick={() => setActiveRemindingCustomer(cust)}
                          className="h-[34px] px-3 py-[7px] rounded-[10px] bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#4338CA] text-sm font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-2xs"
                        >
                          <img src={iconMessage} alt="" className="w-4 h-4 shrink-0" />
                          <span>Send Reminder</span>
                        </button>

                        {/* Renew Button (Button/secondary) */}
                        <button
                          onClick={() => setActiveRenewingCustomer(cust)}
                          className="h-[34px] px-3.5 rounded-[10px] bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#0F172A] text-[13px] font-semibold cursor-pointer transition-colors shadow-2xs"
                        >
                          Renew
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* MOBILE LAYOUT (Expiring Soon Mobile)                     */}
      {/* ======================================================== */}
      <div className="lg:hidden pt-14 px-5 pb-24 space-y-5 max-w-[420px] mx-auto">
        <div>
          <h1 className="text-[28px] font-semibold text-[#0F172A] tracking-tight leading-tight">
            Expiring Soon
          </h1>
          <p className="text-sm text-[#64748B] mt-0.5 font-normal">
            {allExpiring.length} subscriptions expire within 10 days
          </p>
        </div>

        {/* Search */}
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

        {/* Day Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: "all", label: "All" },
            { id: "1-3", label: "1-3 days" },
            { id: "4-7", label: "4-7 days" },
            { id: "8-10", label: "8-10 days" },
          ].map((tab) => {
            const isActive = dayFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setDayFilter(tab.id as any)}
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

        {/* Mobile Cards */}
        {expiringList.length === 0 ? (
          <EmptyState type="nothing-expiring" />
        ) : (
          <div className="space-y-2.5">
            {expiringList.map((cust) => (
              <div
                key={cust.id}
                onClick={() => navigate(`/customers/${cust.id}`)}
                className="bg-white rounded-xl border border-[#E2E8F0] p-3.5 shadow-2xs active:bg-slate-50 cursor-pointer transition-colors space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-[#EEF2FF] text-[#4F46E5] font-medium text-[13px] flex items-center justify-center shrink-0">
                      {cust.initials}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-[#0F172A] truncate leading-snug">
                        {cust.name}
                      </h3>
                      <p className="text-xs text-[#64748B] mt-0.5 truncate">
                        Expires {cust.displayExpires}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status="expiring" daysRemaining={cust.daysRemaining} />
                </div>

                {/* Mobile action buttons */}
                <div
                  className="flex items-center gap-2 pt-1 border-t border-[#F1F5F9]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setActiveRemindingCustomer(cust)}
                    className="flex-1 h-9 rounded-lg bg-[#EEF2FF] text-[#4F46E5] text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <img src={iconMessage} alt="" className="w-3.5 h-3.5 shrink-0" />
                    <span>Send Reminder</span>
                  </button>
                  <button
                    onClick={() => setActiveRenewingCustomer(cust)}
                    className="flex-1 h-9 rounded-lg bg-white border border-[#E2E8F0] text-[#0F172A] text-xs font-semibold flex items-center justify-center cursor-pointer shadow-2xs"
                  >
                    Renew
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
