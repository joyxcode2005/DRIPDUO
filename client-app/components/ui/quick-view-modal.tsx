"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { useQuickView } from "@/lib/QuickViewContext";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const WEIGHTS = [
  { id: "180", label: "180 GSM", desc: "Light & Breathable" },
  { id: "210", label: "210 GSM", desc: "Everyday Classic" },
  { id: "230", label: "230 GSM", desc: "Premium Density" },
  { id: "240", label: "240 GSM", desc: "Heavyweight Structure" }
];

export const QuickViewModal = () => {
  const { addToCart } = useCart();
  const { selectedProduct, isQuickViewOpen, closeQuickView } = useQuickView();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedGSM, setSelectedGSM] = useState<string>("240");
  const [sizeError, setSizeError] = useState(false);

  useEffect(() => {
    if (isQuickViewOpen) {
      setSelectedSize(null);
      setSelectedGSM("240");
      setSizeError(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isQuickViewOpen]);

  if (!selectedProduct) return null;

  const handleAdd = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    addToCart({
      id: selectedProduct.id,
      productId: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      image: selectedProduct.image,
      size: `${selectedSize} (${selectedGSM} GSM)`,
      quantity: selectedProduct.quantity || 1,
    });
    closeQuickView();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/80 z-[110] backdrop-blur-md transition-opacity duration-500 ${
          isQuickViewOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`} 
        onClick={closeQuickView} 
      />

      {/* Zara-Style Edge-to-Edge Panel */}
      <div 
        className={`fixed left-1/2 top-1/2 z-[120] w-[95vw] max-w-[1000px] h-[90vh] md:h-[600px] bg-(--black) border border-(--gray-800) shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isQuickViewOpen ? "opacity-100 visible -translate-x-1/2 -translate-y-1/2 scale-100" : "opacity-0 invisible -translate-x-1/2 -translate-y-1/2 scale-[0.98]"
        }`}
      >
        <button
          onClick={closeQuickView}
          className="absolute top-4 right-4 z-50 text-(--black) md:text-(--beige) hover:text-(--orange) transition-colors bg-(--beige) md:bg-transparent p-2 md:p-0 rounded-full md:rounded-none"
        >
          <X size={24} strokeWidth={1} />
        </button>

        <div className="flex flex-col md:flex-row h-full w-full">
          {/* Left: Full Bleed Image */}
          <div className="w-full md:w-1/2 h-[45%] md:h-full bg-(--gray-900) relative overflow-hidden border-b md:border-b-0 md:border-r border-(--gray-800)">
            <img 
              src={selectedProduct.image} 
              alt={selectedProduct.name} 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/* Right: Product Details */}
          <div className="w-full md:w-1/2 h-[55%] md:h-full flex flex-col p-8 md:p-12 overflow-y-auto no-scroll">
            
            <div className="mb-8">
              <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] leading-[0.9] text-(--beige) mb-4">
                {selectedProduct.name}
              </h2>
              <p className="font-sans text-[11px] tracking-[0.15em] uppercase text-(--orange) mb-6">
                ${selectedProduct.price} USD
              </p>
              <p className="font-sans text-[11px] tracking-[0.05em] leading-relaxed text-(--gray-400)">
                Premium oversized silhouette constructed from ultra-dense cotton. Featuring drop shoulders, tight neckline, and structural integrity that holds its shape.
              </p>
            </div>

            {/* Weight / GSM Selection */}
            <div className="mb-8">
              <span className="block font-sans text-[9px] uppercase tracking-[0.2em] text-(--gray-400) mb-4">Fabric Weight</span>
              <div className="grid grid-cols-2 gap-2">
                {WEIGHTS.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => setSelectedGSM(w.id)}
                    className={`p-3 text-left border transition-colors ${
                      selectedGSM === w.id ? "border-(--beige) bg-(--gray-900)" : "border-(--gray-800) hover:border-(--gray-600)"
                    }`}
                  >
                    <span className={`block font-sans text-[10px] uppercase tracking-[0.15em] ${selectedGSM === w.id ? "text-(--beige)" : "text-(--gray-400)"}`}>
                      {w.label}
                    </span>
                    <span className="block font-sans text-[9px] text-(--gray-600) mt-1">{w.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-(--gray-400)">
                  Select Size
                </span>
                {sizeError && (
                  <span className="font-sans text-[9px] uppercase tracking-[0.15em] text-(--orange) animate-pulse">
                    Please select a size
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => { setSelectedSize(size); setSizeError(false); }}
                    className={`py-4 font-sans text-[10px] uppercase tracking-[0.15em] border transition-colors ${
                      selectedSize === size 
                        ? "border-(--beige) bg-(--beige) text-(--black) font-bold" 
                        : "border-(--gray-800) text-(--gray-400) hover:border-(--gray-600) hover:text-(--beige)"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Sticky Action Button */}
            <div className="mt-auto pt-6 border-t border-(--gray-800)">
              <button
                onClick={handleAdd}
                className="w-full bg-(--orange) text-(--black) font-sans text-[11px] font-bold uppercase tracking-[0.2em] py-5 hover:bg-(--beige) transition-colors duration-300"
              >
                Add to Bag
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
};