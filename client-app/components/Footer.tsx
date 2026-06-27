"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { Plus, ArrowRight } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

const FOOTER_SECTIONS = [
  { title: "Help", links: ["Customer Care", "FAQ", "Track Your Order", "Shipping & Returns", "Exchanges"] },
  { title: "Company", links: ["About Us", "Careers", "Press", "Sustainability", "Stores"] },
  { title: "Legal", links: ["Privacy Policy", "Terms of Use", "Cookie Policy"] },
];

const SOCIAL_LINKS = [
  { name: "Instagram", href: "https://www.instagram.com/dripduo2026", icon: <FaInstagram size={18} /> },
  { name: "Facebook", href: "https://www.facebook.com/dripduo2026", icon: <FaFacebook size={18} /> },
  { name: "Twitter", href: "https://twitter.com/dripduo2026", icon: <FaTwitter size={18} /> },
];

// ── MOBILE COMPONENT ──
const MobileFooterCard = ({ section, idx }: { section: typeof FOOTER_SECTIONS[0], idx: number }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-[#050505]/15 rounded-[1.5rem] overflow-hidden bg-[#050505]/5 backdrop-blur-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between text-[#050505]"
      >
        <div className="flex items-center gap-5">
          <span className="font-sans text-[10px] font-bold text-[#ECE7D1] tracking-[0.25em]">
            0{idx + 1}
          </span>
          <span className="font-serif text-3xl">{section.title}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: "backOut" }}
          className="text-[#050505] bg-[#050505]/10 p-2 rounded-full"
        >
          <Plus size={16} strokeWidth={2.5} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-0 flex flex-col gap-5 border-t border-[#050505]/10 mt-2">
              {section.links.map((link) => (
                <Link
                  key={link}
                  href="#"
                  className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#050505]/70 hover:text-[#ECE7D1] transition-colors flex items-center gap-3"
                >
                  <ArrowRight size={10} className="text-[#ECE7D1]" />
                  {link}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function Footer() {
  const containerRef = useRef<HTMLDivElement>(null);

  // The Magic Transforms: Morphing from a floating blurry pill into a massive sharp canvas
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const borderRadius = useTransform(scrollYProgress, [0, 1], ["120px", "0px"]);
  const filter = useTransform(scrollYProgress, [0, 1], ["blur(15px)", "blur(0px)"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ["10%", "0%"]);

  return (
    <footer ref={containerRef} className="relative w-full bg-[#050505] overflow-hidden py-10 md:py-0 mt-10 md:mt-0">
      <motion.div 
        style={{ scale, borderRadius, filter, opacity, y }}
        className="relative w-full bg-[#c1220d] text-[#050505] flex flex-col justify-between shadow-[0_-20px_100px_rgba(236,231,209,0.05)] origin-bottom"
      >
        
        {/* ─────────────────────────────────────────────────────────
            DESKTOP VIEW: EDGY / BRUTALIST WIREFRAME GRID
            ───────────────────────────────────────────────────────── */}
        <div className="hidden md:flex flex-col w-full border-t border-[#050505]/20 pt-16">
          
          {/* Wireframe Data Grid */}
          <div className="grid grid-cols-12 w-full divide-x divide-[#050505]/20 border-b border-[#050505]/20">
            
            {/* Newsletter Column */}
            <div className="col-span-5 p-12 lg:p-16 flex flex-col justify-between relative group overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#ECE7D1]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-6 h-px bg-[#ECE7D1]" />
                  <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-[#ECE7D1] font-bold">Dispatch</span>
                </div>
                <h3 className="font-serif italic text-5xl lg:text-6xl mb-6 text-[#050505] leading-tight">
                  Join the<br/>Archive
                </h3>
                <p className="font-sans text-[11px] uppercase tracking-widest text-[#050505]/60 max-w-sm leading-relaxed font-bold">
                  Subscribe for exclusive drops, early access, and editorial insights directly to your inbox.
                </p>
              </div>
              
              <div className="relative mt-16 z-10 group/input">
                <input
                  type="email"
                  placeholder="ENTER EMAIL ADDRESS"
                  className="w-full bg-transparent border-b border-[#050505]/30 py-4 font-sans text-[12px] uppercase tracking-[0.25em] text-[#050505] outline-none focus:border-[#ECE7D1] transition-colors placeholder:text-[#050505]/40 font-bold"
                />
                <button className="absolute right-0 top-1/2 -translate-y-1/2 text-[#050505]/50 group-focus-within/input:text-[#ECE7D1] hover:text-[#ECE7D1] transition-all hover:translate-x-1">
                  <ArrowRight size={20} strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* Links Columns */}
            {FOOTER_SECTIONS.map((section) => (
              <div key={section.title} className="col-span-2 p-12 flex flex-col hover:bg-[#050505]/5 transition-colors duration-500">
                <h4 className="font-sans text-[9px] font-bold uppercase tracking-[0.3em] text-[#ECE7D1] mb-10">
                  {section.title}
                </h4>
                <ul className="flex flex-col gap-6">
                  {section.links.map((link) => (
                    <li key={link}>
                      <Link
                        href="#"
                        className="font-serif text-xl lg:text-2xl text-[#050505]/70 hover:text-[#ECE7D1] hover:italic transition-all duration-300 relative inline-block group/link font-medium"
                      >
                        {link}
                        {/* Fix: Moved line from middle of text (-translate-y-1/2 top-1/2) to bottom (-bottom-1) */}
                        <span className="absolute left-0 -bottom-1 w-0 h-px bg-[#ECE7D1] transition-all duration-300 group-hover/link:w-full opacity-50" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Socials Column (Vertical Layout) */}
            <div className="col-span-1 p-12 flex flex-col items-center justify-between bg-[#050505]/[0.02]">
              <h4 className="font-sans text-[9px] font-bold uppercase tracking-[0.3em] text-[#050505]/40 [writing-mode:vertical-lr] rotate-180 mb-8">
                Connect
              </h4>
              <div className="flex flex-col gap-6 mt-auto">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-12 h-12 rounded-full border border-[#050505]/20 flex items-center justify-center text-[#050505]/60 hover:text-[#050505] hover:bg-[#ECE7D1] hover:border-[#ECE7D1] transition-all duration-400 hover:scale-110 shadow-lg"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* MASSIVE ARCHITECTURAL WORDMARK */}
          <div className="w-full flex items-center justify-center pt-16 pb-12 overflow-hidden relative">
            <h1 className="text-[16vw] leading-[0.75] font-serif tracking-tighter text-[#050505] select-none">
              DRIPDUO
            </h1>
            {/* Blueprint targeting lines */}
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-[#050505]/10 pointer-events-none" />
            <div className="absolute left-0 right-0 top-1/2 h-px bg-[#050505]/10 pointer-events-none" />
          </div>

          {/* Technical Bottom Bar */}
          <div className="flex justify-between items-center px-12 py-6 border-t border-[#050505]/20 font-sans text-[8px] uppercase tracking-[0.3em] font-bold text-[#050505]/50 bg-[#050505]/5">
            <p>BARRACKPORE, INDIA // EST. 2026</p>
            <div className="flex items-center gap-6">
              <Link href="#" className="hover:text-[#ECE7D1] transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-[#ECE7D1] transition-colors">Terms</Link>
            </div>
            <p>© {new Date().getFullYear()} DRIPDUO. ALL RIGHTS RESERVED.</p>
          </div>
        </div>


        {/* ─────────────────────────────────────────────────────────
            MOBILE VIEW: TACTILE BENTO ACCORDION
            ───────────────────────────────────────────────────────── */}
        <div className="flex md:hidden flex-col w-full px-4 pt-16 pb-8 border-t border-[#050505]/20">
          
          {/* Newsletter Bento Block */}
          <div className="mb-10 bg-[#050505]/5 border border-[#050505]/15 rounded-[1.5rem] p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-4 h-px bg-[#ECE7D1]" />
              <span className="font-sans text-[8px] uppercase tracking-[0.3em] font-bold text-[#ECE7D1]">Dispatch</span>
            </div>
            <h3 className="font-serif italic text-4xl mb-4 text-[#050505]">Join the Archive</h3>
            <p className="font-sans text-[10px] uppercase tracking-widest text-[#050505]/60 mb-8 leading-relaxed font-bold">
              Subscribe for exclusive drops and editorial insights.
            </p>
            
            <div className="relative group">
              <input
                type="email"
                placeholder="ENTER EMAIL"
                className="w-full bg-transparent border-b border-[#050505]/20 py-3 font-sans text-[11px] uppercase tracking-[0.2em] text-[#050505] outline-none focus:border-[#ECE7D1] transition-colors placeholder:text-[#050505]/40 font-bold"
              />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 text-[#050505]/60 hover:text-[#ECE7D1] p-2 transition-colors">
                <ArrowRight size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Interactive Tactile Accordion Cards */}
          <div className="flex flex-col gap-3 mb-12">
            {FOOTER_SECTIONS.map((section, idx) => (
              <MobileFooterCard key={section.title} section={section} idx={idx} />
            ))}
          </div>

          {/* Socials & Legal Footer */}
          <div className="flex flex-col items-center border-t border-[#050505]/15 pt-10">
            <div className="flex gap-4 mb-12">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-12 h-12 rounded-full border border-[#050505]/15 bg-[#050505]/5 flex items-center justify-center text-[#050505]/70 hover:text-[#050505] hover:bg-[#ECE7D1] hover:border-[#ECE7D1] transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>

            <h1 className="text-[17vw] leading-[0.8] font-serif tracking-tighter text-[#050505] select-none mb-6">
              DRIPDUO
            </h1>
            
            <div className="flex flex-col items-center gap-3 font-sans text-[8px] uppercase font-bold tracking-[0.3em] text-[#050505]/50 text-center">
              <p>BARRACKPORE, INDIA</p>
              <div className="flex gap-4">
                <Link href="#" className="hover:text-[#ECE7D1] transition-colors">Privacy</Link>
                <Link href="#" className="hover:text-[#ECE7D1] transition-colors">Terms</Link>
              </div>
              <p className="mt-4 opacity-70">© {new Date().getFullYear()} DRIPDUO.</p>
            </div>
          </div>

        </div>
      </motion.div>
    </footer>
  );
}