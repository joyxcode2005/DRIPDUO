"use client";

import React, { useState, useEffect, useRef } from "react";

interface SketchHighlightProps {
  children: React.ReactNode;
  type?: "circle" | "underline" | "strike";
  color?: string;
  strokeWidth?: number;
  delay?: number;
}

export const SketchHighlight = ({
  children,
  type = "underline",
  color = "var(--orange)",
  strokeWidth = 2,
  delay = 100,
}: SketchHighlightProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const paths = {
    underline: "M 2 40 Q 50 48 98 38",
    strike: "M 2 25 Q 50 20 98 28",
    circle: "M 10 25 C 10 5, 90 5, 90 25 C 90 45, 10 45, 10 25 C 10 15, 30 5, 50 5",
  };

  return (
    <span ref={ref} className="relative inline-block whitespace-nowrap">
      <span className="relative z-10">{children}</span>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        viewBox="0 0 100 50"
        preserveAspectRatio="none"
        style={{ overflow: "visible" }}
      >
        <defs>
          <filter id={`pencil-sketch-${type}`} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <path
          d={paths[type]}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          filter={`url(#pencil-sketch-${type})`}
          style={{
            strokeDasharray: 300,
            strokeDashoffset: isVisible ? 0 : 300,
            transition: `stroke-dashoffset 0.9s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
          }}
        />
      </svg>
    </span>
  );
};