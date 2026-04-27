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
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = (searchOpen || menuOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [searchOpen, menuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
      setSearchOpen(false);
    }
  };

  return (
    <>
      {/* ── MAIN NAV ── */}
      <header className={`site-nav ${scrolled ? "scrolled" : ""}`}>
        <div className="w-full flex items-center justify-between px-5 md:px-10">

          {/* LEFT */}
          <div className="flex items-center gap-7 flex-1">
            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden flex flex-col gap-[5px] p-1"
              aria-label="Open menu"
            >
              <span className="w-[22px] h-[1px] bg-[#0a0a0a] block transition-all duration-300" />
              <span className="w-[16px] h-[1px] bg-[#0a0a0a] block transition-all duration-300" />
            </button>

            <nav className="hidden md:flex items-center gap-7">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link}
                  href="/products"
                  className="label link-reveal"
                  style={{ color: "var(--black)", fontSize: "10px", letterSpacing: "0.18em" }}
                >
                  {link}
                </Link>
              ))}
            </nav>
          </div>

          {/* CENTER — LOGO */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <span style={{
              fontFamily: "var(--font-sans)",
              fontSize: "15px",
              fontWeight: 300,
              letterSpacing: "0.45em",
              textTransform: "uppercase",
              color: "var(--black)",
            }}>
              DRIPDUO
            </span>
          </Link>

          {/* RIGHT */}
          <div className="flex items-center gap-5 flex-1 justify-end">
            <button
              onClick={() => setSearchOpen(true)}
              className="btn-ghost"
              aria-label="Search"
              style={{ padding: 0 }}
            >
              <Search size={17} strokeWidth={1.25} />
            </button>

            <Link href="/profile" className="btn-ghost hidden md:flex" style={{ padding: 0 }}>
              <User size={17} strokeWidth={1.25} />
            </Link>

            <button
              onClick={openCart}
              className="btn-ghost relative"
              aria-label="Bag"
              style={{ padding: 0 }}
            >
              <ShoppingBag size={17} strokeWidth={1.25} />
              {cartCount > 0 && (
                <span
                  className="absolute -top-2 -right-2 w-[18px] h-[18px] bg-[#0a0a0a] text-[#fafafa] rounded-full flex items-center justify-center"
                  style={{ fontSize: "8px", letterSpacing: 0 }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── SEARCH OVERLAY ── */}
      <div className={`search-overlay ${searchOpen ? "open" : ""}`}>
        <div className="flex items-center justify-between px-5 md:px-10 border-b border-[var(--gray-200)]" style={{ height: "58px" }}>
          <span className="label" style={{ color: "var(--gray-400)", fontSize: "10px" }}>Search</span>
          <button onClick={() => setSearchOpen(false)} className="btn-ghost" style={{ padding: 0 }}>
            <X size={18} strokeWidth={1.25} />
          </button>
        </div>

        <div className="px-5 md:px-10 pt-14 flex flex-col">
          <form onSubmit={handleSearch}>
            <input
              autoFocus={searchOpen}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products…"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.8rem, 5vw, 4rem)",
                fontWeight: 400,
                width: "100%",
                border: "none",
                borderBottom: "1px solid var(--gray-200)",
                outline: "none",
                paddingBottom: "20px",
                background: "transparent",
                color: "var(--black)",
                letterSpacing: "-0.01em",
              }}
            />
          </form>

          <div className="mt-12">
            <p className="label" style={{ color: "var(--gray-400)", marginBottom: "20px", fontSize: "9px" }}>
              Trending Searches
            </p>
            <div className="flex flex-wrap gap-3">
              {["Oversized", "Gothic", "Anime", "Gym Wear", "States"].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchQuery(term);
                    window.location.href = `/products?search=${encodeURIComponent(term)}`;
                    setSearchOpen(false);
                  }}
                  className="btn-secondary"
                  style={{ padding: "10px 18px", fontSize: "9px" }}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <div
          className="flex items-center justify-between px-5 border-b border-[var(--gray-100)]"
          style={{ height: "58px" }}
        >
          <span className="label" style={{ color: "var(--gray-400)", fontSize: "10px" }}>Menu</span>
          <button onClick={() => setMenuOpen(false)} className="btn-ghost" style={{ padding: 0 }}>
            <X size={18} strokeWidth={1.25} />
          </button>
        </div>

        <div className="px-6 pt-8 flex-1 overflow-y-auto">
          {NAV_LINKS.map((link) => (
            <Link
              key={link}
              href="/products"
              className="mobile-menu-link"
              onClick={() => setMenuOpen(false)}
            >
              {link}
            </Link>
          ))}

          <div className="mt-10 space-y-1">
            {[
              { label: "My Account", href: "/profile" },
              { label: "Orders", href: "/profile" },
              { label: "Help & Support", href: "#" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block label py-3"
                onClick={() => setMenuOpen(false)}
                style={{ color: "var(--gray-400)", fontSize: "10px" }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};