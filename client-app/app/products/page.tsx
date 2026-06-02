"use client";

import { useState, useMemo, useEffect } from "react";
import { getAllCategories, getAllProducts, getAllProductTypes } from "@/services/products";
import { useCart } from "@/lib/CartContext";

import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/components/product/ProductCard";
import FilterSidebar from "@/components/filters/FilterSidebar";
import FilterToolbar from "@/components/filters/FilterToolbar";
import Link from "next/link";

type Category = {
    id: string;
    name: string;
    slug: string;
    is_active: boolean;
    parent_id: string | null;
};

type CategoryWithSubs = Category & { subcategories: Category[]; };

type Product_Type = {
    id: string;
    name: string;
    slug: string;
    is_active: boolean;
};

export default function ProductsPage() {
    const { addToCart } = useCart();
    
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeType, setActiveType] = useState("All");
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [productTypes, setProductTypes] = useState<Product_Type[]>([]);

    const [wishlist, setWishlist] = useState<string[]>([]);
    const [quickAddStatus, setQuickAddStatus] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const fetchedProducts = await getAllProducts();
                const productsData = Array.isArray(fetchedProducts) 
                    ? fetchedProducts 
                    : (fetchedProducts as any)?.data || [];
                setProducts(productsData);
            } catch (error) { console.error("Error fetching products:", error); }
        };

        const fetchCategories = async () => {
            try {
                const fetchedCategories = await getAllCategories();
                setCategories(fetchedCategories);
            } catch (error) { console.error("Error fetching categories:", error); }
        };

        const fetchProductTypes = async () => {
            try {
                const types = await getAllProductTypes();
                setProductTypes(types);
            } catch (error) { console.error("Error fetching product types:", error); }
        };

        fetchProducts();
        fetchCategories();
        fetchProductTypes();
    }, []);

    const toggleWishlist = (e: React.MouseEvent, productId: string) => {
        e.preventDefault();
        e.stopPropagation();
        setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
    };

    const handleQuickAdd = async (e: React.MouseEvent, product: any) => {
        e.preventDefault();
        e.stopPropagation();
        
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
            setTimeout(() => setQuickAddStatus(prev => ({ ...prev, [product.id]: false })), 2000);
        } catch (error) { console.error("Error adding product to cart:", error); }
    };

    const categoryTree = useMemo<CategoryWithSubs[]>(() => {
        const parents = categories.filter((c) => !c.parent_id);
        return parents.map((p) => ({ ...p, subcategories: categories.filter((c) => c.parent_id === p.id) }));
    }, [categories]);

    const filteredAndSortedProducts = useMemo(() => {
        let result = [...products];

        if (activeCategory !== "All") {
            const parentCat = categoryTree.find((c) => c.slug === activeCategory);
            let targetSlugs = [activeCategory];

            if (parentCat) {
                targetSlugs = [activeCategory, ...parentCat.subcategories.map((sub) => sub.slug)];
            }
            result = result.filter((p: any) => p.product_categories?.some((c: any) => targetSlugs.includes(c.categories?.slug)));
        }

        if (activeType !== "All") {
            result = result.filter((p: any) => p.product_type?.name === activeType || p.product_type_id === activeType);
        }

        return result;
    }, [products, activeCategory, activeType, categoryTree]);

    return (
        <div className="min-h-screen text-white font-sans pt-20 relative z-10 w-full">

            <FilterToolbar
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                productCount={filteredAndSortedProducts.length}
                onOpenFilter={() => setFilterDrawerOpen(true)}
            />

            <main className="p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 w-full max-w-[2000px] mx-auto">
                {filteredAndSortedProducts.length === 0 ? (
                    <div className="text-center py-32 flex flex-col items-center glass-panel rounded-3xl max-w-lg mx-auto mt-10">
                        <p className="text-white/50 text-sm tracking-widest uppercase mb-6">No items found in archive</p>
                        <button
                            onClick={() => { setActiveCategory("All"); setActiveType("All"); }}
                            className="glass-button px-8 py-4 text-xs tracking-widest uppercase text-white rounded-full hover:bg-white hover:text-black transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6 xl:gap-8 pt-6">
                        {/* Moved the comment inside the element to fix the JSX parsing error */}
                        {/* Added xl:grid-cols-5 and 2xl:grid-cols-6 to take advantage of wide monitors */}
                        {filteredAndSortedProducts.map((product) => (
                            <Link key={product.id} href={`/products/${product.id}`} className="w-full">
                                <ProductCard 
                                    product={product} 
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