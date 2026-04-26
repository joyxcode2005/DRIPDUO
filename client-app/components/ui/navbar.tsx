"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { Search, User, Menu, X, ArrowRight } from "lucide-react";

export const Navbar = () => {
  const { cart, openCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Lock body scroll when search or menu is open
  useEffect(() => {
    if (isSearchOpen || isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isSearchOpen, isMobileMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // Redirect to products page with search query (implementation for routing)
    window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-[80] bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between px-6 py-4 md:px-12">
          
          {/* Left: Mobile Menu Trigger & Search */}
          <div className="flex items-center gap-6 flex-1">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-white hover:text-[#C5A059] transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <button onClick={() => setIsSearchOpen(true)} className="hidden md:flex text-zinc-400 hover:text-white transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Center: Brand Logo */}
          <Link href="/" className="text-xl md:text-2xl font-light uppercase tracking-[0.3em] flex-1 text-center hover:text-[#C5A059] transition-colors duration-500">
            Dripduo
          </Link>

          {/* Right: Profile & Cart */}
          <div className="flex items-center justify-end gap-6 flex-1">
            <Link href="/profile" className="hidden md:flex text-zinc-400 hover:text-white transition-colors">
              <User className="w-4 h-4" />
            </Link>
            <button onClick={openCart} className="relative text-white hover:text-[#C5A059] transition-colors flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] hidden md:block">Cart</span>
              <div className="w-2 h-2 bg-[#C5A059] rounded-full mb-2"></div>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-3 text-[9px] font-mono bg-[#f8f8f8] text-[#050505] w-4 h-4 flex items-center justify-center rounded-full">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* --- PREMIUM SEARCH OVERLAY --- */}
      <div className={`fixed inset-0 bg-[#050505]/95 backdrop-blur-xl z-[100] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col ${isSearchOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        <div className="w-full max-w-5xl mx-auto px-6 pt-24 md:pt-32 flex flex-col h-full">
          <div className="flex justify-between items-center mb-12">
            <span className="text-[#C5A059] text-[10px] uppercase tracking-[0.3em] font-bold">Search Archive</span>
            <button onClick={() => setIsSearchOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
              <X className="w-8 h-8" />
            </button>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative group">
            <input 
              type="text" 
              placeholder="WHAT ARE YOU LOOKING FOR?" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b-2 border-white/20 pb-4 text-2xl md:text-5xl font-light uppercase tracking-widest text-white placeholder-white/20 focus:outline-none focus:border-[#C5A059] transition-colors"
              autoFocus={isSearchOpen}
            />
            <button type="submit" className="absolute right-0 bottom-4 text-white/50 group-hover:text-[#C5A059] transition-colors">
              <ArrowRight className="w-8 h-8 md:w-12 md:h-12" />
            </button>
          </form>

          <div className="mt-16">
            <span className="text-zinc-600 text-[10px] uppercase tracking-[0.2em] block mb-6">Trending Searches</span>
            <div className="flex flex-wrap gap-4">
              {["Heavyweight Oversized", "Washed Denim", "Tokyo Drift Silk", "FW26 Core"].map((term) => (
                <button 
                  key={term}
                  onClick={() => { setSearchQuery(term); handleSearchSubmit({ preventDefault: () => {} } as React.FormEvent); }}
                  className="px-6 py-3 border border-white/10 text-zinc-400 text-xs font-mono uppercase tracking-widest hover:border-[#C5A059] hover:text-[#C5A059] transition-all"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- MOBILE FULL-SCREEN MENU --- */}
      <div className={`fixed inset-0 bg-[#050505] z-[110] transform transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col ${isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="flex justify-end p-6">
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-zinc-500 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex flex-col items-center justify-center flex-1 space-y-8">
          <button 
            onClick={() => { setIsMobileMenuOpen(false); setIsSearchOpen(true); }}
            className="text-3xl font-light uppercase tracking-[0.2em] text-white hover:text-[#C5A059] transition-colors"
          >
            Search
          </button>
          {["Archive", "Lookbook", "Profile"].map((item) => (
            <Link 
              key={item} 
              href={item === "Archive" ? "/products" : `/${item.toLowerCase()}`}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-3xl font-light uppercase tracking-[0.2em] text-white hover:text-[#C5A059] transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};