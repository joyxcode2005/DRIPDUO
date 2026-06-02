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
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { LinkPreview } from "@/components/ui/link-preview";

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
    let startTime: number;
    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setVal(Math.floor(easeOut * end));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [end, duration, start]);
  return val;
}

function Stat({ value, suffix, label, trigger }: { value: number; suffix: string; label: string; trigger: boolean }) {
  const count = useCounter(value, 1800, trigger);
  return (
    <div className="flex flex-col gap-1 items-center text-center md:items-start md:text-left">
      <span className="font-seulaga text-[clamp(2rem,6vw,4rem)] leading-none text-[#ECE7D1] tabular-nums">
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
              <div className="absolute top-6 left-6 z-10">
                <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#ECE7D1]">0{i + 1}</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
                <h3 className="font-seulaga text-3xl md:text-4xl text-[#ECE7D1] leading-tight drop-shadow-md">{cat.name}</h3>
                <div className="mt-4 md:mt-5 flex items-center gap-3">
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

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [heroReady, setHeroReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Editorial Banner Parallax
  const { scrollYProgress: bannerScroll } = useScroll({
    target: bannerRef,
    offset: ["start end", "end start"]
  });
  const bannerParallax = useTransform(bannerScroll, [0, 1], ["0%", "-20%"]);

  // Handle Hero scale-in animation
  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Fetch Lookbook Products
  useEffect(() => {
    async function load() {
      const data = await getProductsForLookbookSection();
      if (data) {
        setFeaturedProducts(data);
      }
    }
    load();
  }, []);

  // Handle Stats Observer
  useEffect(() => {
    if (!statsRef.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStatsVisible(true); obs.disconnect(); } }, { threshold: 0.2 });
    obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen text-[#ECE7D1] overflow-x-clip" ref={containerRef}>

      {/* ── HERO SECTION ── */}
      <section className="relative h-dvh w-full overflow-hidden bg-[#050505]">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0">
          <div className="absolute inset-0 z-10 bg-black/50" />
          <div className="absolute inset-0 z-10 bg-linear-to-b from-[#050505]/80 via-transparent to-[#050505]" />
          <video
            src="https://ik.imagekit.io/dripduo2026/hero_video2.mp4?tr=q-60,f-auto"
            autoPlay
            loop
            muted
            playsInline
            className={`absolute inset-0 w-full h-full object-cover origin-center transition-transform duration-[3s] ease-out will-change-transform ${heroReady ? "scale-100" : "scale-105"}`}
          />
        </motion.div>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full px-4 z-20 flex flex-col items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }} className="w-full">
            <h2 className="font-sans text-[10px] sm:text-[12px] md:text-[14px] uppercase tracking-[0.4em] sm:tracking-[0.6em] text-[#ECE7D1]/90 mb-4 sm:mb-6 drop-shadow-md">FW26 ARCHIVE</h2>

            <div className="flex flex-col items-center justify-center gap-1 sm:gap-0">
              <div className="overflow-hidden">
                <Reveal>
                  <h1 className="font-seulaga italic leading-[1.1] md:leading-[0.9] tracking-tight text-[#ECE7D1] drop-shadow-2xl whitespace-nowrap" style={{ fontSize: "clamp(4rem, 15vw, 12rem)" }}>
                    New
                  </h1>
                </Reveal>
              </div>
              <div className="overflow-hidden">
                <Reveal className="delay-100">
                  <h1 className="font-seulaga italic leading-[1.1] md:leading-[0.9] tracking-tight text-[#ECE7D1] drop-shadow-2xl flex justify-center" style={{ fontSize: "clamp(4rem, 15vw, 12rem)" }}>
                    <LayoutTextFlip words={["Collection.", "Standard.", "Drop.", "Era."]} />
                  </h1>
                </Reveal>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }} className="absolute bottom-12 md:bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center">
          <div className="w-[1px] h-10 md:h-12 bg-gradient-to-b from-white/60 to-transparent animate-pulse" />
          <span className="mt-4 font-sans text-[9px] uppercase tracking-[0.2em] text-white/60 drop-shadow-md">Scroll to Explore</span>
        </motion.div>
      </section>

      {/* ── NOISE OVERLAY FOR BODY ── */}
      <div className="fixed inset-0 pointer-events-none mix-blend-overlay z-50 opacity-20" style={{ backgroundImage: NOISE_SVG }} />

      {/* ── LOOKBOOK SECTION ── */}
      <section className="py-20 md:py-24 bg-[#0D0D0B] border-t border-white/5 overflow-hidden">
        <Reveal className="mb-12 md:mb-16 text-center px-4">
          <h2 className="font-seulaga text-[2rem] md:text-[3rem] text-[#ECE7D1] tracking-tight mb-3 md:mb-4">The Lookbook</h2>
          <p className="font-sans text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-[#969382]">Curated fits for FW26</p>
        </Reveal>

        <div className="w-full overflow-x-auto snap-x snap-mandatory cursor-grab active:cursor-grabbing pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="w-max pl-6 md:pl-12 flex gap-4 md:gap-6">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="snap-center md:snap-start block cursor-pointer transition-transform hover:scale-[1.02] duration-500"
                >
                  {/* @ts-ignore */}
                  <Lookbook product={product} />
                </div>
              ))
            ) : (
              <div className="w-[85vw] md:w-[400px] h-[50vh] md:h-[60vh] flex items-center justify-center bg-[#050505] border border-[#1A1A17] rounded-sm snap-center">
                <p className="font-sans text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-[#6B6A5E] animate-pulse">Loading Archive…</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHY SECTION ── */}
      <section className="relative py-20 md:pt-40 md:pb-32 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:grid md:grid-cols-2 gap-10 md:gap-24 items-center">

            <div className="order-2 md:order-1 relative aspect-[4/5] md:aspect-[3/4] w-full overflow-hidden rounded-sm">
              <Reveal className="w-full h-full">
                <Image src="https://images.unsplash.com/photo-1550614000-4b95d4ebf6eb?q=80&w=1200&auto=format&fit=crop" fill alt="Studio Setup" className="object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
                <div className="absolute inset-0 border border-white/10 m-4 z-10 pointer-events-none" />
              </Reveal>
            </div>

            <div className="order-1 md:order-2 flex flex-col justify-center">
              <Reveal>
                <div className="flex items-center gap-4 mb-4 md:mb-6">
                  <span className="w-8 h-[1px] bg-[#EE3C24]" />
                  <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#EE3C24]">Studio Ethos</span>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="font-seulaga text-[2.25rem] sm:text-[2.5rem] md:text-[3.5rem] leading-[1.2] md:leading-none tracking-tight text-[#ECE7D1] mb-5 md:mb-8 flex flex-wrap gap-x-2">
                  <LayoutTextFlip text="The Art of " words={["Subtraction.", "Minimalism.", "Essentialism.", "Restraint."]} />
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="font-sans text-[13px] md:text-[15px] leading-[1.8] text-[#969382] mb-8 md:mb-10 max-w-md">
                  We believe true luxury lies in the unseen details. Every <SketchHighlight>stitch, seam, and redefined silhouette</SketchHighlight> is painstakingly prototyped in our Barrackpore studio. We strip away the unnecessary until only the perfect form remains.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <Link href="/about" className="inline-block border border-[#403F38] text-[#ECE7D1] px-8 py-4 font-sans text-[10px] uppercase tracking-[0.2em] hover:bg-[#ECE7D1] hover:text-[#050505] transition-colors w-max">
                  Our Story
                </Link>
              </Reveal>
            </div>

          </div>
        </div>
      </section>


      {/* ── EDITORIAL BANNER ── */}
      <section ref={bannerRef} className="relative h-[85svh] w-full overflow-hidden border-y border-white/5">
        <motion.div className="absolute inset-0 w-full h-[140%] top-[-20%]" style={{ y: bannerParallax }}>
          <Image src="/images/mockup.png" alt="Editorial Banner" fill className="absolute inset-0 object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: NOISE_SVG, opacity: 0.15 }} />

        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 pointer-events-none">
          <Reveal className="delay-100">
            <h2 className="font-seulaga italic leading-[0.85] tracking-tight text-[#ECE7D1] mb-6" style={{ fontSize: "clamp(3rem,9vw,8.5rem)" }}>
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

      {/* ── STUDIO & STORY PREVIEW ── */}
      <section className="w-full py-20 md:py-32 bg-[#050505]">
        <div className="max-w-5xl mx-auto px-6 md:px-12 flex flex-col items-center justify-center text-center">
          <Reveal>
            <div className="font-seulaga text-[clamp(1.5rem,5vw,3rem)] leading-[1.5] text-[#969382]">
              Discover our roots. Read our{" "}
              <LinkPreview
                url="/about"
                isStatic
                imageSrc="https://images.unsplash.com/photo-1618090584126-129cd1f3f318?q=80&w=800&auto=format&fit=crop"
                className="font-bold text-[#ECE7D1] hover:text-[#EE3C24] transition-colors underline decoration-white/20 underline-offset-[6px]"
              >
                Story
              </LinkPreview>{" "}
              and explore the{" "}
              <LinkPreview
                url="/behind-the-scenes"
                isStatic
                imageSrc="https://images.unsplash.com/photo-1550614000-4b95d4ebf6eb?q=80&w=800&auto=format&fit=crop"
                className="font-bold text-[#ECE7D1] hover:text-[#EE3C24] transition-colors underline decoration-white/20 underline-offset-[6px]"
              >
                Behind the Scenes
              </LinkPreview>{" "}
              of our Barrackpore studio.
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SHOP BY CATEGORY ── */}
      <section className="w-full py-20 md:py-32 bg-[#0D0D0B] border-y border-[#1A1A17]">
        <div className="px-6 md:px-12 mb-10 md:mb-12 flex items-end justify-between">
          <Reveal>
            <h2 className="font-seulaga leading-[1.1] text-[#ECE7D1]" style={{ fontSize: "clamp(2.5rem,7vw,4.5rem)" }}>
              Shop by<br /><em><SketchHighlight type="circle" delay={300} color="#EE3C24">Category</SketchHighlight></em>
            </h2>
          </Reveal>
        </div>
        <Reveal>
          <AppleCardCarousel categories={HOME_CATEGORIES} />
        </Reveal>
      </section>

      {/* ── STATS ── */}
      <section ref={statsRef} className="border-t border-[#1A1A17] bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-6 md:gap-8">
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
        <div className="max-w-3xl mx-auto px-6 md:px-12 py-20 md:py-24 text-center">
          <Reveal>
            <div className="flex justify-center mb-3 md:mb-6">
              <h2 className="font-seulaga leading-[1.1] md:leading-[0.92] tracking-tight text-[#ECE7D1]" style={{ fontSize: "clamp(2.25rem,8vw,4rem)" }}>
                <LayoutTextFlip text="Join the " words={["Edit.", "Archive.", "Culture.", "Movement."]} />
              </h2>
            </div>
            <p className="font-sans text-[10px] md:text-[13px] tracking-[0.05em] text-[#969382] mb-8 md:mb-12">
              New drops. Exclusive access. Zero noise.
            </p>
          </Reveal>
          <Reveal className="delay-150">
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row items-stretch border border-[#403F38] focus-within:border-[#ECE7D1] transition-colors duration-400 group">
              <input type="email" placeholder="YOUR EMAIL ADDRESS" className="flex-1 bg-transparent border-none outline-none font-sans text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-[#ECE7D1] placeholder-[#403F38] px-6 py-5 text-center sm:text-left" />
              <button type="submit" className="bg-[#ECE7D1] text-black font-sans text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] px-10 py-5 hover:bg-[#EE3C24] hover:text-white transition-colors duration-300 shrink-0 border-t border-[#403F38] sm:border-t-0 sm:border-l">
                Subscribe
              </button>
            </form>
          </Reveal>
        </div>
      </section>
    </div>
  );
}