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
        <div className="group flex flex-col glass-panel glass-panel-hover rounded-[2rem] overflow-hidden transition-all duration-300 shadow-xl p-1.5 h-full">

            <div className="relative aspect-square flex items-center justify-center bg-black/20 rounded-[1.5rem] overflow-hidden mb-2">

                <div className="absolute top-4 left-4 w-full flex justify-between pr-8 z-10 text-red-700">
                    {isSoldOut && <Badge variant="soldOut">Sold Out</Badge>}
                    <button 
                        onClick={onToggleWishlist}
                        className={`glass-button p-2.5 rounded-full transition-colors ml-auto shadow-md ${isWishlisted ? 'text-[#EE3C24] border-[#EE3C24]/30' : 'text-white/60 hover:text-white'}`}
                    >
                        <Bookmark size={18} strokeWidth={1.5} fill={isWishlisted ? "#EE3C24" : "none"} />
                    </button>
                </div>

                <div className="relative w-full h-full p-6 flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity">
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="object-contain max-h-full drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]"
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

            <div className="p-4 px-5 flex flex-col gap-1.5 mt-auto">
                <h3 className="text-[13px] text-[#ECE7D1] font-medium truncate tracking-wide">{product.name}</h3>
                <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-3">
                        <span className="text-[14px] text-white/90 font-semibold">
                            Rs. {product.final_price.toLocaleString()}
                        </span>
                        {product.discount > 0 && (
                            <span className="text-[11px] text-white/40 line-through">
                                {product.price.toLocaleString()}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}