"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { useGlobal } from "@/lib/GlobalContext";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const WEIGHTS = [
  { id: "220", label: "220 GSM", desc: "Lightweight & Breathable" },
  { id: "240", label: "240 GSM", desc: "Heavyweight Structure" }
];

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { addToCart } = useGlobal();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedGSM, setSelectedGSM] = useState<string>("240");
  const [sizeError, setSizeError] = useState(false);
  const [added, setAdded] = useState(false);

  // Mock product data based on ID
  const product = {
    id: params.id,
    name: "Heavyweight Archive Drop",
    price: 180,
    category: "Oversized",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1000&q=85",
    description: "Engineered with meticulous attention to detail. This garment embodies our dedication to architectural silhouettes and uncompromising fabric quality. Designed to drape perfectly regardless of the chosen weight."
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: `${selectedSize} (${selectedGSM} GSM)`,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--black)] text-[var(--beige)] pt-20 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-12 lg:gap-24">
        
        {/* Left: Image Viewer */}
        <div className="w-full md:w-1/2">
          <Link href="/products" className="inline-flex items-center gap-2 label text-[var(--gray-400)] hover:text-[var(--orange)] transition-colors mb-8" style={{ fontSize: "10px", letterSpacing: "0.15em" }}>
            <ArrowLeft size={14} strokeWidth={1.5} /> BACK TO ARCHIVE
          </Link>
          <div className="w-full bg-[var(--gray-900)] border border-[var(--gray-800)]" style={{ aspectRatio: "3/4" }}>
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Right: Product Details & Order Form */}
        <div className="w-full md:w-1/2 md:pt-16 flex flex-col">
          
          <p className="label text-[var(--orange)] mb-4" style={{ fontSize: "11px", letterSpacing: "0.2em" }}>
            {product.category.toUpperCase()}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-4 text-[var(--beige)]">
            {product.name}
          </h1>
          <p className="label text-[var(--beige)] mb-10" style={{ fontSize: "14px" }}>
            ${product.price.toFixed(2)}
          </p>

          <p className="label text-[var(--gray-200)] mb-12 leading-relaxed" style={{ fontSize: "12px", textTransform: "none", letterSpacing: "0.08em" }}>
            {product.description}
          </p>

          {/* GSM (Fabric Weight) Selector */}
          <div className="mb-10">
            <span className="label block mb-5" style={{ fontSize: "11px", letterSpacing: "0.15em" }}>
              FABRIC WEIGHT
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {WEIGHTS.map((weight) => (
                <button
                  key={weight.id}
                  onClick={() => setSelectedGSM(weight.id)}
                  className="border py-4 px-5 text-left transition-colors flex flex-col items-start gap-2"
                  style={{
                    borderColor: selectedGSM === weight.id ? "var(--orange)" : "var(--gray-800)",
                    background: selectedGSM === weight.id ? "var(--orange)" : "transparent",
                  }}
                >
                  <span className="label" style={{ fontSize: "12px", color: selectedGSM === weight.id ? "var(--black)" : "var(--beige)" }}>
                    {weight.label}
                  </span>
                  <span style={{ fontSize: "10px", color: selectedGSM === weight.id ? "rgba(0,0,0,0.7)" : "var(--gray-400)", textTransform: "none", letterSpacing: "0.05em" }}>
                    {weight.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-5">
              <span className="label" style={{ fontSize: "11px", letterSpacing: "0.15em" }}>
                SELECT SIZE
              </span>
              <button className="label text-[var(--gray-400)] hover:text-[var(--orange)] transition-colors underline" style={{ fontSize: "10px" }}>
                Size Guide
              </button>
            </div>

            {sizeError && (
              <p className="label text-[var(--orange)] mb-4" style={{ fontSize: "10px", letterSpacing: "0.1em" }}>
                Please select a size to continue.
              </p>
            )}

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => { setSelectedSize(size); setSizeError(false); }}
                  className="border py-4 label transition-colors"
                  style={{
                    fontSize: "12px",
                    borderColor: selectedSize === size ? "var(--beige)" : "var(--gray-800)",
                    background: selectedSize === size ? "var(--beige)" : "transparent",
                    color: selectedSize === size ? "var(--black)" : "var(--gray-400)",
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className={`w-full font-bold label py-5 transition-colors duration-300 flex items-center justify-center gap-3 ${
              added 
                ? "bg-[var(--beige)] text-[var(--black)] border border-[var(--beige)]" 
                : "bg-[var(--orange)] text-[var(--black)] border border-[var(--orange)] hover:bg-[var(--beige)] hover:border-[var(--beige)]"
            }`}
            style={{ fontSize: "12px", letterSpacing: "0.2em" }}
          >
            {added ? (
              <><Check size={16} strokeWidth={2} /> ADDED TO BAG</>
            ) : (
              "ADD TO BAG"
            )}
          </button>
          
        </div>
      </div>
    </div>
  );
}