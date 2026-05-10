"use client";

import { useEffect, useRef } from "react";

const CELL = 32;

// Pixel-map of the logo:
// Row 0: bolt top cap
// Row 1-3: lightning bolt zigzag
// Row 3-5: U bowl walls
// Row 6: U bowl bottom curve
const LOGO_CELLS: [number, number][] = [
  [2,0],[3,0],           // bolt top cap
  [1,1],[2,1],           // bolt left arm
  [2,2],[3,2],[4,2],     // bolt center cross
  [0,3],[2,3],[3,3],[5,3], // bolt lower + U wall tops
  [0,4],[5,4],           // U left & right walls
  [0,5],[5,5],           // U left & right walls lower
  [1,6],[2,6],[3,6],[4,6], // U bottom curve
];

const DURATION = 3.8;
const HOLD_START = 0.40;
const HOLD_END   = 0.75;

function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3); }
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
}

export default function Loading() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Build squares + compute scatter origins
    const squares: {
      el: HTMLDivElement;
      ox: number; oy: number;
      delay: number;
    }[] = [];

    LOGO_CELLS.forEach(([col, row], i) => {
      const el = document.createElement("div");
      el.style.cssText = `
        position:absolute;
        left:${col * CELL}px;
        top:${row * CELL}px;
        width:30px; height:30px;
        border-radius:3px;
        background:#EE3C24;
        opacity:0;
        will-change:transform,opacity;
      `;
      container.appendChild(el);

      const angle = (i / LOGO_CELLS.length) * Math.PI * 2 + Math.random() * 0.5;
      const dist  = 85 + Math.random() * 75;
      squares.push({
        el,
        ox: Math.cos(angle) * dist,
        oy: Math.sin(angle) * dist,
        delay: i * 0.055,
      });
    });

    let start: number | null = null;

    function animate(ts: number) {
      if (!start) start = ts;
      const p = ((ts - start) / 1000 % DURATION) / DURATION;

      squares.forEach(({ el, ox, oy, delay }) => {
        const dNorm = delay / DURATION;

        if (p < HOLD_START) {
          const inP = dNorm >= HOLD_START
            ? 0
            : Math.min(1, easeOutCubic((p - dNorm) / (HOLD_START - dNorm)));
          const t = inP <= 0 ? 0 : inP;
          el.style.transform = `translate(${ox*(1-t)}px,${oy*(1-t)}px) scale(${0.3+t*0.7})`;
          el.style.opacity = String(t.toFixed(3));
        } else if (p < HOLD_END) {
          el.style.transform = "translate(0,0) scale(1)";
          el.style.opacity = "1";
        } else {
          const inv = easeInOutCubic((p - HOLD_END) / (1 - HOLD_END));
          el.style.transform = `translate(${ox*inv*0.5}px,${oy*inv*0.5}px) scale(${1-inv*0.7})`;
          el.style.opacity = String((1-inv).toFixed(3));
        }
      });

      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      squares.forEach(({ el }) => el.remove());
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#050505" }}
    >
      {/* FW26 watermark */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", bottom: 16, right: 20,
          fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
          fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 900,
          letterSpacing: "-0.02em", color: "#1A1A17",
          userSelect: "none", lineHeight: 1,
        }}
      >
        FW26
      </div>

      {/* Logo pixel grid — squares injected by useEffect */}
      <div
        ref={containerRef}
        style={{ position: "relative", width: 192, height: 224 }}
      />

      {/* Brand text */}
      <div
        style={{
          marginTop: 28,
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: 9,
        }}
      >
        <span
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: 19, fontWeight: 900,
            letterSpacing: "0.28em", textTransform: "uppercase",
            color: "#ECE7D1",
            animation: "ldWp 3.8s ease-in-out infinite",
          }}
        >
          DRIPDUO
        </span>
        <span
          style={{
            fontFamily: "'EB Garamond', Georgia, serif",
            fontSize: 13, fontStyle: "italic",
            letterSpacing: "0.18em", color: "#EE3C24",
            animation: "ldWp 3.8s ease-in-out infinite 0.4s",
          }}
        >
          Curating Collection
        </span>
        <div style={{ marginTop: 10, width: 150, height: 2, background: "#1A1A17", overflow: "hidden" }}>
          <div style={{ height: "100%", background: "#EE3C24", animation: "ldPf 3.8s ease-in-out infinite" }} />
        </div>
      </div>

      <style>{`
        @keyframes ldWp { 0%,100%{opacity:0.65} 50%{opacity:1} }
        @keyframes ldPf { 0%{width:0%} 74%{width:100%} 87%{width:100%} 100%{width:0%} }
      `}</style>
    </div>
  );
}