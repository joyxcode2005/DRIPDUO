"use client";

import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LayoutTextFlipProps {
  text?: string;
  words: string[];
  className?: string;
  duration?: number;
}

export const LayoutTextFlip = ({
  text,
  words,
  className,
  duration = 2500,
}: LayoutTextFlipProps) => {
  const [currentWord, setCurrentWord] = useState(words[0]);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const startAnimation = useCallback(() => {
    const nextWord = words[(words.indexOf(currentWord) + 1) % words.length];
    setCurrentWord(nextWord);
    setIsAnimating(true);
  }, [currentWord, words]);

  useEffect(() => {
    if (!isAnimating) {
      const timer = setTimeout(() => {
        startAnimation();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, startAnimation, duration]);

  return (
    <div className={cn("inline-flex flex-wrap items-center gap-x-2", className)}>
      {text && <span>{text}</span>}
      <AnimatePresence
        onExitComplete={() => setIsAnimating(false)}
        mode="wait"
      >
        <motion.span
          key={currentWord}
          initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -15, filter: "blur(8px)" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative inline-block text-[#EE3C24] italic"
        >
          {currentWord}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};