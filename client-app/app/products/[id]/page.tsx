"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";

// Mock Data
const ARCHIVE_PRODUCTS = [
  { id: "1", name: "Heavyweight Boxy Tee", price: 85, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800", type: "Tops", category: "Essentials" },
  { id: "2", name: "Tailored Cargo Pant", price: 180, image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800", type: "Bottoms", category: "Archive" },
  { id: "3", name: "Mohair Overcoat", price: 450, image: "https://images.unsplash.com/photo-1550614000-4b95d4ed141b?w=800", type: "Outerwear", category: "FW26" },
  { id: "4", name: "Washed Canvas Jacket", price: 220, image: "https://images.unsplash.com/photo-1618517351616-38fb9c52ce37?w=800", type: "Outerwear", category: "Archive" },
  { id: "5", name: "Silk Blend Camp Shirt", price: 145, image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800", type: "Tops", category: "Essentials" },
  { id: "6", name: "Pleated Trousers", price: 160, image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800", type: "Bottoms", category: "FW26" },
];

const FILTERS = ["All", "Outerwear", "Tops", "Bottoms", "Accessories"];

export default function ProductsPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredProducts = activeFilter === "All" 
    ? ARCHIVE_PRODUCTS 
    : ARCHIVE_PRODUCTS.filter(p => p.type === activeFilter);

  return (
    <main className="min-h-screen bg-background pt-32 pb-24 selection:bg-foreground selection:text-background">
      <div className="max-w-[1800px] mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-muted mb-4 block">
              Fall / Winter 2026
            </span>
            <h1 className="text-4xl md:text-6xl font-light uppercase tracking-widest text-foreground">
              The Archive
            </h1>
          </div>
          <p className="text-sm text-muted max-w-sm tracking-wide">
            A curated selection of uncompromising garments. Engineered for presence, designed to outlast trends.
          </p>
        </div>

        {/* Minimal Filters */}
        <div className="flex flex-wrap items-center gap-4 md:gap-8 mb-12 border-b border-border pb-6 scrollbar-hide overflow-x-auto">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`text-xs font-medium uppercase tracking-[0.2em] transition-colors whitespace-nowrap ${
                activeFilter === filter ? "text-foreground" : "text-muted hover:text-foreground"
              }`}
            >
              {filter}
            </button>
          ))}
          <span className="ml-auto text-xs font-mono text-muted hidden md:block">
            {filteredProducts.length} Items
          </span>
        </div>

        {/* The Grid */}
        <motion.div 
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16"
        >
          {filteredProducts.map((product) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              key={product.id}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </main>
  );
}