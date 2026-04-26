"use client";

import React, { useState, useEffect } from "react";
import { X, ArrowRight, Ruler } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { useQuickView } from "@/lib/QuickViewContext";

const SIZES = ["S", "M", "L", "XL"];

export const QuickViewModal = () => {
  const { addToCart } = useCart();
  const { selectedProduct, isQuickViewOpen, closeQuickView } = useQuickView();
  const [selectedSize, setSelectedSize] = useState<string>("M");

  useEffect(() => {
    if (isQuickViewOpen) {
      setSelectedSize("M");
      // Lock background scrolling when modal is open
      document.body.style.overflow = "hidden"; 
    } else {
      // Restore scrolling when modal is closed
      document.body.style.overflow = "unset";
    }

    // CRITICAL FIX: Cleanup function. 
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isQuickViewOpen]);

  const handleAddToCart = () => {
    if (selectedProduct) {
      addToCart({ ...selectedProduct, size: selectedSize });
      closeQuickView();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-md z-[120] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          isQuickViewOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={closeQuickView}
      />

      {/* Modal Content - FIXED: Added opacity and visibility classes */}
      <div 
        className={`fixed left-0 md:left-1/2 md:-translate-x-1/2 bottom-0 md:top-1/2 md:-translate-y-1/2 w-full md:max-w-5xl md:max-h-[90vh] h-[90vh] md:h-auto bg-[#050505] md:border border-white/10 z-[130] flex flex-col md:flex-row overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] rounded-t-3xl md:rounded-none ${
          isQuickViewOpen 
            ? "translate-y-0 md:scale-100 opacity-100 visible" 
            : "translate-y-full md:translate-y-[-40%] md:scale-95 opacity-0 invisible pointer-events-none"
        }`}
      >
        {/* Close Button - Floats over image */}
        <button onClick={closeQuickView} className="absolute top-4 right-4 md:top-6 md:right-6 z-20 bg-black/50 md:bg-transparent backdrop-blur-md md:backdrop-blur-none p-2 md:p-0 rounded-full text-white hover:text-[#C5A059] transition-colors">
          <X className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Product Image */}
        <div className="w-full h-[45%] md:w-1/2 md:h-auto bg-[#0a0a0a] relative overflow-hidden flex-shrink-0">
          {selectedProduct && (
            <img 
              src={selectedProduct.image} 
              alt={selectedProduct.name} 
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Product Details Area */}
        <div className="w-full h-[55%] md:w-1/2 md:h-auto flex flex-col relative bg-[#050505]">
          
          {/* Scrollable Content */}
          <div className="p-6 md:p-12 overflow-y-auto scrollbar-hide flex-1 pb-24 md:pb-32">
            <span className="text-[#C5A059] text-[10px] uppercase tracking-[0.3em] mb-2 md:mb-4 block font-bold">
              Archive Edition
            </span>
            <h2 className="text-2xl md:text-4xl font-light uppercase tracking-[0.1em] text-white mb-2">
              {selectedProduct?.name || "Loading..."}
            </h2>
            <span className="text-lg md:text-xl font-mono text-zinc-400 mb-6 block">
              ${selectedProduct?.price || "0.00"}
            </span>

            <p className="text-zinc-500 font-light text-xs md:text-sm leading-relaxed tracking-wide mb-8">
              Engineered with uncompromising precision. This piece features our signature heavyweight cotton blend, dropped shoulders for a relaxed silhouette, and structural ribbing.
            </p>

            {/* Size Selector */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] md:text-xs font-medium uppercase tracking-[0.2em] text-white">Select Size</span>
                <button className="text-[10px] text-zinc-500 uppercase tracking-widest flex items-center gap-1 hover:text-white transition-colors">
                  <Ruler className="w-3 h-3" /> Guide
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2 md:gap-3">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 md:py-4 text-[10px] md:text-xs font-mono uppercase tracking-widest border transition-all duration-300 ${
                      selectedSize === size 
                        ? "border-[#C5A059] text-[#C5A059] bg-[#C5A059]/10" 
                        : "border-white/10 text-zinc-400 hover:border-white hover:text-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Action Button anchored to bottom */}
          <div className="absolute bottom-0 left-0 w-full p-4 md:p-8 bg-gradient-to-t from-[#050505] via-[#050505] to-transparent">
            <button 
              onClick={handleAddToCart}
              className="group flex items-center justify-between w-full bg-[#f8f8f8] text-[#050505] p-4 md:p-5 text-xs md:text-sm font-black uppercase tracking-[0.2em] active:scale-[0.98] md:hover:bg-[#C5A059] transition-all duration-300"
            >
              <span>Add to Archive</span>
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform duration-500" />
            </button>
          </div>
        </div>

      </div>
    </>
  );
};