import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/CartContext";
import { QuickViewProvider } from "@/lib/QuickViewContext";

// Named imports (with curly braces)
import { Navbar } from "@/components/ui/navbar";
import { BottomNav } from "@/components/ui/bottom-nav";
import { QuickViewModal } from "@/components/ui/quick-view-modal";
import { Footer } from "@/components/ui/footer";

// Default import (no curly braces for CartDrawer)
import CartDrawer from "@/components/ui/cart-drawer";

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
        <CartProvider>
          <QuickViewProvider>
            <Navbar />
            <div className="pb-16 md:pb-0">{children}</div>
            <Footer />
            <BottomNav />
            <CartDrawer />
            <QuickViewModal />
          </QuickViewProvider>
        </CartProvider>
      </body>
    </html>
  );
}