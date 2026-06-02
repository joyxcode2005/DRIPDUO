"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bookmark, Plus, Check } from 'lucide-react';
import Reveal from './Reveal';
import { useCart } from "@/lib/CartContext";

interface LookbookProps {
    id: string;
    name: string;
    price?: number; 
    product_images: {
        url: string;
        is_primary: boolean;
    }[];
}

export default function Lookbook({ product }: { product: LookbookProps }) {
    const { addToCart } = useCart();
    
    // Local states for interactivity
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isAdded, setIsAdded] = useState(false);

    if (!product.product_images?.length) return null;
    
    // Fallback to the first image if no primary is explicitly set
    const primaryImg = product.product_images.find(img => img.is_primary) || product.product_images[0];

    // Wishlist Handler
    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevents the link navigation
        e.stopPropagation(); // Stops event from bubbling to parent elements
        setIsWishlisted(!isWishlisted);
        
        // Note: You can trigger your global Wishlist Context/API call here later
    };

    // Quick Add Handler
    const handleQuickAdd = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        try {
            await addToCart({
                productId: product.id,
                variantId: `${product.id}-default`,
                name: product.name,
                price: product.price || 0, // Fallback if price isn't passed
                image: primaryImg.url,
                size: "M", // Default quick-add size
                gsm: "240",
                quantity: 1,
                stock: 10,
            });
            setIsAdded(true);
            setTimeout(() => setIsAdded(false), 2000);
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

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
                        <button 
                            onClick={handleWishlist}
                            className={`transition-colors ml-auto z-30 ${isWishlisted ? 'text-[#EE3C24]' : 'text-zinc-400 hover:text-white'}`}
                        >
                            <Bookmark size={18} strokeWidth={1.5} fill={isWishlisted ? "#EE3C24" : "none"} />
                        </button>
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
                                <button 
                                    onClick={handleQuickAdd}
                                    className={`p-2 border rounded-full transition-all z-30 ${
                                        isAdded 
                                            ? "text-[#050505] bg-[#ECE7D1] border-[#ECE7D1]" 
                                            : "border-zinc-600 text-zinc-400 bg-[#0a0a0a] hover:text-white hover:border-white"
                                    }`}
                                >
                                    {isAdded ? <Check size={16} strokeWidth={2} /> : <Plus size={16} strokeWidth={2} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </Reveal>
    );
}