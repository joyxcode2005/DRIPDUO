"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, ArrowRight, KeyRound } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { getSupabaseClient } from "@/lib/supabase";

type Step = "email" | "otp";

export default function LoginPage() {
  const router = useRouter();
  const supabase = getSupabaseClient();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setStep("otp");
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    console.log("OTP Verification Result:", { data, error });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // FIX 1: Tell Next.js to refresh its server-side state
    router.refresh();

    // FIX 2: Use a hard redirect to guarantee the middleware sees the new cookie
    window.location.href = "/profile";
  };

  const handleOAuthLogin = async (provider: "google" | "facebook") => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-(--black) text-(--beige) flex flex-col lg:flex-row font-sans">
      {/* Left: Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-(--gray-900) border-r border-(--gray-800) flex-col justify-between p-16">
        {/* Background texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Middle: Quote */}
        <div className="relative z-10">
          <p className="font-sans text-[9px] tracking-[0.35em] uppercase text-(--orange) mb-6 flex items-center gap-2">
            <span className="w-8 h-px bg-(--orange)" />
            FW 2026
          </p>
          <h2
            className="font-serif leading-[0.88] text-(--beige) mb-8"
            style={{ fontSize: "clamp(3rem,5vw,5rem)" }}
          >
            Unapologetic<br />
            <em className="text-(--orange)">Style.</em><br />
            Uncompromising<br />
            <em>Quality.</em>
          </h2>
          <p className="font-sans text-[11px] leading-[1.85] tracking-wider text-(--gray-200) max-w-xs">
            Join the archive. Exclusive access to new drops, limited collections, and the DRIPDUO experience.
          </p>
        </div>

        {/* Bottom: Stats */}
        <div className="relative z-10 flex gap-10 border-t border-(--gray-800) pt-8">
          {[
            { value: "5000+", label: "Members" },
            { value: "240 GSM", label: "Heavyweight" },
            { value: "FW26", label: "Collection" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-serif text-2xl text-(--beige)">{stat.value}</p>
              <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-(--gray-400) mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Auth Form */}
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-20 py-12 max-w-lg w-full mx-auto lg:max-w-none">

          <Link
            href="/"
            className="flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.15em] text-(--gray-400) hover:text-(--orange) transition-colors w-fit mb-12"
          >
            <ArrowLeft size={13} strokeWidth={1.5} /> Back to Store
          </Link>

          {/* Heading */}
          <div className="mb-10">
            <h1 className="font-serif text-[clamp(2.2rem,5vw,3.5rem)] leading-[0.92] text-(--beige) mb-3">
              Enter the<br /><em className="text-(--orange)">Archive.</em>
            </h1>
            <p className="font-sans text-[11px] leading-relaxed tracking-wider text-(--gray-200)">
              {step === "email"
                ? "Sign in or create an account using your email."
                : "Enter the 6-digit code sent to your email."}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 border border-(--orange) bg-(--orange)/5 px-5 py-4">
              <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-(--orange)">{error}</p>
            </div>
          )}

          {/* STEP 1: EMAIL INPUT */}
          {step === "email" && (
            <>
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="font-sans text-[9px] uppercase tracking-[0.2em] text-(--gray-400)">Email Address</label>
                  <div className="relative">
                    <Mail size={14} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-(--gray-400)" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError(null);
                      }}
                      placeholder="you@example.com"
                      className="w-full bg-(--gray-900) border border-(--gray-800) pl-11 pr-5 py-4 font-sans text-[12px] tracking-wider text-(--beige) placeholder-(--gray-600) focus:outline-none focus:border-(--orange) transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full bg-(--orange) font-sans text-[11px] font-bold uppercase tracking-[0.22em] py-5 flex items-center justify-center gap-3 hover:bg-(--beige) transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-white"
                >
                  {loading ? <span className="animate-pulse">Sending Code...</span> : <>Continue with Email <ArrowRight size={14} strokeWidth={2} /></>}
                </button>
              </form>

              {/* OAuth Providers */}
              <div className="mt-10">
                <div className="relative flex items-center py-5 mb-4">
                  <div className="grow border-t border-(--gray-800)"></div>
                  <span className="shrink-0 mx-4 font-sans text-[9px] uppercase tracking-[0.2em] text-(--gray-500)">Or Continue With</span>
                  <div className="grow border-t border-(--gray-800)"></div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => handleOAuthLogin("google")}
                    className="w-full bg-(--gray-900) border border-(--gray-800) text-(--beige) font-sans text-[11px] uppercase tracking-[0.15em] py-4 flex items-center justify-center gap-3 hover:border-(--gray-600) transition-colors duration-300"
                  >
                    <FcGoogle size={18} />
                    Google
                  </button>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleOAuthLogin("facebook")}
                      className="flex-1 bg-(--gray-900) border border-(--gray-800) text-(--beige) font-sans text-[11px] uppercase tracking-[0.15em] py-4 flex items-center justify-center gap-2 hover:border-(--gray-600) transition-colors duration-300"
                    >
                      <FaFacebook size={18} className="text-[#1877F2]" />
                      Facebook
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="font-sans text-[9px] uppercase tracking-[0.2em] text-(--gray-400) flex justify-between">
                  <span>Verification Code</span>
                  <span className="lowercase tracking-normal">{email}</span>
                </label>
                <div className="relative">
                  <KeyRound size={14} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-(--gray-400)" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value.replace(/\D/g, ''));
                      setError(null);
                    }}
                    placeholder="000000"
                    className="w-full bg-(--gray-900) border border-(--gray-800) pl-11 pr-5 py-4 font-sans text-[16px] tracking-[0.5em] text-center text-(--beige) placeholder-(--gray-600) focus:outline-none focus:border-(--orange) transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full bg-(--orange) text-(--black) font-sans text-[11px] font-bold uppercase tracking-[0.22em] py-5 flex items-center justify-center gap-3 hover:bg-(--beige) transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <span className="animate-pulse">Verifying...</span> : <>Verify Login <ArrowRight size={14} strokeWidth={2} /></>}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setOtp("");
                  setError(null);
                }}
                className="w-full font-sans text-[10px] uppercase tracking-[0.15em] text-(--gray-400) hover:text-(--beige) transition-colors py-2 flex items-center justify-center gap-2"
              >
                <ArrowLeft size={13} strokeWidth={1.5} /> Use a different email
              </button>
            </form>
          )}

          <p className="font-sans text-[9px] leading-relaxed tracking-wider text-(--gray-400) mt-8 text-center max-w-xs mx-auto">
            By continuing, you agree to our{" "}
            <span className="text-(--beige) underline underline-offset-2 cursor-pointer">Terms</span> and{" "}
            <span className="text-(--beige) underline underline-offset-2 cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}