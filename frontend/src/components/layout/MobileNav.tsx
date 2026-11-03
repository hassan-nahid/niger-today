import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import { useCustomerContext } from "../../context/CustomerContext";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../context/ToastContext";
import { X, ChevronRight } from "lucide-react";

// Exact Figma SVGs for Mobile Bottom Navigation (1:2685)
const NavIconDashboard = ({ className = "w-[22px] h-[22px]" }: { className?: string }) => (
  <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3.75 2.5H7.08333C7.77369 2.5 8.33333 3.05964 8.33333 3.75V7.08333C8.33333 7.77369 7.77369 8.33333 7.08333 8.33333H3.75C3.05964 8.33333 2.5 7.77369 2.5 7.08333V3.75C2.5 3.05964 3.05964 2.5 3.75 2.5Z" />
    <path d="M12.9165 2.5H16.2498C16.9402 2.5 17.4998 3.05964 17.4998 3.75V7.08333C17.4998 7.77369 16.9402 8.33333 16.2498 8.33333H12.9165C12.2261 8.33333 11.6665 7.77369 11.6665 7.08333V3.75C11.6665 3.05964 12.2261 2.5 12.9165 2.5Z" />
    <path d="M3.75 11.6666H7.08333C7.77369 11.6666 8.33333 12.2263 8.33333 12.9166V16.25C8.33333 16.9403 7.77369 17.5 7.08333 17.5H3.75C3.05964 17.5 2.5 16.9403 2.5 16.25V12.9166C2.5 12.2263 3.05964 11.6666 3.75 11.6666Z" />
    <path d="M12.9165 11.6666H16.2498C16.9402 11.6666 17.4998 12.2263 17.4998 12.9166V16.25C17.4998 16.9403 16.9402 17.5 16.2498 17.5H12.9165C12.2261 17.5 11.6665 16.9403 11.6665 16.25V12.9166C11.6665 12.2263 12.2261 11.6666 12.9165 11.6666Z" />
  </svg>
);

const NavIconCustomers = ({ className = "w-[22px] h-[22px]" }: { className?: string }) => (
  <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10.4168 6.66667C10.4168 8.2775 9.11099 9.58333 7.50016 9.58333C5.88933 9.58333 4.5835 8.2775 4.5835 6.66667C4.5835 5.05584 5.88933 3.75 7.50016 3.75C9.11099 3.75 10.4168 5.05584 10.4168 6.66667Z" />
    <path d="M2.0835 16.6666C2.0835 13.6666 4.50016 11.6666 7.50016 11.6666C10.5002 11.6666 12.9168 13.6666 12.9168 16.6666" />
    <path d="M13.3335 3.83337C13.968 3.98839 14.5321 4.35187 14.9354 4.8656C15.3387 5.37933 15.5579 6.01357 15.5579 6.66671C15.5579 7.31985 15.3387 7.95409 14.9354 8.46781C14.5321 8.98154 13.968 9.34503 13.3335 9.50004" />
    <path d="M15 11.9166C16.8333 12.5 17.9167 14.0833 17.9167 16.6666" />
  </svg>
);

const NavIconExpiring = ({ className = "w-[22px] h-[22px]" }: { className?: string }) => (
  <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z" />
    <path d="M10 5.83337V10L12.5 11.6667" />
  </svg>
);

const NavIconMore = ({ className = "w-[22px] h-[22px]" }: { className?: string }) => (
  <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3.33334 5H16.6667M3.33334 10H16.6667M3.33334 15H16.6667" />
  </svg>
);

// Menu Icons matching Figma design
const IconExpired = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9.99984 2.5L1.6665 16.6667H18.3332L9.99984 2.5Z" />
    <path d="M10 8.33337V11.6667" />
    <path d="M10 14.1666H10.0083" />
  </svg>
);

const IconSettings = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12.5 10C12.5 11.3807 11.3807 12.5 10 12.5C8.61929 12.5 7.5 11.3807 7.5 10C7.5 8.61929 8.61929 7.5 10 7.5C11.3807 7.5 12.5 8.61929 12.5 10Z" />
    <path d="M9.99984 1.66663V4.16663M9.99984 15.8333V18.3333M1.6665 9.99996H4.1665M15.8332 9.99996H18.3332M4.08317 4.08329L5.83317 5.83329M14.1665 14.1666L15.9165 15.9166M4.08317 15.9166L5.83317 14.1666M14.1665 5.83329L15.9165 4.08329" />
  </svg>
);

const IconLogout = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6.75 15.75H3.75C3.35218 15.75 2.97064 15.592 2.68934 15.3107C2.40804 15.0294 2.25 14.6478 2.25 14.25V3.75C2.25 3.35218 2.40804 2.97064 2.68934 2.68934C2.97064 2.40804 3.35218 2.25 3.75 2.25H6.75" />
    <path d="M12 12.75L15.75 9L12 5.25" />
    <path d="M15.75 9H6.75" />
  </svg>
);

export const MobileNav: React.FC = () => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const { stats } = useCustomerContext();
  const { user, logout } = useAuth();
  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const isMoreActive =
    location.pathname === "/settings" || location.pathname === "/expired";

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMoreOpen(false);
  };

  const handleLogout = async () => {
    setIsMoreOpen(false);
    await logout();
    toast.success("Logged out", "You have been safely signed out.");
    navigate("/login");
  };

  return (
    <>
      {/* ======================================================== */}
      {/* MORE MENU BOTTOM SHEET / DRAWER (Mobile)                */}
      {/* ======================================================== */}
      {isMoreOpen && (
        <>
          {/* Backdrop Overlay */}
          <div
            onClick={() => setIsMoreOpen(false)}
            className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in"
          />

          {/* Action Sheet Card */}
          <div className="lg:hidden fixed bottom-[84px] left-4 right-4 z-50 max-w-[400px] mx-auto bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl p-4 space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
            {/* User Profile Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-full bg-[#E0E7FF] text-[#4338CA] font-bold text-sm flex items-center justify-center shrink-0">
                  {user?.fullName || user?.firstName
                    ? (user.fullName || user.firstName || "")
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    : "AO"}
                </div>
                <div className="overflow-hidden min-w-0">
                  <div className="text-sm font-semibold text-[#0F172A] truncate">
                    {user?.fullName || user?.firstName || "Alex Owner"}
                  </div>
                  <div className="text-xs text-[#64748B] truncate">
                    Business owner · {user?.email || "owner@email.com"}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMoreOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#64748B] flex items-center justify-center cursor-pointer transition-colors shrink-0"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="space-y-1">
              {/* Expired Page Option */}
              <button
                type="button"
                onClick={() => handleNavigate("/expired")}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors cursor-pointer ${
                  location.pathname === "/expired"
                    ? "bg-[#EEF2FF] text-[#4F46E5]"
                    : "hover:bg-slate-50 text-[#0F172A]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    location.pathname === "/expired"
                      ? "bg-[#4F46E5] text-white"
                      : "bg-[#FEE2E2] text-[#DC2626]"
                  }`}>
                    <IconExpired className="w-[18px] h-[18px]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium leading-tight">
                      Expired Subscriptions
                    </div>
                    <div className="text-xs text-[#64748B] mt-0.5 font-normal">
                      View and renew expired customers
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {stats.expired > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#FEE2E2] text-[#B91C1C]">
                      {stats.expired}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
                </div>
              </button>

              {/* Settings Page Option */}
              <button
                type="button"
                onClick={() => handleNavigate("/settings")}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors cursor-pointer ${
                  location.pathname === "/settings"
                    ? "bg-[#EEF2FF] text-[#4F46E5]"
                    : "hover:bg-slate-50 text-[#0F172A]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    location.pathname === "/settings"
                      ? "bg-[#4F46E5] text-white"
                      : "bg-slate-100 text-[#64748B]"
                  }`}>
                    <IconSettings className="w-[18px] h-[18px]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium leading-tight">
                      Settings
                    </div>
                    <div className="text-xs text-[#64748B] mt-0.5 font-normal">
                      Account & notification preferences
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-[#94A3B8] shrink-0" />
              </button>

              {/* Divider */}
              <div className="pt-1 pb-1 border-t border-[#F1F5F9]" />

              {/* Log Out Option */}
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-rose-50 text-[#DC2626] transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center shrink-0">
                  <IconLogout className="w-[18px] h-[18px]" />
                </div>
                <div className="text-sm font-medium leading-tight">
                  Log out
                </div>
              </button>
            </div>
          </div>
        </>
      )}

      {/* ======================================================== */}
      {/* MOBILE BOTTOM NAVIGATION BAR (Figma 1:2685 - Exact 77px)  */}
      {/* ======================================================== */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E2E8F0] h-[77px] px-2 pt-2 pb-6 shadow-sm">
        <div className="grid grid-cols-4 h-full items-center">
          {/* 1. Dashboard */}
          <NavLink
            to="/dashboard"
            onClick={() => setIsMoreOpen(false)}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 py-1 transition-colors ${
                isActive && !isMoreOpen
                  ? "text-[#4F46E5] font-semibold"
                  : "text-[#64748B] hover:text-[#0F172A] font-medium"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <NavIconDashboard
                  className={`w-[22px] h-[22px] ${
                    isActive && !isMoreOpen ? "text-[#4F46E5]" : "text-[#94A3B8]"
                  }`}
                />
                <span className="text-[11px] leading-tight tracking-tight">
                  Dashboard
                </span>
              </>
            )}
          </NavLink>

          {/* 2. Customers */}
          <NavLink
            to="/customers"
            onClick={() => setIsMoreOpen(false)}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 py-1 transition-colors ${
                isActive && !isMoreOpen
                  ? "text-[#4F46E5] font-semibold"
                  : "text-[#64748B] hover:text-[#0F172A] font-medium"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <NavIconCustomers
                  className={`w-[22px] h-[22px] ${
                    isActive && !isMoreOpen ? "text-[#4F46E5]" : "text-[#94A3B8]"
                  }`}
                />
                <span className="text-[11px] leading-tight tracking-tight">
                  Customers
                </span>
              </>
            )}
          </NavLink>

          {/* 3. Expiring */}
          <NavLink
            to="/expiring"
            onClick={() => setIsMoreOpen(false)}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 py-1 transition-colors ${
                isActive && !isMoreOpen
                  ? "text-[#4F46E5] font-semibold"
                  : "text-[#64748B] hover:text-[#0F172A] font-medium"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <NavIconExpiring
                  className={`w-[22px] h-[22px] ${
                    isActive && !isMoreOpen ? "text-[#4F46E5]" : "text-[#94A3B8]"
                  }`}
                />
                <span className="text-[11px] leading-tight tracking-tight">
                  Expiring
                </span>
              </>
            )}
          </NavLink>

          {/* 4. More (Toggles Drawer for Expired, Settings & Logout) */}
          <button
            type="button"
            onClick={() => setIsMoreOpen((prev) => !prev)}
            className={`flex flex-col items-center justify-center gap-1 py-1 transition-colors cursor-pointer ${
              isMoreOpen || isMoreActive
                ? "text-[#4F46E5] font-semibold"
                : "text-[#64748B] hover:text-[#0F172A] font-medium"
            }`}
          >
            <NavIconMore
              className={`w-[22px] h-[22px] ${
                isMoreOpen || isMoreActive ? "text-[#4F46E5]" : "text-[#94A3B8]"
              }`}
            />
            <span className="text-[11px] leading-tight tracking-tight">
              More
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
