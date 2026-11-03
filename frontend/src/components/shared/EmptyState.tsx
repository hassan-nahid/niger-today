import React from "react";

interface EmptyStateProps {
  type: "no-customers" | "nothing-expiring" | "nothing-expired";
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type, onAction }) => {
  const content = {
    "no-customers": {
      iconBg: "bg-[#EEF2FF]",
      icon: (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path
            d="M18.75 12C18.75 14.8995 16.3995 17.25 13.5 17.25C10.6005 17.25 8.25 14.8995 8.25 12C8.25 9.10051 10.6005 6.75 13.5 6.75C16.3995 6.75 18.75 9.10051 18.75 12Z"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke="#4F46E5"
          />
          <path
            d="M3.75 30C3.75 24.6 8.1 21 13.5 21C18.9 21 23.25 24.6 23.25 30"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke="#4F46E5"
          />
          <path
            d="M24 6.90002C25.1421 7.17904 26.1574 7.83332 26.8834 8.75803C27.6094 9.68274 28.004 10.8244 28.004 12C28.004 13.1757 27.6094 14.3173 26.8834 15.242C26.1574 16.1667 25.1421 16.821 24 17.1"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke="#4F46E5"
          />
          <path
            d="M27 21.45C30.3 22.5 32.25 25.35 32.25 30"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke="#4F46E5"
          />
        </svg>
      ),
      title: "No customers yet",
      description: "Add your first customer to start tracking subscriptions and expiry dates.",
      actionLabel: "Add Customer",
    },
    "nothing-expiring": {
      iconBg: "bg-[#DCFCE7]",
      icon: (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path
            d="M31.5 18C31.5 25.4558 25.4558 31.5 18 31.5C10.5442 31.5 4.5 25.4558 4.5 18C4.5 10.5442 10.5442 4.5 18 4.5C25.4558 4.5 31.5 10.5442 31.5 18Z"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke="#16A34A"
          />
          <path
            d="M12 18L16.5 22.5L24 13.5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke="#16A34A"
          />
        </svg>
      ),
      title: "You are all caught up",
      description: "No subscriptions expire in the next 10 days. Check back soon.",
      actionLabel: undefined,
    },
    "nothing-expired": {
      iconBg: "bg-[#DCFCE7]",
      icon: (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path
            d="M31.5 18C31.5 25.4558 25.4558 31.5 18 31.5C10.5442 31.5 4.5 25.4558 4.5 18C4.5 10.5442 10.5442 4.5 18 4.5C25.4558 4.5 31.5 10.5442 31.5 18Z"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke="#16A34A"
          />
          <path
            d="M12 18L16.5 22.5L24 13.5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke="#16A34A"
          />
        </svg>
      ),
      title: "No expired subscriptions",
      description: "Every customer subscription is still active.",
      actionLabel: undefined,
    },
  }[type];

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white p-12 min-h-[500px] lg:min-h-[620px] text-center shadow-2xs">
      {/* 80x80px Circle Icon Container */}
      <div
        className={`flex h-20 w-20 items-center justify-center rounded-full ${content.iconBg} mb-5 shadow-2xs`}
      >
        {content.icon}
      </div>

      {/* Title (Figma: Inter Bold 20px / 22px #0F172A) */}
      <h3 className="text-xl font-bold text-[#0F172A] tracking-tight">
        {content.title}
      </h3>

      {/* Description (Figma: Inter Regular 14px #64748B max-w-[380px]) */}
      <p className="mt-2 max-w-[380px] text-sm text-[#64748B] leading-relaxed">
        {content.description}
      </p>

      {/* Action Button (Figma Button/primary for No Customers) */}
      {content.actionLabel && onAction && (
        <div className="mt-6">
          <button
            type="button"
            onClick={onAction}
            className="h-[42px] px-5 rounded-[10px] bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all shadow-sm active:scale-[0.99]"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M9 3.75V14.25M3.75 9H14.25"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{content.actionLabel}</span>
          </button>
        </div>
      )}
    </div>
  );
};
