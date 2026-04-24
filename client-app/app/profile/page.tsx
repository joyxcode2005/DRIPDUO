"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Package, MapPin, Heart, Settings, LogOut, ChevronRight } from "lucide-react";

type Tab = "orders" | "addresses" | "wishlist" | "settings";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("orders");

  return (
    <div className="min-h-screen bg-[#050505] text-[#f8f8f8] pt-24 pb-20 selection:bg-[#C5A059] selection:text-black">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row gap-12 md:gap-24">
        
        {/* Left Navigation (Sidebar on Desktop, Horizontal Scroll on Mobile) */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="mb-12">
            <h1 className="text-3xl font-light uppercase tracking-[0.2em] mb-2">My Profile</h1>
            <span className="text-zinc-500 text-xs font-mono tracking-widest">MEMBER SINCE 2026</span>
          </div>

          <div className="flex md:flex-col overflow-x-auto scrollbar-hide gap-2 md:gap-4 pb-4 md:pb-0 border-b md:border-b-0 border-white/5 md:border-transparent">
            <NavButton active={activeTab === "orders"} onClick={() => setActiveTab("orders")} icon={<Package />} label="Order History" />
            <NavButton active={activeTab === "addresses"} onClick={() => setActiveTab("addresses")} icon={<MapPin />} label="Addresses" />
            <NavButton active={activeTab === "wishlist"} onClick={() => setActiveTab("wishlist")} icon={<Heart />} label="Wishlist" />
            <NavButton active={activeTab === "settings"} onClick={() => setActiveTab("settings")} icon={<Settings />} label="Settings" />
            
            <div className="hidden md:block w-full h-px bg-white/5 my-4"></div>
            <button className="flex items-center gap-4 p-4 text-zinc-500 hover:text-red-500 transition-colors w-full text-left">
              <LogOut className="w-4 h-4" />
              <span className="text-xs uppercase tracking-[0.2em] font-medium whitespace-nowrap">Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 min-h-[50vh]">
          {activeTab === "orders" && <OrdersContent />}
          {activeTab === "addresses" && <AddressesContent />}
          {activeTab === "wishlist" && <WishlistContent />}
          {activeTab === "settings" && <SettingsContent />}
        </main>
      </div>
    </div>
  );
}

/* --- SUBCOMPONENTS FOR CLEAN CODE --- */

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex items-center justify-between p-4 w-full text-left transition-all duration-300 border-b md:border-b-0 md:border-l-2 whitespace-nowrap ${
      active ? "border-[#C5A059] bg-[#C5A059]/5 text-[#C5A059]" : "border-transparent text-zinc-500 hover:text-white hover:bg-white/5"
    }`}
  >
    <div className="flex items-center gap-4">
      <div className="w-4 h-4">{icon}</div>
      <span className="text-xs uppercase tracking-[0.2em] font-medium">{label}</span>
    </div>
    <ChevronRight className={`w-4 h-4 hidden md:block transition-transform duration-300 ${active ? "opacity-100 translate-x-1" : "opacity-0 -translate-x-2"}`} />
  </button>
);

const OrdersContent = () => (
  <div className="animate-in fade-in duration-700">
    <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-white border-b border-white/10 pb-4 mb-8">Recent Orders</h2>
    <div className="space-y-6">
      {/* Mock Order Item */}
      <div className="border border-white/5 bg-[#0a0a0a] p-6 flex flex-col md:flex-row justify-between gap-6 hover:border-white/20 transition-colors">
        <div className="flex gap-6">
          <div className="w-20 h-24 bg-zinc-900 overflow-hidden relative">
            <Image
              src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&q=80"
              alt="Item"
              fill
              className="object-cover grayscale opacity-80"
              priority
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[#C5A059] text-[10px] uppercase tracking-widest mb-1">Delivered • Oct 12, 2026</span>
            <h3 className="text-sm font-medium uppercase tracking-widest text-white mb-2">Gothic Skull Premium</h3>
            <span className="text-xs font-mono text-zinc-500">Order #DRIP-99482</span>
          </div>
        </div>
        <div className="flex md:flex-col justify-between items-end">
          <span className="text-sm font-mono text-white">$145.00</span>
          <button className="text-xs uppercase tracking-[0.2em] text-zinc-400 hover:text-white border-b border-zinc-600 hover:border-white transition-all pb-1">View Details</button>
        </div>
      </div>
    </div>
  </div>
);

const AddressesContent = () => (
  <div className="animate-in fade-in duration-700">
    <div className="flex justify-between items-end border-b border-white/10 pb-4 mb-8">
      <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-white">Saved Addresses</h2>
      <button className="text-[#C5A059] text-[10px] uppercase tracking-widest hover:text-white transition-colors">+ Add New</button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="border border-[#C5A059] bg-[#C5A059]/5 p-6 relative">
        <span className="absolute top-6 right-6 text-[9px] uppercase tracking-widest text-[#C5A059] border border-[#C5A059] px-2 py-1">Default</span>
        <h3 className="text-sm uppercase tracking-widest mb-4">Jane Doe</h3>
        <p className="text-xs text-zinc-400 font-mono leading-relaxed uppercase">123 Underground Ave<br/>Brutalist District<br/>New York, NY 10012<br/>United States</p>
        <div className="mt-6 flex gap-4">
          <button className="text-[10px] text-white uppercase tracking-widest hover:text-[#C5A059]">Edit</button>
          <button className="text-[10px] text-zinc-600 uppercase tracking-widest hover:text-red-500">Remove</button>
        </div>
      </div>
    </div>
  </div>
);

const WishlistContent = () => (
  <div className="animate-in fade-in duration-700">
    <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-white border-b border-white/10 pb-4 mb-8">Curated Wishlist</h2>
    <div className="w-full h-64 flex flex-col items-center justify-center border border-dashed border-white/10 text-zinc-600 bg-[#0a0a0a]">
      <Heart className="w-6 h-6 mb-4 opacity-50" />
      <span className="text-xs font-medium uppercase tracking-widest mb-2">Your wishlist is empty</span>
      <p className="font-mono text-[10px] uppercase text-zinc-500">Save pieces to your personal archive.</p>
    </div>
  </div>
);

const SettingsContent = () => (
  <div className="animate-in fade-in duration-700 max-w-xl">
    <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-white border-b border-white/10 pb-4 mb-8">Account Settings</h2>
    <form className="space-y-6">
      <div className="flex flex-col gap-2">
        <label className="text-[10px] text-zinc-500 uppercase tracking-widest">Full Name</label>
        <input type="text" defaultValue="Jane Doe" className="bg-[#0a0a0a] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C5A059] transition-colors" />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[10px] text-zinc-500 uppercase tracking-widest">Email Address</label>
        <input type="email" defaultValue="jane.doe@example.com" className="bg-[#0a0a0a] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C5A059] transition-colors" />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[10px] text-zinc-500 uppercase tracking-widest">Password</label>
        <input type="password" value="********" readOnly className="bg-[#0a0a0a] border border-white/10 px-4 py-3 text-sm text-zinc-500 cursor-not-allowed" />
        <button type="button" className="text-[10px] text-[#C5A059] uppercase tracking-widest text-left mt-1 hover:text-white">Request Password Reset</button>
      </div>
      <button type="button" className="mt-8 bg-white text-black text-xs uppercase tracking-widest font-black py-4 px-8 hover:bg-[#C5A059] transition-colors duration-300">
        Save Changes
      </button>
    </form>
  </div>
);