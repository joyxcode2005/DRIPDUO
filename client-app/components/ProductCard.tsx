"use client";

import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useGlobal } from "@/lib/GlobalContext";
import { Heart } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useGlobal();
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Fallback secondary image logic for the hover effect
  const hoverImage = product.hoverImage || product.image; 

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: "M", // Defaulting to M for quick add, real implementation might need a size selector
    });
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <Link 
      href={`/products/${product.id}`} 
      className="group block cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface border border-transparent group-hover:border-border transition-colors">
        
        {/* Wishlist Heart */}
        <button 
          onClick={toggleWishlist}
          className="absolute top-4 right-4 z-20 p-2 text-foreground/50 hover:text-red-500 transition-colors"
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
        </button>

        {/* Image Swap Animation */}
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
            alt={`${product.name} alternate view`}
            className={`object-cover object-center absolute inset-0 transition-opacity duration-700 ease-in-out transform scale-105 group-hover:scale-100 ${isHovered ? "opacity-100" : "opacity-0"}`}
          />
        </div>
        
        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center p-4 transition-transform duration-500 ease-out group-hover:translate-y-0 z-10 hidden md:flex">
          <button 
            onClick={handleQuickAdd}
            className="w-full bg-background/90 backdrop-blur-md text-foreground py-3 text-xs font-medium uppercase tracking-[0.2em] border border-border hover:bg-foreground hover:text-background transition-colors"
          >
            Quick Add +
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center justify-center space-y-1 text-center">
        <h3 className="text-sm font-medium uppercase tracking-widest text-foreground">
          {product.name}
        </h3>
        <p className="text-xs text-muted font-mono tracking-widest">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </Link>
  );
}