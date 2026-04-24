/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { useCart } from "@/lib/CartContext";
import { X, Minus, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";

export const CartDrawer = () => {
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart, cartTotal } = useCart();

  return (
    <>
      {/* Background Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-90 transition-opacity duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          isCartOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeCart}
      />

      {/* Cart Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-112.5 bg-[#050505] border-l border-white/5 z-100 flex flex-col transform transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <span className="text-sm font-light uppercase tracking-[0.2em]">Your Archive ({cart.length})</span>
          <button onClick={closeCart} className="text-zinc-500 hover:text-[#C5A059] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-600">
              <span className="text-xs uppercase tracking-widest mb-4">Your archive is empty</span>
              <button onClick={closeCart} className="text-[#C5A059] text-[10px] uppercase tracking-[0.2em] border-b border-[#C5A059] pb-1 hover:text-white transition-colors">
                Continue Exploring
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-6 group">
                <div className="w-24 h-32 bg-[#0a0a0a] overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-medium uppercase tracking-widest">{item.name}</h4>
                      <button onClick={() => removeFromCart(item.id)} className="text-zinc-600 hover:text-red-500 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {item.size && <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Size: {item.size}</span>}
                    <div className="text-[#C5A059] text-sm font-mono mt-2">${item.price}</div>
                  </div>
                  
                  {/* Minimal Quantity Selector */}
                  <div className="flex items-center gap-4 border border-white/10 w-fit px-3 py-1.5">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-zinc-400 hover:text-white"><Minus className="w-3 h-3" /></button>
                    <span className="text-xs font-mono">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-zinc-400 hover:text-white"><Plus className="w-3 h-3" /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-white/5 bg-[#0a0a0a]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">Subtotal</span>
              <span className="text-lg font-light tracking-widest">${cartTotal}</span>
            </div>
            <Link 
              href="/checkout" 
              onClick={closeCart}
              className="group flex items-center justify-between w-full bg-[#f8f8f8] text-[#050505] p-4 text-xs font-black uppercase tracking-[0.2em] hover:bg-[#C5A059] transition-colors duration-300"
            >
              <span>Secure Checkout</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
};