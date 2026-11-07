import React, { useState, useMemo } from "react";
import { useCustomerContext } from "../../context/CustomerContext";
import { useToast } from "../../context/ToastContext";
import { type Customer } from "../../types/customer";
import { StatusBadge } from "../shared/StatusBadge";
import { X, RefreshCw, Check } from "lucide-react";

interface RenewModalContentProps {
  customer: Customer;
  onClose: () => void;
  onRenew: (id: string, months: number) => Promise<any> | void;
}

const RenewModalContent: React.FC<RenewModalContentProps> = ({
  customer,
  onClose,
  onRenew,
}) => {
  const [selectedMonths, setSelectedMonths] = useState<number>(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToast();

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onRenew(customer.id, selectedMonths);
      success("Subscription renewed", `${customer.name} · new expiry ${newExpiryDisplay}`);
      onClose();
    } catch (err: any) {
      error("Could not renew subscription", err?.response?.data?.message || "Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to calculate new expiry date dynamically
  const newExpiryDisplay = useMemo(() => {
    try {
      const now = new Date();
      let baseDate = customer.expiryDate ? new Date(customer.expiryDate) : now;
      // If customer is already expired past today (grace ended), renewal starts from today
      if (baseDate < now) {
        baseDate = now;
      }
      const d = new Date(baseDate.getFullYear(), baseDate.getMonth() + selectedMonths, baseDate.getDate());
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];
      return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    } catch {
      return "";
    }
  }, [customer.expiryDate, selectedMonths]);

  // Format current expiry date
  const currentExpiryDisplay = useMemo(() => {
    try {
      if (!customer.expiryDate) return customer.displayExpires;
      const parts = customer.expiryDate.split("-");
      if (parts.length === 3) {
        const months = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ];
        return `${months[parseInt(parts[1], 10) - 1]} ${parseInt(parts[2], 10)}, ${parts[0]}`;
      }
      return customer.displayExpires;
    } catch {
      return customer.displayExpires;
    }
  }, [customer.expiryDate, customer.displayExpires]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      {/* Figma 1:1413 - 520px width, 20px radius, 28px padding */}
      <div className="relative w-full max-w-[520px] rounded-[20px] bg-white p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
        {/* Header (Figma 1:1414: 44px refresh icon + Title + Subtitle + Close) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            {/* 44x44px Refresh Icon Container */}
            <div className="w-11 h-11 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5] shrink-0">
              <RefreshCw className="w-5 h-5 text-[#4F46E5]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0F172A] tracking-tight leading-tight">
                Renew subscription
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">{customer.name}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#0F172A] hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Expiry Row (Figma 1:1424 - bg #F1F5F9, 12px radius, 64px height) */}
            <div className="h-16 rounded-xl bg-[#F1F5F9] px-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-[#64748B]">Current expiry</div>
                <div className="text-sm font-bold text-[#0F172A] mt-0.5">
                  {currentExpiryDisplay}
                </div>
              </div>
              <StatusBadge status={customer.status} daysRemaining={customer.daysRemaining} />
            </div>

            {/* Renewal duration (Figma 1:1431) */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#0F172A]">
                Renewal duration
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[3, 6, 12].map((months) => {
                  const isSelected = selectedMonths === months;
                  return (
                    <button
                      key={months}
                      type="button"
                      onClick={() => setSelectedMonths(months)}
                      className={`h-12 rounded-xl px-3.5 flex items-center gap-2.5 cursor-pointer transition-all border ${
                        isSelected
                          ? "border-[#4F46E5] bg-[#EEF2FF] ring-1 ring-[#4F46E5]"
                          : "border-[#E2E8F0] bg-white hover:bg-slate-50"
                      }`}
                    >
                      {/* Radio Circle */}
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "border-[#4F46E5] bg-[#4F46E5]"
                            : "border-[#CBD5E1] bg-white"
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="text-sm font-semibold text-[#0F172A]">
                        {months} months
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* New Expiration Date Highlight Card (Figma 1:1443 - bg #EEF2FF, 12px radius) */}
            <div className="rounded-xl bg-[#EEF2FF] p-4 space-y-1">
              <div className="text-xs font-semibold text-[#4F46E5]">
                New expiration date
              </div>
              <div className="text-[22px] font-bold text-[#1E1B4B] tracking-tight">
                {newExpiryDisplay}
              </div>
            </div>

            {/* Footnote (Figma 1:1446) */}
            <p className="text-xs text-[#64748B] leading-relaxed">
              Payment happens outside this app. Confirming only updates the customer record.
            </p>

            {/* Actions (Figma 1:1447) */}
            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="h-[42px] px-5 rounded-[10px] border border-[#E2E8F0] bg-white hover:bg-slate-50 text-sm font-semibold text-[#0F172A] cursor-pointer transition-colors shadow-2xs"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirm}
                className="h-[42px] px-5 rounded-[10px] bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all shadow-sm active:scale-[0.99] disabled:opacity-70"
              >
                <Check className="w-4 h-4" />
                <span>{isSubmitting ? "Renewing..." : "Confirm renewal"}</span>
              </button>
            </div>
      </div>
    </div>
  );
};

export const RenewModal: React.FC = () => {
  const { activeRenewingCustomer, setActiveRenewingCustomer, renewCustomer } =
    useCustomerContext();

  if (!activeRenewingCustomer) return null;

  return (
    <RenewModalContent
      customer={activeRenewingCustomer}
      onClose={() => setActiveRenewingCustomer(null)}
      onRenew={renewCustomer}
    />
  );
};
