"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

type LinkPreviewProps = {
  children: React.ReactNode;
  url: string;
  className?: string;
  width?: number;
  height?: number;
  quality?: number;
  isStatic?: boolean;
  imageSrc?: string;
};

export const LinkPreview = ({
  children,
  url,
  className,
  width = 280,
  height = 180,
  quality = 85,
  isStatic = false,
  imageSrc = "",
}: LinkPreviewProps) => {
  const [isOpen, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      setIsMounted(true);
    });

    return () => window.cancelAnimationFrame(rafId);
  }, []);

  const springConfig = { stiffness: 100, damping: 15 };
  const x = useMotionValue(0);
  const translateX = useSpring(x, springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const targetRect = event.currentTarget.getBoundingClientRect();
    const eventOffsetX = event.clientX - targetRect.left;
    const offsetFromCenter = (eventOffsetX - targetRect.width / 2) / 2;
    x.set(offsetFromCenter);
  };

  const src = isStatic ? imageSrc : imageSrc;

  return (
    <div className="relative inline-block">
      {isMounted && isStatic && imageSrc ? (
        <div className="hidden">
          <Image src={imageSrc} width={width} height={height} quality={quality} alt="hidden image" priority />
        </div>
      ) : null}

      <Link
        href={url}
        className={cn("relative z-10 inline-block", className)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onMouseMove={handleMouseMove}
      >
        {children}
      </Link>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 20 } }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            style={{ x: translateX }}
            className="hidden md:block absolute bottom-full left-1/2 -translate-x-1/2 mb-4 z-100 pointer-events-none"
          >
            <div className="p-1.5 bg-[#050505]/85 backdrop-blur-2xl border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] rounded-2xl overflow-hidden">
              <div 
                className="relative rounded-xl overflow-hidden bg-[#111]" 
                style={{ width: width, height: height }}
              >
                {src && (
                  <Image
                    src={src}
                    fill
                    className="object-cover"
                    alt="preview image"
                    priority
                  />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};