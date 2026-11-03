'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { addToWishlist, removeFromWishlist } from '@/services/wishlist';


interface WishlistButtonProps {
    productId: string;
    userId: string;
    initialIsWishlisted: boolean;
    onStatusChange?: (isWishlisted: boolean) => void;
}

export default function WishlistButton({
    productId,
    userId,
    initialIsWishlisted,
    onStatusChange,
}: WishlistButtonProps) {
    const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);
    const [isLoading, setIsLoading] = useState(false);

    // Keep state in sync if initial value changes from server/props
    useEffect(() => {
        setIsWishlisted(initialIsWishlisted);
    }, [initialIsWishlisted]);

    const handleToggle = async (e: React.MouseEvent) => {
        // Prevent the click from bubbling up if this button is inside a product card link
        e.preventDefault();
        e.stopPropagation();

        if (isLoading) return;

        // 1. Optimistic Update: Flip UI instantly
        const previousState = isWishlisted;
        setIsWishlisted(!previousState);
        setIsLoading(true);

        try {
            if (previousState) {
                await removeFromWishlist(productId, userId);
            } else {
                await addToWishlist(productId, userId);
            }

            if (onStatusChange) onStatusChange(!previousState);
        } catch (error) {
            // 2. Rollback on failure
            console.error(error);
            setIsWishlisted(previousState);
            // Optional: Trigger a toast notification here instead of an alert
            alert('Could not update wishlist. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isLoading}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className={`
        p-2 rounded-full transition-all duration-200 ease-in-out
        hover:bg-gray-100 active:scale-95 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
        >
            <Heart
                className={`w-5 h-5 transition-colors duration-200 ${isWishlisted ? 'text-black fill-black' : 'text-gray-400 fill-transparent'
                    }`}
            />
        </button>
    );
}