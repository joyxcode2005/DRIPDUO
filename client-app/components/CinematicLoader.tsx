"use client";

import React, { useEffect, useState } from "react";

// 3×3 grid — 9 cells vs 25. Visually identical effect, far less paint cost.
const GRID_SIZE = 3;

// Deterministic pseudo-random so SSR/client render match (no hydration mismatch)
const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
};

export default function CinematicLoader() {
  const [phase, setPhase] = useState<"enter" | "exit" | "done">("enter");

  useEffect(() => {
    // Preload the logo image so it's ready when tiles animate in
    const img = new Image();
    img.src = "/images/transLoader.png";

    const exitTimer = setTimeout(() => setPhase("exit"), 3200);
    const doneTimer = setTimeout(() => setPhase("done"), 4000);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  if (phase === "done") return null;

  const LOGO_SIZE = 220; // px — fixed, responsive via CSS clamp on wrapper
  const CELL_SIZE = LOGO_SIZE / GRID_SIZE;
  const CORNER_R = 20;

  const cells: { r: number; c: number; idx: number }[] = [];
  let idx = 0;
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      cells.push({ r, c, idx: idx++ });
    }
  }

  return (
    <div
      className={`cinematic-loader ${phase === "exit" ? "cinematic-loader--exit" : ""}`}
      aria-hidden="true"
    >
      {/* Logo grid */}
      <div
        className="cinematic-grid"
        style={{
          width: LOGO_SIZE,
          height: LOGO_SIZE,
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
        }}
      >
        {cells.map(({ r, c, idx }) => {
          const rand1 = pseudoRandom(idx * 7);
          const rand2 = pseudoRandom(idx * 13);
          const rand3 = pseudoRandom(idx * 19);

          // Scatter: tiles fly in from a wide spread
          const tx = ((rand1 - 0.5) * 320).toFixed(1);
          const ty = ((rand2 - 0.5) * 320).toFixed(1);
          const rz = ((rand3 - 0.5) * 180).toFixed(1);
          const delay = (0.05 + rand1 * 0.35).toFixed(2);

          let borderRadius = "0px";
          if (r === 0 && c === 0)                             borderRadius = `${CORNER_R}px 0 0 0`;
          if (r === 0 && c === GRID_SIZE - 1)                 borderRadius = `0 ${CORNER_R}px 0 0`;
          if (r === GRID_SIZE - 1 && c === 0)                 borderRadius = `0 0 0 ${CORNER_R}px`;
          if (r === GRID_SIZE - 1 && c === GRID_SIZE - 1)     borderRadius = `0 0 ${CORNER_R}px 0`;

          return (
            <div
              key={idx}
              className="cinematic-cell"
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                borderRadius,
                backgroundImage: "url('/images/transLoader.png')",
                backgroundSize: `${LOGO_SIZE}px ${LOGO_SIZE}px`,
                backgroundPosition: `-${c * CELL_SIZE}px -${r * CELL_SIZE}px`,
                // CSS custom props drive the keyframe start values
                ["--tx" as string]: `${tx}px`,
                ["--ty" as string]: `${ty}px`,
                ["--rz" as string]: `${rz}deg`,
                animationDelay: `${delay}s`,
              }}
            />
          );
        })}
      </div>

      {/* Brand lockup */}
      <div className="cinematic-brand">
        <span className="cinematic-brand__name">DRIPDUO</span>
        <div className="cinematic-brand__line" />
        <span className="cinematic-brand__tagline">Curating Collection</span>
      </div>

      <style>{`
        /* ── Overlay ─────────────────────────────────────────────────── */
        .cinematic-loader {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #050505;
          overflow: hidden;
          pointer-events: none;
          /* Overlay fade-in (instant) then hold */
          opacity: 1;
        }
        .cinematic-loader--exit {
          animation: loaderFadeOut 0.7s cubic-bezier(0.65,0,0.35,1) forwards;
        }
        @keyframes loaderFadeOut {
          to { opacity: 0; }
        }

        /* ── Grid container ──────────────────────────────────────────── */
        .cinematic-grid {
          position: relative;
          display: grid;
          /* Scale the whole grid on smaller screens — no JS needed */
          transform-origin: center center;
        }
        @media (max-width: 480px) {
          .cinematic-grid {
            transform: scale(0.55);
          }
          .cinematic-brand { transform: scale(0.85); }
        }

        /* ── Individual tiles ────────────────────────────────────────── */
        .cinematic-cell {
          position: relative;
          background-color: #1a1a1a;
          background-repeat: no-repeat;
          will-change: transform, opacity;
          /* Start scattered & invisible; land in place */
          animation: tileIn 1.8s cubic-bezier(0.22,1,0.36,1) both;
          /* Backface culling prevents flash on rotation */
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        @keyframes tileIn {
          from {
            opacity: 0;
            transform: translate3d(var(--tx), var(--ty), 0) rotate(var(--rz)) scale(0.75);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
          }
        }

        /* ── Brand lockup ────────────────────────────────────────────── */
        .cinematic-brand {
          position: absolute;
          bottom: clamp(3rem, 8vw, 6rem);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          animation: brandIn 1.0s 1.4s cubic-bezier(0.22,1,0.36,1) both;
          will-change: transform, opacity;
        }
        @keyframes brandIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }

        .cinematic-brand__name {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: clamp(13px, 3.5vw, 19px);
          font-weight: 900;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #ECE7D1;
        }

        .cinematic-brand__line {
          height: 1px;
          background: #EE3C24;
          width: 0;
          animation: lineExpand 0.9s 1.7s cubic-bezier(0.65,0,0.35,1) forwards;
          will-change: width;
        }
        @keyframes lineExpand {
          to { width: clamp(80px, 20vw, 120px); }
        }

        .cinematic-brand__tagline {
          font-family: 'EB Garamond', Georgia, serif;
          font-size: clamp(10px, 2.5vw, 13px);
          font-style: italic;
          letter-spacing: 0.22em;
          color: #EE3C24;
          opacity: 0;
          animation: fadeIn 0.8s 2.0s ease forwards;
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }

        /* ── Accessibility ───────────────────────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .cinematic-cell,
          .cinematic-brand,
          .cinematic-brand__line,
          .cinematic-brand__tagline {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            width: clamp(80px, 20vw, 120px);
          }
        }
      `}</style>
    </div>
  );
}