import React from "react";
import { Bookmark, Plus, Check } from "lucide-react";
import { Badge } from "../ui/Badge";

export interface SupabaseCategory { id: string; name: string; slug: string; }
export interface SupabaseProductImage { id: string; url: string; is_primary?: boolean; }
export interface Product {
    id: string; name: string; description: string | null; product_type_id: string; product_type?: { name: string };
    price: number; discount: number; final_price: number; stock: number; total_stock: number;
    is_active: boolean; created_at: string; updated_at: string;
    product_categories: { categories: SupabaseCategory }[]; product_images: SupabaseProductImage[];
}

interface ProductCardProps {
    product: Product; onQuickAdd?: (e: React.MouseEvent) => void; onToggleWishlist?: (e: React.MouseEvent) => void;
    isWishlisted?: boolean; isAdded?: boolean;
}

export default function ProductCard({ 
    product, onQuickAdd, onToggleWishlist, isWishlisted = false, isAdded = false 
}: ProductCardProps) {
    const isSoldOut = product.total_stock <= 0;
    const imageUrl = product.product_images?.[0]?.url || "/placeholder-shirt.png";

    return (
        // Removed `p-1.5` so the image can span the full width of the card. 
        // Kept `overflow-hidden` so the image respects the rounded corners.
        <div className="group flex flex-col glass-panel glass-panel-hover rounded-3xl overflow-hidden transition-all duration-300 shadow-xl h-full">

            {/* Changed `aspect-square` to `aspect-[4/5]` to make the card taller and larger */}
            {/* Removed `rounded-3xl` and `mb-2` to remove the border effect */}
            <div className="relative aspect-[4/5] w-full flex items-center justify-center bg-black/20 overflow-hidden">

                {/* Adjusted positioning for badges and buttons since padding was removed */}
                <div className="absolute top-4 left-4 right-4 flex justify-between z-10 text-red-700">
                    {isSoldOut && <Badge variant="soldOut">Sold Out</Badge>}
                    <button 
                        onClick={onToggleWishlist}
                        className={`glass-button p-2.5 rounded-full transition-colors ml-auto shadow-md ${isWishlisted ? 'text-[#EE3C24] border-[#EE3C24]/30' : 'text-white/60 hover:text-white'}`}
                    >
                        <Bookmark size={18} strokeWidth={1.5} fill={isWishlisted ? "#EE3C24" : "none"} />
                    </button>
                </div>

                {/* Removed `p-6` so the image can hit the edges */}
                <div className="relative w-full h-full flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity">
                    <img
                        src={imageUrl}
                        alt={product.name}
                        // Added `w-full h-full object-cover` to make the image fill the entire space
                        className="object-cover w-full h-full drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]"
                    />
                </div>

                <button
                    disabled={isSoldOut}
                    onClick={onQuickAdd}
                    className={`absolute bottom-4 right-4 p-3 rounded-full transition-all shadow-md ${
                        isAdded 
                            ? "bg-[#ECE7D1] text-[#050505] shadow-[0_0_20px_rgba(236,231,209,0.5)]" 
                            : "glass-button text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    }`}
                >
                    {isAdded ? <Check size={18} strokeWidth={2} /> : <Plus size={18} strokeWidth={2} />}
                </button>
            </div>

            {/* Increased padding and text sizes to match the larger card footprint */}
            <div className="p-5 flex flex-col gap-2 mt-auto">
                <h3 className="text-[15px] text-[#ECE7D1] font-medium truncate tracking-wide">{product.name}</h3>
                <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-3">
                        <span className="text-[16px] text-white/90 font-semibold">
                            Rs. {product.final_price.toLocaleString()}
                        </span>
                        {product.discount > 0 && (
                            <span className="text-[13px] text-white/40 line-through">
                                {product.price.toLocaleString()}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}