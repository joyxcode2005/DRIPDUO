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
              ? "glass-panel rounded-full w-[95%] md:w-auto md:min-w-200 px-6 md:px-10 py-3.5 shadow-2xl"
              : "w-full px-6 md:px-12 py-3 bg-transparent border-transparent"
          )}
          >

            {/* ── MOBILE HAMBURGER ── */}
            <div className="flex-1 flex justify-start md:hidden">
              <button onClick={() => setMenuOpen(!menuOpen)} className="relative flex flex-col justify-center w-10 h-10 group glass-button rounded-full items-center">
                <motion.span animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 0 : -4 }} className="absolute h-[1.5px] w-4 bg-[#ECE7D1] origin-center transition-colors" />
                <motion.span animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? 0 : 4 }} className="absolute h-[1.5px] w-4 bg-[#ECE7D1] origin-center transition-colors" />
              </button>
            </div>

            {/* ── LOGO ── */}
            <Link href="/" onClick={() => setMenuOpen(false)} className="relative group shrink-0 flex-1 md:flex-none flex justify-center md:justify-start">
              <div className="relative w-28 h-9 md:w-32 md:h-10">
                <Image src="/images/reallogo.png" alt="DRIPDUO" fill priority className="object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-md" />
              </div>
            </Link>

            {/* ── DESKTOP MENU ── */}
            <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
              <Menu setActive={setActive}>
                <Link href="/" onMouseEnter={() => setActive("Home")} className="relative">
                  <p className="cursor-pointer font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-white/80 hover:text-white transition-colors">Home</p>
                </Link>
                <MenuItem setActive={setActive} active={active} item="Shop">
                  <div className="grid grid-cols-2 gap-8 p-4 w-137.5">
                    <ProductItem title="FW26 Archive" href="/products" src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop" description="Explore the complete drop. Uncompromising quality." />
                    <ProductItem title="Menswear" href="/products?category=men" src="https://images.unsplash.com/photo-1550614000-4b95d4ebf6eb?q=80&w=800&auto=format&fit=crop" description="Heavyweight basics engineered for men." />
                    <ProductItem title="Womenswear" href="/products?category=women" src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop" description="Silhouettes redefined for the modern woman." />
                    <ProductItem title="Accessories" href="/products?category=accessories" src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop" description="The final details to complete the look." />
                  </div>
                </MenuItem>
                <MenuItem setActive={setActive} active={active} item="Studio">
                  <div className="flex flex-col space-y-3 p-4 w-55">
                    <HoveredLink href="/about">Our Story</HoveredLink>
                    <HoveredLink href="/bts">Behind the Scenes</HoveredLink>
                  </div>
                </MenuItem>
              </Menu>
            </div>

            {/* ── ACTIONS ── */}
            <div className="flex-1 md:flex-none flex justify-end items-center gap-3 md:gap-4 shrink-0 z-50">
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
            </div>

          </div>
        </header>
      </div>
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    </>
  );
};