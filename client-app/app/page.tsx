"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useQuickView } from "@/lib/QuickViewContext";
import Loading from "./loading";
import { FEATURED, HOME_CATEGORIES, LOOKBOOK } from "@/constants";
import RotatingBadge from "@/components/RotatingBadge";
import { SketchHighlight } from "@/components/SktechHighlight";
import HomeProductCard from "@/components/HomeProductCard";



// THE ORIGINAL REVEAL COMPONENT
function Reveal({
  children,
  className = "",
  threshold = 0.18,
}: {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
}) {
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!node) return;
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
  }, [node, threshold]);

  return (
    <div
      ref={setNode}
      className={[
        "will-change-transform transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
        inView ? "translate-y-0 opacity-100 scale-100 blur-0" : "translate-y-12 opacity-0 scale-[0.98] blur-4px",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}





export default function Home() {
  const [splashGone, setSplashGone] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const { openQuickView } = useQuickView();

  useEffect(() => {
    const t1 = setTimeout(() => setSplashGone(true), 3500);
    const t2 = setTimeout(() => setHeroReady(true), 3700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (!splashGone) return <Loading />;

  return (
    <main className="w-full overflow-x-clip bg-(--black) text-(--beige)">

      {/* MASSIVE LEFT-ALIGNED HERO */}
      <section className="relative h-screen w-full overflow-hidden">
        <img
          src="/images/drip.png"
          alt="FW26 Collection"
          className={`absolute inset-0 h-full w-full object-cover object-[center_25%] transition-transform duration-2000 ease-[cubic-bezier(0.16,1,0.3,1)] ${heroReady ? "scale-100" : "scale-[1.08]"
            }`}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 flex flex-col items-start justify-end p-6 md:p-12 z-10 pb-16 md:pb-16">
          <Reveal>
            <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-(--orange) mb-4">
              Fall / Winter 2026
            </p>
            <h1 className="font-serif text-[clamp(4.5rem,15vw,12rem)] leading-[0.8] tracking-tighter text-(--beige) mb-12 drop-shadow-lg">
              New<br />
              <em>
                <SketchHighlight type="underline" delay={800} color="var(--orange)">
                  Collection
                </SketchHighlight>
              </em>
            </h1>
          </Reveal>

          <Reveal className="delay-600">
            <Link
              href="/products"
              className="inline-flex items-center gap-4 border border-(--beige) bg-transparent text-(--beige) font-sans text-[10px] font-bold uppercase tracking-[0.2em] px-12 py-5 hover:bg-(--beige) hover:text-(--black) transition-all duration-500"
            >
              Discover
              <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* RAW MARQUEE */}
      <div className="overflow-hidden bg-(--black) py-4 border-b border-(--gray-800)">
        <div className="marquee-track">
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="font-sans whitespace-nowrap px-10 text-[10px] tracking-[0.25em] uppercase text-(--gray-400)"
            >
              Complimentary Shipping Over ₹2000 &nbsp;·&nbsp; New Arrivals Every Week &nbsp;·&nbsp; Easy 30-Day Returns &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* GAPLESS MASONRY FEATURED ARCHIVE */}
      <section className="relative w-full overflow-hidden pt-[clamp(60px,10vw,120px)]">
        <div className="px-6 md:px-12 mb-12 md:mb-16 flex items-start justify-between gap-6 md:items-end">
          <Reveal>
            <h2 className="font-serif text-[clamp(2.5rem,6vw,4rem)] leading-[1.02] text-(--beige)">
              Featured<br />
              <em>
                <SketchHighlight type="underline" delay={300} color="var(--orange)">
                  Archive
                </SketchHighlight>
              </em>
            </h2>
          </Reveal>
          <div className="hidden md:block">
            <RotatingBadge />
          </div>
        </div>

        {/* 0-Gap Abstract Grid, Edge to Edge */}
        <div className="grid grid-cols-4 gap-0 w-full border-t border-l border-(--gray-800)">
          <Reveal className="col-span-2 row-span-2 h-full w-full">
            <HomeProductCard
              product={FEATURED[0]}
            />
          </Reveal>

          <Reveal className="col-span-1 w-full delay-80">
            <HomeProductCard
              product={FEATURED[1]}
            />
          </Reveal>

          <Reveal className="col-span-1 w-full delay-140">
            <HomeProductCard
              product={FEATURED[2]}
            />
          </Reveal>

          <Reveal className="col-span-2 col-start-3 row-start-2 w-full delay-200">
            <HomeProductCard
              product={FEATURED[3]}
            />
          </Reveal>
        </div>

        <Reveal className="mt-8 flex justify-center md:hidden delay-220">
          <RotatingBadge mobile />
        </Reveal>
      </section>

      {/* GAPLESS SHOP BY CATEGORY */}
      <section className="w-full pt-[clamp(60px,10vw,120px)] border-t border-(--gray-800) mt-[clamp(60px,10vw,120px)]">
        <div className="px-6 md:px-12 mb-[clamp(32px,5vw,64px)] flex items-end justify-between">
          <Reveal>
            <h2 className="font-serif text-[clamp(2.5rem,5vw,4rem)] leading-[1.1] text-(--beige)">
              Shop by<br />
              <em>
                <SketchHighlight type="circle" delay={300} color="var(--orange)">
                  Category
                </SketchHighlight>
              </em>
            </h2>
          </Reveal>

          <Link href="/products" className="hidden font-sans text-[10px] tracking-[0.2em] uppercase text-(--orange) md:flex hover:underline underline-offset-4">
            View All
          </Link>
        </div>

        {/* 0-Gap Category Grid, Edge to Edge */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 w-full border-t border-l border-(--gray-800)">
          {HOME_CATEGORIES.map((cat, i) => (
            <Reveal key={cat.name} className="w-full h-full" threshold={0.14}>
              <Link href="/products" className="group block relative w-full h-full border-r border-b border-(--gray-800) overflow-hidden bg-(--black)">
                <div className="relative aspect-[2/3] w-full h-full">
                  <img src={cat.img} alt={cat.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 transition-colors duration-500 group-hover:bg-black/10" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-(--beige) transition-colors duration-200 group-hover:text-(--orange) drop-shadow-lg">
                      {cat.name}
                    </p>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* EDITORIAL BANNER */}
      <section className="relative h-[85svh] w-full overflow-hidden border-t border-b border-(--gray-800)">
        <img
          src="/images/mockup.png"
          alt="Editorial"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-start justify-end bg-black/50 p-6 md:p-12 z-10 pb-16">
          <Reveal>
            <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-(--orange) mb-4">
              Editorial — FW26
            </p>
          </Reveal>
          <Reveal className="delay-[120ms]">
            <h2 className="font-serif text-[clamp(4rem,10vw,9rem)] leading-[0.8] tracking-tighter text-(--beige) mb-12">
              Redefine<br />
              <em>
                <SketchHighlight type="strike" delay={600} color="var(--orange)">
                  the Silhouette
                </SketchHighlight>
              </em>
            </h2>
          </Reveal>
          <Reveal className="delay-[220ms]">
            <Link
              href="/products"
              className="inline-flex items-center justify-center bg-transparent border border-(--beige) px-12 py-5 font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-(--beige) transition-all duration-500 hover:bg-(--beige) hover:text-(--black)"
            >
              SHOP THE LOOK
            </Link>
          </Reveal>
        </div>
      </section>

      {/* HORIZONTAL LOOKBOOK */}
      <section className="w-full py-24 md:py-40">
        <div className="flex items-end justify-between px-6 mb-16 md:px-12">
          <Reveal>
            <h2 className="font-serif text-[clamp(3rem,5vw,4.5rem)] tracking-tight text-(--beige)">
              <em>The Lookbook</em>
            </h2>
          </Reveal>
          <Link href="/products" className="hidden font-sans text-[10px] tracking-[0.2em] uppercase text-(--orange) md:block hover:underline underline-offset-4">
            Full Collection
          </Link>
        </div>

        <div className="overflow-hidden w-full">
          <div className="scroll-row w-max pl-6 md:pl-12 flex" style={{ gap: "0" }}>
            {[...LOOKBOOK, ...LOOKBOOK].map((img, i) => (
              <Reveal key={i} className="shrink-0" threshold={0.12}>
                <div className="relative aspect-2/3 w-[75vw] sm:w-[45vw] md:w-[30vw] lg:w-[22vw] border-r border-y border-(--gray-800) overflow-hidden bg-(--gray-900) first:border-l">
                  <img src={img} alt={`Look ${(i % LOOKBOOK.length) + 1}`} className="h-full w-full object-cover transition-transform duration-[2s] hover:scale-105" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}