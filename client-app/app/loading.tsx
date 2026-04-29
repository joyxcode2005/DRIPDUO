"use client";

import { motion } from "motion/react";

export default function Loading() {
  const textContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 1.4,
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
    <div className="fixed inset-0 z-[9999] bg-(--black) flex flex-col items-center justify-center overflow-hidden">
      {/* Subtle Background Branding */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.05, scale: 1 }}
        transition={{ delay: 2.2, duration: 2, ease: "easeOut" }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <span className="text-[15vw] font-serif text-(--beige) whitespace-nowrap">
          ORIGINS FW26
        </span>
      </motion.div>

      <div className="relative z-10 flex flex-col items-center justify-center h-screen space-y-12">
        {/* Phase 1: Minimalist Geometry */}
        <div className="relative flex items-center justify-center h-24 w-24">
          <motion.div
            className="absolute border border-(--gray-600) w-20 h-20"
            animate={{
              rotate: [0, 90, 180],
              scale: [1, 1.2, 0],
              opacity: [1, 1, 0],
            }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute border border-(--orange) w-14 h-14"
            animate={{
              rotate: [0, -90, -180],
              scale: [1, 1.5, 0],
              opacity: [1, 1, 0],
            }}
            transition={{ duration: 1.6, ease: "easeInOut", delay: 0.2 }}
          />
          <motion.div
            className="absolute w-6 h-6 bg-(--orange)"
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
          className="flex space-x-1 sm:space-x-2 z-20 text-(--beige) text-3xl sm:text-4xl md:text-5xl font-serif uppercase tracking-[0.2em]"
        >
          {"DRIPDUO".split("").map((char, index) => (
            <motion.span key={index} variants={textItem} className="inline-block">
              {char}
            </motion.span>
          ))}
        </motion.div>

        {/* Phase 3: Subtitle pulse */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0, 1, 0.6], y: 0 }}
          transition={{
            y: { delay: 2, duration: 0.5 },
            opacity: { delay: 2, duration: 1.5, ease: "easeOut" },
          }}
          className="absolute bottom-20 font-sans text-[10px] tracking-[0.3em] uppercase text-(--gray-400)"
        >
          Curating Collection
        </motion.div>
      </div>
    </div>
  );
}