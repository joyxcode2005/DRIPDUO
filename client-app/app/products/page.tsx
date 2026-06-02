"use client";

import { useState } from "react";
import FilterSidebar from "@/components/filters/FilterSidebar";
import FilterToolbar from "@/components/filters/FilterToolbar";
import ProductGrid from "@/components/product/ProductGrid";
import { useProductsData, useFilteredProducts } from "@/hooks/useProducts";

export default function ProductsPage() {
    // Shared UI State
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeType, setActiveType] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

    // Data Hooks
    const { products, categories, productTypes } = useProductsData();

    // The derived, correctly filtered list of products
    const filteredProducts = useFilteredProducts(
        products,
        activeCategory,
        activeType,
        searchQuery
    );

    const handleClearFilters = () => {
        setActiveCategory("All");
        setActiveType("All");
        setSearchQuery("");
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans pt-16 selection:bg-zinc-800 relative">
            <FilterToolbar
                categories={categories}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                productCount={filteredProducts.length}
                onOpenFilter={() => setFilterDrawerOpen(true)}
            />

            <main className="p-6 md:p-8 max-w-400 mx-auto">
                <ProductGrid
                    products={filteredProducts}
                    onClearFilters={handleClearFilters}
                />
            </main>

            <FilterSidebar
                isOpen={filterDrawerOpen}
                onClose={() => setFilterDrawerOpen(false)}
                productTypes={productTypes}
                activeType={activeType}
                setActiveType={setActiveType}
            />
        </div>
    );
}