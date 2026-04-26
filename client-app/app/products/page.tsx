"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Filter, Search, X, Eye } from "lucide-react";
import { useQuickView } from "@/lib/QuickViewContext";

const CATEGORIES = ["All", "Trending memes", "Bong", "States", "Gym", "Spiritual", "Anime", "Abstract", "Gothic", "Corporate", "Kpop"];
const PRODUCT_TYPES = ["All", "T-Shirt", "Oversized", "Hoodies", "Accessories", "Others"];

const MOCK_PRODUCTS = [
  { id: "p1", name: "Gothic Skull Premium", price: 145, type: "Oversized", category: "Gothic", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80" },
  { id: "p2", name: "Tokyo Drift Silk Tee", price: 130, type: "T-Shirt", category: "Anime", image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80" },
  { id: "p3", name: "Corporate Archive", price: 125, type: "T-Shirt", category: "Corporate", image: "https://images.unsplash.com/photo-1618517351616-38fb9c52ce37?w=800&q=80" },
  { id: "p4", name: "Heavyweight Pump", price: 150, type: "Oversized", category: "Gym", image: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800&q=80" },
  { id: "p5", name: "Bengal Heritage", price: 135, type: "T-Shirt", category: "Bong", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80" },
  { id: "p6", name: "Kashmir Cashmere", price: 240, type: "Hoodies", category: "States", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80" },
  { id: "p7", name: "Goa Linen Blend", price: 110, type: "T-Shirt", category: "States", image: "https://images.unsplash.com/photo-1550614000-4b95d4ed141b?w=800&q=80" },
  { id: "p8", name: "Punjab Heavyweight", price: 160, type: "Oversized", category: "States", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80" },
  { id: "p9", name: "Kerala Loom Tee", price: 120, type: "T-Shirt", category: "States", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80" },
];

export default function ProductsPage() {
  const [activeType, setActiveType] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { openQuickView } = useQuickView();

  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const matchesType = activeType === "All" || product.type === activeType;
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-[#f8f8f8] flex flex-col md:flex-row font-sans selection:bg-[#C5A059] selection:text-black pt-0 md:pt-[72px]">
      
      {/* MOBILE FILTERS TOGGLE */}
      <div className="md:hidden p-4 border-b border-white/10 flex justify-between items-center sticky top-[68px] bg-[#050505]/90 backdrop-blur z-30">
        <span className="font-black tracking-widest uppercase text-[#C5A059]">Dripduo</span>
        <button onClick={() => setIsMobileFiltersOpen(true)} className="flex items-center gap-2 text-[10px] tracking-widest uppercase border border-white/20 px-4 py-2 hover:bg-white/5 transition-colors">
          <Filter className="w-3 h-3" /> Filters
        </button>
      </div>

      {/* SIDEBAR (Responsive) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-full sm:w-80 bg-[#0a0a0a] border-r border-white/5 p-8 transform transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] md:relative md:translate-x-0 md:h-[calc(100vh-72px)] md:sticky md:top-[72px] md:overflow-y-auto ${isMobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center mb-12 md:hidden">
          <span className="font-light uppercase tracking-widest text-lg">Filters</span>
          <button onClick={() => setIsMobileFiltersOpen(false)} className="text-zinc-500 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <h2 className="text-2xl font-black uppercase tracking-widest mb-10 text-white hidden md:block">The <br/><span className="text-[#C5A059]">Collection.</span></h2>

        <div className="mb-10">
          <div className="flex items-center gap-3 border-b border-white/10 pb-2 focus-within:border-[#C5A059] transition-colors">
            <Search className="w-4 h-4 text-zinc-600" />
            <input 
              type="text" 
              placeholder="Filter by name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-xs font-mono uppercase text-white placeholder-zinc-600" 
            />
          </div>
        </div>

        <div>
          <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-600 mb-6 flex items-center gap-2">Silhouette</h3>
          <ul className="space-y-4">
            {PRODUCT_TYPES.map((type) => (
              <li key={type}>
                <button 
                  onClick={() => { setActiveType(type); setIsMobileFiltersOpen(false); }}
                  className={`w-full text-left text-xs uppercase tracking-widest transition-colors duration-300 ${
                    activeType === type ? "text-[#C5A059]" : "text-zinc-500 hover:text-white"
                  }`}
                >
                  {type}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-h-screen">
        
        {/* LUXURY TOP CATEGORIES BAR */}
        <div className="sticky top-[125px] md:top-[72px] z-20 bg-[#050505]/95 backdrop-blur-xl border-b border-white/5 px-4 md:px-6 py-4">
          <div className="flex overflow-x-auto scrollbar-hide gap-5 md:gap-6 items-center">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap pb-1 text-[10px] md:text-xs uppercase tracking-widest transition-all duration-500 border-b ${
                  activeCategory === category
                    ? "text-[#C5A059] border-[#C5A059]"
                    : "text-zinc-600 border-transparent hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCTS GRID */}
        <div className="p-4 md:p-12 flex-1 relative z-10">
          <div className="mb-8 md:mb-12 flex justify-between items-end border-b border-white/5 pb-4 md:pb-6">
            <h1 className="text-2xl md:text-4xl font-light uppercase tracking-[0.1em]">
              {activeCategory === "All" ? "Latest Archive" : activeCategory}
            </h1>
            <span className="text-zinc-600 font-mono text-[10px] md:text-xs tracking-widest">{filteredProducts.length} Pieces</span>
          </div>

          {filteredProducts.length > 0 ? (
            activeCategory === "States" ? (
              /* --- BENTO BOX LAYOUT --- */
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[250px] md:auto-rows-[300px]">
                {filteredProducts.map((product, i) => {
                  const isLarge = i === 0;
                  return (
                    <div 
                      key={product.id} 
                      className={`group relative overflow-hidden bg-[#0a0a0a] ${isLarge ? 'md:col-span-2 md:row-span-2' : 'md:col-span-1 md:row-span-1'}`}
                    >
                      {/* Mobile Safe Tap Target - Top Right */}
                      <button 
                        onClick={() => openQuickView({ ...product, quantity: 1 })}
                        className="md:hidden absolute top-3 right-3 z-30 bg-black/60 backdrop-blur-md p-3 rounded-full border border-white/20 active:bg-[#C5A059] transition-colors"
                      >
                        <Eye className="w-4 h-4 text-white" />
                      </button>

                      <img src={product.image} alt={product.name} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out" />
                      
                      {/* Desktop Hover Overlay - The whole overlay captures the hover reliably */}
                      <div className="hidden md:flex absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 items-center justify-center z-20 pointer-events-none group-hover:pointer-events-auto">
                        <button 
                          onClick={() => openQuickView({ ...product, quantity: 1 })}
                          className="bg-white/10 backdrop-blur-md text-white border border-white/20 text-xs uppercase tracking-widest px-8 py-3 hover:bg-white hover:text-black transition-colors duration-300 flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" /> View Product
                        </button>
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-4 md:p-8 z-10 pointer-events-none">
                        <span className="text-[#C5A059] text-[9px] md:text-[10px] uppercase tracking-widest mb-1 md:mb-2 block">{product.type}</span>
                        <h3 className={`font-light uppercase tracking-widest text-white ${isLarge ? 'text-xl md:text-3xl' : 'text-sm md:text-lg'}`}>{product.name}</h3>
                        <span className="text-white/70 font-mono text-xs md:text-sm mt-1 md:mt-2">${product.price}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* --- STANDARD LUXURY GRID (2 cols on Mobile, 3 on Desktop) --- */
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-16">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="flex flex-col">
                    <div className="group relative aspect-[3/4] bg-[#0a0a0a] overflow-hidden mb-4 md:mb-6">
                      
                      {/* Mobile Safe Tap Target */}
                      <button 
                        onClick={() => openQuickView({ ...product, quantity: 1 })}
                        className="md:hidden absolute bottom-3 right-3 z-30 bg-black/60 backdrop-blur-md p-2.5 rounded-full border border-white/20 active:bg-[#C5A059] transition-colors shadow-lg"
                      >
                        <Eye className="w-4 h-4 text-white" />
                      </button>

                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out opacity-90 group-hover:opacity-100" />
                      
                      {/* Desktop Hover Trigger */}
                      <div className="hidden md:flex absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 items-center justify-center z-10 pointer-events-none group-hover:pointer-events-auto">
                        <button 
                          onClick={() => openQuickView({ ...product, quantity: 1 })}
                          className="bg-white/10 backdrop-blur-md text-white border border-white/20 text-xs uppercase tracking-widest px-8 py-3 hover:bg-white hover:text-black transition-colors duration-300 flex items-center gap-2 shadow-2xl"
                        >
                          <Eye className="w-4 h-4" /> View
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start gap-1">
                      <div>
                        <h3 className="text-[11px] md:text-sm font-medium uppercase tracking-widest text-white mb-1 leading-tight">{product.name}</h3>
                        <span className="text-[9px] md:text-[10px] text-zinc-500 uppercase tracking-widest">{product.category}</span>
                      </div>
                      <span className="text-[11px] md:text-sm font-mono text-zinc-400">${product.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="w-full h-[50vh] flex flex-col items-center justify-center text-zinc-600">
              <span className="text-xl font-light uppercase tracking-widest mb-4">Archive Empty</span>
              <button onClick={() => { setActiveType("All"); setActiveCategory("All"); setSearchQuery(""); }} className="text-[#C5A059] text-xs uppercase tracking-widest border-b border-[#C5A059] pb-1 hover:text-white transition-colors">
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}