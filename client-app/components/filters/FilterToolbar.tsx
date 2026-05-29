import React, { useEffect, useState } from "react";
import { Filter, ChevronDown, LayoutGrid, List, Search, X } from "lucide-react";
import { getAllCategories } from "@/services/products";

interface FilterToolbarProps {
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  productCount: number;
  onOpenFilter: () => void;
}

export default function FilterToolbar({
  activeCategory,
  setActiveCategory,
  productCount,
  onOpenFilter
}: FilterToolbarProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("All");


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getAllCategories();
        const categoryNames = ["All", ...fetchedCategories.map((cat) => cat.name)];
        setCategories(categoryNames);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="bg-[#0a0a0a]/95 backdrop-blur-md border-b border-zinc-800/60 sticky top-16 z-40">
      <div className="flex flex-wrap md:flex-nowrap items-center justify-between px-4 md:px-8 min-h-12 gap-x-6 gap-y-2 py-2 md:py-0 max-w-400 mx-auto">

        {/* 1. QUICK CATEGORIES (Left) */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto md:flex-1 no-scrollbar [-ms-overflow-style:none] [scrollbar-width:none]">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-3 h-7 rounded-md text-[11px] font-medium tracking-wide transition-all ${activeCategory === cat
                ? "bg-zinc-100 text-black shadow-sm"
                : "bg-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 2. CONTROLS (Right) */}
        <div className="flex items-center justify-between w-full md:w-auto shrink-0 gap-3 md:gap-4">

          {/* A. Expandable Search */}
          <div
            className={`flex items-center bg-zinc-900 border border-zinc-800 rounded-full h-8 transition-all duration-300 overflow-hidden ${isSearchActive ? "w-full md:w-48 px-3" : "w-8 justify-center cursor-pointer hover:bg-zinc-800"
              }`}
            onClick={() => !isSearchActive && setIsSearchActive(true)}
          >
            <Search size={14} className="text-zinc-400 shrink-0" />
            {isSearchActive && (
              <>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="bg-transparent border-none outline-none text-xs text-white px-2 w-full placeholder:text-zinc-600"
                  autoFocus
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSearchActive(false);
                    setSearchQuery("");
                  }}
                  className="text-zinc-500 hover:text-zinc-300 shrink-0"
                >
                  <X size={14} />
                </button>
              </>
            )}
          </div>

          <div className="h-4 w-px bg-zinc-800 hidden lg:block" />

          {/* B. Sort Dropdown (Minimal) */}
          <button className="flex items-center gap-1.5 h-8 px-2 rounded-md text-[11px] tracking-wide text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-all group">
            <span className="text-zinc-500 hidden sm:inline">Sort:</span>
            Newest
            <ChevronDown size={14} className="text-zinc-500 group-hover:text-zinc-300" />
          </button>

          <div className="h-4 w-px bg-zinc-800 hidden sm:block" />

          {/* C. View Toggles (Segmented Control Style) */}
          <div className="hidden sm:flex items-center bg-zinc-900 p-0.5 rounded-md border border-zinc-800">
            <button className="p-1 rounded-sm bg-zinc-700 text-white shadow-sm transition-all">
              <LayoutGrid size={14} />
            </button>
            <button className="p-1 rounded-sm text-zinc-500 hover:text-zinc-300 transition-all">
              <List size={14} />
            </button>
          </div>

          <div className="h-4 w-px bg-zinc-800" />

          {/* D. Advanced Filter Action (Emphasized) */}
          <button
            onClick={onOpenFilter}
            className="flex items-center gap-2 h-8 px-3 rounded-md bg-white text-black hover:bg-zinc-200 transition-colors text-[11px] font-semibold tracking-wide"
          >
            <Filter size={12} strokeWidth={2.5} />
            <span>Filter</span>
            {/* Optional: Indicator for active filters */}
            <span className="flex items-center justify-center h-4 w-4 rounded-full bg-black text-white text-[9px] ml-1">
              3
            </span>
          </button>

        </div>
      </div>
    </div>
  );
}