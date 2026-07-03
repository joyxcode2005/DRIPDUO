"use client";

import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react"; // Imported X icon

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
    onSearchSubmit?: () => void; // Optional prop for when Enter is pressed
}

export default function FilterToolbar({
    categoryTree,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    productCount,
    onOpenFilter,
    onSearchSubmit,
}: FilterToolbarProps) {
    
    // Handles the Enter key press
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault(); // Prevents page reload
        if (onSearchSubmit) {
            onSearchSubmit();
        }
    };

    return (
        <div className="w-full flex flex-col xl:flex-row justify-between items-center gap-6 pb-6 mb-6 border-b border-white/10">

            {/* Left: Category Scrollable Container */}
            <div
                className="flex items-center gap-3 overflow-x-auto w-full pb-2 xl:pb-0"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {/* "All" Button */}
                <button
                    onClick={() => setActiveCategory("All")}
                    className="relative px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors focus:outline-none cursor-pointer"
                >
                    {activeCategory === "All" && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-white rounded-full z-0 pointer-events-none"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <span className={`relative z-10 transition-colors duration-300 ${activeCategory === "All" ? "text-black" : "text-neutral-400 hover:text-white"}`}>
                        All
                    </span>
                </button>

                {/* Dynamic Categories */}
                {categoryTree.map((parent) => {
                    const hasChildren = parent.subcategories?.length > 0;

                    // 1. Single Category (No Children)
                    if (!hasChildren) {
                        return (
                            <button
                                key={parent.id}
                                onClick={() => setActiveCategory(parent.slug)}
                                className="relative px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors focus:outline-none cursor-pointer"
                            >
                                {activeCategory === parent.slug && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-white rounded-full z-0 pointer-events-none"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className={`relative z-10 transition-colors duration-300 ${activeCategory === parent.slug ? "text-black" : "text-neutral-400 hover:text-white"}`}>
                                    {parent.name}
                                </span>
                            </button>
                        );
                    }

                    // 2. Parent with Children (Grouped Inline Pill)
                    return (
                        <div key={parent.id} className="flex items-center p-1.5 rounded-full bg-neutral-900/50 border border-white/5 whitespace-nowrap backdrop-blur-md">
                            {/* Parent Tab */}
                            <button
                                onClick={() => setActiveCategory(parent.slug)}
                                className="relative px-5 py-2 rounded-full text-sm font-semibold transition-colors focus:outline-none cursor-pointer"
                            >
                                {activeCategory === parent.slug && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-white rounded-full z-0 pointer-events-none"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className={`relative z-10 transition-colors duration-300 ${activeCategory === parent.slug ? "text-black" : "text-neutral-300 hover:text-white"}`}>
                                    {parent.name}
                                </span>
                            </button>

                            {/* Divider */}
                            <div className="w-px h-5 bg-white/10 mx-1"></div>

                            {/* Children Tabs */}
                            <div className="flex items-center gap-1">
                                {parent.subcategories?.map((child) => (
                                    <button
                                        key={child.id}
                                        onClick={() => setActiveCategory(child.slug)}
                                        className="relative px-4 py-2 rounded-full text-xs tracking-wide transition-all focus:outline-none cursor-pointer"
                                    >
                                        {activeCategory === child.slug && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 bg-neutral-700 rounded-full z-0 pointer-events-none"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <span className={`relative z-10 transition-colors duration-300 ${activeCategory === child.slug ? "text-white font-medium" : "text-neutral-500 hover:text-neutral-300"}`}>
                                            {child.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Right: Search & Filters */}
            <div className="flex items-center gap-3 w-full xl:w-auto shrink-0">
                
                {/* Search Bar (Now wrapped in a form) */}
                <form 
                    onSubmit={handleSearch}
                    className="relative w-full xl:w-72 group"
                >
                    <Search
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-white transition-colors"
                    />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        // Added pr-10 to prevent text from going under the X button, and focus:ring for better visibility
                        className="w-full bg-neutral-900/50 border border-white/10 text-white placeholder-neutral-500 text-sm pl-11 pr-10 py-2.5 rounded-full outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 focus:bg-neutral-800 transition-all backdrop-blur-md"
                    />
                    
                    {/* Clear Button (UX Addition) */}
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-white transition-colors cursor-pointer rounded-full hover:bg-white/10"
                            aria-label="Clear search"
                        >
                            <X size={14} />
                        </button>
                    )}
                </form>

                {/* Product Count Indicator */}
                <div className="hidden md:flex items-center justify-center px-4 py-2.5 rounded-full bg-neutral-900/50 border border-white/5 backdrop-blur-md">
                    <span className="text-neutral-400 text-xs tracking-widest uppercase font-medium whitespace-nowrap">
                        {productCount} items
                    </span>
                </div>

                {/* Filter Trigger Button */}
                <button
                    onClick={onOpenFilter}
                    className="flex items-center gap-2 bg-white text-black hover:bg-neutral-200 px-5 py-2.5 rounded-full text-sm font-medium transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] cursor-pointer"
                >
                    <SlidersHorizontal size={16} />
                    <span>Filters</span>
                </button>
            </div>
        </div>
    );
}