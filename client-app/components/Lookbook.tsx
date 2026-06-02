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
    
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isAdded, setIsAdded] = useState(false);

    if (!product.product_images?.length) return null;
    
    const primaryImg = product.product_images.find(img => img.is_primary) || product.product_images[0];

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault(); 
        e.stopPropagation(); 
        setIsWishlisted(!isWishlisted);
    };

    const handleQuickAdd = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        try {
            await addToCart({
                productId: product.id,
                variantId: `${product.id}-default`,
                name: product.name,
                price: product.price || 0, 
                image: primaryImg.url,
                size: "M", 
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
                // Updated widths for massive screens
                className="group flex flex-col glass-panel glass-panel-hover rounded-3xl overflow-hidden w-[85vw] sm:w-[45vw] md:w-[35vw] lg:w-[28vw] xl:w-[22vw] 2xl:w-[18vw] aspect-3/4 relative cursor-pointer shadow-xl"
            >
                <div className="relative w-full h-full flex items-center justify-center bg-transparent p-2">
                    <div className="relative w-full h-full rounded-2xl overflow-hidden">
                        <Image
                            src={primaryImg.url}
                            alt={product.name}
                            fill
                            className="object-cover opacity-80 group-hover:opacity-100 transition-transform duration-[2s] group-hover:scale-105"
                        />

                        <div className="absolute top-6 left-6 w-full flex justify-between pr-12 z-20">
                            <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#ECE7D1] glass-panel px-4 py-2 rounded-full shadow-lg">
                                FW26 Look
                            </span>
                            <button 
                                onClick={handleWishlist}
                                className={`glass-button p-2.5 rounded-full ml-auto z-30 transition-colors shadow-lg ${isWishlisted ? 'text-[#EE3C24] border-[#EE3C24]/30' : 'text-white/60 hover:text-white'}`}
                            >
                                <Bookmark size={18} strokeWidth={1.5} fill={isWishlisted ? "#EE3C24" : "none"} />
                            </button>
                        </div>

                        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent z-10" />

                        <div className="absolute inset-0 z-20 flex flex-col justify-end p-8">
                            <div className="flex flex-col gap-3">
                                <h3 className="font-serif text-2xl md:text-3xl text-[#ECE7D1] leading-tight drop-shadow-xl truncate">
                                    {product.name}
                                </h3>
                                
                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center gap-3 opacity-90">
                                        <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#EE3C24] drop-shadow-md">Explore Look</span>
                                        <div className="w-8 h-px bg-[#ECE7D1]/30" />
                                    </div>
                                    <button 
                                        onClick={handleQuickAdd}
                                        className={`p-3 rounded-full transition-all z-30 shadow-lg ${
                                            isAdded 
                                                ? "bg-[#ECE7D1] text-[#050505] shadow-[0_0_20px_rgba(236,231,209,0.6)]" 
                                                : "glass-button text-white/80 hover:text-white hover:bg-white/20"
                                        }`}
                                    >
                                        {isAdded ? <Check size={18} strokeWidth={2} /> : <Plus size={18} strokeWidth={2} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </Reveal>
    );
}