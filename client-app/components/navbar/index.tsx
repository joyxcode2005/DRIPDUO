"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { ShoppingBag, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Menu, MenuItem, HoveredLink, ProductItem } from "../ui/NavigationMenu";
import { MobileMenu } from "./mobile-menu";

const smoothTransition = {
  type: "spring",
  bounce: 0, 
  duration: 0.6, 
};

export const Navbar = () => {
  const { cart, openCart } = useCart();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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

  // Hide Navbar on auth pages AND individual product detail pages
  const isProductDetailPage = /^\/products\/[a-zA-Z0-9_-]+$/.test(pathname);
  if (pathname === "/auth" || pathname === "/reset-password" || isProductDetailPage) return null;

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[150] flex flex-col items-center pointer-events-none">
        <motion.header
          layout
          transition={smoothTransition}
          className={cn(
            "pointer-events-auto flex items-center justify-between origin-top",
            scrolled
              ? "mt-3 md:mt-5 bg-[#1A1A1A]/85 backdrop-blur-3xl border border-white/10 rounded-full w-[95%] md:w-auto md:min-w-[800px] px-6 md:px-10 py-3 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]"
              : "mt-0 w-full px-6 md:px-12 py-5 md:py-8 bg-transparent border-transparent rounded-none"
          )}
        >
          {/* ── LEFT: Logo (Desktop) / Hamburger (Mobile) ── */}
          <motion.div layout transition={smoothTransition} className="flex-1 flex justify-start items-center">
            {/* Mobile Hamburger */}
            <div className="md:hidden">
              <button onClick={() => setMenuOpen(!menuOpen)} className="relative flex flex-col justify-center w-10 h-10 group glass-button rounded-full items-center">
                <motion.span animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 0 : -4 }} transition={{ duration: 0.3 }} className="absolute h-[1.5px] w-4 bg-[#ECE7D1] origin-center transition-colors" />
                <motion.span animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? 0 : 4 }} transition={{ duration: 0.3 }} className="absolute h-[1.5px] w-4 bg-[#ECE7D1] origin-center transition-colors" />
              </button>
            </div>
            
            {/* Desktop Logo */}
            <Link href="/" onClick={() => setMenuOpen(false)} className="hidden md:block relative w-32 h-10 group">
              <Image src="/images/reallogo.png" alt="DRIPDUO" fill priority className="object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-md" />
            </Link>
          </motion.div>

          {/* ── CENTER: Logo (Mobile) / Menu (Desktop) ── */}
          <motion.div layout transition={smoothTransition} className="flex justify-center items-center">
            {/* Mobile Logo */}
            <Link href="/" onClick={() => setMenuOpen(false)} className="md:hidden relative w-28 h-9 group">
              <Image src="/images/reallogo.png" alt="DRIPDUO" fill priority className="object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-md" />
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden md:block">
              <Menu setActive={setActive}>
                <Link href="/" onMouseEnter={() => setActive("Home")} className="relative">
                  <p className="cursor-pointer font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-white/80 hover:text-white transition-colors">Home</p>
                </Link>
                <MenuItem setActive={setActive} active={active} item="Shop">
                  <div className="grid grid-cols-2 gap-8 p-4 w-[550px]">
                    <ProductItem title="FW26 Archive" href="/products" src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop" description="Explore the complete drop. Uncompromising quality." />
                    <ProductItem title="Menswear" href="/products?category=men" src="https://images.unsplash.com/photo-1550614000-4b95d4ebf6eb?q=80&w=800&auto=format&fit=crop" description="Heavyweight basics engineered for men." />
                    <ProductItem title="Womenswear" href="/products?category=women" src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop" description="Silhouettes redefined for the modern woman." />
                    <ProductItem title="Accessories" href="/products?category=accessories" src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop" description="The final details to complete the look." />
                  </div>
                </MenuItem>
                <MenuItem setActive={setActive} active={active} item="Studio">
                  <div className="flex flex-col space-y-3 p-4 w-[220px]">
                    <HoveredLink href="/about">Our Story</HoveredLink>
                    <HoveredLink href="/bts">Behind the Scenes</HoveredLink>
                  </div>
                </MenuItem>
              </Menu>
            </div>
          </motion.div>

          {/* ── RIGHT: Actions ── */}
          <motion.div layout transition={smoothTransition} className="flex-1 flex justify-end items-center gap-3 md:gap-4 shrink-0 z-50">
            <Link href="/profile" className="text-white/80 hover:text-white transition-colors hidden sm:flex glass-button p-2.5 rounded-full shadow-md">
              <User size={16} strokeWidth={2} />
            </Link>
            <button onClick={openCart} className="text-white/80 hover:text-white transition-colors relative glass-button p-2.5 rounded-full shadow-md">
              <ShoppingBag size={16} strokeWidth={2} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute -top-1.5 -right-1.5 bg-[#EE3C24] text-white text-[9px] font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full shadow-lg">
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </motion.div>

        </motion.header>
      </div>

      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    </>
  );
};