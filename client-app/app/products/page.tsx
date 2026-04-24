/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Filter, Search } from "lucide-react";
import { CATEGORIES, MOCK_PRODUCTS, PRODUCT_TYPES } from "@/constants";


export default function ProductsPage() {
  const [activeType, setActiveType] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");

  // Filtering Logic
  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const matchType = activeType === "All" || product.type === activeType;
    const matchCategory = activeCategory === "All" || product.category === activeCategory;
    return matchType && matchCategory;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col md:flex-row font-sans selection:bg-[#e63946] selection:text-white">
      
      {/* LEFT SIDEBAR (Desktop) */}
      <aside className="w-full md:w-64 lg:w-80 shrink-0 border-b md:border-b-0 md:border-r border-zinc-800 bg-[#111] p-6 sticky top-0 md:h-screen md:overflow-y-auto z-20">
        <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white mb-10 transition-colors uppercase font-bold tracking-widest text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 text-[#e63946]">DRIPDUO <br/><span className="text-white">Store.</span></h2>

        <div className="mb-8">
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-none focus-within:border-[#e63946] transition-colors">
            <Search className="w-5 h-5 text-zinc-500" />
            <input type="text" placeholder="SEARCH DROP..." className="bg-transparent border-none outline-none w-full text-sm font-mono uppercase" />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
              <Filter className="w-4 h-4"/> Product Type
            </h3>
            <ul className="space-y-2">
              {PRODUCT_TYPES.map((type) => (
                <li key={type}>
                  <button 
                    onClick={() => setActiveType(type)}
                    className={`w-full text-left px-4 py-3 font-bold uppercase tracking-wide text-sm transition-all duration-200 border-l-4 ${
                      activeType === type 
                        ? "border-[#e63946] bg-zinc-900 text-white" 
                        : "border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                    }`}
                  >
                    {type}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-h-screen">
        
        {/* TOP CATEGORIES SCROLL BAR */}
        <div className="sticky top-0 z-10 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-zinc-800 p-4">
          <div className="flex overflow-x-auto scrollbar-hide gap-3 pb-2 items-center">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest mr-2 shrink-0">Vibe Check:</span>
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
                  activeCategory === category
                    ? "bg-[#e63946] text-white border-[#e63946] shadow-[0_0_15px_rgba(230,57,70,0.4)]"
                    : "bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCTS GRID */}
        <div className="p-6 md:p-10 flex-1">
          <div className="mb-8 flex justify-between items-end">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
              {activeCategory === "All" ? "Latest Drops" : activeCategory}
            </h1>
            <span className="text-zinc-500 font-mono text-sm">{filteredProducts.length} Items</span>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <div key={product.id} className="group cursor-pointer">
                  {/* Product Image Box */}
                  <div className="relative aspect-4/5 bg-zinc-900 overflow-hidden border border-zinc-800 group-hover:border-[#e63946] transition-colors duration-300">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale-[0.2] group-hover:grayscale-0"
                    />
                    {/* Hover Overlay Button */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="bg-white text-black font-black uppercase tracking-widest px-6 py-3 text-sm hover:bg-[#e63946] hover:text-white transition-colors">
                        Quick Add
                      </span>
                    </div>
                  </div>
                  {/* Product Details */}
                  <div className="mt-4 flex justify-between items-start">
                    <div>
                      <span className="text-xs text-zinc-500 font-mono uppercase tracking-widest mb-1 block">
                        {product.type} // {product.category}
                      </span>
                      <h3 className="text-lg font-bold uppercase tracking-tight text-white group-hover:text-[#e63946] transition-colors">
                        {product.name}
                      </h3>
                    </div>
                    <span className="text-lg font-black">${product.price}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="w-full h-64 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 text-zinc-500 mt-10">
              <span className="text-2xl font-black uppercase tracking-widest mb-2">Out of Stock</span>
              <p className="font-mono text-sm uppercase">No drops match this vibe right now.</p>
              <button 
                onClick={() => { setActiveType("All"); setActiveCategory("All"); }}
                className="mt-4 text-[#e63946] underline font-bold uppercase text-sm"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}