import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Optimizar fuente
const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Mejora FCP
  preload: true,
});

export const metadata: Metadata = {
  title: "Can't Wait Travel - Private Shuttle Costa Rica",
  description: "Professional private shuttle service from SJO & LIR to all major Costa Rica destinations. Trusted, flexible, and authentic transportation.",
  keywords: ["Costa Rica", "private shuttle", "airport transfer", "SJO", "LIR", "transportation"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
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