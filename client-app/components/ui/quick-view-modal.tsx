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
      setSelectedGSM("240"); // Default premium weight
      setSizeError(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isQuickViewOpen]);

  const handleAdd = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    if (selectedProduct) {
      // Pass the selected GSM along with the size
      addToCart({ ...selectedProduct, size: `${selectedSize} (${selectedGSM} GSM)` });
      closeQuickView();
    }
  };

  return (
    <>
      <div
        className={`qv-backdrop ${isQuickViewOpen ? "open" : ""}`}
        onClick={closeQuickView}
      />
      <div
        className={`qv-panel ${isQuickViewOpen ? "open" : ""}`}
        style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
      >
        {/* Image Side */}
        <div className="w-full md:w-1/2 flex-shrink-0 bg-[var(--gray-900)] border-r border-[var(--gray-800)]" style={{ aspectRatio: "3/4", maxHeight: "90vh" }}>
          {selectedProduct && (
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Details Side */}
        <div className="flex-1 flex flex-col overflow-y-auto no-scroll relative bg-[var(--black)] text-[var(--beige)]">
          {/* Close Button */}
          <button
            onClick={closeQuickView}
            className="absolute top-5 right-5 text-[var(--beige)] hover:text-[var(--orange)] transition-colors z-10"
          >
            <X size={20} strokeWidth={1.5} />
          </button>

          <div className="p-8 md:p-10 flex-1 flex flex-col">
            
            {/* Header: Name & Price */}
            <div className="mb-8 pr-8">
              <p className="label text-[var(--orange)] mb-2" style={{ fontSize: "10px", letterSpacing: "0.2em" }}>
                {selectedProduct?.category?.toUpperCase() || "ARCHIVE"}
              </p>
              <h2 style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                fontWeight: 400,
                lineHeight: 1.1,
                marginBottom: "8px",
              }}>
                {selectedProduct?.name}
              </h2>
              <p className="label" style={{ fontSize: "13px" }}>
                ${selectedProduct?.price}
              </p>
            </div>

            {/* Description */}
            <p className="label text-[var(--gray-200)] mb-8 leading-relaxed" style={{ fontSize: "11px", lineHeight: 1.7, textTransform: "none", letterSpacing: "0.08em" }}>
              Engineered with meticulous attention to detail. This garment embodies our dedication to architectural silhouettes and uncompromising fabric quality.
            </p>

            {/* GSM / Fabric Weight Selector */}
            <div className="mb-8">
              <span className="label text-[var(--beige)] block mb-4" style={{ fontSize: "10px", letterSpacing: "0.15em" }}>
                FABRIC WEIGHT
              </span>
              <div className="grid grid-cols-2 gap-3">
                {WEIGHTS.map((weight) => (
                  <button
                    key={weight.id}
                    onClick={() => setSelectedGSM(weight.id)}
                    className="border py-3 px-4 text-left transition-colors flex flex-col items-start gap-1"
                    style={{
                      borderColor: selectedGSM === weight.id ? "var(--orange)" : "var(--gray-800)",
                      background: selectedGSM === weight.id ? "var(--orange)" : "transparent",
                    }}
                  >
                    <span 
                      className="label" 
                      style={{ 
                        fontSize: "11px", 
                        color: selectedGSM === weight.id ? "var(--black)" : "var(--beige)" 
                      }}
                    >
                      {weight.label}
                    </span>
                    <span 
                      style={{ 
                        fontSize: "9px", 
                        color: selectedGSM === weight.id ? "rgba(0,0,0,0.7)" : "var(--gray-400)",
                        textTransform: "none",
                        letterSpacing: "0.05em"
                      }}
                    >
                      {weight.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <span className="label text-[var(--beige)]" style={{ fontSize: "10px", letterSpacing: "0.15em" }}>
                  SELECT SIZE
                </span>
                <button className="label text-[var(--gray-400)] hover:text-[var(--orange)] transition-colors underline" style={{ fontSize: "10px" }}>
                  Size Guide
                </button>
              </div>

              {sizeError && (
                <p className="label text-[var(--orange)] mb-3" style={{ fontSize: "10px" }}>
                  Please select a size to continue.
                </p>
              )}

              <div className="grid grid-cols-3 gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => { setSelectedSize(size); setSizeError(false); }}
                    className="border py-3.5 label transition-colors"
                    style={{
                      fontSize: "11px",
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

            {/* Action Buttons */}
            <div className="mt-auto space-y-3">
              <button
                onClick={handleAdd}
                className="w-full bg-[var(--orange)] text-[var(--black)] font-bold label py-4.5 hover:bg-[var(--beige)] transition-colors duration-300"
                style={{ fontSize: "11px", letterSpacing: "0.2em" }}
              >
                ADD TO BAG
              </button>
              <button
                onClick={closeQuickView}
                className="w-full border border-[var(--gray-800)] text-[var(--beige)] label py-4 hover:border-[var(--beige)] transition-colors duration-300"
                style={{ fontSize: "11px", letterSpacing: "0.2em" }}
              >
                VIEW DETAILS
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};