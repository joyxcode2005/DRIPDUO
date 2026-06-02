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

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`;

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
    <div className="glass-panel p-8 rounded-2xl flex flex-col gap-2 items-center text-center w-full">
      <span className="font-serif text-[clamp(2.5rem,5vw,4rem)] leading-none text-[#ECE7D1] tabular-nums drop-shadow-md">
        {count}<span className="text-[#EE3C24]">{suffix}</span>
      </span>
      <span className="font-sans text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-white/60 mt-2">{label}</span>
    </div>
  );
}

function AppleCardCarousel({ categories }: { categories: typeof HOME_CATEGORIES }) {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    /* Added max-w-[2000px] wrapper to perfectly align the carousel padding with the title on ultra-wide screens */
    <div className="relative w-full max-w-[2000px] mx-auto">
      <div
        ref={trackRef}
        className="flex overflow-x-auto no-scroll px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 pb-12 cursor-grab active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ gap: 24, scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
      >
        {categories.map((cat, i) => (
          <motion.div
            key={cat.name}
            className="relative shrink-0 overflow-hidden glass-panel glass-panel-hover rounded-3xl w-[85vw] sm:w-[380px] md:w-[420px] lg:w-[450px] h-[450px] md:h-[550px]"
            style={{ scrollSnapAlign: "start" }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href={`/products?category=${cat.name.toLowerCase()}`} className="block w-full h-full p-2">
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <Image src={cat.Image} alt={cat.name} fill className="object-cover transition-transform duration-[2s] hover:scale-105" />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-5 left-5 z-10">
                  <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#ECE7D1] glass-panel px-3 py-1.5 rounded-full">0{i + 1}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <h3 className="font-serif text-3xl md:text-5xl text-[#ECE7D1] leading-tight drop-shadow-lg">{cat.name}</h3>
                  <div className="mt-4 flex items-center gap-3">
                    <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-[#EE3C24]">Explore</span>
                    <div className="h-px flex-1 bg-white/20" />
                    <ArrowRight size={14} strokeWidth={1.5} className="text-[#EE3C24]" />
                  </div>
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

  const lookbookCarouselRef = useRef<HTMLDivElement>(null);
  const [isLookbookHovered, setIsLookbookHovered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const { scrollYProgress: bannerScroll } = useScroll({
    target: bannerRef,
    offset: ["start end", "end start"]
  });
  const bannerParallax = useTransform(bannerScroll, [0, 1], ["0%", "-20%"]);

  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    async function load() {
      const data = await getProductsForLookbookSection();
      if (data) setFeaturedProducts(data);
    }
    load();
  }, []);

  useEffect(() => {
    const carousel = lookbookCarouselRef.current;
    if (!carousel || featuredProducts.length === 0) return;

    let interval: NodeJS.Timeout;
    const startAutoPlay = () => {
      interval = setInterval(() => {
        if (!carousel) return;
        const maxScroll = carousel.scrollWidth - carousel.clientWidth;
        const firstCard = carousel.querySelector('.lookbook-card-wrapper') as HTMLElement;
        const gap = window.innerWidth >= 768 ? 24 : 16;
        const scrollDistance = firstCard ? firstCard.offsetWidth + gap : 300;

        if (carousel.scrollLeft >= maxScroll - 10) {
          carousel.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          carousel.scrollBy({ left: scrollDistance, behavior: "smooth" });
        }
      }, 3000);
    };

    if (!isLookbookHovered) startAutoPlay();
    return () => clearInterval(interval);
  }, [isLookbookHovered, featuredProducts]);

  useEffect(() => {
    if (!statsRef.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStatsVisible(true); obs.disconnect(); } }, { threshold: 0.2 });
    obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="min-h-screen text-[#ECE7D1] overflow-x-clip w-full" ref={containerRef}>

      {/* ── HERO SECTION ── */}
      <section className="relative h-dvh w-full overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 w-full">
          <div className="absolute inset-0 z-10 bg-black/40" />
          <div className="absolute inset-0 z-10 bg-linear-to-b from-transparent via-transparent to-[#050505]" />
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
          {/* Removed the glass-panel card wrapper here */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }} className="w-full max-w-[90vw] md:max-w-max">
            <h2 className="font-sans text-[10px] sm:text-[12px] md:text-[14px] uppercase tracking-[0.4em] sm:tracking-[0.6em] text-[#ECE7D1]/90 mb-4 sm:mb-6 drop-shadow-md">FW26 ARCHIVE</h2>
            <div className="flex flex-col items-center justify-center gap-1 sm:gap-0">
              <div className="overflow-hidden">
                <Reveal>
                  <h1 className="font-serif italic leading-[1.1] md:leading-[0.9] tracking-tight text-[#ECE7D1] drop-shadow-2xl whitespace-nowrap" style={{ fontSize: "clamp(3.5rem, 12vw, 9rem)" }}>
                    New
                  </h1>
                </Reveal>
              </div>
              <div className="overflow-hidden">
                <Reveal className="delay-100">
                  <h1 className="font-serif italic leading-[1.1] md:leading-[0.9] tracking-tight text-[#ECE7D1] drop-shadow-2xl flex justify-center" style={{ fontSize: "clamp(3.5rem, 12vw, 9rem)" }}>
                    <LayoutTextFlip words={["Collection.", "Standard.", "Drop.", "Era."]} />
                  </h1>
                </Reveal>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }} className="absolute bottom-12 md:bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center">
          <div className="w-px h-10 md:h-12 bg-linear-to-b from-white/60 to-transparent animate-pulse" />
          <span className="mt-4 font-sans text-[9px] uppercase tracking-[0.2em] text-white/60 drop-shadow-md">Scroll to Explore</span>
        </motion.div>
      </section>

      {/* ── NOISE OVERLAY FOR BODY ── */}
      <div className="fixed inset-0 pointer-events-none mix-blend-overlay z-50 opacity-30 w-full" style={{ backgroundImage: NOISE_SVG }} />

      {/* ── LOOKBOOK SECTION ── */}
      <section className="py-20 md:py-32 relative z-10 w-full">
        <div className="w-full max-w-[2000px] mx-auto">
            <Reveal className="mb-12 md:mb-20 text-center px-4">
            <h2 className="font-serif text-[2.5rem] md:text-[5rem] text-[#ECE7D1] tracking-tight mb-3 md:mb-6 drop-shadow-lg">The Lookbook</h2>
            <p className="font-sans text-[10px] md:text-[12px] uppercase tracking-[0.2em] text-white/60">Curated fits for FW26</p>
            </Reveal>

            <div
            ref={lookbookCarouselRef}
            onMouseEnter={() => setIsLookbookHovered(true)}
            onMouseLeave={() => setIsLookbookHovered(false)}
            onTouchStart={() => setIsLookbookHovered(true)}
            onTouchEnd={() => setIsLookbookHovered(false)}
            className="w-full overflow-x-auto snap-x snap-mandatory cursor-grab active:cursor-grabbing pb-12 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth"
            >
            <div className="w-max pl-4 sm:pl-8 md:pl-12 lg:pl-16 xl:pl-24 flex gap-6 pr-4 sm:pr-8 md:pr-12 lg:pr-16 xl:pr-24">
                {featuredProducts.length > 0 ? (
                featuredProducts.map((product) => (
                    <div key={product.id} className="snap-center md:snap-start block lookbook-card-wrapper">
                    <Lookbook product={product} />
                    </div>
                ))
                ) : (
                <div className="w-[85vw] md:w-[45vw] lg:w-[30vw] h-[50vh] md:h-[60vh] flex items-center justify-center glass-panel rounded-2xl snap-center lookbook-card-wrapper">
                    <p className="font-sans text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-white/50 animate-pulse">Loading Archive…</p>
                </div>
                )}
            </div>
            </div>
        </div>
      </section>

      {/* ── PHILOSOPHY SECTION ── */}
      <section className="relative py-20 md:py-32 z-10 w-full">
        <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
          <div className="flex flex-col md:grid md:grid-cols-2 gap-10 lg:gap-16 xl:gap-24 items-center">

            <Reveal className="order-2 md:order-1 w-full">
              <div className="relative aspect-4/5 md:aspect-3/4 w-full glass-panel rounded-[3rem] p-3 shadow-2xl">
                <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-white/5">
                  <img
                    src="https://images.unsplash.com/photo-1550614000-4b95d4ebf6eb?q=80&w=1600&auto=format&fit=crop"
                    alt="Studio Setup"
                    className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                  />
                </div>
              </div>
            </Reveal>

            <div className="order-1 md:order-2 flex flex-col justify-center glass-panel p-10 md:p-14 lg:p-20 rounded-[3rem] shadow-2xl h-full">
              <Reveal>
                <div className="flex items-center gap-4 mb-4 md:mb-8">
                  <span className="w-12 h-px bg-[#EE3C24]" />
                  <span className="font-sans text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-[#EE3C24]">Studio Ethos</span>
                </div>
              </Reveal>
              <Reveal>
                <h2 className="font-serif text-[2.5rem] sm:text-[3rem] md:text-[4rem] xl:text-[5rem] leading-[1.1] md:leading-[1] tracking-tight text-[#ECE7D1] mb-6 md:mb-10 flex flex-wrap gap-x-3">
                  <LayoutTextFlip text="The Art of " words={["Subtraction.", "Minimalism.", "Essentialism.", "Restraint."]} />
                </h2>
              </Reveal>
              <Reveal>
                <p className="font-sans text-[14px] md:text-[16px] xl:text-[18px] leading-[1.8] text-white/70 mb-10 max-w-xl">
                  We believe true luxury lies in the unseen details. Every <SketchHighlight>stitch, seam, and redefined silhouette</SketchHighlight> is painstakingly prototyped in our Barrackpore studio. We strip away the unnecessary until only the perfect form remains.
                </p>
              </Reveal>
              <Reveal>
                <Link href="/about" className="inline-block glass-button text-[#ECE7D1] px-10 py-5 rounded-full font-sans text-[11px] md:text-[12px] uppercase tracking-[0.2em] w-max hover:bg-white hover:text-black shadow-lg">
                  Our Story
                </Link>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* ── EDITORIAL BANNER ── */}
      <section ref={bannerRef} className="relative h-[85svh] w-full overflow-hidden my-10 md:my-20 glass-panel rounded-[2rem] md:rounded-[4rem] mx-auto w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] xl:w-[calc(100%-8rem)] max-w-[2200px]">
        <motion.div className="absolute inset-0 w-full h-[140%] top-[-20%]" style={{ y: bannerParallax }}>
          <img src="/images/mockup.png" alt="Editorial Banner" className="absolute inset-0 w-full h-full object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-linear-to-br from-black/80 via-black/40 to-black/80 pointer-events-none" />

        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 pointer-events-none">
          <Reveal className="delay-100">
            <h2 className="font-serif italic leading-[0.85] tracking-tight text-[#ECE7D1] mb-6 drop-shadow-2xl" style={{ fontSize: "clamp(4rem,10vw,12rem)" }}>
              Redefine<br />the Silhouette
            </h2>
          </Reveal>
          <Reveal className="delay-200">
            <p className="font-sans text-[12px] md:text-[15px] leading-[1.9] tracking-[0.03em] text-white/80 max-w-md mx-auto mb-12 drop-shadow-md">
              A collection built from obsession. Drop into the archive and find your next statement piece.
            </p>
          </Reveal>
          <Reveal className="delay-300 pointer-events-auto">
            <Link href="/products" className="glass-panel hover:bg-white px-12 py-5 font-sans text-[11px] md:text-[12px] font-bold tracking-[0.2em] uppercase text-[#ECE7D1] hover:text-black transition-all duration-500 rounded-full inline-flex items-center gap-4">
              Shop The Look
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── STUDIO & STORY PREVIEW ── */}
      <section className="w-full py-24 md:py-32 z-10 relative">
        <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 flex flex-col items-center justify-center text-center">
          <Reveal>
            <div className="font-serif text-[clamp(1.8rem,5vw,4.5rem)] leading-[1.3] text-white/60 max-w-6xl">
              Discover our roots. Read our{" "}
              <LinkPreview
                url="/about"
                isStatic
                imageSrc="https://images.unsplash.com/photo-1618090584126-129cd1f3f318?q=80&w=800&auto=format&fit=crop"
                className="font-bold text-[#ECE7D1] hover:text-[#EE3C24] transition-colors underline decoration-white/20 underline-offset-8"
              >
                Story
              </LinkPreview>{" "}
              and explore the{" "}
              <LinkPreview
                url="/behind-the-scenes"
                isStatic
                imageSrc="https://images.unsplash.com/photo-1550614000-4b95d4ebf6eb?q=80&w=800&auto=format&fit=crop"
                className="font-bold text-[#ECE7D1] hover:text-[#EE3C24] transition-colors underline decoration-white/20 underline-offset-8"
              >
                Behind the Scenes
              </LinkPreview>{" "}
              of our Barrackpore studio.
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SHOP BY CATEGORY ── */}
      <section className="w-full py-20 relative z-10">
        <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 mb-12 flex items-end justify-between">
          <Reveal>
            <h2 className="font-serif leading-[1.1] text-[#ECE7D1]" style={{ fontSize: "clamp(3rem,8vw,6rem)" }}>
              Shop by<br /><em><SketchHighlight type="circle" delay={300} color="#EE3C24">Category</SketchHighlight></em>
            </h2>
          </Reveal>
        </div>
        <Reveal>
          <AppleCardCarousel categories={HOME_CATEGORIES} />
        </Reveal>
      </section>

      {/* ── STATS ── */}
      <section ref={statsRef} className="relative z-10 py-16 md:py-24">
        <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
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
      <section className="w-full relative z-10 py-20 pb-32">
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-8 md:px-12">
          <Reveal>
            <div className="glass-panel rounded-[3rem] p-10 md:p-24 text-center flex flex-col items-center shadow-2xl">
              <div className="flex justify-center mb-6">
                <h2 className="font-serif leading-[1.1] md:leading-[0.92] tracking-tight text-[#ECE7D1]" style={{ fontSize: "clamp(2.5rem,8vw,5rem)" }}>
                  <LayoutTextFlip text="Join the " words={["Edit.", "Archive.", "Culture.", "Movement."]} />
                </h2>
              </div>
              <p className="font-sans text-[11px] md:text-[14px] tracking-[0.1em] text-white/60 mb-12 max-w-md">
                New drops. Exclusive access. Zero noise. Subscribe to stay ahead of the archive.
              </p>

              <form onSubmit={(e) => e.preventDefault()} className="w-full max-w-xl flex flex-col sm:flex-row items-stretch glass-panel rounded-full overflow-hidden p-1.5 group focus-within:border-white/30 transition-all">
                <input type="email" placeholder="YOUR EMAIL ADDRESS" className="flex-1 bg-transparent border-none outline-none font-sans text-[10px] md:text-[12px] uppercase tracking-[0.2em] text-[#ECE7D1] placeholder-white/30 px-8 py-5 text-center sm:text-left" />
                <button type="submit" className="bg-[#ECE7D1] text-black rounded-full font-sans text-[10px] md:text-[12px] font-bold uppercase tracking-[0.2em] px-10 py-5 hover:bg-[#EE3C24] hover:text-white transition-colors duration-300 shrink-0">
                  Subscribe
                </button>
              </form>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}