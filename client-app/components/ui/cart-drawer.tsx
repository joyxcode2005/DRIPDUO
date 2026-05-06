"use client";

import React from "react";
import Link from "next/link";
import { X, Plus, Minus } from "lucide-react";
import { useCart } from "@/lib/CartContext";

export default function CartDrawer() {
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart, cartTotal } = useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/80 z-[110] backdrop-blur-sm transition-opacity duration-300 ${isCartOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-[420px] bg-(--black) border-l border-(--gray-800) z-[120] transform transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-(--gray-800)">
          <span className="font-sans text-[11px] uppercase tracking-[0.2em] font-semibold text-(--beige)">
            YOUR BAG ({cart.reduce((s, i) => s + Number(i.quantity), 0)})
          </span>
          <button type="button" onClick={closeCart} className="text-(--beige) hover:text-(--orange) transition-colors">
            <X size={20} strokeWidth={1} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 no-scroll">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-(--gray-400) mb-6">Your bag is empty.</p>
              <button onClick={closeCart} className="font-sans text-[10px] tracking-[0.2em] uppercase border-b border-(--beige) text-(--beige) pb-1 hover:text-(--orange) hover:border-(--orange) transition-colors">
                Discover Collection
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-6">
                <div className="w-24 bg-(--gray-900) shrink-0" style={{ aspectRatio: "2/3" }}>
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <Link href={`/products/${item.productId ?? item.id}`} onClick={closeCart} className="font-sans text-[11px] tracking-widest uppercase text-(--beige) hover:text-(--orange) transition-colors">
                        {item.name}
                      </Link>
                      <button type="button" onClick={() => removeFromCart(item.id)} className="text-(--gray-600) hover:text-(--orange) transition-colors">
                        <X size={14} strokeWidth={1} />
                      </button>
                    </div>
                    {item.size && (
                      <p className="font-sans text-[9px] tracking-[0.15em] uppercase text-(--gray-400) mt-2">
                        Size: {item.size} {item.gsm ? `| ${item.gsm} GSM` : ""}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-4 border-t border-(--gray-800) pt-4">
                    <div className="flex items-center gap-4 text-(--beige)">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, Number(item.quantity) - 1)}
                        className="hover:text-(--orange)"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={12} strokeWidth={1} />
                      </button>
                      <span className="font-sans text-[11px] w-4 text-center">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, Number(item.quantity) + 1)}
                        className="hover:text-(--orange)"
                      >
                        <Plus size={12} strokeWidth={1} />
                      </button>
                    </div>
                    <span className="font-sans text-[11px] tracking-[0.1em] text-(--orange)">
                      ₹{(Number(item.price) * Number(item.quantity)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout */}
        {cart.length > 0 && (
          <div className="border-t border-(--gray-800) px-8 py-8 bg-(--black)">
            <div className="flex justify-between items-center mb-3 text-(--beige)">
              <span className="font-sans text-[11px] uppercase tracking-[0.15em]">Subtotal</span>
              <span className="font-sans text-[11px] tracking-[0.1em] text-(--orange)">₹{Number(cartTotal).toFixed(2)}</span>
            </div>
            <p className="font-sans text-[9px] tracking-[0.1em] text-(--gray-400) mb-8 uppercase">
              Shipping & taxes calculated at checkout
            </p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full bg-(--beige) text-(--black) text-center py-5 font-sans text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-(--orange) transition-colors"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}