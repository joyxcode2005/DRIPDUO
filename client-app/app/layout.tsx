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
      {/* Background updated to include a subtle ambient radial glow for glassmorphism refraction */}
      <body className="min-h-screen overflow-x-hidden bg-[#050505] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.12),rgba(255,255,255,0))] text-[#ECE7D1] antialiased selection:bg-[#EE3C24] selection:text-[#050505]">

        <CinematicLoader />

        <CartProvider>
          <QuickViewProvider>
            <Navbar />
            <div className="page-transition">{children}</div>
            <Footer />
            <CartDrawer />
          </QuickViewProvider>
        </CartProvider>
      </body>
    </html>
  );
}