"use client";

import React, { useEffect, useState, useRef, useId } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
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

// ── CUSTOM HOOK FOR OUTSIDE CLICK ──
function useOutsideClick(ref: React.RefObject<HTMLDivElement | null>, callback: (event: MouseEvent | TouchEvent) => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      callback(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback]);
}

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
    <div className="glass-panel p-8 rounded-md border border-white/10 flex flex-col gap-2 items-center text-center w-full">
      <span className="font-serif text-[clamp(2.5rem,5vw,4rem)] leading-none text-[#ECE7D1] tabular-nums drop-shadow-md">
        {count}<span className="text-[#EE3C24]">{suffix}</span>
      </span>
      <span className="font-sans text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-white/60 mt-2">{label}</span>
    </div>
  );
}

const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.05 } }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

// ── MOBILE: INTERACTIVE STORY & STUDIO PREVIEW ACCORDION ──
function MobileStoryStudioInteractive() {
  const [active, setActive] = useState<'story' | 'bts' | null>(null);

  const panels = [
    {
      id: 'story',
      title: 'Our Story',
      desc: 'Discover our roots, our obsession with detail, and the journey of crafting true luxury.',
      img: '/images/about.webp', // Fixed to local path
      link: '/about'
    },
    {
      id: 'bts',
      title: 'Behind the Scenes',
      desc: 'Step into our Barrackpore studio where every stitch and silhouette is painstakingly prototyped.',
      img: '/images/bts.jpeg', // Fixed to local path
      link: '/bts'
    }
  ];

  return (
    <div className="flex flex-col h-[60vh] w-full gap-3 mt-6 md:hidden">
      {panels.map((panel) => {
        const isActive = active === panel.id;
        const isOtherActive = active !== null && active !== panel.id;

        return (
          <motion.div
            key={panel.id}
            layout
            onClick={() => setActive(isActive ? null : (panel.id as any))}
            className="relative w-full rounded-2xl overflow-hidden cursor-pointer bg-white/5 border border-white/10"
            style={{ flex: isActive ? 4 : isOtherActive ? 1 : 2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} // Buttery smooth easing
          >
            <Image
              src={panel.img}
              alt={panel.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={`object-cover transition-all duration-700 ease-out 
                ${isActive ? 'scale-105 grayscale-0 opacity-100' : 
                  isOtherActive ? 'scale-100 grayscale opacity-30 blur-[2px]' : 
                  'scale-100 grayscale-0 opacity-80'}`}
            />
            {/* Dynamic Gradient */}
            <div className={`absolute inset-0 transition-colors duration-700 
              ${isActive ? 'bg-gradient-to-t from-black/90 via-black/40 to-transparent' : 
                isOtherActive ? 'bg-black/70' : 'bg-black/40'}`} 
            />

            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <motion.div layout className="flex items-center justify-between">
                <motion.h3 layout className={`font-serif transition-all duration-500 text-[#ECE7D1] drop-shadow-md ${isActive ? 'text-3xl' : 'text-2xl'}`}>
                  {panel.title}
                </motion.h3>
                {!isActive && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-8 h-8 shrink-0 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20"
                  >
                    <ArrowRight size={14} className="text-white" />
                  </motion.div>
                )}
              </motion.div>

              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: 10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: 10 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <p className="font-sans text-[12px] text-white/80 mt-3 mb-5 leading-relaxed drop-shadow-md">
                      {panel.desc}
                    </p>
                    <Link
                      href={panel.link}
                      onClick={(e) => e.stopPropagation()} 
                      className="inline-flex items-center gap-2 bg-[#ECE7D1] text-black px-6 py-3 rounded-full font-sans text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#EE3C24] hover:text-white transition-colors"
                    >
                      Explore <ArrowRight size={12} strokeWidth={2} />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── DESKTOP: EXPANDING HOVER ACCORDION WITH BLUR ──
function DesktopCategoryShowcase({ categories }: { categories: typeof HOME_CATEGORIES }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const displayCategories = categories.slice(0, 4).map((cat) => ({ ...cat, isUpcoming: false }));
  displayCategories.push({
    name: "FIFA '26 Capsule",
    Image: "/images/football.jpeg", 
    isUpcoming: true,
  } as any);

  return (
    <div 
      className="hidden md:flex flex-row w-full h-[60vh] gap-4 max-w-[2400px] mx-auto"
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {displayCategories.map((cat, i) => {
        const isHovered = hoveredIndex === i;
        const isAnotherHovered = hoveredIndex !== null && hoveredIndex !== i;
        const isUpcoming = cat.isUpcoming;

        return (
          <Link
            key={cat.name}
            href={isUpcoming ? "#" : `/products?category=${cat.name.toLowerCase()}`}
            onMouseEnter={() => setHoveredIndex(i)}
            className={`
              relative flex items-end overflow-hidden rounded-2xl transition-all duration-700 ease-in-out
              bg-white/5 border border-white/10
              ${isUpcoming ? "cursor-default" : "cursor-pointer"}
              ${isHovered ? "flex-[2.5]" : "flex-1"}
            `}
          >
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={cat.Image}
                alt={cat.name}
                fill
                className={`
                  object-cover transition-all duration-700 ease-in-out
                  ${isHovered ? "scale-110" : "scale-100"}
                  ${isAnotherHovered ? "grayscale blur-md opacity-30" : ""}
                  ${isUpcoming && !isHovered && !isAnotherHovered ? "grayscale opacity-50 blur-[2px]" : ""}
                `}
              />
            </div>

            
            {/* Text Content */}
            <div className="relative z-10 p-6 w-full flex flex-col justify-end h-full">
              <div className={`transform transition-all duration-700 ${isHovered ? "translate-y-0" : "translate-y-4"}`}>
                
                {isUpcoming ? (
                  <span className={`inline-block px-4 py-2 mb-3 text-[9px] uppercase tracking-[0.25em] bg-[#EE3C24]/80 backdrop-blur-md text-white rounded-full font-bold border border-[#EE3C24]/50 shadow-lg transition-opacity duration-700 ${isAnotherHovered ? "opacity-20" : "opacity-100"}`}>
                    Coming Soon
                  </span>
                ) : (
                  <span className={`inline-block px-3 py-1.5 mb-2 text-[10px] uppercase tracking-[0.2em] text-[#ECE7D1]/80 bg-black/40 backdrop-blur-md border border-white/10 rounded-full transition-opacity duration-700 ${isAnotherHovered ? "opacity-20" : "opacity-100"}`}>
                    0{i + 1}
                  </span>
                )}

                <h3 className={`font-serif text-3xl lg:text-4xl text-[#ECE7D1] whitespace-nowrap drop-shadow-xl ${isUpcoming ? "italic" : ""} transition-opacity duration-700 ${isAnotherHovered ? "opacity-30" : "opacity-100"}`}>
                  {cat.name}
                </h3>

                <div className={`mt-4 flex items-center gap-3 transition-all duration-700 overflow-hidden ${isHovered ? "opacity-100 max-h-12" : "opacity-0 max-h-0"}`}>
                  {!isUpcoming ? (
                    <>
                      <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#EE3C24] font-semibold">Explore Collection</span>
                      <div className="h-px w-8 bg-white/20" />
                      <ArrowRight size={14} strokeWidth={2} className="text-[#EE3C24]" />
                    </>
                  ) : (
                    <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-white/70">Drop Notification Available Soon</span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

// ── MOBILE: INTERACTIVE MODAL CARDS ──
function MobileCategoryCards({ categories }: { categories: typeof HOME_CATEGORIES }) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<any | null>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActive(null);
    }
    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  const cards = categories.slice(0, 4).map((c) => ({
    title: c.name,
    description: "Explore the collection",
    src: typeof c.Image === 'string' ? c.Image : (c.Image as any).src,
    ctaText: "Shop",
    ctaLink: `/products?category=${c.name.toLowerCase()}`,
    content: () => (
      <p>
        Discover our exclusive {c.name} collection, meticulously crafted for the modern silhouette.
        Every piece is prototyped with restraint to strip away the unnecessary until only the perfect form remains.
      </p>
    ),
  }));

  cards.push({
    title: "FIFA '26 Capsule",
    description: "Coming Soon",
    src: "/images/football.jpeg", 
    ctaText: "Notify",
    ctaLink: "#",
    content: () => (
      <p>
        Get ready for the ultimate fusion of football heritage and high fashion. 
        The FIFA '26 Capsule brings archival sportswear aesthetics into the modern streetwear era. 
        Dropping exclusively next season.
      </p>
    ),
  });

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md h-full w-full z-[90] md:hidden"
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[100] px-4 py-10 pointer-events-none md:hidden">
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[500px] h-full flex flex-col bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative pointer-events-auto"
            >
              <motion.button
                key={`button-${active.title}-${id}`}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.05 } }}
                className="flex absolute top-4 right-4 items-center justify-center bg-white/80 backdrop-blur-sm rounded-full h-8 w-8 z-20"
                onClick={() => setActive(null)}
              >
                <CloseIcon />
              </motion.button>

              <motion.div layoutId={`image-${active.title}-${id}`} className="relative z-10">
                <img
                  src={active.src}
                  alt={active.title}
                  className="w-full h-64 object-cover object-center rounded-t-3xl"
                />
              </motion.div>

              <div className="p-6 bg-black/50 flex-1 overflow-auto z-10">
                <div className="flex flex-col justify-between items-start gap-4 mb-6">
                  <div>
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-serif text-3xl text-[#ECE7D1]"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#EE3C24] mt-2"
                    >
                      {active.description}
                    </motion.p>
                  </div>

                  <motion.a
                    layoutId={`button-${active.title}-${id}`}
                    href={active.ctaLink}
                    className="shrink-0 w-full text-center px-6 py-4 text-[10px] uppercase tracking-[0.2em] rounded-full font-bold bg-[#ECE7D1] text-black hover:bg-[#EE3C24] hover:text-white transition-colors"
                  >
                    {active.ctaText}
                  </motion.a>
                </div>
                
                <div className="relative">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-sans text-[13px] leading-relaxed text-white/70 pb-10"
                  >
                    {typeof active.content === "function" ? active.content() : active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <ul className="w-full flex flex-col gap-4 md:hidden">
        {cards.map((card) => (
          <motion.li
            layoutId={`card-${card.title}-${id}`}
            key={`card-${card.title}-${id}`}
            onClick={() => setActive(card)}
            className="flex flex-row justify-between items-center p-3 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors rounded-2xl cursor-pointer"
          >
            <div className="flex gap-4 flex-row items-center w-full">
              <motion.div layoutId={`image-${card.title}-${id}`} className="shrink-0 w-20 h-20">
                <img
                  src={card.src}
                  alt={card.title}
                  className="w-full h-full rounded-xl object-cover object-center"
                />
              </motion.div>
              
              <div className="flex-1">
                <motion.h3
                  layoutId={`title-${card.title}-${id}`}
                  className="font-serif text-xl text-[#ECE7D1]"
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.description}-${id}`}
                  className="font-sans text-[9px] uppercase tracking-[0.2em] text-white/50 mt-1"
                >
                  {card.description}
                </motion.p>
              </div>
            </div>

            <motion.button
              layoutId={`button-${card.title}-${id}`}
              className="shrink-0 ml-4 px-5 py-2.5 text-[9px] uppercase tracking-[0.2em] rounded-full font-bold bg-white/10 text-[#ECE7D1]"
            >
              {card.ctaText}
            </motion.button>
          </motion.li>
        ))}
      </ul>
    </>
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

      {/* ── PHILOSOPHY SECTION (SMOOTH ROUNDED & FIXED HEIGHT) ── */}
      <section className="relative py-12 md:py-16 z-10 w-full">
        <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
          <div className="flex flex-col md:grid md:grid-cols-2 gap-6 lg:gap-10 items-stretch">

            <Reveal className="order-2 md:order-1 w-full h-full">
              <div className="relative flex w-full h-full min-h-[300px] md:min-h-[400px] lg:min-h-[450px] bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-3 shadow-lg">
                <div className="relative flex-1 w-full rounded-[1.5rem] overflow-hidden bg-black/20 min-h-[250px]">
                  <Image
                    src="/images/studio.avif"
                    alt="Studio Setup"
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                  />
                </div>
              </div>
            </Reveal>

            <div className="order-1 md:order-2 flex flex-col justify-center bg-white/5 backdrop-blur-md border border-white/10 p-8 md:p-10 lg:p-14 rounded-[2rem] shadow-lg h-full min-h-[300px] md:min-h-[400px] lg:min-h-[450px]">
              <Reveal>
                <div className="flex items-center gap-4 mb-4 md:mb-6">
                  <span className="w-12 h-px bg-[#EE3C24]" />
                  <span className="font-sans text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-[#EE3C24]">Studio Ethos</span>
                </div>
              </Reveal>
              <Reveal>
                <h2 className="font-serif text-[2.2rem] sm:text-[2.8rem] md:text-[3.5rem] xl:text-[4.5rem] leading-[1.1] md:leading-[1] tracking-tight text-[#ECE7D1] mb-6 flex flex-wrap gap-x-3">
                  <LayoutTextFlip text="The Art of " words={["Subtraction.", "Minimalism.", "Essentialism.", "Restraint."]} />
                </h2>
              </Reveal>
              <Reveal>
                <p className="font-sans text-[13px] md:text-[15px] xl:text-[16px] leading-[1.7] text-white/70 mb-8 max-w-xl">
                  We believe true luxury lies in the unseen details. Every <SketchHighlight>stitch, seam, and redefined silhouette</SketchHighlight> is painstakingly prototyped in our Barrackpore studio. We strip away the unnecessary until only the perfect form remains.
                </p>
              </Reveal>
              <Reveal>
                <Link href="/about" className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 text-[#ECE7D1] px-8 py-4 rounded-full font-sans text-[11px] md:text-[12px] uppercase tracking-[0.2em] w-max hover:bg-white hover:text-black transition-all duration-300 shadow-lg">
                  Our Story
                </Link>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* ── EDITORIAL BANNER (WIDENED & ROUNDED) ── */}
      <section ref={bannerRef} className="relative h-[85svh] overflow-hidden my-10 md:my-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] mx-auto w-[calc(100%-1rem)] md:w-[calc(100%-2rem)] xl:w-[calc(100%-4rem)] max-w-[2400px]">
        <motion.div className="absolute inset-0 w-full h-[140%] top-[-20%]" style={{ y: bannerParallax }}>
          <Image src="/images/mockup.png" alt="Editorial Banner" fill className="object-cover" priority />
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
            <Link href="/products" className="bg-white/10 border border-white/20 hover:bg-white px-12 py-5 font-sans text-[11px] md:text-[12px] font-bold tracking-[0.2em] uppercase text-[#ECE7D1] hover:text-black transition-all duration-500 rounded-full inline-flex items-center gap-4">
              Shop The Look
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── STUDIO & STORY PREVIEW ── */}
      <section className="w-full py-20 md:py-32 z-10 relative">
        <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
          
          {/* Desktop View: Text with LinkPreviews */}
          <Reveal className="hidden md:flex flex-col items-center justify-center text-center">
            <div className="font-serif text-[clamp(1.8rem,5vw,4.5rem)] leading-[1.3] text-white/60 max-w-6xl">
              Discover our roots. Read our{" "}
              <LinkPreview
                url="/about"
                isStatic
                imageSrc="/images/about.webp"
                className="font-bold text-[#ECE7D1] hover:text-[#EE3C24] transition-colors underline decoration-white/20 underline-offset-8"
              >
                Story
              </LinkPreview>{" "}
              and explore the{" "}
              <LinkPreview
                url="/bts"
                isStatic
                imageSrc="/images/bts.jpeg"
                className="font-bold text-[#ECE7D1] hover:text-[#EE3C24] transition-colors underline decoration-white/20 underline-offset-8"
              >
                Behind the Scenes
              </LinkPreview>{" "}
              of our Barrackpore studio.
            </div>
          </Reveal>

          {/* Mobile View: Interactive Vertical Accordion */}
          <div className="md:hidden flex flex-col w-full">
            <Reveal>
              <h2 className="font-serif text-3xl text-[#ECE7D1] mb-2">Discover our roots.</h2>
              <p className="font-sans text-[11px] uppercase tracking-widest text-white/60">
                Tap to explore the archive.
              </p>
            </Reveal>
            <Reveal>
              <MobileStoryStudioInteractive />
            </Reveal>
          </div>

        </div>
      </section>

      {/* ── SHOP BY CATEGORY (HYBRID DESKTOP/MOBILE) ── */}
      <section className="w-full py-16 relative z-10">
        <div className="w-full max-w-600 mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 mb-10 flex items-end justify-between">
          <Reveal>
            <h2 className="font-serif leading-[1.1] text-[#ECE7D1]" style={{ fontSize: "clamp(2.5rem,6vw,5rem)" }}>
              Explore the<br /><em><SketchHighlight type="circle" delay={300} color="#EE3C24">Archive</SketchHighlight></em>
            </h2>
          </Reveal>
        </div>
        
        <Reveal>
          <div className="px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 w-full max-w-[2400px] mx-auto">
            {/* Desktop View: Expanding Blur Accordion */}
            <DesktopCategoryShowcase categories={HOME_CATEGORIES} />
            
            {/* Mobile View: Interactive List + Modal */}
            <MobileCategoryCards categories={HOME_CATEGORIES} />
          </div>
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
      <section className="w-full relative z-10 py-16 md:py-20 pb-24 md:pb-32">
        <div className="w-full max-w-300 mx-auto px-4 sm:px-8 md:px-12">
          <Reveal>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-4xl p-6 sm:p-10 md:p-24 text-center flex flex-col items-center shadow-2xl">
              <div className="flex justify-center mb-4 md:mb-6">
                <h2 className="font-serif leading-[1.1] md:leading-[0.92] tracking-tight text-[#ECE7D1]" style={{ fontSize: "clamp(2rem,8vw,5rem)" }}>
                  <LayoutTextFlip text="Join the " words={["Edit.", "Archive.", "Culture.", "Movement."]} />
                </h2>
              </div>
              <p className="font-sans text-[10px] sm:text-[11px] md:text-[14px] tracking-[0.1em] text-white/60 mb-8 md:mb-12 max-w-md px-2">
                New drops. Exclusive access. Zero noise. Subscribe to stay ahead of the archive.
              </p>

              <form onSubmit={(e) => e.preventDefault()} className="w-full max-w-xl flex flex-col sm:flex-row items-stretch gap-3 sm:gap-0 sm:bg-black/40 sm:border sm:border-white/20 sm:rounded-full overflow-hidden sm:p-1.5 group sm:focus-within:border-white/50 transition-all">
                <input type="email" placeholder="YOUR EMAIL ADDRESS" className="flex-1 bg-black/40 sm:bg-transparent border border-white/20 sm:border-none rounded-full sm:rounded-none outline-none font-sans text-[10px] md:text-[12px] uppercase tracking-[0.2em] text-[#ECE7D1] placeholder-white/30 px-6 sm:px-8 py-4 sm:py-5 text-center sm:text-left focus:border-white/50 sm:focus:border-none transition-colors" />
                <button type="submit" className="bg-[#ECE7D1] text-black rounded-full font-sans text-[10px] md:text-[12px] font-bold uppercase tracking-[0.2em] px-8 sm:px-10 py-4 sm:py-5 hover:bg-[#EE3C24] hover:text-white transition-colors duration-300 shrink-0 w-full sm:w-auto">
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