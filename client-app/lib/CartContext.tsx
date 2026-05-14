"use client";

import React, { createContext, useContext, useMemo, useState, useEffect } from "react";

export type CartItem = {
  id: string; // Used for local React mapping (format: variantId)
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

// Generic storage key instead of 'guest_cart'
const CART_STORAGE_KEY = "shopping_cart";

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // --- 1. INITIALIZATION (Read from Local Storage on mount) ---
  useEffect(() => {
    const localCart = localStorage.getItem(CART_STORAGE_KEY);
    if (localCart) {
      try {
        setCart(JSON.parse(localCart));
      } catch (error) {
        console.error("Failed to parse cart from local storage", error);
      }
    }
    setIsInitialized(true);
  }, []);

  // --- 2. LOCAL STORAGE SYNC (Always write to local storage when cart changes) ---
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  // --- 3. CORE ACTIONS ---

  const addToCart = async (product: Omit<CartItem, "id">) => {
    const incomingItem = { ...product, id: product.variantId };

    setCart((prev) => {
      const existing = prev.find((item) => item.variantId === incomingItem.variantId);

      if (existing) {
        const newQuantity = existing.quantity + incomingItem.quantity;

        // Prevent ordering more than is in stock
        if (newQuantity > existing.stock) {
          alert(`You cannot add more than ${existing.stock} of this item.`);
          return prev;
        }

        return prev.map((item) =>
          item.variantId === incomingItem.variantId
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
      return [...prev, incomingItem as CartItem];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = async (variantId: string) => {
    setCart((prev) => prev.filter((item) => item.variantId !== variantId));
  };

  const updateQuantity = async (variantId: string, quantity: number) => {
    if (quantity < 1) return removeFromCart(variantId);

    const itemToUpdate = cart.find(item => item.variantId === variantId);
    if (itemToUpdate && quantity > itemToUpdate.stock) {
      alert(`Only ${itemToUpdate.stock} left in stock.`);
      return;
    }

    setCart((prev) =>
      prev.map((item) => (item.variantId === variantId ? { ...item, quantity } : item))
    );
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