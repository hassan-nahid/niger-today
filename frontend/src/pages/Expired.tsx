import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useCustomerContext } from "../context/CustomerContext";
import { StatusBadge } from "../components/shared/StatusBadge";
import { EmptyState } from "../components/shared/EmptyState";
import { RefreshCw } from "lucide-react";
import iconSearch from "../assets/icons/icon-search.svg";

export const Expired: React.FC = () => {
  const navigate = useNavigate();
  const { customers, setActiveRemindingCustomer, setActiveRenewingCustomer } =
    useCustomerContext();
  const [searchTerm, setSearchTerm] = useState("");

  const expiredList = useMemo(() => {
    return customers
      .filter((c) => c.status === "expired")
      .filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.phone.includes(searchTerm) ||
          c.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => b.daysRemaining - a.daysRemaining); // Most recently expired first
  }, [customers, searchTerm]);

  const allExpired = useMemo(
    () => customers.filter((c) => c.status === "expired"),
    [customers]
  );

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC]">
      {/* ======================================================== */}
      {/* DESKTOP LAYOUT (FIGMA 07 Expired - 1440x900)             */}
      {/* ======================================================== */}
      <div className="hidden lg:block px-10 py-8 space-y-6 max-w-[1440px]">
        {/* Top Bar (Figma: Heading + Subtitle on left, Search on right) */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-[26px] font-bold text-[#0F172A] tracking-tight leading-tight">
              Expired
            </h1>
            <p className="text-sm text-[#64748B] mt-1">
              {allExpired.length === 0
                ? "No expired subscriptions"
                : `${allExpired.length} subscriptions have expired · Renew them or follow up`}
            </p>
          </div>

          {/* Search Input (Figma: 300px width, 42px height) */}
          <div className="relative w-80">
            <img
              src={iconSearch}
              alt=""
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search name, phone or email"
              className="w-full h-[42px] rounded-[10px] border border-[#E2E8F0] bg-white pl-10 pr-3.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Expired Table (Figma: 16px radius, header #F1F5F9) */}
        {expiredList.length === 0 ? (
          <EmptyState type="nothing-expired" />
        ) : (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F1F5F9]">
                <tr className="border-b border-[#E2E8F0]">
                  <th className="py-3 px-6 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                    CUSTOMER
                  </th>
                  <th className="py-3 px-4 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider w-[150px]">
                    PHONE
                  </th>
                  <th className="py-3 px-4 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider w-[120px]">
                    EXPIRED ON
                  </th>
                  <th className="py-3 px-4 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider w-[130px]">
                    STATUS
                  </th>
                  <th className="py-3 px-6 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider text-right w-[200px]">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {expiredList.map((cust) => (
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

                    {/* Expired On (e.g. Oct 3, Sep 30) */}
                    <td className="py-3.5 px-4 text-sm font-medium text-[#0F172A] whitespace-nowrap">
                      {cust.displayExpires}
                    </td>

                    {/* Status (e.g. 2 days ago, 5 days ago) */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status="expired" daysRemaining={cust.daysRemaining} />
                    </td>

                    {/* Actions: Renew (Primary FIRST) + Message (Secondary SECOND) */}
                    <td
                      className="py-3.5 px-6 whitespace-nowrap text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-2">
                        {/* Renew Button (Button/primary with refresh icon) */}
                        <button
                          onClick={() => setActiveRenewingCustomer(cust)}
                          className="h-[34px] px-3.5 rounded-[10px] bg-[#4F46E5] hover:bg-[#4338CA] text-white text-[13px] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs active:scale-[0.99]"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-white" />
                          <span>Renew</span>
                        </button>

                        {/* Message Button (Button/secondary) */}
                        <button
                          onClick={() => setActiveRemindingCustomer(cust)}
                          className="h-[34px] px-3.5 rounded-[10px] bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#0F172A] text-[13px] font-semibold cursor-pointer transition-colors shadow-2xs"
                        >
                          Message
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
      {/* MOBILE LAYOUT (Expired Mobile)                           */}
      {/* ======================================================== */}
      <div className="lg:hidden pt-14 px-5 pb-24 space-y-5 max-w-[420px] mx-auto">
        <div>
          <h1 className="text-[28px] font-semibold text-[#0F172A] tracking-tight leading-tight">Expired</h1>
          <p className="text-sm text-[#64748B] mt-0.5 font-normal">
            {allExpired.length} subscriptions have expired
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

        {/* Mobile Cards */}
        {expiredList.length === 0 ? (
          <EmptyState type="nothing-expired" />
        ) : (
          <div className="space-y-2.5">
            {expiredList.map((cust) => (
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
                        Expired {cust.displayExpires}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status="expired" daysRemaining={cust.daysRemaining} />
                </div>

                {/* Mobile action buttons: Renew first, Message second */}
                <div
                  className="flex items-center gap-2 pt-1 border-t border-[#F1F5F9]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setActiveRenewingCustomer(cust)}
                    className="flex-1 h-9 rounded-lg bg-[#4F46E5] text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-[0.99]"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Renew</span>
                  </button>
                  <button
                    onClick={() => setActiveRemindingCustomer(cust)}
                    className="flex-1 h-9 rounded-lg bg-white border border-[#E2E8F0] text-[#0F172A] text-xs font-semibold flex items-center justify-center cursor-pointer shadow-2xs"
                  >
                    Message
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
