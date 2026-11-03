import React from "react";
import { NavLink, useNavigate } from "react-router";
import { useCustomerContext } from "../../context/CustomerContext";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../context/ToastContext";
import logoSvg from "../../assets/niger-today-logo.svg";

// Exact Figma SVGs rendered inline with stroke="currentColor" so active is crisp white and inactive matches slate color
const IconDashboard: React.FC<{ className?: string }> = ({ className = "w-5 h-5 shrink-0" }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3.75 2.5H7.08333C7.77369 2.5 8.33333 3.05964 8.33333 3.75V7.08333C8.33333 7.77369 7.77369 8.33333 7.08333 8.33333H3.75C3.05964 8.33333 2.5 7.77369 2.5 7.08333V3.75C2.5 3.05964 3.05964 2.5 3.75 2.5Z" />
    <path d="M12.9165 2.5H16.2498C16.9402 2.5 17.4998 3.05964 17.4998 3.75V7.08333C17.4998 7.77369 16.9402 8.33333 16.2498 8.33333H12.9165C12.2261 8.33333 11.6665 7.77369 11.6665 7.08333V3.75C11.6665 3.05964 12.2261 2.5 12.9165 2.5Z" />
    <path d="M3.75 11.6666H7.08333C7.77369 11.6666 8.33333 12.2263 8.33333 12.9166V16.25C8.33333 16.9403 7.77369 17.5 7.08333 17.5H3.75C3.05964 17.5 2.5 16.9403 2.5 16.25V12.9166C2.5 12.2263 3.05964 11.6666 3.75 11.6666Z" />
    <path d="M12.9165 11.6666H16.2498C16.9402 11.6666 17.4998 12.2263 17.4998 12.9166V16.25C17.4998 16.9403 16.9402 17.5 16.2498 17.5H12.9165C12.2261 17.5 11.6665 16.9403 11.6665 16.25V12.9166C11.6665 12.2263 12.2261 11.6666 12.9165 11.6666Z" />
  </svg>
);

const IconCustomers: React.FC<{ className?: string }> = ({ className = "w-5 h-5 shrink-0" }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10.4168 6.66667C10.4168 8.2775 9.11099 9.58333 7.50016 9.58333C5.88933 9.58333 4.5835 8.2775 4.5835 6.66667C4.5835 5.05584 5.88933 3.75 7.50016 3.75C9.11099 3.75 10.4168 5.05584 10.4168 6.66667Z" />
    <path d="M2.0835 16.6666C2.0835 13.6666 4.50016 11.6666 7.50016 11.6666C10.5002 11.6666 12.9168 13.6666 12.9168 16.6666" />
    <path d="M13.3335 3.83337C13.968 3.98839 14.5321 4.35187 14.9354 4.8656C15.3387 5.37933 15.5579 6.01357 15.5579 6.66671C15.5579 7.31985 15.3387 7.95409 14.9354 8.46781C14.5321 8.98154 13.968 9.34503 13.3335 9.50004" />
    <path d="M15 11.9166C16.8333 12.5 17.9167 14.0833 17.9167 16.6666" />
  </svg>
);

const IconExpiring: React.FC<{ className?: string }> = ({ className = "w-5 h-5 shrink-0" }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z" />
    <path d="M10 5.83337V10L12.5 11.6667" />
  </svg>
);

const IconExpired: React.FC<{ className?: string }> = ({ className = "w-5 h-5 shrink-0" }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9.99984 2.5L1.6665 16.6667H18.3332L9.99984 2.5Z" />
    <path d="M10 8.33337V11.6667" />
    <path d="M10 14.1666H10.0083" />
  </svg>
);

const IconSettings: React.FC<{ className?: string }> = ({ className = "w-5 h-5 shrink-0" }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12.5 10C12.5 11.3807 11.3807 12.5 10 12.5C8.61929 12.5 7.5 11.3807 7.5 10C7.5 8.61929 8.61929 7.5 10 7.5C11.3807 7.5 12.5 8.61929 12.5 10Z" />
    <path d="M9.99984 1.66663V4.16663M9.99984 15.8333V18.3333M1.6665 9.99996H4.1665M15.8332 9.99996H18.3332M4.08317 4.08329L5.83317 5.83329M14.1665 14.1666L15.9165 15.9166M4.08317 15.9166L5.83317 14.1666M14.1665 5.83329L15.9165 4.08329" />
  </svg>
);

const IconLogout: React.FC<{ className?: string }> = ({ className = "w-4 h-4 shrink-0" }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6.75 15.75H3.75C3.35218 15.75 2.97064 15.592 2.68934 15.3107C2.40804 15.0294 2.25 14.6478 2.25 14.25V3.75C2.25 3.35218 2.40804 2.97064 2.68934 2.68934C2.97064 2.40804 3.35218 2.25 3.75 2.25H6.75" />
    <path d="M12 5.25L15.75 9L12 12.75M15.75 9H6.75" />
  </svg>
);

export const Sidebar: React.FC = () => {
  const { stats } = useCustomerContext();
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out", "You have been safely signed out.");
    navigate("/login");
  };

  const navItems = [
    {
      to: "/dashboard",
      label: "Dashboard",
      Icon: IconDashboard,
    },
    {
      to: "/customers",
      label: "Customers",
      Icon: IconCustomers,
    },
    {
      to: "/expiring",
      label: "Expiring",
      Icon: IconExpiring,
      badge: stats.expiring > 0 ? stats.expiring : undefined,
      badgeColor: "bg-[#D97706] text-white",
    },
    {
      to: "/expired",
      label: "Expired",
      Icon: IconExpired,
      badge: stats.expired > 0 ? stats.expired : undefined,
      badgeColor: "bg-[#DC2626] text-white",
    },
    {
      to: "/settings",
      label: "Settings",
      Icon: IconSettings,
    },
  ];

  return (
    <aside className="hidden lg:flex w-[260px] flex-col justify-between border-r border-[#E0E7FF] bg-[#EEF2FF] px-4 pt-7 pb-6 shrink-0 h-screen sticky top-0">
      <div className="space-y-4">
        {/* Figma Exact 96x96px Logo */}
        <div className="px-2">
          <img
            src={logoSvg}
            alt="Niger today TV"
            className="w-24 h-24 object-contain drop-shadow-sm -ml-1"
          />
        </div>

        {/* Navigation Items (Figma 44px height, gap 4px) */}
        <nav className="space-y-1 pt-1">
          {navItems.map((item) => {
            const Icon = item.Icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 h-[44px] rounded-xl text-sm transition-all ${
                    isActive
                      ? "bg-[#4F46E5] text-white font-semibold shadow-sm"
                      : "text-[#64748B] hover:bg-white/60 hover:text-[#0F172A] font-medium"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "text-[#94A3B8]"}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-bold ${item.badgeColor}`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Owner Profile Card at Bottom (Figma 40px height) */}
      <div className="pt-4 border-t border-[#E0E7FF]">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E0E7FF] text-[#4338CA] font-bold text-xs">
              {user?.fullName || user?.firstName
                ? (user.fullName || user.firstName || "")
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                : "AO"}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-[#1E1B4B] truncate">
                {user?.fullName || user?.firstName || "Alex Owner"}
              </div>
              <div className="text-[11px] text-[#64748B] truncate">Business owner</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            type="button"
            title="Log out"
            className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <IconLogout className="w-4 h-4 opacity-70 text-slate-500" />
          </button>
        </div>
      </div>
    </aside>
  );
};
