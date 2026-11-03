import React from "react";
import type { SubscriptionStatus } from "../../types/customer";

interface StatusBadgeProps {
  status: SubscriptionStatus;
  daysRemaining?: number;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, daysRemaining, className = "" }) => {
  if (status === "active") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#15803D] ${className}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />
        Active
      </span>
    );
  }

  if (status === "expiring") {
    const text = daysRemaining !== undefined ? `${daysRemaining} days left` : "Expiring soon";
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#B45309] ${className}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#D97706]" />
        {text}
      </span>
    );
  }

  // Expired (Figma: "2 days ago", "5 days ago", or "Expired")
  const text =
    daysRemaining !== undefined && daysRemaining !== 0
      ? `${Math.abs(daysRemaining)} days ago`
      : "Expired";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FEE2E2] text-[#B91C1C] ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[#DC2626]" />
      {text}
    </span>
  );
};
