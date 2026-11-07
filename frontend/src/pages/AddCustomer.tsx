import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useCustomerContext } from "../context/CustomerContext";
import { useToast } from "../context/ToastContext";
import { ArrowLeft, User, Phone, Mail, Calendar, Check } from "lucide-react";

export const AddCustomer: React.FC = () => {
  const navigate = useNavigate();
  const { addCustomer } = useCustomerContext();
  const { success, error } = useToast();

  // Form State - empty by default or clean placeholders
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [startDate, setStartDate] = useState("2026-10-05"); // Default date matching Figma Oct 5, 2026
  const [durationMonths, setDurationMonths] = useState<number>(3);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to calculate end date
  const calculateEndDate = (start: string, months: number): { iso: string; display: string } => {
    try {
      const [year, month, day] = start.split("-").map(Number);
      const d = new Date(year, month - 1 + months, day);
      const iso = d.toISOString().split("T")[0];
      const monthsArr = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];
      const display = `${monthsArr[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
      return { iso, display };
    } catch {
      return { iso: "", display: "" };
    }
  };

  // Helper to format start date
  const formatDisplayDate = (start: string): string => {
    try {
      const [year, month, day] = start.split("-").map(Number);
      const d = new Date(year, month - 1, day);
      const monthsArr = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];
      return `${monthsArr[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    } catch {
      return start;
    }
  };

  const currentExpiry = useMemo(
    () => calculateEndDate(startDate, durationMonths),
    [startDate, durationMonths]
  );

  const end3 = useMemo(() => calculateEndDate(startDate, 3), [startDate]);
  const end6 = useMemo(() => calculateEndDate(startDate, 6), [startDate]);
  const end12 = useMemo(() => calculateEndDate(startDate, 12), [startDate]);

  // Days left calculation
  const daysLeft = useMemo(() => {
    try {
      const today = new Date("2026-10-05");
      const [year, month, day] = currentExpiry.iso.split("-").map(Number);
      const exp = new Date(year, month - 1, day);
      const diffTime = exp.getTime() - today.getTime();
      return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    } catch {
      return 92;
    }
  }, [currentExpiry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      error("Could not save customer", "Please check the details and try again.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addCustomer({
        name: name.trim(),
        fullName: name.trim(),
        phone: phone.trim(),
        email: email.trim() || `${name.toLowerCase().replace(/\s+/g, ".")}@email.com`,
        planName: "TV Subscription",
        durationMonths,
        startDate,
        expiryDate: currentExpiry.iso,
        price: durationMonths === 12 ? 120 : durationMonths === 6 ? 75 : 45,
      });

      success("Customer added successfully", `${name} · ${phone}`);
      navigate("/customers");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Could not save customer. Please try again.";
      error("Could not save customer", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC]">
      {/* ======================================================== */}
      {/* DESKTOP LAYOUT (FIGMA 04 Add Customer - 1440x900)        */}
      {/* ======================================================== */}
      <div className="hidden lg:block px-10 py-8 space-y-6 max-w-[1440px]">
        {/* Back Link (<- Customers) */}
        <button
          type="button"
          onClick={() => navigate("/customers")}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Customers</span>
        </button>

        {/* Heading & Subtitle */}
        <div className="space-y-1">
          <h1 className="text-[26px] font-bold text-[#0F172A] tracking-tight">
            Add Customer
          </h1>
          <p className="text-sm text-[#64748B]">
            Save a customer and their subscription. The expiry date is worked out for you.
          </p>
        </div>

        {/* 2-Column Layout: Form (Left) & Subscription summary (Right) */}
        <form onSubmit={handleSubmit} className="flex items-start gap-6">
          {/* LEFT: Add Customer Form (Figma 1:635) */}
          <div className="flex-1 bg-white rounded-2xl border border-[#E2E8F0] p-7 shadow-2xs space-y-6">
            {/* Section 1: Customer information */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-[#0F172A]">
                Customer information
              </h2>

              <div className="grid grid-cols-2 gap-4">
                {/* Full name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#334155]">
                    Full name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Sarah Khan"
                      className="w-full h-[44px] rounded-lg border border-[#CBD5E1] bg-white pl-10 pr-3.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-all shadow-2xs"
                    />
                  </div>
                </div>

                {/* Phone number */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#334155]">
                    Phone number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 555 019 2210"
                      className="w-full h-[44px] rounded-lg border border-[#CBD5E1] bg-white pl-10 pr-3.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-all shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#334155]">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah@email.com"
                    className="w-full h-[44px] rounded-lg border border-[#CBD5E1] bg-white pl-10 pr-3.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-all shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Divider line matching Figma */}
            <hr className="border-t border-[#E2E8F0]" />

            {/* Section 2: Subscription */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-[#0F172A]">
                Subscription
              </h2>

              {/* Start Date */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#334155]">
                  Subscription start date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full h-[44px] rounded-lg border border-[#CBD5E1] bg-white pl-10 pr-3.5 text-sm text-[#0F172A] focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-all shadow-2xs cursor-pointer"
                  />
                </div>
              </div>

              {/* Duration Options */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#334155]">
                  Subscription duration
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {/* 3 months */}
                  <div
                    onClick={() => setDurationMonths(3)}
                    className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      durationMonths === 3
                        ? "border-[#4F46E5] bg-[#EEF2FF]/40 ring-2 ring-[#4F46E5]/20"
                        : "border-[#E2E8F0] bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        durationMonths === 3
                          ? "border-[#4F46E5] bg-[#4F46E5]"
                          : "border-[#CBD5E1] bg-white"
                      }`}
                    >
                      {durationMonths === 3 && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#0F172A]">3 months</div>
                      <div className="text-xs text-[#64748B]">Ends {end3.display}</div>
                    </div>
                  </div>

                  {/* 6 months */}
                  <div
                    onClick={() => setDurationMonths(6)}
                    className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      durationMonths === 6
                        ? "border-[#4F46E5] bg-[#EEF2FF]/40 ring-2 ring-[#4F46E5]/20"
                        : "border-[#E2E8F0] bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        durationMonths === 6
                          ? "border-[#4F46E5] bg-[#4F46E5]"
                          : "border-[#CBD5E1] bg-white"
                      }`}
                    >
                      {durationMonths === 6 && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#0F172A]">6 months</div>
                      <div className="text-xs text-[#64748B]">Ends {end6.display}</div>
                    </div>
                  </div>

                  {/* 12 months */}
                  <div
                    onClick={() => setDurationMonths(12)}
                    className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      durationMonths === 12
                        ? "border-[#4F46E5] bg-[#EEF2FF]/40 ring-2 ring-[#4F46E5]/20"
                        : "border-[#E2E8F0] bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        durationMonths === 12
                          ? "border-[#4F46E5] bg-[#4F46E5]"
                          : "border-[#CBD5E1] bg-white"
                      }`}
                    >
                      {durationMonths === 12 && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#0F172A]">12 months</div>
                      <div className="text-xs text-[#64748B]">Ends {end12.display}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons (Figma: Cancel + Add Customer) */}
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => navigate("/customers")}
                className="h-[42px] px-5 rounded-[10px] border border-[#E2E8F0] bg-white hover:bg-slate-50 text-sm font-semibold text-[#0F172A] cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-[42px] px-5 rounded-[10px] bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all shadow-sm active:scale-[0.99] disabled:opacity-70"
              >
                <Check className="w-4 h-4" />
                <span>{isSubmitting ? "Adding..." : "Add Customer"}</span>
              </button>
            </div>
          </div>

          {/* RIGHT: Subscription Summary (Figma 1:692 - 360px) */}
          <div className="w-[360px] bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-2xs space-y-4 shrink-0">
            <h2 className="text-base font-semibold text-[#0F172A]">
              Subscription summary
            </h2>

            {/* Start date */}
            <div className="flex items-center justify-between text-sm py-1 border-b border-[#F1F5F9]">
              <span className="text-[#64748B]">Start date</span>
              <span className="font-medium text-[#0F172A]">
                {formatDisplayDate(startDate)}
              </span>
            </div>

            {/* Duration */}
            <div className="flex items-center justify-between text-sm py-1 border-b border-[#F1F5F9]">
              <span className="text-[#64748B]">Duration</span>
              <span className="font-medium text-[#0F172A]">{durationMonths} months</span>
            </div>

            {/* Expiry Highlight Box (Figma 1:700 - #EEF2FF, 12px radius) */}
            <div className="rounded-xl bg-[#EEF2FF] p-4 space-y-1">
              <div className="text-xs font-semibold text-[#4F46E5]">
                Expiration date
              </div>
              <div className="text-[22px] font-bold text-[#1E1B4B] tracking-tight">
                {currentExpiry.display}
              </div>
              <div className="text-[11px] text-[#64748B]">
                Calculated automatically
              </div>
            </div>

            {/* Status after saving */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-medium text-[#64748B]">
                Status after saving
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#15803D]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />
                Active · {daysLeft} days left
              </span>
            </div>
          </div>
        </form>
      </div>

      {/* ======================================================== */}
      {/* MOBILE LAYOUT (FIGMA M5 Add Customer - 390x844)          */}
      {/* ======================================================== */}
      <div className="lg:hidden pt-14 px-5 pb-24 space-y-4 max-w-[420px] mx-auto">
        {/* Back Link (Figma 1:2877: icon/arrowleft + Customers in #4F46E5) */}
        <button
          type="button"
          onClick={() => navigate("/customers")}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#4F46E5] hover:text-[#4338CA] cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-[18px] h-[18px] text-[#4F46E5]" />
          <span>Customers</span>
        </button>

        {/* Heading (Figma 1:2880: 28px w600) */}
        <h1 className="text-[28px] font-semibold text-[#0F172A] tracking-tight leading-tight">
          Add Customer
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Full name (Figma 1:2881: 52px height, 12px radius, border #E2E8F0, icon 18x18) */}
          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-[#334155]">
              Full name
            </label>
            <div className="h-[52px] rounded-xl bg-white border border-[#E2E8F0] px-3.5 flex items-center gap-2.5 shadow-2xs focus-within:border-[#4F46E5] focus-within:ring-1 focus-within:ring-[#4F46E5] transition-all">
              <User className="w-[18px] h-[18px] text-[#94A3B8] shrink-0" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sarah Khan"
                className="w-full text-base text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none bg-transparent font-normal"
              />
            </div>
          </div>

          {/* Phone number (Figma 1:2886: 52px height) */}
          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-[#334155]">
              Phone number
            </label>
            <div className="h-[52px] rounded-xl bg-white border border-[#E2E8F0] px-3.5 flex items-center gap-2.5 shadow-2xs focus-within:border-[#4F46E5] focus-within:ring-1 focus-within:ring-[#4F46E5] transition-all">
              <Phone className="w-[18px] h-[18px] text-[#94A3B8] shrink-0" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555 019 2210"
                className="w-full text-base text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none bg-transparent font-normal"
              />
            </div>
          </div>

          {/* Email (Figma 1:2891: 52px height) */}
          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-[#334155]">
              Email
            </label>
            <div className="h-[52px] rounded-xl bg-white border border-[#E2E8F0] px-3.5 flex items-center gap-2.5 shadow-2xs focus-within:border-[#4F46E5] focus-within:ring-1 focus-within:ring-[#4F46E5] transition-all">
              <Mail className="w-[18px] h-[18px] text-[#94A3B8] shrink-0" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@email.com"
                className="w-full text-base text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none bg-transparent font-normal"
              />
            </div>
          </div>

          {/* Subscription start date (Figma 1:2896: 52px height) */}
          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-[#334155]">
              Subscription start date
            </label>
            <div className="h-[52px] rounded-xl bg-white border border-[#E2E8F0] px-3.5 flex items-center gap-2.5 shadow-2xs focus-within:border-[#4F46E5] focus-within:ring-1 focus-within:ring-[#4F46E5] transition-all">
              <Calendar className="w-[18px] h-[18px] text-[#94A3B8] shrink-0" />
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full text-base text-[#0F172A] focus:outline-none bg-transparent font-normal"
              />
            </div>
          </div>

          {/* Subscription duration (Figma 1:2901: 3 pills 50px height) */}
          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-[#334155]">
              Subscription duration
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[3, 6, 12].map((m) => {
                const isSelected = durationMonths === m;
                return (
                  <button
                    type="button"
                    key={m}
                    onClick={() => setDurationMonths(m)}
                    className={`h-[48px] rounded-xl text-sm font-medium transition-all cursor-pointer flex items-center justify-center ${
                      isSelected
                        ? "bg-[#EEF2FF] border border-[#4F46E5] text-[#4338CA] shadow-2xs"
                        : "bg-white border border-[#E2E8F0] text-[#334155] hover:border-slate-300"
                    }`}
                  >
                    {m} mo
                  </button>
                );
              })}
            </div>
          </div>

          {/* Expiration date Box (Figma 1:2906: 68px height, bg #EEF2FF, radius 12px) */}
          <div className="h-[68px] rounded-xl bg-[#EEF2FF] px-4 py-3 flex items-center justify-between">
            <div>
              <div className="text-xs text-[#4338CA] font-normal">
                Expiration date
              </div>
              <div className="text-lg font-semibold text-[#4338CA] leading-tight mt-0.5">
                {currentExpiry.display}
              </div>
            </div>
            <span className="text-xs text-[#64748B] font-normal">
              Auto-calculated
            </span>
          </div>

          {/* Submit Button (Figma 1:2912: 46px height, bg #4F46E5, radius 12px) */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-[46px] rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.99] disabled:opacity-70 transition-all mt-4"
          >
            <Check className="w-[18px] h-[18px] text-white" />
            <span>{isSubmitting ? "Adding..." : "Add Customer"}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
