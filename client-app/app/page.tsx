"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useQuickView } from "@/lib/QuickViewContext";

/* ─────────────────────────────────────────────────────────────────────────────
 * 1. INLINE SKETCH HIGHLIGHT COMPONENT
 * ───────────────────────────────────────────────────────────────────────────── */
interface SketchHighlightProps {
  children: React.ReactNode;
  type?: "circle" | "underline" | "strike";
  color?: string;
  strokeWidth?: number;
  delay?: number;
}

const SketchHighlight = ({
  children,
  type = "underline",
  color = "var(--orange)",
  strokeWidth = 2,
  delay = 100,
}: SketchHighlightProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const paths = {
    underline: "M 2 40 Q 50 48 98 38",
    strike: "M 2 25 Q 50 20 98 28",
    circle: "M 10 25 C 10 5, 90 5, 90 25 C 90 45, 10 45, 10 25 C 10 15, 30 5, 50 5",
  };

  return (
    <span ref={ref} className="relative inline-block whitespace-nowrap">
      <span className="relative z-10">{children}</span>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        viewBox="0 0 100 50"
        preserveAspectRatio="none"
        style={{ overflow: "visible" }}
      >
        <defs>
          <filter id={`pencil-sketch-${type}`} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <path
          d={paths[type]}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          filter={`url(#pencil-sketch-${type})`}
          style={{
            strokeDasharray: 300,
            strokeDashoffset: isVisible ? 0 : 300,
            transition: `stroke-dashoffset 0.9s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
          }}
        />
      </svg>
    </span>
  );
};


/* ─────────────────────────────────────────────────────────────────────────────
 * 2. PAGE DATA & OBSERVER HOOK
 * ───────────────────────────────────────────────────────────────────────────── */
const FEATURED = [
  {
    id: "f1", name: "The Oversized Edit", category: "New Collection", price: 180,
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1400&q=85", quantity: 1,
  },
  {
    id: "f2", name: "Urban Essentials", category: "FW 26", price: 145,
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=900&q=85", quantity: 1,
  },
  {
    id: "f3", name: "Raw Architecture", category: "Limited Edition", price: 220,
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=85", quantity: 1,
  },
  {
    id: "f4", name: "The Structure Jacket", category: "Outerwear", price: 290,
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=900&q=85", quantity: 1,
  },
];

const CATEGORIES = [
  { name: "Oversized", img: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=700&q=80" },
  { name: "Gothic", img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=700&q=80" },
  { name: "Anime", img: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=700&q=80" },
  { name: "Gym Wear", img: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=700&q=80" },
];

const LOOKBOOK = [
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80",
  "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=80",
  "https://images.unsplash.com/photo-1529139574466-a303027614a8?w=600&q=80",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80",
  "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=80",
  "https://images.unsplash.com/photo-1529139574466-a303027614a8?w=600&q=80",
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}


/* ─────────────────────────────────────────────────────────────────────────────
 * 3. MAIN HOME PAGE COMPONENT
 * ───────────────────────────────────────────────────────────────────────────── */
export default function Home() {
  const [splashGone, setSplashGone] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const { openQuickView } = useQuickView();

  const catSection = useInView();
  const editorialSection = useInView();

  useEffect(() => {
    const t1 = setTimeout(() => setSplashGone(true), 2200);
    const t2 = setTimeout(() => setHeroReady(true), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <main style={{ background: "var(--black)", color: "var(--beige)", fontFamily: "var(--font-sans)" }}>

      {/* ── SPLASH ── */}
      <div className={`splash-screen ${splashGone ? "gone" : ""}`}>
        <div className="splash-wordmark">Dripduo</div>
        <div className="splash-line" />
      </div>

      {/* ── HERO ── */}
      <section style={{ position: "relative", height: "100svh", overflow: "hidden" }}>
        <img
          src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=2000&q=88"
          alt="FW26 Collection"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%", objectFit: "cover",
            objectPosition: "center 25%",
            transform: heroReady ? "scale(1)" : "scale(1.06)",
            transition: "transform 1.8s cubic-bezier(0.16,1,0.3,1)",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.0) 40%, rgba(0,0,0,0.85) 100%)" }} />

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "clamp(28px, 5vw, 56px)", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ opacity: heroReady ? 1 : 0, transform: heroReady ? "translateY(0)" : "translateY(24px)", transition: "opacity 1s ease 0.3s, transform 1s cubic-bezier(0.16,1,0.3,1) 0.3s" }}>
            <p className="label" style={{ color: "var(--orange)", marginBottom: "14px", fontSize: "9px", letterSpacing: "0.25em" }}>
              Fall / Winter 2026
            </p>
            <h1 className="display-xl" style={{ color: "var(--beige)", maxWidth: "820px", lineHeight: "1.1" }}>
              New<br />
              <em>
                <SketchHighlight type="underline" delay={800} color="var(--orange)">
                  Collection
                </SketchHighlight>
              </em>
            </h1>
          </div>

          <div style={{ opacity: heroReady ? 1 : 0, transition: "opacity 1s ease 0.6s" }} className="hidden md:block">
            <Link href="/products" className="btn-ghost" style={{ color: "var(--beige)", borderBottom: "1px solid var(--orange)", paddingBottom: "4px" }}>
              <span style={{ fontSize: "10px", letterSpacing: "0.2em" }}>Discover</span>
              <ArrowRight size={14} strokeWidth={1.25} color="var(--orange)" />
            </Link>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 28, right: 24 }} className="md:hidden">
          <Link href="/products" className="btn-ghost" style={{ color: "var(--beige)" }}>
            <span style={{ fontSize: "9px", letterSpacing: "0.18em" }}>Shop</span>
            <ArrowRight size={12} strokeWidth={1.25} color="var(--orange)" />
          </Link>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div style={{ borderTop: "1px solid var(--gray-800)", borderBottom: "1px solid var(--gray-800)", padding: "14px 0", overflow: "hidden", background: "var(--black)" }}>
        <div className="marquee-track">
          {[...Array(8)].map((_, i) => (
            <span key={i} className="label" style={{ paddingInline: "40px", color: "var(--gray-200)", whiteSpace: "nowrap", fontSize: "9px", letterSpacing: "0.22em" }}>
              Complimentary Shipping Over ₹2000 &nbsp;·&nbsp; New Arrivals Every Week &nbsp;·&nbsp; Easy 30-Day Returns &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── EDITORIAL PRODUCT GRID ── */}
      <section style={{ padding: "clamp(60px, 8vw, 100px) clamp(16px, 4vw, 40px)" }}>
        
        {/* ── HEADER ── */}
        <div className="flex flex-row items-center justify-between mb-10 md:mb-16">
          <h2 className="display-md text-[var(--beige)] text-left">
            Featured<br />
            <em>
              <SketchHighlight type="underline" delay={300} color="var(--orange)">
                Archive
              </SketchHighlight>
            </em>
          </h2>

          {/* ── ROTATING CIRCULAR TEXT BADGE (Desktop Only - Top Right) ── */}
          <div 
            className="relative z-20 w-[140px] h-[140px] pointer-events-none flex-shrink-0 hidden md:block" 
            style={{ animation: "spin 15s linear infinite" }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
              <path id="badgePathDesktop" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none" />
              <text fontSize="10.5" fill="var(--orange)" fontWeight="500" letterSpacing="0.05em" className="uppercase font-sans">
                <textPath href="#badgePathDesktop" startOffset="0%" textLength="219">
                  ESTIMATED 2026 • DRIPDUO • 
                </textPath>
              </text>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[var(--orange)]" />
            </div>
          </div>
        </div>

        {/* ── GRID ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridTemplateRows: "auto auto", gap: "10px" }}>

          {/* Big Left Image */}
          <div style={{ gridColumn: "1 / 3", gridRow: "1 / 3", cursor: "pointer" }} onClick={() => openQuickView(FEATURED[0])} className="group relative">
            <div className="product-img-wrap" style={{ aspectRatio: "2/3", position: "relative" }}>
              <img src={FEATURED[0].image} alt={FEATURED[0].name} />

              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)", display: "flex", alignItems: "flex-end", padding: "clamp(16px, 3vw, 32px)" }}>
                <div style={{ color: "var(--beige)" }}>
                  <p className="label" style={{ color: "var(--orange)", marginBottom: "8px", fontSize: "9px", letterSpacing: "0.22em" }}>{FEATURED[0].category}</p>
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.4rem, 3vw, 2.8rem)", fontWeight: 400, lineHeight: 1.05 }}>{FEATURED[0].name}</p>
                </div>
              </div>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
              <span className="label" style={{ fontSize: "10px", letterSpacing: "0.14em", color: "var(--beige)" }}>{FEATURED[0].name}</span>
              <span className="label" style={{ fontSize: "10px", color: "var(--orange)" }}>$ {FEATURED[0].price}</span>
            </div>

            {/* ── ROTATING CIRCULAR TEXT BADGE (Mobile Only - Spaced further down) ── */}
            <div className="md:hidden flex justify-center mt-20 mb-8">
              <div 
                className="relative z-20 w-[95px] h-[95px] pointer-events-none flex-shrink-0" 
                style={{ animation: "spin 15s linear infinite" }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                  <path id="badgePathMobile" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none" />
                  <text fontSize="10.5" fill="var(--orange)" fontWeight="500" letterSpacing="0.05em" className="uppercase font-sans">
                    <textPath href="#badgePathMobile" startOffset="0%" textLength="219">
                      ESTIMATED 2026 • DRIPDUO • 
                    </textPath>
                  </text>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--orange)]" />
                </div>
              </div>
            </div>
            {/* ───────────────────────────────────────────────────────────── */}
            
          </div>

          {/* Top Right */}
          {[FEATURED[1], FEATURED[2]].map((p, i) => (
            <div key={p.id} style={{ gridColumn: `${3 + i} / ${4 + i}`, cursor: "pointer" }} onClick={() => openQuickView(p)}>
              <div className="product-img-wrap" style={{ aspectRatio: "3/4" }}>
                <img src={p.image} alt={p.name} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                <span className="label" style={{ fontSize: "10px", letterSpacing: "0.14em", color: "var(--beige)" }}>{p.name}</span>
                <span className="label" style={{ fontSize: "10px", color: "var(--orange)" }}>$ {p.price}</span>
              </div>
            </div>
          ))}

          {/* Bottom Right wide */}
          <div style={{ gridColumn: "3 / 5", cursor: "pointer" }} onClick={() => openQuickView(FEATURED[3])}>
            <div className="product-img-wrap" style={{ aspectRatio: "16/9" }}>
              <img src={FEATURED[3].image} alt={FEATURED[3].name} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
              <span className="label" style={{ fontSize: "10px", letterSpacing: "0.14em", color: "var(--beige)" }}>{FEATURED[3].name}</span>
              <span className="label" style={{ fontSize: "10px", color: "var(--orange)" }}>$ {FEATURED[3].price}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <div ref={catSection.ref}>
        <section style={{ borderTop: "1px solid var(--gray-800)", padding: "clamp(40px, 6vw, 80px) clamp(16px, 4vw, 40px)" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "clamp(24px, 4vw, 48px)" }}>
            <h2 className="display-md" style={{ opacity: catSection.inView ? 1 : 0, transform: catSection.inView ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.8s ease, transform 0.8s var(--ease-out-expo)", lineHeight: "1.1" }}>
              Shop by<br />
              <em>
                <SketchHighlight type="circle" delay={300} color="var(--orange)">
                  Category
                </SketchHighlight>
              </em>
            </h2>
            <Link href="/products" className="btn-ghost link-reveal hidden md:flex text-[var(--orange)]" style={{ fontSize: "10px" }}>
              View All
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }} className="md:grid-cols-4">
            {CATEGORIES.map((cat, i) => (
              <Link href="/products" key={cat.name} className="group block" style={{ opacity: catSection.inView ? 1 : 0, transform: catSection.inView ? "translateY(0)" : "translateY(30px)", transition: `opacity 0.7s ease ${i * 80}ms, transform 0.7s var(--ease-out-expo) ${i * 80}ms` }}>
                <div className="product-img-wrap border border-[var(--gray-800)] group-hover:border-[var(--orange)] transition-colors" style={{ aspectRatio: "3/4" }}>
                  <img src={cat.img} alt={cat.name} />
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0)", transition: "background 0.5s ease" }} className="group-hover:bg-black/30" />
                </div>
                <p className="label group-hover:text-[var(--orange)]" style={{ marginTop: "12px", fontSize: "10px", letterSpacing: "0.16em", transition: "color 0.25s", color: "var(--beige)" }}>
                  {cat.name}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* ── EDITORIAL BANNER ── */}
      <div ref={editorialSection.ref}>
        <section style={{ position: "relative", overflow: "hidden", height: "clamp(380px, 65vh, 700px)" }}>
          <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=2000&q=88" alt="Editorial" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: editorialSection.inView ? "scale(1)" : "scale(1.06)", transition: "transform 1.4s var(--ease-out-expo)" }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "clamp(24px, 5vw, 60px)" }}>
            <p className="label" style={{ color: "var(--orange)", marginBottom: "20px", fontSize: "9px", letterSpacing: "0.3em", opacity: editorialSection.inView ? 1 : 0, transition: "opacity 0.8s ease 0.2s" }}>
              Editorial — F W 2 6
            </p>
            <h2 className="display-xl" style={{ color: "var(--beige)", maxWidth: "860px", lineHeight: "1.1", opacity: editorialSection.inView ? 1 : 0, transform: editorialSection.inView ? "translateY(0)" : "translateY(28px)", transition: "opacity 0.9s ease 0.35s, transform 0.9s var(--ease-out-expo) 0.35s" }}>
              Redefine<br />
              <em>
                <SketchHighlight type="strike" delay={600} color="var(--orange)">
                  the Silhouette
                </SketchHighlight>
              </em>
            </h2>
            <div style={{ opacity: editorialSection.inView ? 1 : 0, transition: "opacity 0.8s ease 0.65s", marginTop: "clamp(24px, 4vw, 44px)" }}>
              <Link href="/products" className="btn-secondary" style={{ color: "var(--beige)", borderColor: "var(--beige)", fontSize: "10px" }}>
                Shop the Look
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* ── LOOKBOOK SCROLL ── */}
      <section style={{ padding: "clamp(40px, 6vw, 80px) 0", borderTop: "1px solid var(--gray-800)" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "0 clamp(16px, 4vw, 40px)", marginBottom: "clamp(20px, 3vw, 36px)" }}>
          <h2 className="display-md text-[var(--beige)]"><em>The Lookbook</em></h2>
          <Link href="/products" className="btn-ghost link-reveal hidden md:flex text-[var(--orange)]" style={{ fontSize: "10px" }}>
            Full Collection
          </Link>
        </div>
        <div style={{ overflow: "hidden" }}>
          <div className="scroll-row">
            {[...LOOKBOOK, ...LOOKBOOK].map((img, i) => (
              <div key={i} className="product-img-wrap flex-shrink-0 border border-[var(--gray-800)]" style={{ width: "clamp(180px, 22vw, 280px)", aspectRatio: "3/4", flexShrink: 0 }}>
                <img src={img} alt={`Look ${(i % LOOKBOOK.length) + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}