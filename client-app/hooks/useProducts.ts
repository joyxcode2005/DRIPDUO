import { useState, useEffect, useMemo } from "react";
import { getAllCategories, getAllProducts, getAllProductTypes } from "@/services/products";
import type { Product, Category, ProductType, CategoryWithSubs } from "@/types/product";

export function useProductsData() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [fetchedProducts, fetchedCategories, fetchedTypes] = await Promise.all([
                    getAllProducts(),
                    getAllCategories(),
                    getAllProductTypes(),
                ]);

                setProducts(fetchedProducts);
                setCategories(fetchedCategories);
                setProductTypes(fetchedTypes);
            } catch (error) {
                console.error("Error fetching product data:", error);
            }
        };

        fetchData();
    }, []);

    return { products, categories, productTypes };
}

export function useFilteredProducts(
    products: Product[],
    categories: Category[], // Make sure to pass categories in!
    activeCategory: string,
    activeType: string,
    searchQuery: string
) {
    // 1. Reconstruct the parent-child tree
    const categoryTree = useMemo(() => {
        const parents = categories.filter((c) => !c.parent_id);
        return parents.map((p) => ({
            ...p,
            subcategories: categories.filter((c) => c.parent_id === p.id),
        }));
    }, [categories]);

    const filteredProducts = useMemo(() => {
        let result = [...products];

        // 2. Hierarchical Category Filter
        if (activeCategory !== "All") {
            // Find if the selected category is a parent
            const parentCat = categoryTree.find((c) => c.name === activeCategory);

            // Start with the selected category itself
            let targetNames = [activeCategory];

            // If it IS a parent, add all of its children's names to our search targets
            if (parentCat) {
                targetNames = [
                    activeCategory,
                    ...parentCat.subcategories.map((sub) => sub.name),
                ];
            }

            // Filter products that have AT LEAST ONE category in our target list
            result = result.filter((p) =>
                p.product_categories?.some((c) =>
                    targetNames.includes(c.categories?.name)
                )
            );
        }

        // 3. Product Type Filter
        if (activeType !== "All") {
            result = result.filter(
                (p) => p.product_type?.name === activeType || p.product_type_id === activeType
            );
        }

        // 4. Search Filter
        if (searchQuery.trim() !== "") {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter((p) =>
                p.name?.toLowerCase().includes(lowerQuery)
            );
        }

        return result;
    }, [products, activeCategory, activeType, searchQuery, categoryTree]);

    return filteredProducts;
}