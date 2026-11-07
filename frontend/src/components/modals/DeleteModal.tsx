import React, { useState } from "react";
import { useCustomerContext } from "../../context/CustomerContext";
import { useToast } from "../../context/ToastContext";
import { type Customer } from "../../types/customer";

interface DeleteModalContentProps {
  customer: Customer;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteModalContent: React.FC<DeleteModalContentProps> = ({
  customer,
  isDeleting = false,
  onClose,
  onConfirm,
}) => {
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

      {/* Modal Card (Figma: width 440px, radius 20px, p-7, bg-white, space-y-5) */}
      <div className="relative w-full max-w-[440px] rounded-[20px] bg-white p-7 shadow-2xl border border-[#E2E8F0] space-y-5 z-10 animate-in zoom-in-95 duration-150">
        {/* Header Row: 44px Red Icon Box + Title + Close X */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            {/* 44x44px Icon Container (Figma: bg #FEE2E2, rounded-xl) */}
            <div className="w-11 h-11 rounded-xl bg-[#FEE2E2] flex items-center justify-center shrink-0">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path
                  d="M2.75 5.50002H4.58333M4.58333 5.50002H7.33333M4.58333 5.50002L5.5 18.3334H16.5L17.4167 5.50002M7.33333 5.50002H14.6667M7.33333 5.50002V3.66669H14.6667V5.50002M14.6667 5.50002H17.4167M17.4167 5.50002H19.25"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  stroke="#DC2626"
                />
              </svg>
            </div>

            <h2 className="text-lg font-bold text-[#0F172A] leading-snug">
              Delete {customer.name}?
            </h2>
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

        {/* Description Text (Figma: 14px Regular #64748B) */}
        <p className="text-sm text-[#64748B] leading-relaxed">
          This permanently removes the customer and their subscription records. This cannot be undone.
        </p>

        {/* Action Buttons (Figma exact: Cancel & Delete customer right-aligned) */}
        <div className="flex items-center justify-end gap-3 pt-1">
          {/* Cancel Button (Button/secondary) */}
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="h-[42px] px-5 rounded-[10px] border border-[#E2E8F0] bg-white hover:bg-slate-50 text-sm font-semibold text-[#334155] transition-colors cursor-pointer shadow-2xs disabled:opacity-70"
          >
            Cancel
          </button>

          {/* Delete Button (Button/danger) */}
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="h-[42px] px-[18px] rounded-[10px] bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-sm active:scale-[0.99] disabled:opacity-70"
          >
            {/* White trash icon */}
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M2.25 4.5H3.75M3.75 4.5H6M3.75 4.5L4.5 15H13.5L14.25 4.5M6 4.5H12M6 4.5V3H12V4.5M12 4.5H14.25M14.25 4.5H15.75"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                stroke="white"
              />
            </svg>
            <span>{isDeleting ? "Deleting..." : "Delete customer"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const DeleteModal: React.FC = () => {
  const { activeDeletingCustomer, setActiveDeletingCustomer, deleteCustomer } =
    useCustomerContext();
  const { success, error } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!activeDeletingCustomer) return null;

  return (
    <DeleteModalContent
      customer={activeDeletingCustomer}
      isDeleting={isDeleting}
      onClose={() => setActiveDeletingCustomer(null)}
      onConfirm={async () => {
        const name = activeDeletingCustomer.name;
        setIsDeleting(true);
        try {
          await deleteCustomer(activeDeletingCustomer.id);
          setActiveDeletingCustomer(null);
          success("Customer deleted", `${name} has been removed.`);
        } catch (err: any) {
          error("Could not delete customer", err?.response?.data?.message || "Please try again.");
        } finally {
          setIsDeleting(false);
        }
      }}
    />
  );
};
