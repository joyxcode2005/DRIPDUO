"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft, Lock, Mail, User, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

type Mode = "login" | "register" | "forgot";

export default function AuthPage() {
  const router = useRouter();
  const { signIn, signUp, resetPassword } = useAuth();

  const [mode, setMode] = useState<Mode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await signIn(form.email, form.password);
    setLoading(false);
    if (error) {
      setError(error);
      return;
    }
    router.push("/profile");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }
    const { error } = await signUp(form.email, form.password, form.fullName);
    setLoading(false);
    if (error) {
      setError(error);
      return;
    }
    setSuccess("Account created! Please check your email to confirm your account.");
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await resetPassword(form.email);
    setLoading(false);
    if (error) {
      setError(error);
      return;
    }
    setSuccess("Password reset link sent. Check your email.");
  };

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setError(null);
    setSuccess(null);
    setForm({ fullName: "", email: "", password: "", confirmPassword: "" });
  };

  return (
    <div className="min-h-screen bg-[var(--black)] text-[var(--beige)] flex flex-col lg:flex-row font-sans">
      {/* Left: Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[var(--gray-900)] border-r border-[var(--gray-800)] flex-col justify-between p-16">
        {/* Background texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />


        {/* Middle: Quote */}
        <div className="relative z-10">
          <p className="font-sans text-[9px] tracking-[0.35em] uppercase text-[var(--orange)] mb-6 flex items-center gap-2">
            <span className="w-8 h-px bg-[var(--orange)]" />
            FW 2026
          </p>
          <h2
            className="font-serif leading-[0.88] text-[var(--beige)] mb-8"
            style={{ fontSize: "clamp(3rem,5vw,5rem)" }}
          >
            Unapologetic<br />
            <em className="text-[var(--orange)]">Style.</em><br />
            Uncompromising<br />
            <em>Quality.</em>
          </h2>
          <p className="font-sans text-[11px] leading-[1.85] tracking-[0.05em] text-[var(--gray-200)] max-w-xs">
            Join the archive. Exclusive access to new drops, limited collections, and the DRIPDUO experience.
          </p>
        </div>

        {/* Bottom: Stats */}
        <div className="relative z-10 flex gap-10 border-t border-[var(--gray-800)] pt-8">
          {[
            { value: "5000+", label: "Members" },
            { value: "240 GSM", label: "Heavyweight" },
            { value: "FW26", label: "Collection" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-serif text-2xl text-[var(--beige)]">{stat.value}</p>
              <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-[var(--gray-400)] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Auth Form */}
      <div className="flex-1 flex flex-col min-h-screen">

        <div className="flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-20 py-12 max-w-lg w-full mx-auto lg:max-w-none">

          {/* Back link (Visible on Mobile & Desktop) */}
          <Link
            href="/"
            className="flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.15em] text-[var(--gray-400)] hover:text-[var(--orange)] transition-colors w-fit mb-8 lg:mb-12"
          >
            <ArrowLeft size={13} strokeWidth={1.5} /> Back to Store
          </Link>

          {/* Mode Tabs */}
          <div className="flex items-center gap-8 border-b border-[var(--gray-800)] mb-10">
            {(["login", "register"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`font-sans text-[11px] uppercase tracking-[0.18em] pb-4 border-b-2 transition-colors ${
                  mode === m
                    ? "border-[var(--orange)] text-[var(--orange)]"
                    : "border-transparent text-[var(--gray-400)] hover:text-[var(--beige)]"
                }`}
              >
                {m === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          {/* Heading */}
          <div className="mb-10">
            <h1 className="font-serif text-[clamp(2.2rem,5vw,3.5rem)] leading-[0.92] text-[var(--beige)] mb-3">
              {mode === "login" && <>Welcome<br /><em className="text-[var(--orange)]">Back.</em></>}
              {mode === "register" && <>Join the<br /><em className="text-[var(--orange)]">Archive.</em></>}
              {mode === "forgot" && <>Reset<br /><em className="text-[var(--orange)]">Password.</em></>}
            </h1>
            <p className="font-sans text-[11px] leading-relaxed tracking-[0.05em] text-[var(--gray-200)]">
              {mode === "login" && "Enter your credentials to access your account."}
              {mode === "register" && "Create your account to start your collection."}
              {mode === "forgot" && "Enter your email and we'll send a reset link."}
            </p>
          </div>

          {/* Error / Success */}
          {error && (
            <div className="mb-6 border border-[var(--orange)] bg-[var(--orange)]/5 px-5 py-4">
              <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-[var(--orange)]">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-6 border border-[var(--beige)] bg-[var(--gray-900)] px-5 py-4">
              <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-[var(--beige)]">{success}</p>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="font-sans text-[9px] uppercase tracking-[0.2em] text-[var(--gray-400)]">Email Address</label>
                <div className="relative">
                  <Mail size={14} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--gray-400)]" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="w-full bg-[var(--gray-900)] border border-[var(--gray-800)] pl-11 pr-5 py-4 font-sans text-[12px] tracking-[0.05em] text-[var(--beige)] placeholder-[var(--gray-600)] focus:outline-none focus:border-[var(--orange)] transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-sans text-[9px] uppercase tracking-[0.2em] text-[var(--gray-400)]">Password</label>
                <div className="relative">
                  <Lock size={14} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--gray-400)]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
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

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => switchMode("forgot")}
                  className="font-sans text-[10px] uppercase tracking-[0.12em] text-[var(--gray-400)] hover:text-[var(--orange)] transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--orange)] text-[var(--black)] font-sans text-[11px] font-bold uppercase tracking-[0.22em] py-5 flex items-center justify-center gap-3 hover:bg-[var(--beige)] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="animate-pulse">Signing In…</span>
                ) : (
                  <>Sign In <ArrowRight size={14} strokeWidth={2} /></>
                )}
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {mode === "register" && (
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="flex flex-col gap-2">
                <label className="font-sans text-[9px] uppercase tracking-[0.2em] text-[var(--gray-400)]">Full Name</label>
                <div className="relative">
                  <User size={14} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--gray-400)]" />
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Your Name"
                    className="w-full bg-[var(--gray-900)] border border-[var(--gray-800)] pl-11 pr-5 py-4 font-sans text-[12px] tracking-[0.05em] text-[var(--beige)] placeholder-[var(--gray-600)] focus:outline-none focus:border-[var(--orange)] transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-sans text-[9px] uppercase tracking-[0.2em] text-[var(--gray-400)]">Email Address</label>
                <div className="relative">
                  <Mail size={14} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--gray-400)]" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="w-full bg-[var(--gray-900)] border border-[var(--gray-800)] pl-11 pr-5 py-4 font-sans text-[12px] tracking-[0.05em] text-[var(--beige)] placeholder-[var(--gray-600)] focus:outline-none focus:border-[var(--orange)] transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-sans text-[9px] uppercase tracking-[0.2em] text-[var(--gray-400)]">Password</label>
                <div className="relative">
                  <Lock size={14} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--gray-400)]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
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
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Repeat password"
                    className="w-full bg-[var(--gray-900)] border border-[var(--gray-800)] pl-11 pr-5 py-4 font-sans text-[12px] tracking-[0.15em] text-[var(--beige)] placeholder-[var(--gray-600)] focus:outline-none focus:border-[var(--orange)] transition-colors"
                  />
                </div>
              </div>

              <p className="font-sans text-[9px] leading-relaxed tracking-[0.05em] text-[var(--gray-400)]">
                By creating an account, you agree to our{" "}
                <span className="text-[var(--beige)] underline underline-offset-2 cursor-pointer">Terms</span> and{" "}
                <span className="text-[var(--beige)] underline underline-offset-2 cursor-pointer">Privacy Policy</span>.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--orange)] text-[var(--black)] font-sans text-[11px] font-bold uppercase tracking-[0.22em] py-5 flex items-center justify-center gap-3 hover:bg-[var(--beige)] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="animate-pulse">Creating Account…</span>
                ) : (
                  <>Create Account <ArrowRight size={14} strokeWidth={2} /></>
                )}
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {mode === "forgot" && (
            <form onSubmit={handleForgot} className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="font-sans text-[9px] uppercase tracking-[0.2em] text-[var(--gray-400)]">Email Address</label>
                <div className="relative">
                  <Mail size={14} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--gray-400)]" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="w-full bg-[var(--gray-900)] border border-[var(--gray-800)] pl-11 pr-5 py-4 font-sans text-[12px] tracking-[0.05em] text-[var(--beige)] placeholder-[var(--gray-600)] focus:outline-none focus:border-[var(--orange)] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--orange)] text-[var(--black)] font-sans text-[11px] font-bold uppercase tracking-[0.22em] py-5 flex items-center justify-center gap-3 hover:bg-[var(--beige)] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <span className="animate-pulse">Sending…</span> : <>Send Reset Link <ArrowRight size={14} strokeWidth={2} /></>}
              </button>

              <button
                type="button"
                onClick={() => switchMode("login")}
                className="w-full font-sans text-[10px] uppercase tracking-[0.15em] text-[var(--gray-400)] hover:text-[var(--beige)] transition-colors py-2 flex items-center justify-center gap-2"
              >
                <ArrowLeft size={13} strokeWidth={1.5} /> Back to Sign In
              </button>
            </form>
          )}

          {/* Bottom switch */}
          {mode !== "forgot" && (
            <p className="font-sans text-[10px] tracking-[0.08em] text-[var(--gray-400)] mt-8 text-center">
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => switchMode(mode === "login" ? "register" : "login")}
                className="text-[var(--beige)] hover:text-[var(--orange)] transition-colors underline underline-offset-2"
              >
                {mode === "login" ? "Create one" : "Sign in"}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}