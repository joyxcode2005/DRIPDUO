"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, MapPin, Heart, Settings, LogOut, ChevronRight, Plus, Edit2, Trash2, Eye, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

type Tab = "orders" | "addresses" | "wishlist" | "settings";

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

const StatusBadge = ({ status }: { status: string }) => {
  const isDelivered = status === "delivered";
  const isProcessing = status === "processing";
  return (
    <span className={`font-sans text-[9px] font-semibold tracking-[0.15em] uppercase px-3 py-1 border ${
      isDelivered ? "bg-[var(--beige)] text-[var(--black)] border-[var(--beige)]" :
      isProcessing ? "bg-[var(--orange)] text-[var(--black)] border-[var(--orange)]" :
      "bg-transparent text-[var(--beige)] border-[var(--beige)]"
    }`}>
      {status}
    </span>
  );
};

export default function ProfilePage() {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("orders");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState(MOCK_WISHLIST);
  const [signingOut, setSigningOut] = useState(false);

  // Redirect if not logged in
  React.useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    router.push("/");
  };

  // Get display name from metadata or email
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Member";
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "2026";

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--black)] flex items-center justify-center">
        <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--gray-400)] animate-pulse">Loading…</p>
      </div>
    );
  }

  if (!user) return null;

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "orders",    label: "Orders",    icon: <Package size={14} strokeWidth={1} /> },
    { id: "addresses", label: "Addresses", icon: <MapPin size={14} strokeWidth={1} /> },
    { id: "wishlist",  label: "Wishlist",  icon: <Heart size={14} strokeWidth={1} /> },
    { id: "settings",  label: "Settings",  icon: <Settings size={14} strokeWidth={1} /> },
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
            <p className="font-sans text-[10px] tracking-[0.1em] text-[var(--gray-400)] mt-3">{user.email}</p>
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
              className={`flex items-center gap-3 font-sans text-[10px] uppercase tracking-[0.2em] pb-4 border-b-2 transition-colors ${
                activeTab === id ? "border-[var(--orange)] text-[var(--orange)]" : "border-transparent text-[var(--gray-400)] hover:text-[var(--beige)]"
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="px-6 md:px-12 py-12 md:py-24">

        {/* ────── ORDERS ────── */}
        {activeTab === "orders" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--orange)] mb-8">
              {MOCK_ORDERS.length} Orders
            </p>
            <div className="flex flex-col border-t border-[var(--gray-800)]">
              {MOCK_ORDERS.map((order) => (
                <div key={order.id} className="border-b border-[var(--gray-800)] bg-[var(--black)]">
                  <button
                    className="w-full flex items-center justify-between py-8 group transition-colors"
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  >
                    <div className="flex items-center gap-8 md:gap-16 flex-wrap">
                      <div className="text-left">
                        <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-[var(--beige)] group-hover:text-[var(--orange)] mb-2 transition-colors">#{order.id}</p>
                        <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-[var(--gray-400)]">{order.date}</p>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="font-sans text-[11px] tracking-[0.1em] text-[var(--beige)]">$ {order.total}</span>
                      <ChevronRight
                        size={16} strokeWidth={1}
                        className={`text-[var(--gray-400)] transition-transform duration-500 ${expandedOrder === order.id ? "rotate-90 text-[var(--orange)]" : ""}`}
                      />
                    </div>
                  </button>
                  <div className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${expandedOrder === order.id ? "max-h-[800px] opacity-100 mb-8" : "max-h-0 opacity-0"}`}>
                    <div className="pt-8 border-t border-[var(--gray-900)]">
                      <div className="flex flex-col gap-6 mb-8">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex gap-6 items-center">
                            <div className="w-20 shrink-0 bg-[var(--gray-900)] aspect-[2/3] overflow-hidden">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-[var(--beige)] mb-2">{item.name}</p>
                              <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-[var(--gray-400)]">Size: {item.size} &nbsp;·&nbsp; Qty: {item.qty}</p>
                            </div>
                            <span className="font-sans text-[11px] tracking-[0.1em] text-[var(--orange)]">$ {item.price}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-4">
                        <button className="border border-[var(--beige)] text-[var(--beige)] font-sans text-[9px] uppercase tracking-[0.2em] px-8 py-3 hover:bg-[var(--beige)] hover:text-[var(--black)] transition-colors flex items-center gap-2">
                          <Eye size={12} strokeWidth={1} /> Track Order
                        </button>
                        <button className="text-[var(--gray-400)] font-sans text-[9px] uppercase tracking-[0.2em] px-4 hover:text-[var(--orange)] transition-colors">
                          Return / Exchange
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ────── ADDRESSES ────── */}
        {activeTab === "addresses" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between mb-8">
              <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--orange)]">Saved Addresses</p>
              <button className="flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--beige)] hover:text-[var(--orange)] transition-colors">
                <Plus size={14} strokeWidth={1} /> Add New
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border border-[var(--beige)] p-8 bg-[var(--gray-900)]">
                <div className="flex justify-between items-start mb-6">
                  <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--beige)]">Home — Default</span>
                  <div className="flex gap-4">
                    <button className="text-[var(--beige)] hover:text-[var(--orange)] transition-colors"><Edit2 size={14} strokeWidth={1} /></button>
                    <button className="text-[var(--gray-400)] hover:text-[var(--orange)] transition-colors"><Trash2 size={14} strokeWidth={1} /></button>
                  </div>
                </div>
                <p className="font-sans text-[11px] tracking-[0.05em] leading-loose text-[var(--gray-200)]">
                  {displayName}<br />
                  123 Park Street<br />
                  Kolkata, West Bengal<br />
                  700 016, India
                </p>
              </div>
              <button className="border border-dashed border-[var(--gray-600)] p-8 flex flex-col items-center justify-center gap-4 min-h-[200px] text-[var(--gray-400)] hover:text-[var(--orange)] hover:border-[var(--orange)] transition-colors group">
                <Plus size={24} strokeWidth={1} className="group-hover:scale-110 transition-transform" />
                <span className="font-sans text-[10px] uppercase tracking-[0.2em]">Add Address</span>
              </button>
            </div>
          </div>
        )}

        {/* ────── WISHLIST ────── */}
        {activeTab === "wishlist" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--orange)] mb-8">
              {wishlist.length} Saved Items
            </p>
            {wishlist.length === 0 ? (
              <div className="text-center py-32 border border-[var(--gray-800)]">
                <Heart size={28} strokeWidth={1} className="mx-auto mb-6 text-[var(--gray-400)]" />
                <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-[var(--gray-400)] mb-8">Your wishlist is empty</p>
                <Link href="/products" className="border-b border-[var(--beige)] pb-1 font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--beige)] hover:text-[var(--orange)] hover:border-[var(--orange)] transition-colors">
                  Browse Collection
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 w-full border-t border-l border-[var(--gray-800)]">
                {wishlist.map((item) => (
                  <div key={item.id} className="group relative border-r border-b border-[var(--gray-800)] bg-[var(--gray-900)] overflow-hidden">
                    <div className="relative w-full aspect-[2/3]">
                      <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
                      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                      <button
                        onClick={() => setWishlist(w => w.filter(x => x.id !== item.id))}
                        className="absolute top-4 right-4 bg-[var(--black)] text-[var(--beige)] p-2 hover:text-[var(--orange)] transition-colors z-20"
                      >
                        <Trash2 size={14} strokeWidth={1} />
                      </button>
                      <div className="absolute bottom-6 left-4 right-4 z-10 pointer-events-none">
                        <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-[var(--beige)] mb-1">{item.name}</p>
                        <div className="flex justify-between items-center">
                          <p className="font-sans text-[9px] tracking-[0.15em] uppercase text-[var(--gray-400)]">{item.category}</p>
                          <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-[var(--beige)]">${item.price}</p>
                        </div>
                      </div>
                      <button className="absolute bottom-0 left-0 right-0 bg-[var(--orange)] text-[var(--black)] py-4 font-sans text-[11px] font-bold uppercase tracking-[0.15em] transition-transform duration-300 translate-y-full group-hover:translate-y-0 z-20">
                        Add to Bag
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ────── SETTINGS ────── */}
        {activeTab === "settings" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-2xl">
            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--orange)] mb-12">
              Account Settings
            </p>

            {/* Personal Info */}
            <section className="mb-16">
              <h2 className="font-serif text-3xl mb-8 text-[var(--beige)]">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <label className="font-sans text-[9px] uppercase tracking-[0.2em] text-[var(--gray-400)] mb-4 block">Full Name</label>
                  <input
                    defaultValue={user?.user_metadata?.full_name || ""}
                    className="w-full bg-transparent border-b border-[var(--gray-600)] py-3 font-sans text-[12px] tracking-[0.1em] text-[var(--beige)] focus:outline-none focus:border-[var(--orange)] transition-colors"
                  />
                </div>
                <div>
                  <label className="font-sans text-[9px] uppercase tracking-[0.2em] text-[var(--gray-400)] mb-4 block">Email Address</label>
                  <input
                    defaultValue={user?.email || ""}
                    disabled
                    className="w-full bg-transparent border-b border-[var(--gray-800)] py-3 font-sans text-[12px] tracking-[0.1em] text-[var(--gray-400)] focus:outline-none cursor-not-allowed"
                  />
                </div>
              </div>
            </section>

            {/* Password */}
            <section className="mb-16 pt-12 border-t border-[var(--gray-800)]">
              <h2 className="font-serif text-3xl mb-8 text-[var(--beige)]">Password</h2>
              <p className="font-sans text-[11px] leading-relaxed tracking-[0.05em] text-[var(--gray-400)] mb-6">
                To change your password, use the forgot password flow from the sign-in page.
              </p>
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 border-b border-[var(--orange)] text-[var(--orange)] pb-1 font-sans text-[10px] uppercase tracking-[0.15em] hover:text-[var(--beige)] hover:border-[var(--beige)] transition-colors"
              >
                Go to Sign In
              </Link>
            </section>

            {/* Danger Zone */}
            <section className="pt-12 border-t border-[var(--gray-800)]">
              <h2 className="font-serif text-3xl mb-8 text-[var(--beige)]">Sign Out</h2>
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="flex items-center gap-3 border border-[var(--gray-600)] text-[var(--gray-200)] font-sans text-[10px] uppercase tracking-[0.2em] px-8 py-4 hover:border-[var(--orange)] hover:text-[var(--orange)] transition-colors disabled:opacity-50"
              >
                <LogOut size={14} strokeWidth={1} />
                {signingOut ? "Signing out…" : "Sign Out of Account"}
              </button>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}