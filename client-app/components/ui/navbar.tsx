"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { Search, User, Menu, X } from "lucide-react";

export const Navbar = () => {
  const { cart, openCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-80 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between px-6 py-4 md:px-12">
          
          {/* Left: Mobile Menu Trigger & Search */}
          <div className="flex items-center gap-6 flex-1">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-white hover:text-[#C5A059] transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <button className="hidden md:flex text-zinc-400 hover:text-white transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Center: Brand Logo */}
          <Link href="/" className="text-xl md:text-2xl font-light uppercase tracking-[0.3em] flex-1 text-center hover:text-[#C5A059] transition-colors duration-500">
            Dripduo
          </Link>

          {/* Right: Profile & Cart */}
          <div className="flex items-center justify-end gap-6 flex-1">
            <Link href="/profile" className="hidden md:flex text-zinc-400 hover:text-white transition-colors">
              <User className="w-4 h-4" />
            </Link>
            <button onClick={openCart} className="relative text-white hover:text-[#C5A059] transition-colors flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] hidden md:block">Cart</span>
              <div className="w-2 h-2 bg-[#C5A059] rounded-full mb-2"></div>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-3 text-[9px] font-mono bg-[#f8f8f8] text-[#050505] w-4 h-4 flex items-center justify-center rounded-full">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Full-Screen Menu */}
      <div className={`fixed inset-0 bg-[#050505] z-110 transform transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col ${isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="flex justify-end p-6">
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-zinc-500 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex flex-col items-center justify-center flex-1 space-y-8">
          {["Archive", "Lookbook", "Profile", "Search"].map((item) => (
            <Link 
              key={item} 
              href={item === "Archive" ? "/products" : `/${item.toLowerCase()}`}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-3xl font-light uppercase tracking-[0.2em] text-white hover:text-[#C5A059] transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};