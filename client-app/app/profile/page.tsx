"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, MapPin, Heart, Settings, LogOut, ChevronRight, Plus, Edit2, Trash2, Eye, ArrowLeft } from "lucide-react";

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

/* ── status badge ── */
const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    delivered: "badge-delivered",
    processing: "badge-processing",
    shipped: "badge-shipped",
  };
  return (
    <span className={`badge ${map[status] || ""}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("orders");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState(MOCK_WISHLIST);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "orders",    label: "Orders",    icon: <Package size={15} strokeWidth={1.25} /> },
    { id: "addresses", label: "Addresses", icon: <MapPin size={15} strokeWidth={1.25} /> },
    { id: "wishlist",  label: "Wishlist",  icon: <Heart size={15} strokeWidth={1.25} /> },
    { id: "settings",  label: "Settings",  icon: <Settings size={15} strokeWidth={1.25} /> },
  ];

  return (
    <div style={{ background: "var(--white)", minHeight: "100vh", paddingTop: "58px", fontFamily: "var(--font-sans)" }}>

      {/* ── PAGE HEADER ── */}
      <div style={{ borderBottom: "1px solid var(--gray-200)", padding: "clamp(32px,5vw,56px) clamp(16px,4vw,48px) 0" }}>
        <Link href="/" className="btn-ghost anim-fade-in" style={{ fontSize: "10px", marginBottom: "28px", display: "inline-flex" }}>
          <ArrowLeft size={13} strokeWidth={1.25} /> Back
        </Link>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", paddingBottom: "clamp(20px,3vw,32px)" }}>
          <div className="anim-fade-up">
            <p className="label" style={{ color: "var(--gray-400)", marginBottom: "10px", fontSize: "9px", letterSpacing: "0.22em" }}>
              Member since 2026
            </p>
            <h1 className="display-md">My Account</h1>
          </div>

          <button className="btn-ghost anim-fade-in delay-200" style={{ fontSize: "10px", color: "var(--gray-400)" }}>
            <LogOut size={14} strokeWidth={1.25} />
            Sign Out
          </button>
        </div>

        {/* TABS */}
        <div style={{ display: "flex", gap: "clamp(20px,4vw,48px)", overflowX: "auto" }} className="no-scroll">
          {tabs.map(({ id, label, icon }) => (
            <button
              key={id}
              className={`profile-tab-btn ${activeTab === id ? "active" : ""}`}
              onClick={() => setActiveTab(id)}
              style={{ display: "flex", alignItems: "center", gap: "7px", whiteSpace: "nowrap" }}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ padding: "clamp(28px,5vw,56px) clamp(16px,4vw,48px)" }}>

        {/* ────── ORDERS ────── */}
        {activeTab === "orders" && (
          <div className="anim-scale-up">
            <p className="label" style={{ color: "var(--gray-400)", marginBottom: "28px", fontSize: "9px", letterSpacing: "0.2em" }}>
              {MOCK_ORDERS.length} Orders
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {MOCK_ORDERS.map((order) => (
                <div key={order.id} style={{ border: "1px solid var(--gray-100)", background: "var(--white)" }}>
                  {/* Order header */}
                  <button
                    style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", cursor: "pointer", background: "transparent", border: "none", textAlign: "left" }}
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "clamp(16px,4vw,40px)", flexWrap: "wrap" }}>
                      <div>
                        <p className="label" style={{ fontSize: "10px", letterSpacing: "0.15em", marginBottom: "4px" }}>#{order.id}</p>
                        <p className="label" style={{ fontSize: "9px", color: "var(--gray-400)", letterSpacing: "0.1em" }}>{order.date}</p>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                      <span className="label" style={{ fontSize: "10px" }}>$ {order.total}</span>
                      <ChevronRight
                        size={14} strokeWidth={1.25}
                        style={{ transition: "transform 0.3s ease", transform: expandedOrder === order.id ? "rotate(90deg)" : "rotate(0deg)" }}
                      />
                    </div>
                  </button>

                  {/* Expanded items */}
                  <div
                    className="accordion-body"
                    style={{ maxHeight: expandedOrder === order.id ? "600px" : "0" }}
                  >
                    <div style={{ borderTop: "1px solid var(--gray-100)", padding: "20px 24px 24px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "20px" }}>
                        {order.items.map((item, i) => (
                          <div key={i} style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                            <div style={{ width: "64px", flexShrink: 0, background: "var(--gray-50)", aspectRatio: "3/4", overflow: "hidden" }}>
                              <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <p className="label" style={{ fontSize: "10px", marginBottom: "4px", letterSpacing: "0.12em" }}>{item.name}</p>
                              <p className="body-copy" style={{ fontSize: "10px" }}>Size: {item.size} &nbsp;·&nbsp; Qty: {item.qty}</p>
                            </div>
                            <span className="label" style={{ fontSize: "10px" }}>$ {item.price}</span>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: "flex", gap: "12px", paddingTop: "16px", borderTop: "1px solid var(--gray-100)" }}>
                        <button className="btn-secondary" style={{ fontSize: "9px", padding: "10px 20px" }}>
                          <Eye size={12} strokeWidth={1.25} /> Track Order
                        </button>
                        <button className="btn-ghost" style={{ fontSize: "9px" }}>
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
          <div className="anim-scale-up">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
              <p className="label" style={{ color: "var(--gray-400)", fontSize: "9px", letterSpacing: "0.2em" }}>Saved Addresses</p>
              <button className="btn-ghost" style={{ fontSize: "9px" }}>
                <Plus size={13} strokeWidth={1.25} /> Add New
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
              {/* Default address */}
              <div style={{ border: "1px solid var(--black)", padding: "28px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <span className="label" style={{ fontSize: "9px", letterSpacing: "0.18em" }}>Home — Default</span>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button className="btn-ghost" style={{ padding: 0, fontSize: "10px" }}><Edit2 size={12} strokeWidth={1.25} /></button>
                    <button className="btn-ghost" style={{ padding: 0, fontSize: "10px", color: "var(--gray-400)" }}><Trash2 size={12} strokeWidth={1.25} /></button>
                  </div>
                </div>
                <p className="label" style={{ fontSize: "11px", letterSpacing: "0.06em", lineHeight: 1.9, fontWeight: 400, textTransform: "none", letterSpacing: "0.04em" }}>
                  Jane Doe<br />
                  123 Park Street<br />
                  Kolkata, West Bengal<br />
                  700 016, India
                </p>
              </div>

              {/* Work address */}
              <div style={{ border: "1px solid var(--gray-200)", padding: "28px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <span className="label" style={{ fontSize: "9px", color: "var(--gray-400)", letterSpacing: "0.18em" }}>Office</span>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button className="btn-ghost" style={{ padding: 0 }}><Edit2 size={12} strokeWidth={1.25} /></button>
                    <button className="btn-ghost" style={{ padding: 0, color: "var(--gray-400)" }}><Trash2 size={12} strokeWidth={1.25} /></button>
                  </div>
                </div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.04em", lineHeight: 1.9, color: "var(--gray-600)" }}>
                  Jane Doe<br />
                  45 MG Road, 3rd Floor<br />
                  Bengaluru, Karnataka<br />
                  560 001, India
                </p>
              </div>

              {/* Add new card */}
              <button style={{
                border: "1px dashed var(--gray-200)", padding: "28px",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: "10px", cursor: "pointer", minHeight: "160px", background: "transparent",
                transition: "border-color 0.25s ease",
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--black)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--gray-200)")}
              >
                <Plus size={20} strokeWidth={1} style={{ color: "var(--gray-400)" }} />
                <span className="label" style={{ fontSize: "9px", color: "var(--gray-400)", letterSpacing: "0.18em" }}>Add Address</span>
              </button>
            </div>
          </div>
        )}

        {/* ────── WISHLIST ────── */}
        {activeTab === "wishlist" && (
          <div className="anim-scale-up">
            <p className="label" style={{ color: "var(--gray-400)", marginBottom: "28px", fontSize: "9px", letterSpacing: "0.2em" }}>
              {wishlist.length} Saved Items
            </p>

            {wishlist.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <Heart size={28} strokeWidth={1} style={{ margin: "0 auto 16px", color: "var(--gray-200)" }} />
                <p className="label" style={{ color: "var(--gray-400)", marginBottom: "24px", fontSize: "10px" }}>Your wishlist is empty</p>
                <Link href="/products" className="btn-primary" style={{ fontSize: "9px" }}>Browse Collection</Link>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "clamp(8px,2vw,20px)" }} className="md:grid-cols-4">
                {wishlist.map((item, i) => (
                  <div key={item.id} className="group"
                    style={{
                      animation: `fadeUp 0.6s var(--ease-out-expo) ${i * 80}ms both`,
                    }}
                  >
                    <div className="product-img-wrap" style={{ aspectRatio: "3/4", position: "relative" }}>
                      <img src={item.image} alt={item.name} />
                      {/* Actions overlay */}
                      <div style={{
                        position: "absolute", inset: 0, background: "rgba(10,10,10,0)",
                        display: "flex", flexDirection: "column", justifyContent: "flex-end",
                        padding: "16px", gap: "8px",
                        transition: "background 0.35s ease",
                      }}
                        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(10,10,10,0.15)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(10,10,10,0)"; }}
                      >
                        <button className="btn-primary" style={{ fontSize: "9px", padding: "10px", opacity: 0, transition: "opacity 0.3s ease" }}
                          onMouseEnter={e => ((e.currentTarget.parentElement as HTMLElement).querySelectorAll('button').forEach(b => (b as HTMLElement).style.opacity = "1"))}
                        >
                          Add to Bag
                        </button>
                        <button
                          onClick={() => setWishlist(w => w.filter(x => x.id !== item.id))}
                          style={{
                            position: "absolute", top: "10px", right: "10px",
                            background: "rgba(250,250,250,0.9)", border: "none",
                            width: "30px", height: "30px", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}
                        >
                          <Trash2 size={12} strokeWidth={1.25} />
                        </button>
                      </div>
                    </div>
                    <div style={{ marginTop: "10px", display: "flex", justifyContent: "space-between" }}>
                      <div>
                        <p className="label" style={{ fontSize: "10px", letterSpacing: "0.12em", marginBottom: "3px" }}>{item.name}</p>
                        <p className="label" style={{ fontSize: "9px", color: "var(--gray-400)" }}>{item.category}</p>
                      </div>
                      <span className="label" style={{ fontSize: "10px" }}>$ {item.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ────── SETTINGS ────── */}
        {activeTab === "settings" && (
          <div className="anim-scale-up" style={{ maxWidth: "560px" }}>
            <p className="label" style={{ color: "var(--gray-400)", marginBottom: "36px", fontSize: "9px", letterSpacing: "0.2em" }}>
              Account Settings
            </p>

            {/* Personal Info */}
            <section style={{ marginBottom: "48px" }}>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", fontWeight: 400, marginBottom: "24px", letterSpacing: "-0.01em" }}>
                Personal Information
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
                <div>
                  <label className="label" style={{ display: "block", color: "var(--gray-400)", fontSize: "9px", marginBottom: "8px" }}>First Name</label>
                  <input defaultValue="Jane" className="input-box" />
                </div>
                <div>
                  <label className="label" style={{ display: "block", color: "var(--gray-400)", fontSize: "9px", marginBottom: "8px" }}>Last Name</label>
                  <input defaultValue="Doe" className="input-box" />
                </div>
              </div>
              <div style={{ marginBottom: "24px" }}>
                <label className="label" style={{ display: "block", color: "var(--gray-400)", fontSize: "9px", marginBottom: "8px" }}>Email Address</label>
                <input type="email" defaultValue="jane.doe@example.com" className="input-box" />
              </div>
              <div>
                <label className="label" style={{ display: "block", color: "var(--gray-400)", fontSize: "9px", marginBottom: "8px" }}>Phone</label>
                <input type="tel" defaultValue="+91 98765 43210" className="input-box" />
              </div>
            </section>

            {/* Password */}
            <section style={{ marginBottom: "48px", borderTop: "1px solid var(--gray-100)", paddingTop: "36px" }}>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", fontWeight: 400, marginBottom: "24px" }}>
                Password
              </h2>
              <div style={{ marginBottom: "16px" }}>
                <label className="label" style={{ display: "block", color: "var(--gray-400)", fontSize: "9px", marginBottom: "8px" }}>Current Password</label>
                <input type="password" placeholder="••••••••" className="input-box" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label className="label" style={{ display: "block", color: "var(--gray-400)", fontSize: "9px", marginBottom: "8px" }}>New Password</label>
                  <input type="password" placeholder="••••••••" className="input-box" />
                </div>
                <div>
                  <label className="label" style={{ display: "block", color: "var(--gray-400)", fontSize: "9px", marginBottom: "8px" }}>Confirm Password</label>
                  <input type="password" placeholder="••••••••" className="input-box" />
                </div>
              </div>
            </section>

            {/* Preferences */}
            <section style={{ marginBottom: "48px", borderTop: "1px solid var(--gray-100)", paddingTop: "36px" }}>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", fontWeight: 400, marginBottom: "24px" }}>
                Communication Preferences
              </h2>
              {[
                { label: "New arrivals & drops", checked: true },
                { label: "Order updates & tracking", checked: true },
                { label: "Exclusive member offers", checked: false },
                { label: "Style edits & lookbooks", checked: true },
              ].map((pref) => (
                <label key={pref.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid var(--gray-100)", cursor: "pointer" }}>
                  <span className="label" style={{ fontSize: "10px", letterSpacing: "0.12em" }}>{pref.label}</span>
                  <input
                    type="checkbox"
                    defaultChecked={pref.checked}
                    style={{ width: "16px", height: "16px", accentColor: "var(--black)", cursor: "pointer" }}
                  />
                </label>
              ))}
            </section>

            {/* Actions */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button className="btn-primary" style={{ fontSize: "10px" }}>Save Changes</button>
              <button className="btn-ghost" style={{ fontSize: "10px", color: "var(--gray-400)" }}>Cancel</button>
            </div>

            {/* Danger zone */}
            <div style={{ marginTop: "48px", paddingTop: "28px", borderTop: "1px solid var(--gray-100)" }}>
              <p className="label" style={{ color: "var(--gray-400)", fontSize: "9px", marginBottom: "12px" }}>Danger Zone</p>
              <button className="btn-ghost" style={{ fontSize: "10px", color: "#c0392b" }}>Delete Account</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}