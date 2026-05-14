"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, CheckCircle2, ShieldCheck, CreditCard } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import Image from "next/image";

export default function CheckoutPage() {
  const { cart, cartTotal } = useCart();
  const [activeStep, setActiveStep] = useState<"shipping" | "payment" | "success">("shipping");
  const [orderId, setOrderId] = useState<string>("D2-FW26-PENDING");

  // useEffect(() => {
  //   setOrderId(`D2-FW26-${Math.floor(Math.random() * 90000) + 10000}`);
  // }, []);

  const shippingCost = cartTotal > 200 ? 0 : 15;
  const taxes = cartTotal * 0.08;
  const finalTotal = cartTotal + shippingCost + taxes;

  if (cart.length === 0 && activeStep !== "success") {
    return (
      <div className="min-h-screen bg-(--black) text-(--beige) flex flex-col items-center justify-center pt-20 font-sans">
        <h1 className="font-serif text-4xl font-light mb-6 text-(--beige)">Archive Empty</h1>
        <p className="label text-[var(--gray-400)] mb-10" style={{ fontSize: "10px", letterSpacing: "0.15em" }}>
          Add pieces to your archive to checkout.
        </p>
        <Link href="/products" className="label border-b border-[var(--orange)] text-[var(--orange)] pb-1 hover:text-[var(--beige)] hover:border-[var(--beige)] transition-colors" style={{ fontSize: "11px", letterSpacing: "0.15em" }}>
          Return to Collection
        </Link>
      </div>
    );
  }

  if (activeStep === "success") {
    return (
      <div className="min-h-screen bg-[var(--black)] text-[var(--beige)] flex flex-col items-center justify-center pt-20 px-6 text-center font-sans">
        <div className="w-20 h-20 rounded-full border border-[var(--orange)] flex items-center justify-center mb-8 bg-[var(--orange)]/10">
          <CheckCircle2 className="w-10 h-10 text-[var(--orange)]" />
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-light mb-6 text-[var(--beige)]">Order Confirmed</h1>
        <p className="label text-[var(--gray-200)] max-w-md leading-relaxed mb-10" style={{ fontSize: "11px", textTransform: "none", letterSpacing: "0.08em" }}>
          Thank you for your acquisition. Your archive pieces are being prepared with absolute precision. Order confirmation has been sent to your email.
        </p>
        <div className="p-8 bg-[var(--gray-900)] border border-[var(--gray-800)] inline-block text-center mb-12">
          <span className="label text-[var(--orange)] block mb-3" style={{ fontSize: "10px", letterSpacing: "0.15em" }}>ORDER REFERENCE</span>
          <span className="font-serif text-2xl text-[var(--beige)]">#{orderId}</span>
        </div>
        <Link href="/products" className="btn-primary" style={{ fontSize: "11px", padding: "18px 40px" }}>
          Continue Exploring
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--black)] text-[var(--beige)] pt-24 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[var(--gray-800)] pb-8 mb-12">
          <Link href="/products" className="label flex items-center gap-3 text-[var(--gray-400)] hover:text-[var(--orange)] transition-colors" style={{ fontSize: "10px", letterSpacing: "0.15em" }}>
            <ArrowLeft size={14} strokeWidth={1.5} /> BACK
          </Link>
          <div className="flex items-center gap-2 text-[var(--orange)] label" style={{ fontSize: "10px", letterSpacing: "0.15em" }}>
            <Lock size={14} strokeWidth={1.5} />
            <span>SECURE CHECKOUT</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* MAIN FORMS */}
          <div className="flex-1 space-y-16">
            
            {/* Step 1: Shipping */}
            <section className={`transition-opacity duration-500 ${activeStep === "payment" ? "opacity-40 pointer-events-none" : "opacity-100"}`}>
              <div className="flex items-center justify-between mb-10">
                <h2 className="font-serif text-3xl font-light text-[var(--beige)]">1. Shipping Destination</h2>
                {activeStep === "payment" && <CheckCircle2 className="w-6 h-6 text-[var(--orange)]" />}
              </div>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-3">
                    <label className="label text-[var(--gray-400)]" style={{ fontSize: "10px" }}>First Name</label>
                    <input type="text" className="input-box" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="label text-[var(--gray-400)]" style={{ fontSize: "10px" }}>Last Name</label>
                    <input type="text" className="input-box" />
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <label className="label text-[var(--gray-400)]" style={{ fontSize: "10px" }}>Address Line 1</label>
                  <input type="text" className="input-box" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-3 md:col-span-2">
                    <label className="label text-[var(--gray-400)]" style={{ fontSize: "10px" }}>City</label>
                    <input type="text" className="input-box" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="label text-[var(--gray-400)]" style={{ fontSize: "10px" }}>Postal Code</label>
                    <input type="text" className="input-box" />
                  </div>
                </div>

                {activeStep === "shipping" && (
                  <button 
                    type="button" 
                    onClick={() => setActiveStep("payment")}
                    className="btn-primary w-full mt-8"
                    style={{ padding: "20px" }}
                  >
                    Proceed to Payment
                  </button>
                )}
              </form>
            </section>

            {/* Step 2: Payment */}
            <section className={`transition-all duration-700 ${activeStep === "shipping" ? "opacity-20 pointer-events-none translate-y-4" : "opacity-100 translate-y-0"}`}>
              <div className="flex items-center justify-between mb-10">
                <h2 className="font-serif text-3xl font-light text-[var(--beige)]">2. Payment Method</h2>
              </div>

              <div className="bg-[var(--gray-900)] border border-[var(--orange)] p-8 mb-10 relative">
                <div className="absolute top-8 right-8 text-[var(--orange)]">
                  <CreditCard size={24} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col gap-3">
                    <label className="label text-[var(--gray-400)]" style={{ fontSize: "10px" }}>Card Number</label>
                    <input type="text" placeholder="0000 0000 0000 0000" className="bg-transparent border-b border-[var(--gray-600)] py-3 text-xl tracking-widest text-[var(--beige)] focus:outline-none focus:border-[var(--orange)] transition-colors placeholder-[var(--gray-600)]" />
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="flex flex-col gap-3">
                      <label className="label text-[var(--gray-400)]" style={{ fontSize: "10px" }}>Expiry</label>
                      <input type="text" placeholder="MM/YY" className="bg-transparent border-b border-[var(--gray-600)] py-3 text-lg tracking-widest text-[var(--beige)] focus:outline-none focus:border-[var(--orange)] transition-colors placeholder-[var(--gray-600)]" />
                    </div>
                    <div className="flex flex-col gap-3">
                      <label className="label text-[var(--gray-400)]" style={{ fontSize: "10px" }}>CVC</label>
                      <input type="text" placeholder="123" className="bg-transparent border-b border-[var(--gray-600)] py-3 text-lg tracking-widest text-[var(--beige)] focus:outline-none focus:border-[var(--orange)] transition-colors placeholder-[var(--gray-600)]" />
                    </div>
                  </div>
                </div>
              </div>

              {activeStep === "payment" && (
                <div className="flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setActiveStep("shipping")}
                    className="btn-secondary flex-shrink-0"
                    style={{ padding: "20px 32px" }}
                  >
                    Back
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setActiveStep("success")}
                    className="btn-primary flex-1 gap-3"
                    style={{ padding: "20px" }}
                  >
                    <ShieldCheck size={18} strokeWidth={1.5} /> PAY ${finalTotal.toFixed(2)}
                  </button>
                </div>
              )}
            </section>
          </div>

          {/* SIDEBAR: ORDER SUMMARY */}
          <aside className="w-full lg:w-[400px] flex-shrink-0">
            <div className="bg-[var(--gray-900)] border border-[var(--gray-800)] p-8 sticky top-28">
              <h3 className="label text-[var(--beige)] mb-8 border-b border-[var(--gray-800)] pb-5" style={{ fontSize: "11px", letterSpacing: "0.15em" }}>
                ORDER SUMMARY
              </h3>
              
              <div className="space-y-6 mb-10 max-h-[45vh] overflow-y-auto no-scroll pr-2">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-5">
                    <Image height={100} width={100} src={item.image} alt={item.name} className="w-20 h-24 object-cover border border-[var(--gray-800)]" />
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h4 className="label text-[var(--beige)]" style={{ fontSize: "10px", lineHeight: 1.4, letterSpacing: "0.1em" }}>{item.name}</h4>
                        <span className="label text-[var(--gray-400)] block mt-2" style={{ fontSize: "9px" }}>Size: {item.size} <br/> Qty: {item.quantity}</span>
                      </div>
                      <span className="label text-[var(--orange)]" style={{ fontSize: "11px" }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-5 border-t border-[var(--gray-800)] pt-8 label text-[var(--gray-200)]" style={{ fontSize: "10px", letterSpacing: "0.15em" }}>
                <div className="flex justify-between">
                  <span>SUBTOTAL</span>
                  <span className="text-[var(--beige)]">₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>SHIPPING</span>
                  <span className="text-[var(--beige)]">{shippingCost === 0 ? "COMPLIMENTARY" : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>TAXES (ESTIMATED)</span>
                  <span className="text-[var(--beige)]">₹{taxes.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-[var(--gray-800)] mt-8 pt-8">
                <span className="label text-[var(--beige)]" style={{ fontSize: "12px", letterSpacing: "0.2em" }}>TOTAL</span>
                <span className="font-serif text-3xl text-[var(--orange)]">₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}