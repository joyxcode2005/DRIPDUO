"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Minus, ArrowRight } from "lucide-react";

const FOOTER_SECTIONS = [
  { title: "Help", links: ["Customer Care", "FAQ", "Track Your Order", "Shipping & Returns", "Exchanges"] },
  { title: "Company", links: ["About Us", "Careers", "Press", "Sustainability", "Stores"] },
  { title: "Legal", links: ["Privacy Policy", "Terms of Use", "Cookie Policy"] },
];

const FooterSection = ({ title, links }: { title: string; links: string[] }) => {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="border-b border-(--gray-800) md:border-none">
      <button 
        className="w-full flex items-center justify-between py-6 md:hidden text-(--beige)" 
        onClick={() => setOpen(!open)}
      >
        <span className="label" style={{ fontSize: "12px", letterSpacing: "0.15em" }}>{title.toUpperCase()}</span>
        {open ? <Minus size={16} strokeWidth={1.5} className="text-(--orange)" /> : <Plus size={16} strokeWidth={1.5} />}
      </button>
      
      <p className="label mb-8 hidden md:block text-(--beige)" style={{ fontSize: "12px", letterSpacing: "0.15em" }}>
        {title.toUpperCase()}
      </p>
      
      <div className={`overflow-hidden transition-all duration-500 ease-in-out md:max-h-none md:opacity-100 ${open ? "max-h-[400px] opacity-100 mb-6" : "max-h-0 opacity-0"}`}>
        <div className="flex flex-col space-y-4">
          {links.map((link) => (
            <Link 
              key={link} 
              href="#" 
              className="label text-(--gray-200) hover:text-(--orange) hover:translate-x-2 transition-all duration-300 w-fit" 
              style={{ fontSize: "11.5px", letterSpacing: "0.08em", textTransform: "none" }}
            >
              {link}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Footer = () => {
  return (
    <footer className="bg-(--black) pt-16 md:pt-24 border-t border-(--gray-800) overflow-hidden flex flex-col" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      
      {/* ── NEWSLETTER SECTION ── */}
      <div className="px-6 md:px-12 mb-16 md:mb-24">
        <div className="max-w-2xl">
          <h3 className="text-(--beige) font-serif text-4xl md:text-5xl mb-8 leading-tight">
            Stay ahead of the curve. <br className="hidden md:block" /> Join the edit.
          </h3>
          <form onSubmit={(e) => e.preventDefault()} className="flex items-end border-b border-(--gray-600) hover:border-(--orange) transition-colors pb-3 group">
            <input 
              type="email" 
              placeholder="ENTER YOUR EMAIL" 
              className="w-full bg-transparent border-none outline-none text-(--beige) placeholder-(--gray-400) label"
              style={{ fontSize: "12px", letterSpacing: "0.15em" }}
            />
            <button type="submit" className="text-(--gray-400) group-hover:text-(--orange) transition-colors px-2 pb-1">
              <ArrowRight size={22} strokeWidth={1.5} />
            </button>
          </form>
        </div>
      </div>

      {/* ── MAIN LINKS GRID ── */}
      <div className="px-6 md:px-12 mb-16 md:mb-24 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col justify-between">
            <div>
              <Link href="/" className="block mb-6 text-(--beige) hover:text-(--orange) transition-colors w-fit">
                <span style={{ fontSize: "22px", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase" }}>DRIPDUO</span>
              </Link>
              <p className="label text-(--gray-200) mb-10 leading-relaxed" style={{ fontSize: "11px", maxWidth: "280px", letterSpacing: "0.08em", textTransform: "none" }}>
                Unapologetic style. Uncompromising quality. Engineered for those who demand excellence in every thread.
              </p>
            </div>
            
            <div className="flex gap-8 mt-4 md:mt-0">
              {["INSTAGRAM", "FACEBOOK", "X"].map((s) => (
                <a key={s} href="#" className="label text-(--beige) hover:text-(--orange) hover:-translate-y-1 transition-all duration-300" style={{ fontSize: "10px", letterSpacing: "0.15em" }}>
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="md:col-span-7 lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-8 lg:gap-12">
            {FOOTER_SECTIONS.map((section) => (
              <FooterSection key={section.title} {...section} />
            ))}
          </div>

        </div>
      </div>

      {/* ── OVERSIZED WATERMARK ── */}
      <div className="w-full overflow-hidden border-t border-(--gray-800) flex items-center justify-center py-6 md:py-8 select-none">
        <h1 
          className="text-(--gray-900) font-black tracking-tighter w-full text-center hover:text-(--orange) transition-colors duration-700 cursor-default" 
          style={{ fontSize: "16vw", lineHeight: 0.75, marginTop: "-1.5vw", marginBottom: "-1.5vw" }}
        >
          DRIPDUO
        </h1>
      </div>

      {/* ── BOTTOM LEGAL BAR ── Added pb-24 for mobile spacing */}
      <div className="bg-(--black) border-t border-(--gray-800) px-6 md:px-12 pt-6 pb-24 md:pb-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="label text-(--gray-400)" style={{ fontSize: "10px", letterSpacing: "0.12em" }}>
          © 2026 DRIPDUO. ALL RIGHTS RESERVED.
        </p>
        <div className="flex items-center gap-8">
          <button className="label text-(--gray-400) hover:text-(--beige) transition-colors" style={{ fontSize: "10px", letterSpacing: "0.12em" }}>INDIA</button></div>
        </div>
      
    </footer>
  );
};