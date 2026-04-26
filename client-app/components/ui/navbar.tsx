"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { Search, User, X, ArrowRight } from "lucide-react";

export const Navbar = () => {
  const { cart, openCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Handle scroll for transparent -> solid background transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when search is open (with strict cleanup to prevent freezing)
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // Redirect to products page with search query
    window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <>
      {/* --- TOP HEADER (App-like & Minimal on Mobile) --- */}
      <header 
        className={`fixed top-0 w-full z-[80] transition-all duration-300 ${
          isScrolled || isSearchOpen ? "bg-[#050505]/90 backdrop-blur-lg border-b border-white/5" : "bg-transparent border-transparent"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 md:px-12">
          
          {/* Left: Mobile spacer, Desktop Search */}
          <div className="flex-1 flex items-center gap-6">
            <div className="w-6 h-6 md:hidden"></div> {/* Spacer to keep logo perfectly centered on mobile */}
            <button 
              onClick={() => setIsSearchOpen(true)} 
              className="hidden md:flex text-zinc-400 hover:text-white transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Center: Brand Logo */}
          <Link 
            href="/" 
            className="text-xl md:text-2xl font-light uppercase tracking-[0.3em] flex-1 text-center text-[#f8f8f8] active:text-[#C5A059] md:hover:text-[#C5A059] transition-colors duration-300"
          >
            Dripduo
          </Link>

          {/* Right: Desktop Cart/Profile */}
          <div className="flex-1 flex items-center justify-end gap-6">
            <div className="w-6 h-6 md:hidden"></div> {/* Spacer for mobile */}
            <Link href="/profile" className="hidden md:flex text-zinc-400 hover:text-white transition-colors">
              <User className="w-5 h-5" />
            </Link>
            <button onClick={openCart} className="hidden md:flex relative text-white hover:text-[#C5A059] transition-colors items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em]">Cart</span>
              <div className="w-2 h-2 bg-[#C5A059] rounded-full mb-2"></div>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-3 text-[9px] font-mono bg-[#f8f8f8] text-[#050505] w-4 h-4 flex items-center justify-center rounded-full">
                  {cart.length}
                </span>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* --- PREMIUM SEARCH OVERLAY --- */}
      <div 
        className={`fixed inset-0 bg-[#050505]/95 backdrop-blur-xl z-[100] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col ${
          isSearchOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
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
              className="w-full bg-transparent border-b-2 border-white/20 pb-4 text-xl md:text-5xl font-light uppercase tracking-widest text-white placeholder-white/20 focus:outline-none focus:border-[#C5A059] transition-colors"
              autoFocus={isSearchOpen}
            />
            <button type="submit" className="absolute right-0 bottom-4 text-white/50 group-hover:text-[#C5A059] transition-colors">
              <ArrowRight className="w-8 h-8 md:w-12 md:h-12" />
            </button>
          </form>

          <div className="mt-16">
            <span className="text-zinc-600 text-[10px] uppercase tracking-[0.2em] block mb-6">Trending Searches</span>
            <div className="flex flex-wrap gap-3 md:gap-4">
              {["Heavyweight Oversized", "Washed Denim", "Tokyo Drift Silk", "FW26 Core"].map((term) => (
                <button 
                  key={term}
                  onClick={() => { setSearchQuery(term); handleSearchSubmit({ preventDefault: () => {} } as React.FormEvent); }}
                  className="px-4 py-2 md:px-6 md:py-3 border border-white/10 text-zinc-400 text-[10px] md:text-xs font-mono uppercase tracking-widest hover:border-[#C5A059] hover:text-[#C5A059] transition-all"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};