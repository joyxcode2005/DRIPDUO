"use client";

import React, { useState, useMemo } from "react";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { useQuickView } from "@/lib/QuickViewContext";

const CATEGORIES = ["All", "Trending", "Bong", "States", "Gym", "Spiritual", "Anime", "Abstract", "Gothic", "Corporate", "Kpop"];
const PRODUCT_TYPES = ["All", "T-Shirt", "Oversized", "Hoodies", "Accessories", "Others"];
const SORT_OPTIONS = ["New In", "Price: Low to High", "Price: High to Low"];

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
    <div className="bg-(--black) min-h-screen text-(--beige) pt-14" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>

      {/* FILTER SIDEBAR (mobile & desktop) */}
      {filterOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-[75] backdrop-blur-sm transition-opacity"
          onClick={() => setFilterOpen(false)}
        />
      )}
      <aside className={`filter-sidebar ${filterOpen ? "open" : ""}`} style={{ zIndex: 80 }}>
        <div className="flex items-center justify-between mb-12 text-(--beige)">
          <span className="label" style={{ fontSize: "12px", letterSpacing: "0.15em" }}>FILTERS</span>
          <button onClick={() => setFilterOpen(false)} className="hover:text-(--orange) transition-colors">
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        {/* Type filter */}
        <div className="mb-10">
          <p className="label text-(--orange) mb-6" style={{ fontSize: "11px" }}>Category</p>
          {PRODUCT_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className="block w-full text-left py-3 label hover:text-(--orange) transition-colors"
              style={{
                fontSize: "12px",
                fontWeight: activeType === t ? 500 : 400,
                color: activeType === t ? "var(--orange)" : "var(--beige)",
                borderBottom: activeType === t ? "1px solid var(--orange)" : "none",
                letterSpacing: "0.12em"
              }}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div>
          <p className="label text-(--orange) mb-6" style={{ fontSize: "11px" }}>Sort By</p>
          {SORT_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className="block w-full text-left py-3 label hover:text-(--orange) transition-colors"
              style={{ 
                fontSize: "12px", 
                fontWeight: sortBy === s ? 500 : 400,
                color: sortBy === s ? "var(--orange)" : "var(--beige)",
                letterSpacing: "0.12em"
              }}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      </aside>

      {/* TOP BAR (non-sticky, spacious) */}
      <div className="z-40 bg-(--black) border-b border-(--gray-800) pt-6">
        
        {/* Category tabs */}
        <div className="flex items-center overflow-x-auto no-scroll px-6 md:px-12 gap-8 md:gap-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="flex-shrink-0 label pb-5 border-b-[3px] transition-colors hover:text-[var(--orange)]"
              style={{
                fontSize: "11.5px",
                letterSpacing: "0.15em",
                borderColor: activeCategory === cat ? "var(--orange)" : "transparent",
                color: activeCategory === cat ? "var(--orange)" : "var(--gray-400)",
              }}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Filter + Sort row */}
        <div className="flex items-center justify-between px-6 md:px-12 py-5 border-t border-[var(--gray-900)]">
          <div className="flex items-center gap-6 md:gap-10">
            <button
              onClick={() => setFilterOpen(true)}
              className="flex items-center gap-3 label text-(--beige) hover:text-(--orange) transition-colors"
              style={{ fontSize: "11px", letterSpacing: "0.15em" }}
            >
              <SlidersHorizontal size={16} strokeWidth={1.5} />
              FILTERS
            </button>
            <span className="label text-(--gray-400)" style={{ fontSize: "11px", letterSpacing: "0.15em" }}>
              {filtered.length} ITEMS
            </span>
          </div>

          {/* Sort dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-3 label text-(--beige) hover:text-(--orange) transition-colors" style={{ fontSize: "11px", letterSpacing: "0.15em" }}>
              {sortBy.toUpperCase()} <ChevronDown size={14} strokeWidth={1.5} />
            </button>
            
            {/* Dropdown Menu - Spacious */}
            <div className="absolute right-0 top-full mt-3 bg-(--gray-900) border border-(--gray-800) shadow-lg z-50 hidden group-hover:block min-w-max py-2">
              {SORT_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className="block w-full text-left px-8 py-4 label text-(--beige) hover:bg-(--black) hover:text-(--orange) transition-colors"
                  style={{ fontSize: "11px", fontWeight: sortBy === s ? 500 : 400, letterSpacing: "0.12em" }}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="px-6 md:px-12 py-12 md:py-16">
        {filtered.length === 0 ? (
          <div className="text-center py-32">
            <p className="label text-(--gray-400) mb-6" style={{ fontSize: "12px", letterSpacing: "0.15em" }}>No items found</p>
            <button
              onClick={() => { setActiveCategory("All"); setActiveType("All"); setSearch(""); }}
              className="label text-(--orange) border-b border-(--orange) pb-1 hover:opacity-75 transition-opacity"
              style={{ fontSize: "11px", letterSpacing: "0.15em" }}
            >
              CLEAR FILTERS
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-12 md:gap-y-16">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="group cursor-pointer"
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => openQuickView({ ...product, quantity: 1 })}
              >
                {/* Image Wrapper */}
                <div className="product-img-wrap relative border border-(--gray-800) group-hover:border-(--orange) transition-colors" style={{ aspectRatio: "3/4" }}>
                  <img src={product.image} alt={product.name} />

                  {/* Quick add overlay */}
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-(--orange) text-(--black) font-bold text-center py-4 label transition-transform duration-300"
                    style={{
                      fontSize: "11px",
                      letterSpacing: "0.15em",
                      transform: hoveredId === product.id ? "translateY(0)" : "translateY(100%)",
                    }}
                  >
                    Quick Add
                  </div>
                </div>

                {/* Product info */}
                <div className="mt-5 flex justify-between items-start">
                  <div>
                    <p className="label text-(--beige) group-hover:text-(--orange) transition-colors" style={{ fontSize: "11px", lineHeight: 1.5 }}>
                      {product.name}
                    </p>
                    <p className="label text-(--gray-400) mt-1.5" style={{ fontSize: "10px", letterSpacing: "0.15em" }}>
                      {product.category}
                    </p>
                  </div>
                  <p className="label text-(--beige) shrink-0 ml-4" style={{ fontSize: "11px" }}>
                    ${product.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}