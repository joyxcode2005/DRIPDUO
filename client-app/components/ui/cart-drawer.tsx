"use client";

import React from "react";
import Link from "next/link";
import { X, Plus, Minus } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import Image from "next/image";

export default function CartDrawer() {
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart, cartTotal } = useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 z-[200] backdrop-blur-sm transition-opacity duration-500 ${isCartOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-[100dvh] w-full sm:max-w-[440px] bg-black/50 backdrop-blur-3xl sm:border-l border-white/10 z-[210] transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col shadow-2xl ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-6 border-b border-white/10 bg-white/5">
          <span className="font-sans text-[11px] uppercase tracking-[0.2em] font-bold text-[#ECE7D1]">
            YOUR BAG ({cart.reduce((s, i) => s + Number(i.quantity), 0)})
          </span>
          <button type="button" onClick={closeCart} className="glass-button text-white/70 hover:text-white p-2 rounded-full transition-colors">
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6 no-scroll">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-white/40 mb-6">Your bag is empty.</p>
              <button onClick={closeCart} className="glass-button px-6 py-3 rounded-full font-sans text-[10px] tracking-[0.2em] uppercase text-white hover:bg-white hover:text-black transition-colors shadow-lg">
                Discover Collection
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-5 group">
                <div className="w-24 glass-panel rounded-2xl overflow-hidden shrink-0 p-1.5 shadow-md" style={{ aspectRatio: "3/4" }}>
                  <div className="w-full h-full relative rounded-xl overflow-hidden">
                    <Image fill src={item.image} alt={item.name} className="object-cover" />
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <Link href={`/products/${item.productId ?? item.id}`} onClick={closeCart} className="font-sans text-[12px] tracking-widest uppercase text-white/90 hover:text-white transition-colors line-clamp-2 leading-relaxed">
                        {item.name}
                      </Link>
                      <button type="button" onClick={() => removeFromCart(item.id)} className="text-white/40 hover:text-[#EE3C24] transition-colors shrink-0 p-1">
                        <X size={14} strokeWidth={2} />
                      </button>
                    </div>
                    {item.size && (
                      <p className="font-sans text-[9px] tracking-[0.15em] uppercase text-white/50 mt-2">
                        Size: {item.size} {item.gsm ? `| ${item.gsm} GSM` : ""}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-3 text-white/80 glass-panel rounded-full px-2 py-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, Number(item.quantity) - 1)}
                        className="hover:text-white p-1.5 transition-colors disabled:opacity-30"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={12} strokeWidth={2} />
                      </button>
                      <span className="font-sans text-[11px] w-4 text-center font-bold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, Number(item.quantity) + 1)}
                        className="hover:text-white p-1.5 transition-colors"
                      >
                        <Plus size={12} strokeWidth={2} />
                      </button>
                    </div>
                    <span className="font-sans text-[12px] tracking-[0.1em] text-white font-bold">
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
          <div className="border-t border-white/10 p-6 sm:p-8 bg-black/40 backdrop-blur-xl">
            <div className="flex justify-between items-center mb-3">
              <span className="font-sans text-[11px] uppercase tracking-[0.15em] text-white/70">Subtotal</span>
              <span className="font-sans text-[14px] tracking-[0.1em] text-white font-bold">₹{Number(cartTotal).toFixed(2)}</span>
            </div>
            <p className="font-sans text-[9px] tracking-[0.1em] text-white/40 mb-6 uppercase">
              Shipping & taxes calculated at checkout
            </p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full bg-white text-black text-center py-4 rounded-full font-sans text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-white/80 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Secure Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}