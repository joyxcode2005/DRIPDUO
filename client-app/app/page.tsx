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
    <div className="relative group bg-white/3 hover:bg-white/6 p-8 md:p-10 rounded-2xl border border-white/10 hover:border-white/20 flex flex-col gap-3 items-center text-center w-full transition-all duration-500 overflow-hidden">
      {/* Subtle red glow on hover */}
      <div className="absolute inset-0 bg-linear-to-br from-[#EE3C24]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
      <span className="font-serif text-[clamp(2.8rem,5vw,4.5rem)] leading-none text-[#ECE7D1] tabular-nums relative z-10">
        {count}<span className="text-[#EE3C24]">{suffix}</span>
      </span>
      <div className="w-8 h-px bg-white/20 group-hover:w-16 group-hover:bg-[#EE3C24]/50 transition-all duration-500" />
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

// ── 3D CYLINDER CAROUSEL FOR LOOKBOOK ──
function Lookbook3DCarousel({ products }: { products: FeaturedProduct[] }) {
  const rotation = useMotionValue(0);

  // Three separate state refs so they don't conflict
  const isDragging = useRef(false);       // true during an active pan gesture
  const isHovered = useRef(false);        // true while mouse is over the carousel
  const dragDelta = useRef(0);            // tracks how far we moved during a pan
  const velocity = useRef(0);            // inertia velocity after drag release
  const lastDragX = useRef(0);           // last x position to compute velocity

  const [isMobile, setIsMobile] = useState(false);
  // mounted must always start as false on both server and client.
  // The lazy initialiser trick using typeof window causes hydration mismatches
  // because Next.js SSR evaluates it as false but the client evaluates it as
  // true before React reconciles, producing different trees. useEffect is the
  // only safe place to flip this flag.
  const [mounted, setMounted] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    // Hide hint after 4 seconds
    const t = setTimeout(() => setHintVisible(false), 4000);
    return () => { window.removeEventListener("resize", check); clearTimeout(t); };
  }, []);

  // Auto-spin + inertia decay in a single animation frame loop
  useAnimationFrame((_, delta) => {
    if (isDragging.current) return; // user is actively dragging — do nothing

    if (Math.abs(velocity.current) > 0.05) {
      // Apply drag inertia: decay velocity and spin
      rotation.set(rotation.get() + velocity.current);
      velocity.current *= 0.94; // friction
    } else if (!isHovered.current) {
      // Auto-spin only when not hovered and not coasting
      velocity.current = 0;
      rotation.set(rotation.get() - delta / 60); // slow cinematic spin
    }
  });

  if (!mounted) return <div className="w-full h-130 md:h-140" />;

  const n = products.length;

  // ── Card dimensions ──
  const cardWidth  = isMobile ? 150 : 280;
  const cardHeight = isMobile ? 210 : 400;

  // ── Gap between cards so they never touch ──
  const gap = isMobile ? 40 : 80;

  // ── Correct cylinder radius: circumference = n × (cardWidth + gap) ──
  const radius = Math.round((n * (cardWidth + gap)) / (2 * Math.PI));

  // ── Perspective: ~2.2× radius so the circular arc reads clearly ──
  const perspective = Math.round(radius * 2.2);

  // ── Viewport: enough vertical room to see the arc receding behind ──
  // Card height + generous padding — cards must never be clipped top/bottom
  const viewportH = isMobile ? cardHeight + 200 : cardHeight + 280;

  return (
    <div
      className="relative w-full flex flex-col items-center"
      onMouseEnter={() => { isHovered.current = true; }}
      onMouseLeave={() => { isHovered.current = false; }}
    >
      {/* Perspective wrapper — NO overflow-hidden so 3D cards are never clipped */}
      <div
        className="relative w-full flex items-center justify-center"
        style={{
          height: `${viewportH}px`,
          perspective: `${perspective}px`,
          perspectiveOrigin: "50% 50%",
        }}
      >
        {/* The spinning cylinder — pointer events only on drag wrapper, not on cards directly */}
        <motion.div
          // ── Drag handling ──
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
            // Track velocity for inertia
            velocity.current = dx * (isMobile ? 0.5 : 0.35);
            dragDelta.current += Math.abs(dx);
            lastDragX.current = info.point.x;
          }}
          onPanEnd={() => {
            isDragging.current = false;
            // velocity.current already set during onPan — inertia takes over
          }}
          style={{
            rotateY: rotation,
            transformStyle: "preserve-3d",
            width: cardWidth,
            height: cardHeight,
          }}
          // Only show grab cursor — clicking individual cards handled below
          className="relative shrink-0 cursor-grab active:cursor-grabbing"
        >
          {products.map((p, i) => {
            const angle = (360 / n) * i;
            const href = p.id.startsWith("mock-") ? "#" : `/products/${p.id}`;

            return (
              <div
                key={p.id}
                className="absolute inset-0 w-full h-full"
                style={{
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  backfaceVisibility: "visible",
                }}
              >
                {/* Clickable card — uses pointer-events only when not dragging */}
                <Link
                  href={href}
                  // Prevent navigation if this was actually a drag
                  onClick={(e) => { if (dragDelta.current > 6) e.preventDefault(); }}
                  draggable={false}
                  className="group block w-full h-full rounded-[1.2rem] md:rounded-4xl overflow-hidden border border-white/20 shadow-[0_8px_40px_rgba(0,0,0,0.6)] transition-transform duration-300 hover:scale-[1.03]"
                  style={{ background: "rgba(10,10,10,0.6)" }}
                >
                  <Image
                    src={p.product_images?.[0]?.url || "/images/mockup.png"}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 40vw, 22vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    draggable={false}
                  />
                  {/* Dark gradient — deepens on hover */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-80" />

                  {/* Card info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 z-10">
                    <p className="font-sans text-[7px] md:text-[8px] uppercase tracking-[0.2em] text-[#EE3C24] mb-0.5 md:mb-1">
                      {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
                    </p>
                    <h3 className="font-serif text-[0.85rem] md:text-lg text-[#ECE7D1] leading-tight drop-shadow-md line-clamp-1">
                      {p.name}
                    </h3>
                    {/* Arrow shown on hover */}
                    <div className="mt-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                      <span className="font-sans text-[7px] md:text-[8px] uppercase tracking-[0.2em] text-white/70">View</span>
                      <ArrowRight size={10} className="text-white/70" />
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </motion.div>

        {/* Left/right fade vignettes */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 bg-linear-to-r from-[#050505] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 bg-linear-to-l from-[#050505] to-transparent z-10" />
      </div>

      {/* Interaction hint — fades out automatically */}
      <motion.div
        className="mt-6 md:mt-8 flex flex-col items-center gap-2 pointer-events-none"
        initial={{ opacity: 0.6 }}
        animate={{ opacity: hintVisible ? 0.5 : 0 }}
        transition={{ duration: 1.2 }}
      >
        <div className="flex items-center gap-3">
          {/* Left arrow */}
          <svg width="18" height="10" viewBox="0 0 18 10" fill="none" className="text-white/50">
            <path d="M12 1l5 4-5 4M1 5h16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" transform="scale(-1,1) translate(-18,0)" />
          </svg>
          <span className="font-sans text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-white/50">Drag to spin</span>
          {/* Right arrow */}
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
            {/* Dynamic Gradient */}
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
      className="hidden md:flex flex-row w-full h-[60vh] gap-4 max-w-600 mx-auto"
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
            {/* Gradient overlay - always present for text legibility */}
            <div className={`absolute inset-0 transition-all duration-700 ${isHovered ? "bg-linear-to-t from-black/90 via-black/40 to-black/10" : "bg-linear-to-t from-black/80 via-black/20 to-transparent"}`} />
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
    title: "FIFA …26 Capsule",
    description: "Coming Soon",
    src: "/images/football.jpeg", 
    ctaText: "Notify",
    ctaLink: "#",
    content: () => (
      <p>
        Get ready for the ultimate fusion of football heritage and high fashion. 
        The FIFA &apos;26 Capsule brings archival sportswear aesthetics into the modern streetwear era. 
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
              className="w-full max-w-125 h-full flex flex-col bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative pointer-events-auto"
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

              // eslint-disable-next-line react/jsx-no-comment-textnodes
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

      

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-[-55%] text-center w-full px-4 z-20 flex flex-col items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }} className="w-full max-w-[90vw] md:max-w-max">
            <h2 className="font-sans text-[10px] sm:text-[11px] md:text-[13px] uppercase tracking-[0.5em] sm:tracking-[0.7em] text-[#ECE7D1]/60 mb-6 sm:mb-8 drop-shadow-md">Archive Collection</h2>
            <div className="flex flex-col items-center justify-center gap-0">
              <div className="overflow-hidden">
                <Reveal>
                  <h1 className="font-serif italic leading-[1.05] md:leading-[0.95] tracking-tight text-[#ECE7D1] drop-shadow-2xl whitespace-nowrap" style={{ fontSize: "clamp(3.5rem, 12vw, 9rem)" }}>
                    New
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

          {/* CTA below hero title */}
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
      <section className="py-20 md:py-32 relative z-10 w-full">
        <div className="w-full max-w-600 mx-auto">
            <Reveal className="mb-12 md:mb-20 px-4 flex flex-col md:flex-row md:items-end md:justify-between max-w-600 mx-auto md:px-12 lg:px-16 xl:px-24">
              <div>
                <span className="inline-flex items-center gap-3 mb-4">
                  <div className="w-6 h-px bg-[#EE3C24]" />
                  <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-[#EE3C24]">FW26</span>
                </span>
                <h2 className="font-serif leading-none tracking-tight text-[#ECE7D1] drop-shadow-lg" style={{ fontSize: "clamp(2.8rem, 7vw, 6rem)" }}>
                  The<br /><em>Lookbook</em>
                </h2>
              </div>
            </Reveal>

            {/* Injected 3D Carousel Component */}
            <Lookbook3DCarousel products={finalLookbookProducts} />
        </div>
      </section>

      {/* ── PHILOSOPHY SECTION (SMOOTH ROUNDED & FIXED HEIGHT) ── */}
      <section className="relative py-12 md:py-16 z-10 w-full mt-10 md:mt-20">
        <div className="w-full max-w-500 mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
          <div className="flex flex-col md:grid md:grid-cols-2 gap-6 lg:gap-10 items-stretch">

            <Reveal className="order-2 md:order-1 w-full h-full">
              <div className="relative flex w-full h-full min-h-75 md:min-h-100 lg:min-h-112.5 bg-white/3 backdrop-blur-md border border-white/10 rounded-4xl p-3 shadow-lg group">
                <div className="relative flex-1 w-full rounded-3xl overflow-hidden bg-black/20 min-h-62.5">
                  <Image
                    src="/images/studio.avif"
                    alt="Studio Setup"
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-[1.2s] ease-in-out"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  {/* Corner label */}
                  <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200">
                    <span className="font-sans text-[8px] uppercase tracking-[0.25em] text-white/70 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">Barrackpore Studio</span>
                  </div>
                </div>
              </div>
            </Reveal>

            <div className="order-1 md:order-2 flex flex-col justify-center bg-white/3 backdrop-blur-md border border-white/10 p-8 md:p-10 lg:p-14 rounded-4xl shadow-lg h-full min-h-75 md:min-h-100 lg:min-h-112.5">
              <Reveal>
                <div className="flex items-center gap-4 mb-6 md:mb-8">
                  <div className="w-8 h-px bg-[#EE3C24]" />
                  <span className="font-sans text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-[#EE3C24]">Studio Ethos</span>
                </div>
              </Reveal>
              <Reveal>
                <h2 className="font-serif text-[2rem] sm:text-[2.5rem] md:text-[3.2rem] xl:text-[4rem] leading-[1.08] tracking-tight text-[#ECE7D1] mb-6 md:mb-8">
                  <LayoutTextFlip text="The Art of " words={["Subtraction.", "Minimalism.", "Essentialism.", "Restraint."]} />
                </h2>
              </Reveal>
              <Reveal>
                <p className="font-sans text-[13px] md:text-[14px] xl:text-[15px] leading-[1.8] text-white/60 mb-10 max-w-xl">
                  We believe true luxury lies in the unseen details. Every <SketchHighlight>stitch, seam, and redefined silhouette</SketchHighlight> is painstakingly prototyped in our Barrackpore studio. We strip away the unnecessary until only the perfect form remains.
                </p>
              </Reveal>
              <Reveal>
                <Link href="/about" className="inline-flex items-center gap-3 group border border-white/20 text-[#ECE7D1] px-8 py-4 rounded-full font-sans text-[10px] md:text-[11px] uppercase tracking-[0.25em] w-max hover:bg-white hover:text-black transition-all duration-400 hover:border-white shadow-lg">
                  Our Story
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* ── EDITORIAL BANNER (WIDENED & ROUNDED) ── */}
      <section ref={bannerRef} className="relative h-[85svh] overflow-hidden my-10 md:my-20 border border-white/10 rounded-4xl mx-auto w-[calc(100%-1rem)] md:w-[calc(100%-2rem)] xl:w-[calc(100%-4rem)] max-w-600">
        <motion.div className="absolute inset-0 w-full h-[140%] top-[-20%]" style={{ y: bannerParallax }}>
          <Image src="/images/mockup.png" alt="Editorial Banner" fill className="object-cover" priority />
        </motion.div>
        {/* Multi-layer cinematic gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-black/85 via-black/30 to-black/75 pointer-events-none" />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

        {/* Editorial corner label */}
        <div className="absolute top-8 left-8 md:top-10 md:left-10 z-10">
          <span className="font-sans text-[8px] uppercase tracking-[0.3em] text-white/40">Editorial — FW26</span>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 pointer-events-none">
          <Reveal className="delay-100">
            <h2 className="font-serif italic leading-[0.88] tracking-tight text-[#ECE7D1] mb-8 drop-shadow-2xl" style={{ fontSize: "clamp(4rem,10vw,12rem)" }}>
              Redefine<br />the Silhouette
            </h2>
          </Reveal>
          <Reveal className="delay-200">
            <p className="font-sans text-[11px] md:text-[14px] leading-loose tracking-[0.04em] text-white/65 max-w-sm mx-auto mb-14 drop-shadow-md">
              A collection built from obsession. Drop into the archive and find your next statement piece.
            </p>
          </Reveal>
          <Reveal className="delay-300 pointer-events-auto">
            <Link href="/products" className="group inline-flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/25 hover:bg-white px-12 py-5 font-sans text-[10px] md:text-[11px] font-bold tracking-[0.25em] uppercase text-[#ECE7D1] hover:text-black transition-all duration-500 rounded-full shadow-2xl">
              Shop The Look
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </Reveal>
        </div>

        {/* Bottom editorial strip */}
        <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between z-10 pointer-events-none">
          <div className="h-px flex-1 bg-white/10" />
          <span className="font-sans text-[8px] uppercase tracking-[0.3em] text-white/30 mx-6">Barrackpore, India</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>
      </section>

      {/* ── STUDIO & STORY PREVIEW ── */}
      <section className="w-full py-20 md:py-32 z-10 relative">
        <div className="w-full max-w-500 mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
          
          {/* Desktop View: Text with LinkPreviews */}
          <Reveal className="hidden md:flex flex-col items-center justify-center text-center">
            <div className="font-serif text-[clamp(1.6rem,4.5vw,4rem)] leading-[1.4] text-white/50 max-w-5xl mx-auto">
              Discover our roots. Read our{" "}
              <LinkPreview
                url="/about"
                isStatic
                imageSrc="/images/about.webp"
                className="font-bold text-[#ECE7D1] hover:text-[#EE3C24] transition-colors duration-300 underline decoration-white/15 underline-offset-8 hover:decoration-[#EE3C24]/40"
              >
                Story
              </LinkPreview>{" "}
              and explore the{" "}
              <LinkPreview
                url="/bts"
                isStatic
                imageSrc="/images/bts.jpeg"
                className="font-bold text-[#ECE7D1] hover:text-[#EE3C24] transition-colors duration-300 underline decoration-white/15 underline-offset-8 hover:decoration-[#EE3C24]/40"
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
            <span className="inline-flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-[#EE3C24]" />
              <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-[#EE3C24]">05 Categories</span>
            </span>
            <h2 className="font-serif leading-[1.05] text-[#ECE7D1]" style={{ fontSize: "clamp(2.5rem,6vw,5rem)" }}>
              Explore the<br /><em><SketchHighlight type="circle" delay={300} color="#EE3C24">Archive</SketchHighlight></em>
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
          <div className="px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 w-full max-w-600 mx-auto">
            {/* Desktop View: Expanding Blur Accordion */}
            <DesktopCategoryShowcase categories={HOME_CATEGORIES} />
            
            {/* Mobile View: Interactive List + Modal */}
            <MobileCategoryCards categories={HOME_CATEGORIES} />
          </div>
        </Reveal>
      </section>

      {/* ── STATS ── */}
      <section ref={statsRef} className="relative z-10 py-16 md:py-24">
        <div className="w-full max-w-500 mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
          <Reveal className="mb-10 md:mb-14 flex items-center gap-6">
            <div className="w-8 h-px bg-[#EE3C24]" />
            <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-[#EE3C24]">By the Numbers</span>
            <div className="flex-1 h-px bg-white/5" />
          </Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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

      {/* ── EMAIL JOIN ── */}
      <section className="w-full relative z-10 py-16 md:py-20 pb-24 md:pb-32">
        <div className="w-full max-w-300 mx-auto px-4 sm:px-8 md:px-12">
          <Reveal>
            <div className="relative bg-white/3 backdrop-blur-md border border-white/10 rounded-4xl p-8 sm:p-12 md:p-16 lg:p-20 text-center flex flex-col items-center shadow-2xl overflow-hidden">
              
              {/* Subtle background accent */}
              <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-[#EE3C24]/5 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-[#EE3C24]/3 blur-3xl pointer-events-none" />

              <div className="flex items-center gap-4 mb-6 md:mb-8">
                <div className="w-6 h-px bg-[#EE3C24]" />
                <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-[#EE3C24]">Stay Connected</span>
                <div className="w-6 h-px bg-[#EE3C24]" />
              </div>

              <div className="flex justify-center mb-5 md:mb-6">
                <h2 className="font-serif leading-[1.05] tracking-tight text-[#ECE7D1] relative z-10" style={{ fontSize: "clamp(2.2rem,8vw,5rem)" }}>
                  <LayoutTextFlip text="Join the " words={["Edit.", "Archive.", "Culture.", "Movement."]} />
                </h2>
              </div>
              <p className="font-sans text-[10px] sm:text-[11px] md:text-[13px] tracking-[0.08em] text-white/50 mb-10 md:mb-14 max-w-sm px-2 leading-[1.9] relative z-10">
                New drops. Exclusive access. Zero noise.<br className="hidden md:block" />
                Subscribe to stay ahead of the archive.
              </p>

              <form onSubmit={(e) => e.preventDefault()} className="w-full max-w-xl flex flex-col sm:flex-row items-stretch gap-3 sm:gap-0 sm:bg-black/50 sm:border sm:border-white/15 sm:rounded-full overflow-hidden sm:p-2 group sm:focus-within:border-white/40 transition-all duration-300 relative z-10">
                <input
                  type="email"
                  placeholder="YOUR EMAIL ADDRESS"
                  className="flex-1 bg-black/40 sm:bg-transparent border border-white/15 sm:border-none rounded-full sm:rounded-none outline-none font-sans text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-[#ECE7D1] placeholder-white/25 px-7 sm:px-8 py-4 sm:py-5 text-center sm:text-left focus:border-white/40 sm:focus:border-none transition-colors"
                />
                <button
                  type="submit"
                  className="bg-[#ECE7D1] text-black rounded-full font-sans text-[10px] md:text-[11px] font-bold uppercase tracking-[0.25em] px-8 sm:px-10 py-4 sm:py-5 hover:bg-[#EE3C24] hover:text-white transition-colors duration-300 shrink-0 w-full sm:w-auto"
                >
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