"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Reveal from "@/components/Reveal";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { SketchHighlight } from "@/components/ui/sketch-highlight";

export default function AboutPage() {
  return (
    <div className="min-h-screen text-[#ECE7D1] font-sans relative z-10 pt-24 md:pt-32 pb-20 w-full overflow-x-hidden">
      
      {/* ── BACKGROUND NOISE ── */}
      <div className="fixed inset-0 pointer-events-none mix-blend-overlay z-0 opacity-30 w-full" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")` }} 
      />

      <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 relative z-10">
        
        {/* ── BACK BUTTON ── */}
        <Reveal>
          <div className="mb-8 md:mb-12">
            <Link href="/" className="inline-flex items-center gap-3 font-sans text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors glass-panel px-6 py-3 rounded-full hover:bg-white/10 w-fit shadow-md">
              <ArrowLeft size={14} strokeWidth={1.5} /> Back to Home
            </Link>
          </div>
        </Reveal>

        {/* ── HERO EDITORIAL ── */}
        <Reveal>
          <div className="relative w-full h-[60vh] md:h-[75vh] glass-panel rounded-[2.5rem] md:rounded-[4rem] overflow-hidden mb-16 md:mb-24 shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1550614000-4b95d4ebf6eb?q=80&w=2000&auto=format&fit=crop" 
              alt="DRIPDUO Studio" 
              className="absolute inset-0 w-full h-full object-cover grayscale-[0.8] opacity-60 hover:grayscale-0 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-black/40 to-transparent" />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <span className="font-sans text-[10px] md:text-[12px] uppercase tracking-[0.4em] text-[#EE3C24] mb-6 drop-shadow-md">The Genesis</span>
              <h1 className="font-serif italic leading-[0.9] tracking-tight text-[#ECE7D1] drop-shadow-2xl" style={{ fontSize: "clamp(3.5rem, 10vw, 10rem)" }}>
                <LayoutTextFlip words={["Our Story.", "The Archive.", "The Vision."]} />
              </h1>
            </div>
          </div>
        </Reveal>

        {/* ── THE FOUNDERS & PHILOSOPHY ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 mb-16 md:mb-24">
          <Reveal className="w-full h-full">
            <div className="glass-panel p-10 md:p-16 lg:p-20 rounded-[2.5rem] md:rounded-[3rem] shadow-xl h-full flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-8">
                <span className="w-12 h-px bg-[#EE3C24]" />
                <span className="font-sans text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-[#EE3C24]">The Architects</span>
              </div>
              <h2 className="font-serif text-[2.5rem] md:text-[4rem] leading-[1.1] text-white mb-8">
                Forged by<br /><em><SketchHighlight type="underline" delay={300} color="#EE3C24">Ayush & Joy</SketchHighlight></em>
              </h2>
              <p className="font-sans text-[14px] md:text-[16px] leading-[1.9] text-white/70 mb-6">
                Founded by Ayush Kirtania and Joy Sengupta, DRIPDUO was born from a mutual frustration with the modern fashion landscape. Too much noise. Too little substance.
              </p>
              <p className="font-sans text-[14px] md:text-[16px] leading-[1.9] text-white/70">
                What started as late-night conceptualizing at Scottish Church College evolved into a meticulous design endeavor. The goal was simple: engineer garments that speak for themselves through weight, texture, and uncompromising silhouette.
              </p>
            </div>
          </Reveal>

          <Reveal className="w-full h-full">
            <div className="glass-panel p-2 md:p-3 rounded-[2.5rem] md:rounded-[3rem] shadow-xl h-full min-h-[400px]">
              <div className="relative w-full h-full rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-black/40">
                 <img 
                    src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1200&auto=format&fit=crop" 
                    alt="Fabric details" 
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                 />
              </div>
            </div>
          </Reveal>
        </div>

        {/* ── THE CRAFT ── */}
        <Reveal>
          <div className="glass-panel rounded-[2.5rem] md:rounded-[4rem] overflow-hidden flex flex-col md:grid md:grid-cols-12 shadow-2xl">
            <div className="md:col-span-5 relative aspect-square md:aspect-auto">
              <img 
                  src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200&auto=format&fit=crop" 
                  alt="Craftsmanship" 
                  className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t md:bg-linear-to-r from-[#050505]/90 to-transparent" />
            </div>
            
            <div className="md:col-span-7 p-10 md:p-16 lg:p-24 xl:p-32 flex flex-col justify-center">
              <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-white/40 mb-6 md:mb-10">03 / The Craft</span>
              <h2 className="font-serif text-[clamp(2.5rem,4vw,4.5rem)] leading-[1] text-white mb-8 md:mb-10 drop-shadow-lg">
                Obsessive<br />Essentialism.
              </h2>
              <p className="font-sans text-[14px] md:text-[16px] leading-[1.9] tracking-[0.03em] text-white/60 mb-8 max-w-xl">
                We don't do seasonal fast fashion. We build an archive. Every piece in the DRIPDUO collection utilizes custom-milled 240 GSM heavyweight cotton. 
              </p>
              <p className="font-sans text-[14px] md:text-[16px] leading-[1.9] tracking-[0.03em] text-white/60 max-w-xl">
                By stripping away aggressive branding and relying entirely on structural integrity and drape, we let the garment become the statement. A study in absolute restraint.
              </p>
            </div>
          </div>
        </Reveal>

      </div>
    </div>
  );
}