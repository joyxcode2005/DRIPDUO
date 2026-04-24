"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  // Handle the Entry Hook Sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2800); // Splash screen duration
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen w-full bg-[#050505] text-[#f8f8f8] font-sans selection:bg-[#C5A059] selection:text-black overflow-x-hidden">
      
      {/* 1. THE HOOK: LIQUID ENTRY SEQUENCE */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
            className="fixed inset-0 z-[200] bg-[#050505] flex flex-col items-center justify-center overflow-hidden"
          >
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="text-[#f8f8f8] text-4xl md:text-6xl font-light tracking-[0.4em] uppercase mb-10 z-10"
            >
              Dripduo
            </motion.h1>
            
            {/* Liquid SVG rising from the bottom */}
            <svg className="absolute bottom-0 left-0 w-full h-[50vh] opacity-40" viewBox="0 0 1440 200" preserveAspectRatio="none">
              <path fill="#C5A059">
                <animate attributeName="d" dur="4s" repeatCount="indefinite" values="M0,100 Q360,60 720,100 T1440,100 V200 H0 Z; M0,120 Q360,180 720,120 T1440,120 V200 H0 Z; M0,100 Q360,60 720,100 T1440,100 V200 H0 Z" />
              </path>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. HERO SECTION: VISUALS FIRST */}
      <section className="relative h-screen w-full flex flex-col items-center justify-end pb-12 md:pb-24">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1550614000-4b95d4ed141b?q=80&w=2000" 
            alt="Dripduo FW26 Collection" 
            className="w-full h-full object-cover grayscale-[0.2]"
          />
          {/* Luxury Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-black/40" />
        </div>
        
        <div className="relative z-10 text-center px-4">
          <h2 className="text-5xl md:text-[8vw] font-light uppercase tracking-[0.1em] leading-none mb-6 text-white drop-shadow-2xl">
            The Archive
          </h2>
          <p className="text-[#C5A059] text-[10px] md:text-xs font-mono tracking-[0.4em] uppercase">
            Scroll to Explore • Fall/Winter 2026
          </p>
        </div>
      </section>

      {/* 3. INSTANT PRODUCT REVEAL: BENTO GRID WITH INTERACTIVE ANIMATIONS */}
      <section className="px-4 py-16 md:py-32 max-w-[1600px] mx-auto z-20 relative bg-[#050505]">
        <div className="grid grid-cols-1 md:grid-cols-4 md:auto-rows-[400px] gap-4">
          
          {/* Bento Cell A: Main Look (Spans 2x2) - Hover Side Movement */}
          <Link href="/products" className="md:col-span-2 md:row-span-2 group relative overflow-hidden bg-[#0a0a0a] border border-white/5">
            <img src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1000" alt="Main Collection" className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)]" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 bg-gradient-to-t from-black/90 via-black/20 to-transparent">
              {/* The Hover Side Movement Application */}
              <div className="transform transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-x-6">
                <span className="text-[#C5A059] text-[10px] tracking-[0.3em] uppercase mb-3 block font-bold">Signature</span>
                <h3 className="text-3xl md:text-5xl font-light uppercase text-white">Heavyweight<br/>Oversized</h3>
                <span className="mt-6 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">
                  Shop Now <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>

          {/* Bento Cell B: The Responsive Flip Card */}
          <div className="md:col-span-1 md:row-span-2 group/flip perspective-[2000px] bg-transparent min-h-[400px]">
            <div className="relative w-full h-full transition-transform duration-[1.2s] ease-[cubic-bezier(0.25,1,0.5,1)] transform-style-3d group-hover/flip:rotate-y-180">
              {/* Front */}
              <div className="absolute inset-0 backface-hidden bg-[#0a0a0a] border border-white/5 flex flex-col items-center justify-center p-8 text-center shadow-2xl">
                <span className="text-2xl font-light uppercase tracking-[0.2em] text-white">Edition 01</span>
                <div className="h-[1px] w-12 bg-white/20 my-8"></div>
                <span className="text-zinc-500 text-xs tracking-widest uppercase font-mono">Hover to Unveil</span>
              </div>
              {/* Back */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#C5A059] border border-[#C5A059] flex flex-col items-center justify-center p-8 text-center shadow-2xl">
                <span className="text-xl font-medium uppercase tracking-[0.2em] text-[#050505]">Uncompromising<br/>Quality</span>
                <p className="text-[#050505]/80 text-xs mt-6 leading-relaxed font-medium">Milled in Italy. Assembled with absolute precision. Designed to outlast trends.</p>
                <button className="mt-8 border border-[#050505] text-[#050505] px-6 py-3 text-[10px] uppercase tracking-widest font-black hover:bg-[#050505] hover:text-[#C5A059] transition-colors">
                  Discover
                </button>
              </div>
            </div>
          </div>

          {/* Bento Cell C: The Rotating Half-Circle Animation */}
          <div className="md:col-span-1 md:row-span-1 flex items-center justify-center bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-transparent z-0" />
            <div className="relative z-10 flex items-center justify-center w-48 h-48">
              <svg className="animate-[spin_12s_linear_infinite] absolute inset-0 w-full h-full opacity-60" viewBox="0 0 120 120" fill="none">
                <path id="curve-bento" d="M 60, 60 m -45, 0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0" fill="transparent" />
                <text fill="#C5A059" fontSize="8.5" className="font-mono tracking-[0.2em] uppercase font-bold">
                  <textPath href="#curve-bento" startOffset="0%">
                    • Dripduo Worldwide • Super Premium
                  </textPath>
                </text>
              </svg>
              <span className="text-white font-light text-2xl tracking-[0.2em]">D2</span>
            </div>
          </div>

          {/* Bento Cell D: Secondary Look - Hover Side Movement */}
          <Link href="/products" className="md:col-span-1 md:row-span-1 group relative overflow-hidden bg-[#0a0a0a] border border-white/5">
            <img src="https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=600" alt="Secondary" className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)]" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/90 to-transparent">
              <div className="transform transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-x-4">
                <span className="text-[#C5A059] text-[9px] tracking-widest uppercase mb-1 block">Essentials</span>
                <h3 className="text-xl font-light uppercase text-white">Washed Denim</h3>
              </div>
            </div>
          </Link>
          
        </div>
      </section>

      {/* 4. THE WRITING PARTS DOWNWARD: BRAND STORY & PENCIL ANIMATION */}
      <section className="py-32 md:py-48 px-4 max-w-5xl mx-auto text-center relative z-20">
        <h2 className="text-[1.75rem] md:text-5xl font-light leading-[1.5] tracking-wide text-zinc-400">
          We reject the ordinary. Dripduo is engineered for those who demand <br className="hidden md:block"/>
          <span className="relative inline-block text-white font-medium mx-3 mt-4 md:mt-0">
            excellence.
            {/* Scroll-Triggered Pencil Underline */}
            <svg className="absolute -bottom-2 md:-bottom-4 left-0 w-full h-4 md:h-6 pointer-events-none" viewBox="0 0 420 30" fill="none" preserveAspectRatio="none">
              <motion.path 
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                d="M10 20 Q 120 5 210 20 Q 320 35 410 10" 
                stroke="#C5A059" 
                strokeWidth="4" 
                strokeLinecap="round" 
              />
            </svg>
          </span>
          <br className="hidden md:block"/>
          Take the{" "}
          <span className="relative inline-block font-serif italic text-white ml-2">
            risk
            {/* Scroll-Triggered Pencil Circle */}
            <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] pointer-events-none" viewBox="0 0 120 60" fill="none">
              <motion.ellipse 
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.8 }}
                cx="60" cy="30" rx="54" ry="25" 
                stroke="#C5A059" 
                strokeWidth="2" 
                strokeLinecap="round" 
                transform="rotate(-5 60 30)"
              />
            </svg>
          </span>.
        </h2>
      </section>

      {/* STATIC SCROLLING MARQUEE */}
      <section className="w-full bg-[#C5A059] py-4 overflow-hidden flex items-center z-20 relative">
        <div className="marquee-container text-sm md:text-base font-medium text-black tracking-[0.2em] uppercase whitespace-nowrap flex">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex gap-16 px-8">
              <span>Super Premium</span>
              <span className="opacity-50">✦</span>
              <span>Limited Archive</span>
              <span className="opacity-50">✦</span>
              <span>Unapologetic Style</span>
              <span className="opacity-50">✦</span>
              <span className="font-black">DRIPDUO</span>
              <span className="opacity-50">✦</span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FOOTER & NAVIGATION: PARALLAX LOOKBOOK */}
      <section className="w-full py-32 md:py-48 overflow-hidden relative border-t border-white/5 bg-[#0a0a0a]">
        <div className="flex flex-col md:flex-row justify-between items-end max-w-[95vw] mx-auto mb-16 px-4">
          <h3 className="font-light text-3xl md:text-5xl uppercase tracking-[0.1em]">The Lookbook</h3>
          <Link href="/products" className="text-[#C5A059] text-xs font-mono tracking-widest mt-4 md:mt-0 border-b border-[#C5A059] pb-1 hover:text-white transition-colors">
            VIEW FULL ARCHIVE
          </Link>
        </div>
        
        {/* Parallax Track */}
        <div className="w-full overflow-hidden">
          <div className="parallax-scroll gap-8 md:gap-12 px-4 flex">
            {[1, 2, 3, 4, 1, 2, 3, 4].map((i, index) => (
              <div key={index} className="flex-shrink-0 w-72 h-[28rem] md:w-[28rem] md:h-[38rem] bg-[#050505] overflow-hidden group relative cursor-pointer border border-white/5">
                <div className="absolute inset-0 bg-black/50 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]" />
                <img 
                  src={`https://images.unsplash.com/photo-1550614000-4b95d4ed141b?w=800&q=80`} 
                  alt="Lookbook" 
                  className="w-full h-full object-cover grayscale opacity-70 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
                />
                <div className="absolute bottom-8 left-8 z-20 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]">
                  <span className="text-[#C5A059] text-[10px] font-medium tracking-[0.2em] uppercase mb-2 block">Look 0{i}</span>
                  <h4 className="text-white font-light text-2xl uppercase tracking-wider">Campaign Series</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}