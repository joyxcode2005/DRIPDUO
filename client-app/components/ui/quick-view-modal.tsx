"use client";

import React, { useState } from "react";
import { X, ArrowRight, Ruler } from "lucide-react";
import { useCart, CartItem } from "@/lib/CartContext";

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: CartItem | null;
}

const SIZES = ["S", "M", "L", "XL"];

export const QuickViewModal = ({ isOpen, onClose, product }: QuickViewModalProps) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>("M");

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart({ ...product, size: selectedSize });
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-md z-[120] transition-opacity duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Modal Content */}
      <div 
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl max-h-[90vh] bg-[#050505] border border-white/10 z-[130] flex flex-col md:flex-row overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          isOpen ? "opacity-100 scale-100 translate-y-[-50%]" : "opacity-0 scale-95 translate-y-[-40%]"
        }`}
      >
        <button onClick={onClose} className="absolute top-6 right-6 z-10 text-white mix-blend-difference hover:text-[#C5A059] transition-colors">
          <X className="w-6 h-6" />
        </button>

        {/* Product Image */}
        <div className="w-full md:w-1/2 h-[50vh] md:h-auto bg-[#0a0a0a] relative overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000"
          />
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center overflow-y-auto scrollbar-hide">
          <span className="text-[#C5A059] text-[10px] uppercase tracking-[0.3em] mb-4 block font-bold">
            Archive Edition
          </span>
          <h2 className="text-3xl md:text-4xl font-light uppercase tracking-[0.1em] text-white mb-2">
            {product.name}
          </h2>
          <span className="text-xl font-mono text-zinc-400 mb-8 block">${product.price}</span>

          <p className="text-zinc-500 font-light text-sm leading-relaxed tracking-wide mb-10">
            Engineered with uncompromising precision. This piece features our signature heavyweight cotton blend, dropped shoulders for a relaxed silhouette, and structural ribbing. Designed to age beautifully.
          </p>

          {/* Size Selector */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-white">Select Size</span>
              <button className="text-[10px] text-zinc-500 uppercase tracking-widest flex items-center gap-1 hover:text-white transition-colors">
                <Ruler className="w-3 h-3" /> Size Guide
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 text-xs font-mono uppercase tracking-widest border transition-all duration-300 ${
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

          {/* Action Button */}
          <button 
            onClick={handleAddToCart}
            className="group flex items-center justify-between w-full bg-[#f8f8f8] text-[#050505] p-5 text-sm font-black uppercase tracking-[0.2em] hover:bg-[#C5A059] transition-colors duration-500"
          >
            <span>Add to Archive</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
          </button>
        </div>
      </div>
    </>
  );
};