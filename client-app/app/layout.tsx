import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/CartContext";
import { QuickViewProvider } from "@/lib/QuickViewContext";

import { Navbar } from "@/components/ui/navbar";
import { BottomNav } from "@/components/ui/bottom-nav";
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
      <body className="min-h-screen overflow-x-hidden bg-(--black) text-(--beige) antialiased selection:bg-(--orange) selection:text-(--black)">

        <CinematicLoader />

        <CartProvider>
          <QuickViewProvider>
            <Navbar />
            <div className="pb-16 md:pb-0 page-transition">{children}</div>
            <Footer />
            <BottomNav />
            <CartDrawer />
          </QuickViewProvider>
        </CartProvider>
      </body>
    </html>
  );
}