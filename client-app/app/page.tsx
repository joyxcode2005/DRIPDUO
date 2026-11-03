/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-no-comment-textnodes */
"use client";

import React, { useEffect, useState, useRef, useId } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useAnimationFrame } from "framer-motion";
import { HOME_CATEGORIES } from "@/constants";
import { SketchHighlight } from "@/components/ui/sketch-highlight";
import { getProductsForLookbookSection } from "@/services/products";
import Reveal from "@/components/Reveal";
import Image from "next/image";
import { LayoutTextFlip } from "@/components/ui/LayoutTextFlip";
import { LinkPreview } from "@/components/ui/LinkPreview";

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
    <div className="relative group bg-white/3 hover:bg-white/6 p-8 md:p-10 rounded-2xl border border-white/10 hover:border-white/20 flex flex-col gap-3 items-center text-center w-full transition-all duration-500 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-[#C5B382]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
      <span className="font-serif text-[clamp(2.8rem,5vw,4.5rem)] leading-none text-[#ECE7D1] tabular-nums relative z-10">
        {count}<span className="text-[#C5B382]">{suffix}</span>
      </span>
      <div className="w-8 h-px bg-white/20 group-hover:w-16 group-hover:bg-[#C5B382]/50 transition-all duration-500" />
      <span className="font-sans text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-white/50 group-hover:text-white/80 transition-colors duration-500 relative z-10">{label}</span>
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

// ── DYNAMIC 3D CARD FOR LOOKBOOK ──
function CarouselCard({ p, i, n, angle, radius, rotation, dragDelta }: any) {
  const href = p.id.startsWith("mock-") ? "#" : `/products/${p.id}`;

  const darknessOpacity = useTransform(rotation, (val: number) => {
    let a = (val + angle) % 360;
    if (a < 0) a += 360;
    const dist = Math.min(a, 360 - a);
    return (dist / 180) * 0.85; 
  });

  return (
    <div
      className="absolute inset-0 w-full h-full"
      style={{
        transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
        backfaceVisibility: "visible", 
        willChange: "transform",
      }}
    >
      <Link
        href={href}
        onClick={(e) => { if (dragDelta.current > 6) e.preventDefault(); }}
        draggable={false}
        className="group block w-full h-full rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.8)] transition-transform duration-300 hover:scale-[1.03] bg-[#050505]"
        style={{ 
          WebkitMaskImage: "-webkit-radial-gradient(white, black)",
          transform: "translateZ(0)",
        }}
      >
        <Image
          src={p.product_images?.[0]?.url || "/images/mockup.png"}
          alt={p.name}
          fill
          sizes="(max-width: 768px) 50vw, 30vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          draggable={false}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-80" />

        <motion.div 
          className="absolute inset-0 bg-[#050505] pointer-events-none" 
          style={{ opacity: darknessOpacity, willChange: "opacity" }} 
        />

        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-10">
          <p className="font-sans text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-[#C5B382] mb-1.5 md:mb-2">
            {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </p>
          <h3 className="font-serif text-[1rem] md:text-[1.4rem] text-[#ECE7D1] leading-tight drop-shadow-md line-clamp-1">
            {p.name}
          </h3>
          <div className="mt-2.5 flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
            <span className="font-sans text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-white/70">View</span>
            <ArrowRight size={12} className="text-white/70" />
          </div>
        </div>
      </Link>
    </div>
  );
}

// ── 3D CYLINDER CAROUSEL FOR LOOKBOOK ──
function Lookbook3DCarousel({ products }: { products: FeaturedProduct[] }) {
  const rotation = useMotionValue(0);

  const isDragging = useRef(false);
  const isHovered = useRef(false);
  const dragDelta = useRef(0);
  const velocity = useRef(0);
  const lastDragX = useRef(0);

  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    const t = setTimeout(() => setHintVisible(false), 4000);
    return () => { window.removeEventListener("resize", check); clearTimeout(t); };
  }, []);

  useAnimationFrame((_, delta) => {
    if (isDragging.current) return;

    if (Math.abs(velocity.current) > 0.05) {
      rotation.set(rotation.get() + velocity.current);
      velocity.current *= 0.94; 
    } else if (!isHovered.current) {
      velocity.current = 0;
      rotation.set(rotation.get() - delta / 60); 
    }
  });

  if (!mounted) return <div className="w-full h-130 md:h-140" />;

  const n = products.length;

  const cardWidth  = isMobile ? 220 : 480;
  const cardHeight = isMobile ? 320 : 660;
  const gap = isMobile ? 40 : 120;

  const radius = Math.round((n * (cardWidth + gap)) / (2 * Math.PI));
  
  const perspective = isMobile ? 1200 : 2500;
  const viewportH = isMobile ? cardHeight + 80 : cardHeight + 160;

  return (
    <div
      className="relative w-full flex flex-col items-center"
      onMouseEnter={() => { isHovered.current = true; }}
      onMouseLeave={() => { isHovered.current = false; }}
    >
      <div
        className="relative w-full flex items-center justify-center"
        style={{
          height: `${viewportH}px`,
          perspective: `${perspective}px`,
          perspectiveOrigin: "50% 50%",
        }}
      >
        <motion.div
          onPanStart={(_, info) => {
            isDragging.current = true;
            dragDelta.current = 0;
            lastDragX.current = info.point.x;
            velocity.current = 0;
            setHintVisible(false);
          }}
          onPan={(_, info) => {
            const dx = info.delta.x;
            rotation.set(rotation.get() + dx * (isMobile ? 0.5 : 0.35));
            velocity.current = dx * (isMobile ? 0.5 : 0.35);
            dragDelta.current += Math.abs(dx);
            lastDragX.current = info.point.x;
          }}
          onPanEnd={() => {
            isDragging.current = false;
          }}
          style={{
            z: -radius, 
            rotateY: rotation,
            transformStyle: "preserve-3d",
            willChange: "transform",
            width: cardWidth,
            height: cardHeight,
          }}
          className="relative shrink-0 cursor-grab active:cursor-grabbing"
        >
          {products.map((p, i) => {
            const angle = (360 / n) * i;
            return (
              <CarouselCard
                key={p.id}
                p={p}
                i={i}
                n={n}
                angle={angle}
                radius={radius}
                rotation={rotation}
                dragDelta={dragDelta}
              />
            );
          })}
        </motion.div>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 md:w-32 bg-linear-to-r from-[#050505] via-[#050505]/70 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 md:w-32 bg-linear-to-l from-[#050505] via-[#050505]/70 to-transparent z-10" />
      </div>

      <motion.div
        className="mt-6 md:mt-10 flex flex-col items-center gap-2 pointer-events-none"
        initial={{ opacity: 0.6 }}
        animate={{ opacity: hintVisible ? 0.5 : 0 }}
        transition={{ duration: 1.2 }}
      >
        <div className="flex items-center gap-3">
          <svg width="18" height="10" viewBox="0 0 18 10" fill="none" className="text-white/50">
            <path d="M12 1l5 4-5 4M1 5h16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" transform="scale(-1,1) translate(-18,0)" />
          </svg>
          <span className="font-sans text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-white/50">Drag to spin</span>
          <svg width="18" height="10" viewBox="0 0 18 10" fill="none" className="text-white/50">
            <path d="M6 1l5 4-5 4M1 5h16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="w-12 h-px bg-linear-to-r from-transparent via-white/30 to-transparent" />
      </motion.div>
    </div>
  );
}

// ── MOBILE: INTERACTIVE STORY & STUDIO PREVIEW ACCORDION ──
function MobileStoryStudioInteractive() {
  const [active, setActive] = useState<'story' | 'bts' | null>(null);

  const panels = [
    {
      id: 'story',
      title: 'Our Story',
      desc: 'Discover our roots, our obsession with detail, and the journey of crafting true luxury.',
      img: '/images/about.webp', 
      link: '/about'
    },
    {
      id: 'bts',
      title: 'Behind the Scenes',
      desc: 'Step into our Barrackpore studio where every stitch and silhouette is painstakingly prototyped.',
      img: '/images/bts.jpeg', 
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
            onClick={() => setActive(isActive ? null : panel.id as "story" | "bts")}
            className="relative w-full rounded-2xl overflow-hidden cursor-pointer bg-white/5 border border-white/10"
            style={{ flex: isActive ? 4 : isOtherActive ? 1 : 2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} 
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
            <div className={`absolute inset-0 transition-colors duration-700 
              ${isActive ? 'bg-linear-to-t from-black/90 via-black/40 to-transparent' : 
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
                      className="inline-flex items-center gap-2 bg-[#ECE7D1] text-black px-6 py-3 rounded-full font-sans text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#C5B382] hover:text-black transition-colors"
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
    name: "FIFA 26 Capsule",
    Image: "/images/football.jpeg", 
    isUpcoming: true,
  } as any);

  return (
    <div 
      className="hidden md:flex flex-row w-full h-[60vh] md:h-[75vh] gap-3 md:gap-4"
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
              relative flex items-end overflow-hidden rounded-[1.5rem] md:rounded-[2rem] transition-all duration-700 ease-in-out
              bg-white/5 border border-white/10
              ${isUpcoming ? "cursor-default" : "cursor-pointer"}
              ${isHovered ? "flex-[2.5]" : "flex-1"}
            `}
          >
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
            <div className={`absolute inset-0 transition-all duration-700 ${isHovered ? "bg-linear-to-t from-black/90 via-black/40 to-black/10" : "bg-linear-to-t from-black/80 via-black/20 to-transparent"}`} />
            <div className="relative z-10 p-6 md:p-8 w-full flex flex-col justify-end h-full">
              <div className={`transform transition-all duration-700 ${isHovered ? "translate-y-0" : "translate-y-4"}`}>
                
                {isUpcoming ? (
                  <span className={`inline-block px-4 py-2 mb-3 text-[9px] uppercase tracking-[0.25em] bg-[#C5B382]/80 backdrop-blur-md text-black rounded-full font-bold border border-[#C5B382]/50 shadow-lg transition-opacity duration-700 ${isAnotherHovered ? "opacity-20" : "opacity-100"}`}>
                    Coming Soon
                  </span>
                ) : (
                  <span className={`inline-block px-3 py-1.5 mb-3 text-[10px] uppercase tracking-[0.2em] text-[#ECE7D1]/80 bg-black/40 backdrop-blur-md border border-white/10 rounded-full transition-opacity duration-700 ${isAnotherHovered ? "opacity-20" : "opacity-100"}`}>
                    0{i + 1}
                  </span>
                )}

                <h3 className={`font-serif text-3xl lg:text-5xl text-[#ECE7D1] whitespace-nowrap drop-shadow-xl ${isUpcoming ? "italic" : ""} transition-opacity duration-700 ${isAnotherHovered ? "opacity-30" : "opacity-100"}`}>
                  {cat.name}
                </h3>

                <div className={`mt-5 flex items-center gap-3 transition-all duration-700 overflow-hidden ${isHovered ? "opacity-100 max-h-12" : "opacity-0 max-h-0"}`}>
                  {!isUpcoming ? (
                    <>
                      <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#C5B382] font-semibold">Explore Collection</span>
                      <div className="h-px w-8 bg-white/20" />
                      <ArrowRight size={14} strokeWidth={2} className="text-[#C5B382]" />
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
  type CardItem = {
    title: string;
    description: string;
    src: string;
    ctaText: string;
    ctaLink: string;
    content: () => React.ReactNode;
  };
  const [active, setActive] = useState<CardItem | null>(null);

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
    src: typeof c.Image === 'string' ? c.Image : (c.Image as { src: string }).src,
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
    title: "FIFA 26 Capsule",
    description: "Coming Soon",
    src: "/images/football.jpeg", 
    ctaText: "Notify",
    ctaLink: "#",
    content: () => (
      <p>
        Get ready for the ultimate fusion of football heritage and high fashion. 
        The FIFA 26 Capsule brings archival sportswear aesthetics into the modern streetwear era. 
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
            className="fixed inset-0 bg-black/60 backdrop-blur-md h-full w-full z-90 md:hidden"
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-100 px-4 py-10 pointer-events-none md:hidden">
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full h-full flex flex-col bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative pointer-events-auto"
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

              
              <motion.div layoutId={`image-${active.title}-${id}`} className="relative z-10 w-full h-64">
                <Image
                  src={active.src}
                  alt={active.title}
                  fill
                  className="object-cover object-center rounded-t-3xl"
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
                      className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#C5B382] mt-2"
                    >
                      {active.description}
                    </motion.p>
                  </div>

                  <motion.a
                    layoutId={`button-${active.title}-${id}`}
                    href={active.ctaLink}
                    className="shrink-0 w-full text-center px-6 py-4 text-[10px] uppercase tracking-[0.2em] rounded-full font-bold bg-[#ECE7D1] text-black hover:bg-[#C5B382] hover:text-white transition-colors"
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
                <Image
                  src={card.src}
                  alt={card.title}
                  width={80}
                  height={80}
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
  const statsRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  const [statsVisible, setStatsVisible] = useState(false);

  // ── HERO SCROLL FX ──
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // ── EDITORIAL BANNER SCROLL FX ──
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
    if (!statsRef.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStatsVisible(true); obs.disconnect(); } }, { threshold: 0.2 });
    obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  // ── PADDING PRODUCTS TO EXACTLY 10 FOR THE CYLINDER ──
  const localPlaceholders = [
    "/images/about.webp",
    "/images/bts.jpeg",
    "/images/football.jpeg",
    "/images/studio.avif",
    "/images/mockup.png",
  ];

  const displayProducts = [...featuredProducts];
  let placeholderIndex = 0;
  while (displayProducts.length < 10) {
    displayProducts.push({
      id: `mock-${displayProducts.length}`,
      name: `Archive Piece 0${displayProducts.length + 1}`,
      product_images: [{ url: localPlaceholders[placeholderIndex % localPlaceholders.length], is_primary: true }]
    } as FeaturedProduct);
    placeholderIndex++;
  }
  const finalLookbookProducts = displayProducts.slice(0, 10);

  return (
    <div className="min-h-screen text-[#ECE7D1] overflow-x-clip w-full" ref={containerRef}>

      {/* ── HERO SECTION ── */}
      <section className="relative h-dvh w-full overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 w-full">
          <div className="absolute inset-0 z-10 bg-black/50" />
          <div className="absolute inset-0 z-10 bg-linear-to-b from-transparent via-black/10 to-[#050505]" />
          <video
            src="https://ik.imagekit.io/dripduo2026/hero_video2.mp4?tr=q-60,f-auto"
            autoPlay
            loop
            muted
            playsInline
            className={`absolute inset-0 w-full h-full object-cover origin-center transition-transform duration-[3s] ease-out will-change-transform ${heroReady ? "scale-100" : "scale-105"}`}
          />
        </motion.div>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-[-55%] text-center w-full px-4 md:px-6 z-20 flex flex-col items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }} className="w-full">
            <h2 className="font-sans text-[10px] sm:text-[11px] md:text-[13px] uppercase tracking-[0.5em] sm:tracking-[0.7em] text-[#ECE7D1]/60 mb-6 sm:mb-8 drop-shadow-md">Archive Collection</h2>
            <div className="flex flex-col items-center justify-center gap-0">
              <div className="overflow-hidden">
                <Reveal>
                  <h1 className="font-serif leading-[1.05] md:leading-[0.95] tracking-tight text-[#ECE7D1] drop-shadow-2xl whitespace-nowrap" style={{ fontSize: "clamp(3.5rem, 12vw, 9rem)" }}>
                    Redesigned
                  </h1>
                </Reveal>
              </div>
              <div className="overflow-hidden">
                <Reveal className="delay-100">
                  <h1 className="font-serif italic leading-[1.05] md:leading-[0.95] tracking-tight text-[#ECE7D1] drop-shadow-2xl flex justify-center" style={{ fontSize: "clamp(3.5rem, 12vw, 9rem)" }}>
                    <LayoutTextFlip words={["Collection.", "Standard.", "Drop.", "Era."]} />
                  </h1>
                </Reveal>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 md:mt-14"
          >
            <Link
              href="/products"
              className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/25 text-[#ECE7D1] px-8 py-4 rounded-full font-sans text-[10px] md:text-[11px] uppercase tracking-[0.25em] hover:bg-white hover:text-black transition-all duration-500 shadow-xl group"
            >
              Explore the Archive
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 1 }} className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center gap-3">
          <span className="font-sans text-[8px] uppercase tracking-[0.3em] text-white/40 drop-shadow-md">Scroll</span>
          <div className="relative w-px h-14 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-white/60 to-transparent animate-[slideDown_2s_ease-in-out_infinite]" />
          </div>
        </motion.div>
      </section>

      {/* ── NOISE OVERLAY FOR BODY ── */}
      <div className="fixed inset-0 pointer-events-none mix-blend-overlay z-50 opacity-30 w-full" style={{ backgroundImage: NOISE_SVG }} />

      {/* ── LOOKBOOK SECTION (3D CYLINDER CAROUSEL) ── */}
      <section className="pt-20 pb-4 md:pt-32 md:pb-8 relative z-10 w-full overflow-hidden">
        <div className="w-full px-4 md:px-6">
            <Reveal className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end md:justify-between w-full">
              <div>
                <span className="inline-flex items-center gap-3 mb-4">
                  <div className="w-6 h-px bg-[#C5B382]" />
                  <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-[#C5B382]">FW26</span>
                </span>
                <h2 className="font-serif leading-none tracking-tight text-[#ECE7D1] drop-shadow-lg" style={{ fontSize: "clamp(2.8rem, 7vw, 6rem)" }}>
                  The<br /><em>Lookbook</em>
                </h2>
              </div>
            </Reveal>
        </div>

        <div className="w-full relative">
            <Lookbook3DCarousel products={finalLookbookProducts} />
        </div>
      </section>

      {/* ── EDITORIAL BANNER ── */}
      <section ref={bannerRef} className="relative z-10 w-full px-4 md:px-6 my-10 md:my-20">
        
        {/* DESKTOP VIEW: BENTO EDITORIAL GRID */}
        <div className="hidden md:grid grid-cols-3 gap-4 w-full h-[85svh]">
          {/* Large featured block */}
          <div className="col-span-2 relative w-full h-full overflow-hidden rounded-[2.5rem] border border-white/10 group">
            <Image src="/images/mockup.png" alt="Editorial" fill className="object-cover transition-transform duration-[3s] group-hover:scale-105" priority />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-12 left-12 z-10">
              <Reveal>
                <h2 className="font-serif italic text-7xl lg:text-8xl text-[#ECE7D1] drop-shadow-2xl">Redefine<br/>the Silhouette</h2>
              </Reveal>
            </div>
          </div>
          
          {/* Stacked smaller blocks */}
          <div className="flex flex-col gap-4 h-full">
            {/* Text/CTA Block */}
            <div className="relative flex-[1.2] w-full overflow-hidden rounded-[2.5rem] border border-white/10 group bg-[#ECE7D1]/5 p-10 flex flex-col justify-center">
               <Reveal>
                 <div className="flex items-center gap-3 mb-6">
                   <div className="w-6 h-px bg-[#C5B382]" />
                   <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-[#C5B382]">Editorial — FW26</span>
                 </div>
               </Reveal>
               <Reveal className="delay-100">
                 <p className="font-sans text-[14px] xl:text-[15px] leading-loose tracking-[0.04em] text-white/70 mb-8">
                    A collection built from obsession. Drop into the archive and find your next statement piece.
                 </p>
               </Reveal>
               <Reveal className="delay-200">
                 <Link href="/products" className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 rounded-full font-sans text-[11px] uppercase tracking-[0.25em] text-[#ECE7D1] hover:bg-[#C5B382] hover:text-black transition-all">
                   Shop The Look <ArrowRight size={12} />
                 </Link>
               </Reveal>
            </div>
            
            {/* Detail Image Block */}
            <div className="relative flex-1 w-full overflow-hidden rounded-[2.5rem] border border-white/10 group">
              <Image src="/images/bts.jpeg" alt="Detail" fill className="object-cover transition-transform duration-[3s] group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-700" />
              <div className="absolute top-6 right-6 z-10">
                 <span className="font-sans text-[8px] uppercase tracking-[0.3em] text-white/50 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">Barrackpore</span>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE VIEW: CINEMATIC EDITORIAL STORY CARD */}
        <div className="flex md:hidden flex-col w-full h-[80svh] relative rounded-[1.5rem] overflow-hidden border border-white/10 group shadow-2xl">
          <Image src="/images/mockup.png" alt="Editorial" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/40 to-transparent" />
          

          <div className="absolute top-6 right-6 w-[4.5rem] h-[6rem] rounded-xl overflow-hidden border border-white/20 shadow-2xl rotate-3">
             <Image src="/images/bts.jpeg" alt="Detail" fill className="object-cover" />
          </div>

          <div className="absolute inset-0 flex flex-col justify-end p-6 z-10 pb-8">
            <Reveal>
              <h2 className="font-serif italic text-5xl leading-[0.95] text-[#ECE7D1] drop-shadow-2xl mb-5">Redefine<br/>the Silhouette</h2>
            </Reveal>
            <Reveal className="delay-100">
              <p className="font-sans text-[12px] leading-relaxed tracking-wide text-white/75 mb-8 w-[90%]">
                A collection built from obsession. Drop into the archive and find your next statement piece.
              </p>
            </Reveal>
            <Reveal className="delay-200">
              <Link href="/products" className="inline-flex items-center justify-center w-full gap-3 bg-[#C5B382] text-black px-8 py-4 rounded-full font-sans text-[10px] uppercase tracking-[0.25em] font-bold shadow-xl active:scale-95 transition-transform">
                Shop The Look <ArrowRight size={14} strokeWidth={2.5} />
              </Link>
            </Reveal>
          </div>
        </div>

      </section>

      {/* ── SHOP BY CATEGORY (HYBRID DESKTOP/MOBILE) ── */}
      <section className="w-full py-16 md:py-20 relative z-10 px-4 md:px-6">
        <div className="w-full mb-8 flex items-end justify-between">
          <Reveal>
            <span className="inline-flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-[#C5B382]" />
              <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-[#C5B382]">05 Categories</span>
            </span>
            <h2 className="font-serif leading-[1.05] text-[#ECE7D1]" style={{ fontSize: "clamp(2.5rem,6vw,5rem)" }}>
              Explore the<br /><em><SketchHighlight type="circle" delay={300} color="#C5B382">Archive</SketchHighlight></em>
            </h2>
          </Reveal>
          <Reveal>
            <Link href="/products" className="hidden md:inline-flex items-center gap-2 group font-sans text-[10px] uppercase tracking-[0.25em] text-white/40 hover:text-[#ECE7D1] transition-colors duration-300 mb-2">
              All Products
              <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </Reveal>
        </div>
        
        <Reveal>
          <div className="w-full">
            {/* Desktop View: Expanding Blur Accordion */}
            <DesktopCategoryShowcase categories={HOME_CATEGORIES} />
            
            {/* Mobile View: Interactive List + Modal */}
            <MobileCategoryCards categories={HOME_CATEGORIES} />
          </div>
        </Reveal>
      </section>

      {/* ── PHILOSOPHY SECTION (SMOOTH ROUNDED & FIXED HEIGHT) ── */}
      <section className="relative py-12 md:py-16 z-10 w-full mt-10 md:mt-20 px-4 md:px-6">
        <div className="w-full">
          <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-6 items-stretch w-full">

            <Reveal className="order-2 md:order-1 w-full h-full">
              <div className="relative flex w-full h-full min-h-75 md:min-h-100 lg:min-h-112.5 bg-white/3 backdrop-blur-md border border-white/10 rounded-[1.5rem] md:rounded-[2.5rem] p-3 shadow-lg group">
                <div className="relative flex-1 w-full rounded-3xl overflow-hidden bg-black/20 min-h-62.5">
                  <Image
                    src="/images/studio.avif"
                    alt="Studio Setup"
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-[1.2s] ease-in-out"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200">
                    <span className="font-sans text-[8px] uppercase tracking-[0.25em] text-white/70 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">Barrackpore Studio</span>
                  </div>
                </div>
              </div>
            </Reveal>

            <div className="order-1 md:order-2 flex flex-col justify-center bg-white/3 backdrop-blur-md border border-white/10 p-8 md:p-10 lg:p-14 rounded-[1.5rem] md:rounded-[2.5rem] shadow-lg h-full min-h-75 md:min-h-100 lg:min-h-112.5">
              <Reveal>
                <div className="flex items-center gap-4 mb-6 md:mb-8">
                  <div className="w-8 h-px bg-[#C5B382]" />
                  <span className="font-sans text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-[#C5B382]">Studio Ethos</span>
                </div>
              </Reveal>
              <Reveal>
                <h2 className="font-serif text-[2rem] sm:text-[2.5rem] md:text-[3.2rem] xl:text-[4rem] leading-[1.08] tracking-tight text-[#ECE7D1] mb-6 md:mb-8">
                  <LayoutTextFlip text="The Art of " words={["Void.", "Minimalism.", "Restraint."]} />
                </h2>
              </Reveal>
              <Reveal>
                <p className="font-sans text-[13px] md:text-[14px] xl:text-[15px] leading-[1.8] text-white/60 mb-10 max-w-xl">
                  We believe true luxury lies in the unseen details. Every <SketchHighlight color="#C5B382">stitch, seam, and redefined silhouette</SketchHighlight> is painstakingly prototyped in our Barrackpore studio. We strip away the unnecessary until only the perfect form remains.
                </p>
              </Reveal>
              <Reveal>
                <Link href="/about" className="inline-flex items-center gap-3 group border border-white/20 text-[#ECE7D1] px-8 py-4 rounded-full font-sans text-[10px] md:text-[11px] uppercase tracking-[0.25em] w-max hover:bg-[#C5B382] hover:text-black transition-all duration-400 hover:border-[#C5B382] shadow-lg">
                  Our Story
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* ── STUDIO & STORY PREVIEW ── */}
      <section className="w-full py-20 md:py-32 z-10 relative px-4 md:px-6">
        <div className="w-full">
          
          <Reveal className="hidden md:flex flex-col items-center justify-center text-center">
            <div className="font-serif text-[clamp(1.6rem,4.5vw,4rem)] leading-[1.4] text-white/50 w-full mx-auto">
              Discover our roots. Read our{" "}
              <LinkPreview
                url="/about"
                isStatic
                imageSrc="/images/about.webp"
                className="font-bold text-[#ECE7D1] hover:text-[#C5B382] transition-colors duration-300 underline decoration-white/15 underline-offset-8 hover:decoration-[#C5B382]/40"
              >
                Story
              </LinkPreview>{" "}
              and explore the{" "}
              <LinkPreview
                url="/bts"
                isStatic
                imageSrc="/images/bts.jpeg"
                className="font-bold text-[#ECE7D1] hover:text-[#C5B382] transition-colors duration-300 underline decoration-white/15 underline-offset-8 hover:decoration-[#C5B382]/40"
              >
                Behind the Scenes
              </LinkPreview>{" "}
              of our Barrackpore studio.
            </div>
          </Reveal>

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

      {/* ── STATS ── */}
      <section ref={statsRef} className="relative z-10 py-16 md:py-24 px-4 md:px-6">
        <div className="w-full">
          <Reveal className="mb-10 md:mb-14 flex items-center gap-6">
            <div className="w-8 h-px bg-[#C5B382]" />
            <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-[#C5B382]">By the Numbers</span>
            <div className="flex-1 h-px bg-white/5" />
          </Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full">
          {[
            { value: 240, suffix: "+", label: "GSM Heavyweight" },
            { value: 100, suffix: "%", label: "Premium Cotton" },
            { value: 30, suffix: "d", label: "Easy Returns" },
            { value: 5000, suffix: "+", label: "Happy Customers" },
          ].map((s) => (
            <Stat key={s.label} {...s} trigger={statsVisible} />
          ))}
          </div>
        </div>
      </section>
    </div>
  );
}