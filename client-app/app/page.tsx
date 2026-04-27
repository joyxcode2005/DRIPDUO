"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useQuickView } from "@/lib/QuickViewContext";

/* ── Data ── */
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
];

/* ── Intersection observer hook ── */
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

export default function Home() {
  const [splashGone, setSplashGone] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const { openQuickView } = useQuickView();

  const catSection = useInView();
  const editorialSection = useInView();
  const newsSection = useInView();

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
        {/* Gradient */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.0) 40%, rgba(0,0,0,0.85) 100%)",
        }} />

        {/* Text */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "clamp(28px, 5vw, 56px)",
          display: "flex", alignItems: "flex-end", justifyContent: "space-between",
        }}>
          <div style={{
            opacity: heroReady ? 1 : 0,
            transform: heroReady ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 1s ease 0.3s, transform 1s cubic-bezier(0.16,1,0.3,1) 0.3s",
          }}>
            <p className="label" style={{ color: "var(--orange)", marginBottom: "14px", fontSize: "9px", letterSpacing: "0.25em" }}>
              Fall / Winter 2026
            </p>
            <h1 className="display-xl" style={{ color: "var(--beige)", maxWidth: "820px" }}>
              New<br /><em>Collection</em>
            </h1>
          </div>

          <div style={{
            opacity: heroReady ? 1 : 0,
            transition: "opacity 1s ease 0.6s",
          }} className="hidden md:block">
            <Link href="/products" className="btn-ghost" style={{ color: "var(--beige)", borderBottom: "1px solid var(--orange)", paddingBottom: "4px" }}>
              <span style={{ fontSize: "10px", letterSpacing: "0.2em" }}>Discover</span>
              <ArrowRight size={14} strokeWidth={1.25} color="var(--orange)" />
            </Link>
          </div>
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
      <section style={{ padding: "clamp(40px, 6vw, 80px) clamp(16px, 4vw, 40px)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridTemplateRows: "auto auto", gap: "10px" }}>
          <div
            style={{ gridColumn: "1 / 3", gridRow: "1 / 3", cursor: "pointer" }}
            onClick={() => openQuickView(FEATURED[0])}
            className="group"
          >
            <div className="product-img-wrap" style={{ aspectRatio: "2/3", position: "relative" }}>
              <img src={FEATURED[0].image} alt={FEATURED[0].name} />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)",
                display: "flex", alignItems: "flex-end", padding: "clamp(16px, 3vw, 32px)",
              }}>
                <div style={{ color: "var(--beige)" }}>
                  <p className="label" style={{ color: "var(--orange)", marginBottom: "8px", fontSize: "9px", letterSpacing: "0.22em" }}>{FEATURED[0].category}</p>
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.4rem, 3vw, 2.8rem)", fontWeight: 400, lineHeight: 1.05 }}>
                    {FEATURED[0].name}
                  </p>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
              <span className="label" style={{ fontSize: "10px", letterSpacing: "0.14em" }}>{FEATURED[0].name}</span>
              <span className="label" style={{ fontSize: "10px", color: "var(--orange)" }}>$ {FEATURED[0].price}</span>
            </div>
          </div>

          {[FEATURED[1], FEATURED[2]].map((p, i) => (
            <div key={p.id} style={{ gridColumn: `${3 + i} / ${4 + i}`, cursor: "pointer" }} onClick={() => openQuickView(p)}>
              <div className="product-img-wrap" style={{ aspectRatio: "3/4" }}>
                <img src={p.image} alt={p.name} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                <span className="label" style={{ fontSize: "10px", letterSpacing: "0.14em" }}>{p.name}</span>
                <span className="label" style={{ fontSize: "10px", color: "var(--orange)" }}>$ {p.price}</span>
              </div>
            </div>
          ))}

          <div style={{ gridColumn: "3 / 5", cursor: "pointer" }} onClick={() => openQuickView(FEATURED[3])}>
            <div className="product-img-wrap" style={{ aspectRatio: "16/9" }}>
              <img src={FEATURED[3].image} alt={FEATURED[3].name} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
              <span className="label" style={{ fontSize: "10px", letterSpacing: "0.14em" }}>{FEATURED[3].name}</span>
              <span className="label" style={{ fontSize: "10px", color: "var(--orange)" }}>$ {FEATURED[3].price}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <div ref={catSection.ref}>
        <section style={{ borderTop: "1px solid var(--gray-800)", padding: "clamp(40px, 6vw, 80px) clamp(16px, 4vw, 40px)" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "clamp(24px, 4vw, 48px)" }}>
            <h2 className="display-md" style={{ opacity: catSection.inView ? 1 : 0, transform: catSection.inView ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.8s ease, transform 0.8s var(--ease-out-expo)" }}>
              Shop by<br /><em>Category</em>
            </h2>
            <Link href="/products" className="btn-ghost link-reveal hidden md:flex" style={{ fontSize: "10px" }}>
              View All
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }} className="md:grid-cols-4">
            {CATEGORIES.map((cat, i) => (
              <Link href="/products" key={cat.name} className="group block" style={{ opacity: catSection.inView ? 1 : 0, transform: catSection.inView ? "translateY(0)" : "translateY(30px)", transition: `opacity 0.7s ease ${i * 80}ms, transform 0.7s var(--ease-out-expo) ${i * 80}ms` }}>
                <div className="product-img-wrap" style={{ aspectRatio: "3/4" }}>
                  <img src={cat.img} alt={cat.name} />
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0)", transition: "background 0.5s ease" }} className="group-hover:bg-black/30" />
                </div>
                <p className="label group-hover:text-[var(--orange)]" style={{ marginTop: "12px", fontSize: "10px", letterSpacing: "0.16em", transition: "color 0.25s" }}>
                  {cat.name}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* ── NEWSLETTER ── */}
      <div ref={newsSection.ref}>
        <section style={{ borderTop: "1px solid var(--gray-800)", padding: "clamp(56px, 8vw, 112px) clamp(16px, 4vw, 40px)" }}>
          <div style={{ maxWidth: "520px", margin: "0 auto", textAlign: "center" }}>
            <p className="label" style={{ color: "var(--orange)", marginBottom: "16px", fontSize: "9px", letterSpacing: "0.25em" }}>
              The Edit — Exclusive Access
            </p>
            <h2 className="display-md" style={{ marginBottom: "clamp(28px, 5vw, 48px)", opacity: newsSection.inView ? 1 : 0 }}>
              <em>Stay Informed</em>
            </h2>
            <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", borderBottom: "1px solid var(--gray-600)", paddingBottom: "0" }}>
              <input type="email" placeholder="Your e-mail address" className="input-line" style={{ border: "none", borderBottom: "none", flex: 1, borderRadius: 0, color: "var(--beige)" }} />
              <button type="submit" className="btn-ghost text-[var(--orange)]" style={{ flexShrink: 0, paddingLeft: "20px" }}>
                <span style={{ fontSize: "10px", letterSpacing: "0.18em" }}>Subscribe</span>
                <ArrowRight size={13} strokeWidth={1.25} />
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}