"use client";

import { useState, useMemo, useEffect } from "react";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { getAllCategories, getAllProducts } from "@/services/products";
import { useQuickView } from "@/lib/QuickViewContext";
import Image from "next/image";


const SORT_OPTIONS = ["New In", "Price: Low to High", "Price: High to Low"];

type ProductImage = {
  id: string;
  url: string;
  is_primary: boolean;
}

export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  discount?: number;
  final_price: number;
  stock?: number;
  is_active?: boolean;
  created_at: string;
  type?: string;
  categories?: Category[];
  images?: ProductImage[];
  primary_image_url?: string;

}

type Category = {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
}

type Product_Type = {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
}


export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeType, setActiveType] = useState("All");
  const [sortBy, setSortBy] = useState("New In");
  const [filterOpen, setFilterOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productTypes, setProductTypes] = useState<Product_Type[]>([]);

  const { openQuickView } = useQuickView();

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
    fetchProducts();
    fetchCategories();
  }, []);


  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    if (activeCategory !== "All") {

      result = result.filter(p => p.categories?.some(c => c.name === activeCategory));
    }


    if (activeType !== "All") {
      result = result.filter(p => p.type === activeType);
    }

    // 4. Sort
    if (sortBy === "Price: Low to High") {
      result.sort((a, b) => a.final_price - b.final_price);
    } else if (sortBy === "Price: High to Low") {
      result.sort((a, b) => b.final_price - a.final_price);
    } else if (sortBy === "New In") {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [products, activeCategory, activeType, sortBy]);

  return (
    <div className="bg-(--black) min-h-screen text-(--beige) pt-14" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>

      {/* FILTER SIDEBAR (mobile & desktop) */}
      {filterOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-[75] backdrop-blur-sm transition-opacity"
          onClick={() => setFilterOpen(false)}
        />
      )}
      <aside className={`filter-sidebar ${filterOpen ? "open" : ""}`} style={{ zIndex: 80 }}>
        <div className="flex items-center justify-between mb-12 text-(--beige)">
          <span className="label" style={{ fontSize: "12px", letterSpacing: "0.15em" }}>FILTERS</span>
          <button onClick={() => setFilterOpen(false)} className="hover:text-(--orange) transition-colors">
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        {/* Type filter */}
        <div className="mb-10">
          <p className="label text-(--orange) mb-6" style={{ fontSize: "11px" }}>Category</p>
          {productTypes.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveType(t.is_active ? t.name : "All")}
              className="block w-full text-left py-3 label hover:text-(--orange) transition-colors"
              style={{
                fontSize: "12px",
                letterSpacing: "0.12em"
              }}
            >
              {t.name.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div>
          <p className="label text-(--orange) mb-6" style={{ fontSize: "11px" }}>Sort By</p>
          {SORT_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className="block w-full text-left py-3 label hover:text-(--orange) transition-colors"
              style={{
                fontSize: "12px",
                fontWeight: sortBy === s ? 500 : 400,
                color: sortBy === s ? "var(--orange)" : "var(--beige)",
                letterSpacing: "0.12em"
              }}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      </aside>

      {/* TOP BAR (non-sticky, spacious) */}
      <div className="z-40 bg-(--black) border-b border-(--gray-800) pt-6">

        {/* Category tabs */}
        <div className="flex items-center overflow-x-auto no-scroll px-6 md:px-12 gap-8 md:gap-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              className="shrink-0 label pb-5 border-b-[3px] transition-colors hover:text-(--orange)"
              style={{
                fontSize: "11.5px",
                letterSpacing: "0.15em",
                borderColor: activeCategory === cat.slug ? "var(--orange)" : "transparent",
                color: activeCategory === cat.slug ? "var(--orange)" : "var(--gray-400)",
              }}
            >
              {cat.name.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Filter + Sort row */}
        <div className="flex items-center justify-between px-6 md:px-12 py-5 border-t border-[var(--gray-900)]">
          <div className="flex items-center gap-6 md:gap-10">
            <button
              onClick={() => setFilterOpen(true)}
              className="flex items-center gap-3 label text-(--beige) hover:text-(--orange) transition-colors"
              style={{ fontSize: "11px", letterSpacing: "0.15em" }}
            >
              <SlidersHorizontal size={16} strokeWidth={1.5} />
              FILTERS
            </button>
            <span className="label text-(--gray-400)" style={{ fontSize: "11px", letterSpacing: "0.15em" }}>
              {/* {filtered.length} ITEMS */}
            </span>
          </div>

          {/* Sort dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-3 label text-(--beige) hover:text-(--orange) transition-colors" style={{ fontSize: "11px", letterSpacing: "0.15em" }}>
              {sortBy.toUpperCase()} <ChevronDown size={14} strokeWidth={1.5} />
            </button>

            {/* Dropdown Menu - Spacious */}
            <div className="absolute right-0 top-full mt-3 bg-(--gray-900) border border-(--gray-800) shadow-lg z-50 hidden group-hover:block min-w-max py-2">
              {SORT_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className="block w-full text-left px-8 py-4 label text-(--beige) hover:bg-(--black) hover:text-(--orange) transition-colors"
                  style={{ fontSize: "11px", fontWeight: sortBy === s ? 500 : 400, letterSpacing: "0.12em" }}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="px-6 md:px-12 py-12 md:py-16">
        {products.length === 0 ? (
          <div className="text-center py-32">
            <p className="label text-(--gray-400) mb-6" style={{ fontSize: "12px", letterSpacing: "0.15em" }}>No items found</p>
            <button
              onClick={() => { setActiveCategory("All"); setActiveType("All"); setSearch(""); }}
              className="label text-(--orange) border-b border-(--orange) pb-1 hover:opacity-75 transition-opacity"
              style={{ fontSize: "11px", letterSpacing: "0.15em" }}
            >
              CLEAR FILTERS
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-12 md:gap-y-16">
            {products.map((product) => (
              <div
                key={product.id}
                className="group cursor-pointer"
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Image Wrapper */}
                <div className="product-img-wrap relative border border-(--gray-800) group-hover:border-(--orange) transition-colors" style={{ aspectRatio: "3/4" }}>
                  <Image
                    src={product.primary_image_url || "/images/placeholder.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    onClick={() => openQuickView(product)}
                  />

                  {/* Quick add overlay */}
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-(--orange) text-black font-bold text-center py-4 transition-transform duration-300"
                    style={{
                      fontSize: "11px",
                      letterSpacing: "0.15em",
                      transform: hoveredId === product.id ? "translateY(0)" : "translateY(100%)",
                    }}
                  >
                    Quick Add
                  </div>
                </div>

                {/* Product info */}
                <div className="mt-5 flex justify-between items-start">
                  <div>
                    <p className="label text-(--beige) group-hover:text-(--orange) transition-colors" style={{ fontSize: "11px", lineHeight: 1.5 }}>
                      {product.name}
                    </p>
                    <p className="label text-(--gray-400) mt-1.5" style={{ fontSize: "10px", letterSpacing: "0.15em" }}>
                      {/* {product.category} */}
                    </p>
                  </div>
                  <p className="label text-(--beige) shrink-0 ml-4" style={{ fontSize: "11px" }}>
                    ₹{product.price}/-
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}