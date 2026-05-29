"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Reveal from "@/components/Reveal";
import { SketchHighlight } from "@/components/SktechHighlight";

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`;

const CHAPTERS = [
  {
    num: "01",
    title: "The Fabric Selection",
    subtitle: "Sourcing the weight",
    desc: "Every piece begins at the mill. We test dozens of cotton blends before settling on the one that passes our hand-feel test. If it doesn't feel right at 240 GSM, we start over.",
    aspect: "aspect-[4/3]",
    size: "col-span-2",
  },
  {
    num: "02",
    title: "The First Sample",
    subtitle: "Pattern to prototype",
    desc: "The first sample is always wrong. That's the point. We pull it apart, rebuild the shoulder, reset the hem drop. Usually takes six rounds.",
    aspect: "aspect-square",
    size: "col-span-1",
  },
  {
    num: "03",
    title: "Studio Day",
    subtitle: "Capturing the piece",
    desc: "We shoot everything ourselves. Natural light. No excessive post. The garment needs to speak before the edit does.",
    aspect: "aspect-square",
    size: "col-span-1",
  },
  {
    num: "04",
    title: "Quality Control",
    subtitle: "Before it ships",
    desc: "Every piece is inspected by hand. Stitching tension checked. Measurements compared to spec. If it's off by more than 0.5cm, it doesn't ship.",
    aspect: "aspect-[4/3]",
    size: "col-span-2",
  },
];

const PROCESS_STEPS = [
  { step: "01", title: "Mill Selection", detail: "We travel to source" },
  { step: "02", title: "GSM Testing", detail: "Hand-feel first" },
  { step: "03", title: "Pattern Work", detail: "6+ sample rounds" },
  { step: "04", title: "Fit Checks", detail: "On real bodies" },
  { step: "05", title: "QC Pass", detail: "Every single piece" },
  { step: "06", title: "Archive Ships", detail: "To your door" },
];

// Video teaser component
function VideoTeaser({ title, note }: { title: string; note: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div
      className="relative bg-[#0D0D0B] border border-[#1A1A17] group cursor-pointer overflow-hidden"
      onClick={() => setPlaying(!playing)}
    >
      <div className="relative aspect-video">
        {/* Grain overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: NOISE_SVG }} />

        {/* Film-strip edge effect */}
        <div className="absolute top-0 bottom-0 left-0 w-6 flex flex-col justify-between py-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-2 w-4 bg-[#1A1A17] mx-auto rounded-sm" />
          ))}
        </div>
        <div className="absolute top-0 bottom-0 right-0 w-6 flex flex-col justify-between py-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-2 w-4 bg-[#1A1A17] mx-auto rounded-sm" />
          ))}
        </div>

        {/* Center play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-14 h-14 border border-[#EE3C24]/50 rounded-full flex items-center justify-center bg-[#EE3C24]/5 backdrop-blur-sm group-hover:border-[#EE3C24] group-hover:bg-[#EE3C24]/10 transition-all"
          >
            <Play size={18} fill="#EE3C24" stroke="none" className="ml-1" />
          </motion.div>
        </div>

        {/* Timestamp */}
        <div className="absolute bottom-3 right-8 font-sans text-[8px] uppercase tracking-[0.2em] text-[#403F38]">
          2:47
        </div>
      </div>

      <div className="p-5 border-t border-[#1A1A17]">
        <p className="font-sans text-[8px] uppercase tracking-[0.2em] text-[#EE3C24] mb-1">{note}</p>
        <p className="font-sans text-[11px] uppercase tracking-[0.1em] text-[#ECE7D1]">{title}</p>
      </div>
    </div>
  );
}

export default function BehindTheScenesPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroParallax = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <main className="w-full overflow-x-clip bg-[#050505] text-[#ECE7D1] font-sans">

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative h-[75vh] w-full overflow-hidden border-b border-[#1A1A17]">
        <motion.div className="absolute inset-0 w-full h-[130%]" style={{ y: heroParallax }}>
          <div className="absolute inset-0 bg-[#050505]">
            {/* Simulated darkroom atmosphere */}
            <div className="absolute inset-0" style={{ backgroundImage: NOISE_SVG, opacity: 0.15 }} />
            {/* Red safelight glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#EE3C24]/5 blur-[120px]" />
          </div>
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />

        <div className="absolute inset-0 flex flex-col items-start justify-end px-6 md:px-12 pb-16 z-10">
          <Reveal>
            <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-[#EE3C24] flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-[#EE3C24]" />Studio Diary
            </p>
          </Reveal>
          <div className="overflow-hidden">
            <Reveal>
              <h1 className="font-serif italic leading-[0.85] text-[#ECE7D1]" style={{ fontSize: "clamp(3.5rem,10vw,9rem)" }}>
                Behind the
              </h1>
            </Reveal>
          </div>
          <div className="overflow-hidden">
            <Reveal className="delay-100">
              <h1 className="font-serif italic leading-[0.85] text-[#EE3C24]" style={{ fontSize: "clamp(3.5rem,10vw,9rem)" }}>
                <SketchHighlight type="underline" delay={800} color="#EE3C24">Scenes.</SketchHighlight>
              </h1>
            </Reveal>
          </div>
          <Reveal className="delay-200 mt-6">
            <p className="font-sans text-[11px] leading-[1.8] tracking-[0.05em] text-[#969382] max-w-sm">
              The unglamorous truth of building a premium garment brand from scratch. No filters. No PR polish.
            </p>
          </Reveal>
        </div>

        {/* Film frame counter */}
        <div className="absolute top-24 right-6 md:right-12 z-10 flex flex-col items-end gap-1">
          <p className="font-sans text-[8px] uppercase tracking-[0.3em] text-[#403F38]">DRIPDUO STUDIO</p>
          <p className="font-sans text-[8px] uppercase tracking-[0.2em] text-[#403F38]">FW26 · 35MM</p>
        </div>
      </section>

      {/* ── PROCESS TIMELINE BAR ── */}
      <section className="border-b border-[#1A1A17] bg-[#0D0D0B]">
        <div className="overflow-x-auto no-scroll">
          <div className="flex min-w-max border-l border-[#1A1A17]">
            {PROCESS_STEPS.map((p, i) => (
              <div key={p.step} className="border-r border-[#1A1A17] px-8 py-6 shrink-0 group">
                <p className="font-sans text-[8px] uppercase tracking-[0.25em] text-[#EE3C24] mb-2">{p.step}</p>
                <p className="font-sans text-[11px] uppercase tracking-[0.12em] text-[#ECE7D1] mb-1">{p.title}</p>
                <p className="font-sans text-[9px] uppercase tracking-[0.1em] text-[#403F38]">{p.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHAPTERS ── */}
      <section className="border-b border-[#1A1A17] py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <p className="font-sans text-[9px] uppercase tracking-[0.25em] text-[#EE3C24] mb-4 flex items-center gap-2">
              <span className="w-6 h-px bg-[#EE3C24]" />The Making
            </p>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.5rem)] leading-[0.9] text-[#ECE7D1] mb-16">
              Four chapters.<br /><em>One garment.</em>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-l border-[#1A1A17]">
            {CHAPTERS.map((ch, i) => (
              <Reveal key={ch.num} className={`${ch.size} border-r border-b border-[#1A1A17] group`}>
                {/* Image area */}
                <div className={`relative ${ch.aspect} bg-[#0D0D0B] overflow-hidden`}>
                  {/* Simulated photo */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="font-sans text-[8px] uppercase tracking-[0.2em] text-[#403F38] mb-2">{ch.subtitle}</p>
                      <p className="font-sans text-[9px] uppercase tracking-[0.15em] text-[#1A1A17]">[ STUDIO PHOTO ]</p>
                    </div>
                  </div>
                  {/* Grain */}
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: NOISE_SVG }} />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-[#EE3C24]/0 group-hover:bg-[#EE3C24]/5 transition-colors duration-500" />
                  {/* Chapter number watermark */}
                  <div className="absolute top-4 left-6 font-serif text-[5rem] leading-none text-[#1A1A17] select-none pointer-events-none opacity-50">
                    {ch.num}
                  </div>
                </div>
                {/* Caption */}
                <div className="p-6 border-t border-[#1A1A17]">
                  <p className="font-sans text-[9px] uppercase tracking-[0.25em] text-[#EE3C24] mb-2">{ch.num} / {ch.subtitle}</p>
                  <h3 className="font-serif text-xl text-[#ECE7D1] mb-3">{ch.title}</h3>
                  <p className="font-sans text-[11px] leading-[1.8] text-[#6B6A5E]">{ch.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── VIDEO TEASERS ── */}
      <section className="border-b border-[#1A1A17] py-20 md:py-28 bg-[#0D0D0B]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <p className="font-sans text-[9px] uppercase tracking-[0.25em] text-[#EE3C24] mb-4 flex items-center gap-2">
              <span className="w-6 h-px bg-[#EE3C24]" />Studio Footage
            </p>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.5rem)] leading-[0.9] text-[#ECE7D1] mb-16">
              Watch it<br /><em>come together.</em>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-l border-[#1A1A17]">
            {[
              { title: "Mill Visit — Tirupur", note: "Raw material" },
              { title: "Sampling Session", note: "Pattern room" },
              { title: "Shoot Day BTS", note: "Behind the lens" },
            ].map((v, i) => (
              <Reveal key={v.title} className={`delay-${i * 100} border-r border-b border-[#1A1A17]`}>
                <VideoTeaser title={v.title} note={v.note} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── NOTES FROM THE TEAM ── */}
      <section className="border-b border-[#1A1A17] py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <p className="font-sans text-[9px] uppercase tracking-[0.25em] text-[#EE3C24] mb-4 flex items-center gap-2">
              <span className="w-6 h-px bg-[#EE3C24]" />Field Notes
            </p>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.5rem)] leading-[0.9] text-[#ECE7D1] mb-16">
              From the<br /><em>studio floor.</em>
            </h2>
          </Reveal>

          <div className="space-y-0 border-t border-[#1A1A17]">
            {[
              { note: "The 240 GSM blend took 14 trials. The 15th was the one.", date: "Dec 2024" },
              { note: "Sample 6 had perfect shoulder drop. We almost shipped it. Then we checked the hem. Six more weeks.", date: "Feb 2025" },
              { note: "First shoot day. Natural light only. 6am call time. Shot 400 frames to pick 12.", date: "May 2025" },
              { note: "FW26 drop sold out in 4 hours. We had 3 months of inventory. We're rebuilding the supply chain.", date: "Jan 2026" },
            ].map((item, i) => (
              <Reveal key={i}>
                <div className="border-b border-[#1A1A17] py-7 grid grid-cols-[100px_1fr] md:grid-cols-[160px_1fr] gap-4 group">
                  <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#403F38] pt-1">{item.date}</p>
                  <p className="font-sans text-[12px] md:text-[14px] leading-[1.8] text-[#969382] group-hover:text-[#ECE7D1] transition-colors duration-300 italic">
                    "{item.note}"
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="border border-[#1A1A17] p-10 md:p-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
            <Reveal>
              <h2 className="font-serif text-[clamp(2rem,5vw,4.5rem)] leading-[0.9] text-[#ECE7D1]">
                Now that you've<br />seen how it's made —
              </h2>
            </Reveal>
            <Reveal className="delay-200 flex flex-col sm:flex-row gap-4 shrink-0">
              <Link href="/products" className="inline-flex items-center gap-3 bg-[#EE3C24] text-black font-sans text-[11px] font-bold uppercase tracking-[0.2em] px-8 py-4 hover:bg-[#ECE7D1] transition-colors duration-300 whitespace-nowrap">
                Shop the Archive <ArrowRight size={13} strokeWidth={2} />
              </Link>
              <Link href="/about" className="inline-flex items-center gap-3 border border-[#ECE7D1]/30 text-[#ECE7D1] font-sans text-[11px] uppercase tracking-[0.2em] px-8 py-4 hover:border-[#ECE7D1] transition-colors duration-300 whitespace-nowrap">
                Our Story <ArrowRight size={13} strokeWidth={2} />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}