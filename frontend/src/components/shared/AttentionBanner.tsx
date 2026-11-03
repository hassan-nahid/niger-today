import React from "react";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

interface AttentionBannerProps {
  expiringCount: number;
  expiredCount: number;
}

export const AttentionBanner: React.FC<AttentionBannerProps> = ({
  expiringCount,
  expiredCount,
}) => {
  const navigate = useNavigate();
  const totalNeedAttention = expiringCount + expiredCount;

  if (totalNeedAttention === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50/90 px-4 py-3 text-amber-900 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-200/70 text-amber-800">
          <AlertTriangle className="h-4 w-4" />
        </div>
        <p className="text-sm font-medium">
          <span className="font-semibold">{totalNeedAttention} customers</span> need your attention —{" "}
          {expiringCount > 0 && <span>{expiringCount} expire within 10 days</span>}
          {expiringCount > 0 && expiredCount > 0 && " and "}
          {expiredCount > 0 && <span>{expiredCount} have already expired</span>}.
        </p>
      </div>

      <button
        onClick={() => navigate("/expiring")}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 shadow-2xs hover:bg-amber-100/50 transition-colors cursor-pointer"
      >
        Review now
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

