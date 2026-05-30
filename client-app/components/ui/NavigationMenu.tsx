"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

const transition = { type: "spring" as const, mass: 0.5, damping: 11.5, stiffness: 100 };

export const Menu = ({ setActive, children }: { setActive: (item: string | null) => void; children: React.ReactNode; }) => (
    <nav onMouseLeave={() => setActive(null)} className="flex items-center justify-center space-x-8 px-8 py-2">
        {children}
    </nav>
);

export const MenuItem = ({ setActive, active, item, children }: { setActive: (item: string) => void; active: string | null; item: string; children?: React.ReactNode; }) => (
    <div onMouseEnter={() => setActive(item)} className="relative">
        <motion.p transition={{ duration: 0.3 }} className="cursor-pointer font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#ECE7D1] hover:text-[#EE3C24] transition-colors">
            {item}
        </motion.p>
        {active !== null && (
            <motion.div initial={{ opacity: 0, scale: 0.85, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={transition}>
                {active === item && children && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 pt-6">
                        <motion.div
                            transition={transition}
                            layoutId="active"
                            className="bg-[#050505]/80 backdrop-blur-2xl rounded-2xl overflow-hidden border border-white/5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]"
                        >
                            <motion.div layout className="w-max h-full p-6">{children}</motion.div>
                        </motion.div>
                    </div>
                )}
            </motion.div>
        )}
    </div>
);

export const HoveredLink = ({ children, ...rest }: any) => (
    <Link {...rest} className="font-sans text-[12px] tracking-[0.15em] uppercase text-[#ECE7D1]/60 hover:text-[#EE3C24] transition-colors block py-1.5">
        {children}
    </Link>
);

export const ProductItem = ({ title, description, href, src }: { title: string; description: string; href: string; src: string; }) => (
    <Link href={href} className="flex space-x-5 group p-2 -m-2 rounded-xl hover:bg-white/[0.03] transition-all duration-300">
        <div className="relative w-[72px] h-[96px] rounded-sm overflow-hidden shrink-0 bg-[#111] border border-white/5">
            <Image src={src} fill alt={title} className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
        </div>
        <div className="flex flex-col justify-center">
            <h4 className="font-serif text-base text-[#ECE7D1] mb-1.5 group-hover:text-[#EE3C24] transition-colors">{title}</h4>
            <p className="font-sans text-[11px] text-[#ECE7D1]/50 tracking-wider leading-relaxed max-w-[180px]">{description}</p>
        </div>
    </Link>
);