import React, { useState } from "react";
import { useToast } from "../../context/ToastContext";
import { Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { changePasswordApi } from "../../api/auth.api";
import axios from "axios";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }
    if (!/\d/.test(newPassword) || !/[a-zA-Z]/.test(newPassword)) {
      setError("New password must contain at least one letter and one number.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await changePasswordApi({
        oldPassword: oldPassword.trim(),
        newPassword: newPassword.trim(),
      });

      setSuccess(true);
      toast.success("Password updated", "Your password has been changed successfully.");
      setTimeout(() => {
        setSuccess(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        onClose();
      }, 1500);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to update password. Please check your current password.");
      }
    } finally {
      setIsSubmitting(false);
    }
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

      {/* Modal Card (Figma: width 480px, radius 20px, p-7, bg-white, space-y-5) */}
      <div className="relative w-full max-w-[480px] rounded-[20px] bg-white p-7 shadow-2xl border border-[#E2E8F0] space-y-5 z-10 animate-in zoom-in-95 duration-150">
        {/* Header Row: 44px Icon Container + Title & Subtitle + Close X */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            {/* 44x44px Icon Container (Figma: bg #EEF2FF, rounded-xl) */}
            <div className="w-11 h-11 rounded-xl bg-[#EEF2FF] flex items-center justify-center shrink-0">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path
                  d="M4.58333 10.0833H17.4167C18.4292 10.0833 19.25 10.9042 19.25 11.9167V18.3333C19.25 19.3459 18.4292 20.1667 17.4167 20.1667H4.58333C3.57081 20.1667 2.75 19.3459 2.75 18.3333V11.9167C2.75 10.9042 3.57081 10.0833 4.58333 10.0833Z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  stroke="#4F46E5"
                />
                <path
                  d="M6.41669 10.0833V6.41668C6.41669 5.2011 6.89957 4.03531 7.75911 3.17577C8.61866 2.31623 9.78444 1.83334 11 1.83334C12.2156 1.83334 13.3814 2.31623 14.2409 3.17577C15.1005 4.03531 15.5834 5.2011 15.5834 6.41668V10.0833"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  stroke="#4F46E5"
                />
              </svg>
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#0F172A] leading-tight">
                Change password
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Use at least 8 characters
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

        {success ? (
          <div className="py-8 text-center flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-3">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-[#0F172A]">Password Updated</h3>
            <p className="text-xs text-[#64748B] mt-1">Your password has been changed successfully.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Field 1: Current password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#334155]">
                Current password
              </label>
              <div className="relative flex items-center h-[50px] px-3.5 rounded-xl border border-[#CBD5E1] bg-white focus-within:border-[#4F46E5] focus-within:ring-2 focus-within:ring-[#EEF2FF] transition-all">
                {/* Lock icon */}
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
                  <path
                    d="M3.75 8.25H14.25C15.0784 8.25 15.75 8.92157 15.75 9.75V15C15.75 15.8284 15.0784 16.5 14.25 16.5H3.75C2.92157 16.5 2.25 15.8284 2.25 15V9.75C2.25 8.92157 2.92157 8.25 3.75 8.25Z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    stroke="#94A3B8"
                  />
                  <path
                    d="M5.25 8.25V5.25C5.25 4.25544 5.64509 3.30161 6.34835 2.59835C7.05161 1.89509 8.00544 1.5 9 1.5C9.99456 1.5 10.9484 1.89509 11.6517 2.59835C12.3549 3.30161 12.75 4.25544 12.75 5.25V8.25"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    stroke="#94A3B8"
                  />
                </svg>
                <input
                  type={showOld ? "text" : "password"}
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent pl-3 pr-2 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Field 2: New password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#334155]">
                New password
              </label>
              <div className="relative flex items-center h-[50px] px-3.5 rounded-xl border border-[#CBD5E1] bg-white focus-within:border-[#4F46E5] focus-within:ring-2 focus-within:ring-[#EEF2FF] transition-all">
                {/* Lock icon */}
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
                  <path
                    d="M3.75 8.25H14.25C15.0784 8.25 15.75 8.92157 15.75 9.75V15C15.75 15.8284 15.0784 16.5 14.25 16.5H3.75C2.92157 16.5 2.25 15.8284 2.25 15V9.75C2.25 8.92157 2.92157 8.25 3.75 8.25Z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    stroke="#94A3B8"
                  />
                  <path
                    d="M5.25 8.25V5.25C5.25 4.25544 5.64509 3.30161 6.34835 2.59835C7.05161 1.89509 8.00544 1.5 9 1.5C9.99456 1.5 10.9484 1.89509 11.6517 2.59835C12.3549 3.30161 12.75 4.25544 12.75 5.25V8.25"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    stroke="#94A3B8"
                  />
                </svg>
                <input
                  type={showNew ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent pl-3 pr-2 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Field 3: Confirm new password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#334155]">
                Confirm new password
              </label>
              <div className="relative flex items-center h-[50px] px-3.5 rounded-xl border border-[#CBD5E1] bg-white focus-within:border-[#4F46E5] focus-within:ring-2 focus-within:ring-[#EEF2FF] transition-all">
                {/* Lock icon */}
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
                  <path
                    d="M3.75 8.25H14.25C15.0784 8.25 15.75 8.92157 15.75 9.75V15C15.75 15.8284 15.0784 16.5 14.25 16.5H3.75C2.92157 16.5 2.25 15.8284 2.25 15V9.75C2.25 8.92157 2.92157 8.25 3.75 8.25Z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    stroke="#94A3B8"
                  />
                  <path
                    d="M5.25 8.25V5.25C5.25 4.25544 5.64509 3.30161 6.34835 2.59835C7.05161 1.89509 8.00544 1.5 9 1.5C9.99456 1.5 10.9484 1.89509 11.6517 2.59835C12.3549 3.30161 12.75 4.25544 12.75 5.25V8.25"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    stroke="#94A3B8"
                  />
                </svg>
                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent pl-3 pr-2 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Actions: Cancel & Update password right-aligned */}
            <div className="flex items-center justify-end gap-3 pt-2">
              {/* Cancel Button */}
              <button
                type="button"
                onClick={onClose}
                className="h-[42px] px-5 rounded-[10px] border border-[#E2E8F0] bg-white hover:bg-slate-50 text-sm font-semibold text-[#334155] transition-colors cursor-pointer shadow-2xs"
              >
                Cancel
              </button>

              {/* Update Password Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-[42px] px-5 rounded-[10px] bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-semibold transition-colors cursor-pointer shadow-sm active:scale-[0.99] disabled:opacity-70"
              >
                {isSubmitting ? "Updating..." : "Update password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
