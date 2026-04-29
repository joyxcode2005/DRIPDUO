// app/page.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useQuickView } from "@/lib/QuickViewContext";
import Loading from "./loading";
import { FEATURED, HOME_CATEGORIES, LOOKBOOK } from "@/constants";

interface SketchHighlightProps {
  children: React.ReactNode;
  type?: "circle" | "underline" | "strike";
  color?: string;
  strokeWidth?: number;
  delay?: number;
}

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
        "will-change-transform transition-all duration-700 ease-[var(--ease-out-expo)]",
        inView ? "translate-y-0 opacity-100 scale-100 blur-0" : "translate-y-6 opacity-0 scale-[0.985] blur-[2px]",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
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
        className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible"
        viewBox="0 0 100 50"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id={`pencil-sketch-${type}`} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="2.5"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
        <path
          d={paths[type]}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          filter={`url(#pencil-sketch-${type})`}
          className={`[stroke-dasharray:300] transition-[stroke-dashoffset] duration-700 ease-in-out ${
            isVisible ? "[stroke-dashoffset:0]" : "[stroke-dashoffset:300]"
          }`}
          style={{ transitionDelay: `${delay}ms` }}
        />
      </svg>
    </span>
  );
};

function ProductCard({
  item,
  onClick,
  className = "",
  imageClassName = "",
}: {
  item: { id: string; image: string; name: string; category?: string; price: number };
  onClick: () => void;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <button onClick={onClick} className={`group block min-w-0 text-left ${className}`}>
      <div
        className={`product-img-wrap relative overflow-hidden bg-[var(--gray-900)] transition-transform duration-500 group-active:scale-[0.99] ${imageClassName}`}
      >
        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/15 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5 md:p-6">
          {item.category ? (
            <p className="label mb-1.5 text-[8px] tracking-[0.24em] text-[var(--orange)] sm:mb-2 sm:text-[10px] sm:tracking-[0.22em]">
              {item.category}
            </p>
          ) : null}

          <p className="font-serif max-w-[88%] text-[clamp(1rem,4.2vw,1.45rem)] leading-[0.96] tracking-[-0.02em] text-[var(--beige)] sm:max-w-[92%] sm:text-[clamp(1.35rem,3vw,2.8rem)] sm:leading-[1.02]">
            {item.name}
          </p>
        </div>
      </div>

      <div className="mt-2.5 flex flex-col items-start gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <span className="min-w-0 pr-0 text-[9px] leading-[1.25] tracking-[0.14em] text-[var(--beige)] sm:pr-3 sm:text-[10px]">
          {item.name}
        </span>
        <span className="shrink-0 whitespace-nowrap text-[9px] tracking-[0.14em] text-[var(--orange)] sm:text-[10px]">
          $ {item.price}
        </span>
      </div>
    </button>
  );
}

function RotatingBadge({ mobile = false }: { mobile?: boolean }) {
  const sizeClass = mobile ? "h-[92px] w-[92px]" : "h-[140px] w-[140px]";
  const textLength = mobile ? "204" : "219";
  const textSize = mobile ? 9 : 10.5;
  const pathId = mobile ? "badgePathMobile" : "badgePathDesktop";

  return (
    <div className={`relative flex-shrink-0 pointer-events-none animate-[spin_15s_linear_infinite] ${sizeClass}`}>
      <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
        <path
          id={pathId}
          d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
          fill="none"
        />
        <text
          fontSize={textSize}
          fill="var(--orange)"
          fontWeight="500"
          letterSpacing="0.05em"
          className="font-sans uppercase"
        >
          <textPath href={`#${pathId}`} startOffset="0%" textLength={textLength}>
            ESTIMATED 2026 • DRIPDUO •
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`rounded-full bg-[var(--orange)] ${mobile ? "h-1.5 w-1.5" : "h-2 w-2"}`} />
      </div>
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
    <main className="w-full overflow-x-clip bg-[var(--black)] text-[var(--beige)]">
      <section className="relative min-h-[100svh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=2000&q=88"
          alt="FW26 Collection"
          className={`absolute inset-0 h-full w-full object-cover object-[center_25%] transition-transform duration-[1800ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            heroReady ? "scale-100" : "scale-[1.06]"
          }`}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.02)_42%,rgba(0,0,0,0.86)_100%)]" />

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 sm:p-8 md:p-[clamp(28px,5vw,56px)]">
          <Reveal className="max-w-[17rem] sm:max-w-none md:max-w-[38rem]">
            <p className="label mb-3 text-[8px] tracking-[0.28em] text-[var(--orange)] sm:text-[9px] sm:tracking-[0.25em]">
              Fall / Winter 2026
            </p>
            <h1 className="font-serif text-[clamp(3.1rem,12vw,9rem)] leading-[0.9] tracking-[-0.02em] text-[var(--beige)]">
              New<br />
              <em>
                <SketchHighlight type="underline" delay={800} color="var(--orange)">
                  Collection
                </SketchHighlight>
              </em>
            </h1>
          </Reveal>

          <div
            className={`hidden transition-opacity duration-1000 ease-in-out delay-[600ms] md:block ${
              heroReady ? "opacity-100" : "opacity-0"
            }`}
          >
            <Link
              href="/products"
              className="inline-flex items-center gap-2 border-b border-[var(--orange)] pb-1 text-[var(--beige)] transition-colors hover:text-[var(--orange)]"
            >
              <span className="text-[10px] tracking-[0.2em]">Discover</span>
              <ArrowRight size={14} strokeWidth={1.25} color="var(--orange)" />
            </Link>
          </div>
        </div>

        <div className="absolute bottom-5 right-5 md:hidden">
          <Link href="/products" className="inline-flex items-center gap-2 text-[var(--beige)]">
            <span className="text-[9px] tracking-[0.18em]">Shop</span>
            <ArrowRight size={12} strokeWidth={1.25} color="var(--orange)" />
          </Link>
        </div>
      </section>

      <div className="overflow-hidden border-y border-[var(--gray-800)] bg-[var(--black)] py-[12px] sm:py-[14px]">
        <div className="marquee-track">
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="label whitespace-nowrap px-10 text-[9px] tracking-[0.22em] text-[var(--gray-200)]"
            >
              Complimentary Shipping Over ₹2000 &nbsp;·&nbsp; New Arrivals Every Week &nbsp;·&nbsp; Easy 30-Day Returns &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      <section className="relative w-full overflow-hidden px-4 py-[clamp(48px,8vw,100px)] sm:px-6 md:px-10">
        <div className="mb-8 flex items-start justify-between gap-6 md:mb-16 md:items-end">
          <Reveal>
            <h2 className="font-serif text-[clamp(2.1rem,6vw,3.2rem)] leading-[1.02] text-[var(--beige)] sm:text-[clamp(2.4rem,5vw,3.6rem)]">
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

        <div className="grid grid-cols-4 gap-1.5 sm:gap-2.5">
          <Reveal className="col-span-2 row-span-2">
            <ProductCard
              item={FEATURED[0]}
              onClick={() => openQuickView(FEATURED[0])}
              className="h-full"
              imageClassName="aspect-[3/4]"
            />
          </Reveal>

          <Reveal className="col-span-1 delay-[80ms]">
            <ProductCard
              item={FEATURED[1]}
              onClick={() => openQuickView(FEATURED[1])}
              imageClassName="aspect-[3/4]"
            />
          </Reveal>

          <Reveal className="col-span-1 delay-[140ms]">
            <ProductCard
              item={FEATURED[2]}
              onClick={() => openQuickView(FEATURED[2])}
              imageClassName="aspect-[3/4]"
            />
          </Reveal>

          <Reveal className="col-span-2 col-start-3 row-start-2 delay-[200ms]">
            <ProductCard
              item={FEATURED[3]}
              onClick={() => openQuickView(FEATURED[3])}
              imageClassName="aspect-[4/3]"
            />
          </Reveal>
        </div>

        <Reveal className="mt-6 flex justify-start md:hidden delay-[220ms]">
          <RotatingBadge mobile />
        </Reveal>
      </section>

      <section className="border-t border-[var(--gray-800)] px-4 py-[clamp(40px,6vw,80px)] sm:px-6 md:px-10">
        <div className="mb-[clamp(24px,4vw,48px)] flex items-end justify-between">
          <Reveal>
            <h2 className="text-[clamp(2rem,5vw,3.2rem)] leading-[1.1]">
              Shop by<br />
              <em>
                <SketchHighlight type="circle" delay={300} color="var(--orange)">
                  Category
                </SketchHighlight>
              </em>
            </h2>
          </Reveal>

          <Link href="/products" className="hidden text-[10px] text-[var(--orange)] md:flex">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {HOME_CATEGORIES.map((cat, i) => (
            <Reveal key={cat.name} className="" threshold={0.14}>
              <Link href="/products" className="group block">
                <div className="product-img-wrap relative aspect-[3/4] overflow-hidden border border-[var(--gray-800)] transition-colors group-hover:border-[var(--orange)]">
                  <img src={cat.img} alt={cat.name} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-transparent transition-colors duration-500 group-hover:bg-black/30" />
                </div>
                <p className="label mt-3 text-[10px] tracking-[0.16em] text-[var(--beige)] transition-colors duration-200 group-hover:text-[var(--orange)]">
                  {cat.name}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative min-h-[80svh] overflow-hidden md:min-h-0 md:h-[clamp(380px,65vh,700px)]">
        <img
          src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=2000&q=88"
          alt="Editorial"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-out-expo)] scale-100"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 p-6 text-center sm:p-10 md:p-[clamp(24px,5vw,60px)]">
          <Reveal>
            <p className="label mb-4 text-[9px] tracking-[0.3em] text-[var(--orange)]">
              Editorial — FW26
            </p>
          </Reveal>
          <Reveal className="delay-[120ms]">
            <h2 className="font-serif text-[clamp(2.4rem,10vw,8.5rem)] leading-[1.05] text-[var(--beige)]">
              Redefine<br />
              <em>
                <SketchHighlight type="strike" delay={600} color="var(--orange)">
                  the Silhouette
                </SketchHighlight>
              </em>
            </h2>
          </Reveal>
          <Reveal className="mt-8 delay-[220ms] md:mt-10">
            <Link
              href="/products"
              className="inline-flex items-center justify-center border border-[var(--beige)] px-6 py-3 text-[10px] tracking-[0.2em] text-[var(--beige)] transition-colors hover:border-[var(--orange)] hover:text-[var(--orange)]"
            >
              SHOP THE LOOK
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-[var(--gray-800)] py-[clamp(40px,6vw,80px)]">
        <div className="mb-[clamp(20px,3vw,36px)] flex items-end justify-between px-4 sm:px-6 md:px-10">
          <Reveal>
            <h2 className="font-serif text-[clamp(2rem,5vw,3.2rem)] text-[var(--beige)]">
              <em>The Lookbook</em>
            </h2>
          </Reveal>
          <Link href="/products" className="hidden text-[10px] text-[var(--orange)] md:flex">
            Full Collection
          </Link>
        </div>
        <div className="overflow-hidden">
          <div className="scroll-row w-max pl-4 sm:pl-6 md:pl-10">
            {[...LOOKBOOK, ...LOOKBOOK].map((img, i) => (
              <Reveal key={i} className="shrink-0" threshold={0.12}>
                <div className="product-img-wrap aspect-[3/4] w-[72vw] overflow-hidden border border-[var(--gray-800)] sm:w-[42vw] md:w-[clamp(180px,22vw,280px)]">
                  <img src={img} alt={`Look ${(i % LOOKBOOK.length) + 1}`} className="h-full w-full object-cover" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}