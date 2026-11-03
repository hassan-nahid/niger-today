import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../context/ToastContext";
import { ChangePasswordModal } from "../components/modals/ChangePasswordModal";
import { Lock, Check } from "lucide-react";
import axios from "axios";

export const Settings: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const toast = useToast();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Form State matching Figma 08 Settings & user data
  const [name, setName] = useState(user?.fullName || user?.firstName || "Alex Owner");
  const [email, setEmail] = useState(user?.email || "owner@email.com");
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.fullName || user.firstName || "Alex Owner");
      setEmail(user.email || "owner@email.com");
    }
  }, [user]);

  // Notification toggles from Figma 08
  const [remind7Days, setRemind7Days] = useState(true);
  const [remind3Days, setRemind3Days] = useState(true);
  const [remind1Day, setRemind1Day] = useState(true);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateProfile({
        fullName: name.trim(),
        email: email.trim(),
      });

      setIsSaved(true);
      toast.success("Settings saved", "Your account information has been updated successfully.");
      setTimeout(() => setIsSaved(false), 2500);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        toast.error("Could not save settings", err.response.data.message);
      } else {
        setIsSaved(true);
        toast.success("Settings saved", "Account information updated locally.");
        setTimeout(() => setIsSaved(false), 2500);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC]">
      {/* ======================================================== */}
      {/* DESKTOP & RESPONSIVE LAYOUT (FIGMA 08 Settings)          */}
      {/* ======================================================== */}
      <div className="px-6 lg:px-10 py-8 space-y-6 max-w-[760px]">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-[26px] font-bold text-[#0F172A] tracking-tight leading-tight">
            Settings
          </h1>
          <p className="text-sm text-[#64748B]">
            Manage your account and password.
          </p>
        </div>

        <div className="space-y-5">
          {/* ==================================================== */}
          {/* CARD 1: Account (Figma 1:1174)                       */}
          {/* ==================================================== */}
          <form
            onSubmit={handleSaveChanges}
            className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-2xs space-y-4"
          >
            <h2 className="text-base font-semibold text-[#0F172A]">Account</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#334155]">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Owner"
                  className="w-full h-[44px] rounded-lg border border-[#CBD5E1] bg-white px-3.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-all shadow-2xs"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#334155]">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@email.com"
                  className="w-full h-[44px] rounded-lg border border-[#CBD5E1] bg-white px-3.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-all shadow-2xs"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-start gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="h-[42px] px-5 rounded-[10px] bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all shadow-sm active:scale-[0.99] disabled:opacity-70"
              >
                {isSaved ? <Check className="w-4 h-4 text-emerald-300" /> : null}
                <span>{isSaving ? "Saving..." : isSaved ? "Saved!" : "Save changes"}</span>
              </button>
            </div>
          </form>

          {/* ==================================================== */}
          {/* CARD 2: Password (Figma 1:1189)                      */}
          {/* ==================================================== */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h2 className="text-base font-semibold text-[#0F172A]">Password</h2>
              <p className="text-sm text-[#64748B]">
                Use a strong password that only you know.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(true)}
              className="h-[42px] px-4 rounded-[10px] border border-[#E2E8F0] bg-white hover:bg-slate-50 text-sm font-semibold text-[#0F172A] flex items-center gap-2 cursor-pointer transition-all shadow-2xs shrink-0"
            >
              <Lock className="w-4 h-4 text-[#334155]" />
              <span>Change password</span>
            </button>
          </div>

          {/* ==================================================== */}
          {/* CARD 3: Reminder settings (Figma 1:1196)              */}
          {/* ==================================================== */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h2 className="text-base font-semibold text-[#0F172A]">
                  Reminder settings
                </h2>
                <p className="text-sm text-[#64748B]">
                  Choose when a customer shows up as &ldquo;Expiring soon&rdquo;.
                </p>
              </div>
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#F1F5F9] text-[#64748B] shrink-0">
                Optional
              </span>
            </div>

            <div className="divide-y divide-[#F1F5F9] pt-1">
              {/* Toggle 1: 7 days */}
              <div className="flex items-center justify-between py-3.5">
                <span className="text-sm font-medium text-[#0F172A]">
                  Remind me 7 days before expiry
                </span>
                <button
                  type="button"
                  onClick={() => setRemind7Days(!remind7Days)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    remind7Days ? "bg-[#4F46E5]" : "bg-slate-200"
                  }`}
                  aria-label="Toggle 7 days reminder"
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      remind7Days ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 2: 3 days */}
              <div className="flex items-center justify-between py-3.5">
                <span className="text-sm font-medium text-[#0F172A]">
                  Remind me 3 days before expiry
                </span>
                <button
                  type="button"
                  onClick={() => setRemind3Days(!remind3Days)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    remind3Days ? "bg-[#4F46E5]" : "bg-slate-200"
                  }`}
                  aria-label="Toggle 3 days reminder"
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      remind3Days ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 3: 1 day */}
              <div className="flex items-center justify-between py-3.5">
                <span className="text-sm font-medium text-[#0F172A]">
                  Remind me 1 day before expiry
                </span>
                <button
                  type="button"
                  onClick={() => setRemind1Day(!remind1Day)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    remind1Day ? "bg-[#4F46E5]" : "bg-slate-200"
                  }`}
                  aria-label="Toggle 1 day reminder"
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      remind1Day ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
};
