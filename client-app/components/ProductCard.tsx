"use client";

import { Product } from "@/types";
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
      size: "M", 
      quantity: 1
    });
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <Link 
      href={`/products/${product.id}`} 
      className="group relative border-r border-b border-(--gray-800) overflow-hidden bg-(--gray-900) block cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 2:3 Editorial Aspect Ratio */}
      <div className="w-full relative" style={{ aspectRatio: "2/3" }}>
        <img 
          src={product.image} 
          alt={product.name} 
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isHovered && product.hoverImage ? "opacity-0" : "opacity-100"}`} 
        />
        {product.hoverImage && (
          <img 
            src={hoverImage} 
            alt={`${product.name} Alt`} 
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isHovered ? "opacity-100" : "opacity-0"}`} 
          />
        )}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/70 to-transparent pointer-events-none" />
        
        {/* Wishlist Button - Minimalist */}
        <button 
          onClick={toggleWishlist}
          className={`absolute top-4 right-4 z-20 p-2 rounded-full transition-colors duration-300 ${
            isWishlisted ? "text-(--orange)" : "text-(--beige) hover:text-(--orange)"
          }`}
        >
          <Heart size={16} strokeWidth={1.5} className={isWishlisted ? "fill-(--orange)" : "fill-transparent"} />
        </button>
      </div>

      {/* Info Overlay */}
      <div className="absolute bottom-6 left-4 right-4 flex justify-between items-end z-10 pointer-events-none">
        <div className="max-w-[70%]">
          <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-(--beige) leading-relaxed">
            {product.name}
          </p>
          <p className="font-sans text-[9px] tracking-[0.15em] uppercase text-(--gray-400) mt-1">
            {product.category || "Apparel"}
          </p>
        </div>
        <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-(--beige)">
          ${product.price}
        </p>
      </div>

      {/* Quick Add Slide-Up */}
      <button
        onClick={handleQuickAdd}
        className="absolute bottom-0 left-0 right-0 bg-(--orange) text-(--black) font-bold text-center py-4 font-sans text-[11px] tracking-[0.15em] uppercase transition-transform duration-300 z-20"
        style={{ transform: isHovered ? "translateY(0)" : "translateY(100%)" }}
      >
        Quick Add
      </button>
    </Link>
  );
}