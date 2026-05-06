"use client";

import { useState, use, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { getProductById } from "@/services/products";

// Hardcoded presentation data for consistent ordering and descriptions
const SIZES_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const GSM_DETAILS: Record<string, { label: string; desc: string }> = {
  "220": { label: "220 GSM", desc: "Lightweight & Breathable" },
  "240": { label: "240 GSM", desc: "Heavyweight Structure" },
};

// Interface reflecting your new DB schema joined with the product
interface Variant {
  id: string;
  size: string;
  gsm: string;
  stock: number;
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedGSM, setSelectedGSM] = useState<string>("");
  const [sizeError, setSizeError] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const fetchedProduct = await getProductById(id);
      console.log("Fetched product data:", fetchedProduct);
      setProduct(fetchedProduct);

      // Default to the first available GSM type found in variants
      if (fetchedProduct?.variants?.length > 0) {
        setSelectedGSM(fetchedProduct.variants[0].gsm);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product && selectedSize) {
      const variant = product.variants.find(
        (v: Variant) => v.size === selectedSize && v.gsm === selectedGSM
      );
      if (!variant || variant.stock <= 0) {
        setSelectedSize(null);
      }
    }
  }, [selectedGSM, product, selectedSize]);

  // ✅ MADE THIS ASYNC TO MATCH THE NEW CART CONTEXT
  const handleAddToCart = async () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }

    setSizeError(false);

    // Find the exact variant based on size and gsm
    const selectedVariant = product.variants.find(
      (v: Variant) => v.size === selectedSize && String(v.gsm) === selectedGSM
    );

    if (!selectedVariant || selectedVariant.stock <= 0) {
      alert("Sorry, this specific size and fabric weight is out of stock.");
      return;
    }

    try {
      // ✅ AWAIT THE ADD TO CART FUNCTION
      // ✅ REMOVED 'id' SINCE THE CONTEXT AUTO-GENERATES IT FROM VARIANT ID
      // await addToCart({
      //   productId: product!.id,
      //   variantId: selectedVariant.id,
      //   name: product!.name,
      //   price: product!.final_price || product!.price,
      //   image: product!.images?.[0]?.url || "",
      //   size: selectedSize,
      //   gsm: selectedGSM,
      //   quantity: 1,
      // });

      setAdded(true);
      setTimeout(() => {
        setAdded(false);
      }, 2000);
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-(--black) flex items-center justify-center">
        <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-(--beige) animate-pulse">
          Loading product...
        </p>
      </div>
    );
  }

  // Extract unique GSM options available for this specific product
  const availableGSMs = Array.from(
    new Set(product.variants?.map((v: Variant) => String(v.gsm)) || [])
  ) as string[];

  // Get variants for the currently selected GSM to determine size availability
  const currentGSMVariants = product.variants?.filter(
    (v: Variant) => String(v.gsm) === selectedGSM
  ) || [];

  return (
    <div className="min-h-screen bg-(--black) text-(--beige) pt-24 pb-24 font-sans">
      <div className="max-w-350 mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-12 lg:gap-24">

        {/* Left: Image Viewer */}
        <div className="w-full md:w-1/2">
          <Link
            href="/products"
            className="inline-flex items-center gap-3 font-sans text-[10px] uppercase tracking-[0.2em] text-(--gray-400) hover:text-(--orange) transition-colors mb-12"
          >
            <ArrowLeft size={14} strokeWidth={1} /> BACK TO ARCHIVE
          </Link>
          <div className="w-full bg-(--gray-900) border border-(--gray-800) aspect-3/4 overflow-hidden">
            <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Right: Product Details & Order Form */}
        <div className="w-full md:w-1/2 md:pt-20 flex flex-col">

          <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-(--orange) mb-6">
            {product.categories?.[0]?.name || "Uncategorized"}
          </p>
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.9] mb-6 text-(--beige)">
            {product.name}
          </h1>
          <div className="mb-12">
            {product.discount > 0 ? (
              <div className="flex items-center gap-4">
                <p className="font-sans text-[12px] tracking-widest text-(--gray-500) line-through">
                  ₹{product.price.toFixed(2)}
                </p>
                <p className="font-sans text-[12px] tracking-widest text-(--beige)">
                  ₹{product.final_price?.toFixed(2)}
                </p>
                <span className="font-sans text-[10px] tracking-widest text-(--orange)">
                  SAVE ₹{(product.price - (product.final_price || product.price)).toFixed(2)}
                </span>
              </div>
            ) : (
              <p className="font-sans text-[12px] tracking-widest text-(--beige)">
                ₹{product.price.toFixed(2)}
              </p>
            )}
          </div>

          <p className="font-sans text-[12px] leading-relaxed tracking-[0.05em] text-(--gray-200) mb-16 whitespace-pre-line">
            {product.description}
          </p>

          {/* GSM (Fabric Weight) Selector */}
          {availableGSMs.length > 0 && (
            <div className="mb-12">
              <span className="block font-sans text-[10px] uppercase tracking-[0.2em] text-(--gray-400) mb-6">
                FABRIC WEIGHT
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableGSMs.map((gsmValue) => {
                  const details = GSM_DETAILS[gsmValue] || { label: `${gsmValue} GSM`, desc: "Standard Fabric" };
                  return (
                    <button
                      key={gsmValue}
                      onClick={() => {
                        setSelectedGSM(gsmValue);
                        setSizeError(false);
                      }}
                      className={`border p-5 text-left transition-colors flex flex-col items-start gap-2 ${selectedGSM === gsmValue
                        ? "border-(--beige) bg-(--gray-900)"
                        : "border-(--gray-800) bg-transparent hover:border-(--gray-600)"
                        }`}
                    >
                      <span className={`font-sans text-[11px] uppercase tracking-[0.15em] ${selectedGSM === gsmValue ? "text-(--beige)" : "text-(--gray-400)"}`}>
                        {details.label}
                      </span>
                      <span className="font-sans text-[10px] tracking-[0.05em] text-(--gray-600)">
                        {details.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Selector */}
          <div className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-(--gray-400)">
                SELECT SIZE
              </span>
              <button className="font-sans text-[10px] uppercase tracking-widest text-(--gray-400) hover:text-(--orange) transition-colors underline underline-offset-4">
                Size Guide
              </button>
            </div>

            {sizeError && (
              <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-(--orange) mb-4 animate-pulse">
                Please select an available size to continue.
              </p>
            )}

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {SIZES_ORDER.map((size) => {
                const variant = currentGSMVariants.find((v: Variant) => v.size === size);
                const isOutOfStock = !variant || variant.stock <= 0;

                return (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      setSizeError(false);
                    }}
                    disabled={isOutOfStock}
                    className={`border py-4 font-sans text-[11px] uppercase tracking-[0.15em] transition-colors 
                      ${isOutOfStock
                        ? "border-(--gray-900) bg-(--gray-900) text-(--gray-600) cursor-not-allowed opacity-50"
                        : selectedSize === size
                          ? "border-(--beige) bg-(--beige) text-(--black) font-bold"
                          : "border-(--gray-800) bg-transparent text-(--gray-400) hover:border-(--gray-600) hover:text-(--beige)"
                      }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={availableGSMs.length === 0}
            className={`w-full font-sans text-[11px] font-bold uppercase tracking-[0.2em] py-6 transition-colors duration-300 flex items-center justify-center gap-3 ${availableGSMs.length === 0
              ? "bg-(--gray-900) text-(--gray-600) border border-(--gray-800) cursor-not-allowed" // Out of stock styling
              : added
                ? "bg-(--beige) text-(--black) border border-(--beige)" // Success styling
                : "bg-(--orange) text-(--black) border border-(--orange) hover:bg-(--beige) hover:border-(--beige)" // Default styling
              }`}
          >
            {availableGSMs.length === 0 ? (
              "OUT OF STOCK"
            ) : added ? (
              <><Check size={16} strokeWidth={2} /> ADDED TO BAG</>
            ) : (
              "ADD TO BAG"
            )}
          </button>

        </div>
      </div>
    </div>
  );
}