"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/lib/CartContext";

export const BottomNav = () => {
  const pathname = usePathname();
  const { cart, openCart } = useCart();

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-[90] bg-[#050505]/95 backdrop-blur-xl border-t border-white/10 pb-safe">
      <div className="flex items-center justify-around h-20 pb-4 px-2">
        
        <Link href="/" className="flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform">
          <Home className={`w-5 h-5 transition-colors ${pathname === '/' ? 'text-[#C5A059]' : 'text-zinc-500'}`} />
          <span className={`text-[9px] uppercase tracking-widest font-mono transition-colors ${pathname === '/' ? 'text-[#C5A059]' : 'text-zinc-500'}`}>
            Home
          </span>
        </Link>

        <Link href="/products" className="flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform">
          <Search className={`w-5 h-5 transition-colors ${pathname === '/products' ? 'text-[#C5A059]' : 'text-zinc-500'}`} />
          <span className={`text-[9px] uppercase tracking-widest font-mono transition-colors ${pathname === '/products' ? 'text-[#C5A059]' : 'text-zinc-500'}`}>
            Search
          </span>
        </Link>

        <button onClick={openCart} className="flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform relative">
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-zinc-500" />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#C5A059] text-[#050505] text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-[#050505]">
                {cart.length}
              </span>
            )}
          </div>
          <span className="text-[9px] uppercase tracking-widest font-mono text-zinc-500">
            Cart
          </span>
        </button>

        <Link href="/profile" className="flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform">
          <User className={`w-5 h-5 transition-colors ${pathname === '/profile' ? 'text-[#C5A059]' : 'text-zinc-500'}`} />
          <span className={`text-[9px] uppercase tracking-widest font-mono transition-colors ${pathname === '/profile' ? 'text-[#C5A059]' : 'text-zinc-500'}`}>
            Profile
          </span>
        </Link>

      </div>
    </nav>
  );
};