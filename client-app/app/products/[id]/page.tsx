"use client";

import React, { useState, use, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
// import { useCart } from "@/lib/CartContext";
import { getProductById } from "@/services/products";
import { Product } from "../page";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const WEIGHTS = [
  { id: "220", label: "220 GSM", desc: "Lightweight & Breathable" },
  { id: "240", label: "240 GSM", desc: "Heavyweight Structure" }
];

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedGSM, setSelectedGSM] = useState<string>("240");
  const [sizeError, setSizeError] = useState(false);


  useEffect(() => {
    const fetchProduct = async () => {
      const fetchedProduct = await getProductById(id);
      console.log("Fetched product data:", fetchedProduct);
      setProduct(fetchedProduct);
    };
    fetchProduct();
  }, [id]);

  // ✅ ADDED EARLY RETURN FOR LOADING STATE
  if (!product) {
    return (
      <div className="min-h-screen bg-(--black) flex items-center justify-center">
        <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-(--beige) animate-pulse">
          Loading product...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--black) text-(--beige) pt-24 pb-24 font-sans">
      <div className="max-w-350 mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-12 lg:gap-24">

        {/* Left: Image Viewer */}
        <div className="w-full md:w-1/2">
          <Link
            href="/products"
            className="inline-flex items-center gap-3 font-sans text-[10px] uppercase tracking-[0.2em] text-(--gray-400) hover:text-(--orange) transition-colors mb-12"
          >
            <ArrowLeft size={14} strokeWidth={1} /> BACK TO ARCHIVE
          </Link>
          <div className="w-full bg-(--gray-900) border border-(--gray-800) aspect-3/4 overflow-hidden">
            <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Right: Product Details & Order Form */}
        <div className="w-full md:w-1/2 md:pt-20 flex flex-col">

          <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-(--orange) mb-6">
            {product.categories[0]?.name || "Uncategorized"}
          </p>
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.9] mb-6 text-(--beige)">
            {product.name}
          </h1>
          <p className="font-sans text-[12px] tracking-widest text-(--beige) mb-12">
            ₹{product.price.toFixed(2)}
          </p>

          <p className="font-sans text-[12px] leading-relaxed tracking-[0.05em] text-(--gray-200) mb-16">
            {product.description}
          </p>

          {/* GSM (Fabric Weight) Selector */}
          <div className="mb-12">
            <span className="block font-sans text-[10px] uppercase tracking-[0.2em] text-(--gray-400) mb-6">
              FABRIC WEIGHT
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {WEIGHTS.map((weight) => (
                <button
                  key={weight.id}
                  onClick={() => setSelectedGSM(weight.id)}
                  className={`border p-5 text-left transition-colors flex flex-col items-start gap-2 ${selectedGSM === weight.id
                    ? "border-(--beige) bg-(--gray-900)"
                    : "border-(--gray-800) bg-transparent hover:border-(--gray-600)"
                    }`}
                >
                  <span className={`font-sans text-[11px] uppercase tracking-[0.15em] ${selectedGSM === weight.id ? "text-(--beige)" : "text-(--gray-400)"}`}>
                    {weight.label}
                  </span>
                  <span className="font-sans text-[10px] tracking-[0.05em] text-(--gray-600)">
                    {weight.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-(--gray-400)">
                SELECT SIZE
              </span>
              <button className="font-sans text-[10px] uppercase tracking-[0.1em] text-(--gray-400) hover:text-(--orange) transition-colors underline underline-offset-4">
                Size Guide
              </button>
            </div>

            {sizeError && (
              <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-(--orange) mb-4 animate-pulse">
                Please select a size to continue.
              </p>
            )}

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => { setSelectedSize(size); setSizeError(false); }}
                  className={`border py-4 font-sans text-[11px] uppercase tracking-[0.15em] transition-colors ${selectedSize === size
                    ? "border-(--beige) bg-(--beige) text-(--black) font-bold"
                    : "border-(--gray-800) bg-transparent text-(--gray-400) hover:border-(--gray-600) hover:text-(--beige)"
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart Button */}
          {/* <button
            onClick={handleAddToCart}
            className={`w-full font-sans text-[11px] font-bold uppercase tracking-[0.2em] py-6 transition-colors duration-300 flex items-center justify-center gap-3 ${added
                ? "bg-(--beige) text-(--black) border border-(--beige)"
                : "bg-(--orange) text-(--black) border border-(--orange) hover:bg-(--beige) hover:border-(--beige)"
              }`}
          >
            {added ? (
              <><Check size={16} strokeWidth={2} /> ADDED TO BAG</>
            ) : (
              "ADD TO BAG"
            )}
          </button> */}

        </div>
      </div>
    </div>
  );
}