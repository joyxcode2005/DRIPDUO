"use client";

import Link from "next/link";
import Image from "next/image";
import { FeaturedProduct } from "@/app/page";

export default function HomeProductCard({ product }: { product: FeaturedProduct }) {
    return (
        <Link
            href={`/products/${product.id}`}
            // Added h-full and w-full here to ensure the link fills the grid cell
            className="group relative border-r border-b border-(--gray-800) overflow-hidden bg-(--gray-900) block cursor-pointer w-full h-full"
        >
            {/* 1. Removed aspectRatio: "2/3" and added h-full so it takes the grid's shape */}
            <div className="w-full h-full relative">

                {/* 2. Replaced width/height with `fill` and `sizes` */}
                <Image
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    src={product.product_images[0]?.url || "/images/placeholder.jpg"}
                    alt={product.name}
                    className="object-cover transition-opacity duration-700"
                />

                <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/70 to-transparent pointer-events-none" />
            </div>

            {/* Info Overlay */}
            <div className="absolute bottom-6 left-4 right-4 flex justify-between items-end z-10 pointer-events-none">
                <div className="max-w-[70%]">
                    <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-(--beige) leading-relaxed">
                        {product.name}
                    </p>
                </div>
            </div>
        </Link>
    );
}