"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="w-full bg-[#050505] border-t border-white/5 pt-20 pb-10 px-6 md:px-12 text-[#f8f8f8] selection:bg-[#C5A059] selection:text-black">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8 mb-20">
        
        {/* Brand & Newsletter */}
        <div className="md:col-span-2 flex flex-col justify-between">
          <div>
            <h2 className="text-4xl md:text-5xl font-light uppercase tracking-[0.3em] mb-4">Dripduo</h2>
            <p className="text-zinc-500 text-sm font-light leading-relaxed max-w-md tracking-wide">
              Unapologetic style. Uncompromising quality. Engineered for those who demand excellence in every thread.
            </p>
          </div>
          <div className="mt-12">
            <span className="text-[#C5A059] text-[10px] uppercase tracking-[0.3em] font-bold block mb-4">Join The Archive</span>
            <form className="relative max-w-md group" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                className="w-full bg-transparent border-b border-white/20 pb-3 text-sm font-mono uppercase tracking-widest text-white placeholder-white/20 focus:outline-none focus:border-[#C5A059] transition-colors"
              />
              <button type="submit" className="absolute right-0 bottom-3 text-zinc-500 group-hover:text-[#C5A059] transition-colors">
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Shop Links */}
        <div>
          <span className="text-white text-xs uppercase tracking-[0.2em] font-medium block mb-8 border-b border-white/10 pb-4">Explore</span>
          <ul className="space-y-4">
            {["Latest Arrivals", "FW26 Lookbook", "Signature Heavyweight", "Accessories", "Gift Cards"].map((link) => (
              <li key={link}>
                <Link href="/products" className="text-zinc-400 text-xs font-mono uppercase tracking-widest hover:text-[#C5A059] transition-colors">
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help & Socials */}
        <div>
          <span className="text-white text-xs uppercase tracking-[0.2em] font-medium block mb-8 border-b border-white/10 pb-4">Assistance</span>
          <ul className="space-y-4 mb-12">
            {["Client Care", "Shipping & Returns", "Track Order", "Terms & Conditions"].map((link) => (
              <li key={link}>
                <Link href="#" className="text-zinc-400 text-xs font-mono uppercase tracking-widest hover:text-[#C5A059] transition-colors">
                  {link}
                </Link>
              </li>
            ))}
          </ul>
          
          <span className="text-white text-xs uppercase tracking-[0.2em] font-medium block mb-6">Socials</span>
          <div className="flex gap-6">
            {["INSTAGRAM", "X", "TIKTOK"].map((social) => (
              <a key={social} href="#" className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-[#C5A059] hover:underline underline-offset-4 transition-all">
                {social}
              </a>
            ))}
          </div>
        </div>

      </div>

      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em]">
        {/* FIXED: Hardcoded the date to prevent Hydration crashes */}
        <span>&copy; 2026 DRIPDUO. All Rights Reserved.</span>
        <span className="mt-4 md:mt-0">Super Premium Architecture</span>
      </div>
    </footer>
  );
};