"use client";

import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from "react";
import { getSupabaseClient } from "./supabase";
// Assuming you have a standard Supabase browser client setup

export type CartItem = {
  id: string; // Used for local React mapping (format: variantId or db-uuid)
  productId: string;
  variantId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
  gsm?: string;
  size?: string;
};

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  isInitialized: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: Omit<CartItem, "id">) => Promise<void>;
  removeFromCart: (variantId: string) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const supabase = getSupabaseClient();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // --- 1. AUTHENTICATION & INITIALIZATION ---
  useEffect(() => {
    const initializeCart = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user?.id || null;
      setUserId(user);

      if (user) {
        // Logged In: Fetch from Supabase
        await fetchSupabaseCart(user);
      } else {
        // Guest: Fetch from Local Storage
        const localCart = localStorage.getItem("guest_cart");
        if (localCart) setCart(JSON.parse(localCart));
      }
      setIsInitialized(true);
    };

    initializeCart();

    // Listen for login/logout events to merge or clear carts
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: string, session: { user: { id: string }; } | null) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUserId(session.user.id);
        await handleGuestToUserMerge(session.user.id);
      } else if (event === "SIGNED_OUT") {
        setUserId(null);
        setCart([]); // Clear cart on logout
        localStorage.removeItem("guest_cart");
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // --- 2. LOCAL STORAGE SYNC (GUESTS ONLY) ---
  useEffect(() => {
    if (isInitialized && !userId) {
      localStorage.setItem("guest_cart", JSON.stringify(cart));
    }
  }, [cart, isInitialized, userId]);

  // --- 3. DATABASE HELPER FUNCTIONS ---
  const fetchSupabaseCart = async (uid: string) => {
    // You would write a join query here to get cart_items + product details
    // Example: select('*, products(*), product_variants(*)')
    // For now, we assume you map the DB result back to the CartItem[] type
  };

  const handleGuestToUserMerge = async (uid: string) => {
    const localCartStr = localStorage.getItem("guest_cart");
    if (!localCartStr) return fetchSupabaseCart(uid); // Nothing to merge

    const localCart: CartItem[] = JSON.parse(localCartStr);

    // Logic here: 
    // 1. Get or create `cart` row for `user_id`
    // 2. Loop through `localCart` and insert/upsert into `cart_items`
    // 3. Clear local storage

    localStorage.removeItem("guest_cart");
    await fetchSupabaseCart(uid); // Fetch the freshly merged cart
  };

  // --- 4. CORE ACTIONS (OPTIMISTIC UI) ---

  const addToCart = async (product: Omit<CartItem, "id">) => {
    const incomingItem = { ...product, id: product.variantId }; // Use variantId as primary local key

    // OPTIMISTIC UPDATE: Update UI instantly
    setCart((prev) => {
      const existing = prev.find((item) => item.variantId === incomingItem.variantId);
      if (existing) {
        const newQuantity = existing.quantity + incomingItem.quantity;

        if (newQuantity > existing.stock) {
          alert(`You cannot add more than ${existing.stock} of this item.`);
          return prev; // Cancel the state update
        }
        
        return prev.map((item) =>
          item.variantId === incomingItem.variantId
            ? { ...item, quantity: item.quantity + incomingItem.quantity }
            : item
        );
      }
      return [...prev, incomingItem as CartItem];
    });

    setIsCartOpen(true);

    // BACKGROUND SYNC: If user is logged in, push to Supabase
    if (userId) {
      try {
        // 1. Get user's cart ID
        // 2. Upsert into public.cart_items (match by cart_id and variant_id)
      } catch (error) {
        console.error("Failed to sync add to cart with DB", error);
        // In a perfect app, you'd roll back the React state here if the DB fails
      }
    }
  };

  const removeFromCart = async (variantId: string) => {
    // OPTIMISTIC UPDATE
    setCart((prev) => prev.filter((item) => item.variantId !== variantId));

    if (userId) {
      try {
        // Delete from public.cart_items where variant_id = variantId
      } catch (error) {
        console.error("Failed to delete from DB", error);
      }
    }
  };

  const updateQuantity = async (variantId: string, quantity: number) => {
    if (quantity < 1) return removeFromCart(variantId);

    const itemToUpdate = cart.find(item => item.variantId === variantId);
    if (itemToUpdate && quantity > itemToUpdate.stock) {
      alert(`Only ${itemToUpdate.stock} left in stock.`);
      return;
    }

    // OPTIMISTIC UPDATE
    setCart((prev) =>
      prev.map((item) => (item.variantId === variantId ? { ...item, quantity } : item))
    );

    if (userId) {
      try {
        // Update public.cart_items set quantity = quantity where variant_id = variantId
      } catch (error) {
        console.error("Failed to update quantity in DB", error);
      }
    }
  };

  const cartTotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart]
  );

  return (
    <CartContext.Provider value={{
      cart,
      isCartOpen,
      isInitialized,
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false),
      addToCart,
      removeFromCart,
      updateQuantity,
      cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};