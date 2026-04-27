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
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[65]"
      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      <div className="flex items-center justify-around h-14">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-1 flex-1 h-full justify-center"
            style={{ color: pathname === href ? "#000" : "#999" }}
          >
            <Icon size={20} strokeWidth={1.5} />
            <span className="label" style={{ fontSize: "9px", letterSpacing: "0.1em" }}>{label}</span>
          </Link>
        ))}

        <button
          onClick={openCart}
          className="flex flex-col items-center gap-1 flex-1 h-full justify-center relative"
          style={{ color: "#000" }}
        >
          <div className="relative">
            <ShoppingBag size={20} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-black text-white rounded-full flex items-center justify-center"
                style={{ fontSize: "8px" }}
              >
                {cartCount}
              </span>
            )}
          </div>
          <span className="label" style={{ fontSize: "9px", letterSpacing: "0.1em" }}>Bag</span>
        </button>

        <Link
          href="/profile"
          className="flex flex-col items-center gap-1 flex-1 h-full justify-center"
          style={{ color: pathname === "/profile" ? "#000" : "#999" }}
        >
          <User size={20} strokeWidth={1.5} />
          <span className="label" style={{ fontSize: "9px", letterSpacing: "0.1em" }}>Profile</span>
        </Link>
      </div>
    </nav>
  );
};