"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  id: number | string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
};

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number | string) => void;
  updateQuantity: (id: number | string, quantity: number) => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children, userId }: { children: React.ReactNode, userId?: string }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartId, setCartId] = useState<string | null>(null); // Track the DB cart_id

  // 1. Fetch initial cart on load if user is logged in
  useEffect(() => {
    if (userId) {
      fetchUserCart(userId).then((dbCart) => {
        if (dbCart) {
          setCartId(dbCart.id); // From public.cart
          setCart(dbCart.items); // From public.cart_items
        }
      });
    }
  }, [userId]);

  const cartTotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart]
  );

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // 2. Optimistic Add to Cart
  const addToCart = async (product: CartItem) => {
    // A. Update local state immediately for fast UX
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    openCart();

    // B. Sync with Database in the background
    if (userId && cartId) {
      try {
        await addCartItemToDB({
          cart_id: cartId,
          product_id: product.id,
          quantity: 1, // Add 1 to whatever the DB currently has
        });
      } catch (error) {
        console.error("Failed to sync cart with DB", error);
        // Optional: Revert local state here if DB fails
      }
    }
  };

  // 3. Optimistic Remove
  const removeFromCart = async (id: number | string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));

    if (cartId) {
      await removeCartItemFromDB(cartId, id);
    }
  };

  // 4. Optimistic Update Quantity
  const updateQuantity = async (id: number | string, quantity: number) => {
    if (quantity < 1) return removeFromCart(id);

    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );

    if (cartId) {
      await updateCartItemInDB(cartId, id, quantity);
    }
  };

  return (
    <CartContext.Provider value={{ cart, isCartOpen, openCart, closeCart, addToCart, removeFromCart, updateQuantity, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};