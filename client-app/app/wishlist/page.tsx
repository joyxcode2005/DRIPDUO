import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getSupabaseClient } from '@/lib/supabase';
import { fetchWishlist } from '@/services/wishlist';
import WishlistButton from '@/components/ui/WishlistButton';


export const revalidate = 0; // Ensure the page always reflects real-time updates

export default async function WishlistPage() {
    const supabase = getSupabaseClient();

    // 1. Authenticate user server-side
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/login?next=/wishlist');
    }

    // 2. Fetch the wishlist items
    const wishlistItems = await fetchWishlist(user.id);

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header Section */}
            <header className="border-b border-gray-100 pb-6 mb-10 flex justify-between items-baseline">
                <h1 className="text-2xl font-light tracking-widest uppercase text-black">
                    Your Wishlist
                </h1>
                <p className="text-sm font-light text-gray-500 tracking-wide">
                    {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'}
                </p>
            </header>

            {/* Empty State */}
            {wishlistItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <p className="text-gray-400 font-light tracking-wide mb-6">
                        Your wishlist is currently empty.
                    </p>
                    <Link
                        href="/shop"
                        className="border border-black bg-black text-white px-8 py-3 text-sm font-light uppercase tracking-widest hover:bg-transparent hover:text-black transition-colors duration-300"
                    >
                        Explore Collection
                    </Link>
                </div>
            ) : (
                /* Product Grid Layout */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                    {wishlistItems.map((item: any) => {
                        const product = item.products;
                        // Fallback if there are no images uploaded yet
                        const primaryImage = product.product_images?.[0]?.url || '/placeholder.jpg';

                        return (
                            <div key={item.id} className="group relative flex flex-col">
                                {/* Product Image Wrapper */}
                                <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50 mb-4">
                                    <Image
                                        src={primaryImage}
                                        alt={product.name}
                                        fill
                                        className="object-cover object-center transition-transform duration-500 group-hover:scale-102"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    />

                                    {/* Absolute Positioned Wishlist Toggle Button */}
                                    <div className="absolute top-3 right-3 z-10 bg-white/80 backdrop-blur-md rounded-full shadow-sm">
                                        <WishlistButton
                                            productId={product.id}
                                            userId={user.id}
                                            initialIsWishlisted={true}
                                        />
                                    </div>
                                </div>

                                {/* Product Metadata */}
                                <Link href={`/products/${product.id}`} className="flex flex-col flex-1">
                                    <h2 className="text-sm font-light tracking-wide text-gray-900 mb-1 group-hover:underline decoration-gray-300 underline-offset-4">
                                        {product.name}
                                    </h2>

                                    <div className="flex items-center gap-2 mt-auto">
                                        {product.discount > 0 ? (
                                            <>
                                                <span className="text-sm font-medium text-black">
                                                    ₹{product.final_price}
                                                </span>
                                                <span className="text-xs font-light text-gray-400 line-through">
                                                    ₹{product.price}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-sm font-medium text-black">
                                                ₹{product.price}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            )}
        </main>
    );
}