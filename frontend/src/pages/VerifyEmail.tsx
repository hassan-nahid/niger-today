import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { Mail, KeyRound, CheckCircle2, AlertCircle } from "lucide-react";
import axios from "axios";

import logoSvg from "../assets/niger-today-logo.svg";

export const VerifyEmail: React.FC = () => {
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      await verifyEmail({ email: email.trim(), code: code.trim() });
      setSuccess("Email successfully verified! Redirecting to dashboard...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Verification failed. Please check the OTP code.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-xl">
        <div className="mb-6 text-center flex flex-col items-center">
          <img
            src={logoSvg}
            alt="Niger today TV"
            className="w-20 h-20 object-contain drop-shadow-md mb-2"
          />
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">Verify Your Email</h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Enter the 6-digit verification code sent to your email
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p>{error}</p>
              {(error.toLowerCase().includes("expired") || error.toLowerCase().includes("already verified")) && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Your account may already be verified.{" "}
                  <Link to="/login" className="font-semibold text-primary underline">
                    Click here to Sign In →
                  </Link>
                </p>
              )}
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
            <p className="flex-1">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-[#94A3B8]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full h-11 rounded-lg border border-[#CBD5E1] bg-white pl-9 pr-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1.5">
              6-Digit OTP Code
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 h-4 w-4 text-[#94A3B8]" />
              <input
                type="text"
                required
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                className="w-full h-11 rounded-lg border border-[#CBD5E1] bg-white pl-9 pr-3 text-center text-lg font-mono tracking-widest text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || code.length < 6}
            className="w-full h-[46px] rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-semibold transition-all duration-150 cursor-pointer shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-70 mt-2"
          >
            {isSubmitting ? "Verifying..." : "Verify & Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[#64748B]">
          Back to{" "}
          <Link to="/login" className="font-semibold text-[#4F46E5] hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
