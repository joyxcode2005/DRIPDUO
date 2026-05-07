"use client";

import { motion } from "motion/react";

// The ultimate Apple/Awwwards smooth easing curve
const PREMIUM_EASE = [0.22, 1, 0.36, 1];

const GARMENTS = [
  { bg: "#ECE7D1", sleeve: "#ECE7D1" },          // beige
  { bg: "#EE3C24", sleeve: "#EE3C24" },          // orange
  { bg: "#1A1A17", sleeve: "#1A1A17" },          // near-black
  { bg: "#2A2A2A", sleeve: "#2A2A2A" },          // dark gray
  { bg: "rgba(236,231,209,0.08)", sleeve: "rgba(236,231,209,0.08)" }, // ghost outline
  { bg: "#ECE7D1", sleeve: "#ECE7D1" },          // loop back
];

function Tee({ bg, sleeve }: { bg: string; sleeve: string }) {
  return (
    <svg width="52" height="58" viewBox="0 0 52 58" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="13" height="18" rx="2" fill={sleeve} />
      <rect x="39" y="0" width="13" height="18" rx="2" fill={sleeve} />
      <rect x="10" y="0" width="32" height="58" rx="2" fill={bg} />
    </svg>
  );
}

function Hanger() {
  return (
    <svg width="38" height="22" viewBox="0 0 38 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="19" y1="0" x2="19" y2="10" stroke="#6B6A5E" strokeWidth="2" strokeLinecap="round" />
      <path d="M19 10 C19 6 23 4 23 8 C23 10 21 11 19 10" stroke="#6B6A5E" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M2 22 Q19 14 36 22" stroke="#6B6A5E" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export default function Loading() {
  const chars = "DRIPDUO".split("");

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#050505" }} // Slightly off-black is considered more premium than #000
    >
      {/* Background Editorial Watermark */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 0.02, scale: 1 }}
        transition={{ delay: 0.5, duration: 3, ease: "easeOut" }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <span
          className="font-serif whitespace-nowrap"
          style={{
            fontFamily: "'EB Garamond', Georgia, serif",
            fontSize: "clamp(6rem, 20vw, 16rem)",
            color: "#ECE7D1",
            letterSpacing: "-0.04em",
          }}
          aria-hidden="true"
        >
          ORIGINS
        </span>
      </motion.div>

      {/* Main content stack */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* Phase 1 & 2 — The Drop, The Rod Expansion, and The Sliding Garments */}
        <div className="relative overflow-hidden flex justify-center" style={{ width: 280, height: 100 }}>
          
          {/* Edge Fade Masks for seamless loop inside #050505 */}
          <div className="absolute inset-y-0 left-0 z-20 w-[60px]" style={{ background: "linear-gradient(to right, #050505 0%, transparent 100%)", pointerEvents: "none" }} />
          <div className="absolute inset-y-0 right-0 z-20 w-[60px]" style={{ background: "linear-gradient(to left, #050505 0%, transparent 100%)", pointerEvents: "none" }} />

          {/* The Drop & Expanding Rod Animation */}
          <div className="absolute top-[21px] left-0 right-0 flex justify-center items-center z-0">
            <motion.div
              initial={{ width: "8px", height: "8px", y: -40, opacity: 0, borderRadius: "50%", background: "#EE3C24" }}
              animate={{ 
                y: [ -40, 0, 0 ], 
                opacity: [0, 1, 1],
                width: ["8px", "8px", "100%"], 
                height: ["8px", "8px", "2px"],
                background: ["#EE3C24", "#EE3C24", "#2A2A2A"],
                borderRadius: ["50%", "50%", "2px"]
              }}
              transition={{ 
                duration: 1.2, 
                times: [0, 0.4, 1], // Hits center at 0.4s, expands outward until 1.2s
                ease: "easeInOut" 
              }}
            />
          </div>

          {/* The Sliding Rack of Clothes */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8, ease: PREMIUM_EASE as any }}
            className="absolute top-0 z-10"
          >
            {/* 456px exact shift ensures flawless seamless loop (6 items * 76px spacing) */}
            <motion.div
              style={{ display: "flex", gap: 24, paddingLeft: 24 }}
              animate={{ x: [0, -456] }}
              transition={{ duration: 6, ease: "linear", repeat: Infinity }}
            >
              {[...GARMENTS, ...GARMENTS, ...GARMENTS].map((g, i) => (
                <div key={i} className="flex flex-col items-center shrink-0">
                  <Hanger />
                  <motion.div
                    animate={{ rotate: [-0.8, 0.8] }}
                    transition={{
                      duration: 2,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: i * 0.1, // Staggered gentle sway
                    }}
                    style={{ transformOrigin: "top center", marginTop: -2 }}
                  >
                    <Tee bg={g.bg} sleeve={g.sleeve} />
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Phase 3 — Masked Typographic Reveal */}
        <div className="flex flex-col items-center mt-6">
          <div className="overflow-hidden pb-2 flex gap-1">
            {chars.map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 40, rotateX: 45, filter: "blur(10px)", scale: 0.8 }}
                animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)", scale: 1 }}
                transition={{
                  duration: 0.8,
                  ease: PREMIUM_EASE as any,
                  delay: 1.6 + i * 0.06, // Triggers perfectly after the rack fades in
                }}
                className="inline-block font-serif text-[#ECE7D1]"
                style={{
                  fontFamily: "'EB Garamond', Georgia, serif",
                  fontSize: "clamp(2rem, 5vw, 2.5rem)",
                  letterSpacing: "0.2em",
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>

          {/* Subtitle */}
          <div className="overflow-hidden mt-2">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2, duration: 1, ease: PREMIUM_EASE as any }}
              className="text-[#EE3C24] font-medium tracking-[0.4em] uppercase text-[9px]"
              style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
            >
              Curating Collection
            </motion.p>
          </div>
        </div>

        {/* Phase 4 — Center-Out Progress Line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="relative overflow-hidden mt-6 bg-[#1A1A17]"
          style={{ width: "120px", height: "1px" }}
        >
          <motion.div
            className="absolute top-0 bottom-0 shadow-[0_0_8px_#ECE7D1]"
            style={{ background: "#ECE7D1" }}
            initial={{ left: "50%", right: "50%" }}
            animate={{ left: "0%", right: "0%" }}
            transition={{
              duration: 2.5,
              ease: PREMIUM_EASE as any,
              delay: 2,
            }}
          />
        </motion.div>

      </div>
    </div>
  );
}