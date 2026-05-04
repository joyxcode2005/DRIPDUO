"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const supabase = getSupabaseClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSuccess(true);
    setTimeout(() => router.push("/profile"), 2500);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[var(--black)] text-[var(--beige)] flex flex-col items-center justify-center font-sans px-6 text-center">
        <div className="w-16 h-16 rounded-full border border-[var(--orange)] flex items-center justify-center mb-8 bg-[var(--orange)]/10">
          <Lock size={22} strokeWidth={1.5} className="text-[var(--orange)]" />
        </div>
        <h1 className="font-serif text-4xl font-light mb-4 text-[var(--beige)]">Password Updated</h1>
        <p className="font-sans text-[11px] tracking-[0.08em] text-[var(--gray-200)] mb-6">Redirecting you to your profile…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--black)] text-[var(--beige)] flex flex-col items-center justify-center font-sans px-6">
      <div className="w-full max-w-md">
        <Link href="/" className="block text-center mb-10">
          <span className="font-serif text-2xl tracking-[0.25em] uppercase text-[var(--beige)] hover:text-[var(--orange)] transition-colors">
            DRIPDUO
          </span>
        </Link>

        <h1 className="font-serif text-[clamp(2rem,5vw,3rem)] leading-[0.92] text-[var(--beige)] mb-3">
          New<br /><em className="text-[var(--orange)]">Password.</em>
        </h1>
        <p className="font-sans text-[11px] leading-relaxed tracking-[0.05em] text-[var(--gray-200)] mb-10">
          Choose a strong password for your account.
        </p>

        {error && (
          <div className="mb-6 border border-[var(--orange)] bg-[var(--orange)]/5 px-5 py-4">
            <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-[var(--orange)]">{error}</p>
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-5">
          <div className="flex flex-col gap-2">
            <label className="font-sans text-[9px] uppercase tracking-[0.2em] text-[var(--gray-400)]">New Password</label>
            <div className="relative">
              <Lock size={14} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--gray-400)]" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Min. 6 characters"
                className="w-full bg-[var(--gray-900)] border border-[var(--gray-800)] pl-11 pr-12 py-4 font-sans text-[12px] tracking-[0.15em] text-[var(--beige)] placeholder-[var(--gray-600)] focus:outline-none focus:border-[var(--orange)] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--gray-400)] hover:text-[var(--beige)] transition-colors"
              >
                {showPassword ? <EyeOff size={14} strokeWidth={1.5} /> : <Eye size={14} strokeWidth={1.5} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-sans text-[9px] uppercase tracking-[0.2em] text-[var(--gray-400)]">Confirm Password</label>
            <div className="relative">
              <Lock size={14} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--gray-400)]" />
              <input
                type={showPassword ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                placeholder="Repeat password"
                className="w-full bg-[var(--gray-900)] border border-[var(--gray-800)] pl-11 pr-5 py-4 font-sans text-[12px] tracking-[0.15em] text-[var(--beige)] placeholder-[var(--gray-600)] focus:outline-none focus:border-[var(--orange)] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--orange)] text-[var(--black)] font-sans text-[11px] font-bold uppercase tracking-[0.22em] py-5 flex items-center justify-center gap-3 hover:bg-[var(--beige)] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <span className="animate-pulse">Updating…</span> : <>Update Password <ArrowRight size={14} strokeWidth={2} /></>}
          </button>
        </form>
      </div>
    </div>
  );
}