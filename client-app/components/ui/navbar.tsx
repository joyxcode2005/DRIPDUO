"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { Search, X, ShoppingBag, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

// ── ACETERNITY UI COMPONENTS ──
const transition = { type: "spring", mass: 0.5, damping: 11.5, stiffness: 100 };

export const Menu = ({ setActive, children }: { setActive: (item: string | null) => void; children: React.ReactNode; }) => (
  <nav onMouseLeave={() => setActive(null)} className="flex items-center justify-center space-x-8 px-8 py-2">{children}</nav>
);

export const MenuItem = ({ setActive, active, item, children }: { setActive: (item: string) => void; active: string | null; item: string; children?: React.ReactNode; }) => (
  <div onMouseEnter={() => setActive(item)} className="relative">
    <motion.p transition={{ duration: 0.3 }} className="cursor-pointer font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#ECE7D1] hover:text-[#EE3C24] transition-colors">{item}</motion.p>
    {active !== null && (
      <motion.div initial={{ opacity: 0, scale: 0.85, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={transition}>
        {active === item && children && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 pt-6">
            {/* ── REFINED GLASSMORPHISM & INVISIBLE HOVER BRIDGE ── */}
            <motion.div 
              transition={transition} 
              layoutId="active" 
              className="bg-[#050505]/80 backdrop-blur-2xl rounded-2xl overflow-hidden border border-white/5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]"
            >
              <motion.div layout className="w-max h-full p-6">{children}</motion.div>
            </motion.div>
          </div>
        )}
      </motion.div>
    )}
  </div>
);

export const HoveredLink = ({ children, ...rest }: any) => (
  <Link {...rest} className="font-sans text-[12px] tracking-[0.15em] uppercase text-[#ECE7D1]/60 hover:text-[#EE3C24] transition-colors block py-1.5">
    {children}
  </Link>
);

export const ProductItem = ({ title, description, href, src }: { title: string; description: string; href: string; src: string; }) => (
  <Link href={href} className="flex space-x-5 group p-2 -m-2 rounded-xl hover:bg-white/[0.03] transition-all duration-300">
    <div className="relative w-[72px] h-[96px] rounded-sm overflow-hidden shrink-0 bg-[#111] border border-white/5">
      <Image src={src} fill alt={title} className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
    </div>
    <div className="flex flex-col justify-center">
      <h4 className="font-serif text-base text-[#ECE7D1] mb-1.5 group-hover:text-[#EE3C24] transition-colors">{title}</h4>
      <p className="font-sans text-[11px] text-[#ECE7D1]/50 tracking-wider leading-relaxed max-w-[180px]">{description}</p>
    </div>
  </Link>
);

// ── MAIN NAVBAR ──
const MODAL_LINKS = [
  { name: "Home", href: "/", sub: "Start" },
  { name: "Products", href: "/products", sub: "Archive" },
  { name: "Profile", href: "/profile", sub: "Account" },
  { name: "About", href: "/about", sub: "Story" },
  { name: "Behind the Scenes", href: "/behind-the-scenes", sub: "Studio" },
];

export const Navbar = () => {
  const { cart, openCart } = useCart();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [active, setActive] = useState<string | null>(null);

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
      <div className="fixed top-0 left-0 right-0 z-[150] flex flex-col pointer-events-none">
        
        {/* ── HEADER CONTAINER ── */}
        <header className={cn("w-full transition-all duration-500 ease-out pointer-events-auto flex justify-center", scrolled ? "pt-2 md:pt-4" : "pt-4 md:pt-8")}>
          <div className={cn("flex items-center justify-between transition-all duration-500",
              scrolled || !isBannerVisible
                ? "bg-[#050505]/85 backdrop-blur-xl border border-white/10 rounded-full w-[95%] md:w-auto md:min-w-[800px] px-5 md:px-8 py-3 shadow-2xl"
                : "w-full px-6 md:px-12 py-3 bg-transparent border-transparent"
            )}
          >
            
            {/* MOBILE ONLY: Left Hamburger */}
            <div className="flex-1 flex justify-start md:hidden">
              <button onClick={() => setMenuOpen(!menuOpen)} className="relative flex flex-col justify-center w-8 h-8 group">
                <motion.span animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 0 : -4 }} className="absolute h-[1px] w-5 bg-[#ECE7D1] origin-center transition-colors" />
                <motion.span animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? 0 : 4 }} className="absolute h-[1px] w-5 bg-[#ECE7D1] origin-center transition-colors" />
              </button>
            </div>

            {/* LOGO: Left on Desktop, Center on Mobile */}
            <Link href="/" onClick={() => setMenuOpen(false)} className="relative group shrink-0 flex-1 md:flex-none flex justify-center md:justify-start">
              <div className="relative w-[110px] h-[35px] md:w-[130px] md:h-[40px]">
                <Image src="/images/reallogo.png" alt="DRIPDUO" fill priority className="object-contain transition-transform duration-500 group-hover:scale-105" />
              </div>
            </Link>

            {/* DESKTOP MENU: Center */}
            <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
              <Menu setActive={setActive}>
                <Link href="/" onMouseEnter={() => setActive("Home")} className="relative">
                  <p className="cursor-pointer font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#ECE7D1] hover:text-[#EE3C24] transition-colors">Home</p>
                </Link>
                <MenuItem setActive={setActive} active={active} item="Shop">
                  <div className="grid grid-cols-2 gap-8 p-2 w-[550px]">
                    <ProductItem title="FW26 Archive" href="/products" src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop" description="Explore the complete drop. Uncompromising quality." />
                    <ProductItem title="Menswear" href="/products?category=men" src="https://images.unsplash.com/photo-1550614000-4b95d4ebf6eb?q=80&w=800&auto=format&fit=crop" description="Heavyweight basics engineered for men." />
                    <ProductItem title="Womenswear" href="/products?category=women" src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop" description="Silhouettes redefined for the modern woman." />
                    <ProductItem title="Accessories" href="/products?category=accessories" src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop" description="The final details to complete the look." />
                  </div>
                </MenuItem>
                <MenuItem setActive={setActive} active={active} item="Studio">
                  <div className="flex flex-col space-y-2 p-2 w-[200px]">
                    <HoveredLink href="/about">Our Story</HoveredLink>
                    <HoveredLink href="/behind-the-scenes">Behind the Scenes</HoveredLink>
                  </div>
                </MenuItem>
              </Menu>
            </div>

            {/* ACTIONS: Right */}
            <div className="flex-1 md:flex-none flex justify-end items-center gap-5 md:gap-6 shrink-0 z-50">
              <Link href="/profile" className="text-[#ECE7D1] hover:text-[#EE3C24] transition-colors hidden sm:block">
                <User size={18} strokeWidth={1.5} />
              </Link>
              <button onClick={openCart} className="text-[#ECE7D1] hover:text-[#EE3C24] transition-colors relative">
                <ShoppingBag size={18} strokeWidth={1.5} />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute -top-1.5 -right-2 bg-[#EE3C24] text-black text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* ── MOBILE FULL-SCREEN MENU OVERLAY ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="fixed inset-0 z-[120] bg-[#050505] pt-32 px-8 md:hidden flex flex-col">
            <div className="flex flex-col gap-8">
              {MODAL_LINKS.map((link, i) => (
                <motion.div key={link.name} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
                  <Link href={link.href} onClick={() => setMenuOpen(false)} className="font-serif text-[2.5rem] leading-none tracking-tight text-[#ECE7D1] hover:text-[#EE3C24] transition-colors">
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-auto mb-16">
              <div className="flex items-center gap-3 border-b border-white/15 pb-4 focus-within:border-[#ECE7D1]">
                <Search size={18} className="text-white/30 shrink-0" />
                <form onSubmit={(e) => { e.preventDefault(); if (searchQuery.trim()) { window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`; setMenuOpen(false); } }} className="w-full">
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search archive..." className="bg-transparent border-none outline-none w-full text-base font-sans tracking-widest text-[#ECE7D1] placeholder:text-white/25" />
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};