// app/profile/ProfileClient.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, MapPin, Heart, Settings, LogOut, ChevronRight, Plus, Edit2, Trash2, Eye, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { getSupabaseClient } from "@/lib/supabase"; // Use your standard supabase client here

type Tab = "orders" | "addresses" | "wishlist" | "settings";

// ... Keep your MOCK_ORDERS, MOCK_WISHLIST, and StatusBadge code exactly as is ...
const MOCK_ORDERS = [

    {

        id: "DRP-48291",

        date: "April 18, 2026",

        status: "delivered",

        items: [

            { name: "Gothic Skull Premium", size: "L", qty: 1, price: 145, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&q=80" },

            { name: "Urban Essentials Tee", size: "M", qty: 2, price: 130, image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&q=80" },

        ],

        total: 405,

    },

    {

        id: "DRP-31827",

        date: "March 5, 2026",

        status: "delivered",

        items: [

            { name: "Kashmir Cashmere Hoodie", size: "L", qty: 1, price: 240, image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80" },

        ],

        total: 240,

    },

    {

        id: "DRP-19034",

        date: "April 25, 2026",

        status: "processing",

        items: [

            { name: "Raw Architecture Jacket", size: "XL", qty: 1, price: 220, image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80" },

        ],

        total: 220,

    },

];



const MOCK_WISHLIST = [

    { id: "w1", name: "Bengal Heritage Tee", price: 135, category: "Bong", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80" },

    { id: "w2", name: "Seoul Wave Oversized", price: 130, category: "Kpop", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80" },

    { id: "w3", name: "Spiritual Mandala Drop", price: 140, category: "Spiritual", image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=600&q=80" },

];



// Accept the user prop from the Server Component
export default function ProfileClient({ initialUser }: { initialUser: any }) {
    const router = useRouter();
    const supabase = getSupabaseClient();
    const [activeTab, setActiveTab] = useState<Tab>("orders");
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [wishlist, setWishlist] = useState(MOCK_WISHLIST);
    const [signingOut, setSigningOut] = useState(false);

    const handleSignOut = async () => {
        setSigningOut(true);
        await supabase.auth.signOut();
        router.refresh(); // This forces the server component to re-run, which will trigger the redirect("/auth")
    };

    // Use the verified initialUser passed from the server
    const displayName = initialUser?.user_metadata?.full_name || initialUser?.email?.split("@")[0] || "Member";
    const memberSince = initialUser?.created_at
        ? new Date(initialUser.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
        : "2026";

    const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
        { id: "orders", label: "Orders", icon: <Package size={14} strokeWidth={1} /> },
        { id: "addresses", label: "Addresses", icon: <MapPin size={14} strokeWidth={1} /> },
        { id: "wishlist", label: "Wishlist", icon: <Heart size={14} strokeWidth={1} /> },
        { id: "settings", label: "Settings", icon: <Settings size={14} strokeWidth={1} /> },
    ];

    return (
        <div className="bg-[var(--black)] min-h-screen text-[var(--beige)] pt-24 font-sans">
            {/* ── PAGE HEADER ── */}
            <div className="px-6 md:px-12 pb-12 border-b border-[var(--gray-800)]">
                <Link href="/" className="inline-flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--beige)] hover:text-[var(--orange)] transition-colors mb-12">
                    <ArrowLeft size={14} strokeWidth={1} /> Back to store
                </Link>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-[var(--orange)] mb-4">
                            Member since {memberSince}
                        </p>
                        <h1 className="font-serif text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.9] text-[var(--beige)]">
                            {displayName}
                        </h1>
                        <p className="font-sans text-[10px] tracking-[0.1em] text-[var(--gray-400)] mt-3">{initialUser.email}</p>
                    </div>

                    <button
                        onClick={handleSignOut}
                        disabled={signingOut}
                        className="flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--gray-400)] hover:text-[var(--orange)] transition-colors disabled:opacity-50"
                    >
                        <LogOut size={14} strokeWidth={1} />
                        {signingOut ? "Signing out…" : "Sign Out"}
                    </button>
                </div>

                {/* TABS */}
                <div className="flex overflow-x-auto no-scroll mt-16 gap-8 md:gap-16 border-b border-[var(--gray-900)]">
                    {tabs.map(({ id, label, icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex items-center gap-3 font-sans text-[10px] uppercase tracking-[0.2em] pb-4 border-b-2 transition-colors ${activeTab === id ? "border-[var(--orange)] text-[var(--orange)]" : "border-transparent text-[var(--gray-400)] hover:text-[var(--beige)]"
                                }`}
                        >
                            {icon} {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── CONTENT ── */}
            {/* NOTE: ALL OF YOUR TABS CONTENT REMAINS EXACTLY THE SAME BELOW HERE */}
            <div className="px-6 md:px-12 py-12 md:py-24">
                {/* ... Your Orders, Addresses, Wishlist, and Settings JSX ... */}
            </div>
        </div>
    );
}