import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useCustomerContext } from "../context/CustomerContext";
import { getCustomerByIdApi } from "../api/customer.api";
import type { Customer } from "../types/customer";
import { StatusBadge } from "../components/shared/StatusBadge";
import {
  ArrowLeft,
  Phone,
  Mail,
  Edit,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "../components/ui/button";
import iconMessage from "../assets/icons/icon-message.svg";

// Helper to format ISO date "2026-07-08" to "Jul 8, 2026"
const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  if (dateStr.includes(",")) return dateStr;
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const month = months[parseInt(parts[1], 10) - 1];
    const day = parseInt(parts[2], 10);
    const year = parts[0];
    return `${month} ${day}, ${year}`;
  }
  return dateStr;
};

export const CustomerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getCustomerById,
    setActiveRemindingCustomer,
    setActiveRenewingCustomer,
    setActiveDeletingCustomer,
  } = useCustomerContext();

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [fetchedCustomer, setFetchedCustomer] = useState<Customer | null>(null);
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(false);

  useEffect(() => {
    if (id) {
      const existing = getCustomerById(id);
      if (!existing) {
        setIsLoadingCustomer(true);
        getCustomerByIdApi(id)
          .then((cust) => setFetchedCustomer(cust))
          .catch((err) => console.error("Could not fetch customer by ID:", err))
          .finally(() => setIsLoadingCustomer(false));
      }
    }
  }, [id, getCustomerById]);

  const customer = (id ? getCustomerById(id) : undefined) || fetchedCustomer;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Calculate subscription progress percentage
  const progressPercent = useMemo(() => {
    if (!customer) return 0;
    if (customer.status === "expired") return 100;
    if (customer.status === "expiring") return 92;
    return 35;
  }, [customer]);

  if (isLoadingCustomer) {
    return (
      <div className="w-full min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-8">
        <div className="w-8 h-8 border-3 border-[#4F46E5] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm text-[#64748B]">Loading customer details...</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="w-full min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-xl font-bold text-[#0F172A]">Customer not found</h2>
        <p className="text-sm text-[#64748B] mt-1">The customer you are looking for does not exist.</p>
        <Button onClick={() => navigate("/customers")} className="mt-4 bg-[#4F46E5] text-white">
          Back to customers
        </Button>
      </div>
    );
  }

  const formattedStart = formatDate(customer.startDate);
  const formattedExpiry = formatDate(customer.expiryDate);
  const createdDate = formatDate(customer.createdAt || customer.startDate);

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC]">
      {/* ======================================================== */}
      {/* DESKTOP LAYOUT (FIGMA 05 Customer Details - 1440x900)    */}
      {/* ======================================================== */}
      <div className="hidden lg:block px-10 py-8 space-y-6 max-w-[1440px]">
        {/* Back Link (<- Customers in exact brand purple #4F46E5) */}
        <button
          type="button"
          onClick={() => navigate("/customers")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#4F46E5] hover:text-[#4338CA] transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 text-[#4F46E5] transition-transform group-hover:-translate-x-0.5" />
          <span>Customers</span>
        </button>

        {/* Customer Header Row (Figma Header) */}
        <div className="flex items-center justify-between gap-6 pb-2">
          {/* Avatar + Name + Subtitle */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#EEF2FF] text-[#4F46E5] font-bold text-xl flex items-center justify-center shrink-0">
              {customer.initials}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-[26px] font-bold text-[#0F172A] tracking-tight">
                  {customer.name}
                </h1>
                <StatusBadge status={customer.status} daysRemaining={customer.daysRemaining} />
              </div>
              <p className="text-sm text-[#64748B]">
                Customer since {createdDate}
              </p>
            </div>
          </div>

          {/* 3 Action Buttons matching Figma exact colors */}
          <div className="flex items-center gap-3">
            {/* Edit Button (Button/secondary: Slate-700 #334155 icon & text) */}
            <button
              onClick={() => alert(`Edit profile for ${customer.name}`)}
              className="h-[42px] px-4 rounded-[10px] border border-[#E2E8F0] bg-white hover:bg-slate-50 text-sm font-semibold text-[#334155] flex items-center gap-2 cursor-pointer transition-all shadow-2xs"
            >
              <Edit className="w-4 h-4 text-[#334155]" />
              <span>Edit</span>
            </button>

            {/* Send Reminder Button (Button/soft: Indigo #4338CA icon & text) */}
            <button
              onClick={() => setActiveRemindingCustomer(customer)}
              className="h-[42px] px-[18px] py-[11px] rounded-[10px] bg-[#EEF2FF] hover:bg-[#E0E7FF] text-sm font-semibold text-[#4338CA] flex items-center gap-2 cursor-pointer transition-all shadow-2xs"
            >
              <img src={iconMessage} alt="" className="w-4 h-4" />
              <span>Send Reminder</span>
            </button>

            {/* Renew Subscription Button (Button/primary: White icon & text) */}
            <button
              onClick={() => setActiveRenewingCustomer(customer)}
              className="h-[42px] px-4 rounded-[10px] bg-[#4F46E5] hover:bg-[#4338CA] text-sm font-semibold text-white flex items-center gap-2 cursor-pointer transition-all shadow-sm active:scale-[0.99]"
            >
              <RefreshCw className="w-4 h-4 text-white" />
              <span>Renew Subscription</span>
            </button>
          </div>
        </div>

        {/* 2-Column Content Grid */}
        <div className="grid grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN (Cols 1-7: Subscription Details & Renewal History) */}
          <div className="col-span-7 space-y-6">
            {/* Card 1: Subscription Card */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
              {/* Header */}
              <div className="px-6 py-5 border-b border-[#F1F5F9]">
                <h2 className="text-base font-semibold text-[#0F172A]">Subscription</h2>
                <p className="text-xs text-[#64748B] mt-0.5">Current plan details</p>
              </div>

              {/* Progress Track Section */}
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span
                    className={
                      customer.status === "expiring"
                        ? "text-[#B45309] font-semibold"
                        : customer.status === "expired"
                        ? "text-[#DC2626] font-semibold"
                        : "text-[#16A34A] font-semibold"
                    }
                  >
                    {customer.daysRemaining > 0
                      ? `${customer.daysRemaining} days left`
                      : `Expired ${Math.abs(customer.daysRemaining)} days ago`}
                  </span>
                  <span className="text-[#0F172A]">Expires {formattedExpiry}</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      customer.status === "expired"
                        ? "bg-[#DC2626]"
                        : customer.status === "expiring"
                        ? "bg-[#D97706]"
                        : "bg-[#16A34A]"
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-[#64748B]">
                  <span>{formattedStart}</span>
                  <span>{formattedExpiry}</span>
                </div>
              </div>

              {/* Detail Rows */}
              <div className="border-t border-[#F1F5F9] divide-y divide-[#F1F5F9]">
                <div className="px-6 py-3.5 flex items-center justify-between text-sm">
                  <span className="text-[#64748B]">Start date</span>
                  <span className="font-medium text-[#0F172A]">{formattedStart}</span>
                </div>
                <div className="px-6 py-3.5 flex items-center justify-between text-sm">
                  <span className="text-[#64748B]">Duration</span>
                  <span className="font-medium text-[#0F172A]">{customer.durationMonths} months</span>
                </div>
                <div className="px-6 py-3.5 flex items-center justify-between text-sm">
                  <span className="text-[#64748B]">Expiration date</span>
                  <span className="font-medium text-[#0F172A]">{formattedExpiry}</span>
                </div>
              </div>
            </div>

            {/* Card 2: Renewal History (Both have green checkmark #16A34A inside #DCFCE7) */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
              <div className="px-6 py-5 border-b border-[#F1F5F9]">
                <h2 className="text-base font-semibold text-[#0F172A]">Renewal history</h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Every time this subscription was renewed
                </p>
              </div>

              <div className="divide-y divide-[#F1F5F9]">
                {/* Event 1 */}
                <div className="px-6 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#0F172A]">
                      Renewed for {customer.durationMonths} months
                    </div>
                    <div className="text-xs text-[#64748B] mt-0.5">
                      {formattedStart} &nbsp;→&nbsp; {formattedExpiry}
                    </div>
                  </div>
                </div>

                {/* Event 2 (First subscription - exact Figma green checkmark #16A34A inside #DCFCE7) */}
                <div className="px-6 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#0F172A]">
                      First subscription · {customer.durationMonths} months
                    </div>
                    <div className="text-xs text-[#64748B] mt-0.5">
                      {createdDate} &nbsp;→&nbsp; {formattedStart}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Cols 8-12: Contact & Danger Zone) */}
          <div className="col-span-5 space-y-6">
            {/* Card 1: Contact Info */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
              <div className="px-6 py-5 border-b border-[#F1F5F9]">
                <h2 className="text-base font-semibold text-[#0F172A]">Contact</h2>
              </div>

              <div className="divide-y divide-[#F1F5F9]">
                {/* Phone: icon container bg #F1F5F9, icon vector #334155 */}
                <div className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-[10px] bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center">
                      <Phone className="w-4 h-4 text-[#334155]" />
                    </div>
                    <div>
                      <div className="text-xs text-[#64748B]">Phone</div>
                      <div className="text-sm font-medium text-[#0F172A]">{customer.phone}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(customer.phone, "phone")}
                    className="p-2 rounded-lg text-[#94A3B8] hover:text-[#0F172A] hover:bg-slate-100 cursor-pointer transition-colors"
                    title="Copy phone"
                  >
                    {copiedField === "phone" ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-[#94A3B8]" />
                    )}
                  </button>
                </div>

                {/* Email: icon container bg #F1F5F9, icon vector #334155 */}
                <div className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-[10px] bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center">
                      <Mail className="w-4 h-4 text-[#334155]" />
                    </div>
                    <div>
                      <div className="text-xs text-[#64748B]">Email</div>
                      <div className="text-sm font-medium text-[#0F172A]">{customer.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(customer.email, "email")}
                    className="p-2 rounded-lg text-[#94A3B8] hover:text-[#0F172A] hover:bg-slate-100 cursor-pointer transition-colors"
                    title="Copy email"
                  >
                    {copiedField === "email" ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-[#94A3B8]" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Danger Zone (Figma: Solid white card, border #E2E8F0, dark title #0F172A, button #334155) */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-2xs space-y-3">
              <h2 className="text-base font-semibold text-[#0F172A]">Delete customer</h2>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Removes this customer and their subscription records. This cannot be undone.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setActiveDeletingCustomer(customer)}
                  className="h-10 px-4 rounded-[10px] border border-[#E2E8F0] bg-white hover:bg-slate-50 text-[#334155] text-sm font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-2xs"
                >
                  <Trash2 className="w-4 h-4 text-[#334155]" />
                  <span>Delete customer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MOBILE LAYOUT (FIGMA M4 Customer Details - 390x844)      */}
      {/* ======================================================== */}
      <div className="lg:hidden pt-14 px-5 pb-24 space-y-4 max-w-[420px] mx-auto">
        {/* Back Link (Figma 1:2804: icon/arrowleft + Customers in #4F46E5) */}
        <button
          type="button"
          onClick={() => navigate("/customers")}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#4F46E5] hover:text-[#4338CA] cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-[18px] h-[18px] text-[#4F46E5]" />
          <span>Customers</span>
        </button>

        {/* Customer Header Row (Figma 1:2808: 56x56 Avatar + 28px Name + Badge) */}
        <div className="flex items-center gap-3.5 pt-1">
          <div className="w-14 h-14 rounded-full bg-[#E0E7FF] text-[#4338CA] font-semibold text-lg flex items-center justify-center shrink-0">
            {customer.initials}
          </div>
          <div>
            <h1 className="text-[28px] font-semibold text-[#0F172A] tracking-tight leading-tight">
              {customer.name}
            </h1>
            <div className="mt-1">
              {customer.status === "expiring" && (
                <span className="h-[26px] px-2.5 rounded-full bg-[#FEF3C7] text-[#B45309] text-[13px] font-medium inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                  <span>Expiring</span>
                </span>
              )}
              {customer.status === "active" && (
                <span className="h-[26px] px-2.5 rounded-full bg-[#DCFCE7] text-[#15803D] text-[13px] font-medium inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                  <span>Active</span>
                </span>
              )}
              {customer.status === "expired" && (
                <span className="h-[26px] px-2.5 rounded-full bg-[#FEE2E2] text-[#B91C1C] text-[13px] font-medium inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                  <span>Expired</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Countdown Card (Figma 1:2815: Height 130px, radius 16px, pad 18px) */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-[18px] flex flex-col justify-between h-[130px] shadow-2xs">
          <div className="text-xs text-[#64748B] font-normal">Time remaining</div>
          <div
            className={`text-4xl font-bold tracking-tight ${
              customer.status === "expiring"
                ? "text-[#D97706]"
                : customer.status === "expired"
                ? "text-[#DC2626]"
                : "text-[#16A34A]"
            }`}
          >
            {customer.status === "expired"
              ? `Expired ${Math.abs(customer.daysRemaining)} days ago`
              : `${customer.daysRemaining} days left`}
          </div>
          {/* Progress bar (Figma: 310x10px, radius 5px, fill #E2E8F0, inner fill #D97706/#DC2626/#16A34A) */}
          <div className="w-full h-2.5 rounded-[5px] bg-[#E2E8F0] overflow-hidden">
            <div
              className={`h-full rounded-[5px] transition-all duration-500 ${
                customer.status === "expired"
                  ? "bg-[#DC2626]"
                  : customer.status === "expiring"
                  ? "bg-[#D97706]"
                  : "bg-[#16A34A]"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Subscription Info Card (Figma 1:2820: Height 246px, radius 16px, 5 rows of 49px) */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] divide-y divide-[#E2E8F0] overflow-hidden shadow-2xs">
          <div className="flex items-center justify-between px-[18px] py-[13px] h-[49px]">
            <span className="text-sm font-normal text-[#64748B]">Start date</span>
            <span className="text-sm font-medium text-[#0F172A]">{formattedStart}</span>
          </div>
          <div className="flex items-center justify-between px-[18px] py-[13px] h-[49px]">
            <span className="text-sm font-normal text-[#64748B]">Duration</span>
            <span className="text-sm font-medium text-[#0F172A]">{customer.durationMonths} months</span>
          </div>
          <div className="flex items-center justify-between px-[18px] py-[13px] h-[49px]">
            <span className="text-sm font-normal text-[#64748B]">Expires</span>
            <span className="text-sm font-medium text-[#0F172A]">{formattedExpiry}</span>
          </div>
          <div className="flex items-center justify-between px-[18px] py-[13px] h-[49px]">
            <span className="text-sm font-normal text-[#64748B]">Phone</span>
            <span className="text-sm font-medium text-[#0F172A]">{customer.phone}</span>
          </div>
          <div className="flex items-center justify-between px-[18px] py-[13px] h-[48px]">
            <span className="text-sm font-normal text-[#64748B]">Email</span>
            <span className="text-sm font-medium text-[#0F172A] truncate max-w-[200px] text-right">{customer.email}</span>
          </div>
        </div>

        {/* Action Buttons Stack (Figma 1:2836: Primary 46px, Soft 46px, Secondary 48px) */}
        <div className="space-y-3 pt-1">
          {/* Renew Subscription (Button/primary) */}
          <button
            type="button"
            onClick={() => setActiveRenewingCustomer(customer)}
            className="w-full h-[46px] rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.99] transition-all"
          >
            <RefreshCw className="w-[18px] h-[18px] text-white" />
            <span>Renew Subscription</span>
          </button>

          {/* Send Reminder (Button/soft) */}
          <button
            type="button"
            onClick={() => setActiveRemindingCustomer(customer)}
            className="w-full h-[46px] rounded-xl bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#4338CA] text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] transition-all"
          >
            <img src={iconMessage} alt="" className="w-[18px] h-[18px]" />
            <span>Send Reminder</span>
          </button>

          {/* Edit customer (Button/secondary) */}
          <button
            type="button"
            onClick={() => alert(`Edit ${customer.name}`)}
            className="w-full h-12 rounded-xl bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#334155] text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-2xs active:scale-[0.99] transition-all"
          >
            <Edit className="w-[18px] h-[18px] text-[#334155]" />
            <span>Edit customer</span>
          </button>

          {/* Delete customer option */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => setActiveDeletingCustomer(customer)}
              className="text-xs text-[#DC2626] hover:underline font-medium cursor-pointer"
            >
              Delete customer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
