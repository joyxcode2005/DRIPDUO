"use client";

import React, { createContext, useContext, useState } from "react";
import { CartItem } from "./CartContext";

interface QuickViewContextType {
  selectedProduct: CartItem | null;
  isQuickViewOpen: boolean;
  openQuickView: (product: CartItem) => void;
  closeQuickView: () => void;
}

const QuickViewContext = createContext<QuickViewContextType | undefined>(undefined);

export const QuickViewProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedProduct, setSelectedProduct] = useState<CartItem | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const openQuickView = (product: CartItem) => {
    setSelectedProduct({ ...product, quantity: 1 });
    setIsQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
    // Slight delay to allow animation to finish before clearing data
    setTimeout(() => setSelectedProduct(null), 700);
  };

  return (
    <QuickViewContext.Provider value={{ selectedProduct, isQuickViewOpen, openQuickView, closeQuickView }}>
      {children}
    </QuickViewContext.Provider>
  );
};

export const useQuickView = () => {
  const context = useContext(QuickViewContext);
  if (!context) throw new Error("useQuickView must be used within a QuickViewProvider");
  return context;
};