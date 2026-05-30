"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { Search, X, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const MODAL_LINKS = [
  { name: "Home", href: "/", sub: "Start" },
  { name: "Products", href: "/products", sub: "Archive" },
  { name: "Men", href: "/products?category=men", sub: "FW26" },
  { name: "Women", href: "/products?category=women", sub: "FW26" },
  { name: "About", href: "/about", sub: "Story" },
  { name: "Behind the Scenes", href: "/bts", sub: "Studio" },
];

const MODAL_IMAGES = [
  { src: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop", rotate: -7 },
  { src: "https://images.unsplash.com/photo-1550614000-4b95d4ebf6eb?q=80&w=800&auto=format&fit=crop", rotate: 2 },
  { src: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop", rotate: -2 },
];

export const Navbar = () => {
  const { cart, openCart } = useCart();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "unset";
  }, [menuOpen]);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  if (pathname === "/auth" || pathname === "/reset-password") return null;

  return (
    <>
      {/* ── UNIFIED FIXED HEADER ── */}
      <div className="fixed top-0 left-0 right-0 z-150 flex flex-col pointer-events-none">

        {/* Dismissible Banner */}
        <AnimatePresence>
          {isBannerVisible && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden bg-[#050505]/90 backdrop-blur-md border-b border-white/5 pointer-events-auto"
            >
              <div className="flex items-center justify-center py-2.5 px-4 md:px-10 min-h-9">
                <p className="font-sans text-[9px] sm:text-[11px] font-medium tracking-[0.25em] uppercase text-[#ECE7D1] text-center w-full max-w-[90%] truncate sm:text-clip sm:whitespace-normal">
                  Free Shipping Over ₹1999 <span className="mx-1 sm:mx-2 text-[#EE3C24]">•</span> Summer Drop Live
                </p>
                <button
                  onClick={() => setIsBannerVisible(false)}
                  className="absolute right-2 md:right-8 text-white/40 hover:text-white transition-colors p-2"
                  aria-label="Close banner"
                >
                  <X size={14} strokeWidth={2} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Nav */}
        <header
          className={`w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-auto ${
            scrolled && !menuOpen
              ? "bg-black/50 backdrop-blur-md py-3 md:py-4 border-b border-white/5"
              : "bg-transparent py-5 md:py-6"
          }`}
        >
          <div className="flex justify-between items-center px-4 md:px-10 lg:px-16 w-full">

            {/* Brand */}
            <div className="flex-1 flex justify-start z-50">
              <Link href="/" onClick={() => setMenuOpen(false)} className="relative group block">
                <div className="relative w-27.5 h-8.75 md:w-42.5 md:h-12.5">
                  <Image
                    src="/images/reallogo.png"
                    alt="DRIPDUO"
                    fill
                    priority
                    className="object-contain object-left transition-all duration-500 group-hover:scale-105"
                    style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.5))" }}
                  />
                </div>
              </Link>
            </div>

            {/* Right controls */}
            <div className="flex-1 flex justify-end items-center gap-4 md:gap-8 z-50">
              <button
                onClick={openCart}
                className={`text-[#ECE7D1] hover:text-[#EE3C24] transition-colors relative ${menuOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
              >
                <ShoppingBag size={20} strokeWidth={1.5} className="md:w-5.5 md:h-5.5" />
                <AnimatePresence>
                  {cartCount > 0 && !menuOpen && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute -top-1.5 -right-2 bg-[#EE3C24] text-black text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="relative flex flex-col justify-center items-center w-8 h-8 group"
                aria-label="Toggle Menu"
              >
                <motion.span
                  animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 0 : -4 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute h-[1px] w-6 md:w-7 bg-[#ECE7D1] group-hover:bg-[#EE3C24] origin-center transition-colors"
                />
                <motion.span
                  animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? 0 : 4 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute h-[1px] w-6 md:w-7 bg-[#ECE7D1] group-hover:bg-[#EE3C24] origin-center transition-colors"
                />
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* ── FULL-SCREEN MENU OVERLAY ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-110 bg-[#050505]/80 backdrop-blur-xl cursor-pointer"
            />

            {/* Modal panel */}
            <motion.div
              initial={{ opacity: 0, x: 60, y: "-50%" }}
              animate={{ opacity: 1, x: 0, y: "-50%" }}
              exit={{ opacity: 0, x: 60, y: "-50%" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-1/2 right-4 md:right-[4vw] lg:right-[5vw] z-120 w-[calc(100vw-2rem)] md:w-[48vw] lg:w-[38vw] md:max-w-255 bg-[#0D0D0B]/95 backdrop-blur-2xl border border-white/8 rounded-2xl md:rounded-xl overflow-hidden shadow-2xl"
            >
              {/* Top accent line */}
              <div className="h-px w-full bg-linear-to-r from-transparent via-[#EE3C24] to-transparent opacity-60" />

              <div className="p-7 sm:p-9 md:p-12">
                <div className="flex gap-8 md:gap-10">

                  {/* Left: Nav links */}
                  <div className="flex flex-col gap-1 flex-1">
                    {MODAL_LINKS.map((link, i) => (
                      <motion.div
                        key={link.name}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.08 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setMenuOpen(false)}
                          onMouseEnter={() => setHoveredLink(link.name)}
                          onMouseLeave={() => setHoveredLink(null)}
                          className="group flex items-baseline gap-3 py-2.5 md:py-3 border-b border-white/5 last:border-0"
                        >
                          <span className="font-sans text-[8px] uppercase tracking-[0.2em] text-[#EE3C24] w-5 shrink-0 transition-opacity opacity-0 group-hover:opacity-100">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className={`font-sans text-xl sm:text-2xl md:text-2xl font-light tracking-wide transition-all duration-300 ${
                            hoveredLink === link.name ? "text-[#EE3C24] translate-x-1" : hoveredLink ? "text-[#403F38]" : "text-[#ECE7D1]"
                          }`}>
                            {link.name}
                          </span>
                          <span className="ml-auto font-sans text-[8px] uppercase tracking-[0.15em] text-[#403F38] group-hover:text-[#6B6A5E] transition-colors">
                            {link.sub}
                          </span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {/* Right: Editorial card stack */}
                  <motion.div
                    initial="rest"
                    whileHover="hover"
                    animate="rest"
                    className="relative w-[130px] h-[190px] md:w-[165px] md:h-[240px] min-w-[130px] md:min-w-[165px] shrink-0 hidden sm:block cursor-pointer"
                  >
                    {MODAL_IMAGES.map((image, idx) => (
                      <motion.div
                        key={"modal-img-" + idx}
                        variants={{
                          rest: { rotate: image.rotate, x: 0, y: 0, scale: 1 },
                          hover: {
                            rotate: idx === 0 ? -14 : idx === 1 ? 0 : 14,
                            x: idx === 0 ? -32 : idx === 1 ? 0 : 32,
                            y: idx === 0 ? 12 : idx === 1 ? -18 : 12,
                            scale: 1.06,
                          },
                        }}
                        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0 w-full h-full rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#111]"
                        style={{ zIndex: idx }}
                      >
                        <Image
                          src={image.src}
                          alt="Editorial Preview"
                          fill
                          className="object-cover opacity-80 hover:opacity-100 transition-opacity duration-500"
                          sizes="(max-width: 768px) 130px, 165px"
                        />
                        {/* Caption on front card */}
                        {idx === 2 && (
                          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                            <p className="font-sans text-[7px] uppercase tracking-[0.15em] text-[#EE3C24]">FW26</p>
                            <p className="font-sans text-[8px] uppercase tracking-[0.1em] text-[#ECE7D1]">Archive Edit</p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                {/* Search */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="mt-8 md:mt-10 flex items-center gap-3 border-b border-white/15 pb-3 group focus-within:border-[#ECE7D1] transition-colors"
                >
                  <Search size={16} strokeWidth={1.5} className="text-white/30 group-focus-within:text-[#ECE7D1] transition-colors shrink-0" />
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (searchQuery.trim()) {
                        window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
                        setMenuOpen(false);
                      }
                    }}
                    className="w-full"
                  >
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search archive..."
                      className="bg-transparent border-none outline-none w-full text-sm md:text-base font-sans text-[#ECE7D1] placeholder:text-white/25 tracking-wide"
                    />
                  </form>
                </motion.div>

                {/* Footer meta */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55 }}
                  className="mt-5 flex items-center justify-between"
                >
                  <p className="font-sans text-[8px] uppercase tracking-[0.2em] text-[#403F38]">FW 2026 Collection</p>
                  <div className="flex gap-4">
                    {["IG", "TT", "X"].map((s) => (
                      <button key={s} className="font-sans text-[8px] uppercase tracking-[0.2em] text-[#403F38] hover:text-[#EE3C24] transition-colors">
                        {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};