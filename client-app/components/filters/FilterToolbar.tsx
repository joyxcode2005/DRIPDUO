"use client";

import React from "react";

type Category = {
    id: string;
    name: string;
    slug: string;
    is_active: boolean;
    parent_id: string | null;
};

type CategoryWithSubs = Category & { subcategories: Category[] };

interface FilterToolbarProps {
    categoryTree: CategoryWithSubs[];
    activeCategory: string;
    setActiveCategory: (slug: string) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    productCount: number;
    onOpenFilter: () => void;
}

export default function FilterToolbar({
    categoryTree,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    productCount,
    onOpenFilter,
}: FilterToolbarProps) {
    return (
        <div className="w-full flex flex-col lg:flex-row justify-between items-center gap-4 pb-4 mb-6 border-b border-white/10">
            
            {/* Left: Category Scrollable Container */}
            <div className="flex items-center gap-3 overflow-x-auto w-full no-scrollbar pb-2 lg:pb-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                
                {/* "All" Button */}
                <button
                    onClick={() => setActiveCategory("All")}
                    className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                        activeCategory === "All" ? "bg-white text-black" : "bg-transparent border border-white/20 text-white hover:bg-white/10"
                    }`}
                >
                    All
                </button>

                {/* Dynamic Categories */}
                {categoryTree.map((parent) => {
                    const hasChildren = parent.subcategories.length > 0;

                    // 1. Single Category (No Children)
                    if (!hasChildren) {
                        return (
                            <button
                                key={parent.id}
                                onClick={() => setActiveCategory(parent.slug)}
                                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                                    activeCategory === parent.slug
                                        ? "bg-white text-black"
                                        : "bg-transparent border border-white/20 text-white hover:bg-white/10"
                                }`}
                            >
                                {parent.name}
                            </button>
                        );
                    }

                    // 2. Parent with Children (Grouped Inline Pill)
                    return (
                        <div key={parent.id} className="flex items-center p-1 rounded-full bg-white/5 border border-white/10 whitespace-nowrap">
                            
                            {/* Parent Tab */}
                            <button
                                onClick={() => setActiveCategory(parent.slug)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                    activeCategory === parent.slug
                                        ? "bg-white text-black"
                                        : "text-white hover:text-gray-300"
                                }`}
                            >
                                {parent.name}
                            </button>

                            {/* Divider */}
                            <div className="w-[1px] h-4 bg-white/20 mx-2"></div>

                            {/* Children Tabs */}
                            <div className="flex items-center gap-1">
                                {parent.subcategories.map(child => (
                                    <button
                                        key={child.id}
                                        onClick={() => setActiveCategory(child.slug)}
                                        className={`px-3 py-1.5 rounded-full text-xs tracking-wide transition-all ${
                                            activeCategory === child.slug
                                                ? "bg-white/20 text-white font-semibold"
                                                : "text-gray-400 hover:text-white hover:bg-white/10"
                                        }`}
                                    >
                                        {child.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Right: Search & Filters */}
            <div className="flex items-center gap-4 w-full lg:w-auto shrink-0">
                <div className="relative w-full lg:w-64">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm px-4 py-2 rounded-full outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                    />
                </div>
                
                <span className="text-gray-500 text-xs tracking-widest uppercase hidden sm:block whitespace-nowrap">
                    {productCount} items
                </span>
                
                <button 
                    onClick={onOpenFilter} 
                    className="bg-white/10 hover:bg-white/20 border border-white/10 px-5 py-2 rounded-full text-sm text-white transition-colors"
                >
                    Filters
                </button>
            </div>
        </div>
    );
}