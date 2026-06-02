import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/types/product";



interface ProductGridProps {
    products: Product[];
    onClearFilters: () => void;
}

export default function ProductGrid({ products, onClearFilters }: ProductGridProps) {
    if (products.length === 0) {
        return (
            <div className="text-center py-32 flex flex-col items-center">
                <p className="text-zinc-500 text-xs tracking-widest uppercase mb-4">
                    No items found
                </p>
                <button
                    onClick={onClearFilters}
                    className="text-white border-b border-white pb-1 text-xs tracking-widest uppercase hover:opacity-70 transition-opacity"
                >
                    Clear Filters
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`}>
                    <ProductCard product={product} />
                </Link>
            ))}
        </div>
    );
}