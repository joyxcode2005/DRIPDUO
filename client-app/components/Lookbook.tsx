import Link from 'next/link';
import Image from 'next/image';
import Reveal from './Reveal';

interface LookbookProps {
    id: string;
    name: string;
    product_images: {
        url: string;
        is_primary: boolean;
    }[];
}

export default function Lookbook({ product }: { product: LookbookProps }) {
    if (!product.product_images?.length) return null;

    return (
        <>
            {product.product_images.map((img, i) => (
                <Reveal key={i} className="shrink-0" threshold={0.12}>
                    <div className="relative aspect-[2/3] w-[75vw] sm:w-[45vw] md:w-[30vw] lg:w-[22vw] border-r border-y border-(--gray-800) overflow-hidden bg-(--gray-900) first:border-l">
                        <Link
                            href={`/products/${product.id}`}
                            className="absolute inset-0 z-20"
                        />

                        <Image
                            src={img.url}
                            alt={`Look ${i + 1}`}
                            fill
                            className="object-cover transition-transform duration-[2s] hover:scale-105"
                        />
                    </div>
                </Reveal>
            ))}
        </>
    );
}