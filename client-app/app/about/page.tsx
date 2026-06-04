"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Reveal from "@/components/Reveal";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { SketchHighlight } from "@/components/ui/sketch-highlight";
import dynamic from "next/dynamic";

// FIX 1: Dynamically import the 3D Canvas component to prevent Next.js SSR from breaking it
const ClothButton = dynamic(() => import("@/components/ClothButton"), {
  ssr: false,
  loading: () => (
    <div className="w-[220px] h-[220px] rounded-full border border-white/10 animate-pulse flex items-center justify-center bg-white/5">
      <span className="text-[10px] uppercase tracking-widest text-white/30">Loading 3D...</span>
    </div>
  ),
});

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen text-[#ECE7D1] font-sans relative z-10 pt-24 md:pt-32 pb-20 w-full overflow-x-hidden">

      {/* ── BACKGROUND NOISE ── */}
      <div className="fixed inset-0 pointer-events-none mix-blend-overlay z-0 opacity-30 w-full"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")` }}
      />

      <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">

        <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-12 md:mb-20 font-sans text-[10px] uppercase tracking-[0.2em]">
          <ArrowLeft size={14} /> Back to Archive
        </Link>

        {/* ── HERO TEXT & INTERACTIVE BUTTON ── */}
        <div className="flex flex-col items-center justify-center mb-24 md:mb-32 text-center max-w-4xl mx-auto">
          <Reveal>
            <h1 className="font-serif text-[clamp(3rem,8vw,8rem)] leading-[0.9] tracking-tight mb-8">
              <LayoutTextFlip text="Obsessive " words={["Essentialism.", "Restraint.", "Brilliance.", "Archive."]} />
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="font-sans text-[12px] md:text-[14px] uppercase tracking-[0.2em] text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
              We strip away the noise. We prototype in the shadows. We build garments that outlast trends. Welcome to the DRIPDUO studio.
            </p>
          </Reveal>

          {/* INTERACTIVE 3D CLOTH BUTTON */}
          <Reveal delay={0.3}>
            {/* Added explicit height here so Reveal doesn't collapse */}
            <div className="flex flex-col items-center justify-center group relative z-20 w-full min-h-[260px]">
              <ClothButton
                size={220}
                logoSrc="/images/reallogo.png"
                onClick={() => router.push('/products')}
                className="cursor-pointer hover:scale-105 transition-transform duration-700"
              />
              <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-white/30 mt-6 animate-pulse block">
                Drag to Spin • Tap to Shop
              </span>
            </div>
          </Reveal>
        </div>

        {/* ── IMAGE GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 lg:gap-8 mb-24 md:mb-40">

          {/* Main Image */}
          {/* FIX 2: Wrapped the Reveal AROUND the fully sized explicit container so it doesn't shrink to 0px */}
          <div className="md:col-span-7 w-full h-[400px] md:h-[600px]">
            <Reveal>
              <div className="relative w-full h-[400px] md:h-[600px] rounded-3xl overflow-hidden glass-panel p-2">
                <div className="relative w-full h-full rounded-2xl overflow-hidden">
                  <img
                    src="/images/studio.avif"
                    alt="Studio Setup"
                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 transition-all duration-1000"
                  />
                </div>
              </div>
            </Reveal>
          </div>

          {/* Side Images */}
          <div className="md:col-span-5 flex flex-col gap-4 md:gap-6 lg:gap-8">

            <div className="w-full h-[250px] md:h-[285px]">
              <Reveal>
                <div className="relative w-full h-[250px] md:h-[285px] rounded-3xl overflow-hidden glass-panel p-2">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden">
                    <img
                      src="/images/about.webp"
                      alt="Patterns"
                      className="absolute inset-0 w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 transition-all duration-1000"
                    />
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="w-full h-[250px] md:h-[285px]">
              <Reveal delay={0.2}>
                <div className="relative w-full h-[250px] md:h-[285px] rounded-3xl overflow-hidden glass-panel p-2">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop"
                      alt="Fabric Details"
                      className="absolute inset-0 w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 transition-all duration-1000"
                    />
                  </div>
                </div>
              </Reveal>
            </div>

          </div>
        </div>

        {/* ── TEXT SECTIONS ── */}
        <div className="max-w-5xl mx-auto flex flex-col gap-24 md:gap-40">

          {/* 02 Philosophy */}
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
              <div className="md:col-span-5 font-serif text-[clamp(2.5rem,4vw,4rem)] leading-[1] text-white/20">
                02
              </div>
              <div className="md:col-span-7">
                <h2 className="font-serif text-[clamp(2rem,3vw,3rem)] leading-[1.1] text-[#ECE7D1] mb-6 drop-shadow-md">
                  The anatomy of <SketchHighlight type="underline" color="#EE3C24">less.</SketchHighlight>
                </h2>
                <p className="font-sans text-[14px] md:text-[15px] leading-[1.8] tracking-[0.02em] text-white/60 mb-6">
                  Born in our Barrackpore studio, our design language was built on a singular obsession: eliminating the non-essential. We reject excessive branding and visual clutter, choosing instead to let uncompromising structure and premium textiles do the talking.
                </p>
                <p className="font-sans text-[14px] md:text-[15px] leading-[1.8] tracking-[0.02em] text-white/60">
                  A DRIPDUO garment is the result of relentless iteration. From refining the shoulder drop down to the millimeter to testing countless washes for the ideal drape, we embrace a slow, deliberate craft. It’s not just clothing—it’s an absolute standard.
                </p>
              </div>
            </div>
          </Reveal>

        </div>
      </div>

      {/* ── FULL WIDTH BREAKOUT SECTION ── */}
      <div className="w-full my-24 md:my-40">
        <Reveal>
          <div className="w-full grid grid-cols-1 md:grid-cols-12 glass-panel border-y border-white/10 min-h-[400px]">
            {/* Added explicit h-[400px] on mobile to prevent collapse */}
            <div className="md:col-span-5 relative h-[400px] md:h-auto overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200&auto=format&fit=crop"
                alt="Craftsmanship"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#050505]/90 to-transparent" />
            </div>

            <div className="md:col-span-7 p-10 md:p-16 lg:p-24 xl:p-32 flex flex-col justify-center">
              <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-white/40 mb-6 md:mb-10">03 / The Craft</span>
              <h2 className="font-serif text-[clamp(2.5rem,4vw,4.5rem)] leading-[1] text-white mb-8 md:mb-10 drop-shadow-lg">
                Obsessive<br />Essentialism.
              </h2>
              <p className="font-sans text-[14px] md:text-[16px] leading-[1.9] tracking-[0.03em] text-white/60 mb-8 max-w-xl">
                We don't do seasonal fast fashion. We build an archive. Every piece in the DRIPDUO collection utilizes custom-milled 240 GSM heavyweight cotton.
              </p>
              <p className="font-sans text-[14px] md:text-[15px] leading-[1.8] tracking-[0.02em] text-white/60 mb-10 max-w-xl">
                It is pre-shrunk, bio-washed, and constructed with reinforced stitching. It is designed to look better on the 100th wear than it did on the first.
              </p>
              <Link href="/products" className="inline-flex items-center gap-4 bg-white/10 hover:bg-white text-[#ECE7D1] hover:text-black px-8 py-4 rounded-full font-sans text-[10px] uppercase tracking-[0.2em] w-max transition-all duration-300">
                View The Archive
              </Link>
            </div>
          </div>
        </Reveal>
      </div>

    </div>
  );
}