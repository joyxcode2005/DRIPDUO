"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/lib/CartContext";

export const BottomNav = () => {
  const pathname = usePathname();
  const { cart, openCart } = useCart();
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/products", icon: Search, label: "Search" },
  ];

  return (
    <>
      {/* ── SPACER ── 
          This invisible block matches the height of the BottomNav (4rem / 16 + safe area).
          It physically pushes the bottom of the website down so the footer is never hidden. */}
      <div className="md:hidden w-full h-[calc(4rem+env(safe-area-inset-bottom))]" aria-hidden="true" />

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-(--black) border-t border-(--gray-800) z-65 pb-safe">
        <div className="flex items-center justify-around h-16">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-1 flex-1 h-full justify-center transition-colors duration-300"
                style={{ color: isActive ? "var(--orange)" : "var(--gray-400)" }}
              >
                <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                <span className="label-sm">{label}</span>
              </Link>
            );
          })}

          <button
            onClick={openCart}
            className="flex flex-col items-center gap-1 flex-1 h-full justify-center relative transition-colors duration-300 hover:text-[var(--orange)]"
            style={{ color: "var(--gray-400)" }}
          >
            <div className="relative">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-[var(--orange)] text-[var(--black)] rounded-full flex items-center justify-center font-bold text-[9px] tracking-tighter">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="label-sm">Bag</span>
          </button>

          <Link
            href="/profile"
            className="flex flex-col items-center gap-1 flex-1 h-full justify-center transition-colors duration-300"
            style={{ color: pathname === "/profile" ? "var(--orange)" : "var(--gray-400)" }}
          >
            <User size={20} strokeWidth={pathname === "/profile" ? 2 : 1.5} />
            <span className="label-sm">Profile</span>
          </Link>
        </div>
      </nav>
    </>
  );
};