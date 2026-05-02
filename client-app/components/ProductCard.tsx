"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/CartContext";
import Image from "next/image";

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
  is_active: boolean;
  created_at: string;
  updated_at: string;
  product_categories: { categories: SupabaseCategory }[];
  product_images: SupabaseProductImage[];
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const imageUrl = product.product_images?.[0]?.url || "";
  const hoverImage = product.product_images?.[1]?.url || imageUrl;
  const categoryName = product.product_categories?.[0]?.categories?.name || "Apparel";
  const productTypeName = product.product_type?.name || null;

  const discountPercent =
    product.discount > 0
      ? Math.round(((product.price - product.final_price) / product.price) * 100)
      : 0;

  const savings = product.price - product.final_price;


  // Show appropriate stock status based on inventory levels
  const stockStatus =
    product.stock === 0
      ? { label: "Out of Stock", color: "text-red-400" }
      : product.stock <= 5
        ? { label: `Only ${product.stock} left`, color: "text-amber-400" }
        : { label: "In Stock", color: "text-green-400" };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.final_price,
      image: imageUrl,
      size: "M",
      quantity: 1,
    });
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative border-r border-b border-(--gray-800) overflow-hidden bg-(--gray-900) block cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Image Area ── */}
      <div className="w-full relative" style={{ aspectRatio: "2/3" }}>
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className={`object-cover transition-opacity duration-700 ${isHovered && hoverImage !== imageUrl ? "opacity-0" : "opacity-100"
              }`}
          />
        )}
        {hoverImage !== imageUrl && (
          <Image
            src={hoverImage}
            alt={`${product.name} Alt`}
            fill
            className={`object-cover transition-opacity duration-700 ${isHovered ? "opacity-100" : "opacity-0"
              }`}
          />
        )}

        {/* Multi-layer dark gradient overlay — ensures text always readable */}
        <div
          className="absolute inset-0 pointer-events-none z-5"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 35%, rgba(0,0,0,0.15) 60%, transparent 100%)",
          }}
        />

        {/* ── Top Tags: Category + Type + Sale badge ── */}
        <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1.5">
          <span className="font-sans text-[8px] tracking-[0.12em] uppercase px-2 py-1 text-(--beige) backdrop-blur-sm bg-black/40 border border-white/10">
            {categoryName}
          </span>
          {productTypeName && (
            <span className="font-sans text-[8px] tracking-[0.12em] uppercase px-2 py-1 text-(--orange) backdrop-blur-sm bg-orange-500/10 border border-orange-500/25">
              {productTypeName}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="font-sans text-[8px] tracking-[0.12em] uppercase px-2 py-1 text-(--black) bg-(--orange) font-bold">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* ── Stock Status Indicator ── */}
        <div
          className={`absolute z-10 flex items-center gap-1.5 font-sans text-[8px] tracking-[0.12em] uppercase transition-all duration-300 ${stockStatus.color}`}
          style={{ bottom: isHovered ? "8.5rem" : "5.5rem", left: "0.75rem" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {stockStatus.label}
        </div>

        {/* ── Product Info Overlay ── */}
        <div
          className="absolute left-3 right-3 z-10 flex justify-between items-end transition-all duration-300"
          style={{ bottom: isHovered ? "4rem" : "0.875rem" }}
        >
          <div className="max-w-[68%]">
            <p className="font-sans text-[10px] tracking-[0.14em] uppercase text-(--beige) leading-relaxed line-clamp-2 font-medium">
              {product.name}
            </p>
            <p className="font-sans text-[8px] tracking-[0.12em] uppercase text-(--gray-400) mt-1 flex items-center gap-1">
              {categoryName}
              {productTypeName && (
                <>
                  <span className="text-(--gray-800) mx-0.5">·</span>
                  {productTypeName}
                </>
              )}
            </p>
          </div>
          <div className="text-right flex flex-col items-end">
            {product.discount > 0 && (
              <>
                <p className="font-sans text-[8px] tracking-widest uppercase text-(--gray-500) line-through">
                  ₹{product.price}
                </p>
                <p className="font-sans text-[11px] tracking-[0.14em] uppercase text-(--beige) font-semibold">
                  ₹{product.final_price}
                </p>
                <p className="font-sans text-[8px] tracking-widest uppercase text-(--orange) mt-0.5">
                  Save ₹{savings}
                </p>
              </>
            )}
            {product.discount === 0 && (
              <p className="font-sans text-[11px] tracking-[0.14em] uppercase text-(--beige) font-semibold">
                ₹{product.final_price}
              </p>
            )}
          </div>
        </div>

        {/* ── Quick Add CTA ── */}
        <button
          onClick={handleQuickAdd}
          className="absolute bottom-0 left-0 right-0 bg-(--orange) text-(--black) font-bold text-center py-3.5 font-sans text-[10px] tracking-[0.18em] uppercase z-20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-transform duration-300 ease-in-out"
          style={{ transform: isHovered ? "translateY(0)" : "translateY(100%)" }}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? (
            "Out of Stock"
          ) : (
            <>
              Quick Add — M
              <span className="font-normal opacity-60 text-[8px] tracking-widest">
                · Change size →
              </span>
            </>
          )}
        </button>
      </div>

      {/* ── Footer Strip ── */}
      <div className="flex items-center justify-between px-3 py-2.5 border-t border-(--gray-800)">
        <p className="font-sans text-[8px] tracking-[0.14em] uppercase text-(--gray-400)">
          {productTypeName || categoryName}
        </p>
      </div>
    </Link>
  );
}