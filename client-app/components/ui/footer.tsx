"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Minus } from "lucide-react";

const FOOTER_SECTIONS = [
  {
    title: "Help",
    links: ["Customer Care", "FAQ", "Track Your Order", "Shipping & Returns", "Exchanges"],
  },
  {
    title: "Company",
    links: ["About Us", "Careers", "Press", "Sustainability"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Use", "Cookie Policy"],
  },
];

const FooterSection = ({ title, links }: { title: string; links: string[] }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 md:border-none">
      {/* Mobile accordion header */}
      <button
        className="w-full flex items-center justify-between py-4 md:hidden"
        onClick={() => setOpen(!open)}
      >
        <span className="label" style={{ fontSize: "11px", letterSpacing: "0.12em" }}>
          {title.toUpperCase()}
        </span>
        {open ? <Minus size={14} strokeWidth={1.5} /> : <Plus size={14} strokeWidth={1.5} />}
      </button>

      {/* Desktop header */}
      <p className="label mb-5 hidden md:block" style={{ fontSize: "11px", letterSpacing: "0.12em" }}>
        {title.toUpperCase()}
      </p>

      {/* Links */}
      <div className={`accordion-content md:max-h-none ${open ? "open" : ""}`}>
        <div className="pb-4 md:pb-0 space-y-3 md:space-y-3">
          {links.map((link) => (
            <Link
              key={link}
              href="#"
              className="block label text-gray-500 hover:text-black transition-colors"
              style={{ fontSize: "11px" }}
            >
              {link}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Footer = () => {
  return (
    <footer
      className="bg-white border-t border-gray-200"
      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      {/* Top */}
      <div className="px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-0 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-2 mb-8 md:mb-0">
            <Link href="/" className="block mb-6">
              <span style={{
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: "16px",
                fontWeight: 400,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
              }}>
                DRIPDUO
              </span>
            </Link>
            <p className="label text-gray-500 mb-8" style={{ fontSize: "11px", lineHeight: 1.8, maxWidth: "320px" }}>
              Unapologetic style. Uncompromising quality. Engineered for those who demand excellence.
            </p>
            {/* Socials */}
            <div className="flex gap-5">
              {["Instagram", "TikTok", "X"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="label text-gray-400 hover:text-black transition-colors"
                  style={{ fontSize: "10px" }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-8">
            {FOOTER_SECTIONS.map((section) => (
              <FooterSection key={section.title} {...section} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-200 px-4 md:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="label text-gray-400" style={{ fontSize: "10px" }}>
          © 2026 DRIPDUO. All rights reserved.
        </p>
        <div className="flex items-center gap-5">
          <span className="label text-gray-400" style={{ fontSize: "10px" }}>India</span>
          <span className="label text-gray-400" style={{ fontSize: "10px" }}>USD</span>
          <span className="label text-gray-400" style={{ fontSize: "10px" }}>English</span>
        </div>
      </div>
    </footer>
  );
};