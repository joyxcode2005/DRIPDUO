"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function AuthErrorPage() {
    return (
        <div className="min-h-screen bg-[var(--black)] text-[var(--beige)] flex flex-col items-center justify-center font-sans p-6">
            <div className="max-w-md w-full bg-[var(--gray-900)] border border-[var(--gray-800)] p-8 text-center">
                <AlertTriangle size={32} className="text-[var(--orange)] mx-auto mb-6" strokeWidth={1.5} />

                <h1 className="font-serif text-3xl text-[var(--beige)] mb-4">
                    Link <em className="text-[var(--orange)]">Expired.</em>
                </h1>

                <p className="font-sans text-[11px] leading-relaxed tracking-[0.05em] text-[var(--gray-400)] mb-8">
                    The login link or code you used has expired or is invalid. This usually happens if you requested a new code, or if you waited too long.
                </p>

                <Link
                    href="/auth"
                    className="w-full bg-[var(--orange)] text-[var(--black)] font-sans text-[11px] font-bold uppercase tracking-[0.22em] py-4 flex items-center justify-center gap-2 hover:bg-[var(--beige)] transition-colors duration-300"
                >
                    <ArrowLeft size={14} strokeWidth={2} /> Request New Code
                </Link>
            </div>
        </div>
    );
}