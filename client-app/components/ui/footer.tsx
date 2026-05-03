"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Minus } from "lucide-react";
import { SketchHighlight } from "@/components/ui/sketch-highlight";

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
        className="w-full flex items-center justify-between py-5 md:hidden text-(--beige)"
        onClick={() => setOpen(!open)}
      >
        <span className="font-sans text-[11px] uppercase tracking-[0.2em]">{title}</span>
        {open ? <Minus size={16} strokeWidth={1} className="text-(--orange)" /> : <Plus size={16} strokeWidth={1} />}
      </button>

      <p className="hidden md:block font-sans text-[11px] uppercase tracking-[0.2em] text-(--beige) mb-6">
        {title}
      </p>

      <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:max-h-none md:opacity-100 ${open ? "max-h-100 opacity-100 mb-6" : "max-h-0 opacity-0"}`}>
        <div className="flex flex-col space-y-4">
          {links.map((link) => (
            <Link
              key={link}
              href="#"
              className="font-sans text-[10px] tracking-widest text-(--gray-400) hover:text-(--orange) hover:translate-x-2 transition-all duration-300 w-fit"
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
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 350);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <footer className="bg-(--black) pt-16 md:pt-20 border-t border-(--gray-800) overflow-hidden flex flex-col">

      

      {/* ── MAIN LINKS GRID ── */}
      <div className="px-6 md:px-12 mb-16 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">

          {/* Brand Info */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col justify-between">
            <div>
              <Link href="/" className="block mb-6 text-(--beige) hover:text-(--orange) transition-colors w-fit">
                <span className="font-serif text-[28px] tracking-[0.2em] uppercase">
                  <SketchHighlight type="circle" delay={600} color="var(--orange)">
                    DRIPDUO
                  </SketchHighlight>
                </span>
              </Link>
              <p className="font-sans text-[11px] leading-relaxed tracking-[0.05em] text-(--gray-400) max-w-70">
                Unapologetic style. Uncompromising quality. Engineered for those who demand excellence in every thread.
              </p>
            </div>

            <div className="flex gap-8 mt-8 md:mt-0">
              {[
                { name: "INSTAGRAM", href: "https://www.instagram.com/dripduo2026" },
                { name: "TIKTOK", href: "#" },
                { name: "X", href: "#" }
              ].map((social) => (
                <a 
                  key={social.name} 
                  href={social.href}
                  target={social.href !== "#" ? "_blank" : "_self"}
                  rel={social.href !== "#" ? "noopener noreferrer" : ""}
                  className="font-sans text-[10px] uppercase tracking-[0.2em] text-(--beige) hover:text-(--orange) hover:-translate-y-1 transition-all duration-300"
                >
                  {social.name}
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
      <div className="w-full overflow-hidden border-t border-(--gray-800) flex items-center justify-center py-4 md:py-6 select-none">
        <h1
          className={`font-bold tracking-tighter w-full text-center transition-colors duration-700 cursor-default
            text-(--gray-900) 
            md:hover:text-(--orange) 
            ${isScrolling ? "max-md:text-(--orange)" : ""}
          `}
          style={{ fontSize: "16vw", lineHeight: 0.75, marginTop: "-2.7vw", marginBottom: "-2.7vw" }}
        >
          DRIPDUO
        </h1>
      </div>

      {/* ── BOTTOM LEGAL BAR ── */}
      <div className="bg-(--black) border-t border-(--gray-800) px-6 md:px-12 pt-6 pb-24 md:pb-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-(--gray-400)">
          © 2026 DRIPDUO. ALL RIGHTS RESERVED.
        </p>
        <div className="flex items-center gap-8">
          <button className="font-sans text-[9px] uppercase tracking-[0.2em] text-(--gray-400) hover:text-(--beige) transition-colors">
            INDIA
          </button>
        </div>
      </div>

    </footer>
  );
};