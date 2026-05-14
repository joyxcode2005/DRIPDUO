"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ArrowDown } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { HOME_CATEGORIES } from "@/constants";
import { SketchHighlight } from "@/components/SktechHighlight";
import HomeProductCard from "@/components/HomeProductCard";
import { getProductsforFeaturedSection, getProductsForLookbookSection } from "@/services/products";
import Reveal from "@/components/Reveal";
import Lookbook from "@/components/Lookbook";
import Image from "next/image";

import ClothButton from "@/components/ClothButton";
import RotatingBadge from "@/components/RotatingBadge";

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
      <span className="font-drip text-[clamp(2.8rem,5vw,5rem)] leading-none text-[#ECE7D1] tabular-nums">
        {count}
        <span className="text-[#EE3C24]">{suffix}</span>
      </span>
      <span className="font-sans text-[11px] tracking-[0.18em] uppercase text-gray-400">{label}</span>
    </div>
  );
}

export default function Home() {
  const [heroReady, setHeroReady] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [lookbookProducts, setLookbookProducts] = useState<FeaturedProduct[]>([]);
  const [statsVisible, setStatsVisible] = useState(false);

  const statsRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const editorialRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLElement>(null);

  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const { scrollYProgress: editorialScroll } = useScroll({ target: editorialRef, offset: ["start end", "end start"] });
  const { scrollYProgress: bannerScroll } = useScroll({ target: bannerRef, offset: ["start end", "end start"] });

  const heroParallax = useTransform(heroScroll, [0, 1], ["0%", "25%"]);
  const editorialParallax = useTransform(editorialScroll, [0, 1], ["-15%", "15%"]);
  const bannerParallax = useTransform(bannerScroll, [0, 1], ["-20%", "20%"]);

  useEffect(() => {
    const t2 = setTimeout(() => setHeroReady(true), 100);
    const fetchFeaturedProducts = async () => {
      try {
        const data = await getProductsforFeaturedSection();
        setFeaturedProducts(data);
      } catch (e) { console.error(e); }
    };
    const fetchLookbookProducts = async () => {
      try {
        const data = await getProductsForLookbookSection();
        setLookbookProducts(data);
      } catch (e) { console.error(e); }
    };

    fetchFeaturedProducts();
    fetchLookbookProducts();
    return () => clearTimeout(t2);
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
    <main className="w-full overflow-x-clip bg-(--black) text-(--beige)">
      <section ref={heroRef} className="relative h-[96vh] w-full overflow-hidden">
        <motion.div
          className="absolute inset-0 w-full h-[120%]"
          style={{ y: heroParallax }}
        >
          {/* ⚡ OPTIMIZED VIDEO URL ⚡ */}
          <video
            src="https://ik.imagekit.io/dripduo2026/hero_video2.mp4?tr=q-60,f-auto"
            autoPlay loop muted playsInline
            className={`absolute inset-0 h-full w-full object-cover object-[center_25%] transition-transform duration-[3s] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${heroReady ? "scale-100" : "scale-105"}`}
          />
        </motion.div>

        <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none hidden md:block" style={{ backgroundImage: NOISE_SVG }} />

        <div className="absolute top-24 left-0 right-0 flex items-center justify-between px-6 md:px-12 z-20 pointer-events-none">
          <Reveal className="pointer-events-auto">
            <span className="whitespace-nowrap font-sans text-[11px] md:text-[11px] tracking-[0.22em] uppercase text-[#EE3C24] border border-[#EE3C24]/30 px-2 py-1 md:px-3 md:py-1.5 backdrop-blur-sm bg-[#EE3C24]/5">
              FW 2026 — New Collection
            </span>
          </Reveal>
          <Reveal className="delay-200 max-md:origin-right pointer-events-auto z-50">
            <RotatingBadge />
          </Reveal>
        </div>

        <div className="absolute inset-x-0 bottom-0 flex flex-col items-start justify-end px-6 md:px-12 pb-20 md:pb-24 z-10">
          <Reveal>
            <p className="font-sans text-[11px] tracking-[0.22em] uppercase text-gray-200 mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-[#EE3C24]" />
              Engineered for those who demand excellence
            </p>
          </Reveal>

          <div className="overflow-hidden">
            <Reveal>
              <h1 className="font-drip leading-[0.82] tracking-[-0.03em] text-[#ECE7D1] drop-shadow-2xl" style={{ fontSize: "clamp(5rem,16vw,13rem)" }}>
                New
              </h1>
            </Reveal>
          </div>
          <div className="overflow-hidden">
            <Reveal className="delay-100">
              <h1 className="font-drip italic leading-[0.82] tracking-[-0.03em] text-[#ECE7D1] drop-shadow-2xl" style={{ fontSize: "clamp(5rem,16vw,13rem)" }}>
                <SketchHighlight type="underline" delay={1200} color="#EE3C24">
                  Collection
                </SketchHighlight>
              </h1>
            </Reveal>
          </div>

          <Reveal className="delay-300 mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Link href="/products" className="group inline-flex items-center gap-4 bg-[#EE3C24] text-black font-sans text-[11px] font-bold uppercase tracking-[0.18em] px-10 py-5 hover:bg-[#ECE7D1] transition-colors duration-500 rounded-sm">
              <span>Discover Now</span>
              <ArrowRight size={13} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link href="/products" className="font-sans text-[11px] tracking-[0.18em] uppercase text-gray-200 hover:text-[#ECE7D1] transition-colors flex items-center gap-2 border-b border-gray-600 pb-px hover:border-[#ECE7D1] py-2">
              View Lookbook
            </Link>
          </Reveal>
        </div>

        <div className="absolute bottom-8 right-8 md:right-12 z-10 flex flex-col items-center gap-2 animate-bounce">
          <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-gray-400 rotate-90 origin-center mb-2" style={{ writingMode: "vertical-rl" }}>Scroll</span>
          <ArrowDown size={12} strokeWidth={1} className="text-gray-400" />
        </div>
      </section>

      <div className="overflow-hidden bg-[#EE3C24] py-3">
        <div className="marquee-track">
          {[...Array(7)].map((_, i) => (
            <span key={i} className="font-sans whitespace-nowrap px-8 text-[11px] tracking-[0.2em] uppercase text-black font-semibold">
              Free Shipping Over ₹2000 &nbsp;★&nbsp; New Arrivals Weekly &nbsp;★&nbsp; Easy 30-Day Returns &nbsp;★&nbsp; Premium Heavyweight Cotton &nbsp;★&nbsp;
            </span>
          ))}
        </div>
      </div>

      <div ref={statsRef} className="border-b border-[#1f1f1f] bg-[#121212]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-14 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x divide-[#1f1f1f]">
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

      <section className="relative w-full overflow-hidden pt-20 md:pt-32">
        <div className="px-6 md:px-12 mb-12 flex items-end justify-between">
          <Reveal>
            <div>
              <p className="font-sans text-[11px] tracking-[0.22em] uppercase text-[#EE3C24] mb-3 flex items-center gap-2">
                <span className="w-6 h-px bg-[#EE3C24]" />
                Archive
              </p>
              <h2 className="font-drip leading-[0.95] text-[#ECE7D1]" style={{ fontSize: "clamp(2.5rem,6vw,5rem)" }}>
                Featured<br />
                <em>
                  <SketchHighlight type="underline" delay={300} color="#EE3C24">
                    Pieces
                  </SketchHighlight>
                </em>
              </h2>
            </div>
          </Reveal>
          <Reveal className="delay-200 hidden md:block">
            <Link href="/products" className="group font-sans text-[11px] tracking-[0.16em] uppercase text-gray-400 hover:text-[#EE3C24] transition-colors flex items-center gap-2 p-4">
              View All
              <ArrowRight size={12} strokeWidth={1.5} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        {featuredProducts.length >= 4 ? (
          <div className="w-full">
            <div className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-0 w-full h-auto md:h-125 lg:h-150 border-t border-l border-[#1f1f1f]">
              <Reveal className="col-span-2 md:col-span-2 md:row-span-2 h-[50vh] md:h-full w-full min-h-0 border-r border-b border-[#1f1f1f]">
                <HomeProductCard product={featuredProducts[0]} />
              </Reveal>
              <Reveal className="col-span-1 h-[30vh] md:h-full w-full delay-100 min-h-0 border-r border-b border-[#1f1f1f]">
                <HomeProductCard product={featuredProducts[1]} />
              </Reveal>
              <Reveal className="col-span-1 h-[30vh] md:h-full w-full delay-150 min-h-0 border-r border-b border-[#1f1f1f]">
                <HomeProductCard product={featuredProducts[2]} />
              </Reveal>
              <Reveal className="col-span-2 h-[40vh] md:h-full w-full delay-200 min-h-0 border-r border-b border-[#1f1f1f]">
                <HomeProductCard product={featuredProducts[3]} />
              </Reveal>
            </div>
          </div>
        ) : (
          <div className="w-full h-[50vh] flex items-center justify-center border-t border-[#1f1f1f]">
            <p className="font-sans text-[11px] tracking-[0.16em] uppercase text-gray-400 animate-pulse">Loading Archive…</p>
          </div>
        )}
      </section>

      <section ref={editorialRef} className="w-full border-t border-[#1f1f1f] mt-20 md:mt-32 grid grid-cols-1 md:grid-cols-2">
        <Reveal className="flex flex-col justify-between px-6 md:px-12 py-16 md:py-24 border-r border-[#1f1f1f]">
          <p className="font-sans text-[11px] tracking-[0.22em] uppercase text-[#EE3C24] flex items-center gap-2 mb-12">
            <span className="w-6 h-px bg-[#EE3C24]" />
            Our Philosophy
          </p>
          <div>
            <h2 className="font-drip leading-[0.88] tracking-[-0.02em] text-[#ECE7D1] mb-8" style={{ fontSize: "clamp(3rem,6vw,6rem)" }}>
              Unapologetic<br />
              <em className="text-[#EE3C24]">Style.</em><br />
              Uncompromising<br />
              <em>Quality.</em>
            </h2>
            <p className="font-sans text-[13px] leading-[1.9] tracking-[0.03em] text-gray-200 max-w-sm">
              Every thread is a choice. Every silhouette, a statement. We build garments for those who refuse to settle — constructed from ultra-dense cotton, engineered to hold shape through every season.
            </p>
          </div>
          <Link href="/products" className="group mt-12 inline-flex items-center gap-3 font-sans text-[11px] tracking-[0.18em] uppercase text-[#ECE7D1] border-b border-[#ECE7D1] pb-px w-fit hover:text-[#EE3C24] hover:border-[#EE3C24] transition-all duration-300 py-2">
            Shop the Collection
            <ArrowRight size={12} strokeWidth={1.5} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
        <Reveal className="delay-150 relative h-0 md:h-[60vw] overflow-hidden flex items-center justify-center">
          <ClothButton size={560} logoSrc="/images/transLoader.png" />
        </Reveal>
        <Reveal className="delay-150 relative md:h-0 h-[60vw] overflow-hidden flex items-center justify-center">
          <Image src="/images/mockup.png" alt="Mockup Image" fill className="absolute inset-0 h-full w-full object-cover object-center" />
        </Reveal>
      </section>

      <section className="w-full pt-20 md:pt-32 border-t border-[#1f1f1f] mt-20 md:mt-32">
        <div className="px-6 md:px-12 mb-12 flex items-end justify-between">
          <Reveal className="flex items-center justify-between w-full h-full md:p-12">
            <div>
              <p className="font-sans text-[11px] tracking-[0.22em] uppercase text-[#EE3C24] mb-3 flex items-center gap-2">
                <span className="w-6 h-px bg-[#EE3C24]" />
                Categories
              </p>
              <h2 className="font-drip leading-[1.02] text-[#ECE7D1]" style={{ fontSize: "clamp(2.5rem,5vw,4.5rem)" }}>
                Shop by<br />
                <em>
                  <SketchHighlight type="circle" delay={300} color="#EE3C24">
                    Category
                  </SketchHighlight>
                </em>
              </h2>
            </div>
            <Reveal className="delay-150 relative h-[30vw] md:h-0 overflow-hidden flex items-center justify-center">
              <ClothButton size={240} logoSrc="/images/transLoader.png" />
            </Reveal>
          </Reveal>
          <Link href="/products" className="hidden md:flex w-30 font-sans text-[11px] tracking-[0.16em] uppercase text-[#EE3C24] hover:underline underline-offset-4 transition-all p-4">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 w-full border-t border-l border-[#1f1f1f]">
          {HOME_CATEGORIES.map((cat, i) => (
            <Reveal key={cat.name} className="w-full h-[40vh] md:h-[60vh]" threshold={0.14}>
              <Link href="/products" className="group block relative w-full h-full border-r border-b border-[#1f1f1f] overflow-hidden bg-black">
                <Image
                  fill
                  src={cat.Image}
                  alt={cat.name}
                  objectFit="cover"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 transition-opacity duration-500 group-hover:opacity-20" />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 px-5 pb-6 flex items-end justify-between">
                  <p className="font-sans text-[11px] tracking-[0.18em] uppercase text-[#ECE7D1] transition-colors duration-200 group-hover:text-[#EE3C24]">
                    {cat.name}
                  </p>
                  <ArrowRight size={14} strokeWidth={1.5} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-1.5 group-hover:translate-x-0 group-hover:text-[#EE3C24]" />
                </div>
                <div className="absolute top-4 left-4 font-sans text-[11px] tracking-[0.16em] text-gray-600 group-hover:text-[#EE3C24] transition-colors duration-300">
                  0{i + 1}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="w-full border-t border-[#1f1f1f] mt-20 md:mt-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-32">
          <Reveal>
            <p className="font-sans text-[11px] tracking-[0.22em] uppercase text-[#EE3C24] mb-4 flex items-center gap-2">
              <span className="w-6 h-px bg-[#EE3C24]" />
              The DRIPDUO Difference
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mt-12 border-t border-[#1f1f1f]">
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
              <Reveal key={feat.num} className="border-b md:border-b-0 md:border-r border-[#1f1f1f] py-10 pr-0 md:pr-10 last:border-r-0 last:pl-0 md:first:pl-0 md:pl-10 flex flex-col gap-5">
                <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-[#EE3C24]">{feat.num}</span>
                <h3 className="font-serif text-2xl md:text-3xl text-[#ECE7D1] leading-tight">{feat.title}</h3>
                <p className="font-sans text-[13px] leading-[1.9] tracking-[0.03em] text-gray-200">{feat.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section ref={bannerRef} className="relative h-[90svh] w-full overflow-hidden border-t border-b border-[#1f1f1f]">
        <motion.div
          className="absolute inset-0 w-full h-[140%] top-[-20%]"
          style={{ y: bannerParallax }}
        >
          <Image src="/images/mockup.png" alt="Editorial Banner" fill className="absolute inset-0 h-full w-full object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-linear-to-br from-black/80 via-black/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: NOISE_SVG, opacity: 0.15 }} />

        <div className="absolute inset-0 flex flex-col items-start justify-end p-6 md:p-16 pb-16 z-10 pointer-events-none">
          <Reveal>
            <span className="font-sans text-[11px] tracking-[0.22em] uppercase text-[#EE3C24] border border-[#EE3C24]/30 px-3 py-1.5 mb-8 inline-block backdrop-blur-sm bg-[#EE3C24]/5">
              Editorial — FW26
            </span>
          </Reveal>
          <Reveal className="delay-100">
            <h2 className="font-drip italic leading-[0.85] tracking-tight text-[#ECE7D1] mb-8" style={{ fontSize: "clamp(4rem,11vw,9.5rem)" }}>
              Redefine<br />
              <SketchHighlight type="circle" delay={600} color="#EE3C24">
                the Silhouette
              </SketchHighlight>
            </h2>
          </Reveal>
          <Reveal className="delay-200">
            <p className="font-sans text-[13px] leading-[1.9] tracking-[0.03em] text-gray-100 max-w-sm mb-10">
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
        <div className="absolute top-8 right-8 md:top-12 md:right-16 font-serif text-[#1f1f1f] select-none pointer-events-none" style={{ fontSize: "clamp(4rem,10vw,9rem)", lineHeight: 1 }}>
          FW26
        </div>
      </section>

      <section className="w-full py-24 md:py-40">
        <div className="flex items-end justify-between px-6 md:px-12 mb-12">
          <Reveal>
            <div>
              <p className="font-sans text-[11px] tracking-[0.22em] uppercase text-[#EE3C24] mb-3 flex items-center gap-2">
                <span className="w-6 h-px bg-[#EE3C24]" />
                Lookbook
              </p>
              <h2 className="font-drip italic leading-[0.95] text-[#ECE7D1]" style={{ fontSize: "clamp(3rem,5.5vw,5rem)" }}>
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
              <div className="w-full h-[50vh] flex items-center justify-center border-t border-[#1f1f1f]">
                <p className="font-sans text-[11px] tracking-[0.16em] uppercase text-gray-400 animate-pulse">Loading Lookbook…</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="w-full border-t border-[#1f1f1f] bg-[#121212]">
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-20 md:py-28 text-center">
          <Reveal>
            <p className="font-sans text-[11px] tracking-[0.22em] uppercase text-[#EE3C24] mb-5 flex items-center justify-center gap-2">
              <span className="w-6 h-px bg-[#EE3C24]" />
              Stay Ahead
              <span className="w-6 h-px bg-[#EE3C24]" />
            </p>
            <h2 className="font-drip leading-[0.92] tracking-[-0.02em] text-[#ECE7D1] mb-6" style={{ fontSize: "clamp(3rem,6vw,5.5rem)" }}>
              Join the<br />
              <em className="text-[#EE3C24]">Edit.</em>
            </h2>
            <p className="font-sans text-[13px] leading-[1.9] tracking-[0.03em] text-gray-200 max-w-md mx-auto mb-10">
              New drops. Exclusive access. Zero noise. Be the first to know when the next collection lands.
            </p>
          </Reveal>
          <Reveal className="delay-150">
            <form onSubmit={(e) => e.preventDefault()} className="flex items-stretch max-w-lg mx-auto border border-gray-600 hover:border-[#EE3C24] transition-colors duration-400 group">
              <input type="email" placeholder="YOUR EMAIL ADDRESS" className="flex-1 bg-transparent border-none outline-none font-sans text-[11px] uppercase tracking-[0.16em] text-[#ECE7D1] placeholder-gray-600 px-6 py-4" />
              <button type="submit" className="bg-[#EE3C24] text-black font-sans text-[11px] font-bold uppercase tracking-[0.16em] px-8 py-5 hover:bg-[#ECE7D1] transition-colors duration-300 shrink-0 h-full">
                Join
              </button>
            </form>
          </Reveal>
        </div>
      </section>

    </main>
  );
}