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

export const Navbar = () => {
  const { cart, openCart } = useCart();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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
      <div className="fixed top-0 left-0 right-0 z-150 flex flex-col pointer-events-none">
        <header className={cn("w-full transition-all duration-500 ease-out pointer-events-auto flex justify-center", scrolled ? "pt-2 md:pt-4" : "pt-4 md:pt-8")}>
          <div className={cn("flex items-center justify-between transition-all duration-500",
            scrolled || !isBannerVisible
              ? "bg-[#050505]/85 backdrop-blur-xl border border-white/10 rounded-full w-[95%] md:w-auto md:min-w-200 px-5 md:px-8 py-3 shadow-2xl"
              : "w-full px-6 md:px-12 py-3 bg-transparent border-transparent"
          )}
          >

            {/* ── MOBILE HAMBURGER ── */}
            <div className="flex-1 flex justify-start md:hidden">
              <button onClick={() => setMenuOpen(!menuOpen)} className="relative flex flex-col justify-center w-8 h-8 group">
                <motion.span animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 0 : -4 }} className="absolute h-px w-5 bg-[#ECE7D1] origin-center transition-colors" />
                <motion.span animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? 0 : 4 }} className="absolute h-px w-5 bg-[#ECE7D1] origin-center transition-colors" />
              </button>
            </div>

            {/* ── LOGO ── */}
            <Link href="/" onClick={() => setMenuOpen(false)} className="relative group shrink-0 flex-1 md:flex-none flex justify-center md:justify-start">
              <div className="relative w-27.5 h-8.75 md:w-32.5 md:h-15">
                <Image src="/images/reallogo.png" alt="DRIPDUO" fill priority className="object-contain transition-transform duration-500 group-hover:scale-105" />
              </div>
            </Link>

            {/* ── DESKTOP MENU ── */}
            <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
              <Menu setActive={setActive}>
                <Link href="/" onMouseEnter={() => setActive("Home")} className="relative">
                  <p className="cursor-pointer font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#ECE7D1] hover:text-[#EE3C24] transition-colors">Home</p>
                </Link>
                <MenuItem setActive={setActive} active={active} item="Shop">
                  <div className="grid grid-cols-2 gap-8 p-2 w-137.5">
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

            {/* ── ACTIONS ── */}
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

      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    </>
  );
};