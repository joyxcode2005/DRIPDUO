import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Import Providers and Global UI Components
import { CartProvider } from "@/lib/CartContext";
import { QuickViewProvider } from "@/lib/QuickViewContext";
import { Navbar } from "@/components/ui/navbar";
import { BottomNav } from "@/components/ui/bottom-nav";
import { CartDrawer } from "@/components/ui/cart-drawer";
import { QuickViewModal } from "@/components/ui/quick-view-modal";
import { Footer } from "@/components/ui/footer";

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
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#050505] text-[#f8f8f8] selection:bg-[#C5A059] selection:text-black">
        <CartProvider>
          <QuickViewProvider>
            
            <Navbar />
            
            {/* Main Content Area - Added pb-20 to account for Mobile Bottom Nav */}
            <div className="flex-1 pb-20 md:pb-0">
              {children}
            </div>

            <Footer />
            
            {/* Global Overlays & Navs */}
            <BottomNav />
            <CartDrawer />
            <QuickViewModal />
            
          </QuickViewProvider>
        </CartProvider>
      </body>
    </html>
  );
}