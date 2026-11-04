import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useCustomerContext } from "../context/CustomerContext";
import { useAuth } from "../hooks/useAuth";
import { PageHeader } from "../components/shared/PageHeader";

// Exact Figma SVGs
import iconBannerAlert from "../assets/icons/icon-banner-alert.svg";
import statUsers from "../assets/icons/stat-users.svg";
import statCheck from "../assets/icons/stat-check.svg";
import statClock from "../assets/icons/stat-clock.svg";
import statAlert from "../assets/icons/stat-alert.svg";
import iconMessage from "../assets/icons/icon-message.svg";

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { customers, stats, setActiveRemindingCustomer } = useCustomerContext();
  const [searchTerm, setSearchTerm] = useState("");

  const expiringCustomers = customers
    .filter((c) => c.status === "expiring")
    .sort((a, b) => a.daysRemaining - b.daysRemaining);

  const expiredCustomers = customers.filter((c) => c.status === "expired");
  const attentionCount = stats.expiring + stats.expired;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/customers?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleAddCustomer = () => navigate("/customers/new");

  return (
    <div className="w-full">
      {/* ======================================================== */}
      {/* DESKTOP DASHBOARD (FIGMA 02 Dashboard - EXACT 1440x900)  */}
      {/* ======================================================== */}
      <div className="hidden lg:block px-10 py-8 space-y-6 max-w-[1440px]">
        {/* Top bar (Reusable PageHeader matching Figma 02 Dashboard & 03 Customers) */}
        <PageHeader
          title="Dashboard"
          subtitle="Monday, October 5, 2026 · Here is who needs your attention today"
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSearchSubmit={handleSearchSubmit}
          showAddButton={stats.total > 0}
          onAddClick={handleAddCustomer}
        />

        {/* Attention Banner (Figma: height 64px, bg #FFFBEB, border #FDE68A) */}
        <div className="flex items-center justify-between rounded-2xl border border-[#FDE68A] bg-[#FFFBEB] px-5 py-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FEF3C7]">
              <img src={iconBannerAlert} alt="alert" className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-[#92400E]">
              <span className="font-bold">{attentionCount} customers</span> need your attention
              — {stats.expiring} expire within 10 days and {stats.expired} have already expired.
            </p>
          </div>

          <button
            onClick={() => navigate("/expiring")}
            className="h-9 px-4 rounded-lg border border-[#CBD5E1] bg-white text-xs font-semibold text-[#0F172A] hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            Review now
          </button>
        </div>

        {/* 4 Stat Cards with EXACT Figma SVGs */}
        <div className="grid grid-cols-4 gap-4">
          {/* Card 1: Total customers (stat-users.svg) */}
          <div
            onClick={() => navigate("/customers")}
            className="h-[152px] rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between cursor-pointer hover:border-slate-300 transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F1F5F9]">
                <img src={statUsers} alt="users" className="w-4 h-4" />
              </div>
              <span className="text-[13px] font-medium text-[#64748B]">
                Total customers
              </span>
            </div>
            <div className="text-[36px] font-bold text-[#0F172A] leading-none">
              {stats.total}
            </div>
            <div className="text-[13px] text-[#64748B]">
              All saved customers
            </div>
          </div>

          {/* Card 2: Active (stat-check.svg) */}
          <div
            onClick={() => navigate("/customers?status=active")}
            className="h-[152px] rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between cursor-pointer hover:border-emerald-300 transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#DCFCE7]">
                <img src={statCheck} alt="active" className="w-4 h-4" />
              </div>
              <span className="text-[13px] font-medium text-[#64748B]">
                Active
              </span>
            </div>
            <div className="text-[36px] font-bold text-[#16A34A] leading-none">
              {stats.active}
            </div>
            <div className="text-[13px] text-[#64748B]">
              More than 10 days left
            </div>
          </div>

          {/* Card 3: Expiring soon (stat-clock.svg) */}
          <div
            onClick={() => navigate("/expiring")}
            className="h-[152px] rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between cursor-pointer hover:border-amber-300 transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FEF3C7]">
                <img src={statClock} alt="expiring" className="w-4 h-4" />
              </div>
              <span className="text-[13px] font-medium text-[#64748B]">
                Expiring soon
              </span>
            </div>
            <div className="text-[36px] font-bold text-[#D97706] leading-none">
              {stats.expiring}
            </div>
            <div className="text-[13px] text-[#64748B]">
              Within the next 10 days
            </div>
          </div>

          {/* Card 4: Expired (stat-alert.svg) */}
          <div
            onClick={() => navigate("/expired")}
            className="h-[152px] rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between cursor-pointer hover:border-rose-300 transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FEE2E2]">
                <img src={statAlert} alt="expired" className="w-4 h-4" />
              </div>
              <span className="text-[13px] font-medium text-[#64748B]">
                Expired
              </span>
            </div>
            <div className="text-[36px] font-bold text-[#DC2626] leading-none">
              {stats.expired}
            </div>
            <div className="text-[13px] text-[#64748B]">Follow up to renew</div>
          </div>
        </div>

        {/* Lists Section */}
        <div className="grid grid-cols-12 gap-5">
          {/* Expiring Soon (Takes 8 cols) */}
          <div className="col-span-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-[#0F172A]">
                Expiring Soon
              </h2>
              <p className="text-[13px] text-[#64748B]">Sorted by days left</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F1F5F9]">
                  <tr className="border-b border-[#E2E8F0] text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                    <th className="pb-3 px-2">CUSTOMER</th>
                    <th className="pb-3 px-2">EXPIRES</th>
                    <th className="pb-3 px-2">REMAINING</th>
                    <th className="pb-3 px-2 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Row 1: John Smith */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-[#E0E7FF] text-[#4338CA] flex items-center justify-center font-bold text-xs shrink-0">
                          JS
                        </div>
                        <span className="font-semibold text-[#0F172A] text-sm">
                          John Smith
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2 font-medium text-[#334155] text-sm">
                      Oct 8
                    </td>
                    <td className="py-3 px-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#B45309]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#D97706]" />
                        3 days left
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() =>
                          setActiveRemindingCustomer(
                            expiringCustomers[0] || null,
                          )
                        }
                        className="h-[34px] px-3 py-[7px] rounded-[10px] bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#4338CA] text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
                      >
                        <img
                          src={iconMessage}
                          alt="message"
                          className="w-4 h-4 shrink-0"
                        />
                        <span>Send Reminder</span>
                      </button>
                    </td>
                  </tr>

                  {/* Row 2: Michael Brown */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-[#E0E7FF] text-[#4338CA] flex items-center justify-center font-bold text-xs shrink-0">
                          MB
                        </div>
                        <span className="font-semibold text-[#0F172A] text-sm">
                          Michael Brown
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2 font-medium text-[#334155] text-sm">
                      Oct 12
                    </td>
                    <td className="py-3 px-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#B45309]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#D97706]" />
                        7 days left
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() =>
                          setActiveRemindingCustomer(
                            expiringCustomers[1] || null,
                          )
                        }
                        className="h-[34px] px-3 py-[7px] rounded-[10px] bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#4338CA] text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
                      >
                        <img
                          src={iconMessage}
                          alt="message"
                          className="w-4 h-4 shrink-0"
                        />
                        <span>Send Reminder</span>
                      </button>
                    </td>
                  </tr>

                  {/* Row 3: David Lee */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-[#E0E7FF] text-[#4338CA] flex items-center justify-center font-bold text-xs shrink-0">
                          DL
                        </div>
                        <span className="font-semibold text-[#0F172A] text-sm">
                          David Lee
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2 font-medium text-[#334155] text-sm">
                      Oct 15
                    </td>
                    <td className="py-3 px-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#B45309]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#D97706]" />
                        10 days left
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() =>
                          setActiveRemindingCustomer(
                            expiringCustomers[2] || null,
                          )
                        }
                        className="h-[34px] px-3 py-[7px] rounded-[10px] bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#4338CA] text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
                      >
                        <img
                          src={iconMessage}
                          alt="message"
                          className="w-4 h-4 shrink-0"
                        />
                        <span>Send Reminder</span>
                      </button>
                    </td>
                  </tr>

                  {/* Row 4: Priya Das */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-[#E0E7FF] text-[#4338CA] flex items-center justify-center font-bold text-xs shrink-0">
                          PD
                        </div>
                        <span className="font-semibold text-[#0F172A] text-sm">
                          Priya Das
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2 font-medium text-[#334155] text-sm">
                      Oct 15
                    </td>
                    <td className="py-3 px-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#B45309]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#D97706]" />
                        10 days left
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() =>
                          setActiveRemindingCustomer(
                            expiringCustomers[3] || null,
                          )
                        }
                        className="h-[34px] px-3 py-[7px] rounded-[10px] bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#4338CA] text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
                      >
                        <img
                          src={iconMessage}
                          alt="message"
                          className="w-4 h-4 shrink-0"
                        />
                        <span>Send Reminder</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Recently Expired (Takes 4 cols) */}
          <div className="col-span-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="mb-5">
                <h2 className="text-lg font-bold text-[#0F172A]">
                  Recently Expired
                </h2>
                <p className="text-[13px] text-[#64748B]">Renew or follow up</p>
              </div>

              <div className="space-y-4">
                {/* Robert Hall */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-[#E0E7FF] text-[#4338CA] flex items-center justify-center font-bold text-xs shrink-0">
                      RH
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#0F172A]">
                        Robert Hall
                      </div>
                      <div className="text-xs text-[#DC2626] font-medium">
                        Expired 2 days ago
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setActiveRemindingCustomer(expiredCustomers[0] || null)
                    }
                    className="h-9 px-3.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-[#334155] hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Message
                  </button>
                </div>

                {/* James Cole */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-[#E0E7FF] text-[#4338CA] flex items-center justify-center font-bold text-xs shrink-0">
                      JC
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#0F172A]">
                        James Cole
                      </div>
                      <div className="text-xs text-[#DC2626] font-medium">
                        Expired 5 days ago
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setActiveRemindingCustomer(expiredCustomers[1] || null)
                    }
                    className="h-9 px-3.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-[#334155] hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Message
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-slate-100">
              <Link
                to="/expired"
                className="text-sm font-semibold text-[#4F46E5] hover:underline flex items-center gap-1"
              >
                View all expired →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MOBILE LAYOUT (FIGMA M2 Dashboard - 390x844)             */}
      {/* ======================================================== */}
      <div className="lg:hidden px-5 pt-6 pb-24 space-y-5 max-w-[420px] mx-auto">
        {/* Top Header: Date + Title on left, Avatar AO on right (Figma 1:2626) */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-[#64748B] font-normal">Mon, Oct 5</div>
            <h1 className="text-[26px] font-bold text-[#0F172A] tracking-tight leading-tight mt-0.5">
              Dashboard
            </h1>
          </div>

          {/* 40x40px Owner Avatar (Figma 1:2630: AO in #4338CA, bg #E0E7FF) */}
          <div className="w-10 h-10 rounded-full bg-[#E0E7FF] text-[#4338CA] font-bold text-sm flex items-center justify-center shrink-0">
            {user?.fullName || user?.firstName
              ? (user.fullName || user.firstName || "")
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              : "AO"}
          </div>
        </div>

        {/* Attention Banner (Figma 1:2632: 46px height, bg #FEF3C7, 12px radius, icon/alert in #B45309) */}
        <div
          onClick={() => navigate("/expiring")}
          className="flex items-center gap-2.5 h-[46px] px-3.5 rounded-xl bg-[#FEF3C7] text-[#B45309] text-sm font-semibold cursor-pointer active:scale-[0.99] transition-transform"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 20 20"
            fill="none"
            className="shrink-0"
          >
            <path
              d="M9.99984 2.5L1.6665 16.6667H18.3332L9.99984 2.5Z"
              stroke="#B45309"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 8.33337V11.6667"
              stroke="#B45309"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 14.1666H10.0083"
              stroke="#B45309"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="truncate">
            {stats.expiring + stats.expired} customers need your attention
          </span>
        </div>

        {/* 3 Stat Cards Grid (Figma 1:2638: Expired, Expiring, Active - 96px height each, 14px radius) */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Stat/Expired (Figma 1:2639 - bg #FEE2E2) */}
          <div
            onClick={() => navigate("/expired")}
            className="h-24 rounded-[14px] bg-[#FEE2E2] p-3.5 flex flex-col justify-between cursor-pointer active:scale-[0.98] transition-transform"
          >
            <div className="text-[32px] font-bold text-[#DC2626] leading-none">
              {stats.expired}
            </div>
            <div className="text-[13px] font-medium text-[#B91C1C]">
              Expired
            </div>
          </div>

          {/* Stat/Expiring (Figma 1:2642 - bg #FEF3C7) */}
          <div
            onClick={() => navigate("/expiring")}
            className="h-24 rounded-[14px] bg-[#FEF3C7] p-3.5 flex flex-col justify-between cursor-pointer active:scale-[0.98] transition-transform"
          >
            <div className="text-[32px] font-bold text-[#D97706] leading-none">
              {stats.expiring}
            </div>
            <div className="text-[13px] font-medium text-[#B45309]">
              Expiring
            </div>
          </div>

          {/* Stat/Active (Figma 1:2645 - bg #DCFCE7) */}
          <div
            onClick={() => navigate("/customers")}
            className="h-24 rounded-[14px] bg-[#DCFCE7] p-3.5 flex flex-col justify-between cursor-pointer active:scale-[0.98] transition-transform"
          >
            <div className="text-[32px] font-bold text-[#16A34A] leading-none">
              {stats.active}
            </div>
            <div className="text-[13px] font-medium text-[#15803D]">Active</div>
          </div>
        </div>

        {/* Section Header: Needs your attention + See all link (Figma 1:2648) */}
        <div className="flex items-center justify-between pt-1">
          <h2 className="text-base font-bold text-[#0F172A]">
            Needs your attention
          </h2>
          <button
            type="button"
            onClick={() => navigate("/expiring")}
            className="text-sm font-semibold text-[#4F46E5] hover:text-[#4338CA] cursor-pointer"
          >
            See all
          </button>
        </div>

        {/* 3 List Items matching Figma exact M2 cards (82px height, border #E2E8F0, rounded-[14px]) */}
        <div className="space-y-2.5">
          {/* Card 1: Robert Hall (Expired 2 days ago) */}
          {expiredCustomers[0] && (
            <div
              onClick={() => navigate(`/customers/${expiredCustomers[0].id}`)}
              className="flex items-center justify-between h-[82px] px-3.5 rounded-[14px] bg-white border border-[#E2E8F0] shadow-2xs cursor-pointer hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-[#E0E7FF] text-[#4338CA] font-bold text-sm flex items-center justify-center shrink-0">
                  {expiredCustomers[0].initials}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-[#0F172A] leading-tight truncate">
                    {expiredCustomers[0].name}
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#FEE2E2] text-[#B91C1C] mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                    <span>Expired 2 days ago</span>
                  </div>
                </div>
              </div>

              {/* Action Button: 40x40px #F1F5F9 with slate message icon */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveRemindingCustomer(expiredCustomers[0]);
                }}
                className="w-10 h-10 rounded-xl bg-[#F1F5F9] hover:bg-slate-200 text-[#334155] flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                title="Message"
              >
                <img
                  src={iconMessage}
                  alt="message"
                  className="w-[18px] h-[18px] grayscale opacity-80"
                />
              </button>
            </div>
          )}

          {/* Card 2: John Smith (3 days left) */}
          {expiringCustomers[0] && (
            <div
              onClick={() => navigate(`/customers/${expiringCustomers[0].id}`)}
              className="flex items-center justify-between h-[82px] px-3.5 rounded-[14px] bg-white border border-[#E2E8F0] shadow-2xs cursor-pointer hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-[#E0E7FF] text-[#4338CA] font-bold text-sm flex items-center justify-center shrink-0">
                  {expiringCustomers[0].initials}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-[#0F172A] leading-tight truncate">
                    {expiringCustomers[0].name}
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#B45309] mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                    <span>3 days left</span>
                  </div>
                </div>
              </div>

              {/* Action Button: 40x40px #EEF2FF with indigo message icon */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveRemindingCustomer(expiringCustomers[0]);
                }}
                className="w-10 h-10 rounded-xl bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#4338CA] flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                title="Send Reminder"
              >
                <img
                  src={iconMessage}
                  alt="message"
                  className="w-[18px] h-[18px]"
                />
              </button>
            </div>
          )}

          {/* Card 3: Michael Brown (7 days left) */}
          {expiringCustomers[1] && (
            <div
              onClick={() => navigate(`/customers/${expiringCustomers[1].id}`)}
              className="flex items-center justify-between h-[82px] px-3.5 rounded-[14px] bg-white border border-[#E2E8F0] shadow-2xs cursor-pointer hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-[#E0E7FF] text-[#4338CA] font-bold text-sm flex items-center justify-center shrink-0">
                  {expiringCustomers[1].initials}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-[#0F172A] leading-tight truncate">
                    {expiringCustomers[1].name}
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#B45309] mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                    <span>7 days left</span>
                  </div>
                </div>
              </div>

              {/* Action Button: 40x40px #EEF2FF with indigo message icon */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveRemindingCustomer(expiringCustomers[1]);
                }}
                className="w-10 h-10 rounded-xl bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#4338CA] flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                title="Send Reminder"
              >
                <img
                  src={iconMessage}
                  alt="message"
                  className="w-[18px] h-[18px]"
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
