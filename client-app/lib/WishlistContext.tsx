"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { addToWishlist, removeFromWishlist } from "@/services/wishlist";

interface WishlistContextType {
    wishlist: string[];
    toggleWishlist: (productId: string, e?: React.MouseEvent) => Promise<void>;
    setInitialWishlist: (items: string[]) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ 
    children, 
    userId 
}: { 
    children: React.ReactNode; 
    userId?: string;
}) {
    const [wishlist, setWishlist] = useState<string[]>([]);
    const [isMutating, setIsMutating] = useState(false);

    // Call this if you fetch the user's saved wishlist from the DB on page load
    const setInitialWishlist = useCallback((items: string[]) => {
        setWishlist(items);
    }, []);

    const toggleWishlist = async (productId: string, e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (!userId) {
            alert("Please log in to save items to your wishlist.");
            return;
        }

        if (isMutating) return;
        setIsMutating(true);

        const isCurrentlyWishlisted = wishlist.includes(productId);

        // 1. Optimistic Update
        setWishlist((prev) =>
            isCurrentlyWishlisted
                ? prev.filter((id) => id !== productId)
                : [...prev, productId]
        );

        // 2. Database Sync
        try {
            if (isCurrentlyWishlisted) {
                await removeFromWishlist(productId, userId);
            } else {
                await addToWishlist(productId, userId);
            }
        } catch (error) {
            console.error("Wishlist sync error:", error);
            // 3. Rollback on failure
            setWishlist((prev) =>
                isCurrentlyWishlisted
                    ? [...prev, productId]
                    : prev.filter((id) => id !== productId)
            );
        } finally {
            setIsMutating(false);
        }
    };

    return (
        <WishlistContext.Provider value={{ wishlist, toggleWishlist, setInitialWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
}