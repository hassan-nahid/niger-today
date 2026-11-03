import React from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  subtext: string;
  variant?: "default" | "active" | "expiring" | "expired";
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  variant = "default",
  onClick,
}) => {
  const badgeStyles = {
    default: "text-foreground",
    active: "text-emerald-700",
    expiring: "text-amber-700",
    expired: "text-rose-700",
  };

  const bgBorder = {
    default: "border-border hover:border-slate-300",
    active: "border-emerald-200/80 hover:border-emerald-300",
    expiring: "border-amber-200/80 hover:border-amber-300",
    expired: "border-rose-200/80 hover:border-rose-300",
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-xl border bg-card p-5 shadow-xs transition-all ${bgBorder[variant]} ${
        onClick ? "cursor-pointer active:scale-[0.99]" : ""
      }`}
    >
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      <div className={`mt-2 text-3xl font-bold tracking-tight ${badgeStyles[variant]}`}>
        {value}
      </div>
      <div className="mt-1.5 text-xs text-muted-foreground">{subtext}</div>
    </div>
  );
};

