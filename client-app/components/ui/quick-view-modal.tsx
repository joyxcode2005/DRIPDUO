"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { useQuickView } from "@/lib/QuickViewContext";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export const QuickViewModal = () => {
  const { addToCart } = useCart();
  const { selectedProduct, isQuickViewOpen, closeQuickView } = useQuickView();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);

  useEffect(() => {
    if (isQuickViewOpen) {
      setSelectedSize(null);
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
      addToCart({ ...selectedProduct, size: selectedSize });
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
        {/* Image */}
        <div className="w-full md:w-1/2 flex-shrink-0 bg-gray-100" style={{ aspectRatio: "3/4", maxHeight: "90vh" }}>
          {selectedProduct && (
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Details */}
        <div className="flex-1 flex flex-col overflow-y-auto no-scroll relative">
          {/* Close */}
          <button
            onClick={closeQuickView}
            className="absolute top-5 right-5 hover:opacity-60 transition-opacity z-10"
          >
            <X size={20} strokeWidth={1.5} />
          </button>

          <div className="p-8 md:p-10 flex-1 flex flex-col">
            {/* Name & Price */}
            <div className="mb-8 pr-8">
              <p className="label text-gray-400 mb-2" style={{ fontSize: "10px" }}>
                {selectedProduct?.category || ""}
              </p>
              <h2 style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
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
            <p className="label text-gray-500 mb-8 leading-relaxed" style={{ fontSize: "11px", lineHeight: 1.7 }}>
              Premium quality fabric with structured fit. Designed for those who understand that fashion is a form of expression. Made with care and precision.
            </p>

            {/* Size */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="label" style={{ fontSize: "10px", letterSpacing: "0.12em" }}>
                  SELECT SIZE
                </span>
                <button className="label text-gray-400 hover:text-black transition-colors" style={{ fontSize: "10px" }}>
                  Size Guide
                </button>
              </div>

              {sizeError && (
                <p className="label text-red-500 mb-3" style={{ fontSize: "10px" }}>
                  Please select a size
                </p>
              )}

              <div className="grid grid-cols-3 gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => { setSelectedSize(size); setSizeError(false); }}
                    className="border py-3 label transition-colors hover:border-black"
                    style={{
                      fontSize: "11px",
                      borderColor: selectedSize === size ? "#000" : "#e0e0e0",
                      background: selectedSize === size ? "#000" : "transparent",
                      color: selectedSize === size ? "#fff" : "#000",
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to bag */}
            <div className="mt-auto space-y-3">
              <button
                onClick={handleAdd}
                className="w-full bg-black text-white label py-4 hover:bg-gray-900 transition-colors"
                style={{ fontSize: "11px", letterSpacing: "0.12em" }}
              >
                Add to Bag
              </button>
              <button
                onClick={closeQuickView}
                className="w-full border border-gray-200 label py-4 hover:border-black transition-colors"
                style={{ fontSize: "11px", letterSpacing: "0.12em" }}
              >
                View Full Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};