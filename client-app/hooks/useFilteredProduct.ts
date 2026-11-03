import { Product } from "@/types/product";
import { useMemo, useState } from "react";

export function useProductFilter(initialProducts: Product[]) {
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredProducts = useMemo(() => {
        // Safety check: if no products, return empty array
        if (!initialProducts || initialProducts.length === 0) return [];

        return initialProducts.filter((product) => {
            // 1. Category Match (Checking the nested array)
            const matchesCategory =
                activeCategory === "All" ||
                product.product_categories.some(
                    (pc) => pc.categories?.slug === activeCategory
                );

            // 2. Search Query Match (Checking name and description)
            const searchLower = searchQuery.toLowerCase().trim();
            const matchesSearch = searchLower === "" ||
                product.name.toLowerCase().includes(searchLower) ||
                (product.description?.toLowerCase().includes(searchLower) ?? false);

            // Product must match BOTH category and search text
            // Also, we only want to show active products
            return matchesCategory && matchesSearch && product.is_active;
        });
    }, [initialProducts, activeCategory, searchQuery]);

    return {
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        filteredProducts,
        productCount: filteredProducts.length,
    };
}