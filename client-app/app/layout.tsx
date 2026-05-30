import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/CartContext";
import { QuickViewProvider } from "@/lib/QuickViewContext";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/ui/footer";
import CartDrawer from "@/components/ui/cart-drawer";
import CinematicLoader from "@/components/CinematicLoader";

export const metadata: Metadata = {
  title: "DRIPDUO | FW26",
  description: "New Collection. Premium heavyweight garments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen overflow-x-hidden bg-[#050505] text-[#ECE7D1] antialiased selection:bg-[#EE3C24] selection:text-black">

        <CinematicLoader />

        <CartProvider>
          <QuickViewProvider>
            <Navbar />
            {/* Removed pb-16 to allow images to hit the true bottom of the screen on mobile */}
            <div className="page-transition">{children}</div>
            <Footer />
            <CartDrawer />
          </QuickViewProvider>
        </CartProvider>
      </body>
    </html>
  );
}