"use client";

import { motion } from "motion/react";


export default function Loading() {
  // Animation varietn for hte saggered letter reveal
  const textContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 1.4, // Starts right as the shapes collapse
      },
    },
  };

  const textItem = {
    hidden: { opacity: 0, y: 10, filter: "blur(5px)", scale: 0.8 },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      scale: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
    },
  };


  return (
    <div className="fixed inset-0 z-9999 bg-[#050505] flex flex-col items-center justify-center overflow-hidden">

      {/* Subtle Background Branding - Fades in dramatically after text reveal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.05, scale: 1 }}
        transition={{ delay: 2.2, duration: 2, ease: "easeOut" }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <span className="text-[15vw] font-black uppercase tracking-tighter text-[#C5A059]">
          DRIPDUO
        </span>
      </motion.div>

      <div className="z-10 flex flex-col items-center justify-center relative h-32">

        {/* Phase 1: Morphing Geometric Shapes */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Outer rotating/morphing frame */}
          <motion.div
            className="absolute w-12 h-12 border border-[#C5A059]"
            animate={{
              rotate: [0, 180, 360],
              scale: [0, 1.2, 0],
              opacity: [0, 1, 0],
              borderRadius: ["0%", "50%", "0%"],
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          {/* Inner solid box that collapses into the center */}
          <motion.div
            className="absolute w-6 h-6 bg-[#C5A059]"
            animate={{
              rotate: [360, 180, 0],
              scale: [0, 1, 0.2, 0],
              opacity: [0, 1, 1, 0],
              borderRadius: ["0%", "0%", "50%"],
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </div>

        {/* Phase 2: DRIPDUO Text Reveal */}
        <motion.div
          variants={textContainer}
          initial="hidden"
          animate="show"
          className="flex space-x-1 sm:space-x-2 z-20 text-[#C5A059] text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-[0.2em]"
        >
          {"DRIPDUO".split("").map((char, index) => (
            <motion.span key={index} variants={textItem} className="inline-block">
              {char}
            </motion.span>
          ))}
        </motion.div>

        {/* Phase 3: Loading Subtitle pulses in */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0, 1, 0.4], y: 0 }}
          transition={{
            y: { delay: 2, duration: 0.5 },
            opacity: { delay: 2, duration: 1.5, repeat: Infinity, repeatType: "reverse" },
          }}
          className="absolute -bottom-16 text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500"
        >
          Loading Archive...
        </motion.div>
      </div>
    </div>
  )
};