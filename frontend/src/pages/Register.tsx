import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import logoSvg from "../assets/niger-today-logo.svg";
import heroImg from "../assets/login-hero.png";

export const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "user" as "user" | "admin",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation rules
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (!/\d/.test(formData.password) || !/[a-zA-Z]/.test(formData.password)) {
      setError("Password must contain at least one letter and one number.");
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      // Redirect to OTP verification page
      navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Registration failed. Please check your information.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white">
      {/* ======================================================== */}
      {/* MOBILE REGISTER LAYOUT (Exact theme matching M1 Login)   */}
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

          {/* Heading */}
          <div className="text-left space-y-1.5">
            <h1 className="text-[28px] font-bold text-[#0F172A] tracking-tight leading-tight">
              Create an account
            </h1>
            <p className="text-sm text-[#64748B]">
              Sign up to manage your customer subscriptions.
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
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#334155]">
                  First name
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="w-full h-[48px] rounded-lg border border-[#CBD5E1] bg-white px-3.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-all shadow-2xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#334155]">
                  Last name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full h-[48px] rounded-lg border border-[#CBD5E1] bg-white px-3.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-all shadow-2xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#334155]">
                Email address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="john@email.com"
                className="w-full h-[48px] rounded-lg border border-[#CBD5E1] bg-white px-3.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-all shadow-2xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#334155]">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full h-[48px] rounded-lg border border-[#CBD5E1] bg-white px-3 text-sm text-[#0F172A] focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-all shadow-2xs"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#334155]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 8 chars (1 letter + 1 number)"
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
              <p className="text-[11px] text-[#64748B] pt-0.5">
                Must be at least 8 characters with 1 letter and 1 number.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[46px] bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-semibold rounded-lg transition-all duration-150 cursor-pointer shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-70 mt-2"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>

            {/* Link to Login */}
            <p className="text-center text-xs text-[#64748B] pt-2">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-[#4F46E5] hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* ======================================================== */}
      {/* DESKTOP REGISTER LAYOUT (Exact theme matching 01 Login)  */}
      {/* 50% Left Brand Panel (720px) | 50% Right Form Panel      */}
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
          <div className="w-full max-w-[420px]">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-[28px] font-bold text-[#0F172A] tracking-tight">
                Create an account
              </h2>
              <p className="mt-1 text-sm text-[#64748B]">
                Sign up to manage your customer subscriptions.
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                    First name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    className="w-full h-[48px] rounded-lg border border-[#CBD5E1] bg-white px-3.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                    Last name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    className="w-full h-[48px] rounded-lg border border-[#CBD5E1] bg-white px-3.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@email.com"
                  className="w-full h-[48px] rounded-lg border border-[#CBD5E1] bg-white px-3.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full h-[48px] rounded-lg border border-[#CBD5E1] bg-white px-3 text-sm text-[#0F172A] focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-all"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 8 characters (1 letter + 1 number)"
                    className="w-full h-[48px] rounded-lg border border-[#CBD5E1] bg-white px-3.5 pr-10 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-[#64748B] pt-1">
                  Must be at least 8 characters with 1 letter and 1 number.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-[46px] bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-semibold rounded-lg transition-all duration-150 cursor-pointer shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-70 mt-1"
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </button>

              {/* Link to Login */}
              <p className="text-center text-xs text-[#64748B] pt-2">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-[#4F46E5] hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
