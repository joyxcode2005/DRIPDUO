import React from "react";

interface BadgeProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  active?: boolean;
  variant?: "default" | "outline" | "soldOut";
}

export function Badge({ children, active, variant = "outline", className = "", ...props }: BadgeProps) {
  const baseStyle = "inline-flex items-center justify-center rounded-full text-[11px] uppercase tracking-wider transition-colors px-3 py-1.5";
  const variants = {
    default: "bg-white text-black font-semibold",
    outline: active 
      ? "border border-white text-white" 
      : "border border-zinc-800 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200",
    soldOut: "border border-red-700 text-red-700 font-semibold bg-red-100/20" // New variant for Sold Out
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

