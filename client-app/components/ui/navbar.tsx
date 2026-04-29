"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { Search, X, User, ShoppingBag, Menu } from "lucide-react";
import { NAV_LINKS } from "@/constants";


export const Navbar = () => {
  const { cart, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when overlays are open
  useEffect(() => {
    if (searchOpen || menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [searchOpen, menuOpen]);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <>
      {/* ── MAIN NAVBAR ── */}
      <nav
        className={`fixed top-0 left-0 w-full z-100 transition-all duration-500 ease-in-out ${scrolled ? "bg-[#050505]/95 backdrop-blur-md py-4 border-b border-white/5" : "bg-transparent p-5" 
          }`}
        style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
      >
        {/* Added lg:px-20 and md:px-12 for wide side margins */}
        <div className="flex items-center justify-end px-6 md:px-12 lg:px-12 h-10">

          {/* LEFT SIDE: Hamburger (mobile) & Links (desktop) */}
          <div className="flex items-center gap-2 flex-1">
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-(--beige) hover:text-(--orange) transition-colors"
              aria-label="Menu"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>

            <div className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link}
                  href="/products"
                  className="relative text-(--beige) hover:text-(--orange) [text-shadow:0_1px_2px_rgba(0,0,0)] transition-colors uppercase tracking-[0.15em] text-[10px] font-medium group hover:text-shadow:0_2px_4px_rgba(255,0,0,1) hover:underline-offset-4"
                >
                  {link}
                  {/* Subtle hover underline effect */}
                  <span className="absolute -bottom-1.5 left-0 w-0 h-px bg-(--orange) transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>
          </div>

          {/* CENTER: Absolute Logo */}
          <Link
            href="/"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-(--beige) hover:text-(--orange) transition-colors z-10"
          >
            <span style={{ fontSize: "22px", fontWeight: "900", letterSpacing: "0.2em", textTransform: "uppercase" }}>
              DRIPDUO
            </span>
          </Link>

          {/* RIGHT SIDE: Icons */}
          <div className="flex items-center gap-5 flex-1 justify-end text-(--beige)">
            <button onClick={() => setSearchOpen(true)} className="hover:text-(--orange) transition-transform hover:scale-110 duration-300">
              <Search size={20} strokeWidth={1.5} />
            </button>
            <Link href="/profile" className="hover:text-(--orange) transition-transform hover:scale-110 duration-300 hidden md:block">
              <User size={20} strokeWidth={1.5} />
            </Link>
            <button onClick={openCart} className="hover:text-(--orange) transition-transform hover:scale-110 duration-300 relative">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -bottom-1.5 -right-2 w-4 h-4 bg-(--orange) text-[#050505] rounded-full flex items-center justify-center font-bold text-[9px] shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* ── SEARCH OVERLAY ── */}
      <div
        className={`fixed inset-0 bg-[#050505]/98 backdrop-blur-xl z-200 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${searchOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
          }`}
      >
        <div className="flex items-center justify-between h-20 px-4 md:px-8 border-b border-white/10 text-(--beige)">
          <span className="uppercase tracking-[0.2em] text-[10px] font-medium">Search Archive</span>
          <button onClick={() => setSearchOpen(false)} className="p-2 -mr-2 hover:text-(--orange) hover:rotate-90 transition-all duration-300">
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* Animated content wrapper */}
        <div className={`flex-1 flex flex-col px-4 md:px-8 pt-16 transition-all duration-700 delay-100 ${searchOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
                setSearchOpen(false);
              }
            }}
            className="relative"
          >
            <input
              autoFocus={searchOpen}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="w-full text-3xl md:text-5xl bg-transparent border-0 border-b border-(--gray-800) text-(--beige) outline-none pb-4 focus:border-(--orange) placeholder:text-(--gray-600) transition-colors"
              style={{ fontFamily: "'EB Garamond', Georgia, serif", fontWeight: 400 }}
            />
          </form>

          <div className="mt-16">
            <p className="uppercase tracking-[0.2em] text-(--orange) mb-6 text-[10px] font-medium">Trending Queries</p>
            <div className="flex flex-wrap gap-3">
              {["Oversized Tee", "Gothic", "Anime Collection", "Heavyweight", "FW26"].map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setSearchQuery(t);
                    window.location.href = `/products?search=${encodeURIComponent(t)}`;
                    setSearchOpen(false);
                  }}
                  className="border border-white/20 text-(--beige) px-5 py-2.5 uppercase tracking-widest text-[10px] hover:border-(--orange) hover:bg-(--orange) hover:text-[#050505] transition-all duration-300"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE MENU OVERLAY ── */}
      <div
        className={`fixed inset-0 bg-[#050505] z-200 flex flex-col lg:hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
          }`}
      >
        <div className="flex items-center justify-between h-20 px-4 border-b border-white/10 text-(--beige)">
          <span className="uppercase tracking-[0.2em] text-[10px] font-medium">Menu</span>
          <button onClick={() => setMenuOpen(false)} className="p-2 -mr-2 hover:text-(--orange) hover:rotate-90 transition-all duration-300">
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* Animated content wrapper */}
        <div className={`flex-1 px-6 pt-12 overflow-y-auto pb-24 transition-all duration-700 delay-100 ${menuOpen ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}>
          {NAV_LINKS.map((link, index) => (
            <Link
              key={link}
              href="/products"
              onClick={() => setMenuOpen(false)}
              className="block py-4 border-b border-white/5 text-(--beige) hover:text-(--orange) hover:pl-4 transition-all duration-300"
              style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "32px", transitionDelay: `${index * 50}ms` }}
            >
              {link}
            </Link>
          ))}

          <div className="mt-12 space-y-4">
            <Link href="/profile" onClick={() => setMenuOpen(false)} className="uppercase tracking-[0.15em] block text-[11px] text-(--gray-200) hover:text-(--orange) transition-colors">
              My Account
            </Link>
            <Link href="/checkout" onClick={() => setMenuOpen(false)} className="uppercase tracking-[0.15em] block text-[11px] text-(--gray-200) hover:text-(--orange) transition-colors">
              Orders & Returns
            </Link>
            <button onClick={() => { setMenuOpen(false); setSearchOpen(true); }} className="uppercase tracking-[0.15em] block text-[11px] text-(--gray-200) hover:text-(--orange) transition-colors">
              Search Archive
            </button>
          </div>
        </div>
      </div>
    </>
  );
};