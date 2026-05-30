import React from "react";
import { Bookmark, Plus } from "lucide-react";
import { Badge } from "../ui/Badge";

// Sub-types based on your provided interface
export interface SupabaseCategory {
    id: string;
    name: string;
    slug: string;
}

export interface SupabaseProductImage {
    id: string;
    url: string;
    is_primary?: boolean;
}

export interface Product {
    id: string;
    name: string;
    description: string | null;
    product_type_id: string;
    product_type?: { name: string };
    price: number;
    discount: number;
    final_price: number;
    stock: number;
    total_stock: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    product_categories: { categories: SupabaseCategory }[];
    product_images: SupabaseProductImage[];
}

export default function ProductCard({ product }: { product: Product }) {
    // Real logic for "Sold Out" based on your interface
    const isSoldOut = product.total_stock <= 0;

    // Safely extract the image. 
    // Adjust 'image_url' to whatever the exact property name is in your SupabaseProductImage interface.
    const imageUrl = product.product_images?.[0]?.url || "/placeholder-shirt.png";

    return (
        <div className="group flex flex-col border border-zinc-800 rounded-xl overflow-hidden bg-[#0a0a0a] hover:border-zinc-600 transition-colors">

            {/* Image Area */}
            <div className="relative aspect-square flex items-center justify-center bg-[#0f0f0f] border-b border-zinc-800">

                {/* Top Badges & Icons */}
                <div className="absolute top-4 left-4 w-full flex justify-between pr-8 z-10 text-red-700">
                    {isSoldOut && <Badge variant="soldOut">Sold Out</Badge>}
                    <button className="text-zinc-500 hover:text-white transition-colors ml-auto">
                        <Bookmark size={20} strokeWidth={1.5} />
                    </button>
                </div>

                {/* Product Image */}
                <div className="relative w-full h-full flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="object-contain max-h-full"
                    />
                    {/* Fallback watermark behind the image if you want to keep that design flair */}
                    <span className="absolute text-zinc-800 font-bold tracking-widest text-lg z-[-1] select-none">
                        DRIPDUO
                    </span>
                </div>

                {/* Add Button */}
                <button
                    disabled={isSoldOut}
                    className="absolute bottom-4 right-4 p-1.5 border border-zinc-600 rounded-full text-zinc-400 hover:text-white hover:border-white transition-all bg-[#0a0a0a] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus size={18} strokeWidth={2} />
                </button>
            </div>

            {/* Details Area */}
            <div className="p-4 flex flex-col gap-1">
                <h3 className="text-sm text-zinc-200 truncate">{product.name}</h3>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {/* Format the numeric final_price with commas */}
                        <span className="text-sm text-zinc-400">
                            Rs. {product.final_price.toLocaleString()}
                        </span>
                        {/* Optional: Show original price if there's a discount */}
                        {product.discount > 0 && (
                            <span className="text-xs text-zinc-600 line-through">
                                {product.price.toLocaleString()}
                            </span>
                        )}
                    </div>

                    {/* Mock Color Swatches (if you add color data later, you can map it here) */}
                    <div className="flex gap-1">
                        <div className="w-2.5 h-2.5 rounded-full border border-zinc-500 bg-zinc-800" />
                        <div className="w-2.5 h-2.5 rounded-full border border-zinc-500 bg-zinc-400" />
                        <div className="w-2.5 h-2.5 rounded-full border border-zinc-500 bg-transparent" />
                    </div>
                </div>
            </div>
        </div>
    );
}