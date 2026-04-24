import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Import the Context and Global UI Components
import { CartProvider } from "@/lib/CartContext";
import { Navbar } from "@/components/ui/navbar";
import { CartDrawer } from "@/components/ui/cart-drawer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DRIPDUO | Super Premium Archive",
  description: "Unapologetic style. Uncompromising quality.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#050505] text-[#f8f8f8] selection:bg-[#C5A059] selection:text-black">
        {/* Wrap the entire app in the CartProvider to maintain global state */}
        <CartProvider>
          {/* Navbar sits at the top of every page */}
          <Navbar />
          
          {/* Main Page Content */}
          {children}
          
          {/* Cart Drawer sits at the root level so it can slide over any page */}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}