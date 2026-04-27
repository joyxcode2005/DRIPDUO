"use client";

import React from "react";
import Link from "next/link";
import { X, Plus, Minus } from "lucide-react";
import { useCart } from "@/lib/CartContext";

export const CartDrawer = () => {
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart, cartTotal } = useCart();

  return (
    <>
      <div className={`cart-backdrop ${isCartOpen ? "open" : ""}`} onClick={closeCart} />
      <div className={`cart-drawer ${isCartOpen ? "open" : ""}`} style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
        
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--gray-800)]">
          <span className="label text-[var(--beige)]" style={{ fontSize: "11px", letterSpacing: "0.15em" }}>
            YOUR BAG ({cart.reduce((s, i) => s + i.quantity, 0)})
          </span>
          <button onClick={closeCart} className="text-[var(--beige)] hover:text-[var(--orange)] transition-colors">
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 no-scroll">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <p className="label text-[var(--gray-200)] mb-6" style={{ fontSize: "11px" }}>Your bag is empty</p>
              <button onClick={closeCart} className="label text-[var(--orange)] underline hover:opacity-75 transition-opacity" style={{ fontSize: "11px" }}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4">
                  <div className="w-24 flex-shrink-0 bg-[var(--gray-900)] border border-[var(--gray-800)]" style={{ aspectRatio: "3/4" }}>
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1 text-[var(--beige)]">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="label" style={{ fontSize: "11px", lineHeight: 1.4 }}>{item.name}</p>
                          {item.size && <p className="label text-[var(--gray-200)] mt-1" style={{ fontSize: "10px" }}>Size: {item.size}</p>}
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="hover:text-[var(--orange)] ml-2 flex-shrink-0 transition-colors">
                          <X size={14} strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3 border border-[var(--gray-600)]">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-2 hover:bg-[var(--gray-800)] transition-colors">
                          <Minus size={12} strokeWidth={1.5} />
                        </button>
                        <span className="label" style={{ fontSize: "11px", minWidth: "16px", textAlign: "center" }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-2 hover:bg-[var(--gray-800)] transition-colors">
                          <Plus size={12} strokeWidth={1.5} />
                        </button>
                      </div>
                      <span className="label text-[var(--orange)]" style={{ fontSize: "11px" }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-[var(--gray-800)] px-6 py-6 bg-[var(--black)]">
            <div className="flex justify-between items-center mb-2 text-[var(--beige)]">
              <span className="label" style={{ fontSize: "11px" }}>Subtotal</span>
              <span className="label text-[var(--orange)]" style={{ fontSize: "11px" }}>${cartTotal.toFixed(2)}</span>
            </div>
            <p className="label text-[var(--gray-400)] mb-6" style={{ fontSize: "9px", letterSpacing: "0.08em" }}>
              Shipping & taxes calculated at checkout
            </p>
            <Link href="/checkout" onClick={closeCart} className="block w-full bg-[var(--orange)] text-black text-center font-bold py-4 hover:bg-[var(--beige)] transition-colors" style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase" }}>
              Checkout
            </Link>
            <button onClick={closeCart} className="block w-full text-center label mt-3 text-[var(--gray-200)] hover:text-[var(--beige)] transition-colors" style={{ fontSize: "10px" }}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};