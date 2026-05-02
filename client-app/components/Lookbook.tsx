import Link from 'next/link';
import Reveal from './Reveal';

export default function Lookbook({ product }: { product: any }) {

    console.log("Rendering Lookbook for product:", product);
    if (!product.product_images || product.product_images.length === 0) return null;
    return (
        <>
            {[...product.product_images].map((img: any, i: number) => (
                <Reveal key={i} className="shrink-0" threshold={0.12}>
                    <div className="relative aspect-2/3 w-[75vw] sm:w-[45vw] md:w-[30vw] lg:w-[22vw] border-r border-y border-(--gray-800) overflow-hidden bg-(--gray-900) first:border-l">
                    <Link href={`/products/${product.id}`} className="absolute inset-0 z-20" />
                        <img
                            src={img.url}
                            alt={`Look ${(i % product.product_images.length) + 1}`}
                            className="h-full w-full object-cover transition-transform duration-[2s] hover:scale-105"
                        />
                    </div>
                </Reveal>
            ))}
        </>
    );
}