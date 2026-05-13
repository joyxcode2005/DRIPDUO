"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { Search, X, User, ShoppingBag, Menu } from "lucide-react";
import { Nav_links } from "@/constants";
import Image from "next/image";

export const Navbar = () => {
  const { cart, openCart } = useCart();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen || menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [searchOpen, menuOpen]);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  if (pathname === "/auth" || pathname === "/reset-password") {
    return null;
  }

  return (
    <>
      {/* ── MAIN NAVBAR ── */}
      <nav
        className={`fixed top-0 left-0 w-full z-100 transition-all duration-500 ease-in-out ${
          scrolled
            ? "bg-[#050505]/95 backdrop-blur-md border-b border-white/5"
            : "bg-transparent"
        }`}
        style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
      >
        <div className="flex items-center px-6 md:px-12 lg:px-12 h-16 md:h-20">

          {/* LEFT: Hamburger (mobile) & Nav Links (desktop) */}
          <div className="flex items-center gap-2 flex-1">
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-(--beige) hover:text-(--orange) transition-colors"
              aria-label="Menu"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>

            <div className="hidden lg:flex items-center gap-8">
              {Nav_links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative text-(--beige) hover:text-(--orange) [text-shadow:0_1px_2px_rgba(0,0,0)] transition-colors uppercase tracking-[0.15em] text-[10px] font-medium group"
                >
                  {link.name}
                  <span className="absolute -bottom-1.5 left-0 w-0 h-px bg-(--orange) transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>
          </div>

          {/* CENTER: Logo — fixed WIDTH so transparent padding doesn't shrink the visible logo */}
         <Link
  href="/"
  aria-label="DRIPDUO Home"
  className="group absolute left-1/2 top-1/2 z-101 -translate-x-1/2 -translate-y-1/2"
>
  <span
    className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"
    style={{
      background:
        "radial-gradient(ellipse at center, rgba(238,60,36,0.18) 0%, transparent 70%)",
      filter: "blur(8px)",
      transform: "scale(1.3)",
    }}
  />

  <div className="relative w-42.5 h-12.5 md:w-[320px] md:h-21.25 lg:w-95 lg:h-23.75">
    <Image
      src="/images/reallogo.png"
      alt="DRIPDUO"
      fill
      priority
      className="object-contain object-center transition-all duration-500 group-hover:scale-105"
      style={{
        filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.5))",
      }}
    />
  </div>
</Link>

          {/* RIGHT: Icons */}
          <div className="flex items-center gap-5 flex-1 justify-end text-(--beige)">
            <button
              onClick={() => setSearchOpen(true)}
              className="hover:text-(--orange) transition-transform hover:scale-110 duration-300"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>

            <Link
              href="/profile"
              className="hover:text-(--orange) transition-transform hover:scale-110 duration-300 hidden md:flex items-center relative"
              title="My Profile"
            >
              <User size={20} strokeWidth={1.5} />
            </Link>

            <button
              onClick={openCart}
              className="hover:text-(--orange) transition-transform hover:scale-110 duration-300 relative"
            >
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

      {/* Global style: bump logo width on md+ screens */}
      <style jsx global>{`
        @media (min-width: 768px) {
          .navbar-logo {
            width: 190px !important;
          }
        }
      `}</style>

      {/* ── SEARCH OVERLAY ── */}
      <div
        className={`fixed inset-0 bg-[#050505]/98 backdrop-blur-xl z-200 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          searchOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between h-20 px-4 md:px-8 border-b border-white/10 text-(--beige)">
          <span className="uppercase tracking-[0.2em] text-[10px] font-medium">Search Archive</span>
          <button
            onClick={() => setSearchOpen(false)}
            className="p-2 -mr-2 hover:text-(--orange) hover:rotate-90 transition-all duration-300"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        <div
          className={`flex-1 flex flex-col px-4 md:px-8 pt-16 transition-all duration-700 delay-100 ${
            searchOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
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
            <p className="uppercase tracking-[0.2em] text-(--orange) mb-6 text-[10px] font-medium">
              Trending Queries
            </p>
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
        className={`fixed inset-0 bg-[#050505] z-200 flex flex-col lg:hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between h-20 px-4 border-b border-white/10">
          <Image
            src="/images/transLoader.png"
            alt="DRIPDUO"
            width={130}
            height={56}
            className="object-contain"
            style={{ height: "48px", width: "auto" }}
          />
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 -mr-2 text-(--beige) hover:text-(--orange) hover:rotate-90 transition-all duration-300"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        <div
          className={`flex-1 px-6 pt-12 overflow-y-auto pb-24 transition-all duration-700 delay-100 ${
            menuOpen ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
          }`}
        >
          {Nav_links.map((link, index) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block py-4 border-b border-white/5 text-(--beige) hover:text-(--orange) hover:pl-4 transition-all duration-300"
              style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                fontSize: "32px",
                transitionDelay: `${index * 50}ms`,
              }}
            >
              {link.name}
            </Link>
          ))}

          <div className="mt-12 space-y-4">
            <Link
              href="/profile"
              onClick={() => setMenuOpen(false)}
              className="uppercase tracking-[0.15em] block text-[11px] text-(--gray-200) hover:text-(--orange) transition-colors"
            >
              My Account
            </Link>
            <Link
              href="/checkout"
              onClick={() => setMenuOpen(false)}
              className="uppercase tracking-[0.15em] block text-[11px] text-(--gray-200) hover:text-(--orange) transition-colors"
            >
              Orders & Returns
            </Link>
            <button
              onClick={() => {
                setMenuOpen(false);
                setSearchOpen(true);
              }}
              className="uppercase tracking-[0.15em] block text-[11px] text-(--gray-200) hover:text-(--orange) transition-colors"
            >
              Search Archive
            </button>
          </div>
        </div>
      </div>
    </>
  );
};