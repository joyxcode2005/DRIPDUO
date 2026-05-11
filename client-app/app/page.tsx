"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ArrowDown } from "lucide-react";
import { HOME_CATEGORIES } from "@/constants";
import RotatingBadge from "@/components/RotatingBadge";
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

/* ─── Noise / grain overlay as an inline SVG data URI ─── */
const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`;

/* ─── Animated counter hook ─── */
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

/* ─── Stat block with animated number ─── */
function Stat({ value, suffix, label, trigger }: { value: number; suffix: string; label: string; trigger: boolean }) {
  const count = useCounter(value, 1800, trigger);
  return (
    <div className="flex flex-col gap-1">
      <span className="font-serif text-[clamp(2.8rem,5vw,5rem)] leading-none text-(--beige) tabular-nums">
        {count}
        <span className="text-(--orange)">{suffix}</span>
      </span>
      <span className="font-sans text-[9px] tracking-[0.25em] uppercase text-(--gray-400)">{label}</span>
    </div>
  );
}

export default function Home() {
  const [heroReady, setHeroReady] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [lookbookProducts, setLookbookProducts] = useState<FeaturedProduct[]>([]);
  const [statsVisible, setStatsVisible] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [heroHover, setHeroHover] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Start hero animation slightly after the splash screen finishes
    const t2 = setTimeout(() => setHeroReady(true), 100);

    const fetchFeaturedProducts = async () => {
      try {
        const data = await getProductsforFeaturedSection();
        setFeaturedProducts(data);
      } catch (e) {
        console.error(e);
      }
    };
    const fetchLookbookProducts = async () => {
      try {
        const data = await getProductsForLookbookSection();
        setLookbookProducts(data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchFeaturedProducts();
    fetchLookbookProducts();

    return () => {
      clearTimeout(t2);
    };
  }, []);

  /* Stats intersection observer */
  useEffect(() => {
    if (!statsRef.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStatsVisible(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  /* Custom cursor tracking on hero */
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <main className="w-full overflow-x-clip bg-(--black) text-(--beige)">

      {/* ══════════════════════════════════════════════
          HERO — full bleed with magnetic cursor glow
      ══════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHeroHover(true)}
        onMouseLeave={() => setHeroHover(false)}
        className="relative h-[96vh] w-full overflow-hidden"
      >

        <video
          // 1. Added ?tr=q-100 to force ImageKit to serve 100% maximum quality
          src="https://ik.imagekit.io/dripduo2026/hero_video2.mp4?tr=q-100"
          autoPlay
          loop
          muted
          playsInline
          // 2. Changed scale-120 to scale-100 so it settles at its native, crisp resolution
          // 3. Changed the starting scale to 105 for a subtle, premium settle-in effect
          className={`absolute inset-0 h-full w-full object-cover object-[center_25%] transition-transform duration-[3s] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${heroReady ? "scale-100" : "scale-105"}`}
        />

        {/* Gradient layers */}
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-transparent to-transparent" />

        {/* Noise grain overlay */}
        <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none" style={{ backgroundImage: NOISE_SVG }} />

        {/* Magnetic glow cursor */}
        {heroHover && (
          <div
            className="absolute pointer-events-none rounded-full blur-[120px] opacity-20 transition-opacity duration-300"
            style={{
              width: 400,
              height: 400,
              background: "radial-gradient(circle, #EE3C24 0%, transparent 70%)",
              left: cursorPos.x - 200,
              top: cursorPos.y - 200,
              transition: "left 0.12s ease-out, top 0.12s ease-out",
            }}
          />
        )}

        {/* Top bar */}
        <div className="absolute top-24 left-0 right-0 flex items-center justify-between px-6 md:px-12 z-10">
          <Reveal>
            <span className="whitespace-nowrap font-sans text-[8px] md:text-[9px] tracking-[0.2em] md:tracking-[0.35em] uppercase text-[var(--orange)] border border-[var(--orange)]/30 px-2 py-1 md:px-3 md:py-1.5 backdrop-blur-sm bg-[var(--orange)]/5">
              FW 2026 — New Collection
            </span>
          </Reveal>
          <Reveal className="delay-200 max-md:scale-[0.65] max-md:origin-right">
            <RotatingBadge />
          </Reveal>
        </div>

        {/* Hero text */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-start justify-end px-6 md:px-12 pb-20 md:pb-24 z-10">
          <Reveal>
            <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-(--gray-200) mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-(--orange)" />
              Engineered for those who demand excellence
            </p>
          </Reveal>

          <div className="overflow-hidden">
            <Reveal>
              <h1
                className="font-serif leading-[0.82] tracking-[-0.03em] text-(--beige) drop-shadow-2xl"
                style={{ fontSize: "clamp(5rem,16vw,13rem)" }}
              >
                New
              </h1>
            </Reveal>
          </div>
          <div className="overflow-hidden">
            <Reveal className="delay-100">
              <h1
                className="font-serif italic leading-[0.82] tracking-[-0.03em] text-(--beige) drop-shadow-2xl"
                style={{ fontSize: "clamp(5rem,16vw,13rem)" }}
              >
                <SketchHighlight type="circle" delay={1200} color="var(--orange)">
                  Collection
                </SketchHighlight>
              </h1>
            </Reveal>
          </div>

          <Reveal className="delay-300 mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link
              href="/products"
              className="group inline-flex items-center gap-4 bg-(--orange) text-(--black) font-sans text-[10px] font-bold uppercase tracking-[0.25em] px-10 py-5 hover:bg-(--beige) transition-all duration-500 relative overflow-hidden"
            >
              <span className="relative z-10">Discover Now</span>
              <ArrowRight size={13} strokeWidth={2} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/products"
              className="font-sans text-[10px] tracking-[0.25em] uppercase text-(--gray-200) hover:text-(--beige) transition-colors flex items-center gap-2 border-b border-(--gray-600) pb-px hover:border-(--beige)"
            >
              View Lookbook
            </Link>
          </Reveal>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-8 md:right-12 z-10 flex flex-col items-center gap-2 animate-bounce">
          <span className="font-sans text-[8px] tracking-[0.3em] uppercase text-(--gray-400) rotate-90 origin-center mb-2" style={{ writingMode: "vertical-rl" }}>Scroll</span>
          <ArrowDown size={12} strokeWidth={1} className="text-(--gray-400)" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          MARQUEE TICKER
      ══════════════════════════════════════════════ */}
      <div className="overflow-hidden bg-(--orange) py-3">
        <div className="marquee-track">
          {[...Array(7)].map((_, i) => (
            <span key={i} className="font-sans whitespace-nowrap px-8 text-[9px] tracking-[0.3em] uppercase text-(--black) font-semibold">
              Free Shipping Over ₹2000 &nbsp;★&nbsp; New Arrivals Weekly &nbsp;★&nbsp; Easy 30-Day Returns &nbsp;★&nbsp; Premium Heavyweight Cotton &nbsp;★&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          STATS STRIP
      ══════════════════════════════════════════════ */}
      <div ref={statsRef} className="border-b border-(--gray-800) bg-(--gray-900)">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-14 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x divide-(--gray-800)">
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

      {/* ══════════════════════════════════════════════
          FEATURED ARCHIVE — asymmetric grid
      ══════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden pt-20 md:pt-32">
        {/* Section label */}
        <div className="px-6 md:px-12 mb-12 flex items-end justify-between">
          <Reveal>
            <div>
              <p className="font-sans text-[9px] tracking-[0.35em] uppercase text-(--orange) mb-3 flex items-center gap-2">
                <span className="w-6 h-px bg-(--orange)" />
                Archive
              </p>
              <h2 className="font-serif leading-[0.95] text-(--beige)" style={{ fontSize: "clamp(2.5rem,6vw,5rem)" }}>
                Featured<br />
                <em>
                  <SketchHighlight type="underline" delay={300} color="var(--orange)">
                    Pieces
                  </SketchHighlight>
                </em>
              </h2>
            </div>
          </Reveal>
          <Reveal className="delay-200 hidden md:block">
            <Link href="/products" className="group font-sans text-[10px] tracking-[0.2em] uppercase text-(--gray-400) hover:text-(--orange) transition-colors flex items-center gap-2">
              View All
              <ArrowRight size={12} strokeWidth={1.5} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        {/* Gapless grid */}
        {featuredProducts.length >= 4 ? (
          <div className="w-full">
            <div className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-0 w-full h-auto md:h-125 lg:h-150 border-t border-l border-(--gray-800)">

              <Reveal className="col-span-2 md:col-span-2 md:row-span-2 h-[50vh] md:h-full w-full min-h-0 border-r border-b border-(--gray-800)">
                <HomeProductCard product={featuredProducts[0]} />
              </Reveal>

              <Reveal className="col-span-1 h-[30vh] md:h-full w-full delay-100 min-h-0 border-r border-b border-(--gray-800)">
                <HomeProductCard product={featuredProducts[1]} />
              </Reveal>

              <Reveal className="col-span-1 h-[30vh] md:h-full w-full delay-150 min-h-0 border-r border-b border-(--gray-800)">
                <HomeProductCard product={featuredProducts[2]} />
              </Reveal>

              <Reveal className="col-span-2 h-[40vh] md:h-full w-full delay-200 min-h-0 border-r border-b border-(--gray-800)">
                <HomeProductCard product={featuredProducts[3]} />
              </Reveal>

            </div>
          </div>
        ) : (
          <div className="w-full h-[50vh] flex items-center justify-center border-t border-(--gray-800)">
            <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-(--gray-400) animate-pulse">
              Loading Archive…
            </p>
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════════════
          EDITORIAL SPLIT — two column brand statement
      ══════════════════════════════════════════════ */}
      <section className="w-full border-t border-(--gray-800) mt-20 md:mt-32 grid grid-cols-1 md:grid-cols-2">
        <Reveal className="flex flex-col justify-between px-6 md:px-12 py-16 md:py-24 border-r border-(--gray-800)">
          <p className="font-sans text-[9px] tracking-[0.35em] uppercase text-(--orange) flex items-center gap-2 mb-12">
            <span className="w-6 h-px bg-(--orange)" />
            Our Philosophy
          </p>
          <div>
            <h2
              className="font-serif leading-[0.88] tracking-[-0.02em] text-(--beige) mb-8"
              style={{ fontSize: "clamp(3rem,6vw,6rem)" }}
            >
              Unapologetic<br />
              <em className="text-(--orange)">Style.</em><br />
              Uncompromising<br />
              <em>Quality.</em>
            </h2>
            <p className="font-sans text-[11px] leading-[1.9] tracking-[0.04em] text-(--gray-200) max-w-sm">
              Every thread is a choice. Every silhouette, a statement. We build garments for those who refuse to settle — constructed from ultra-dense cotton, engineered to hold shape through every season.
            </p>
          </div>
          <Link
            href="/products"
            className="group mt-12 inline-flex items-center gap-3 font-sans text-[10px] tracking-[0.25em] uppercase text-(--beige) border-b border-(--beige) pb-px w-fit hover:text-(--orange) hover:border-(--orange) transition-all duration-300"
          >
            Shop the Collection
            <ArrowRight size={12} strokeWidth={1.5} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>

        <Reveal className="delay-150 relative h-[60vw] md:h-auto overflow-hidden bg-(--gray-900)">
          <Image
            src="/images/mockup.png"
            alt="Editorial"
            fill
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
            <span className="font-sans text-[9px] tracking-[0.25em] uppercase text-(--gray-200)">Editorial — FW26</span>
            <span className="font-serif italic text-(--orange) text-lg">Origins</span>
          </div>
        </Reveal>
      </section>

      {/* ══════════════════════════════════════════════
          SHOP BY CATEGORY — hover-reveal grid
      ══════════════════════════════════════════════ */}
      <section className="w-full pt-20 md:pt-32 border-t border-(--gray-800) mt-20 md:mt-32">
        <div className="px-6 md:px-12 mb-12 flex items-end justify-between">
          <Reveal>
            <div>
              <p className="font-sans text-[9px] tracking-[0.35em] uppercase text-(--orange) mb-3 flex items-center gap-2">
                <span className="w-6 h-px bg-(--orange)" />
                Categories
              </p>
              <h2 className="font-serif leading-[1.02] text-(--beige)" style={{ fontSize: "clamp(2.5rem,5vw,4.5rem)" }}>
                Shop by<br />
                <em>
                  <SketchHighlight type="circle" delay={300} color="var(--orange)">
                    Category
                  </SketchHighlight>
                </em>
              </h2>
            </div>
          </Reveal>
          <Link href="/products" className="hidden md:inline font-sans text-[10px] tracking-[0.2em] uppercase text-(--orange) hover:underline underline-offset-4 transition-all">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 w-full border-t border-l border-(--gray-800)">
          {HOME_CATEGORIES.map((cat, i) => (
            <Reveal key={cat.name} className="w-full h-[40vh] md:h-[60vh]" threshold={0.14}>
              <Link
                href="/products"
                className="group block relative w-full h-full border-r border-b border-(--gray-800) overflow-hidden bg-(--black)  "
              >
                <Image
                  fill
                  src={cat.Image}
                  alt={cat.name}
                  objectFit="cover"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-black/50 transition-opacity duration-500 group-hover:opacity-20" />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 px-5 pb-6 flex items-end justify-between">
                  <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-(--beige) transition-colors duration-200 group-hover:text-(--orange)">
                    {cat.name}
                  </p>
                  <ArrowRight
                    size={14}
                    strokeWidth={1.5}
                    className="text-(--gray-400) opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-1.5 group-hover:translate-x-0 group-hover:text-(--orange)"
                  />
                </div>

                <div className="absolute top-4 left-4 font-sans text-[9px] tracking-[0.2em] text-(--gray-600) group-hover:text-(--orange) transition-colors duration-300">
                  0{i + 1}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          PROCESS / WHY US — horizontal feature list
      ══════════════════════════════════════════════ */}
      <section className="w-full border-t border-(--gray-800) mt-20 md:mt-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-32">
          <Reveal>
            <p className="font-sans text-[9px] tracking-[0.35em] uppercase text-(--orange) mb-4 flex items-center gap-2">
              <span className="w-6 h-px bg-(--orange)" />
              The DRIPDUO Difference
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mt-12 border-t border-(--gray-800)">
            {[
              {
                num: "01",
                title: "Ultra-Dense Construction",
                body: "240 GSM heavyweight cotton. Built to outlast trends and hold its shape wash after wash.",
              },
              {
                num: "02",
                title: "Meticulous Silhouettes",
                body: "Drop shoulders. Tight necklines. Balanced hems. Every cut is a considered decision.",
              },
              {
                num: "03",
                title: "Zero Compromises",
                body: "From sourcing to stitching — every step is held to the highest possible standard.",
              },
            ].map((feat) => (
              <Reveal key={feat.num} className="border-b md:border-b-0 md:border-r border-(--gray-800) py-10 pr-0 md:pr-10 last:border-r-0 last:pl-0 md:first:pl-0 md:pl-10 flex flex-col gap-5">
                <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-(--orange)">{feat.num}</span>
                <h3 className="font-serif text-2xl md:text-3xl text-(--beige) leading-tight">{feat.title}</h3>
                <p className="font-sans text-[11px] leading-[1.85] tracking-[0.04em] text-(--gray-200)">{feat.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FULL-BLEED EDITORIAL BANNER
      ══════════════════════════════════════════════ */}
      <section className="relative h-[90svh] w-full overflow-hidden border-t border-b border-(--gray-800)">
        <Image
          src="/images/mockup.png"
          alt="Editorial"
          fill
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-br from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0" style={{ backgroundImage: NOISE_SVG, opacity: 0.15 }} />

        <div className="absolute inset-0 flex flex-col items-start justify-end p-6 md:p-16 pb-16 z-10">
          <Reveal>
            <span className="font-sans text-[9px] tracking-[0.35em] uppercase text-(--orange) border border-(--orange)/30 px-3 py-1.5 mb-8 inline-block backdrop-blur-sm bg-(--orange)/5">
              Editorial — FW26
            </span>
          </Reveal>
          <Reveal className="delay-100">
            <h2
              className="font-serif italic leading-[0.85] tracking-tight text-(--beige) mb-8"
              style={{ fontSize: "clamp(4rem,11vw,9.5rem)" }}
            >
              Redefine<br />
              <SketchHighlight type="circle" delay={600} color="var(--orange)">
                the Silhouette
              </SketchHighlight>
            </h2>
          </Reveal>
          <Reveal className="delay-200">
            <p className="font-sans text-[11px] leading-[1.8] tracking-[0.04em] text-(--gray-100) max-w-sm mb-10">
              A collection built from obsession. Drop into the archive and find your next statement piece.
            </p>
          </Reveal>
          <Reveal className="delay-300 flex gap-4 flex-wrap">
            <Link
              href="/products"
              className="group inline-flex items-center gap-4 border border-(--beige) px-10 py-5 font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-(--beige) hover:bg-(--beige) hover:text-(--black) transition-all duration-500"
            >
              Shop the Look
              <ArrowRight size={13} strokeWidth={2} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        {/* Corner watermark */}
        <div className="absolute top-8 right-8 md:top-12 md:right-16 font-serif text-(--gray-800) select-none pointer-events-none" style={{ fontSize: "clamp(4rem,10vw,9rem)", lineHeight: 1 }}>
          FW26
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          LOOKBOOK HORIZONTAL SCROLL
      ══════════════════════════════════════════════ */}
      <section className="w-full py-24 md:py-40">
        <div className="flex items-end justify-between px-6 md:px-12 mb-12">
          <Reveal>
            <div>
              <p className="font-sans text-[9px] tracking-[0.35em] uppercase text-(--orange) mb-3 flex items-center gap-2">
                <span className="w-6 h-px bg-(--orange)" />
                Lookbook
              </p>
              <h2 className="font-serif italic leading-[0.95] text-(--beige)" style={{ fontSize: "clamp(3rem,5.5vw,5rem)" }}>
                The Lookbook
              </h2>
            </div>
          </Reveal>
          <Link href="/products" className="hidden md:inline font-sans text-[10px] tracking-[0.2em] uppercase text-(--orange) hover:underline underline-offset-4 transition-all">
            Full Collection
          </Link>
        </div>

        <div className="overflow-hidden w-full">
          <div className="scroll-row w-max pl-6 md:pl-12 flex" style={{ gap: "0" }}>
            {lookbookProducts.length > 0 ? (
              lookbookProducts.map((product) => (
                <Lookbook key={product.id} product={product} />
              ))
            ) : (
              <div className="w-full h-[50vh] flex items-center justify-center border-t border-(--gray-800)">
                <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-(--gray-400) animate-pulse">
                  Loading Lookbook…
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          NEWSLETTER — full-width black strip
      ══════════════════════════════════════════════ */}
      <section className="w-full border-t border-(--gray-800) bg-(--gray-900)">
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-20 md:py-28 text-center">
          <Reveal>
            <p className="font-sans text-[9px] tracking-[0.35em] uppercase text-(--orange) mb-5 flex items-center justify-center gap-2">
              <span className="w-6 h-px bg-(--orange)" />
              Stay Ahead
              <span className="w-6 h-px bg-(--orange)" />
            </p>
            <h2
              className="font-serif leading-[0.92] tracking-[-0.02em] text-(--beige) mb-6"
              style={{ fontSize: "clamp(3rem,6vw,5.5rem)" }}
            >
              Join the<br />
              <em className="text-(--orange)">Edit.</em>
            </h2>
            <p className="font-sans text-[11px] leading-[1.8] tracking-[0.04em] text-(--gray-200) max-w-md mx-auto mb-10">
              New drops. Exclusive access. Zero noise. Be the first to know when the next collection lands.
            </p>
          </Reveal>
          <Reveal className="delay-150">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-stretch max-w-lg mx-auto border border-(--gray-600) hover:border-(--orange) transition-colors duration-400 group"
            >
              <input
                type="email"
                placeholder="YOUR EMAIL ADDRESS"
                className="flex-1 bg-transparent border-none outline-none font-sans text-[10px] uppercase tracking-[0.2em] text-(--beige) placeholder-(--gray-600) px-6 py-4"
              />
              <button
                type="submit"
                className="bg-(--orange) text-(--black) font-sans text-[9px] font-bold uppercase tracking-[0.2em] px-6 py-4 hover:bg-(--beige) transition-colors duration-300 shrink-0"
              >
                Join
              </button>
            </form>
          </Reveal>
        </div>
      </section>

    </main>
  );
}