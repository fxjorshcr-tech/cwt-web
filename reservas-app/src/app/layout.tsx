// src/app/layout.tsx - CORREGIDO
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// ✅ Optimizar fuente con swap para mejor FCP
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

// ✅ Metadata base mejorada
export const metadata: Metadata = {
  metadataBase: new URL('https://cantwaittravelcr.com'),
  title: {
    default: "Can't Wait Travel - Private Shuttle Costa Rica",
    template: "%s | Can't Wait Travel", // Para páginas específicas
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
    // ✅ FIXED: Changed to English (site is in English)
    <html lang="en">
      <head>
        {/* Preconnect para cargar recursos externos más rápido */}
        <link
          rel="preconnect"
          href="https://mmlbslwljvmscbgsqkkq.supabase.co"
        />
        <link
          rel="dns-prefetch"
          href="https://mmlbslwljvmscbgsqkkq.supabase.co"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}