"use client";

import React, { useState, useMemo } from "react";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useQuickView } from "@/lib/QuickViewContext";

const CATEGORIES = ["All", "Trending", "Bong", "States", "Gym", "Spiritual", "Anime", "Abstract", "Gothic", "Corporate", "Kpop"];
const PRODUCT_TYPES = ["All", "T-Shirt", "Oversized", "Hoodies", "Accessories", "Others"];
const SORT_OPTIONS = ["New In", "Price: Low to High", "Price: High to Low"];

// Added 'hoverImage' to demonstrate the Zara-style editorial crossfade on hover
const MOCK_PRODUCTS = [
  { id: "p1", name: "Gothic Skull Premium", price: 145, type: "Oversized", category: "Gothic", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80", hoverImage: "https://images.unsplash.com/photo-1550614000-4b95d4ed141b?w=800&q=80" },
  { id: "p2", name: "Tokyo Drift Silk Tee", price: 130, type: "T-Shirt", category: "Anime", image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80", hoverImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80" },
  { id: "p3", name: "Corporate Archive", price: 125, type: "T-Shirt", category: "Corporate", image: "https://images.unsplash.com/photo-1618517351616-38fb9c52ce37?w=800&q=80" },
  { id: "p4", name: "Heavyweight Pump", price: 150, type: "Oversized", category: "Gym", image: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800&q=80", hoverImage: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80" },
  { id: "p5", name: "Bengal Heritage", price: 135, type: "T-Shirt", category: "Bong", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80" },
  { id: "p6", name: "Kashmir Cashmere", price: 240, type: "Hoodies", category: "States", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80", hoverImage: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80" },
  { id: "p7", name: "Goa Linen Blend", price: 110, type: "T-Shirt", category: "States", image: "https://images.unsplash.com/photo-1550614000-4b95d4ed141b?w=800&q=80" },
  { id: "p8", name: "Punjab Heavyweight", price: 160, type: "Oversized", category: "States", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80" },
  { id: "p9", name: "Kerala Loom Tee", price: 120, type: "T-Shirt", category: "States", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80" },
  { id: "p10", name: "Spiritual Mandala", price: 140, type: "Oversized", category: "Spiritual", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80" },
  { id: "p11", name: "Abstract Flow", price: 155, type: "T-Shirt", category: "Abstract", image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80" },
  { id: "p12", name: "Seoul Wave", price: 130, type: "Oversized", category: "Kpop", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80" },
];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeType, setActiveType] = useState("All");
  const [sortBy, setSortBy] = useState("New In");
  const [filterOpen, setFilterOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const { openQuickView } = useQuickView();

  const filtered = useMemo(() => {
    let list = MOCK_PRODUCTS.filter((p) => {
      const matchCat = activeCategory === "All" || p.category === activeCategory;
      const matchType = activeType === "All" || p.type === activeType;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchType && matchSearch;
    });
    if (sortBy === "Price: Low to High") list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "Price: High to Low") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [activeCategory, activeType, sortBy, search]);

  return (
    <div className="bg-(--black) min-h-screen text-(--beige) pt-16">

      {/* FILTER DRAWER OVERLAY */}
      <div
        className={`fixed inset-0 bg-black/80 z-[90] backdrop-blur-sm transition-opacity duration-300 ${
          filterOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setFilterOpen(false)}
      />

      {/* FILTER DRAWER - DARK THEME */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-[400px] bg-(--black) border-l border-(--gray-800) z-[100] transform transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col ${
          filterOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-8 py-6 border-b border-(--gray-800)">
          <span className="font-sans text-[11px] font-semibold tracking-[0.2em] uppercase text-(--beige)">
            Filter & Sort
          </span>
          <button
            onClick={() => setFilterOpen(false)}
            className="text-(--beige) hover:text-(--orange) transition-colors"
          >
            <X size={24} strokeWidth={1} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-10 space-y-12">
          {/* Product Type Filter */}
          <div>
            <span className="block font-sans text-[10px] tracking-[0.2em] uppercase text-(--gray-400) mb-6">
              Product Type
            </span>
            <div className="flex flex-col space-y-5">
              {PRODUCT_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveType(t)}
                  className={`text-left font-sans text-[12px] tracking-[0.15em] uppercase transition-colors ${
                    activeType === t
                      ? "text-(--orange) font-medium"
                      : "text-(--beige) hover:text-(--orange)"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Filter */}
          <div>
            <span className="block font-sans text-[10px] tracking-[0.2em] uppercase text-(--gray-400) mb-6">
              Sort By
            </span>
            <div className="flex flex-col space-y-5">
              {SORT_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`text-left font-sans text-[12px] tracking-[0.15em] uppercase transition-colors ${
                    sortBy === s
                      ? "text-(--orange) font-medium"
                      : "text-(--beige) hover:text-(--orange)"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-(--gray-800) flex gap-4 bg-(--black)">
          <button
            onClick={() => {
              setActiveType("All");
              setSortBy("New In");
            }}
            className="flex-1 py-4 font-sans text-[10px] font-semibold tracking-[0.2em] uppercase border border-(--gray-600) text-(--beige) hover:bg-(--beige) hover:text-(--black) hover:border-(--beige) transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => setFilterOpen(false)}
            className="flex-1 py-4 font-sans text-[10px] font-semibold tracking-[0.2em] uppercase bg-(--beige) text-(--black) hover:bg-(--orange) hover:border-(--orange) hover:text-(--black) border border-(--beige) transition-colors"
          >
            Apply
          </button>
        </div>
      </aside>

      {/* TOP NAVIGATION TABS (Edge-to-Edge) */}
      <div className="z-40 border-b border-(--gray-800)">
        <div className="flex items-center overflow-x-auto no-scroll px-6 md:px-12 gap-8 md:gap-12 pt-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 font-sans text-[11.5px] tracking-[0.15em] uppercase pb-5 border-b-[3px] transition-colors ${
                activeCategory === cat ? "border-(--orange) text-(--orange)" : "border-transparent text-(--gray-400) hover:text-(--orange)"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        {/* Filter + Sort row */}
        <div className="flex items-center justify-between px-6 md:px-12 py-5 border-t border-(--gray-900)">
          <div className="flex items-center gap-6 md:gap-10">
            <button
              onClick={() => setFilterOpen(true)}
              className="flex items-center gap-3 font-sans text-[11px] uppercase tracking-[0.15em] text-(--beige) hover:text-(--orange) transition-colors"
            >
              <SlidersHorizontal size={16} strokeWidth={1.5} />
              FILTERS
            </button>
            <span className="font-sans text-[11px] uppercase tracking-[0.15em] text-(--gray-400)">
              {filtered.length} ITEMS
            </span>
          </div>

          <div className="relative group">
            <button className="flex items-center gap-3 font-sans text-[11px] uppercase tracking-[0.15em] text-(--beige) hover:text-(--orange) transition-colors">
              {sortBy} <ChevronDown size={14} strokeWidth={1.5} />
            </button>
            
            <div className="absolute right-0 top-full mt-3 bg-(--gray-900) border border-(--gray-800) shadow-lg z-50 hidden group-hover:block min-w-max py-2">
              {SORT_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`block w-full text-left px-8 py-4 font-sans text-[11px] uppercase tracking-[0.12em] transition-colors ${
                    sortBy === s ? "font-medium text-(--orange)" : "text-(--beige) hover:bg-(--black) hover:text-(--orange)"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* EDGE-TO-EDGE PRODUCT GRID */}
      <div className="w-full border-b border-(--gray-800)">
        {filtered.length === 0 ? (
          <div className="text-center py-32 font-sans text-[12px] tracking-[0.15em] uppercase text-(--gray-400)">
            <p className="mb-6">No items found</p>
            <button
              onClick={() => { setActiveCategory("All"); setActiveType("All"); setSearch(""); }}
              className="text-(--orange) border-b border-(--orange) pb-1 hover:opacity-75 transition-opacity"
            >
              CLEAR FILTERS
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 w-full border-l border-(--gray-800)">
            {filtered.map((product) => (
              <div 
                key={product.id}
                className="group relative border-r border-b border-(--gray-800) overflow-hidden bg-(--gray-900) block cursor-pointer"
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Image Wrapper: Clicking the image routes to the Product Detail Page */}
                <Link href={`/products/${product.id}`} className="block w-full relative" style={{ aspectRatio: "2/3" }}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${hoveredId === product.id && product.hoverImage ? "opacity-0" : "opacity-100"}`} 
                  />
                  {/* Secondary Hover Image */}
                  {product.hoverImage && (
                    <img 
                      src={product.hoverImage} 
                      alt={`${product.name} Alt`} 
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${hoveredId === product.id ? "opacity-100" : "opacity-0"}`} 
                    />
                  )}
                  {/* Subtle gradient so text overlay is always readable */}
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
                </Link>

                {/* Overlaid Info (Product Name & Price) */}
                <div className="absolute bottom-6 left-4 right-4 flex justify-between items-end z-10 pointer-events-none">
                  <div className="max-w-[70%]">
                    <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-(--beige) leading-relaxed">
                      {product.name}
                    </p>
                    <p className="font-sans text-[9px] tracking-[0.15em] uppercase text-(--gray-400) mt-1">
                      {product.category}
                    </p>
                  </div>
                  <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-(--beige)">
                    ${product.price}
                  </p>
                </div>

                {/* Quick Add Overlay: Clicking this triggers your original QuickViewContext logic */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openQuickView({ ...product, quantity: 1 });
                  }}
                  className="absolute bottom-0 left-0 right-0 bg-(--orange) text-(--black) font-bold text-center py-4 font-sans text-[11px] tracking-[0.15em] uppercase transition-transform duration-300 z-20"
                  style={{ transform: hoveredId === product.id ? "translateY(0)" : "translateY(100%)" }}
                >
                  Quick Add
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}