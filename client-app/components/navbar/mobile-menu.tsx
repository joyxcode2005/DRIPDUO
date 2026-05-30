"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";

const MODAL_LINKS = [
    { name: "Home", href: "/", sub: "Start" },
    { name: "Products", href: "/products", sub: "Archive" },
    { name: "Profile", href: "/profile", sub: "Account" },
    { name: "About", href: "/about", sub: "Story" },
    { name: "Behind the Scenes", href: "/bts", sub: "Studio" },
];

interface MobileMenuProps {
    menuOpen: boolean;
    setMenuOpen: (open: boolean) => void;
}

export const MobileMenu = ({ menuOpen, setMenuOpen }: MobileMenuProps) => {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
            setMenuOpen(false);
        }
    };

    return (
        <AnimatePresence>
            {menuOpen && (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="fixed inset-0 z-[120] bg-[#050505] pt-32 px-8 md:hidden flex flex-col">
                    <div className="flex flex-col gap-8">
                        {MODAL_LINKS.map((link, i) => (
                            <motion.div key={link.name} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
                                <Link href={link.href} onClick={() => setMenuOpen(false)} className="font-serif text-[2.5rem] leading-none tracking-tight text-[#ECE7D1] hover:text-[#EE3C24] transition-colors">
                                    {link.name}
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-auto mb-16">
                        <div className="flex items-center gap-3 border-b border-white/15 pb-4 focus-within:border-[#ECE7D1]">
                            <Search size={18} className="text-white/30 shrink-0" />
                            <form onSubmit={handleSearch} className="w-full">
                                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search archive..." className="bg-transparent border-none outline-none w-full text-base font-sans tracking-widest text-[#ECE7D1] placeholder:text-white/25" />
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};