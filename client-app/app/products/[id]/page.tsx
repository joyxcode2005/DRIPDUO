"use client";

import { useState, use, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Star, Plus, RotateCcw, Info, Bookmark } from "lucide-react";
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

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { addToCart } = useCart();

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
          // Expanded related products slice to 5 for wider monitors
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
        price: product.final_price || product.price, image: product.images?.[0]?.url || "",
        size: selectedSize, gsm: selectedGSM, quantity: 1, stock: selectedVariant.stock,
      });
      setAdded(true); setTimeout(() => setAdded(false), 2000);
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
  const images = product.images || [];
  const currentImage = images[activeImageIndex]?.url || "";

  return (
    <div className="min-h-screen text-[#ECE7D1] font-sans relative z-10 pt-28 pb-20 w-full">
      
      {/* ── SECTION 01: HERO PRODUCT VIEWER ── */}
      <section className="mb-24 w-full">
        {/* Changed to 2000px max width */}
        <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
          
          <div className="flex items-center justify-between mb-8 glass-panel px-6 md:px-10 py-5 rounded-full shadow-lg">
            <Link href="/products" className="flex items-center gap-3 font-sans text-[11px] uppercase tracking-[0.2em] text-white/60 hover:text-[#EE3C24] transition-colors">
              <ArrowLeft size={14} strokeWidth={1.5} /> Archive
            </Link>
            <div className="hidden sm:flex items-center gap-4 font-sans text-[10px] uppercase tracking-[0.18em] text-white/40">
              <span>Home</span><span>/</span><span>Products</span><span>/</span>
              <span className="text-white/80">{product.name}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_450px] xl:grid-cols-[auto_1fr_550px] 2xl:grid-cols-[auto_1fr_650px] gap-6 xl:gap-10">
            
            <div className="hidden lg:flex flex-col gap-4 w-24 xl:w-28">
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

            <div className="relative glass-panel rounded-[2.5rem] overflow-hidden p-2.5 shadow-2xl">
              <div className="relative aspect-3/4 md:aspect-square lg:aspect-[4/5] xl:aspect-auto xl:h-full w-full rounded-3xl overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div key={activeImageIndex} initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="absolute inset-0">
                    {currentImage ? (
                      <Image src={currentImage} alt={product.name} fill className="object-cover object-top" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-black/20">
                        <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-white/30">[ PRODUCT IMAGE ]</span>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {images.length > 1 && (
                  <>
                    <button onClick={() => setActiveImageIndex(i => (i - 1 + images.length) % images.length)} className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 glass-button rounded-full flex items-center justify-center z-10 text-white hover:bg-white/20">
                      <ChevronLeft size={20} strokeWidth={2} />
                    </button>
                    <button onClick={() => setActiveImageIndex(i => (i + 1) % images.length)} className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 glass-button rounded-full flex items-center justify-center z-10 text-white hover:bg-white/20">
                      <ChevronRight size={20} strokeWidth={2} />
                    </button>
                  </>
                )}

                <div className="absolute top-8 left-8 z-10">
                  <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-white/90 glass-panel px-5 py-2.5 rounded-full shadow-lg">
                    {activeView} VIEW
                  </span>
                </div>
                <div className="absolute bottom-8 right-8 z-10">
                  <span className="font-sans text-[10px] uppercase tracking-[0.12em] text-white/90 glass-panel px-5 py-2.5 rounded-full shadow-lg">
                    {activeImageIndex + 1} / {Math.max(images.length, 1)}
                  </span>
                </div>
              </div>
              
              <div className="flex lg:hidden justify-center gap-3 p-5">
                {images.map((_: ProductImage, i: number) => (
                  <button key={i} onClick={() => setActiveImageIndex(i)} className={`h-2 rounded-full transition-all ${i === activeImageIndex ? "bg-white w-8" : "bg-white/20 w-2"}`} />
                ))}
              </div>
            </div>

            <div className="glass-panel p-8 md:p-12 xl:p-14 rounded-[2.5rem] flex flex-col h-fit shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="flex gap-1.5">
                  {[1,2,3,4,5].map(s => <Star key={s} size={14} fill={s <= 4 ? "#EE3C24" : "none"} stroke={s <= 4 ? "#EE3C24" : "rgba(255,255,255,0.2)"} /> )}
                </div>
                <span className="font-sans text-[11px] uppercase tracking-[0.15em] text-white/60">4.6 · 120 reviews</span>
              </div>

              <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#EE3C24] mb-4">
                {product.categories?.[0]?.name || "Apparel"} / FW26
              </p>

              <h1 className="font-serif text-[clamp(2.5rem,4vw,4.5rem)] leading-[0.92] text-[#ECE7D1] mb-8">
                {product.name}
              </h1>

              <div className="flex items-center gap-5 mb-10">
                {(product.discount ?? 0) > 0 ? (
                  <>
                    <span className="font-sans text-[14px] tracking-widest text-white/40 line-through">₹{product.price}</span>
                    <span className="font-serif text-4xl text-white">₹{product.final_price}</span>
                    <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-[#EE3C24] border border-[#EE3C24]/30 bg-[#EE3C24]/10 rounded-full px-4 py-1.5">
                      SAVE ₹{(product.price - (product.final_price ?? product.price)).toFixed(0)}
                    </span>
                  </>
                ) : (
                  <span className="font-serif text-4xl text-white">₹{product.price}</span>
                )}
              </div>

              <p className="font-sans text-[14px] xl:text-[15px] leading-[1.8] tracking-[0.02em] text-white/60 mb-12">
                {product.description?.slice(0, 150) || "Premium heavyweight cotton. Engineered for those who refuse to settle. Experience the silhouette."}
              </p>

              {availableGSMs.length > 0 && (
                <div className="mb-10 glass-panel p-6 rounded-3xl">
                  <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-white/50 mb-5">Fabric Weight</p>
                  <div className="flex gap-3 flex-wrap">
                    {availableGSMs.map((gsmValue) => {
                      const details = GSM_DETAILS[gsmValue] || { label: `${gsmValue} GSM`, desc: "" };
                      return (
                        <button
                          key={gsmValue} onClick={() => { setSelectedGSM(gsmValue); setSizeError(false); }}
                          className={`px-6 py-4 rounded-[1.2rem] font-sans text-[11px] uppercase tracking-[0.12em] transition-all duration-200 ${
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

              <div className="mb-12 glass-panel p-6 rounded-3xl">
                <div className="flex items-center justify-between mb-5">
                  <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-white/50">Select Size</p>
                  <button className="font-sans text-[10px] uppercase tracking-[0.15em] text-white/50 hover:text-[#EE3C24] transition-colors underline underline-offset-4">Size Guide</button>
                </div>
                {sizeError && <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-[#EE3C24] mb-4 animate-pulse">Please select a size.</p>}
                
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {SIZES_ORDER.map((size) => {
                    const variant = currentGSMVariants.find((v: Variant) => v.size === size);
                    const isOutOfStock = !variant || variant.stock <= 0;
                    return (
                      <button
                        key={size} onClick={() => { if (!isOutOfStock) { setSelectedSize(size); setSizeError(false); } }} disabled={isOutOfStock}
                        className={`py-4 rounded-[1.2rem] font-sans text-[12px] uppercase tracking-widest transition-all duration-200 relative ${
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

              <div className="flex gap-5 mb-10">
                <button
                  onClick={handleAddToCart} disabled={availableGSMs.length === 0}
                  className={`flex-1 py-6 rounded-full font-sans text-[12px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all duration-300 shadow-xl ${
                    added ? "bg-white text-black" : availableGSMs.length === 0 ? "glass-button text-white/30 cursor-not-allowed" : "bg-[#EE3C24] text-white hover:bg-white hover:text-black"
                  }`}
                >
                  {added ? <><Check size={18} strokeWidth={2} /> Added</> : availableGSMs.length === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>

              <div className="space-y-4 pt-8 border-t border-white/10">
                {["✓ Free worldwide shipping over ₹1999", "✓ 30-day unworn returns", "✓ Encrypted secure checkout"].map((badge) => (
                  <p key={badge} className="font-sans text-[11px] tracking-widest text-white/50">{badge}</p>
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
                <div key={spec.label} className="glass-panel p-8 rounded-[2rem] flex flex-col gap-4 shadow-lg">
                  <span className="text-3xl text-white/80 drop-shadow-md">{spec.icon}</span>
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">{spec.label}</p>
                    <p className="font-sans text-[12px] uppercase tracking-[0.12em] text-white/90">{spec.value}</p>
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
            <div className="p-10 md:p-16 lg:p-24 xl:p-32 flex flex-col justify-center">
              <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-white/40 mb-8 md:mb-12">02 / PRODUCT STORY</span>
              <h2 className="font-serif text-[clamp(3rem,5vw,5.5rem)] leading-[0.9] text-white mb-8 md:mb-12 drop-shadow-lg">
                A study in restraint.<br /><em className="text-[#EE3C24]">Crafted for the archive.</em>
              </h2>
              <p className="font-sans text-[14px] xl:text-[16px] leading-[1.9] tracking-[0.03em] text-white/60 max-w-xl">
                Every garment begins with an obsession. Over fabric weight. Over silhouette. Over the exact moment a collar collapses just right. This piece is no different.
              </p>
            </div>
            <div className="relative aspect-square md:aspect-auto">
              {images[1]?.url ? (
                  <Image src={images[1].url} alt="Story" fill className="object-cover" />
              ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center">
                      <span className="text-white/20 text-[11px] tracking-widest uppercase">No Image Available</span>
                  </div>
              )}
              <div className="absolute inset-0 bg-linear-to-l from-transparent to-[#050505]/80 md:to-black/40" />
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
            <div className="col-span-1 row-span-2 glass-panel rounded-[2rem] md:rounded-[3rem] relative aspect-3/4 overflow-hidden p-2 md:p-3 shadow-xl">
              <div className="relative w-full h-full rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden">
                {images[0]?.url ? (
                    <Image src={images[0].url} alt="Front view" fill className="object-cover" />
                ) : (
                    <div className="w-full h-full bg-white/5 flex items-center justify-center"><span className="text-white/30 text-[10px] uppercase tracking-widest">No Image</span></div>
                )}
                <span className="absolute bottom-6 left-6 font-sans text-[10px] uppercase tracking-[0.15em] text-white glass-panel px-4 py-2 rounded-full shadow-lg">Front</span>
              </div>
            </div>
            
            <div className="glass-panel rounded-[2rem] md:rounded-[3rem] relative aspect-3/4 overflow-hidden p-2 md:p-3 shadow-xl">
              <div className="relative w-full h-full rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden">
                 {images[1]?.url ? (
                    <Image src={images[1].url} alt="Side view" fill className="object-cover" />
                 ) : (
                    <div className="w-full h-full bg-white/5 flex items-center justify-center"><span className="text-white/30 text-[10px] uppercase tracking-widest">No Image</span></div>
                 )}
              </div>
            </div>
            
            <div className="glass-panel rounded-[2rem] md:rounded-[3rem] relative aspect-3/4 overflow-hidden p-2 md:p-3 shadow-xl">
               <div className="relative w-full h-full rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden">
                 {images[2]?.url ? (
                    <Image src={images[2].url} alt="Back view" fill className="object-cover" />
                 ) : (
                    <div className="w-full h-full bg-white/5 flex items-center justify-center"><span className="text-white/30 text-[10px] uppercase tracking-widest">No Image</span></div>
                 )}
               </div>
            </div>
            
            <div className="glass-panel rounded-[2rem] md:rounded-[3rem] p-10 xl:p-14 flex flex-col gap-6 justify-center shadow-xl">
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