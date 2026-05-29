"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { HOME_CATEGORIES } from "@/constants";
import { SketchHighlight } from "@/components/ui/sketch-highlight";
import { getProductsForLookbookSection } from "@/services/products";
import Reveal from "@/components/Reveal";
import Lookbook from "@/components/Lookbook";
import Image from "next/image";

export type FeaturedProduct = {
  id: string;
  name: string;
  product_images: { url: string; is_primary: boolean; }[];
};

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`;

function useCounter(end: number, duration = 1800, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf: number;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      setVal(Math.floor(ease * end));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, duration, start]);
  return val;
}

function Stat({ value, suffix, label, trigger }: { value: number; suffix: string; label: string; trigger: boolean }) {
  const count = useCounter(value, 1800, trigger);
  return (
    <div className="flex flex-col gap-1 items-center text-center md:items-start md:text-left">
      <span className="font-serif text-[clamp(2.5rem,5vw,4rem)] leading-none text-[#ECE7D1] tabular-nums">
        {count}<span className="text-[#EE3C24]">{suffix}</span>
      </span>
      <span className="font-sans text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-[#6B6A5E] mt-3">{label}</span>
    </div>
  );
}

// ── CATEGORIES CAROUSEL ──
function AppleCardCarousel({ categories }: { categories: typeof HOME_CATEGORIES }) {
  const trackRef = useRef<HTMLDivElement>(null);
  
  return (
    <div className="relative w-full">
      <div
        ref={trackRef}
        className="flex overflow-x-auto no-scroll px-6 md:px-12 pb-8 cursor-grab active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ gap: 20, scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
      >
        {categories.map((cat, i) => (
          <motion.div
            key={cat.name}
            className="relative shrink-0 overflow-hidden bg-[#0D0D0B] border border-[#1A1A17] w-[85vw] sm:w-[320px] h-[450px] md:h-[500px]"
            style={{ scrollSnapAlign: "start" }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href={`/products?category=${cat.name.toLowerCase()}`} className="block w-full h-full">
              <Image src={cat.Image} alt={cat.name} fill className="object-cover transition-transform duration-[2s] hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
              <div className="absolute top-6 left-6">
                <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#ECE7D1]">0{i + 1}</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="font-serif text-3xl md:text-4xl text-[#ECE7D1] leading-tight">{cat.name}</h3>
                <div className="mt-5 flex items-center gap-3">
                  <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-[#EE3C24]">Explore</span>
                  <div className="h-px flex-1 bg-[#ECE7D1]/20" />
                  <ArrowRight size={14} strokeWidth={1.5} className="text-[#EE3C24]" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
        <div className="shrink-0 w-6" />
      </div>
    </div>
  );
}

export default function Home() {
  const [heroReady, setHeroReady] = useState(false);
  const [lookbookProducts, setLookbookProducts] = useState<FeaturedProduct[]>([]);
  const [statsVisible, setStatsVisible] = useState(false);

  const statsRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const bannerRef = useRef<HTMLElement>(null);

  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const { scrollYProgress: bannerScroll } = useScroll({ target: bannerRef, offset: ["start end", "end start"] });

  const heroParallax = useTransform(heroScroll, [0, 1], ["0%", "25%"]);
  const bannerParallax = useTransform(bannerScroll, [0, 1], ["-20%", "20%"]);

  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 100);
    const fetchData = async () => {
      try {
        const lookbook = await getProductsForLookbookSection();
        setLookbookProducts(lookbook);
      } catch (e) { console.error(e); }
    };
    fetchData();
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!statsRef.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStatsVisible(true); obs.disconnect(); } }, { threshold: 0.3 });
    obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <main className="w-full overflow-x-clip bg-[#050505] text-[#ECE7D1]">

      {/* ── HERO ── */}
      {/* 100svh prevents jumping on mobile iOS/Android when scrollbars vanish */}
      <section ref={heroRef} className="relative h-[100svh] w-full overflow-hidden">
        <motion.div className="absolute inset-0 w-full h-[120%]" style={{ y: heroParallax }}>
          <video
            src="https://ik.imagekit.io/dripduo2026/hero_video2.mp4?tr=q-60,f-auto"
            autoPlay loop muted playsInline
            className={`absolute inset-0 h-full w-full object-cover object-[center_25%] transition-transform duration-[3s] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${heroReady ? "scale-100" : "scale-105"}`}
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />
        <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" style={{ backgroundImage: NOISE_SVG }} />

    

        {/* Hero Title & CTA */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end px-4 md:px-12 pb-20 md:pb-24 z-10 text-center">
          <div className="overflow-hidden">
            <Reveal>
              <h1 className="font-serif italic leading-[0.8] tracking-tight text-[#ECE7D1] drop-shadow-2xl whitespace-nowrap" style={{ fontSize: "clamp(3.2rem,14vw,12rem)" }}>
                New
              </h1>
            </Reveal>
          </div>
          <div className="overflow-hidden">
            <Reveal className="delay-100">
              <h1 className="font-serif italic leading-[0.8] tracking-tight text-[#ECE7D1] drop-shadow-2xl whitespace-nowrap" style={{ fontSize: "clamp(3.2rem,14vw,12rem)" }}>
                <SketchHighlight type="underline" delay={1200} color="#EE3C24">Collection</SketchHighlight>
              </h1>
            </Reveal>
          </div>

          <Reveal className="delay-300 mt-12 md:mt-16 flex flex-col items-center">
            <Link href="/products" className="inline-flex items-center gap-4 bg-[#ECE7D1] text-black font-sans text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] px-12 py-5 hover:bg-[#EE3C24] hover:text-white transition-all duration-500 rounded-sm">
              Discover Now
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── EDITORIAL LOOKBOOK ── */}
      <section className="w-full py-20 md:py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between px-6 md:px-12 mb-10 md:mb-16 gap-6">
          <Reveal>
            <div>
              <p className="font-sans text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-[#EE3C24] mb-4 flex items-center gap-3">
                <span className="w-8 h-px bg-[#EE3C24]" />Campaign 01
              </p>
              <h2 className="font-serif leading-[1] text-[#ECE7D1]" style={{ fontSize: "clamp(2.5rem,5.5vw,4.5rem)" }}>
                The Lookbook
              </h2>
            </div>
          </Reveal>
          <Reveal className="delay-100">
            <Link href="/products" className="inline-flex font-sans text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-[#6B6A5E] hover:text-[#EE3C24] transition-colors border-b border-[#1A1A17] hover:border-[#EE3C24] pb-1">
              Shop All Pieces
            </Link>
          </Reveal>
        </div>

        <div className="w-full overflow-x-auto snap-x snap-mandatory cursor-grab active:cursor-grabbing pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="w-max pl-6 md:pl-12 flex gap-4 md:gap-6">
            {lookbookProducts.length > 0 ? (
              lookbookProducts.map((product) => (
                <div key={product.id} className="snap-center md:snap-start">
                  <Lookbook product={product} />
                </div>
              ))
            ) : (
              <div className="w-[85vw] h-[60vh] flex items-center justify-center bg-[#0D0D0B] border border-[#1A1A17]">
                <p className="font-sans text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-[#6B6A5E] animate-pulse">Loading Archive…</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── SHOP BY CATEGORY ── */}
      <section className="w-full py-20 md:py-32 bg-[#0D0D0B] border-y border-[#1A1A17]">
        <div className="px-6 md:px-12 mb-12 flex items-end justify-between">
          <Reveal>
            <h2 className="font-serif leading-[1.02] text-[#ECE7D1]" style={{ fontSize: "clamp(2.5rem,5vw,4.5rem)" }}>
              Shop by<br /><em><SketchHighlight type="circle" delay={300} color="#EE3C24">Category</SketchHighlight></em>
            </h2>
          </Reveal>
        </div>
        <Reveal>
          <AppleCardCarousel categories={HOME_CATEGORIES} />
        </Reveal>
      </section>

      {/* ── EDITORIAL BANNER ── */}
      <section ref={bannerRef} className="relative h-[85svh] w-full overflow-hidden">
        <motion.div className="absolute inset-0 w-full h-[140%] top-[-20%]" style={{ y: bannerParallax }}>
          <Image src="/images/mockup.png" alt="Editorial Banner" fill className="absolute inset-0 object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: NOISE_SVG, opacity: 0.15 }} />

        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 pointer-events-none">
          <Reveal className="delay-100">
            <h2 className="font-serif italic leading-[0.85] tracking-tight text-[#ECE7D1] mb-6" style={{ fontSize: "clamp(3rem,9vw,8.5rem)" }}>
              Redefine<br />the Silhouette
            </h2>
          </Reveal>
          <Reveal className="delay-200">
            <p className="font-sans text-[11px] md:text-[13px] leading-[1.9] tracking-[0.03em] text-[#C1BCA8] max-w-sm mx-auto mb-10">
              A collection built from obsession. Drop into the archive and find your next statement piece.
            </p>
          </Reveal>
          <Reveal className="delay-300 pointer-events-auto">
            <Link href="/products" className="inline-flex items-center gap-4 bg-transparent border border-[#ECE7D1] px-10 py-4 font-sans text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-[#ECE7D1] hover:bg-[#ECE7D1] hover:text-black transition-all duration-500 rounded-sm">
              Shop The Look
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── PHILOSOPHY & FEATURES ── */}
      <section className="w-full border-t border-[#1A1A17]">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#1A1A17]">
          <Reveal className="flex flex-col justify-center px-6 md:px-16 py-20 md:py-32">
            <p className="font-sans text-[9px] md:text-[10px] tracking-[0.25em] uppercase text-[#EE3C24] mb-6 md:mb-8">Our Philosophy</p>
            <h2 className="font-serif leading-[0.9] tracking-tight text-[#ECE7D1] mb-6 md:mb-8" style={{ fontSize: "clamp(2.5rem,5vw,4.5rem)" }}>
              Unapologetic Style.<br />Uncompromising<br /><em className="text-[#EE3C24]">Quality.</em>
            </h2>
            <p className="font-sans text-[12px] md:text-[13px] leading-[1.9] text-[#969382] max-w-md">
              Every thread is a choice. Every silhouette, a statement. We build garments for those who refuse to settle — constructed from ultra-dense cotton, engineered to hold shape through every season.
            </p>
          </Reveal>
          
          <div className="flex flex-col divide-y divide-[#1A1A17]">
            {[
              { num: "01", title: "Ultra-Dense Construction", body: "240 GSM heavyweight cotton. Built to outlast trends and hold its shape." },
              { num: "02", title: "Meticulous Silhouettes", body: "Drop shoulders. Tight necklines. Balanced hems. Every cut is considered." },
              { num: "03", title: "Zero Compromises", body: "From sourcing to stitching — every step is held to the highest standard." },
            ].map((feat) => (
              <Reveal key={feat.num} className="p-8 md:p-12 flex flex-col justify-center flex-1 hover:bg-[#0A0A09] transition-colors">
                <span className="font-sans text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-[#EE3C24] mb-3 md:mb-4">{feat.num}</span>
                <h3 className="font-serif text-xl md:text-2xl text-[#ECE7D1] mb-2">{feat.title}</h3>
                <p className="font-sans text-[11px] md:text-[12px] leading-[1.8] text-[#6B6A5E]">{feat.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section ref={statsRef} className="border-t border-[#1A1A17] bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
          {[
            { value: 240, suffix: "+", label: "GSM Heavyweight" },
            { value: 100, suffix: "%", label: "Premium Cotton" },
            { value: 30, suffix: "d", label: "Easy Returns" },
            { value: 5000, suffix: "+", label: "Happy Customers" },
          ].map((s) => (
            <Stat key={s.label} {...s} trigger={statsVisible} />
          ))}
        </div>
      </section>

      {/* ── EMAIL JOIN ── */}
      <section className="w-full border-t border-[#1A1A17] bg-[#0D0D0B]">
        <div className="max-w-3xl mx-auto px-6 md:px-12 py-24 text-center">
          <Reveal>
            <h2 className="font-serif leading-[0.92] tracking-tight text-[#ECE7D1] mb-4 md:mb-6" style={{ fontSize: "clamp(2.5rem,6vw,4rem)" }}>
              Join the <em className="text-[#EE3C24]">Edit.</em>
            </h2>
            <p className="font-sans text-[11px] md:text-[13px] tracking-[0.05em] text-[#969382] mb-10 md:mb-12">
              New drops. Exclusive access. Zero noise.
            </p>
          </Reveal>
          <Reveal className="delay-150">
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row items-stretch border border-[#403F38] hover:border-[#ECE7D1] transition-colors duration-400 group">
              <input type="email" placeholder="YOUR EMAIL ADDRESS" className="flex-1 bg-transparent border-none outline-none font-sans text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-[#ECE7D1] placeholder-[#403F38] px-6 py-5 text-center sm:text-left" />
              <button type="submit" className="bg-[#ECE7D1] text-black font-sans text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] px-10 py-5 hover:bg-[#EE3C24] hover:text-white transition-colors duration-300 shrink-0">
                Subscribe
              </button>
            </form>
          </Reveal>
        </div>
      </section>
    </main>
  );
}