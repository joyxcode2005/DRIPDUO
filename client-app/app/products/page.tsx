"use client";

import { useState, useMemo, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { getAllCategories, getAllProducts, getAllProductTypes } from "@/services/products";
import ProductCard, { Product } from "@/components/ProductCard";

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
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeType, setActiveType] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productTypes, setProductTypes] = useState<Product_Type[]>([]);

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
        const categories = await getAllCategories();
        setCategories(categories);
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

  // Process flat categories into a structured Parent -> Children tree
  const categoryTree = useMemo<CategoryWithSubs[]>(() => {
    const parents = categories.filter((c) => !c.parent_id);
    return parents.map((p) => ({
      ...p,
      subcategories: categories.filter((c) => c.parent_id === p.id),
    }));
  }, [categories]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    if (activeCategory !== "All") {
      const parentCat = categoryTree.find((c) => c.slug === activeCategory);

      let targetSlugs = [activeCategory];

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

    // 2. Filter by Product Type (Sidebar drawer)
    if (activeType !== "All") {
      result = result.filter(
        (p) => p.product_type?.name === activeType || p.product_type_id === activeType
      );
    }


    return result;
  }, [products, activeCategory, activeType, categoryTree]);

  return (
    <div className="bg-(--black) min-h-screen text-(--beige) pt-16">
      {/* FILTER DRAWER OVERLAY */}
      <div
        className={`fixed inset-0 bg-black/80 z-90 backdrop-blur-sm transition-opacity duration-300 ${filterOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        onClick={() => setFilterOpen(false)}
      />

      {/* FILTER DRAWER - DARK THEME */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-400px bg-(--black) border-l border-(--gray-800) z-100 transform transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col ${filterOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between px-8 py-6 border-b border-(--gray-800)">
          <span className="font-sans text-[11px] font-semibold tracking-[0.2em] uppercase text-(--beige)">
            Filter & Sort
          </span>
          <button
            onClick={() => setFilterOpen(false)}
            className="text-(--beige) hover:text-(--orange) transition-colors"
          >
            <X size={24} strokeWidth={1} />
          </button>
        </div>

        {/* Type filter */}
        <div className="mb-10 px-8 py-6">
          <p className="label text-(--orange) mb-6" style={{ fontSize: "11px" }}>
            Product Type
          </p>

          <button
            onClick={() => setActiveType("All")}
            className="block w-full text-left py-3 label transition-colors uppercase"
            style={{
              fontSize: "12px",
              letterSpacing: "0.12em",
              color: activeType === "All" ? "var(--orange)" : "var(--beige)",
              fontWeight: activeType === "All" ? 600 : 400,
            }}
          >
            ALL TYPES
          </button>

          {productTypes.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveType(t.is_active ? t.slug : "All")}
              className="block w-full text-left py-3 label hover:text-(--orange) transition-colors uppercase"
              style={{
                fontSize: "12px",
                letterSpacing: "0.12em",
                color: activeType === t.slug ? "var(--orange)" : "var(--beige)",
                fontWeight: activeType === t.slug ? 600 : 400,
              }}
            >
              {t.name}
            </button>
          ))}
        </div>
      </aside>

      {/* TOP BAR */}
      <div className="z-40 bg-(--black) border-b border-(--gray-800) pt-6">
        {/* Changed from overflow-x-auto to flex-wrap so the dropdown menu isn't clipped */}
        <div className="flex flex-wrap items-center px-6 md:px-12 gap-x-8 md:gap-x-12 gap-y-2">
          <button
            onClick={() => setActiveCategory("All")}
            className={`shrink-0 label pb-5 border-b-[3px] transition-colors hover:text-(--orange) ${activeCategory === "All"
              ? "border-(--orange) text-(--orange)"
              : "border-transparent text-(--gray-400)"
              }`}
            style={{ fontSize: "11.5px", letterSpacing: "0.15em" }}
          >
            ALL
          </button>

          {categoryTree.map((cat) => {
            const isActiveParent = activeCategory === cat.slug;
            const isActiveSub = cat.subcategories.some(
              (sub) => sub.slug === activeCategory
            );
            const isHighlighted = isActiveParent || isActiveSub;

            return (
              <div key={cat.id} className="relative group pb-5">
                <button
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`flex items-center gap-1.5 shrink-0 label border-b-[3px] transition-colors hover:text-(--orange) ${isHighlighted
                    ? "border-(--orange) text-(--orange)"
                    : "border-transparent text-(--gray-400)"
                    }`}
                  style={{ fontSize: "11.5px", letterSpacing: "0.15em" }}
                >
                  {cat.name.toUpperCase()}
                  {/* Rotate icon on group hover */}
                  {cat.subcategories.length > 0 && (
                    <ChevronDown
                      size={14}
                      className="transition-transform duration-300 group-hover:-rotate-180"
                    />
                  )}
                </button>

                {/* ANIMATED DROPDOWN */}
                {cat.subcategories.length > 0 && (
                  <div
                    className="absolute left-0 top-full w-48 bg-(--black) border border-(--gray-800) shadow-2xl z-50 
                    opacity-0 invisible translate-y-2 pointer-events-none
                    transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] 
                    group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto"
                  >
                    <div className="flex flex-col py-2">
                      {cat.subcategories.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveCategory(sub.slug);
                          }}
                          className={`text-left px-5 py-3 font-sans text-[11px] tracking-[0.15em] transition-colors uppercase hover:bg-(--gray-900) hover:text-(--orange) ${activeCategory === sub.slug
                            ? "text-(--orange) font-semibold"
                            : "text-(--beige)"
                            }`}
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="px-6 md:px-12 py-12 md:py-16">
        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-32">
            <p
              className="label text-(--gray-400) mb-6"
              style={{ fontSize: "12px", letterSpacing: "0.15em" }}
            >
              No items found
            </p>
            <button
              onClick={() => {
                setActiveCategory("All");
                setActiveType("All");
              }}
              className="text-(--orange) border-b border-(--orange) pb-1 hover:opacity-75 transition-opacity font-sans text-[11px] tracking-[0.15em] uppercase"
            >
              CLEAR FILTERS
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-12 md:gap-y-16">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}