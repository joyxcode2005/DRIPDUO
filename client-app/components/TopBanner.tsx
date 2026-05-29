"use client";

import React from "react";
import { motion } from "framer-motion";

export default function TopBanner() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 left-0 right-0 z-50 flex items-center justify-center py-2.5 px-4 bg-black/60 backdrop-blur-md border-b border-white/5"
    >
      <p className="font-sans text-[10px] sm:text-[11px] font-medium tracking-[0.25em] uppercase text-[#ECE7D1]">
        Free Shipping On All Orders Above ₹1999 <span className="mx-2 text-[#EE3C24]">•</span> New Summer Drop Live
      </p>
    </motion.div>
  );
}