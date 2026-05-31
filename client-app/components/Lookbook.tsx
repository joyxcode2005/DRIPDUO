"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bookmark, Plus } from 'lucide-react';
import Reveal from './Reveal';

interface LookbookProps {
    id: string;
    name: string;
    product_images: {
        url: string;
        is_primary: boolean;
    }[];
}

export default function Lookbook({ product }: { product: LookbookProps }) {
    if (!product.product_images?.length) return null;
    
    // Fallback to the first image if no primary is explicitly set
    const primaryImg = product.product_images.find(img => img.is_primary) || product.product_images[0];

    return (
        <Reveal className="shrink-0 h-full block" threshold={0.12}>
            <Link
                href={`/products/${product.id}`}
                className="group flex flex-col border border-[#1A1A17] rounded-xl overflow-hidden bg-[#0a0a0a] hover:border-[#403F38] transition-colors w-[85vw] sm:w-[45vw] md:w-[30vw] lg:w-[22vw] aspect-3/4 relative cursor-pointer"
            >
                {/* ── Image & Background Area ── */}
                <div className="relative w-full h-full flex items-center justify-center bg-[#0f0f0f]">
                    <Image
                        src={primaryImg.url}
                        alt={product.name}
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 transition-transform duration-[2s] group-hover:scale-105"
                    />
                    
                    {/* Fallback watermark behind the image */}
                    <span className="absolute text-zinc-800/40 font-bold tracking-widest text-lg z-[-1] select-none">
                        DRIPDUO
                    </span>

                    {/* ── Top Badges (Product Card Style) ── */}
                    <div className="absolute top-4 left-4 w-full flex justify-between pr-8 z-20">
                        <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#ECE7D1] bg-black/60 px-3 py-1 rounded-sm backdrop-blur-md border border-white/10">
                            FW26 Look
                        </span>
                        <div className="text-zinc-400 hover:text-white transition-colors ml-auto">
                            <Bookmark size={18} strokeWidth={1.5} />
                        </div>
                    </div>

                    {/* ── Gradient Overlay ── */}
                    {/* Always visible on mobile, hover-only on desktop */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/40 md:via-black/30 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 z-10" />

                    {/* ── Hover / Touch Details Area ── */}
                    {/* Always visible on mobile, hover-only on desktop */}
                    <div className="absolute inset-0 z-20 flex flex-col justify-end p-5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500">
                        <div className="translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 flex flex-col gap-2">
                            <h3 className="font-serif text-xl md:text-2xl text-[#ECE7D1] leading-tight drop-shadow-md truncate">
                                {product.name}
                            </h3>
                            
                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2">
                                    <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-[#EE3C24]">Explore Look</span>
                                    <div className="w-6 h-px bg-[#ECE7D1]/20" />
                                </div>
                                <div className="p-2 border border-zinc-600 rounded-full text-zinc-400 bg-[#0a0a0a] group-hover:text-white group-hover:border-white transition-all">
                                    <Plus size={16} strokeWidth={2} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </Reveal>
    );
}