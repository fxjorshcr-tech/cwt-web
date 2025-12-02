// src/app/layout.tsx
// ✅ OPTIMIZADO: Preloading y prefetching completo
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConditionalFooter from "@/components/layout/ConditionalFooter";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "sonner";
import LocalStorageCleanup from "@/components/LocalStorageCleanup";
import WhatsAppButton from "@/components/WhatsAppButton";
import ChunkErrorHandler from "@/components/ChunkErrorHandler";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import RollbarProvider from "@/components/RollbarProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://cantwaittravelcr.com'),
  title: {
    default: "Can't Wait Travel - Private Shuttle Costa Rica",
    template: "%s | Can't Wait Travel",
  },
  description: "Professional private shuttle service from SJO & LIR to all major Costa Rica destinations. Trusted, flexible, and authentic transportation.",
  keywords: ["Costa Rica", "private shuttle", "airport transfer", "SJO", "LIR", "transportation", "can't wait travel"],
  authors: [{ name: "Can't Wait Travel" }],
  creator: "Can't Wait Travel",
  publisher: "Can't Wait Travel",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* ✅ DNS Prefetch - Resolve DNS lo antes posible */}
        <link rel="dns-prefetch" href="https://mmlbslwljvmscbgsqkkq.supabase.co" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        
        {/* ✅ Preconnect - Establece conexión completa (DNS + TCP + TLS) */}
        <link 
          rel="preconnect" 
          href="https://mmlbslwljvmscbgsqkkq.supabase.co" 
          crossOrigin="anonymous"
        />
        <link 
          rel="preconnect" 
          href="https://fonts.googleapis.com" 
          crossOrigin="anonymous"
        />
        
        {/* ✅ Preload imagen hero - Crítica para LCP */}
        <link
          rel="preload"
          as="image"
          href="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/aerial-view-conchal-beach.webp"
          imageSrcSet="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/aerial-view-conchal-beach.webp 1920w"
          imageSizes="100vw"
        />
        
        {/* ✅ Prefetch rutas críticas del flujo de booking */}
        <link rel="prefetch" href="/booking-details" />
        <link rel="prefetch" href="/summary" />
        <link rel="prefetch" href="/confirmation" />
      </head>
      <body className={`${inter.className} overflow-x-hidden`}>
        <RollbarProvider>
        <CartProvider>
          <ChunkErrorHandler />
          <LocalStorageCleanup />
          <div className="min-h-screen flex flex-col overflow-x-hidden">
            <main className="flex-1 w-full overflow-x-hidden">
              {children}
            </main>
            <ConditionalFooter />
          </div>
          <WhatsAppButton />
          <Toaster position="top-right" richColors closeButton duration={1000} />
        </CartProvider>
        </RollbarProvider>
        <SpeedInsights />
        <Analytics />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}