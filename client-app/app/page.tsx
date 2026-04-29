"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useQuickView } from "@/lib/QuickViewContext";
import Loading from "./loading";

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
        className="absolute inset-0 z-0 w-full h-full overflow-visible pointer-events-none"
        viewBox="0 0 100 50"
        preserveAspectRatio="none"
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
          className={`[stroke-dasharray:300] transition-[stroke-dashoffset] duration-900 ease-[cubic-bezier(0.4,0,0.2,1)] ${isVisible ? "[stroke-dashoffset:0]" : "[stroke-dashoffset:300]"
            }`}
          style={{ transitionDelay: `${delay}ms` }}
        />
      </svg>
    </span>
  );
};


/* ─────────────────────────────────────────────────────────────────────────────
 * 2. PAGE DATA & OBSERVER HOOK
 * ───────────────────────────────────────────────────────────────────────────── */


function useInView(threshold = 0.15) {
  // Use state instead of useRef so it re-evaluates when the node mounts
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!node) return; // Wait until the element is actually in the DOM

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );

    obs.observe(node);
    return () => obs.disconnect();
  }, [node, threshold]); // Re-run when the node attaches

  // setNode acts as our callback ref
  return { ref: setNode, inView };
}


export default function Home() {
  const [splashGone, setSplashGone] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const { openQuickView } = useQuickView();

  const catSection = useInView();
  const editorialSection = useInView();

  useEffect(() => {
    const t1 = setTimeout(() => setSplashGone(true), 3500);
    const t2 = setTimeout(() => setHeroReady(true), 3700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (!splashGone) return <Loading />;

  return (
    <main className="bg-[var(--black)] text-[var(--beige)] font-[var(--font-sans)]">

      {/* ── SPLASH ── */}
      <div className={`splash-screen ${splashGone ? "gone" : ""}`}>
        <div className="splash-wordmark">Dripduo</div>
        <div className="splash-line" />
      </div>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden h-[100svh]">
        <img
          src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=2000&q=88"
          alt="FW26 Collection"
          className={`absolute inset-0 w-full h-full object-cover object-[center_25%] transition-transform duration-[1800ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${heroReady ? "scale-100" : "scale-[1.06]"
            }`}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0.0)_40%,rgba(0,0,0,0.85)_100%)]" />

        <div className="absolute bottom-0 left-0 right-0 p-[clamp(28px,5vw,56px)] flex items-end justify-between">
          <div className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] delay-300 ${heroReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}>
            <p className="label text-[var(--orange)] mb-[14px] text-[9px] tracking-[0.25em]">
              Fall / Winter 2026
            </p>
            <h1 className="display-xl text-[var(--beige)] max-w-[820px] leading-[1.1]">
              New<br />
              <em>
                <SketchHighlight type="underline" delay={800} color="var(--orange)">
                  Collection
                </SketchHighlight>
              </em>
            </h1>
          </div>

          <div className={`hidden md:block transition-opacity duration-1000 ease-in-out delay-[600ms] ${heroReady ? "opacity-100" : "opacity-0"
            }`}>
            <Link href="/products" className="btn-ghost text-[var(--beige)] border-b border-[var(--orange)] pb-1">
              <span className="text-[10px] tracking-[0.2em]">Discover</span>
              <ArrowRight size={14} strokeWidth={1.25} color="var(--orange)" />
            </Link>
          </div>
        </div>

        <div className="absolute bottom-7 right-6 md:hidden">
          <Link href="/products" className="btn-ghost text-[var(--beige)]">
            <span className="text-[9px] tracking-[0.18em]">Shop</span>
            <ArrowRight size={12} strokeWidth={1.25} color="var(--orange)" />
          </Link>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="border-y border-[var(--gray-800)] py-[14px] overflow-hidden bg-[var(--black)]">
        <div className="marquee-track">
          {[...Array(8)].map((_, i) => (
            <span key={i} className="label px-[40px] text-[var(--gray-200)] whitespace-nowrap text-[9px] tracking-[0.22em]">
              Complimentary Shipping Over ₹2000 &nbsp;·&nbsp; New Arrivals Every Week &nbsp;·&nbsp; Easy 30-Day Returns &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── EDITORIAL PRODUCT GRID ── */}
      <section className="py-[clamp(60px,8vw,100px)] px-[clamp(16px,4vw,40px)]">

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
          <div className="relative z-20 w-[140px] h-[140px] pointer-events-none flex-shrink-0 hidden md:block animate-[spin_15s_linear_infinite]">
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
              <path id="badgePathDesktop" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none" />
              <text fontSize="10.5" fill="var(--orange)" fontWeight="500" letterSpacing="0.05em" className="font-sans uppercase">
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
        <div className="grid grid-cols-4 auto-rows-auto gap-2.5">

          {/* Big Left Image */}
          <div onClick={() => openQuickView(FEATURED[0])} className="relative col-span-2 row-span-2 cursor-pointer group">
            <div className="relative product-img-wrap aspect-[2/3]">
              <img src={FEATURED[0].image} alt={FEATURED[0].name} />

              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 to-transparent to-50% p-[clamp(16px,3vw,32px)]">
                <div className="text-[var(--beige)]">
                  <p className="label text-[var(--orange)] mb-2 text-[9px] tracking-[0.22em]">{FEATURED[0].category}</p>
                  <p className="font-[var(--font-serif)] text-[clamp(1.4rem,3vw,2.8rem)] font-normal leading-[1.05]">{FEATURED[0].name}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-[10px]">
              <span className="label text-[10px] tracking-[0.14em] text-[var(--beige)]">{FEATURED[0].name}</span>
              <span className="label text-[10px] text-[var(--orange)]">$ {FEATURED[0].price}</span>
            </div>

            {/* ── ROTATING CIRCULAR TEXT BADGE (Mobile Only - Spaced further down) ── */}
            <div className="flex justify-center mt-20 mb-8 md:hidden">
              <div className="relative z-20 w-[95px] h-[95px] pointer-events-none flex-shrink-0 animate-[spin_15s_linear_infinite]">
                <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                  <path id="badgePathMobile" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none" />
                  <text fontSize="10.5" fill="var(--orange)" fontWeight="500" letterSpacing="0.05em" className="font-sans uppercase">
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
            <div key={p.id} onClick={() => openQuickView(p)} className={`cursor-pointer ${i === 0 ? "col-start-3" : "col-start-4"}`}>
              <div className="product-img-wrap aspect-[3/4]">
                <img src={p.image} alt={p.name} />
              </div>
              <div className="flex justify-between mt-[10px]">
                <span className="label text-[10px] tracking-[0.14em] text-[var(--beige)]">{p.name}</span>
                <span className="label text-[10px] text-[var(--orange)]">$ {p.price}</span>
              </div>
            </div>
          ))}

          {/* Bottom Right wide */}
          <div onClick={() => openQuickView(FEATURED[3])} className="cursor-pointer col-span-2 col-start-3">
            <div className="product-img-wrap aspect-video">
              <img src={FEATURED[3].image} alt={FEATURED[3].name} />
            </div>
            <div className="flex justify-between mt-[10px]">
              <span className="label text-[10px] tracking-[0.14em] text-[var(--beige)]">{FEATURED[3].name}</span>
              <span className="label text-[10px] text-[var(--orange)]">$ {FEATURED[3].price}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <div ref={catSection.ref}>
        <section className="border-t border-[var(--gray-800)] py-[clamp(40px,6vw,80px)] px-[clamp(16px,4vw,40px)]">
          <div className="flex items-end justify-between mb-[clamp(24px,4vw,48px)]">
            <h2 className={`display-md leading-[1.1] transition-all duration-800 ease-[var(--ease-out-expo)] ${catSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}>
              Shop by<br />
              <em>
                <SketchHighlight type="circle" delay={300} color="var(--orange)">
                  Category
                </SketchHighlight>
              </em>
            </h2>
            <Link href="/products" className="btn-ghost link-reveal hidden md:flex text-[var(--orange)] text-[10px]">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {CATEGORIES.map((cat, i) => (
              <Link
                href="/products"
                key={cat.name}
                className={`group block transition-all duration-700 ease-[var(--ease-out-expo)] ${catSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[30px]"
                  }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="product-img-wrap border border-[var(--gray-800)] group-hover:border-[var(--orange)] transition-colors aspect-[3/4]">
                  <img src={cat.img} alt={cat.name} />
                  <div className="absolute inset-0 bg-transparent transition-colors duration-500 ease-in group-hover:bg-black/30" />
                </div>
                <p className="label group-hover:text-[var(--orange)] mt-3 text-[10px] tracking-[0.16em] transition-colors duration-[250ms] text-[var(--beige)]">
                  {cat.name}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* ── EDITORIAL BANNER ── */}
      <div ref={editorialSection.ref}>
        <section className="relative overflow-hidden h-[clamp(380px,65vh,700px)]">
          <img
            src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=2000&q=88"
            alt="Editorial"
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-out-expo)] ${editorialSection.inView ? "scale-100" : "scale-[1.06]"
              }`}
          />
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-[clamp(24px,5vw,60px)]">
            <p className={`label text-[var(--orange)] mb-5 text-[9px] tracking-[0.3em] transition-opacity duration-800 delay-200 ${editorialSection.inView ? "opacity-100" : "opacity-0"
              }`}>
              Editorial — F W 2 6
            </p>
            <h2 className={`display-xl text-[var(--beige)] max-w-[860px] leading-[1.1] transition-all duration-900 ease-[var(--ease-out-expo)] delay-[350ms] ${editorialSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7"
              }`}>
              Redefine<br />
              <em>
                <SketchHighlight type="strike" delay={600} color="var(--orange)">
                  the Silhouette
                </SketchHighlight>
              </em>
            </h2>
            <div className={`mt-[clamp(24px,4vw,44px)] transition-opacity duration-800 delay-[650ms] ${editorialSection.inView ? "opacity-100" : "opacity-0"
              }`}>
              <Link href="/products" className="btn-secondary text-[var(--beige)] border-[var(--beige)] text-[10px]">
                Shop the Look
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* ── LOOKBOOK SCROLL ── */}
      <section className="py-[clamp(40px,6vw,80px)] border-t border-[var(--gray-800)]">
        <div className="flex items-end justify-between px-[clamp(16px,4vw,40px)] mb-[clamp(20px,3vw,36px)]">
          <h2 className="display-md text-[var(--beige)]"><em>The Lookbook</em></h2>
          <Link href="/products" className="btn-ghost link-reveal hidden md:flex text-[var(--orange)] text-[10px]">
            Full Collection
          </Link>
        </div>
        <div className="overflow-hidden">
          <div className="scroll-row">
            {[...LOOKBOOK, ...LOOKBOOK].map((img, i) => (
              <div key={i} className="product-img-wrap border border-[var(--gray-800)] w-[clamp(180px,22vw,280px)] aspect-[3/4] shrink-0">
                <img src={img} alt={`Look ${(i % LOOKBOOK.length) + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}