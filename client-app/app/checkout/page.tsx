"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, CheckCircle2, ShieldCheck, CreditCard } from "lucide-react";
import { useCart } from "@/lib/CartContext";

export default function CheckoutPage() {
  const { cart, cartTotal } = useCart();
  const [activeStep, setActiveStep] = useState<"shipping" | "payment" | "success">("shipping");

  // Calculate totals
  const shippingCost = cartTotal > 200 ? 0 : 15;
  const taxes = cartTotal * 0.08; // 8% mock tax
  const finalTotal = cartTotal + shippingCost + taxes;

  if (cart.length === 0 && activeStep !== "success") {
    return (
      <div className="min-h-screen bg-[#050505] text-[#f8f8f8] flex flex-col items-center justify-center pt-20">
        <h1 className="text-3xl font-light uppercase tracking-[0.2em] mb-4">Archive Empty</h1>
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mb-8">Add pieces to your archive to checkout.</p>
        <Link href="/products" className="text-[#C5A059] border-b border-[#C5A059] pb-1 text-xs uppercase tracking-[0.2em] hover:text-white transition-colors">
          Return to Collection
        </Link>
      </div>
    );
  }

  if (activeStep === "success") {
    return (
      <div className="min-h-screen bg-[#050505] text-[#f8f8f8] flex flex-col items-center justify-center pt-20 px-4 text-center">
        <div className="w-16 h-16 rounded-full border border-[#C5A059] flex items-center justify-center mb-8 bg-[#C5A059]/10">
          <CheckCircle2 className="w-8 h-8 text-[#C5A059]" />
        </div>
        <h1 className="text-4xl md:text-5xl font-light uppercase tracking-[0.1em] mb-4">Order Confirmed</h1>
        <p className="text-zinc-400 text-sm max-w-md leading-relaxed font-light mb-8">
          Thank you for your acquisition. Your archive pieces are being prepared with absolute precision. Order confirmation has been sent to your email.
        </p>
        <div className="p-6 bg-[#0a0a0a] border border-white/5 inline-block text-left mb-10">
          <span className="text-zinc-500 text-[10px] uppercase tracking-widest block mb-2">Order Reference</span>
          <span className="text-xl font-mono text-white">#D2-FW26-{Math.floor(Math.random() * 90000) + 10000}</span>
        </div>
        <Link href="/products" className="bg-[#f8f8f8] text-[#050505] px-10 py-4 text-xs font-black uppercase tracking-[0.2em] hover:bg-[#C5A059] transition-colors">
          Continue Exploring
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#f8f8f8] pt-24 pb-24 selection:bg-[#C5A059] selection:text-black">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-8 mb-12">
          <Link href="/products" className="text-zinc-500 hover:text-white flex items-center gap-2 text-xs uppercase tracking-[0.2em] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <div className="flex items-center gap-2 text-[#C5A059]">
            <Lock className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Secure Checkout</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Left Column: Form Steps */}
          <div className="flex-1 space-y-12">
            
            {/* Step 1: Shipping */}
            <section className={activeStep === "payment" ? "opacity-50 pointer-events-none" : ""}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-light uppercase tracking-[0.1em]">1. Shipping Destination</h2>
                {activeStep === "payment" && <CheckCircle2 className="w-5 h-5 text-[#C5A059]" />}
              </div>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest">First Name</label>
                    <input type="text" className="bg-[#0a0a0a] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C5A059] transition-colors" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest">Last Name</label>
                    <input type="text" className="bg-[#0a0a0a] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C5A059] transition-colors" />
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest">Address Line 1</label>
                  <input type="text" className="bg-[#0a0a0a] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C5A059] transition-colors" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest">City</label>
                    <input type="text" className="bg-[#0a0a0a] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C5A059] transition-colors" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest">Postal Code</label>
                    <input type="text" className="bg-[#0a0a0a] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C5A059] transition-colors" />
                  </div>
                </div>

                {activeStep === "shipping" && (
                  <button 
                    type="button" 
                    onClick={() => setActiveStep("payment")}
                    className="w-full mt-8 bg-[#f8f8f8] text-[#050505] p-5 text-sm font-black uppercase tracking-[0.2em] hover:bg-[#C5A059] transition-colors duration-300"
                  >
                    Proceed to Payment
                  </button>
                )}
              </form>
            </section>

            {/* Step 2: Payment */}
            <section className={activeStep === "shipping" ? "opacity-30 pointer-events-none" : "animate-in fade-in duration-700"}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-light uppercase tracking-[0.1em]">2. Payment Method</h2>
              </div>

              <div className="bg-[#0a0a0a] border border-[#C5A059] p-6 mb-8 relative">
                <div className="absolute top-6 right-6 text-[#C5A059]">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest">Card Number</label>
                    <input type="text" placeholder="0000 0000 0000 0000" className="bg-transparent border-b border-white/20 py-2 text-xl font-mono text-white focus:outline-none focus:border-[#C5A059] transition-colors placeholder:text-zinc-700" />
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] text-zinc-500 uppercase tracking-widest">Expiry</label>
                      <input type="text" placeholder="MM/YY" className="bg-transparent border-b border-white/20 py-2 text-lg font-mono text-white focus:outline-none focus:border-[#C5A059] transition-colors placeholder:text-zinc-700" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] text-zinc-500 uppercase tracking-widest">CVC</label>
                      <input type="text" placeholder="123" className="bg-transparent border-b border-white/20 py-2 text-lg font-mono text-white focus:outline-none focus:border-[#C5A059] transition-colors placeholder:text-zinc-700" />
                    </div>
                  </div>
                </div>
              </div>

              {activeStep === "payment" && (
                <div className="flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setActiveStep("shipping")}
                    className="flex-shrink-0 bg-transparent border border-white/10 text-white p-5 text-sm font-medium uppercase tracking-[0.2em] hover:border-white transition-colors duration-300"
                  >
                    Back
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setActiveStep("success")}
                    className="flex-1 bg-[#C5A059] text-[#050505] p-5 text-sm font-black uppercase tracking-[0.2em] hover:bg-white transition-colors duration-300 flex justify-center items-center gap-3"
                  >
                    <ShieldCheck className="w-5 h-5" /> Pay ${finalTotal.toFixed(2)}
                  </button>
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Order Summary */}
          <aside className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-[#0a0a0a] border border-white/5 p-8 sticky top-24">
              <h3 className="text-sm font-medium uppercase tracking-[0.2em] mb-8 border-b border-white/5 pb-4">Order Summary</h3>
              
              <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto scrollbar-hide pr-2">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-20 object-cover grayscale-[0.2]" />
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h4 className="text-[11px] font-medium uppercase tracking-widest text-white leading-tight">{item.name}</h4>
                        <span className="text-[9px] text-zinc-500 uppercase tracking-widest block mt-1">Size: {item.size} | Qty: {item.quantity}</span>
                      </div>
                      <span className="text-xs font-mono text-[#C5A059]">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 border-t border-white/5 pt-6 text-[11px] font-mono uppercase tracking-widest text-zinc-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-white">{shippingCost === 0 ? "Complimentary" : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (Estimated)</span>
                  <span className="text-white">${taxes.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-white/10 mt-6 pt-6">
                <span className="text-xs font-medium uppercase tracking-[0.2em] text-white">Total</span>
                <span className="text-xl font-light tracking-wider text-[#C5A059]">${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}