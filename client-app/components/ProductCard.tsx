"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { ShoppingBag, Heart } from "lucide-react";

export interface SupabaseCategory {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
}

export interface SupabaseProductImage {
  id: string;
  url: string;
  is_primary: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  product_type_id: string;
  product_type?: { name: string };
  price: number;
  discount: number;
  final_price: number;
  stock: number;
  total_stock: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  product_categories: { categories: SupabaseCategory }[];
  product_images: SupabaseProductImage[];
}

export default function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const imageUrl = product.product_images?.[0]?.url || "";
  const hoverImage = product.product_images?.[1]?.url || imageUrl;
  const categoryName = product.product_categories?.[0]?.categories?.name || "Apparel";
  const productTypeName = product.product_type?.name || null;

  const discountPercent =
    product.discount > 0
      ? Math.round(((product.price - product.final_price) / product.price) * 100)
      : 0;
  const savings = product.price - product.final_price;

  const stockStatus =
    product.total_stock === 0
      ? { label: "Sold Out", color: "text-red-400" }
      : product.total_stock <= 5
        ? { label: `${product.total_stock} left`, color: "text-amber-400" }
        : { label: "In Stock", color: "text-emerald-500" };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.total_stock === 0 || addedToCart) return;
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative border-r border-b border-[#1a1a17] overflow-hidden bg-[#0d0d0b] block cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Image ── */}
      <div className="w-full relative" style={{ aspectRatio: "2/3" }}>
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className={`object-cover transition-opacity duration-700 ${isHovered && hoverImage !== imageUrl ? "opacity-0" : "opacity-100"}`}
          />
        )}
        {hoverImage !== imageUrl && (
          <Image
            src={hoverImage}
            alt={`${product.name} alt`}
            fill
            className={`object-cover transition-opacity duration-700 ${isHovered ? "opacity-100" : "opacity-0"}`}
          />
        )}

        {/* Gradient */}
        <div
          className="absolute inset-0 pointer-events-none z-[5]"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.1) 55%, transparent 100%)",
          }}
        />

        {/* Top tags */}
        <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1.5">
          <span className="font-sans text-[8px] tracking-[0.12em] uppercase px-2 py-1 text-[#ECE7D1] backdrop-blur-sm bg-black/50 border border-white/10">
            {categoryName}
          </span>
          {productTypeName && (
            <span className="font-sans text-[8px] tracking-[0.12em] uppercase px-2 py-1 text-[#EE3C24] backdrop-blur-sm bg-[#EE3C24]/10 border border-[#EE3C24]/25">
              {productTypeName}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="font-sans text-[8px] tracking-[0.1em] uppercase px-2 py-1 text-black bg-[#EE3C24] font-bold">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist — always visible on mobile, hover on desktop */}
        <button
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 hover:border-[#EE3C24] hover:scale-110"
          onClick={(e) => { e.preventDefault(); setWishlisted((w) => !w); }}
        >
          <Heart
            size={13}
            strokeWidth={2}
            className={`transition-all duration-200 ${wishlisted ? "fill-[#EE3C24] text-[#EE3C24]" : "text-white/70"}`}
          />
        </button>

        {/* Stock indicator */}
        <div className={`absolute z-10 flex items-center gap-1.5 font-sans text-[8px] tracking-[0.12em] uppercase transition-all duration-300 ${stockStatus.color}`}
          style={{ bottom: "4.5rem", left: "0.75rem" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {stockStatus.label}
        </div>

        {/* Product info overlay */}
        <div className="absolute left-3 right-3 z-10 flex justify-between items-end" style={{ bottom: "0.875rem" }}>
          <div className="max-w-[65%]">
            <p className="font-sans text-[10px] tracking-[0.14em] uppercase text-[#ECE7D1] leading-relaxed line-clamp-2 font-medium">
              {product.name}
            </p>
            <p className="font-sans text-[8px] tracking-[0.12em] uppercase text-[#6B6A5E] mt-1">
              {categoryName}{productTypeName && ` · ${productTypeName}`}
            </p>
          </div>
          <div className="text-right flex flex-col items-end">
            {product.discount > 0 ? (
              <>
                <p className="font-sans text-[8px] tracking-widest uppercase text-[#555450] line-through">₹{product.price}</p>
                <p className="font-sans text-[11px] tracking-[0.14em] uppercase text-[#ECE7D1] font-semibold">₹{product.final_price}</p>
                <p className="font-sans text-[8px] tracking-widest uppercase text-[#EE3C24] mt-0.5">–₹{savings}</p>
              </>
            ) : (
              <p className="font-sans text-[11px] tracking-[0.14em] uppercase text-[#ECE7D1] font-semibold">₹{product.final_price}</p>
            )}
          </div>
        </div>

        {/* Quick Add bar — slides up on hover */}
        <div
          className={`absolute inset-x-0 z-30 transition-all duration-300 ease-out ${
            isHovered ? "bottom-0 opacity-100" : "-bottom-14 opacity-0"
          }`}
        >
          <button
            onClick={handleQuickAdd}
            disabled={product.total_stock === 0}
            className={`w-full py-4 flex items-center justify-center gap-3 font-sans text-[10px] font-bold tracking-[0.18em] uppercase transition-colors duration-300 ${
              product.total_stock === 0
                ? "bg-[#1a1a1a] text-[#444] cursor-not-allowed"
                : addedToCart
                  ? "bg-[#1a4a2a] text-emerald-400"
                  : "bg-[#EE3C24] text-black hover:bg-[#ECE7D1]"
            }`}
          >
            <ShoppingBag size={13} strokeWidth={2} />
            {product.total_stock === 0 ? "Sold Out" : addedToCart ? "Added ✓" : "Quick Add"}
          </button>
        </div>
      </div>
    </Link>
  );
}