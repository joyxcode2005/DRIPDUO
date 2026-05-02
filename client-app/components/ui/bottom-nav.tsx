"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/lib/CartContext";

export const BottomNav = () => {
  const pathname = usePathname();
  const { cart, openCart } = useCart();
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
  ];

  return (
    <>
      <div className="md:hidden w-full h-[calc(4rem+env(safe-area-inset-bottom))]" aria-hidden="true" />

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-(--black) border-t border-(--gray-800) z-50 pb-safe">
        <div className="flex items-center justify-around h-16">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-1.5 flex-1 h-full justify-center transition-colors duration-300 ${
                  isActive ? "text-(--orange)" : "text-(--gray-400)"
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 1.5 : 1} />
                <span className="font-sans text-[9px] uppercase tracking-[0.15em]">{label}</span>
              </Link>
            );
          })}

          <button
            onClick={openCart}
            className="flex flex-col items-center gap-1.5 flex-1 h-full justify-center relative transition-colors duration-300 text-(--gray-400) hover:text-(--orange)"
          >
            <div className="relative">
              <ShoppingBag size={18} strokeWidth={1} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-(--orange) text-(--black) rounded-full flex items-center justify-center font-bold text-[8px] tracking-tighter">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="font-sans text-[9px] uppercase tracking-[0.15em]">Bag</span>
          </button>

          <Link
            href="/profile"
            className={`flex flex-col items-center gap-1.5 flex-1 h-full justify-center transition-colors duration-300 ${
              pathname === "/profile" ? "text-(--orange)" : "text-(--gray-400)"
            }`}
          >
            <User size={18} strokeWidth={pathname === "/profile" ? 1.5 : 1} />
            <span className="font-sans text-[9px] uppercase tracking-[0.15em]">Profile</span>
          </Link>
        </div>
      </nav>
    </>
  );
};