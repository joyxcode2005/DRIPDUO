"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import Reveal from "@/components/Reveal";
import { SketchHighlight } from "@/components/SktechHighlight";
import ClothButton from "@/components/ClothButton";

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`;

const VALUES = [
  {
    num: "01",
    title: "Obsession over compromise.",
    body: "We don't settle for 'good enough'. Every GSM, every stitch, every silhouette is interrogated before it reaches you.",
  },
  {
    num: "02",
    title: "The archive mentality.",
    body: "We build pieces meant to outlast trends. Not fast fashion. Not seasonal filler. Garments you keep for a decade.",
  },
  {
    num: "03",
    title: "Restraint as luxury.",
    body: "No logos screaming. No excess decoration. The fabric does the talking. That's the DRIPDUO signature.",
  },
];

const MILESTONES = [
  { year: "2024", event: "Founded in Kolkata. First 100 units sold in 72 hours." },
  { year: "2025", event: "Launched the 240 GSM heavyweight line. Partnership with premium Indian mills." },
  { year: "2026", event: "FW26 collection. 5000+ members. International shipping begins." },
];

export default function AboutPage() {
  const heroRef = useRef<HTMLElement>(null);
  const coinRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroParallax = useTransform(heroScroll, [0, 1], ["0%", "30%"]);

  return (
    <main className="w-full overflow-x-clip bg-[#050505] text-[#ECE7D1] font-sans">

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative h-[70vh] w-full overflow-hidden border-b border-[#1A1A17]">
        <motion.div className="absolute inset-0 w-full h-[130%]" style={{ y: heroParallax }}>
          <div className="absolute inset-0 bg-[#050505]" />
          <div className="absolute inset-0" style={{ backgroundImage: NOISE_SVG, opacity: 0.04 }} />
          {/* Abstract geometric */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <div className="w-[600px] h-[600px] border border-[#1A1A17] rounded-full absolute opacity-20" />
            <div className="w-[400px] h-[400px] border border-[#EE3C24]/10 rounded-full absolute opacity-30" />
            <div className="w-[200px] h-[200px] border border-[#1A1A17] rounded-full absolute" />
          </div>
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent pointer-events-none" />

        <div className="absolute inset-0 flex flex-col items-start justify-end px-6 md:px-12 pb-16 z-10">
          <Reveal>
            <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-[#EE3C24] flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-[#EE3C24]" />Our Story
            </p>
          </Reveal>
          <div className="overflow-hidden">
            <Reveal>
              <h1 className="font-serif italic leading-[0.85] tracking-[-0.02em] text-[#ECE7D1]" style={{ fontSize: "clamp(4rem,12vw,10rem)" }}>
                Built from
              </h1>
            </Reveal>
          </div>
          <div className="overflow-hidden">
            <Reveal className="delay-100">
              <h1 className="font-serif italic leading-[0.85] tracking-[-0.02em] text-[#EE3C24]" style={{ fontSize: "clamp(4rem,12vw,10rem)" }}>
                obsession.
              </h1>
            </Reveal>
          </div>
        </div>

        {/* Year stamp */}
        <div className="absolute top-24 right-6 md:right-12 z-10">
          <p className="font-sans text-[9px] uppercase tracking-[0.3em] text-[#403F38]">Est. 2024 · Kolkata</p>
        </div>
      </section>

      {/* ── BRAND STATEMENT ── */}
      <section className="border-b border-[#1A1A17] py-20 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <Reveal className="border-r border-[#1A1A17] pr-0 md:pr-16 pb-12 md:pb-0">
              <p className="font-sans text-[9px] uppercase tracking-[0.25em] text-[#EE3C24] mb-8 flex items-center gap-2">
                <span className="w-6 h-px bg-[#EE3C24]" />The Brand
              </p>
              <p className="font-serif text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.2] text-[#ECE7D1] mb-8">
                "We don't make clothes. We make statements you wear for a decade."
              </p>
              <p className="font-sans text-[12px] leading-[1.9] tracking-[0.03em] text-[#969382] mb-6">
                DRIPDUO began as a frustration. Premium heavyweight garments that didn't exist at the price point they should. So we made them.
              </p>
              <p className="font-sans text-[12px] leading-[1.9] tracking-[0.03em] text-[#969382]">
                Starting from Kolkata in 2024, we sourced the mills, figured out the GSM, obsessed over the fit — and built something the Indian streetwear market had never quite seen.
              </p>
            </Reveal>

            <Reveal className="delay-150 pl-0 md:pl-16 pt-12 md:pt-0 flex flex-col justify-between">
              <div className="grid grid-cols-2 gap-0 border border-[#1A1A17]">
                {[
                  { value: "240", label: "GSM Fabric Weight" },
                  { value: "100%", label: "Premium Cotton" },
                  { value: "5K+", label: "Archive Members" },
                  { value: "2024", label: "Founded" },
                ].map((stat) => (
                  <div key={stat.label} className="border-r border-b border-[#1A1A17] p-6 last:border-r-0 even:border-r-0 md:even:border-r">
                    <p className="font-serif text-[2.5rem] leading-none text-[#ECE7D1] mb-2">{stat.value}</p>
                    <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#6B6A5E]">{stat.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 3D COIN — THE BRAND OBJECT ── */}
      <section className="border-b border-[#1A1A17] py-20 md:py-32 bg-[#0D0D0B] overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 items-center">
            {/* Text */}
            <Reveal className="order-2 md:order-1 pt-12 md:pt-0 md:pr-16">
              <p className="font-sans text-[9px] uppercase tracking-[0.25em] text-[#EE3C24] mb-6 flex items-center gap-2">
                <span className="w-6 h-px bg-[#EE3C24]" />The Archive Coin
              </p>
              <h2 className="font-serif text-[clamp(2.5rem,5vw,5rem)] leading-[0.9] text-[#ECE7D1] mb-8">
                The mark of<br /><em className="text-[#EE3C24]">the archive.</em>
              </h2>
              <p className="font-sans text-[12px] leading-[1.9] tracking-[0.03em] text-[#969382] mb-8 max-w-sm">
                Every DRIPDUO piece carries this emblem. It represents our obsession with craft — the coin that only drops when quality is uncompromised.
              </p>
              <p className="font-sans text-[11px] leading-[1.8] tracking-[0.04em] text-[#6B6A5E] italic">
                Drag to spin. Feel the weight.
              </p>
            </Reveal>

            {/* 3D Coin */}
            <Reveal className="order-1 md:order-2 flex items-center justify-center" ref={coinRef}>
              <div className="flex items-center justify-center w-full h-[400px] md:h-[500px]">
                <ClothButton size={420} logoSrc="/images/transLoader.png" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="border-b border-[#1A1A17] py-20 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <p className="font-sans text-[9px] uppercase tracking-[0.25em] text-[#EE3C24] mb-4 flex items-center gap-2">
              <span className="w-6 h-px bg-[#EE3C24]" />Timeline
            </p>
            <h2 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.9] text-[#ECE7D1] mb-16">
              The <em>journey.</em>
            </h2>
          </Reveal>

          <div className="space-y-0">
            {MILESTONES.map((m, i) => (
              <Reveal key={m.year} className={`delay-${i * 100}`}>
                <div className="grid grid-cols-[80px_1fr] md:grid-cols-[120px_1fr] gap-0 border-t border-[#1A1A17] py-8 md:py-10 group">
                  <div className="flex flex-col gap-1">
                    <span className="font-serif text-2xl md:text-3xl text-[#EE3C24]">{m.year}</span>
                  </div>
                  <div className="flex items-center">
                    <p className="font-sans text-[12px] md:text-[13px] leading-[1.8] text-[#969382] group-hover:text-[#ECE7D1] transition-colors duration-300 max-w-2xl">
                      {m.event}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
            <div className="border-t border-[#1A1A17]" />
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="border-b border-[#1A1A17] py-20 md:py-32 bg-[#0D0D0B]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <p className="font-sans text-[9px] uppercase tracking-[0.25em] text-[#EE3C24] mb-4 flex items-center gap-2">
              <span className="w-6 h-px bg-[#EE3C24]" />Our Values
            </p>
            <h2 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.9] text-[#ECE7D1] mb-16">
              What we<br /><em className="text-[#EE3C24]">stand for.</em>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-l border-[#1A1A17]">
            {VALUES.map((v, i) => (
              <Reveal key={v.num} className={`delay-${i * 100} border-r border-b border-[#1A1A17] p-8 md:p-10`}>
                <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-[#EE3C24] block mb-6">{v.num}</span>
                <h3 className="font-serif text-xl md:text-2xl text-[#ECE7D1] leading-[1.2] mb-5">{v.title}</h3>
                <p className="font-sans text-[12px] leading-[1.9] text-[#969382]">{v.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
          <Reveal>
            <h2 className="font-serif text-[clamp(3rem,8vw,8rem)] leading-[0.85] text-[#ECE7D1] mb-10">
              <em className="text-[#EE3C24]">Join</em><br />the Archive.
            </h2>
          </Reveal>
          <Reveal className="delay-150 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="inline-flex items-center gap-3 bg-[#EE3C24] text-black font-sans text-[11px] font-bold uppercase tracking-[0.2em] px-10 py-5 hover:bg-[#ECE7D1] transition-colors duration-300">
              Shop the Collection <ArrowRight size={13} strokeWidth={2} />
            </Link>
            <Link href="/behind-the-scenes" className="inline-flex items-center gap-3 border border-[#ECE7D1] text-[#ECE7D1] font-sans text-[11px] font-bold uppercase tracking-[0.2em] px-10 py-5 hover:bg-[#ECE7D1] hover:text-black transition-colors duration-300">
              Behind the Scenes <ArrowRight size={13} strokeWidth={2} />
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}