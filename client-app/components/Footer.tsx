"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import { Plus, Minus, ArrowRight } from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

const FOOTER_SECTIONS = [
  { title: "Help", links: ["Customer Care", "FAQ", "Track Your Order", "Shipping & Returns", "Exchanges"] },
  { title: "Company", links: ["About Us", "Careers", "Press", "Sustainability", "Stores"] },
  { title: "Legal", links: ["Privacy Policy", "Terms of Use", "Cookie Policy"] },
];

const SOCIAL_LINKS = [
  { name: "Instagram", href: "https://www.instagram.com/dripduo2026", icon: <FaInstagram size={16} /> },
  { name: "Facebook", href: "https://www.facebook.com/dripduo2026", icon: <FaFacebook size={16} /> },
];

const FooterSection = ({ title, links }: { title: string; links: string[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-[#050505]/10 md:border-none">
      {/* Mobile Accordion Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 md:hidden group"
      >
        <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#050505] font-bold group-hover:text-[#EE3C24] transition-colors">
          {title}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          {isOpen ? <Minus size={14} className="text-[#EE3C24]" /> : <Plus size={14} className="text-[#050505]/50" />}
        </motion.div>
      </button>

      {/* Desktop Title */}
      <h3 className="hidden md:block font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#050505]/40 mb-6">
        {title}
      </h3>

      {/* Links */}
      <motion.div 
        initial={false}
        animate={{ height: isOpen ? "auto" : 0 }}
        className="md:!h-auto overflow-hidden md:overflow-visible"
      >
        <ul className="flex flex-col gap-4 pb-6 md:pb-0 pt-2 md:pt-0">
          {links.map((link) => (
            <li key={link}>
              <Link
                href="#"
                className="font-sans text-[13px] text-[#050505]/70 hover:text-[#050505] transition-colors duration-300 relative group inline-flex font-medium"
              >
                {link}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#EE3C24] transition-all duration-300 group-hover:w-full" />
              </Link>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export function Footer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const isTextInView = useInView(textRef, { once: true, margin: "-10%" });

  // Scroll-driven animation pulling the footer up
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  // The Magic Transforms: Morphing from a floating blurry pill into a massive sharp beige canvas
  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const borderRadius = useTransform(scrollYProgress, [0, 1], ["120px", "0px"]);
  const filter = useTransform(scrollYProgress, [0, 1], ["blur(15px)", "blur(0px)"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ["10%", "0%"]);

  return (
    <footer ref={containerRef} className="relative w-full bg-[#050505] overflow-hidden py-10 md:py-0">
      <motion.div 
        style={{ scale, borderRadius, filter, opacity, y }}
        className="relative w-full bg-[#c1220d] text-[#050505] pt-12 md:pt-24 flex flex-col justify-between shadow-[0_-20px_100px_rgba(236,231,209,0.05)] origin-bottom"
      >
        <div className="w-full max-w-[2400px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
          
          {/* ── FASHION / CLOTHING CTA SECTION (DARK CONTRAST CARD) ── */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative w-full h-[400px] md:h-[500px] rounded-[2rem] md:rounded-[3rem] overflow-hidden mb-16 md:mb-24 shadow-2xl flex items-center justify-center group"
          >
            
            {/* Background Clothing Image */}
            <div className="absolute inset-0 w-full h-full bg-[#050505]">
              <Image 
                src="/images/studio.avif" 
                alt="DripDuo Studio" 
                fill 
                className="object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-1000 scale-105 group-hover:scale-100" 
              />
            </div>
            
            {/* Vignette Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/95 via-[#050505]/60 to-[#050505]/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-transparent to-[#050505]/80" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-2xl">
              <h2 className="font-serif text-[clamp(2.5rem,6vw,5rem)] leading-[0.9] tracking-tight text-[#ECE7D1] mb-6 drop-shadow-xl">
                Enter the <em className="text-[#EE3C24] not-italic">Archive.</em>
              </h2>
              <p className="font-sans text-[12px] md:text-[14px] leading-relaxed tracking-[0.05em] text-white/80 mb-10 font-medium">
                Get exclusive early access to unreleased silhouettes, studio prototypes, and heavyweight drops before anyone else.
              </p>
              
              <form onSubmit={(e) => e.preventDefault()} className="w-full flex items-center bg-[#050505]/60 backdrop-blur-md border border-white/20 rounded-full p-2 focus-within:border-white/60 transition-all shadow-2xl">
                <input 
                  type="email" 
                  placeholder="ENTER EMAIL ADDRESS" 
                  className="bg-transparent border-none outline-none font-sans text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-[#ECE7D1] placeholder-white/40 px-6 py-4 w-full font-bold"
                />
                <button type="submit" className="bg-[#ECE7D1] text-[#050505] rounded-full px-8 py-4 font-sans text-[10px] uppercase font-bold tracking-[0.15em] hover:bg-[#EE3C24] hover:text-white transition-colors flex items-center gap-2 shrink-0">
                  <span className="hidden sm:inline">Subscribe</span>
                  <ArrowRight size={14} strokeWidth={2.5} />
                </button>
              </form>
            </div>
          </motion.div>

          {/* ── LINKS & NAV SECTION ── */}
          <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-24 mb-16 md:mb-24">
            {/* Brand Mission (Left) */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/3 flex flex-col"
            >
              <Link href="/" className="mb-6 inline-block">
                {/* ── CUSTOM DX-BURST FONT APPLIED HERE ── */}
                <h2 
                  className="text-3xl md:text-4xl text-[#050505] tracking-tight"
                  style={{ 
                    fontFamily: "'Dx-Burst', serif", 
                    fontWeight: "bold", 
                    fontStyle: "italic" 
                  }}
                >
                  DRIPDUO.
                </h2>
              </Link>
              <p className="font-sans text-[13px] leading-[1.8] text-[#050505]/70 max-w-sm font-medium">
                A study in restraint. Built from obsession. We strip away the noise to leave only the perfect silhouette. Designed and engineered in Barrackpore.
              </p>
            </motion.div>

            {/* Navigation Links (Right) */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-8 lg:gap-16"
            >
              {FOOTER_SECTIONS.map((section) => (
                <FooterSection key={section.title} {...section} />
              ))}
            </motion.div>
          </div>

          {/* ── BOTTOM META SECTION ── */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 md:pb-16 relative z-10 border-t border-[#050505]/10 pt-8"
          >
            {/* Social Links */}
            <div className="flex gap-4">
              {SOCIAL_LINKS.map((social) => (
                <a 
                  key={social.name} 
                  href={social.href} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-10 h-10 rounded-full border border-[#050505]/20 bg-[#050505]/5 flex items-center justify-center text-[#050505]/70 hover:bg-[#050505] hover:text-[#ECE7D1] hover:border-[#050505] transition-all duration-300 hover:scale-110"
                >
                  {social.icon}
                </a>
              ))}
            </div>
            
            {/* Copyright & Legal */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 font-sans text-[9px] uppercase font-bold tracking-[0.15em] text-[#050505]/50">
              <p>© {new Date().getFullYear()} DRIPDUO. ALL RIGHTS RESERVED.</p>
              <div className="flex gap-6">
                <Link href="#" className="hover:text-[#050505] transition-colors">Privacy Policy</Link>
                <Link href="#" className="hover:text-[#050505] transition-colors">Terms of Service</Link>
              </div>
            </div>
          </motion.div>
        </div>

    
      </motion.div>
    </footer>
  );
}