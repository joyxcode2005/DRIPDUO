 
 
"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import Image from "next/image";
import { testimonials } from "@/constants";

export default function Home() {
  return (
    <main className="dripduo-landing min-h-screen w-full bg-[#0a0a0a] text-white font-sans selection:bg-[#e63946] selection:text-white overflow-x-hidden">
      
      {/* HERO SECTION */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
        <div className="relative z-10 max-w-7xl w-full flex flex-col items-start gap-6">
          <p className="text-zinc-400 text-sm md:text-base font-mono uppercase tracking-widest mb-4">
            Welcome to the Underground
          </p>
          <h1 className="font-black text-[12vw] md:text-[6rem] lg:text-[8rem] leading-[0.85] tracking-tighter uppercase">
            We Are <br />
            <span className="text-[#e63946]">Unapologetic.</span>
          </h1>
          
          <h2 className="font-extrabold text-[2rem] md:text-[3.5rem] leading-tight tracking-tight mt-8 max-w-4xl">
            Driven by rebellion, fueled by{" "}
            <span className="inline-block relative pencil-underline-target text-white">
              raw style.
              <svg className="absolute -bottom-2 left-0 w-full h-4 pointer-events-none" viewBox="0 0 420 30" fill="none" preserveAspectRatio="none">
                <path className="pencil-underline-path" d="M10 20 Q 120 5 210 20 Q 320 35 410 10" stroke="#e63946" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <br />
            It is time to take the{" "}
            <span className="inline-block relative pencil-circle-target ml-2">
              risk
              <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] pointer-events-none" viewBox="0 0 120 60" fill="none">
                <ellipse className="pencil-circle-ellipse" cx="60" cy="30" rx="54" ry="25" stroke="#e63946" strokeWidth="4" strokeLinecap="round" transform="rotate(-5 60 30)"/>
              </svg>
            </span>.
          </h2>

          {/* THE EXPLORE BUTTON */}
          <Link href="/products" className="mt-10 group relative inline-flex items-center justify-center px-10 py-5 font-black text-white bg-[#e63946] overflow-hidden uppercase tracking-widest text-xl md:text-2xl border-2 border-transparent hover:border-white transition-all duration-300">
            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-[150%] group-hover:h-75"></span>
            <span className="relative group-hover:text-black flex items-center gap-3">
              Explore The Drop <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </span>
          </Link>
        </div>

        {/* Floating Rotating Badge */}
        <div className="absolute bottom-10 right-10 md:bottom-20 md:right-20">
          <div className="relative items-center justify-center w-32 h-32 hidden md:flex">
            <svg className="rotate-svg absolute inset-0 w-full h-full" viewBox="0 0 120 120" fill="none">
              <path id="curve" d="M 60, 60 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" fill="transparent" />
              <text fill="#ffffff" fontSize="11" className="font-mono tracking-widest uppercase font-bold">
                <textPath href="#curve" startOffset="0%">
                  • Dripduo • Worldwide • Est 2026
                </textPath>
              </text>
            </svg>
            <span className="text-[#e63946] font-black text-2xl">D2</span>
          </div>
        </div>
      </section>

      {/* INFINITE MARQUEE */}
      <section className="w-full bg-[#e63946] py-6 border-y-4 border-white overflow-hidden flex items-center">
        <div className="marquee-container text-4xl md:text-6xl font-black text-white tracking-tighter uppercase whitespace-nowrap">
          {/* We duplicate the content to create a seamless infinite scroll */}
          {[...Array(2)].map((_, index) => (
            <div key={index} className="flex gap-12 px-6">
              <span>Creativity</span>
              <span className="text-black stroke-text">Rebellion</span>
              <span>Streetwear</span>
              <span className="text-black stroke-text">Boldness</span>
              <span>Dripduo</span>
            </div>
          ))}
        </div>
      </section>

      {/* PARALLAX LOOKBOOK */}
      <section className="w-full py-32 bg-[#0a0a0a] overflow-hidden relative">
        <h3 className="text-center font-bold text-4xl md:text-6xl mb-16 tracking-tight">THE LOOKBOOK</h3>
        <div className="w-full overflow-hidden">
          <div className="parallax-scroll gap-8 px-4">
            {/* Duplicated array for seamless looping */}
            {[1, 2, 3, 4, 5, 1, 2, 3, 4, 5].map((i, index) => (
              <div key={index} className="shrink-0 w-72 h-96 md:w-96 md:h-120 rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden group relative cursor-pointer">
                <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                { }
                <Image
                  src={`https://images.unsplash.com/photo-1550614000-4b95d4ed141b?w=600&q=80`} 
                  alt="Streetwear Look" 
                  width={1}
                  height={10}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute bottom-6 left-6 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <span className="bg-[#e63946] text-white text-xs font-bold px-3 py-1 uppercase rounded-full">Drop 0{i}</span>
                  <h4 className="text-white font-black text-2xl mt-2">Core Collection</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FLIP CARD FEATURE */}
      <section className="flex flex-col md:flex-row items-center justify-center gap-16 py-32 px-4 bg-zinc-950">
        <div className="max-w-xl">
          <h3 className="text-5xl md:text-7xl font-black uppercase leading-none mb-6">
            Stand <br/><span className="text-transparent bg-clip-text bg-linear-to-r from-[#e63946] to-[#ff9900]">Out.</span>
          </h3>
          <p className="text-zinc-400 text-lg leading-relaxed mb-8">
            Dripduo is not just clothing. It is a statement. Flip the card to reveal our mission, or browse the latest pieces designed to disrupt the mundane.
          </p>
        </div>

        <div className="flip-card">
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <span className="text-4xl font-black text-white mb-2 uppercase tracking-tight">Dripduo</span>
              <div className="h-1 w-12 bg-[#e63946] my-4 rounded-full"></div>
              <span className="text-zinc-400 font-mono text-sm uppercase">Hover to Reveal</span>
            </div>
            <div className="flip-card-back">
              <span className="text-3xl font-black text-white uppercase leading-tight">Defy<br/>Expectations.</span>
              <p className="text-white/90 text-sm mt-6 font-medium">Join the underground. Wear the rebellion.</p>
              <Link href="/products" className="mt-8 bg-white text-[#e63946] font-bold px-6 py-3 rounded-full hover:bg-black hover:text-white transition-colors uppercase text-sm cursor-pointer inline-block">
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-32 bg-zinc-950 px-4">
        <div className="max-w-7xl mx-auto mb-16 text-center">
          <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white">The Cult <span className="text-[#e63946]">Speaks</span></h3>
        </div>
        <AnimatedTestimonials testimonials={testimonials} />
      </section>

      {/* NATIVE SVG LIQUID FOOTER TRANSITION */}
      <section className="relative w-full h-48 md:h-64 mt-20">
        <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path fill="#e63946">
            <animate 
              attributeName="d" 
              dur="6s" 
              repeatCount="indefinite" 
              values="M0,100 Q360,60 720,100 T1440,100 V200 H0 Z;
                      M0,120 Q360,180 720,120 T1440,120 V200 H0 Z;
                      M0,100 Q360,60 720,100 T1440,100 V200 H0 Z" 
            />
          </path>
          <path fill="#0a0a0a" opacity="0.5">
             <animate 
              attributeName="d" 
              dur="8s" 
              repeatCount="indefinite" 
              values="M0,120 Q360,180 720,120 T1440,120 V200 H0 Z;
                      M0,140 Q360,60 720,140 T1440,140 V200 H0 Z;
                      M0,120 Q360,180 720,120 T1440,120 V200 H0 Z" 
            />
          </path>
        </svg>
        <div className="absolute inset-0 flex items-end justify-center pb-8 z-10 pointer-events-none">
          <span className="text-white font-black text-6xl md:text-9xl tracking-tighter opacity-20">DRIPDUO</span>
        </div>
      </section>
    </main>
  );
}