"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "@/components/Reveal";
import { SketchHighlight } from "@/components/ui/sketch-highlight";

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`;

const CHAPTERS = [
  {
    num: "01",
    title: "The Fabric Selection",
    subtitle: "Sourcing the weight",
    desc: "Every piece begins at the mill. We test dozens of cotton blends before settling on the one that passes our hand-feel test. If it doesn't feel right at 240 GSM, we start over.",
    img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop",
    size: "md:col-span-2 lg:col-span-2",
  },
  {
    num: "02",
    title: "The First Sample",
    subtitle: "Pattern to prototype",
    desc: "The first sample is always wrong. That's the point. We pull it apart, rebuild the shoulder, reset the hem drop. Usually takes six rounds.",
    img: "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=800&auto=format&fit=crop",
    size: "md:col-span-1 lg:col-span-1",
  },
  {
    num: "03",
    title: "Studio Day",
    subtitle: "Capturing the piece",
    desc: "We shoot everything ourselves. Natural light. No excessive post. The garment needs to speak before the edit does.",
    img: "https://images.unsplash.com/photo-1550614000-4b95d4ebf6eb?q=80&w=800&auto=format&fit=crop",
    size: "md:col-span-1 lg:col-span-1",
  },
  {
    num: "04",
    title: "Quality Control",
    subtitle: "Before it ships",
    desc: "Every piece is inspected by hand. Stitching tension checked. Measurements compared to spec. If it's off by more than 0.5cm, it doesn't ship.",
    img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200&auto=format&fit=crop",
    size: "md:col-span-2 lg:col-span-2",
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

// Rebuilt Video Teaser Component with Glassmorphism
function VideoTeaser({ title, note, img }: { title: string; note: string; img: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div
      className="relative glass-panel rounded-[2rem] group cursor-pointer overflow-hidden p-2 shadow-xl flex flex-col h-full"
      onClick={() => setPlaying(!playing)}
    >
      <div className="relative w-full aspect-video rounded-[1.5rem] overflow-hidden bg-black/40">
        <img 
            src={img} 
            alt={title} 
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-1000 grayscale hover:grayscale-0"
        />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: NOISE_SVG }} />

        {/* Center play button */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-14 h-14 md:w-16 md:h-16 glass-panel rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(255,255,255,0.2)] group-hover:shadow-[0_0_40px_rgba(238,60,36,0.4)] group-hover:text-[#EE3C24] transition-all"
          >
            <Play size={20} fill="currentColor" className="ml-1" />
          </motion.div>
        </div>

        {/* Timestamp */}
        <div className="absolute bottom-4 right-4 glass-panel px-3 py-1.5 rounded-full font-sans text-[9px] uppercase tracking-[0.2em] text-[#ECE7D1]">
          2:47
        </div>
      </div>

      <div className="p-6 md:p-8 flex flex-col mt-auto">
        <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#EE3C24] mb-2">{note}</p>
        <p className="font-serif text-2xl md:text-3xl text-[#ECE7D1]">{title}</p>
      </div>
    </div>
  );
}

export default function BehindTheScenesPage() {
  return (
    <main className="min-h-screen text-[#ECE7D1] font-sans relative z-10 pt-24 md:pt-32 pb-20 w-full overflow-x-hidden">
      
      {/* ── BACKGROUND NOISE ── */}
      <div className="fixed inset-0 pointer-events-none mix-blend-overlay z-0 opacity-30 w-full" style={{ backgroundImage: NOISE_SVG }} />

      <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 relative z-10">
        
        {/* ── BREADCRUMBS & LOCATION ── */}
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <Link href="/" className="inline-flex items-center gap-3 font-sans text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors glass-panel px-6 py-3 rounded-full hover:bg-white/10 w-fit shadow-md">
              <ArrowLeft size={14} strokeWidth={1.5} /> Back to Home
            </Link>
            
            <div className="flex flex-col items-end gap-1">
                <p className="font-sans text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-[#EE3C24]">Barrackpore Studio</p>
                <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-white/40">FW26 · 35MM</p>
            </div>
          </div>
        </Reveal>

        {/* ── HERO ── */}
        <Reveal>
          <div className="mb-16 md:mb-24 text-center max-w-4xl mx-auto flex flex-col items-center">
            <p className="font-sans text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-[#EE3C24] flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-[#EE3C24]" />Studio Diary<span className="w-8 h-px bg-[#EE3C24]" />
            </p>
            <h1 className="font-serif italic leading-[0.9] tracking-tight text-[#ECE7D1] drop-shadow-2xl mb-8" style={{ fontSize: "clamp(3.5rem,10vw,9rem)" }}>
              Behind the <br/><em><SketchHighlight type="underline" delay={300} color="#EE3C24">Scenes.</SketchHighlight></em>
            </h1>
            <p className="font-sans text-[13px] md:text-[15px] leading-[1.8] text-white/60 max-w-lg mx-auto">
              The unglamorous truth of building a premium garment brand from scratch. No filters. No PR polish. This is the Barrackpore studio.
            </p>
          </div>
        </Reveal>

        {/* ── PROCESS TIMELINE BAR ── */}
        <Reveal>
            <section className="mb-20 md:mb-32">
                <div className="overflow-x-auto no-scroll pb-6">
                <div className="flex gap-4 md:gap-6 min-w-max">
                    {PROCESS_STEPS.map((p, i) => (
                    <div key={p.step} className="glass-panel glass-panel-hover p-6 md:p-8 rounded-[2rem] shrink-0 w-[240px] md:w-[280px] shadow-lg transition-transform hover:-translate-y-2">
                        <p className="font-sans text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-[#EE3C24] mb-4">{p.step}</p>
                        <p className="font-serif text-2xl md:text-3xl text-[#ECE7D1] mb-2">{p.title}</p>
                        <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-white/50">{p.detail}</p>
                    </div>
                    ))}
                </div>
                </div>
            </section>
        </Reveal>

        {/* ── CHAPTERS ── */}
        <section className="py-10 md:py-20 mb-20">
          <Reveal>
            <div className="flex items-center gap-4 mb-10 md:mb-16">
              <span className="w-12 h-px bg-[#EE3C24]" />
              <span className="font-sans text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-[#EE3C24]">The Making</span>
            </div>
            <h2 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.9] text-[#ECE7D1] mb-12 md:mb-20">
              Four chapters.<br /><em>One garment.</em>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {CHAPTERS.map((ch, i) => (
              <Reveal key={ch.num} className={`${ch.size} h-full`}>
                <div className="glass-panel p-2 md:p-3 rounded-[2.5rem] md:rounded-[3rem] w-full h-full shadow-2xl flex flex-col group">
                    <div className="relative w-full aspect-square md:aspect-[4/3] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-black/40 mb-6">
                        <img src={ch.img} alt={ch.title} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-[2s] grayscale group-hover:grayscale-0" />
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
                        
                        <div className="absolute top-6 left-6 font-serif italic text-6xl text-white/20 select-none pointer-events-none">
                            {ch.num}
                        </div>
                    </div>
                    
                    <div className="p-6 md:p-8 pt-0 flex flex-col flex-1">
                        <p className="font-sans text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-[#EE3C24] mb-3">{ch.subtitle}</p>
                        <h3 className="font-serif text-3xl md:text-4xl text-[#ECE7D1] mb-4">{ch.title}</h3>
                        <p className="font-sans text-[13px] md:text-[14px] leading-[1.8] text-white/60 mt-auto">{ch.desc}</p>
                    </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── VIDEO TEASERS ── */}
        <section className="py-10 md:py-20 mb-20">
          <Reveal>
            <div className="flex items-center gap-4 mb-10 md:mb-16">
              <span className="w-12 h-px bg-[#EE3C24]" />
              <span className="font-sans text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-[#EE3C24]">Studio Footage</span>
            </div>
            <h2 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.9] text-[#ECE7D1] mb-12 md:mb-20">
              Watch it<br /><em>come together.</em>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { title: "Mill Visit — Tirupur", note: "Raw material", img: "https://images.unsplash.com/photo-1558024920-b41e1887dc32?q=80&w=800&auto=format&fit=crop" },
              { title: "Sampling Session", note: "Pattern room", img: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop" },
              { title: "Shoot Day BTS", note: "Behind the lens", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop" },
            ].map((v, i) => (
              <Reveal key={v.title} className={`delay-${i * 100} h-full`}>
                <VideoTeaser title={v.title} note={v.note} img={v.img} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── NOTES FROM THE TEAM ── */}
        <section className="py-10 md:py-20 mb-20">
          <Reveal>
            <div className="flex items-center gap-4 mb-10 md:mb-16">
              <span className="w-12 h-px bg-[#EE3C24]" />
              <span className="font-sans text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-[#EE3C24]">Field Notes</span>
            </div>
            <h2 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.9] text-[#ECE7D1] mb-12 md:mb-20">
              From the<br /><em>studio floor.</em>
            </h2>
          </Reveal>

          <Reveal>
              <div className="glass-panel rounded-[3rem] p-8 md:p-16 lg:p-24 shadow-2xl">
                <div className="space-y-4 md:space-y-6">
                    {[
                    { note: "The 240 GSM blend took 14 trials. The 15th was the one.", date: "Dec 2024" },
                    { note: "Sample 6 had perfect shoulder drop. We almost shipped it. Then we checked the hem. Six more weeks.", date: "Feb 2025" },
                    { note: "First shoot day. Natural light only. 6am call time. Shot 400 frames to pick 12.", date: "May 2025" },
                    { note: "FW26 drop sold out in 4 hours. We had 3 months of inventory. We're rebuilding the supply chain.", date: "Jan 2026" },
                    ].map((item, i) => (
                    <div key={i} className="glass-panel p-6 md:p-10 rounded-[2rem] flex flex-col md:flex-row md:items-center gap-4 md:gap-10 group transition-all duration-300 hover:bg-white/5">
                        <p className="font-sans text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-[#EE3C24] shrink-0 w-32">{item.date}</p>
                        <p className="font-serif text-xl md:text-2xl leading-[1.6] text-white/70 group-hover:text-[#ECE7D1] transition-colors duration-300 italic">
                        "{item.note}"
                        </p>
                    </div>
                    ))}
                </div>
              </div>
          </Reveal>
        </section>

        {/* ── CTA ── */}
        <section className="py-10 md:py-20">
            <Reveal>
                <div className="glass-panel p-10 md:p-20 rounded-[3rem] md:rounded-[4rem] flex flex-col xl:flex-row items-start xl:items-center justify-between gap-10 shadow-2xl bg-linear-to-br from-black/40 to-transparent">
                    <h2 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.9] text-[#ECE7D1] max-w-3xl">
                        Now that you've<br />seen how it's made —
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full xl:w-auto">
                        <Link href="/products" className="inline-flex items-center justify-center gap-3 bg-[#ECE7D1] text-black font-sans text-[11px] md:text-[12px] font-bold uppercase tracking-[0.2em] px-10 py-5 rounded-full hover:bg-[#EE3C24] hover:text-white transition-colors duration-300 shadow-xl w-full sm:w-auto">
                            Shop the Archive <ArrowRight size={14} strokeWidth={2} />
                        </Link>
                        <Link href="/about" className="inline-flex items-center justify-center gap-3 glass-panel text-[#ECE7D1] font-sans text-[11px] md:text-[12px] uppercase tracking-[0.2em] px-10 py-5 rounded-full hover:bg-white/10 transition-colors duration-300 shadow-lg w-full sm:w-auto">
                            Our Story <ArrowRight size={14} strokeWidth={2} />
                        </Link>
                    </div>
                </div>
            </Reveal>
        </section>
      </div>
    </main>
  );
}