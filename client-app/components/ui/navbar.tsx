"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { Search, X, User, ShoppingBag } from "lucide-react";

const NAV_LINKS = ["Woman", "Man", "Kids", "Beauty", "Sport", "Home"];

export const Navbar = () => {
  const { cart, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <>
      <nav className={scrolled ? "scrolled" : ""} style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
        <div className="flex items-center justify-between h-14 px-4 md:px-8">
          
          {/* LEFT SIDE: Hamburger (mobile/tablet) & Links (desktop) */}
          <div className="flex items-center gap-6 flex-1">
            <button onClick={() => setMenuOpen(true)} className="lg:hidden flex flex-col gap-1 p-1" aria-label="Menu">
              <span className="w-5 h-px bg-[var(--beige)] block" />
              <span className="w-5 h-px bg-[var(--beige)] block" />
              <span className="w-5 h-px bg-[var(--beige)] block" />
            </button>

            <div className="hidden lg:flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <Link key={link} href="/products" className="label line-hover text-[var(--beige)] hover:text-[var(--orange)] transition-colors" style={{ fontSize: "11px", letterSpacing: "0.12em" }}>
                  {link}
                </Link>
              ))}
            </div>
          </div>

          {/* CENTER: Absolute Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center text-[var(--beige)] hover:text-[var(--orange)] transition-colors">
            <span style={{ fontSize: "20px", fontWeight: "400", letterSpacing: "0.25em", textTransform: "uppercase" }}>
              DRIPDUO
            </span>
          </Link>

          {/* RIGHT SIDE: Icons */}
          <div className="flex items-center gap-4 flex-1 justify-end text-[var(--beige)]">
            <button onClick={() => setSearchOpen(true)} className="p-1 hover:text-[var(--orange)] transition-colors">
              <Search size={18} strokeWidth={1.5} />
            </button>
            <Link href="/profile" className="p-1 hover:text-[var(--orange)] transition-colors hidden lg:block">
              <User size={18} strokeWidth={1.5} />
            </Link>
            <button onClick={openCart} className="p-1 hover:text-[var(--orange)] transition-colors relative">
              <ShoppingBag size={18} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--orange)] text-[var(--black)] rounded-full flex items-center justify-center font-bold" style={{ fontSize: "9px" }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* SEARCH OVERLAY */}
      <div className="fixed inset-0 bg-[var(--black)] z-[150] flex flex-col" style={{ opacity: searchOpen ? 1 : 0, visibility: searchOpen ? "visible" : "hidden", transition: "opacity 0.3s ease" }}>
        <div className="flex items-center justify-between h-14 px-4 md:px-8 border-b border-[var(--gray-800)] text-[var(--beige)]">
          <span className="label text-[var(--beige)]" style={{ fontSize: "11px", letterSpacing: "0.12em" }}>Search</span>
          <button onClick={() => setSearchOpen(false)} className="hover:text-[var(--orange)]">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>
        <div className="flex-1 flex flex-col px-4 md:px-8 pt-12">
          <form onSubmit={(e) => { e.preventDefault(); if (searchQuery.trim()) { window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`; setSearchOpen(false); } }}>
            <input autoFocus={searchOpen} type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search for products..." className="w-full text-2xl md:text-4xl bg-transparent border-0 border-b border-[var(--gray-600)] text-[var(--beige)] outline-none pb-4 focus:border-[var(--orange)] placeholder:text-[var(--gray-600)] transition-colors" style={{ fontFamily: "'EB Garamond', Georgia, serif", fontWeight: 400 }} />
          </form>
          <div className="mt-12">
            <p className="label text-[var(--orange)] mb-6" style={{ fontSize: "10px" }}>Trending</p>
            <div className="flex flex-wrap gap-3">
              {["Oversized Tee", "Gothic", "Anime Collection", "Heavyweight"].map((t) => (
                <button key={t} onClick={() => { setSearchQuery(t); window.location.href = `/products?search=${encodeURIComponent(t)}`; setSearchOpen(false); }} className="border border-[var(--gray-600)] text-[var(--beige)] px-4 py-2 label hover:border-[var(--orange)] hover:bg-[var(--orange)] hover:text-[var(--black)] transition-colors" style={{ fontSize: "10px" }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div className="fixed inset-0 bg-[var(--black)] z-[150] flex flex-col" style={{ opacity: menuOpen ? 1 : 0, visibility: menuOpen ? "visible" : "hidden", transition: "opacity 0.3s ease" }}>
        <div className="flex items-center justify-between h-14 px-4 border-b border-[var(--gray-800)] text-[var(--beige)]">
          <span className="label text-[var(--beige)]" style={{ fontSize: "11px", letterSpacing: "0.12em" }}>Menu</span>
          <button onClick={() => setMenuOpen(false)} className="hover:text-[var(--orange)]">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>
        <div className="flex-1 px-6 pt-10 overflow-y-auto pb-24">
          {NAV_LINKS.map((link) => (
            <Link key={link} href="/products" onClick={() => setMenuOpen(false)} className="block py-5 border-b border-[var(--gray-900)] text-[var(--beige)] hover:text-[var(--orange)] transition-colors" style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "28px" }}>
              {link}
            </Link>
          ))}
          <div className="mt-8">
            <Link href="/profile" onClick={() => setMenuOpen(false)} className="label block py-3 text-[var(--gray-200)] hover:text-[var(--orange)] transition-colors">My Account</Link>
            <Link href="/checkout" onClick={() => setMenuOpen(false)} className="label block py-3 text-[var(--gray-200)] hover:text-[var(--orange)] transition-colors">Orders</Link>
          </div>
        </div>
      </div>
    </>
  );
};