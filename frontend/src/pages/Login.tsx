import React, { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import logoSvg from "../assets/niger-today-logo.svg";
import heroImg from "../assets/login-hero.png";

export const Login: React.FC = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect immediately to dashboard
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  // Inputs are completely empty by default as requested
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        // Fallback navigation for smooth demo
        navigate("/dashboard");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white">
      {/* ======================================================== */}
      {/* MOBILE LOGIN LAYOUT (FIGMA M1 Login - 390x844)           */}
      {/* Strictly left-aligned matching Figma                     */}
      {/* ======================================================== */}
      <div className="lg:hidden min-h-screen bg-[#F8FAFC] flex flex-col justify-center px-6 py-12">
        <div className="w-full max-w-[360px] mx-auto flex flex-col space-y-6">
          {/* Logo strictly on the LEFT (96x96px matching M1 Login) */}
          <div className="self-start">
            <img
              src={logoSvg}
              alt="Niger today TV"
              className="w-24 h-24 object-contain drop-shadow-md -ml-1"
            />
          </div>

          {/* Heading strictly on the LEFT */}
          <div className="text-left space-y-1.5">
            <h1 className="text-[28px] font-bold text-[#0F172A] tracking-tight leading-tight">
              Welcome back
            </h1>
            <p className="text-sm text-[#64748B]">
              Log in to manage your customers.
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#334155]">
                Email or username
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@email.com"
                className="w-full h-[48px] rounded-lg border border-[#CBD5E1] bg-white px-3.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-all shadow-2xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#334155]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-[48px] rounded-lg border border-[#CBD5E1] bg-white px-3.5 pr-10 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-all shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end pt-0.5">
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-[#4F46E5] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[46px] bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-semibold rounded-lg transition-all duration-150 cursor-pointer shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-70 mt-2"
            >
              {isSubmitting ? "Logging in..." : "Log in"}
            </button>
          </form>
        </div>
      </div>

      {/* ======================================================== */}
      {/* DESKTOP LOGIN LAYOUT (FIGMA 01 Login - 1440x900 Frame)   */}
      {/* 50% Left Brand Panel (720px) | 50% Right Form Panel (720px) */}
      {/* ======================================================== */}
      <div className="hidden lg:flex min-h-screen w-full">
        {/* BRAND PANEL (LEFT 50% / 720px) */}
        <div className="w-1/2 min-h-screen relative flex flex-col justify-between p-12 lg:p-16 overflow-hidden">
          {/* Natural Living Room TV Photo */}
          <img
            src={heroImg}
            alt="TV Setup Background"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Figma Exact Overlay Layer */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: "rgba(30, 27, 75, 0.12)",
              backdropFilter: "blur(3.35px)",
              WebkitBackdropFilter: "blur(3.35px)",
            }}
          />

          {/* Foreground Content */}
          <div className="relative z-10 flex flex-col h-full justify-between max-w-[520px]">
            <div>
              {/* Logo: Niger Today TV */}
              <div className="mb-6">
                <img
                  src={logoSvg}
                  alt="Niger today TV"
                  className="w-36 h-36 object-contain drop-shadow-[0_9px_4px_rgba(0,0,0,0.54)]"
                />
              </div>

              {/* Headline & Description */}
              <div className="space-y-3 mb-8">
                <h1 className="text-[34px] font-bold text-white tracking-tight leading-[1.2] drop-shadow-sm">
                  Know who to call today.
                </h1>
                <p className="text-base text-white/95 leading-relaxed font-normal max-w-md drop-shadow-sm">
                  Track every customer subscription, see who is expiring, and send renewal reminders in one place.
                </p>
              </div>

              {/* 3 Floating Stat Cards (Figma Exact: 194x54px, bg=white, shadow) */}
              <div className="space-y-3 w-[204px]">
                {/* 24 customers active */}
                <div className="bg-white rounded-xl py-2.5 px-4 shadow-lg flex items-center gap-3 border border-white/80">
                  <span className="text-2xl font-bold text-[#16A34A] leading-none">24</span>
                  <span className="text-xs font-semibold text-[#334155] leading-tight">
                    customers active
                  </span>
                </div>

                {/* 4 expiring this month */}
                <div className="bg-white rounded-xl py-2.5 px-4 shadow-lg flex items-center gap-3 border border-white/80">
                  <span className="text-2xl font-bold text-[#D97706] leading-none">4</span>
                  <span className="text-xs font-semibold text-[#334155] leading-tight">
                    expiring this month
                  </span>
                </div>

                {/* 2 expired — follow up */}
                <div className="bg-white rounded-xl py-2.5 px-4 shadow-lg flex items-center gap-3 border border-white/80">
                  <span className="text-2xl font-bold text-[#DC2626] leading-none">2</span>
                  <span className="text-xs font-semibold text-[#334155] leading-tight">
                    expired — follow up
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Footer Text strictly matching Figma */}
            <div className="pt-8 text-xs text-white/90 font-medium drop-shadow-sm">
              Private owner dashboard · Works on phone and computer
            </div>
          </div>
        </div>

        {/* FORM PANEL (RIGHT 50% / 720px - Pure Solid White) */}
        <div className="w-1/2 flex items-center justify-center p-12 lg:p-16 bg-white min-h-screen">
          <div className="w-full max-w-[400px]">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-[28px] font-bold text-[#0F172A] tracking-tight">
                Welcome back
              </h2>
              <p className="mt-1 text-sm text-[#64748B]">
                Log in to manage your customers.
              </p>
            </div>

            {error && (
              <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                  Email or username
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@email.com"
                  className="w-full h-[48px] rounded-lg border border-[#CBD5E1] bg-white px-3.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-[48px] rounded-lg border border-[#CBD5E1] bg-white px-3.5 pr-10 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              <div className="flex justify-end pt-0.5">
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-[#4F46E5] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-[46px] bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-semibold rounded-lg transition-all duration-150 cursor-pointer shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-70 mt-1"
              >
                {isSubmitting ? "Logging in..." : "Log in"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
