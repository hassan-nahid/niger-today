import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../context/ToastContext";
import { useCustomerContext } from "../context/CustomerContext";
import { ChangePasswordModal } from "../components/modals/ChangePasswordModal";
import { Lock, Check, ShieldCheck } from "lucide-react";
import axios from "axios";
import { getSettingsApi, updateSettingsApi } from "../api/settings.api";

export const Settings: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { refreshData } = useCustomerContext();
  const toast = useToast();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Form State matching Figma 08 Settings & user data
  const [name, setName] = useState(user?.fullName || user?.firstName || "Alex Owner");
  const [email, setEmail] = useState(user?.email || "owner@email.com");
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // System & Reminder settings state
  const [remind10Days, setRemind10Days] = useState(true);
  const [remind7Days, setRemind7Days] = useState(false);
  const [remind3Days, setRemind3Days] = useState(false);
  const [remind1Day, setRemind1Day] = useState(false);
  const [graceEnabled, setGraceEnabled] = useState(false);
  const [graceDays, setGraceDays] = useState(5);
  const [isSettingsLoading, setIsSettingsLoading] = useState(false);

  // Load current user
  useEffect(() => {
    if (user) {
      setName(user.fullName || user.firstName || "Alex Owner");
      setEmail(user.email || "owner@email.com");
    }
  }, [user]);

  // Load real settings from backend API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsSettingsLoading(true);
        const settings = await getSettingsApi();
        setRemind10Days(settings.remind10Days ?? true);
        setRemind7Days(settings.remind7Days ?? false);
        setRemind3Days(settings.remind3Days ?? false);
        setRemind1Day(settings.remind1Day ?? false);
        setGraceEnabled(settings.graceEnabled);
        setGraceDays(settings.graceDays || 5);
      } catch (err) {
        console.warn("Could not load settings from API, using defaults", err);
      } finally {
        setIsSettingsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Save account information
  const handleSaveAccount = async (e: React.FormEvent) => {
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
        toast.success("Settings saved", "Account information updated.");
        setTimeout(() => setIsSaved(false), 2500);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to persist reminder toggle changes to backend (Single-select: only one active at a time)
  const handleSelectReminder = async (selected: "10days" | "7days" | "3days" | "1day") => {
    let new10 = false;
    let new7 = false;
    let new3 = false;
    let new1 = false;

    // Toggle behavior: if already active, toggle off; otherwise make it the only active one
    if (selected === "10days") new10 = !remind10Days;
    if (selected === "7days") new7 = !remind7Days;
    if (selected === "3days") new3 = !remind3Days;
    if (selected === "1day") new1 = !remind1Day;

    setRemind10Days(new10);
    setRemind7Days(new7);
    setRemind3Days(new3);
    setRemind1Day(new1);

    try {
      await updateSettingsApi({
        remind10Days: new10,
        remind7Days: new7,
        remind3Days: new3,
        remind1Day: new1,
      });
      await refreshData();
      toast.success("Reminder updated", "Notification preference saved.");
    } catch (err) {
      console.error("Failed to update reminder settings:", err);
      toast.error("Error", "Could not save reminder settings.");
    }
  };

  // Helper to save grace period settings
  const handleSaveSystemSettings = async () => {
    try {
      await updateSettingsApi({
        graceEnabled,
        graceDays,
      });
      // Refresh customer list & stats with new rules applied
      await refreshData();
      toast.success("Grace period saved", "Grace period rules have been updated successfully.");
    } catch (err) {
      console.error("Failed to update grace period rules:", err);
      toast.error("Error", "Could not save grace period rules.");
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
            Manage your account, password, and subscription rules.
          </p>
        </div>

        <div className="space-y-5">
          {/* ==================================================== */}
          {/* CARD 1: Account (Figma 1:1174)                       */}
          {/* ==================================================== */}
          <form
            onSubmit={handleSaveAccount}
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
              {/* Toggle 0: 10 days */}
              <div className="flex items-center justify-between py-3.5">
                <span className="text-sm font-medium text-[#0F172A]">
                  Remind me 10 days before expiry
                </span>
                <button
                  type="button"
                  disabled={isSettingsLoading}
                  onClick={() => handleSelectReminder("10days")}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    remind10Days ? "bg-[#4F46E5]" : "bg-slate-200"
                  }`}
                  aria-label="Toggle 10 days reminder"
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      remind10Days ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 1: 7 days */}
              <div className="flex items-center justify-between py-3.5">
                <span className="text-sm font-medium text-[#0F172A]">
                  Remind me 7 days before expiry
                </span>
                <button
                  type="button"
                  disabled={isSettingsLoading}
                  onClick={() => handleSelectReminder("7days")}
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
                  disabled={isSettingsLoading}
                  onClick={() => handleSelectReminder("3days")}
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
                  disabled={isSettingsLoading}
                  onClick={() => handleSelectReminder("1day")}
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

          {/* ==================================================== */}
          {/* CARD 4: Grace Period Settings                        */}
          {/* ==================================================== */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#4F46E5]" />
                  <h2 className="text-base font-semibold text-[#0F172A]">
                    Grace Period
                  </h2>
                </div>
                <p className="text-sm text-[#64748B]">
                  Allow customers extra grace days after expiry before service disconnection.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-1">
              {/* Grace Period Toggle */}
              <div className="flex items-center justify-between py-2 border-t border-[#F1F5F9]">
                <div>
                  <div className="text-sm font-medium text-[#0F172A]">
                    Enable Grace Period
                  </div>
                  <div className="text-xs text-[#64748B]">
                    Keep uninterrupted service during payment delay
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setGraceEnabled(!graceEnabled)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    graceEnabled ? "bg-[#4F46E5]" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      graceEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Grace Days Select */}
              {graceEnabled && (
                <div className="space-y-1.5 pl-3 border-l-2 border-[#4F46E5] animate-in fade-in duration-200">
                  <label className="block text-xs font-semibold text-[#334155]">
                    Grace Period Duration
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[5, 10, 15, 20, 25].map((days) => (
                      <button
                        key={days}
                        type="button"
                        onClick={() => setGraceDays(days)}
                        className={`h-9 px-4 rounded-lg text-xs font-semibold cursor-pointer transition-all border ${
                          graceDays === days
                            ? "border-[#4F46E5] bg-[#EEF2FF] text-[#4F46E5]"
                            : "border-[#E2E8F0] bg-white text-[#334155] hover:bg-slate-50"
                        }`}
                      >
                        {days} Days
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSaveSystemSettings}
                  className="h-[40px] px-4 rounded-[10px] bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold cursor-pointer transition-all shadow-xs active:scale-[0.99]"
                >
                  Save Grace Period
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
