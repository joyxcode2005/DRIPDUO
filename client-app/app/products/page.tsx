"use client";

import { useState, useMemo, useEffect } from "react";
import { getAllCategories, getAllProducts, getAllProductTypes } from "@/services/products";
import { useCart } from "@/lib/CartContext";

// Components
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/components/product/ProductCard";
import FilterSidebar from "@/components/filters/FilterSidebar";
import FilterToolbar from "@/components/filters/FilterToolbar";
import ProductGrid from "@/components/product/ProductGrid";
import { useProductsData, useFilteredProducts } from "@/hooks/useProducts";
import { Category, CategoryWithSubs } from "@/types/product";
import Link from "next/link";

export default function ProductsPage() {
    const { addToCart } = useCart();
    
    // --- State ---
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeType, setActiveType] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [productTypes, setProductTypes] = useState<Product_Type[]>([]);

    // Interactivity States
    const [wishlist, setWishlist] = useState<string[]>([]);
    const [quickAddStatus, setQuickAddStatus] = useState<Record<string, boolean>>({});

    // --- Data Fetching ---
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const fetchedProducts = await getAllProducts();
                // Safely extract data in case API wraps it in { data: [...] }
                const productsData = Array.isArray(fetchedProducts) 
                    ? fetchedProducts 
                    : (fetchedProducts as any)?.data || [];
                setProducts(productsData);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        const fetchCategories = async () => {
            try {
                const fetchedCategories = await getAllCategories();
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

    // --- Action Handlers ---
    const toggleWishlist = (e: React.MouseEvent, productId: string) => {
        e.preventDefault();
        e.stopPropagation();
        setWishlist(prev => 
            prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
        );
    };

    const handleQuickAdd = async (e: React.MouseEvent, product: any) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Default to the first available variant for quick add
        const defaultVariant = product.variants?.[0];
        
        try {
            await addToCart({
                productId: product.id,
                variantId: defaultVariant?.id || `${product.id}-default`,
                name: product.name,
                price: product.final_price || product.price,
                image: product.product_images?.[0]?.url || product.images?.[0]?.url || "/placeholder-shirt.png",
                size: defaultVariant?.size || "M",
                gsm: String(defaultVariant?.gsm || "240"),
                quantity: 1,
                stock: defaultVariant?.stock || 10,
            });
            
            setQuickAddStatus(prev => ({ ...prev, [product.id]: true }));
            setTimeout(() => {
                setQuickAddStatus(prev => ({ ...prev, [product.id]: false }));
            }, 2000);
        } catch (error) {
            console.error("Error adding product to cart:", error);
        }
    };

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

            result = result.filter((p: any) =>
                p.product_categories?.some((c: any) =>
                    targetSlugs.includes(c.categories?.slug)
                )
            );
        }

        // 2. Filter by Product Type (from the drawer)
        if (activeType !== "All") {
            result = result.filter(
                (p: any) => p.product_type?.name === activeType || p.product_type_id === activeType
            );
        }

        return result;
    }, [products, activeCategory, activeType, categoryTree]);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans pt-16 selection:bg-zinc-800 relative">
            <FilterToolbar
                categories={categories}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
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
                                <ProductCard 
                                    product={product} 
                                    // Pass down the interactivity props to the ProductCard
                                    onQuickAdd={(e: React.MouseEvent) => handleQuickAdd(e, product)}
                                    onToggleWishlist={(e: React.MouseEvent) => toggleWishlist(e, product.id)}
                                    isWishlisted={wishlist.includes(product.id)}
                                    isAdded={quickAddStatus[product.id]}
                                />
                            </Link>
                        ))}
                    </div>
                )}
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