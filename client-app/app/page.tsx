"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ArrowDown } from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { HOME_CATEGORIES } from "@/constants";
import { SketchHighlight } from "@/components/SktechHighlight";
import HomeProductCard from "@/components/HomeProductCard";
import { getProductsforFeaturedSection, getProductsForLookbookSection } from "@/services/products";
import Reveal from "@/components/Reveal";
import Lookbook from "@/components/Lookbook";
import Image from "next/image";

export type FeaturedProduct = {
  id: string;
  name: string;
  product_images: {
    url: string;
    is_primary: boolean;
  }[];
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
    <div className="flex flex-col gap-1">
      <span className="font-serif text-[clamp(2.8rem,5vw,5rem)] leading-none text-[#ECE7D1] tabular-nums">
        {count}<span className="text-[#EE3C24]">{suffix}</span>
      </span>
      <span className="font-sans text-[11px] tracking-[0.18em] uppercase text-[#6B6A5E]">{label}</span>
    </div>
  );
}

// ── APPLE CARD CAROUSEL ──
const CARD_WIDTH = 320;
const CARD_GAP = 20;

function AppleCardCarousel({ categories }: { categories: typeof HOME_CATEGORIES }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const scrollStartX = useRef(0);

  const scrollTo = (idx: number) => {
    if (!trackRef.current) return;
    const clampedIdx = Math.max(0, Math.min(idx, categories.length - 1));
    const offset = clampedIdx * (CARD_WIDTH + CARD_GAP);
    trackRef.current.scrollTo({ left: offset, behavior: "smooth" });
    setActiveIdx(clampedIdx);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    scrollStartX.current = trackRef.current?.scrollLeft ?? 0;
    trackRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !trackRef.current) return;
    const dx = dragStartX.current - e.clientX;
    trackRef.current.scrollLeft = scrollStartX.current + dx;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging || !trackRef.current) return;
    setIsDragging(false);
    const dx = dragStartX.current - e.clientX;
    if (Math.abs(dx) > 60) scrollTo(dx > 0 ? activeIdx + 1 : activeIdx - 1);
    else scrollTo(activeIdx);
  };

  return (
    <div className="relative w-full">
      {/* Track */}
      <div
        ref={trackRef}
        className="flex overflow-x-auto no-scroll px-6 md:px-12 pb-4 cursor-grab active:cursor-grabbing"
        style={{ gap: CARD_GAP, scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => setIsDragging(false)}
      >
        {categories.map((cat, i) => (
          <motion.div
            key={cat.name}
            className="relative shrink-0 rounded-2xl overflow-hidden bg-[#0D0D0B] border border-[#1A1A17]"
            style={{
              width: CARD_WIDTH,
              height: 420,
              scrollSnapAlign: "start",
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href={`/products?category=${cat.name.toLowerCase()}`} className="block w-full h-full">
              <Image
                src={cat.Image}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              {/* Card number */}
              <div className="absolute top-5 left-5">
                <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#6B6A5E]">0{i + 1}</span>
              </div>

              {/* Card content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="font-sans text-[9px] uppercase tracking-[0.25em] text-[#EE3C24] mb-2">Shop Now</p>
                <h3 className="font-serif text-3xl text-[#ECE7D1] leading-tight">{cat.name}</h3>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#ECE7D1]/20" />
                  <ArrowRight size={14} strokeWidth={1.5} className="text-[#EE3C24]" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
        {/* Trailing spacer */}
        <div className="shrink-0 w-6" />
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-6 px-6 md:px-12">
        {categories.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`transition-all duration-300 h-px ${i === activeIdx ? "w-8 bg-[#EE3C24]" : "w-4 bg-[#403F38]"}`}
          />
        ))}
      </div>
    </div>
  );
}

// ── BTS TEASER STRIP ──
const BTS_FRAMES = [
  { label: "Studio Setup", note: "Behind the lens" },
  { label: "Fabric Selection", note: "Sourcing the weight" },
  { label: "Sample Review", note: "Quality control" },
];

export default function Home() {
  const [heroReady, setHeroReady] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
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
        const [featured, lookbook] = await Promise.all([
          getProductsforFeaturedSection(),
          getProductsForLookbookSection(),
        ]);
        setFeaturedProducts(featured);
        setLookbookProducts(lookbook);
      } catch (e) { console.error(e); }
    };
    fetchData();
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!statsRef.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStatsVisible(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <main className="w-full overflow-x-clip bg-[#050505] text-[#ECE7D1]">

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative h-[96vh] w-full overflow-hidden">
        <motion.div className="absolute inset-0 w-full h-[120%]" style={{ y: heroParallax }}>
          <video
            src="https://ik.imagekit.io/dripduo2026/hero_video2.mp4?tr=q-60,f-auto"
            autoPlay loop muted playsInline
            className={`absolute inset-0 h-full w-full object-cover object-[center_25%] transition-transform duration-[3s] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${heroReady ? "scale-100" : "scale-105"}`}
          />
        </motion.div>

        <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none hidden md:block" style={{ backgroundImage: NOISE_SVG }} />

        {/* Hero copy */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-start justify-end px-6 md:px-12 pb-20 md:pb-24 z-10">
          <Reveal>
            <p className="font-sans text-[11px] tracking-[0.22em] uppercase text-[#C1BCA8] mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-[#EE3C24]" />
              Engineered for those who demand excellence
            </p>
          </Reveal>

          <div className="overflow-hidden">
            <Reveal>
              <h1 className="font-serif italic leading-[0.82] tracking-[-0.03em] text-[#ECE7D1] drop-shadow-2xl" style={{ fontSize: "clamp(5rem,16vw,13rem)" }}>
                New
              </h1>
            </Reveal>
          </div>
          <div className="overflow-hidden">
            <Reveal className="delay-100">
              <h1 className="font-serif italic leading-[0.82] tracking-[-0.03em] text-[#ECE7D1] drop-shadow-2xl" style={{ fontSize: "clamp(5rem,16vw,13rem)" }}>
                <SketchHighlight type="underline" delay={1200} color="#EE3C24">Collection</SketchHighlight>
              </h1>
            </Reveal>
          </div>

          <Reveal className="delay-300 mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Link href="/products" className="group inline-flex items-center gap-4 bg-[#EE3C24] text-black font-sans text-[11px] font-bold uppercase tracking-[0.18em] px-10 py-5 hover:bg-[#ECE7D1] transition-colors duration-500 rounded-sm">
              Discover Now
              <ArrowRight size={13} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link href="/products" className="font-sans text-[11px] tracking-[0.18em] uppercase text-[#C1BCA8] hover:text-[#ECE7D1] transition-colors flex items-center gap-2 border-b border-[#969382] pb-px hover:border-[#ECE7D1] py-2">
              View Lookbook
            </Link>
          </Reveal>
        </div>

        <div className="absolute bottom-8 right-8 md:right-12 z-10 flex flex-col items-center gap-2 animate-bounce">
          <ArrowDown size={12} strokeWidth={1} className="text-[#6B6A5E]" />
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="overflow-hidden bg-[#EE3C24] py-3">
        <div className="marquee-track">
          {[...Array(7)].map((_, i) => (
            <span key={i} className="font-sans whitespace-nowrap px-8 text-[11px] tracking-[0.2em] uppercase text-black font-semibold">
              Free Shipping Over ₹1999 &nbsp;★&nbsp; New Arrivals Weekly &nbsp;★&nbsp; Easy 30-Day Returns &nbsp;★&nbsp; Premium Heavyweight Cotton &nbsp;★&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <div ref={statsRef} className="border-b border-[#1A1A17] bg-[#0D0D0B]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-14 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x divide-[#1A1A17]">
          {[
            { value: 240, suffix: "+", label: "GSM Heavyweight" },
            { value: 100, suffix: "%", label: "Premium Cotton" },
            { value: 30, suffix: "d", label: "Easy Returns" },
            { value: 5000, suffix: "+", label: "Happy Customers" },
          ].map((s) => (
            <div key={s.label} className="md:px-10 first:pl-0 last:pr-0">
              <Stat {...s} trigger={statsVisible} />
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURED PIECES ── */}
      <section className="relative w-full overflow-hidden pt-20 md:pt-32">
        <div className="px-6 md:px-12 mb-12 flex items-end justify-between">
          <Reveal>
            <div>
              <p className="font-sans text-[11px] tracking-[0.22em] uppercase text-[#EE3C24] mb-3 flex items-center gap-2">
                <span className="w-6 h-px bg-[#EE3C24]" />Archive
              </p>
              <h2 className="font-serif leading-[0.95] text-[#ECE7D1]" style={{ fontSize: "clamp(2.5rem,6vw,5rem)" }}>
                Featured<br /><em><SketchHighlight type="underline" delay={300} color="#EE3C24">Pieces</SketchHighlight></em>
              </h2>
            </div>
          </Reveal>
          <Reveal className="delay-200 hidden md:block">
            <Link href="/products" className="group font-sans text-[11px] tracking-[0.16em] uppercase text-[#6B6A5E] hover:text-[#EE3C24] transition-colors flex items-center gap-2 p-4">
              View All <ArrowRight size={12} strokeWidth={1.5} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        {featuredProducts.length >= 4 ? (
          <div className="w-full">
            <div className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-0 w-full h-auto md:h-[500px] lg:h-[600px] border-t border-l border-[#1A1A17]">
              <Reveal className="col-span-2 md:col-span-2 md:row-span-2 h-[50vh] md:h-full w-full min-h-0 border-r border-b border-[#1A1A17]">
                <HomeProductCard product={featuredProducts[0]} />
              </Reveal>
              <Reveal className="col-span-1 h-[30vh] md:h-full w-full delay-100 min-h-0 border-r border-b border-[#1A1A17]">
                <HomeProductCard product={featuredProducts[1]} />
              </Reveal>
              <Reveal className="col-span-1 h-[30vh] md:h-full w-full delay-150 min-h-0 border-r border-b border-[#1A1A17]">
                <HomeProductCard product={featuredProducts[2]} />
              </Reveal>
              <Reveal className="col-span-2 h-[40vh] md:h-full w-full delay-200 min-h-0 border-r border-b border-[#1A1A17]">
                <HomeProductCard product={featuredProducts[3]} />
              </Reveal>
            </div>
          </div>
        ) : (
          <div className="w-full h-[50vh] flex items-center justify-center border-t border-[#1A1A17]">
            <p className="font-sans text-[11px] tracking-[0.16em] uppercase text-[#6B6A5E] animate-pulse">Loading Archive…</p>
          </div>
        )}
      </section>

      {/* ── SHOP BY CATEGORY — APPLE CARD CAROUSEL ── */}
      <section className="w-full pt-20 md:pt-32 border-t border-[#1A1A17] mt-20 md:mt-32">
        <div className="px-6 md:px-12 mb-12 flex items-end justify-between">
          <Reveal>
            <div>
              <p className="font-sans text-[11px] tracking-[0.22em] uppercase text-[#EE3C24] mb-3 flex items-center gap-2">
                <span className="w-6 h-px bg-[#EE3C24]" />Categories
              </p>
              <h2 className="font-serif leading-[1.02] text-[#ECE7D1]" style={{ fontSize: "clamp(2.5rem,5vw,4.5rem)" }}>
                Shop by<br /><em><SketchHighlight type="circle" delay={300} color="#EE3C24">Category</SketchHighlight></em>
              </h2>
            </div>
          </Reveal>
          <Reveal className="delay-150">
            <Link href="/products" className="hidden md:flex font-sans text-[11px] tracking-[0.16em] uppercase text-[#EE3C24] hover:underline underline-offset-4 transition-all p-4">
              View All
            </Link>
          </Reveal>
        </div>
        <Reveal>
          <AppleCardCarousel categories={HOME_CATEGORIES} />
        </Reveal>
      </section>

      {/* ── PHILOSOPHY ── */}
      <section className="w-full border-t border-[#1A1A17] mt-20 md:mt-32 grid grid-cols-1 md:grid-cols-2">
        <Reveal className="flex flex-col justify-between px-6 md:px-12 py-16 md:py-24 border-r border-[#1A1A17]">
          <p className="font-sans text-[11px] tracking-[0.22em] uppercase text-[#EE3C24] flex items-center gap-2 mb-12">
            <span className="w-6 h-px bg-[#EE3C24]" />Our Philosophy
          </p>
          <div>
            <h2 className="font-serif leading-[0.88] tracking-[-0.02em] text-[#ECE7D1] mb-8" style={{ fontSize: "clamp(3rem,6vw,6rem)" }}>
              Unapologetic<br /><em className="text-[#EE3C24]">Style.</em><br />Uncompromising<br /><em>Quality.</em>
            </h2>
            <p className="font-sans text-[13px] leading-[1.9] tracking-[0.03em] text-[#969382] max-w-sm">
              Every thread is a choice. Every silhouette, a statement. We build garments for those who refuse to settle — constructed from ultra-dense cotton, engineered to hold shape through every season.
            </p>
          </div>
          <Link href="/about" className="group mt-12 inline-flex items-center gap-3 font-sans text-[11px] tracking-[0.18em] uppercase text-[#ECE7D1] border-b border-[#ECE7D1] pb-px w-fit hover:text-[#EE3C24] hover:border-[#EE3C24] transition-all duration-300 py-2">
            About DRIPDUO <ArrowRight size={12} strokeWidth={1.5} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
        <Reveal className="delay-150 relative h-[60vw] md:h-auto overflow-hidden">
          <Image src="/images/mockup.png" alt="Mockup Image" fill className="absolute inset-0 object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20" />
        </Reveal>
      </section>

      {/* ── BTS TEASER ── */}
      <section className="w-full border-t border-[#1A1A17] mt-20 md:mt-32 py-20 md:py-28 bg-[#0D0D0B]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-end justify-between mb-12">
            <Reveal>
              <div>
                <p className="font-sans text-[11px] tracking-[0.22em] uppercase text-[#EE3C24] mb-3 flex items-center gap-2">
                  <span className="w-6 h-px bg-[#EE3C24]" />Behind the Scenes
                </p>
                <h2 className="font-serif leading-[0.95] text-[#ECE7D1]" style={{ fontSize: "clamp(2rem,4vw,3.5rem)" }}>
                  How the<br /><em>archive is made.</em>
                </h2>
              </div>
            </Reveal>
            <Reveal className="delay-200 hidden md:block">
              <Link href="/behind-the-scenes" className="group font-sans text-[11px] tracking-[0.16em] uppercase text-[#6B6A5E] hover:text-[#EE3C24] transition-colors flex items-center gap-2">
                See More <ArrowRight size={12} strokeWidth={1.5} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-l border-[#1A1A17]">
            {BTS_FRAMES.map((frame, i) => (
              <Reveal key={frame.label} className={`delay-${i * 100}`}>
                <div className="border-r border-b border-[#1A1A17] group cursor-pointer">
                  <div className="relative aspect-video bg-[#050505] overflow-hidden">
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                      {/* Film grain overlay */}
                      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: NOISE_SVG }} />
                      <div className="w-12 h-12 border border-[#1A1A17] rounded-full flex items-center justify-center group-hover:border-[#EE3C24] transition-colors">
                        <div className="w-0 h-0 border-t-4 border-b-4 border-l-6 border-transparent border-l-[#EE3C24] ml-1" />
                      </div>
                      <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#403F38] group-hover:text-[#6B6A5E] transition-colors">{frame.note}</span>
                    </div>
                    {/* Grain texture */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="p-5 border-t border-[#1A1A17]">
                    <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#EE3C24] mb-1">0{i+1}</p>
                    <p className="font-sans text-[11px] uppercase tracking-[0.12em] text-[#ECE7D1]">{frame.label}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="delay-300 mt-8 flex justify-center md:hidden">
            <Link href="/behind-the-scenes" className="group font-sans text-[11px] tracking-[0.16em] uppercase text-[#6B6A5E] hover:text-[#EE3C24] transition-colors flex items-center gap-2">
              See all behind the scenes <ArrowRight size={12} strokeWidth={1.5} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="w-full border-t border-[#1A1A17]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mt-0 border-t border-[#1A1A17]">
            {[
              { num: "01", title: "Ultra-Dense Construction", body: "240 GSM heavyweight cotton. Built to outlast trends and hold its shape wash after wash." },
              { num: "02", title: "Meticulous Silhouettes", body: "Drop shoulders. Tight necklines. Balanced hems. Every cut is a considered decision." },
              { num: "03", title: "Zero Compromises", body: "From sourcing to stitching — every step is held to the highest possible standard." },
            ].map((feat) => (
              <Reveal key={feat.num} className="border-b md:border-b-0 md:border-r border-[#1A1A17] py-10 pr-0 md:pr-10 last:border-r-0 last:pl-0 md:first:pl-0 md:pl-10 flex flex-col gap-5">
                <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-[#EE3C24]">{feat.num}</span>
                <h3 className="font-serif text-2xl md:text-3xl text-[#ECE7D1] leading-tight">{feat.title}</h3>
                <p className="font-sans text-[13px] leading-[1.9] tracking-[0.03em] text-[#969382]">{feat.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── EDITORIAL BANNER ── */}
      <section ref={bannerRef} className="relative h-[90svh] w-full overflow-hidden border-t border-b border-[#1A1A17]">
        <motion.div className="absolute inset-0 w-full h-[140%] top-[-20%]" style={{ y: bannerParallax }}>
          <Image src="/images/mockup.png" alt="Editorial Banner" fill className="absolute inset-0 object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: NOISE_SVG, opacity: 0.15 }} />

        <div className="absolute inset-0 flex flex-col items-start justify-end p-6 md:p-16 pb-16 z-10 pointer-events-none">
          <Reveal>
            <span className="font-sans text-[11px] tracking-[0.22em] uppercase text-[#EE3C24] border border-[#EE3C24]/30 px-3 py-1.5 mb-8 inline-block backdrop-blur-sm bg-[#EE3C24]/5">
              Editorial — FW26
            </span>
          </Reveal>
          <Reveal className="delay-100">
            <h2 className="font-serif italic leading-[0.85] tracking-tight text-[#ECE7D1] mb-8" style={{ fontSize: "clamp(4rem,11vw,9.5rem)" }}>
              Redefine<br />
              <SketchHighlight type="circle" delay={600} color="#EE3C24">the Silhouette</SketchHighlight>
            </h2>
          </Reveal>
          <Reveal className="delay-200">
            <p className="font-sans text-[13px] leading-[1.9] tracking-[0.03em] text-[#C1BCA8] max-w-sm mb-10">
              A collection built from obsession. Drop into the archive and find your next statement piece.
            </p>
          </Reveal>
          <Reveal className="delay-300 flex gap-4 flex-wrap pointer-events-auto">
            <Link href="/products" className="group inline-flex items-center gap-4 border border-[#ECE7D1] px-10 py-5 font-sans text-[11px] font-bold tracking-[0.16em] uppercase text-[#ECE7D1] hover:bg-[#ECE7D1] hover:text-black transition-all duration-500 rounded-sm">
              Shop the Look
              <ArrowRight size={13} strokeWidth={2} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
        <div className="absolute top-8 right-8 md:top-12 md:right-16 font-serif text-[#1A1A17] select-none pointer-events-none" style={{ fontSize: "clamp(4rem,10vw,9rem)", lineHeight: 1 }}>
          FW26
        </div>
      </section>

      {/* ── LOOKBOOK ── */}
      <section className="w-full py-24 md:py-40">
        <div className="flex items-end justify-between px-6 md:px-12 mb-12">
          <Reveal>
            <div>
              <p className="font-sans text-[11px] tracking-[0.22em] uppercase text-[#EE3C24] mb-3 flex items-center gap-2">
                <span className="w-6 h-px bg-[#EE3C24]" />Lookbook
              </p>
              <h2 className="font-serif italic leading-[0.95] text-[#ECE7D1]" style={{ fontSize: "clamp(3rem,5.5vw,5rem)" }}>
                The Lookbook
              </h2>
            </div>
          </Reveal>
          <Link href="/products" className="hidden md:flex font-sans text-[11px] tracking-[0.16em] uppercase text-[#EE3C24] hover:underline underline-offset-4 transition-all p-4">
            Full Collection
          </Link>
        </div>

        <div className="w-full overflow-x-auto snap-x snap-mandatory cursor-grab active:cursor-grabbing pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="w-max pl-6 md:pl-12 flex" style={{ gap: "0" }}>
            {lookbookProducts.length > 0 ? (
              lookbookProducts.map((product) => (
                <div key={product.id} className="snap-start">
                  <Lookbook product={product} />
                </div>
              ))
            ) : (
              <div className="w-full h-[50vh] flex items-center justify-center border-t border-[#1A1A17]">
                <p className="font-sans text-[11px] tracking-[0.16em] uppercase text-[#6B6A5E] animate-pulse">Loading Lookbook…</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── EMAIL JOIN ── */}
      <section className="w-full border-t border-[#1A1A17] bg-[#0D0D0B]">
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-20 md:py-28 text-center">
          <Reveal>
            <p className="font-sans text-[11px] tracking-[0.22em] uppercase text-[#EE3C24] mb-5 flex items-center justify-center gap-2">
              <span className="w-6 h-px bg-[#EE3C24]" />Stay Ahead<span className="w-6 h-px bg-[#EE3C24]" />
            </p>
            <h2 className="font-serif leading-[0.92] tracking-[-0.02em] text-[#ECE7D1] mb-6" style={{ fontSize: "clamp(3rem,6vw,5.5rem)" }}>
              Join the<br /><em className="text-[#EE3C24]">Edit.</em>
            </h2>
            <p className="font-sans text-[13px] leading-[1.9] tracking-[0.03em] text-[#969382] max-w-md mx-auto mb-10">
              New drops. Exclusive access. Zero noise.
            </p>
          </Reveal>
          <Reveal className="delay-150">
            <form onSubmit={(e) => e.preventDefault()} className="flex items-stretch max-w-lg mx-auto border border-[#403F38] hover:border-[#EE3C24] transition-colors duration-400 group">
              <input type="email" placeholder="YOUR EMAIL ADDRESS" className="flex-1 bg-transparent border-none outline-none font-sans text-[11px] uppercase tracking-[0.16em] text-[#ECE7D1] placeholder-[#403F38] px-6 py-4" />
              <button type="submit" className="bg-[#EE3C24] text-black font-sans text-[11px] font-bold uppercase tracking-[0.16em] px-8 py-5 hover:bg-[#ECE7D1] transition-colors duration-300 shrink-0">
                Join
              </button>
            </form>
          </Reveal>
        </div>
      </section>
    </main>
  );
}