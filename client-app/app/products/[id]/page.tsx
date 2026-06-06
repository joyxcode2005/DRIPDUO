"use client";

import { useState, use, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Star, Plus } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { getProductById, getAllProducts } from "@/services/products";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/product/ProductCard";

interface Category { name: string; }
interface ProductImage { url: string; }
interface Variant { id: string; size: string; gsm: string | number; stock: number; }
interface Product {
  id: string; name: string; description?: string; price: number; final_price?: number; discount?: number;
  categories?: Category[]; variants?: Variant[]; images?: ProductImage[]; product_images?: ProductImage[]; total_stock?: number;
}

const SIZES_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const GSM_DETAILS: Record<string, { label: string; desc: string }> = {
  "220": { label: "220 GSM", desc: "Lightweight & Breathable" },
  "240": { label: "240 GSM", desc: "Heavyweight Structure" },
};

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
  { q: "How does the fit run?", a: "Relaxed through the body, true to chest. Size down if you prefer a cropped silhouette." },
  { q: "What is the return policy?", a: "30-day returns on unworn, unwashed items with original tags. Exchanges processed within 5 business days." },
  { q: "How should I care for this piece?", a: "Cold wash inside out, hang dry. Avoid tumble drying to preserve the weight and structure." },
  { q: "Do you restock the archive?", a: "Select pieces are restocked seasonally. Sign up for restock alerts on the product page." },
  { q: "Shipping & delivery times?", a: "Standard: 5–7 business days. Express: 2–3 business days. Free shipping on orders over ₹1999." },
];

// ── 3D APERTURE CAROUSEL LOGIC ──
const getCardState = (index: number, activeIndex: number, total: number) => {
  if (total <= 1) return "center";
  if (total === 2) return index === activeIndex ? "center" : "right";

  const diff = (index - activeIndex + total) % total;
  if (diff === 0) return "center";
  if (diff === 1) return "right";
  if (diff === total - 1) return "left";
  return "hidden";
};

const carouselVariants = {
  center: {
    x: "0%",
    z: 0,
    rotateY: 0,
    scale: 1,
    zIndex: 30,
    opacity: 1,
    filter: "blur(0px)",
  },
  left: {
    x: "-55%",
    z: -100,
    rotateY: 15,
    scale: 0.8,
    zIndex: 20,
    opacity: 0.6,
    filter: "blur(8px)",
  },
  right: {
    x: "55%",
    z: -100,
    rotateY: -15,
    scale: 0.8,
    zIndex: 20,
    opacity: 0.6,
    filter: "blur(8px)",
  },
  hidden: {
    x: "0%",
    z: -200,
    rotateY: 0,
    scale: 0.5,
    zIndex: 10,
    opacity: 0,
    filter: "blur(12px)",
  },
};

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { addToCart, openCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedGSM, setSelectedGSM] = useState<string>("");
  const [sizeError, setSizeError] = useState(false);
  const [added, setAdded] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeView, setActiveView] = useState<"FRONT" | "BACK" | "FABRIC" | "DETAIL">("FRONT");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [quickAddStatus, setQuickAddStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchProduct = async () => {
      const fetched: Product = await getProductById(id);
      setProduct(fetched);
      if (fetched?.variants && fetched.variants.length > 0) setSelectedGSM(String(fetched.variants[0].gsm));

      try {
        const related = await getAllProducts();
        const relatedData = Array.isArray(related) ? related : (related as any)?.data || [];
        if (Array.isArray(relatedData)) {
          setRelatedProducts(relatedData.filter((p: Product) => p.id !== id).slice(0, 5));
        }
      } catch (err) { console.error("Error fetching related products:", err); }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!selectedSize) { setSizeError(true); return; }
    setSizeError(false);
    if (!product || !product.variants) return;

    const selectedVariant = product.variants.find((v: Variant) => v.size === selectedSize && String(v.gsm) === selectedGSM);
    if (!selectedVariant || selectedVariant.stock <= 0) return alert("Sorry, this specific size and fabric weight is out of stock.");
    
    try {
      await addToCart({
        productId: product.id, variantId: selectedVariant.id, name: product.name,
        price: product.final_price || product.price, image: product.product_images?.[0]?.url || product.images?.[0]?.url || "",
        size: selectedSize, gsm: selectedGSM, quantity: 1, stock: selectedVariant.stock,
      });
      setAdded(true); 
      openCart();
      setTimeout(() => setAdded(false), 2000);
    } catch (error) { console.error("Error adding item to cart:", error); }
  };

  const toggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.preventDefault(); e.stopPropagation();
    setWishlist(prev => prev.includes(productId) ? prev.filter(item => item !== productId) : [...prev, productId]);
  };

  const handleQuickAdd = async (e: React.MouseEvent, relatedProduct: Product) => {
    e.preventDefault(); e.stopPropagation();
    const defaultVariant = relatedProduct.variants?.[0];
    try {
        await addToCart({
            productId: relatedProduct.id, variantId: defaultVariant?.id || `${relatedProduct.id}-default`, name: relatedProduct.name,
            price: relatedProduct.final_price || relatedProduct.price, image: relatedProduct.product_images?.[0]?.url || "/placeholder-shirt.png",
            size: defaultVariant?.size || "M", gsm: String(defaultVariant?.gsm || "240"), quantity: 1, stock: defaultVariant?.stock || 10,
        });
        setQuickAddStatus(prev => ({ ...prev, [relatedProduct.id]: true }));
        openCart();
        setTimeout(() => setQuickAddStatus(prev => ({ ...prev, [relatedProduct.id]: false })), 2000);
    } catch (error) { console.error("Error adding related product:", error); }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center w-full">
        <div className="glass-panel p-10 rounded-3xl flex flex-col items-center gap-4 shadow-2xl">
          <div className="w-12 h-12 border-2 border-white/10 animate-spin rounded-full border-t-[#EE3C24]" />
          <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-white/50 animate-pulse">Loading Archive...</p>
        </div>
      </div>
    );
  }

  const availableGSMs = Array.from(new Set(product.variants?.map((v: Variant) => String(v.gsm)) || [])) as string[];
  const currentGSMVariants = product.variants?.filter((v: Variant) => String(v.gsm) === selectedGSM) || [];
  
  // ── FIX: PADDING IMAGES IF THERE ARE LESS THAN 3 ──
  // Supabase usually returns 'product_images' instead of 'images'. Let's ensure we grab the right ones.
  const actualImages = product.product_images || product.images || [];
  
  // If we have fewer than 3 images, the 3D carousel won't look right. So we pad it with our local mockups.
  const images = actualImages.length >= 3 
    ? actualImages 
    : [
        ...actualImages,
        { url: "/images/mockup.png" },
        { url: "/images/about.webp" },
        { url: "/images/bts.jpeg" },
        { url: "/images/studio.avif" }
      ].slice(0, 5); // Keep a max of 5 images so it's clean

  return (
    <div className="min-h-screen text-[#ECE7D1] font-sans relative z-10 pt-6 md:pt-10 pb-20 w-full overflow-x-hidden">
      
      {/* ── SECTION 01: HERO PRODUCT VIEWER ── */}
      <section className="mb-24 w-full">
        <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
          
          {/* DISTRACTION FREE: Simple Back to Archive Button */}
          <div className="mb-6 md:mb-8">
            <Link href="/products" className="inline-flex items-center gap-3 font-sans text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors glass-panel px-6 py-3 rounded-full hover:bg-white/10 w-fit shadow-md">
              <ArrowLeft size={14} strokeWidth={1.5} /> Back to Archive
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 xl:gap-10 items-start">
            
            {/* Left: Thumbnail Rail (Desktop Only) */}
            <div className="hidden lg:flex flex-col gap-4 w-20 xl:w-24 shrink-0 sticky top-10">
              {(["FRONT", "BACK", "FABRIC", "DETAIL"] as const).map((view) => (
                <button
                  key={view} onClick={() => setActiveView(view)}
                  className={`w-full aspect-square rounded-[1.5rem] flex items-center justify-center font-sans text-[9px] xl:text-[10px] uppercase tracking-[0.12em] transition-all duration-300 ${
                    activeView === view ? "glass-panel text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]" : "glass-button text-white/40 hover:text-white/80"
                  }`}
                >
                  {view}
                </button>
              ))}
              {images.slice(0, 4).map((img: ProductImage, i: number) => (
                <button
                  key={i} onClick={() => setActiveImageIndex(i)}
                  className={`w-full aspect-square rounded-[1.5rem] overflow-hidden transition-all duration-300 p-1.5 ${
                    activeImageIndex === i ? "glass-panel shadow-[0_0_20px_rgba(255,255,255,0.1)]" : "glass-button opacity-50 hover:opacity-100"
                  }`}
                >
                  {img.url ? (
                    <Image src={img.url} alt="" width={100} height={100} className="w-full h-full object-cover rounded-[1.2rem]" />
                  ) : (
                     <div className="w-full h-full bg-white/5 rounded-[1.2rem]" />
                  )}
                </button>
              ))}
            </div>

            {/* Center: Main Image Carousel (3D Aperture) */}
            <div className="relative glass-panel rounded-[2.5rem] overflow-hidden p-2 md:p-2.5 shadow-2xl w-full lg:flex-1 flex flex-col">
              <div 
                className="relative w-full aspect-[4/5] sm:aspect-square lg:aspect-auto lg:h-[80vh] min-h-[500px] rounded-2xl md:rounded-3xl overflow-hidden flex items-center justify-center bg-black/40"
                style={{ perspective: "1200px", transformStyle: "preserve-3d" }} // Required for 3D
              >
                
                {images.length > 0 ? (
                  images.map((img: ProductImage, i: number) => {
                    const state = getCardState(i, activeImageIndex, images.length);
                    return (
                      <motion.div
                        key={i}
                        variants={carouselVariants}
                        initial={false}
                        animate={state}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // Buttery smooth Apple-like easing
                        className="absolute w-[75%] h-[85%] md:w-[65%] md:h-[90%] rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] origin-center"
                        onClick={() => {
                          if (state !== "center") setActiveImageIndex(i);
                        }}
                        style={{ cursor: state === "center" ? "default" : "pointer" }}
                      >
                        <Image src={img.url} alt={product.name} fill className="object-cover object-top" />
                        
                        {/* Moody dark overlay for the items pushed to the side */}
                        <motion.div
                          animate={{ opacity: state === "center" ? 0 : 0.3 }}
                          transition={{ duration: 0.8 }}
                          className="absolute inset-0 bg-black pointer-events-none"
                        />
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-white/30">[ NO IMAGES ]</span>
                  </div>
                )}

                {/* Left/Right Carousel Controls */}
                {images.length > 1 && (
                  <>
                    <button onClick={() => setActiveImageIndex(i => (i - 1 + images.length) % images.length)} className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 glass-panel hover:bg-white/20 rounded-full flex items-center justify-center z-40 text-white shadow-xl backdrop-blur-md border border-white/20 transition-colors">
                      <ChevronLeft size={20} strokeWidth={2} />
                    </button>
                    <button onClick={() => setActiveImageIndex(i => (i + 1) % images.length)} className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 glass-panel hover:bg-white/20 rounded-full flex items-center justify-center z-40 text-white shadow-xl backdrop-blur-md border border-white/20 transition-colors">
                      <ChevronRight size={20} strokeWidth={2} />
                    </button>
                  </>
                )}

                {/* Overlays / Badges */}
                <div className="absolute top-6 left-6 md:top-8 md:left-8 z-40">
                  <span className="font-sans text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-white/90 glass-panel px-4 py-2 md:px-5 md:py-2.5 rounded-full shadow-lg">
                    {activeView} VIEW
                  </span>
                </div>
                <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 z-40">
                  <span className="font-sans text-[9px] md:text-[10px] uppercase tracking-[0.12em] text-white/90 glass-panel px-4 py-2 md:px-5 md:py-2.5 rounded-full shadow-lg">
                    {activeImageIndex + 1} / {Math.max(images.length, 1)}
                  </span>
                </div>
              </div>
              
              {/* Mobile pagination dots */}
              <div className="flex lg:hidden justify-center gap-3 p-4 md:p-5">
                {images.map((_: ProductImage, i: number) => (
                  <button key={i} onClick={() => setActiveImageIndex(i)} className={`h-2 rounded-full transition-all duration-500 ${i === activeImageIndex ? "bg-white w-8" : "bg-white/20 w-2"}`} />
                ))}
              </div>
            </div>

            {/* Right: Product Info Panel */}
            <div className="glass-panel p-6 sm:p-8 md:p-12 xl:p-14 rounded-[2.5rem] flex flex-col h-fit shadow-2xl w-full lg:w-[400px] xl:w-[480px] 2xl:w-[550px] shrink-0 sticky top-10">
              <div className="flex items-center gap-4 mb-6 md:mb-8">
                <div className="flex gap-1.5">
                  {[1,2,3,4,5].map(s => <Star key={s} size={14} fill={s <= 4 ? "#EE3C24" : "none"} stroke={s <= 4 ? "#EE3C24" : "rgba(255,255,255,0.2)"} /> )}
                </div>
                <span className="font-sans text-[10px] md:text-[11px] uppercase tracking-[0.15em] text-white/60">4.6 · 120 reviews</span>
              </div>

              <p className="font-sans text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-[#EE3C24] mb-3 md:mb-4">
                {product.categories?.[0]?.name || "Apparel"} / FW26
              </p>

              <h1 className="font-serif text-[clamp(2.5rem,4vw,4.5rem)] leading-[0.92] text-[#ECE7D1] mb-6 md:mb-8">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 md:gap-5 mb-8 md:mb-10">
                {(product.discount ?? 0) > 0 ? (
                  <>
                    <span className="font-sans text-[12px] md:text-[14px] tracking-widest text-white/40 line-through">₹{product.price}</span>
                    <span className="font-serif text-3xl md:text-4xl text-white">₹{product.final_price}</span>
                    <span className="font-sans text-[9px] md:text-[10px] uppercase tracking-[0.15em] text-[#EE3C24] border border-[#EE3C24]/30 bg-[#EE3C24]/10 rounded-full px-3 py-1 md:px-4 md:py-1.5">
                      SAVE ₹{(product.price - (product.final_price ?? product.price)).toFixed(0)}
                    </span>
                  </>
                ) : (
                  <span className="font-serif text-3xl md:text-4xl text-white">₹{product.price}</span>
                )}
              </div>

              <p className="font-sans text-[13px] md:text-[14px] xl:text-[15px] leading-[1.8] tracking-[0.02em] text-white/60 mb-10 md:mb-12">
                {product.description?.slice(0, 150) || "Premium heavyweight cotton. Engineered for those who refuse to settle. Experience the silhouette."}
              </p>

              {/* Controls */}
              {availableGSMs.length > 0 && (
                <div className="mb-8 md:mb-10 glass-panel p-5 md:p-6 rounded-3xl">
                  <p className="font-sans text-[9px] md:text-[10px] uppercase tracking-[0.22em] text-white/50 mb-4 md:mb-5">Fabric Weight</p>
                  <div className="flex gap-3 flex-wrap">
                    {availableGSMs.map((gsmValue) => {
                      const details = GSM_DETAILS[gsmValue] || { label: `${gsmValue} GSM`, desc: "" };
                      return (
                        <button
                          key={gsmValue} onClick={() => { setSelectedGSM(gsmValue); setSizeError(false); }}
                          className={`px-5 md:px-6 py-3 md:py-4 rounded-[1.2rem] font-sans text-[10px] md:text-[11px] uppercase tracking-[0.12em] transition-all duration-200 ${
                            selectedGSM === gsmValue ? "bg-white text-black shadow-lg" : "glass-button text-white/70 hover:bg-white/10"
                          }`}
                        >
                          {details.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mb-10 md:mb-12 glass-panel p-5 md:p-6 rounded-3xl">
                <div className="flex items-center justify-between mb-4 md:mb-5">
                  <p className="font-sans text-[9px] md:text-[10px] uppercase tracking-[0.22em] text-white/50">Select Size</p>
                  <button className="font-sans text-[9px] md:text-[10px] uppercase tracking-[0.15em] text-white/50 hover:text-[#EE3C24] transition-colors underline underline-offset-4">Size Guide</button>
                </div>
                {sizeError && <p className="font-sans text-[9px] md:text-[10px] uppercase tracking-[0.15em] text-[#EE3C24] mb-4 animate-pulse">Please select a size.</p>}
                
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 md:gap-3">
                  {SIZES_ORDER.map((size) => {
                    const variant = currentGSMVariants.find((v: Variant) => v.size === size);
                    const isOutOfStock = !variant || variant.stock <= 0;
                    return (
                      <button
                        key={size} onClick={() => { if (!isOutOfStock) { setSelectedSize(size); setSizeError(false); } }} disabled={isOutOfStock}
                        className={`py-3 md:py-4 rounded-[1.2rem] font-sans text-[11px] md:text-[12px] uppercase tracking-widest transition-all duration-200 relative ${
                          isOutOfStock ? "bg-white/5 text-white/20 cursor-not-allowed border border-white/5" 
                          : selectedSize === size ? "bg-white text-black shadow-lg font-bold" : "glass-button text-white/80 hover:bg-white/10"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CTA */}
              <div className="flex gap-4 md:gap-5 mb-8 md:mb-10">
                <button
                  onClick={handleAddToCart} disabled={availableGSMs.length === 0}
                  className={`flex-1 py-5 md:py-6 rounded-full font-sans text-[11px] md:text-[12px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all duration-300 shadow-xl ${
                    added ? "bg-white text-black" : availableGSMs.length === 0 ? "glass-button text-white/30 cursor-not-allowed" : "bg-[#EE3C24] text-white hover:bg-white hover:text-black"
                  }`}
                >
                  {added ? <><Check className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2} /> Added</> : availableGSMs.length === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>

              <div className="space-y-3 md:space-y-4 pt-6 md:pt-8 border-t border-white/10">
                {["✓ Free worldwide shipping over ₹1999", "✓ 30-day unworn returns", "✓ Encrypted secure checkout"].map((badge) => (
                  <p key={badge} className="font-sans text-[10px] md:text-[11px] tracking-widest text-white/50">{badge}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TECHNICAL SPECIFICATION ── */}
      <section className="mb-24 w-full">
        <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
          <div className="flex items-center gap-5 mb-10">
            <span className="font-sans text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-[#EE3C24]">Technical Specs</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
             {FABRIC_SPECS.map((spec) => (
                <div key={spec.label} className="glass-panel p-6 md:p-8 rounded-[2rem] flex flex-col gap-3 md:gap-4 shadow-lg">
                  <span className="text-2xl md:text-3xl text-white/80 drop-shadow-md">{spec.icon}</span>
                  <div>
                    <p className="font-sans text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1.5 md:mb-2">{spec.label}</p>
                    <p className="font-sans text-[11px] md:text-[12px] uppercase tracking-[0.12em] text-white/90">{spec.value}</p>
                  </div>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 02: PRODUCT STORY ── */}
      <section className="mb-24 w-full">
        <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
          <div className="glass-panel rounded-[3rem] overflow-hidden flex flex-col md:grid md:grid-cols-2 shadow-2xl">
            <div className="p-10 md:p-16 lg:p-24 xl:p-32 flex flex-col justify-center order-2 md:order-1">
              <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-white/40 mb-8 md:mb-12">02 / PRODUCT STORY</span>
              <h2 className="font-serif text-[clamp(3rem,5vw,5.5rem)] leading-[0.9] text-white mb-8 md:mb-12 drop-shadow-lg">
                A study in restraint.<br /><em className="text-[#EE3C24]">Crafted for the archive.</em>
              </h2>
              <p className="font-sans text-[14px] xl:text-[16px] leading-[1.9] tracking-[0.03em] text-white/60 max-w-xl">
                Every garment begins with an obsession. Over fabric weight. Over silhouette. Over the exact moment a collar collapses just right. This piece is no different.
              </p>
            </div>
            <div className="relative aspect-square md:aspect-auto order-1 md:order-2">
              {images[1]?.url ? (
                  <Image src={images[1].url} alt="Story" fill className="object-cover" />
              ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center">
                      <span className="text-white/20 text-[11px] tracking-widest uppercase">No Image Available</span>
                  </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-[#050505] to-transparent opacity-80" />
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 03: MODEL FIT PREVIEW ── */}
      <section className="mb-24 w-full">
        <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <h3 className="font-serif text-4xl md:text-5xl xl:text-6xl text-white">On the model.</h3>
            <p className="font-sans text-[11px] uppercase tracking-[0.15em] glass-panel px-6 py-3 rounded-full text-white/70 w-fit shadow-lg">
              Height 6'1" · <span className="text-white font-bold">Size M</span>
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="col-span-2 lg:col-span-1 lg:row-span-2 glass-panel rounded-[2rem] md:rounded-[3rem] relative aspect-square lg:aspect-[3/4] overflow-hidden p-2 md:p-3 shadow-xl">
              <div className="relative w-full h-full rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden">
                {images[0]?.url ? (
                    <Image src={images[0].url} alt="Front view" fill className="object-cover" />
                ) : (
                    <div className="w-full h-full bg-white/5 flex items-center justify-center"><span className="text-white/30 text-[10px] uppercase tracking-widest">No Image</span></div>
                )}
                <span className="absolute bottom-6 left-6 font-sans text-[10px] uppercase tracking-[0.15em] text-white glass-panel px-4 py-2 rounded-full shadow-lg">Front</span>
              </div>
            </div>
            
            <div className="col-span-1 glass-panel rounded-[2rem] md:rounded-[3rem] relative aspect-[3/4] overflow-hidden p-2 md:p-3 shadow-xl">
              <div className="relative w-full h-full rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden">
                 {images[1]?.url ? (
                    <Image src={images[1].url} alt="Side view" fill className="object-cover" />
                 ) : (
                    <div className="w-full h-full bg-white/5 flex items-center justify-center"><span className="text-white/30 text-[10px] uppercase tracking-widest">No Image</span></div>
                 )}
              </div>
            </div>
            
            <div className="col-span-1 glass-panel rounded-[2rem] md:rounded-[3rem] relative aspect-[3/4] overflow-hidden p-2 md:p-3 shadow-xl">
               <div className="relative w-full h-full rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden">
                 {images[2]?.url ? (
                    <Image src={images[2].url} alt="Back view" fill className="object-cover" />
                 ) : (
                    <div className="w-full h-full bg-white/5 flex items-center justify-center"><span className="text-white/30 text-[10px] uppercase tracking-widest">No Image</span></div>
                 )}
               </div>
            </div>
            
            <div className="col-span-2 lg:col-span-1 glass-panel rounded-[2rem] md:rounded-[3rem] p-10 xl:p-14 flex flex-col gap-6 justify-center shadow-xl">
              <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#EE3C24]">FIT NOTES</p>
              <ul className="space-y-5">
                {["Shoulder seam past tip", "Sleeves hit mid forearm", "Canvas fits mid-thigh", "Size down for cropped"].map((note) => (
                  <li key={note} className="font-sans text-[12px] xl:text-[13px] text-white/70 leading-[1.6] flex items-start gap-4">
                    <span className="text-white/30 mt-0.5">—</span>{note}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 04: RELATED PRODUCTS ── */}
      <section className="mb-24 w-full">
        <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <h3 className="font-serif text-4xl md:text-5xl xl:text-6xl text-white">You might like</h3>
            <Link href="/products" className="font-sans text-[11px] uppercase tracking-[0.18em] text-white/60 hover:text-black hover:bg-white transition-colors glass-button px-8 py-4 rounded-full shadow-lg w-fit">
              View all 
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 xl:gap-8">
            {relatedProducts.length > 0 ? (
                relatedProducts.map((relatedProduct) => (
                    <ProductCard 
                        key={relatedProduct.id}
                        product={relatedProduct}
                        onQuickAdd={(e: React.MouseEvent) => handleQuickAdd(e, relatedProduct)}
                        onToggleWishlist={(e: React.MouseEvent) => toggleWishlist(e, relatedProduct.id)}
                        isWishlisted={wishlist.includes(relatedProduct.id)}
                        isAdded={quickAddStatus[relatedProduct.id]}
                    />
                ))
            ) : (
                <div className="col-span-full py-32 flex items-center justify-center glass-panel rounded-3xl">
                    <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-white/40 animate-pulse">Loading archive...</p>
                </div>
            )}
          </div>
        </div>
      </section>

      {/* ── SECTION 05: REVIEWS ── */}
      <section className="mb-24 w-full">
        <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
          <div className="flex items-center gap-5 mb-10">
            <span className="font-sans text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-[#EE3C24]">Community Voice</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="glass-panel rounded-[3rem] p-12 xl:p-16 flex flex-col justify-center gap-6 shadow-2xl">
              <div className="flex items-end gap-4">
                <span className="font-serif text-[7rem] xl:text-[8rem] leading-none text-white drop-shadow-lg">4.6</span>
                <span className="font-sans text-[14px] uppercase tracking-[0.15em] text-white/40 mb-6">/ 5.0</span>
              </div>
              <div className="flex gap-1.5 mb-2">
                {[1,2,3,4,5].map(s => <Star key={s} size={20} fill={s <= 4 ? "#EE3C24" : "none"} stroke={s <= 4 ? "#EE3C24" : "rgba(255,255,255,0.2)"} /> )}
              </div>
              <p className="font-sans text-[12px] uppercase tracking-[0.15em] text-white/60">Based on 120 reviews</p>
            </div>

            {MOCK_REVIEWS.map((review) => (
              <div key={review.id} className="glass-panel rounded-[3rem] p-12 xl:p-16 flex flex-col justify-between gap-10 shadow-xl">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(s => <Star key={s} size={14} fill={s <= review.rating ? "#EE3C24" : "none"} stroke={s <= review.rating ? "#EE3C24" : "rgba(255,255,255,0.2)"} /> )}
                    </div>
                    {review.verified && <span className="font-sans text-[10px] uppercase tracking-[0.12em] text-[#EE3C24] glass-panel px-3 py-1.5 rounded-lg shadow-md">Verified</span>}
                  </div>
                  <p className="font-sans text-[14px] xl:text-[16px] leading-[1.8] text-white/80">&ldquo;{review.text}&rdquo;</p>
                </div>
                <div>
                  <p className="font-sans text-[12px] uppercase tracking-[0.12em] text-white">{review.name}</p>
                  <p className="font-sans text-[11px] tracking-widest text-white/40 mt-2">{review.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 06: FAQ ── */}
      <section className="mb-10 w-full">
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-8 md:px-12">
          <h3 className="font-serif text-4xl md:text-5xl xl:text-6xl text-center text-white mb-14">Frequently asked</h3>

          <div className="space-y-5">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="glass-panel rounded-3xl overflow-hidden shadow-lg">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-8 text-left group transition-colors hover:bg-white/5"
                >
                  <span className="font-sans text-[13px] md:text-[14px] uppercase tracking-[0.12em] text-white/80 group-hover:text-white transition-colors">
                    {item.q}
                  </span>
                  <motion.div animate={{ rotate: openFaq === i ? 45 : 0 }} transition={{ duration: 0.3 }}>
                    <Plus size={20} strokeWidth={1.5} className={`${openFaq === i ? "text-[#EE3C24]" : "text-white/40"}`} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden"
                    >
                      <p className="font-sans text-[14px] leading-[1.8] text-white/60 p-8 pt-0">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}