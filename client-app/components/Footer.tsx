"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Plus, Minus } from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { SketchHighlight } from "@/components/ui/sketch-highlight";

const FOOTER_SECTIONS = [
  { title: "Help", links: ["Customer Care", "FAQ", "Track Your Order", "Shipping & Returns", "Exchanges"] },
  { title: "Company", links: ["About Us", "Careers", "Press", "Sustainability", "Stores"] },
  { title: "Legal", links: ["Privacy Policy", "Terms of Use", "Cookie Policy"] },
];

const SOCIAL_LINKS = [
  { name: "Instagram", href: "https://www.instagram.com/dripduo2026", icons: <FaInstagram /> },
  { name: "Facebook", href: "https://www.facebook.com/dripduo2026", icons: <FaFacebook /> },
];

const FooterSection = ({ title, links }: { title: string; links: string[] }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/10 md:border-none">
      <button
        className="w-full flex items-center justify-between py-5 md:hidden text-white/80"
        onClick={() => setOpen(!open)}
      >
        <span className="font-sans text-[11px] uppercase tracking-[0.2em] font-medium">{title}</span>
        {open ? <Minus size={16} strokeWidth={1.5} className="text-[#EE3C24]" /> : <Plus size={16} strokeWidth={1.5} />}
      </button>

      <p className="hidden md:block font-sans text-[11px] uppercase tracking-[0.2em] text-white/90 font-medium mb-6">
        {title}
      </p>

      <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:max-h-none md:opacity-100 ${open ? "max-h-75 opacity-100 mb-6" : "max-h-0 opacity-0"}`}>
        <div className="flex flex-col space-y-4">
          {links.map((link) => (
            <Link
              key={link}
              href="#"
              className="font-sans text-[10px] tracking-widest text-white/50 hover:text-white hover:translate-x-2 transition-all duration-300 w-fit"
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
  const pathname = usePathname();

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

  if (pathname === "/auth" || pathname === "/reset-password") return null;

  return (
    <footer className="relative bg-black/20 backdrop-blur-md pt-16 md:pt-24 border-t border-white/5 overflow-hidden flex flex-col z-10 w-full mt-20">

      {/* ── MAIN LINKS GRID ── */}
      <div className="w-full max-w-500 mx-auto px-6 md:px-12 lg:px-16 xl:px-24 mb-16 md:mb-24 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">

          {/* Brand Info */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col justify-between">
            <div>
              <Link href="/" className="block mb-8 text-[#ECE7D1] hover:text-white transition-colors w-fit">
                <span className="font-serif text-[32px] tracking-[0.2em] uppercase drop-shadow-lg">
                  <SketchHighlight type="circle" delay={600} color="#EE3C24">
                    DRIPDUO
                  </SketchHighlight>
                </span>
              </Link>
              <p className="font-sans text-[11px] md:text-[12px] leading-relaxed tracking-wider text-white/50 max-w-75">
                Unapologetic style. Uncompromising quality. Engineered for those who demand excellence in every thread.
              </p>
            </div>

            <div className="flex gap-6 mt-10 md:mt-0">
              {SOCIAL_LINKS.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target={social.href !== "#" ? "_blank" : "_self"}
                  rel={social.href !== "#" ? "noopener noreferrer" : ""}
                  className="font-sans text-[25px] uppercase tracking-[0.2em] text-white/70 hover:text-red-500 transition-colors flex items-center gap-2"
                >
                  {social.icons} <span className="sr-only">{social.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="md:col-span-7 lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-8 lg:gap-16">
            {FOOTER_SECTIONS.map((section) => (
              <FooterSection key={section.title} {...section} />
            ))}
          </div>

        </div>
      </div>

      {/* ── OVERSIZED WATERMARK ── */}
      <div className="w-full overflow-hidden border-t border-white/5 flex items-center justify-center py-4 md:py-6 select-none relative bg-black/40">
        <h1
          className={`font-bold tracking-tighter w-full text-center transition-colors duration-700 cursor-default
            text-white/5 
            md:hover:text-white/10 
            ${isScrolling ? "max-md:text-white/10" : ""}
          `}
          style={{ fontSize: "16vw", lineHeight: 0.75, marginTop: "-2.7vw", marginBottom: "-2.7vw" }}
        >
          DRIPDUO
        </h1>
      </div>

      {/* ── BOTTOM LEGAL BAR ── */}
      <div className="bg-transparent px-6 md:px-12 lg:px-24 pt-6 pb-24 md:pb-8 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/5">
        <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-white/40">
          © 2026 DRIPDUO. ALL RIGHTS RESERVED.
        </p>
        <div className="flex items-center gap-8">
          <button className="font-sans text-[9px] uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors">
            INDIA (INR)
          </button>
        </div>
      </div>

    </footer>
  );
};
