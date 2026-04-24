import { Product } from "@/types"
import Image from "next/image"

// This is the product card componennt... 
const ProductCard = (product : Product) => {
    return (
        <div
            key={product.id}
            className="group cursor-pointer rounded-2xl border border-zinc-800 bg-zinc-950/60 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-[0_24px_70px_rgba(0,0,0,0.55)]"
        >
            {/* Product Image Box */}
            <div className="relative aspect-4/5 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition-colors duration-300 group-hover:border-[#e63946]">
                <Image
                    height={100}
                    width={100}
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover grayscale-[0.2] transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute left-3 top-3 flex max-w-[calc(100%-1.5rem)] flex-wrap gap-2">
                    <span className="rounded-full border border-white/10 bg-black/55 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-100 backdrop-blur-sm">
                        {product.type}
                    </span>
                    <span className="rounded-full border border-[#e63946]/30 bg-[#e63946]/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-[#ff8a93] backdrop-blur-sm">
                        {product.category}
                    </span>
                </div>
                {/* Hover Overlay Button */}
                <div className="absolute inset-x-0 bottom-0 flex translate-y-4 items-end justify-between gap-3 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="text-xs font-mono uppercase tracking-[0.28em] text-zinc-200/90">
                        Quick preview
                    </span>
                    <span className="border border-white/10 bg-white px-4 py-2 text-sm font-black uppercase tracking-widest text-black transition-colors hover:bg-[#e63946] hover:text-white">
                        Quick Add
                    </span>
                </div>
            </div>
            {/* Product Details */}
            <div className="mt-4 flex items-start justify-between gap-4 border-t border-zinc-800/80 pt-4">
                <div className="min-w-0 space-y-2">
                    <h3 className="line-clamp-2 text-lg font-black uppercase tracking-tight text-white transition-colors group-hover:text-[#e63946]">
                        {product.name}
                    </h3>
                    <p className="text-xs font-mono uppercase tracking-[0.24em] text-zinc-500">
                        {product.type} // {product.category}
                    </p>
                </div>
                <div className="shrink-0 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-right">
                    <span className="block text-[10px] font-mono uppercase tracking-[0.28em] text-zinc-500">
                        Price
                    </span>
                    <span className="block text-lg font-black leading-none text-white">
                        ${product.price}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default ProductCard