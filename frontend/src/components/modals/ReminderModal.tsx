import React, { useState } from "react";
import { useCustomerContext } from "../../context/CustomerContext";
import { type Customer } from "../../types/customer";

interface ReminderModalContentProps {
  customer: Customer;
  onClose: () => void;
}

const ReminderModalContent: React.FC<ReminderModalContentProps> = ({ customer, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [template, setTemplate] = useState<"7days" | "3days" | "1day" | "expired">("3days");

  const getTemplateText = (type: string) => {
    switch (type) {
      case "7days":
        return `Hi ${customer.name}, your TV subscription expires on ${customer.displayExpires} (7 days left). Please renew to keep your service running. Thank you!`;
      case "3days":
        return `Hi ${customer.name}, your TV subscription expires on ${customer.displayExpires} (3 days left). Please renew to keep your service running. Thank you!`;
      case "1day":
        return `Hi ${customer.name}, your TV subscription expires tomorrow on ${customer.displayExpires} (1 day left). Please renew to keep your service running. Thank you!`;
      case "expired":
        return `Hi ${customer.name}, your TV subscription expired on ${customer.displayExpires}. Please renew to reactivate your service. Thank you!`;
      default:
        return "";
    }
  };

  const [message, setMessage] = useState(() => getTemplateText("3days"));

  const handleTemplateChange = (t: "7days" | "3days" | "1day" | "expired") => {
    setTemplate(t);
    setMessage(getTemplateText(t));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop (Figma exact rgba(15, 23, 42, 0.5)) */}
      <div
        className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Card (Figma: width 520px, radius 20px, p-7, bg-white, space-y-5) */}
      <div className="relative w-full max-w-[520px] rounded-[20px] bg-white p-7 shadow-2xl border border-[#E2E8F0] space-y-5 z-10 animate-in zoom-in-95 duration-150">
        {/* Header Row: 44px Icon Container + Title/Customer Info + Close X */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* 44px Icon Container (Figma: bg #EEF2FF, rounded-xl) */}
            <div className="w-11 h-11 rounded-xl bg-[#EEF2FF] flex items-center justify-center shrink-0">
              <svg width="22" height="22" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M14 7.99997C13.995 8.90798 13.7582 9.79968 13.3122 10.5906C12.8661 11.3815 12.2255 12.0454 11.451 12.5194C10.6765 12.9935 9.79384 13.2619 8.88659 13.2993C7.97934 13.3368 7.07755 13.1419 6.26667 12.7333L2 14L3.26667 9.86664C3.1441 9.16188 3.16155 8.43988 3.31801 7.74186C3.47447 7.04384 3.76689 6.38347 4.17856 5.79847C4.59023 5.21346 5.1131 4.71526 5.71731 4.33232C6.32152 3.94939 6.99524 3.68921 7.7 3.56664C8.40476 3.44407 9.12676 3.46152 9.82478 3.61798C10.5228 3.77444 11.1832 4.06686 11.7682 4.47853C12.3532 4.89021 12.8514 5.41307 13.2343 6.01728C13.6173 6.62149 13.8774 7.29521 14 7.99997Z"
                  stroke="#4F46E5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#0F172A] leading-snug">
                Send reminder
              </h2>
              <p className="text-[13px] text-[#64748B] mt-0.5">
                {customer.name} · {customer.phone}
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            type="button"
            className="p-1 rounded-lg text-[#94A3B8] hover:text-[#0F172A] hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M15 5L5 15M5 5L15 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Quick template section (Figma: 4 pill tabs) */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-[#334155]">
            Quick template
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(
              [
                { id: "7days", label: "7 days left" },
                { id: "3days", label: "3 days left" },
                { id: "1day", label: "1 day left" },
                { id: "expired", label: "Expired" },
              ] as const
            ).map((item) => {
              const isSelected = template === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTemplateChange(item.id)}
                  className={`py-2 px-2.5 rounded-[10px] text-xs font-semibold transition-all cursor-pointer text-center ${isSelected
                      ? "bg-[#4F46E5] text-white shadow-2xs"
                      : "bg-white border border-[#E2E8F0] text-[#334155] hover:bg-slate-50"
                    }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Message Input Area (Figma: Message label + Message box) */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#334155]">
            Message
          </label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full h-[94px] rounded-xl border border-[#CBD5E1] bg-white p-3.5 text-sm text-[#0F172A] focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#EEF2FF] leading-relaxed resize-none transition-all placeholder:text-[#94A3B8]"
          />
        </div>

        {/* Actions (Figma exact: Cancel & Copy message right-aligned) */}
        <div className="flex items-center justify-end gap-3 pt-1">
          {/* Cancel Button (Button/secondary) */}
          <button
            type="button"
            onClick={onClose}
            className="h-[42px] px-5 rounded-[10px] border border-[#E2E8F0] bg-white hover:bg-slate-50 text-sm font-semibold text-[#334155] transition-colors cursor-pointer shadow-2xs"
          >
            Cancel
          </button>

          {/* Copy Message Button (Button/primary) */}
          <button
            type="button"
            onClick={handleCopy}
            className="h-[42px] px-5 rounded-[10px] bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-sm active:scale-[0.99]"
          >
            {/* Figma exact icon/copy SVG */}
            {copied ? (
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 10L8.5 13.5L15 7" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M13.25 5.25H7.25C6.42157 5.25 5.75 5.92157 5.75 6.75V12.75C5.75 13.5784 6.42157 14.25 7.25 14.25H13.25C14.0784 14.25 14.75 13.5784 14.75 12.75V6.75C14.75 5.92157 14.0784 5.25 13.25 5.25Z"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.25 12.25V3.75C3.25 3.48478 3.35536 3.23043 3.54289 3.04289C3.73043 2.85536 3.98478 2.75 4.25 2.75H12.75"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            <span>{copied ? "Copied!" : "Copy message"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const ReminderModal: React.FC = () => {
  const { activeRemindingCustomer, setActiveRemindingCustomer } = useCustomerContext();

  if (!activeRemindingCustomer) return null;

  return (
    <ReminderModalContent
      customer={activeRemindingCustomer}
      onClose={() => setActiveRemindingCustomer(null)}
    />
  );
};
