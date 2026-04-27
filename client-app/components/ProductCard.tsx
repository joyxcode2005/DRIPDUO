"use client";

import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/CartContext";
import { Heart } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const hoverImage = product.hoverImage || product.image; 

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: "M (240 GSM)", // Defaulting for quick add
    });
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevents the link from redirecting you when you click the heart
    setIsWishlisted(!isWishlisted);
  };

  return (
    <Link 
      href={`/products/${product.id}`} 
      className="group block cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--gray-900)] border border-[var(--gray-800)] group-hover:border-[var(--orange)] transition-colors duration-400">
        
        {/* ── IMAGES ── */}
        <div className="relative w-full h-full">
          <Image
            fill
            src={product.image}
            alt={product.name}
            className={`object-cover object-center transition-opacity duration-700 ease-in-out ${isHovered ? "opacity-0" : "opacity-100"}`}
          />
          <Image
            fill
            src={hoverImage}
            alt={product.name}
            className={`object-cover object-center absolute inset-0 transition-all duration-1000 ease-in-out ${isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"}`}
          />
        </div>

        {/* ── QUICK ADD ── */}
        <div 
          className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[var(--black)] via-[var(--black)]/80 to-transparent transition-all duration-400 z-40 ${isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
        >
          <div 
            onClick={handleQuickAdd}
            className="w-full py-3.5 bg-[var(--beige)] text-[var(--black)] font-bold text-center uppercase hover:bg-[var(--orange)] transition-colors duration-300"
            style={{ fontSize: "10px", letterSpacing: "0.2em" }}
          >
            Quick Add
          </div>
        </div>

        {/* ── WISHLIST LOVE BUTTON ── */}
        <div 
          onClick={toggleWishlist}
          role="button"
          tabIndex={0}
          className={`absolute top-3 right-3 z-50 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 active:scale-75 ${
            isWishlisted 
              ? "bg-[var(--orange)]/20 text-[var(--orange)] border border-[var(--orange)]/50" 
              : "bg-black/40 text-[var(--beige)] border border-white/10 hover:bg-black/60 hover:text-[var(--orange)] hover:border-[var(--orange)]/50"
          }`}
          aria-label="Add to wishlist"
        >
          <Heart 
            className={`w-4 h-4 transition-all duration-400 ${
              isWishlisted ? "fill-[var(--orange)] scale-110 drop-shadow-[0_0_8px_rgba(238,60,36,0.5)]" : "scale-100"
            }`} 
          />
        </div>

      </div>

      <div className="mt-4 flex flex-col gap-1.5">
        <h3 className="label text-[var(--beige)] group-hover:text-[var(--orange)] transition-colors" style={{ fontSize: "11px", lineHeight: 1.4 }}>
          {product.name}
        </h3>
        <p className="label text-[var(--gray-200)]" style={{ fontSize: "10px", letterSpacing: "0.15em" }}>
          ${product.price.toFixed(2)}
        </p>
      </div>
    </Link>
  );
}