"use client";

import { useState, useMemo, useEffect } from "react";
import { getAllCategories, getAllProducts, getAllProductTypes } from "@/services/products";

// Components

import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/components/product/ProductCard";
import FilterSidebar from "@/components/filters/FilterSidebar";
import FilterToolbar from "@/components/filters/FilterToolbar";
import Link from "next/link";

// --- Types ---
type Category = {
    id: string;
    name: string;
    slug: string;
    is_active: boolean;
    parent_id: string | null;
};

type CategoryWithSubs = Category & {
    subcategories: Category[];
};

type Product_Type = {
    id: string;
    name: string;
    slug: string;
    is_active: boolean;
};

export default function ProductsPage() {
    // --- State ---
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeType, setActiveType] = useState("All");
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [productTypes, setProductTypes] = useState<Product_Type[]>([]);

    // --- Data Fetching ---
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const fetchedProducts = await getAllProducts();
                setProducts(fetchedProducts);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        const fetchCategories = async () => {
            try {
                const fetchedCategories = await getAllCategories();
                console.log("Fetched Categories:", fetchedCategories);
                setCategories(fetchedCategories);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        const fetchProductTypes = async () => {
            try {
                const types = await getAllProductTypes();
                setProductTypes(types);
            } catch (error) {
                console.error("Error fetching product types:", error);
            }
        };

        fetchProducts();
        fetchCategories();
        fetchProductTypes();
    }, []);

    // --- Logic & Filtering ---
    const categoryTree = useMemo<CategoryWithSubs[]>(() => {
        const parents = categories.filter((c) => !c.parent_id);
        return parents.map((p) => ({
            ...p,
            subcategories: categories.filter((c) => c.parent_id === p.id),
        }));
    }, [categories]);

    const filteredAndSortedProducts = useMemo(() => {
        let result = [...products];

        // 1. Filter by Category
        if (activeCategory !== "All") {
            const parentCat = categoryTree.find((c) => c.slug === activeCategory);
            let targetSlugs = [activeCategory];

            // If they selected a parent category, include all its subcategories in the search
            if (parentCat) {
                targetSlugs = [
                    activeCategory,
                    ...parentCat.subcategories.map((sub) => sub.slug),
                ];
            }

            result = result.filter((p) =>
                p.product_categories?.some((c) =>
                    targetSlugs.includes(c.categories?.slug)
                )
            );
        }

        // 2. Filter by Product Type (from the drawer)
        if (activeType !== "All") {
            result = result.filter(
                (p) => p.product_type?.name === activeType || p.product_type_id === activeType
            );
        }

        console.log("Filtered Products:", result);

        return result;
    }, [products, activeCategory, activeType, categoryTree]);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans pt-16 selection:bg-zinc-800 relative">

            {/* 1. The new compact toolbar */}
            <FilterToolbar
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                productCount={filteredAndSortedProducts.length}
                onOpenFilter={() => setFilterDrawerOpen(true)}
            />

            {/* 2. Main Product Grid */}
            <main className="p-4 md:p-8 max-w-350 mx-auto">
                {filteredAndSortedProducts.length === 0 ? (
                    <div className="text-center py-32 flex flex-col items-center">
                        <p className="text-zinc-500 text-xs tracking-widest uppercase mb-4">No items found</p>
                        <button
                            onClick={() => { setActiveCategory("All"); setActiveType("All"); }}
                            className="text-white border-b border-white pb-1 text-xs tracking-widest uppercase hover:opacity-70 transition-opacity"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                        {/* Changed grid layout to 2 columns on mobile and adjusted gap sizing */}
                        {filteredAndSortedProducts.map((product) => (
                            <Link key={product.id} href={`/products/${product.id}`}>
                                <ProductCard key={product.id} product={product} />
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            {/* 3. The sliding side drawer for advanced filters */}
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