"use client";

import { useState, use, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Star, Plus, Minus, RotateCcw, ZoomIn, Info } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { getProductById } from "@/services/products";
import { motion, AnimatePresence } from "framer-motion";

const SIZES_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const GSM_DETAILS: Record<string, { label: string; desc: string }> = {
  "220": { label: "220 GSM", desc: "Lightweight & Breathable" },
  "240": { label: "240 GSM", desc: "Heavyweight Structure" },
};

interface Variant {
  id: string;
  size: string;
  gsm: string;
  stock: number;
}

const MOCK_REVIEWS = [
  { id: 1, name: "Arjun M.", verified: true, rating: 5, text: "The fabric feels exactly as described. Worth the price, beautifully weighted.", date: "2 weeks ago" },
  { id: 2, name: "Priya K.", verified: true, rating: 4, text: "Runs slightly long — loved that. Size down for a cropped silhouette.", date: "1 month ago" },
];

const FABRIC_SPECS = [
  { icon: "⚖", label: "Weight", value: "240 GSM" },
  { icon: "✦", label: "Material", value: "100% Cotton" },
  { icon: "✂", label: "Fit Type", value: "Oversized" },
  { icon: "⬡", label: "Origin", value: "Made in India" },
  { icon: "⟳", label: "Stitching", value: "Double-needle" },
];

const FAQ_ITEMS = [
  { q: "How does the fit run?", a: "Relaxed through the body, true to chest. Size down if you prefer a cropped silhouette. See model fit notes above." },
  { q: "What is the return policy?", a: "30-day returns on unworn, unwashed items with original tags. Exchanges processed within 5 business days." },
  { q: "How should I care for this piece?", a: "Cold wash inside out, hang dry. Avoid tumble drying to preserve the weight and structure of the fabric." },
  { q: "Do you restock the archive?", a: "Select pieces are restocked seasonally. Sign up for restock alerts on the product page." },
  { q: "Shipping & delivery times?", a: "Standard: 5–7 business days. Express: 2–3 business days. Free shipping on orders over ₹1999." },
];

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedGSM, setSelectedGSM] = useState<string>("");
  const [sizeError, setSizeError] = useState(false);
  const [added, setAdded] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeView, setActiveView] = useState<"FRONT" | "BACK" | "FABRIC" | "DETAIL">("FRONT");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      const fetched = await getProductById(id);
      setProduct(fetched);
      if (fetched?.variants?.length > 0) setSelectedGSM(fetched.variants[0].gsm);
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product && selectedSize) {
      const variant = product.variants.find(
        (v: Variant) => v.size === selectedSize && v.gsm === selectedGSM
      );
      if (!variant || variant.stock <= 0) setSelectedSize(null);
    }
  }, [selectedGSM, product, selectedSize]);

  const handleAddToCart = async () => {
    if (!selectedSize) { setSizeError(true); return; }
    setSizeError(false);
    const selectedVariant = product.variants.find(
      (v: Variant) => v.size === selectedSize && String(v.gsm) === selectedGSM
    );
    if (!selectedVariant || selectedVariant.stock <= 0) {
      alert("Sorry, this specific size and fabric weight is out of stock.");
      return;
    }
    try {
      await addToCart({
        productId: product.id,
        variantId: selectedVariant.id,
        name: product.name,
        price: product.final_price || product.price,
        image: product.images?.[0]?.url || "",
        size: selectedSize,
        gsm: selectedGSM,
        quantity: 1,
        stock: selectedVariant.stock,
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border border-[#EE3C24]/30 animate-spin rounded-full border-t-[#EE3C24]" />
          <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#6B6A5E] animate-pulse">Loading Archive...</p>
        </div>
      </div>
    );
  }

  const availableGSMs = Array.from(
    new Set(product.variants?.map((v: Variant) => String(v.gsm)) || [])
  ) as string[];

  const currentGSMVariants = product.variants?.filter(
    (v: Variant) => String(v.gsm) === selectedGSM
  ) || [];

  const images = product.images || [];
  const currentImage = images[activeImageIndex]?.url || "";

  return (
    <div className="min-h-screen bg-[#050505] text-[#ECE7D1] font-sans">

      {/* ── SECTION 01: HERO PRODUCT VIEWER ── */}
      <section className="pt-20 border-b border-[#1A1A17]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">

          {/* Top breadcrumb bar */}
          <div className="flex items-center justify-between py-4 border-b border-[#1A1A17] mb-0">
            <Link href="/products" className="flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.2em] text-[#6B6A5E] hover:text-[#EE3C24] transition-colors">
              <ArrowLeft size={12} strokeWidth={1.5} /> Archive
            </Link>
            <div className="flex items-center gap-3 font-sans text-[9px] uppercase tracking-[0.18em] text-[#6B6A5E]">
              <span className="text-[#6B6A5E]">Home</span>
              <span>/</span>
              <span className="text-[#6B6A5E]">Products</span>
              <span>/</span>
              <span className="text-[#ECE7D1]">{product.name}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_420px] gap-0">

            {/* Left: Thumbnail Rail */}
            <div className="hidden lg:flex flex-col gap-3 py-10 pr-6 w-[90px]">
              {/* View Labels */}
              {(["FRONT", "BACK", "FABRIC", "DETAIL"] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setActiveView(view)}
                  className={`w-full aspect-square border flex items-center justify-center font-sans text-[8px] uppercase tracking-[0.12em] transition-all duration-300 ${
                    activeView === view
                      ? "border-[#ECE7D1] bg-[#ECE7D1]/5 text-[#ECE7D1]"
                      : "border-[#1A1A17] text-[#6B6A5E] hover:border-[#555450]"
                  }`}
                >
                  {view}
                </button>
              ))}
              {/* Image thumbnails */}
              {images.slice(0, 4).map((img: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className={`w-full aspect-square border overflow-hidden transition-all duration-300 ${
                    activeImageIndex === i ? "border-[#ECE7D1]" : "border-[#1A1A17] opacity-50 hover:opacity-80"
                  }`}
                >
                  <Image src={img.url} alt="" width={80} height={80} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Center: Main Image */}
            <div className="relative border-x border-[#1A1A17] overflow-hidden bg-[#0D0D0B]">
              <div className="relative aspect-[3/4] w-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImageIndex}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0"
                  >
                    {currentImage ? (
                      <Image src={currentImage} alt={product.name} fill className="object-cover object-top" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#403F38]">[ PRODUCT IMAGE ]</span>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Image nav arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImageIndex(i => (i - 1 + images.length) % images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 border border-white/20 bg-black/40 backdrop-blur-sm flex items-center justify-center hover:border-white/60 transition-all z-10"
                    >
                      <ChevronLeft size={14} strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={() => setActiveImageIndex(i => (i + 1) % images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 border border-white/20 bg-black/40 backdrop-blur-sm flex items-center justify-center hover:border-white/60 transition-all z-10"
                    >
                      <ChevronRight size={14} strokeWidth={1.5} />
                    </button>
                  </>
                )}

                {/* View label overlay */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#6B6A5E] border border-[#1A1A17] bg-black/60 backdrop-blur-sm px-2.5 py-1">
                    {activeView} VIEW
                  </span>
                </div>

                {/* Image counter */}
                <div className="absolute bottom-4 right-4 z-10">
                  <span className="font-sans text-[9px] uppercase tracking-[0.12em] text-[#6B6A5E] bg-black/60 backdrop-blur-sm px-2.5 py-1 border border-[#1A1A17]">
                    {activeImageIndex + 1} / {Math.max(images.length, 1)}
                  </span>
                </div>

                {/* Mobile scroll hint */}
                <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 md:hidden">
                  <RotateCcw size={10} strokeWidth={1.5} className="text-[#6B6A5E]" />
                  <span className="font-sans text-[8px] uppercase tracking-[0.15em] text-[#6B6A5E]">scroll to rotate</span>
                </div>
              </div>

              {/* Mobile dot nav */}
              <div className="flex justify-center gap-2 py-4 lg:hidden border-t border-[#1A1A17]">
                {images.map((_: any, i: number) => (
                  <button key={i} onClick={() => setActiveImageIndex(i)} className={`w-1 h-1 rounded-full transition-all ${i === activeImageIndex ? "bg-[#ECE7D1] w-4" : "bg-[#403F38]"}`} />
                ))}
              </div>

              {/* Mobile view tabs */}
              <div className="flex lg:hidden border-t border-[#1A1A17]">
                {(["FRONT", "BACK", "FABRIC", "DETAIL"] as const).map((view) => (
                  <button
                    key={view}
                    onClick={() => setActiveView(view)}
                    className={`flex-1 py-3 font-sans text-[8px] uppercase tracking-[0.12em] transition-colors ${
                      activeView === view ? "text-[#ECE7D1] bg-[#ECE7D1]/5" : "text-[#6B6A5E]"
                    }`}
                  >
                    {view}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Product Info Panel */}
            <div className="lg:pl-10 py-10 flex flex-col">

              {/* Rating row */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={10} fill={s <= 4 ? "#EE3C24" : "none"} stroke={s <= 4 ? "#EE3C24" : "#403F38"} />
                  ))}
                </div>
                <span className="font-sans text-[9px] uppercase tracking-[0.15em] text-[#6B6A5E]">4.6 · 120 reviews</span>
                <span className="ml-auto font-sans text-[9px] uppercase tracking-[0.15em] text-[#6B6A5E]">ARCHIVE</span>
              </div>

              {/* Category */}
              <p className="font-sans text-[9px] uppercase tracking-[0.25em] text-[#EE3C24] mb-3">
                {product.categories?.[0]?.name || "Apparel"} / FW26
              </p>

              {/* Name */}
              <h1 className="font-serif text-[clamp(2rem,4vw,3rem)] leading-[0.92] text-[#ECE7D1] mb-4">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#1A1A17]">
                {product.discount > 0 ? (
                  <>
                    <span className="font-sans text-[11px] tracking-widest text-[#555450] line-through">₹{product.price}</span>
                    <span className="font-serif text-2xl text-[#ECE7D1]">₹{product.final_price}</span>
                    <span className="font-sans text-[9px] uppercase tracking-[0.15em] text-[#EE3C24] border border-[#EE3C24]/40 px-2 py-0.5">
                      SAVE ₹{(product.price - product.final_price).toFixed(0)}
                    </span>
                  </>
                ) : (
                  <span className="font-serif text-2xl text-[#ECE7D1]">₹{product.price}</span>
                )}
              </div>

              {/* Short description */}
              <p className="font-sans text-[11px] leading-[1.8] tracking-[0.04em] text-[#969382] mb-8">
                {product.description?.slice(0, 150) || "Premium heavyweight cotton. Engineered for those who refuse to settle."}
              </p>

              {/* GSM Selector */}
              {availableGSMs.length > 0 && (
                <div className="mb-6">
                  <p className="font-sans text-[9px] uppercase tracking-[0.22em] text-[#6B6A5E] mb-3">GSM / WEIGHT</p>
                  <div className="flex gap-2 flex-wrap">
                    {availableGSMs.map((gsmValue) => {
                      const details = GSM_DETAILS[gsmValue] || { label: `${gsmValue} GSM`, desc: "" };
                      return (
                        <button
                          key={gsmValue}
                          onClick={() => { setSelectedGSM(gsmValue); setSizeError(false); }}
                          className={`px-4 py-2.5 border font-sans text-[10px] uppercase tracking-[0.12em] transition-all duration-200 ${
                            selectedGSM === gsmValue
                              ? "border-[#ECE7D1] bg-[#ECE7D1]/5 text-[#ECE7D1]"
                              : "border-[#1A1A17] text-[#6B6A5E] hover:border-[#403F38]"
                          }`}
                        >
                          {details.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-sans text-[9px] uppercase tracking-[0.22em] text-[#6B6A5E]">SIZE</p>
                  <button className="font-sans text-[9px] uppercase tracking-[0.15em] text-[#6B6A5E] hover:text-[#EE3C24] transition-colors flex items-center gap-1.5 underline underline-offset-4">
                    <Info size={10} /> Size Guide
                  </button>
                </div>

                {sizeError && (
                  <p className="font-sans text-[9px] uppercase tracking-[0.15em] text-[#EE3C24] mb-2 animate-pulse">
                    Please select a size.
                  </p>
                )}

                <div className="grid grid-cols-5 gap-1.5">
                  {SIZES_ORDER.map((size) => {
                    const variant = currentGSMVariants.find((v: Variant) => v.size === size);
                    const isOutOfStock = !variant || variant.stock <= 0;
                    return (
                      <button
                        key={size}
                        onClick={() => { if (!isOutOfStock) { setSelectedSize(size); setSizeError(false); } }}
                        disabled={isOutOfStock}
                        className={`py-3 border font-sans text-[10px] uppercase tracking-[0.1em] transition-all duration-200 relative ${
                          isOutOfStock
                            ? "border-[#1A1A17] text-[#1A1A17] cursor-not-allowed"
                            : selectedSize === size
                            ? "border-[#ECE7D1] bg-[#ECE7D1] text-[#050505] font-bold"
                            : "border-[#1A1A17] text-[#6B6A5E] hover:border-[#555450] hover:text-[#ECE7D1]"
                        }`}
                      >
                        {size}
                        {isOutOfStock && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="w-full h-px bg-[#1A1A17] rotate-45 absolute" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={availableGSMs.length === 0}
                  className={`flex-1 py-4 font-sans text-[11px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all duration-300 border ${
                    added
                      ? "bg-[#ECE7D1] border-[#ECE7D1] text-[#050505]"
                      : availableGSMs.length === 0
                      ? "bg-[#0D0D0B] border-[#1A1A17] text-[#403F38] cursor-not-allowed"
                      : "bg-[#EE3C24] border-[#EE3C24] text-[#050505] hover:bg-[#ECE7D1] hover:border-[#ECE7D1]"
                  }`}
                >
                  {added ? <><Check size={14} strokeWidth={2} /> Added</> : availableGSMs.length === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
                <button className="flex-1 py-4 font-sans text-[11px] font-bold uppercase tracking-[0.2em] border border-[#ECE7D1] text-[#ECE7D1] hover:bg-[#ECE7D1] hover:text-[#050505] transition-all duration-300">
                  Buy Now
                </button>
              </div>

              {/* Trust badges */}
              <div className="space-y-2.5 pt-4 border-t border-[#1A1A17]">
                {[
                  "✓  Free worldwide shipping over ₹1999",
                  "✓  30-day returns policy",
                  "✓  Secure checkout",
                ].map((badge) => (
                  <p key={badge} className="font-sans text-[9px] tracking-[0.1em] text-[#555450]">{badge}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 02: PRODUCT STORY ── */}
      <section className="border-b border-[#1A1A17] py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="flex items-center gap-4 mb-12">
            <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-[#EE3C24]">02 / PRODUCT STORY</span>
            <div className="flex-1 h-px bg-[#1A1A17]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Left: large lifestyle image + small fabric close-up */}
            <div className="relative border-r border-[#1A1A17]">
              <div className="grid grid-cols-2 gap-0 h-full">
                <div className="relative aspect-[3/4] border-r border-[#1A1A17] bg-[#0D0D0B]">
                  {images[1]?.url ? (
                    <Image src={images[1].url} alt="Lifestyle" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                      <span className="font-sans text-[9px] uppercase tracking-[0.15em] text-[#403F38]">[ LIFESTYLE IMAGE ]</span>
                      <span className="font-sans text-[8px] uppercase tracking-[0.1em] text-[#1A1A17]">editorial · campaign</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="flex-1 relative bg-[#0D0D0B] border-b border-[#1A1A17]">
                    {images[2]?.url ? (
                      <Image src={images[2].url} alt="Fabric close-up" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-sans text-[9px] uppercase tracking-[0.12em] text-[#403F38]">[ FABRIC CLOSE-UP ]</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#EE3C24] mb-3">Item Description</p>
                    <p className="font-sans text-[11px] leading-[1.8] text-[#6B6A5E]">
                      {product.description || "Ultra-dense construction. Engineered for shape retention wash after wash. A statement in restraint."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Headline + description */}
            <div className="p-10 md:p-16 flex flex-col justify-center">
              <h2 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.88] text-[#ECE7D1] mb-8">
                A study in<br />restraint.<br />
                <em className="text-[#EE3C24]">Crafted for<br />the archive.</em>
              </h2>
              <p className="font-sans text-[12px] leading-[1.9] tracking-[0.03em] text-[#969382] max-w-sm">
                Every garment begins with an obsession. Over fabric weight. Over silhouette. Over the exact moment a collar collapses just right. This piece is no different.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 03: FABRIC & DETAILS ── */}
      <section className="border-b border-[#1A1A17] py-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="flex items-center gap-4 mb-12">
            <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-[#EE3C24]">03 / FABRIC & DETAILS</span>
            <div className="flex-1 h-px bg-[#1A1A17]" />
          </div>
          <h3 className="font-serif text-3xl md:text-4xl text-[#ECE7D1] mb-10">Technical Specification</h3>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-0 border-t border-l border-[#1A1A17]">
            {FABRIC_SPECS.map((spec) => (
              <div key={spec.label} className="border-r border-b border-[#1A1A17] p-6 flex flex-col gap-3">
                <span className="text-xl text-[#EE3C24]">{spec.icon}</span>
                <div>
                  <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#6B6A5E] mb-1">{spec.label}</p>
                  <p className="font-sans text-[11px] uppercase tracking-[0.12em] text-[#ECE7D1]">{spec.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 04: MODEL FIT PREVIEW ── */}
      <section className="border-b border-[#1A1A17] py-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="flex items-center gap-4 mb-4">
            <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-[#EE3C24]">04 / MODEL FIT PREVIEW</span>
            <div className="flex-1 h-px bg-[#1A1A17]" />
          </div>
          <div className="flex items-end justify-between mb-10">
            <h3 className="font-serif text-3xl md:text-4xl text-[#ECE7D1]">On the<br />model.</h3>
            <p className="font-sans text-[9px] uppercase tracking-[0.15em] text-[#6B6A5E]">
              Model 'height' · wearing size <span className="text-[#ECE7D1]">M</span>
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-t border-l border-[#1A1A17]">
            {/* Large front */}
            <div className="col-span-1 row-span-2 border-r border-b border-[#1A1A17] relative aspect-[3/4] bg-[#0D0D0B]">
              {images[0]?.url ? (
                <Image src={images[0].url} alt="Front view" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-sans text-[9px] uppercase tracking-[0.12em] text-[#403F38]">[ FRONT VIEW ]</span>
                </div>
              )}
              <div className="absolute bottom-4 left-4">
                <span className="font-sans text-[8px] uppercase tracking-[0.15em] text-[#6B6A5E] bg-black/60 backdrop-blur-sm px-2 py-1 border border-[#1A1A17]">Front</span>
              </div>
            </div>
            {/* Side view */}
            <div className="border-r border-b border-[#1A1A17] relative aspect-[3/4] bg-[#0D0D0B]">
              {images[1]?.url ? (
                <Image src={images[1].url} alt="Side view" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-sans text-[9px] uppercase tracking-[0.12em] text-[#403F38]">[ SIDE VIEW ]</span>
                </div>
              )}
            </div>
            {/* Back view */}
            <div className="border-r border-b border-[#1A1A17] relative aspect-[3/4] bg-[#0D0D0B]">
              {images[2]?.url ? (
                <Image src={images[2].url} alt="Back view" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-sans text-[9px] uppercase tracking-[0.12em] text-[#403F38]">[ BACK VIEW ]</span>
                </div>
              )}
            </div>
            {/* Detail shot */}
            <div className="border-r border-b border-[#1A1A17] relative aspect-square bg-[#0D0D0B]">
              {images[3]?.url ? (
                <Image src={images[3].url} alt="Detail" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-sans text-[9px] uppercase tracking-[0.12em] text-[#403F38]">[ DETAIL ]</span>
                </div>
              )}
            </div>
            {/* Notes */}
            <div className="border-r border-b border-[#1A1A17] p-6 flex flex-col gap-3">
              <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#EE3C24]">FIT NOTES</p>
              <ul className="space-y-2">
                {[
                  "Shoulder seam past tip",
                  "Sleeves hit mid forearm",
                  "Canvas fits mid-thigh",
                  "Size down for cropped",
                ].map((note) => (
                  <li key={note} className="font-sans text-[10px] text-[#6B6A5E] leading-[1.6] flex items-start gap-2">
                    <span className="text-[#EE3C24] mt-0.5">—</span>{note}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 05: STYLED WITH ── */}
      <section className="border-b border-[#1A1A17] py-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="flex items-center gap-4 mb-4">
            <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-[#EE3C24]">05 / COMPLETE THE FIT</span>
            <div className="flex-1 h-px bg-[#1A1A17]" />
          </div>
          <div className="flex items-end justify-between mb-10">
            <h3 className="font-serif text-3xl md:text-4xl text-[#ECE7D1]">Styled with</h3>
            <Link href="/products" className="font-sans text-[9px] uppercase tracking-[0.18em] text-[#6B6A5E] hover:text-[#EE3C24] transition-colors flex items-center gap-1.5">
              Upsell <ChevronRight size={10} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-t border-l border-[#1A1A17]">
            {[1,2,3,4].map((i) => (
              <div key={i} className="border-r border-b border-[#1A1A17] group cursor-pointer">
                <div className="relative aspect-[3/4] bg-[#0D0D0B] overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-sans text-[9px] uppercase tracking-[0.12em] text-[#403F38]">[ IMAGE ]</span>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between border-t border-[#1A1A17]">
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-[#ECE7D1] mb-0.5">Archive Piece {i}</p>
                    <p className="font-sans text-[9px] uppercase tracking-[0.12em] text-[#6B6A5E]">₹ {[660, 1320, 900, 2140][i-1]}</p>
                  </div>
                  <button className="w-6 h-6 border border-[#1A1A17] flex items-center justify-center hover:border-[#EE3C24] hover:text-[#EE3C24] transition-all text-[#6B6A5E]">
                    <Plus size={10} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 06: REVIEWS ── */}
      <section className="border-b border-[#1A1A17] py-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="flex items-center gap-4 mb-12">
            <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-[#EE3C24]">06 / REVIEWS</span>
            <div className="flex-1 h-px bg-[#1A1A17]" />
          </div>
          <h3 className="font-serif text-3xl md:text-4xl text-[#ECE7D1] mb-10">What buyers say</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-l border-[#1A1A17]">
            {/* Rating summary */}
            <div className="border-r border-b border-[#1A1A17] p-8 flex flex-col justify-center gap-4">
              <div className="flex items-end gap-2">
                <span className="font-serif text-[5rem] leading-none text-[#ECE7D1]">4.6</span>
                <span className="font-sans text-[11px] uppercase tracking-[0.15em] text-[#6B6A5E] mb-4">/ 5.0</span>
              </div>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={14} fill={s <= 4 ? "#EE3C24" : "none"} stroke={s <= 4 ? "#EE3C24" : "#403F38"} />
                ))}
              </div>
              <p className="font-sans text-[9px] uppercase tracking-[0.15em] text-[#6B6A5E]">Based on 120 reviews</p>
              <button className="mt-2 font-sans text-[9px] uppercase tracking-[0.15em] text-[#EE3C24] border-b border-[#EE3C24]/40 pb-0.5 w-fit hover:border-[#EE3C24] transition-colors">
                Read all 120
              </button>
            </div>

            {/* Review cards */}
            {MOCK_REVIEWS.map((review) => (
              <div key={review.id} className="border-r border-b border-[#1A1A17] p-8 flex flex-col justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={9} fill={s <= review.rating ? "#EE3C24" : "none"} stroke={s <= review.rating ? "#EE3C24" : "#403F38"} />
                      ))}
                    </div>
                    {review.verified && (
                      <span className="font-sans text-[8px] uppercase tracking-[0.12em] text-[#EE3C24] border border-[#EE3C24]/30 px-1.5 py-0.5">Verified</span>
                    )}
                  </div>
                  <p className="font-sans text-[11px] leading-[1.8] text-[#969382]">"{review.text}"</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-[0.12em] text-[#ECE7D1]">{review.name}</p>
                    <p className="font-sans text-[9px] tracking-[0.1em] text-[#403F38] mt-0.5">{review.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 07: FAQ ── */}
      <section className="border-b border-[#1A1A17] py-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="flex items-center gap-4 mb-12">
            <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-[#EE3C24]">07 / FAQ</span>
            <div className="flex-1 h-px bg-[#1A1A17]" />
          </div>
          <h3 className="font-serif text-3xl md:text-4xl text-[#ECE7D1] mb-10">Frequently asked</h3>

          <div className="space-y-0 border-t border-[#1A1A17]">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="border-b border-[#1A1A17]">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left group"
                >
                  <span className="font-sans text-[11px] uppercase tracking-[0.12em] text-[#ECE7D1] group-hover:text-[#EE3C24] transition-colors">
                    {item.q}
                  </span>
                  <motion.div animate={{ rotate: openFaq === i ? 45 : 0 }} transition={{ duration: 0.3 }}>
                    <Plus size={14} strokeWidth={1.5} className={`${openFaq === i ? "text-[#EE3C24]" : "text-[#403F38]"} transition-colors`} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="font-sans text-[11px] leading-[1.8] text-[#6B6A5E] pb-5 max-w-2xl">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 08: RELATED PRODUCTS ── */}
      <section className="py-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="flex items-center gap-4 mb-4">
            <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-[#EE3C24]">08 / RELATED PRODUCT</span>
            <div className="flex-1 h-px bg-[#1A1A17]" />
          </div>
          <div className="flex items-end justify-between mb-10">
            <h3 className="font-serif text-3xl md:text-4xl text-[#ECE7D1]">You might also<br />like</h3>
            <Link href="/products" className="font-sans text-[9px] uppercase tracking-[0.18em] text-[#6B6A5E] hover:text-[#EE3C24] transition-colors flex items-center gap-1.5">
              View all <ChevronRight size={10} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-t border-l border-[#1A1A17]">
            {[1,2,3,4].map((i) => (
              <Link key={i} href="/products" className="border-r border-b border-[#1A1A17] group">
                <div className="relative aspect-[3/4] bg-[#0D0D0B] overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-sans text-[9px] uppercase tracking-[0.12em] text-[#403F38]">[ PRODUCT ]</span>
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="p-4 flex items-center justify-between border-t border-[#1A1A17]">
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-[#ECE7D1] mb-0.5">Archive Piece {i}</p>
                    <p className="font-sans text-[9px] uppercase tracking-[0.12em] text-[#6B6A5E]">₹ {[560, 980, 725, 1240][i-1]}</p>
                  </div>
                  <Plus size={12} strokeWidth={1.5} className="text-[#403F38] group-hover:text-[#EE3C24] transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}