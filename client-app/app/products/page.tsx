"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Filter, Search, X } from "lucide-react";

// 1. Import the Modal and CartItem type
import { QuickViewModal } from "@/components/ui/quick-view-modal";
import { CartItem } from "@/lib/CartContext";

const CATEGORIES = ["All", "Trending memes", "Bong", "States", "Gym", "Spiritual", "Anime", "Abstract", "Gothic", "Corporate", "Kpop"];
const PRODUCT_TYPES = ["All", "T-Shirt", "Oversized", "Hoodies", "Accessories", "Others"];

const MOCK_PRODUCTS = [
  { id: 1, name: "Gothic Skull Premium", price: 145, type: "Oversized", category: "Gothic", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80" },
  { id: 2, name: "Tokyo Drift Silk Tee", price: 130, type: "T-Shirt", category: "Anime", image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80" },
  { id: 3, name: "Corporate Archive", price: 125, type: "T-Shirt", category: "Corporate", image: "https://images.unsplash.com/photo-1618517351616-38fb9c52ce37?w=800&q=80" },
  { id: 4, name: "Heavyweight Pump", price: 150, type: "Oversized", category: "Gym", image: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800&q=80" },
  { id: 5, name: "Bengal Heritage", price: 135, type: "T-Shirt", category: "Bong", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80" },
  // States specific data for Bento
  { id: 6, name: "Kashmir Cashmere", price: 240, type: "Hoodies", category: "States", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80" },
  { id: 7, name: "Goa Linen Blend", price: 110, type: "T-Shirt", category: "States", image: "https://images.unsplash.com/photo-1550614000-4b95d4ed141b?w=800&q=80" },
  { id: 8, name: "Punjab Heavyweight", price: 160, type: "Oversized", category: "States", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80" },
  { id: 9, name: "Kerala Loom Tee", price: 120, type: "T-Shirt", category: "States", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80" },
];

export default function ProductsPage() {
  const [activeType, setActiveType] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // 2. Add Quick View State
  const [selectedProduct, setSelectedProduct] = useState<CartItem | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Filtering Logic
  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    return (activeType === "All" || product.type === activeType) &&
           (activeCategory === "All" || product.category === activeCategory);
  });

  // 3. Quick View Handler
  const handleQuickView = (product: any, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents navigating away if the card is ever wrapped in a Link
    setSelectedProduct({ ...product, quantity: 1 });
    setIsQuickViewOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#f8f8f8] flex flex-col md:flex-row font-sans selection:bg-[#C5A059] selection:text-black">
      
      {/* MOBILE FILTERS TOGGLE */}
      <div className="md:hidden p-4 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#050505]/90 backdrop-blur z-30 mt-[68px]">
        <span className="font-black tracking-widest uppercase text-[#C5A059]">Dripduo</span>
        <button onClick={() => setIsMobileFiltersOpen(true)} className="flex items-center gap-2 text-xs tracking-widest uppercase border border-white/20 px-4 py-2 hover:bg-white/5 transition-colors">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      {/* SIDEBAR (Responsive) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-full sm:w-80 bg-[#0a0a0a] border-r border-white/5 p-8 transform transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] md:relative md:translate-x-0 md:h-screen md:sticky md:top-0 md:overflow-y-auto md:pt-32 ${isMobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center mb-12">
          <Link href="/" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors uppercase font-medium tracking-widest text-xs">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <button onClick={() => setIsMobileFiltersOpen(false)} className="md:hidden text-zinc-500 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <h2 className="text-2xl font-black uppercase tracking-widest mb-10 text-white">The <br/><span className="text-[#C5A059]">Collection.</span></h2>

        <div className="mb-10">
          <div className="flex items-center gap-3 border-b border-white/10 pb-2 focus-within:border-[#C5A059] transition-colors">
            <Search className="w-4 h-4 text-zinc-600" />
            <input type="text" placeholder="Search archive..." className="bg-transparent border-none outline-none w-full text-xs font-mono uppercase text-white placeholder-zinc-600" />
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
      <main className="flex-1 flex flex-col min-h-screen pt-0 md:pt-[68px]">
        
        {/* LUXURY TOP CATEGORIES BAR */}
        <div className="sticky top-0 md:top-[68px] z-20 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 md:py-6">
          <div className="flex overflow-x-auto scrollbar-hide gap-6 items-center">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap pb-1 text-xs uppercase tracking-widest transition-all duration-500 border-b ${
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

        {/* PRODUCTS GRID (Standard vs Bento) */}
        <div className="p-6 md:p-12 flex-1">
          <div className="mb-12 flex justify-between items-end border-b border-white/5 pb-6">
            <h1 className="text-3xl md:text-4xl font-light uppercase tracking-[0.1em]">
              {activeCategory === "All" ? "Latest Archive" : activeCategory}
            </h1>
            <span className="text-zinc-600 font-mono text-xs tracking-widest">{filteredProducts.length} Pieces</span>
          </div>

          {filteredProducts.length > 0 ? (
            activeCategory === "States" ? (
              /* --- BENTO BOX LAYOUT (For States) --- */
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:auto-rows-[300px]">
                {filteredProducts.map((product, i) => {
                  const isLarge = i === 0;
                  return (
                    <div key={product.id} className={`group cursor-pointer relative overflow-hidden bg-[#0a0a0a] ${isLarge ? 'md:col-span-2 md:row-span-2' : 'md:col-span-1 md:row-span-1'}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out" />
                      
                      {/* Quick View Overlay (Center) */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center z-20">
                        <button 
                          onClick={(e) => handleQuickView(product, e)}
                          className="bg-white/10 backdrop-blur-md text-white border border-white/20 text-xs uppercase tracking-widest px-8 py-3 hover:bg-white hover:text-black transition-colors duration-300"
                        >
                          Quick View
                        </button>
                      </div>

                      {/* Info Overlay (Bottom) */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-8 z-10 pointer-events-none">
                        <span className="text-[#C5A059] text-[10px] uppercase tracking-widest mb-2 block">{product.type}</span>
                        <h3 className={`font-light uppercase tracking-widest text-white ${isLarge ? 'text-2xl md:text-3xl' : 'text-lg'}`}>{product.name}</h3>
                        <span className="text-white/70 font-mono text-sm mt-2">${product.price}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* --- STANDARD LUXURY GRID --- */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="group cursor-pointer flex flex-col">
                    <div className="relative aspect-[3/4] bg-[#0a0a0a] overflow-hidden mb-6">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out opacity-90 group-hover:opacity-100" />
                      
                      {/* 4. Implement Quick View Button */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center z-10">
                        <button 
                          onClick={(e) => handleQuickView(product, e)}
                          className="bg-white/10 backdrop-blur-md text-white border border-white/20 text-xs uppercase tracking-widest px-8 py-3 hover:bg-white hover:text-black transition-colors duration-300"
                        >
                          Quick View
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-medium uppercase tracking-widest text-white mb-1">{product.name}</h3>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{product.category}</span>
                      </div>
                      <span className="text-sm text-zinc-400">${product.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="w-full h-[50vh] flex flex-col items-center justify-center text-zinc-600">
              <span className="text-xl font-light uppercase tracking-widest mb-4">Archive Empty</span>
              <button onClick={() => { setActiveType("All"); setActiveCategory("All"); }} className="text-[#C5A059] text-xs uppercase tracking-widest border-b border-[#C5A059] pb-1 hover:text-white transition-colors">
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* 5. Render the Modal */}
        <QuickViewModal 
          isOpen={isQuickViewOpen} 
          onClose={() => setIsQuickViewOpen(false)} 
          product={selectedProduct} 
        />
      </main>
    </div>
  );
}