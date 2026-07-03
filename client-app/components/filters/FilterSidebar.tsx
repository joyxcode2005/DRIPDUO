"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown } from "lucide-react";

// Assuming these types match your main file
type Category = { id: string; name: string; slug: string; parent_id: string | null; };
type CategoryWithSubs = Category & { subcategories: Category[]; };
type Product_Type = { id: string; name: string; slug: string; };

interface FilterSidebarProps {
    isOpen: boolean;
    onClose: () => void;

    // Product Types
    productTypes: Product_Type[];
    activeType: string;
    setActiveType: (val: string) => void;

    // Categories (Added these to handle the parent/child structure)
    categoryTree: CategoryWithSubs[];
    activeCategory: string;
    setActiveCategory: (val: string) => void;
}

export default function FilterSidebar({
    isOpen,
    onClose,
    productTypes,
    activeType,
    setActiveType,
    categoryTree,
    activeCategory,
    setActiveCategory,
}: FilterSidebarProps) {
    // Keep track of which parent categories are expanded in the UI
    const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({});

    const toggleExpand = (slug: string) => {
        setExpandedParents(prev => ({ ...prev, [slug]: !prev[slug] }));
    };

    return (
        <>
            {/* Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 z-55 backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 z-55 h-full w-full max-w-sm bg-neutral-900 border-l border-neutral-800 text-white overflow-y-auto shadow-2xl"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-medium tracking-wide">Filters</h2>
                                <button onClick={onClose} className="p-2 hover:bg-neutral-800 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* --- PRODUCT TYPES --- */}
                            <div className="mb-8">
                                <h3 className="text-sm text-neutral-400 uppercase tracking-widest mb-4">Product Type</h3>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setActiveType("All")}
                                        className={`px-4 py-2 text-sm rounded-full transition-all ${activeType === "All" ? "bg-white text-black" : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                                            }`}
                                    >
                                        All
                                    </button>
                                    {productTypes.map((type) => (
                                        <button
                                            key={type.id}
                                            onClick={() => setActiveType(type.slug)}
                                            className={`px-4 py-2 text-sm rounded-full transition-all ${activeType === type.slug ? "bg-white text-black" : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                                                }`}
                                        >
                                            {type.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <hr className="border-neutral-800 mb-8" />

                            {/* --- CATEGORIES WITH SUB-CATEGORIES --- */}
                            <div>
                                <h3 className="text-sm text-neutral-400 uppercase tracking-widest mb-4">Categories</h3>

                                <button
                                    onClick={() => setActiveCategory("All")}
                                    className={`w-full text-left px-4 py-3 rounded-xl mb-2 transition-all ${activeCategory === "All" ? "bg-neutral-800 font-medium" : "hover:bg-neutral-800/50 text-neutral-300"
                                        }`}
                                >
                                    All Categories
                                </button>

                                <div className="space-y-2">
                                    {categoryTree.map((parent) => {
                                        const isExpanded = expandedParents[parent.slug];
                                        const hasSubs = parent.subcategories && parent.subcategories.length > 0;

                                        return (
                                            <div key={parent.id} className="rounded-xl overflow-hidden">
                                                {/* Parent Button */}
                                                <div className="flex">
                                                    <button
                                                        onClick={() => setActiveCategory(parent.slug)}
                                                        className={`flex-1 text-left px-4 py-3 transition-all ${activeCategory === parent.slug ? "bg-neutral-800 font-medium" : "hover:bg-neutral-800/50 text-neutral-300"
                                                            }`}
                                                    >
                                                        {parent.name}
                                                    </button>

                                                    {/* Toggle Subcategories Button */}
                                                    {hasSubs && (
                                                        <button
                                                            onClick={() => toggleExpand(parent.slug)}
                                                            className="px-4 py-3 hover:bg-neutral-800/50 text-neutral-400 transition-colors flex items-center justify-center"
                                                        >
                                                            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                                                                <ChevronDown size={18} />
                                                            </motion.div>
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Animated Subcategories Dropdown */}
                                                <AnimatePresence initial={false}>
                                                    {hasSubs && isExpanded && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                                            className="overflow-hidden bg-neutral-950/30"
                                                        >
                                                            <div className="py-1 px-4 flex flex-col border-l-2 border-neutral-800 ml-4 mb-2 mt-1">
                                                                {parent.subcategories.map((sub) => (
                                                                    <button
                                                                        key={sub.id}
                                                                        onClick={() => setActiveCategory(sub.slug)}
                                                                        className={`text-left py-2 px-4 rounded-lg transition-all text-sm ${activeCategory === sub.slug
                                                                                ? "text-white bg-neutral-800/80"
                                                                                : "text-neutral-400 hover:text-white hover:bg-neutral-800/40"
                                                                            }`}
                                                                    >
                                                                        {sub.name}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}