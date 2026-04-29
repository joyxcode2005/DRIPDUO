"use client";

import React, { useState } from "react";
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

const StatusBadge = ({ status }: { status: string }) => {
  const isDelivered = status === "delivered";
  const isProcessing = status === "processing";
  
  return (
    <span className={`font-sans text-[9px] font-semibold tracking-[0.15em] uppercase px-3 py-1 border ${
      isDelivered ? "bg-(--beige) text-(--black) border-(--beige)" : 
      isProcessing ? "bg-(--orange) text-(--black) border-(--orange)" : 
      "bg-transparent text-(--beige) border-(--beige)"
    }`}>
      {status}
    </span>
  );
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("orders");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState(MOCK_WISHLIST);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "orders",    label: "Orders",    icon: <Package size={14} strokeWidth={1} /> },
    { id: "addresses", label: "Addresses", icon: <MapPin size={14} strokeWidth={1} /> },
    { id: "wishlist",  label: "Wishlist",  icon: <Heart size={14} strokeWidth={1} /> },
    { id: "settings",  label: "Settings",  icon: <Settings size={14} strokeWidth={1} /> },
  ];

  return (
    <div className="bg-(--black) min-h-screen text-(--beige) pt-24 font-sans">

      {/* ── PAGE HEADER ── */}
      <div className="px-6 md:px-12 pb-12 border-b border-(--gray-800)">
        <Link href="/" className="inline-flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.2em] text-(--beige) hover:text-(--orange) transition-colors mb-12">
          <ArrowLeft size={14} strokeWidth={1} /> Back to store
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-(--orange) mb-4">
              Member since 2026
            </p>
            <h1 className="font-serif text-[clamp(3rem,8vw,6rem)] leading-[0.9] text-(--beige)">
              My Account
            </h1>
          </div>

          <button className="flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.2em] text-(--gray-400) hover:text-(--orange) transition-colors">
            <LogOut size={14} strokeWidth={1} />
            Sign Out
          </button>
        </div>

        {/* TABS */}
        <div className="flex overflow-x-auto no-scroll mt-16 gap-8 md:gap-16 border-b border-(--gray-900)">
          {tabs.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-3 font-sans text-[10px] uppercase tracking-[0.2em] pb-4 border-b-2 transition-colors ${
                activeTab === id ? "border-(--orange) text-(--orange)" : "border-transparent text-(--gray-400) hover:text-(--beige)"
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
            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-(--orange) mb-8">
              {MOCK_ORDERS.length} Orders
            </p>

            <div className="flex flex-col border-t border-(--gray-800)">
              {MOCK_ORDERS.map((order) => (
                <div key={order.id} className="border-b border-(--gray-800) bg-(--black)">
                  {/* Order header */}
                  <button
                    className="w-full flex items-center justify-between py-8 group transition-colors"
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  >
                    <div className="flex items-center gap-8 md:gap-16 flex-wrap">
                      <div className="text-left">
                        <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-(--beige) group-hover:text-(--orange) mb-2 transition-colors">#{order.id}</p>
                        <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-(--gray-400)">{order.date}</p>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="font-sans text-[11px] tracking-[0.1em] text-(--beige)">$ {order.total}</span>
                      <ChevronRight
                        size={16} strokeWidth={1}
                        className={`text-(--gray-400) transition-transform duration-500 ${expandedOrder === order.id ? "rotate-90 text-(--orange)" : ""}`}
                      />
                    </div>
                  </button>

                  {/* Expanded items */}
                  <div className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${expandedOrder === order.id ? "max-h-[800px] opacity-100 mb-8" : "max-h-0 opacity-0"}`}>
                    <div className="pt-8 border-t border-(--gray-900)">
                      <div className="flex flex-col gap-6 mb-8">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex gap-6 items-center">
                            <div className="w-20 shrink-0 bg-(--gray-900) aspect-[2/3] overflow-hidden">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-(--beige) mb-2">{item.name}</p>
                              <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-(--gray-400)">Size: {item.size} &nbsp;·&nbsp; Qty: {item.qty}</p>
                            </div>
                            <span className="font-sans text-[11px] tracking-[0.1em] text-(--orange)">$ {item.price}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-4">
                        <button className="border border-(--beige) text-(--beige) font-sans text-[9px] uppercase tracking-[0.2em] px-8 py-3 hover:bg-(--beige) hover:text-(--black) transition-colors flex items-center gap-2">
                          <Eye size={12} strokeWidth={1} /> Track Order
                        </button>
                        <button className="text-(--gray-400) font-sans text-[9px] uppercase tracking-[0.2em] px-4 hover:text-(--orange) transition-colors">
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
              <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-(--orange)">Saved Addresses</p>
              <button className="flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.2em] text-(--beige) hover:text-(--orange) transition-colors">
                <Plus size={14} strokeWidth={1} /> Add New
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Default address */}
              <div className="border border-(--beige) p-8 bg-(--gray-900)">
                <div className="flex justify-between items-start mb-6">
                  <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-(--beige)">Home — Default</span>
                  <div className="flex gap-4">
                    <button className="text-(--beige) hover:text-(--orange) transition-colors"><Edit2 size={14} strokeWidth={1} /></button>
                    <button className="text-(--gray-400) hover:text-(--orange) transition-colors"><Trash2 size={14} strokeWidth={1} /></button>
                  </div>
                </div>
                <p className="font-sans text-[11px] tracking-[0.05em] leading-loose text-(--gray-200)">
                  Jane Doe<br />
                  123 Park Street<br />
                  Kolkata, West Bengal<br />
                  700 016, India
                </p>
              </div>

              {/* Work address */}
              <div className="border border-(--gray-800) p-8 bg-(--black)">
                <div className="flex justify-between items-start mb-6">
                  <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-(--gray-400)">Office</span>
                  <div className="flex gap-4">
                    <button className="text-(--beige) hover:text-(--orange) transition-colors"><Edit2 size={14} strokeWidth={1} /></button>
                    <button className="text-(--gray-400) hover:text-(--orange) transition-colors"><Trash2 size={14} strokeWidth={1} /></button>
                  </div>
                </div>
                <p className="font-sans text-[11px] tracking-[0.05em] leading-loose text-(--gray-400)">
                  Jane Doe<br />
                  45 MG Road, 3rd Floor<br />
                  Bengaluru, Karnataka<br />
                  560 001, India
                </p>
              </div>

              {/* Add new card */}
              <button className="border border-dashed border-(--gray-600) p-8 flex flex-col items-center justify-center gap-4 min-h-[200px] text-(--gray-400) hover:text-(--orange) hover:border-(--orange) transition-colors group">
                <Plus size={24} strokeWidth={1} className="group-hover:scale-110 transition-transform" />
                <span className="font-sans text-[10px] uppercase tracking-[0.2em]">Add Address</span>
              </button>
            </div>
          </div>
        )}

        {/* ────── WISHLIST ────── */}
        {activeTab === "wishlist" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-(--orange) mb-8">
              {wishlist.length} Saved Items
            </p>

            {wishlist.length === 0 ? (
              <div className="text-center py-32 border border-(--gray-800)">
                <Heart size={28} strokeWidth={1} className="mx-auto mb-6 text-(--gray-400)" />
                <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-(--gray-400) mb-8">Your wishlist is empty</p>
                <Link href="/products" className="border-b border-(--beige) pb-1 font-sans text-[10px] uppercase tracking-[0.2em] text-(--beige) hover:text-(--orange) hover:border-(--orange) transition-colors">
                  Browse Collection
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 w-full border-t border-l border-(--gray-800)">
                {wishlist.map((item, i) => (
                  <div key={item.id} className="group relative border-r border-b border-(--gray-800) bg-(--gray-900) overflow-hidden">
                    <div className="relative w-full aspect-[2/3]">
                      <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
                      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                      
                      {/* Delete Button */}
                      <button
                        onClick={() => setWishlist(w => w.filter(x => x.id !== item.id))}
                        className="absolute top-4 right-4 bg-(--black) text-(--beige) p-2 hover:text-(--orange) transition-colors z-20"
                      >
                        <Trash2 size={14} strokeWidth={1} />
                      </button>

                      <div className="absolute bottom-6 left-4 right-4 z-10 pointer-events-none">
                        <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-(--beige) mb-1">{item.name}</p>
                        <div className="flex justify-between items-center">
                          <p className="font-sans text-[9px] tracking-[0.15em] uppercase text-(--gray-400)">{item.category}</p>
                          <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-(--beige)">${item.price}</p>
                        </div>
                      </div>

                      {/* Quick Add Slide-Up */}
                      <button className="absolute bottom-0 left-0 right-0 bg-(--orange) text-(--black) py-4 font-sans text-[11px] font-bold uppercase tracking-[0.15em] transition-transform duration-300 translate-y-full group-hover:translate-y-0 z-20">
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
            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-(--orange) mb-12">
              Account Settings
            </p>

            {/* Personal Info */}
            <section className="mb-16">
              <h2 className="font-serif text-3xl mb-8 text-(--beige)">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <label className="font-sans text-[9px] uppercase tracking-[0.2em] text-(--gray-400) mb-4 block">First Name</label>
                  <input defaultValue="Jane" className="w-full bg-transparent border-b border-(--gray-600) py-3 font-sans text-[12px] tracking-[0.1em] text-(--beige) focus:outline-none focus:border-(--orange) transition-colors" />
                </div>
                <div>
                  <label className="font-sans text-[9px] uppercase tracking-[0.2em] text-(--gray-400) mb-4 block">Last Name</label>
                  <input defaultValue="Doe" className="w-full bg-transparent border-b border-(--gray-600) py-3 font-sans text-[12px] tracking-[0.1em] text-(--beige) focus:outline-none focus:border-(--orange) transition-colors" />
                </div>
              </div>
              <div className="mb-8">
                <label className="font-sans text-[9px] uppercase tracking-[0.2em] text-(--gray-400) mb-4 block">Email Address</label>
                <input type="email" defaultValue="jane.doe@example.com" className="w-full bg-transparent border-b border-(--gray-600) py-3 font-sans text-[12px] tracking-[0.1em] text-(--beige) focus:outline-none focus:border-(--orange) transition-colors" />
              </div>
              <div>
                <label className="font-sans text-[9px] uppercase tracking-[0.2em] text-(--gray-400) mb-4 block">Phone</label>
                <input type="tel" defaultValue="98765 43210" className="w-full bg-transparent border-b border-(--gray-600) py-3 font-sans text-[12px] tracking-[0.1em] text-(--beige) focus:outline-none focus:border-(--orange) transition-colors" />
              </div>
            </section>

            {/* Password */}
            <section className="mb-16 pt-12 border-t border-(--gray-800)">
              <h2 className="font-serif text-3xl mb-8 text-(--beige)">Password</h2>
              <div className="mb-8">
                <label className="font-sans text-[9px] uppercase tracking-[0.2em] text-(--gray-400) mb-4 block">Current Password</label>
                <input type="password" placeholder="••••••••" className="w-full bg-transparent border-b border-(--gray-600) py-3 font-sans text-[12px] tracking-[0.1em] text-(--beige) focus:outline-none focus:border-(--orange) transition-colors" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="font-sans text-[9px] uppercase tracking-[0.2em] text-(--gray-400) mb-4 block">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-transparent border-b border-(--gray-600) py-3 font-sans text-[12px] tracking-[0.1em] text-(--beige) focus:outline-none focus:border-(--orange) transition-colors" />
                </div>
                <div>
                  <label className="font-sans text-[9px] uppercase tracking-[0.2em] text-(--gray-400) mb-4 block">Confirm Password</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-transparent border-b border-(--gray-600) py-3 font-sans text-[12px] tracking-[0.1em] text-(--beige) focus:outline-none focus:border-(--orange) transition-colors" />
                </div>
              </div>
            </section>

            {/* Actions */}
            <div className="flex gap-6 pt-8">
              <button className="bg-(--beige) text-(--black) font-sans text-[10px] font-bold uppercase tracking-[0.2em] px-10 py-5 hover:bg-(--orange) transition-colors">
                Save Changes
              </button>
              <button className="text-(--gray-400) font-sans text-[10px] uppercase tracking-[0.2em] hover:text-(--beige) transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}