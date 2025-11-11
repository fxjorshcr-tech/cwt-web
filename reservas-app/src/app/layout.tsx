// src/app/layout.tsx - CON FOOTER CONDICIONAL
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConditionalFooter from "@/components/layout/ConditionalFooter";

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
        <link
          rel="preconnect"
          href="https://mmlbslwljvmscbgsqkkq.supabase.co"
        />
        <link
          rel="dns-prefetch"
          href="https://mmlbslwljvmscbgsqkkq.supabase.co"
        />
      </head>
      <body className={`${inter.className} overflow-x-hidden`}>
        <div className="min-h-screen flex flex-col overflow-x-hidden">
          <main className="flex-1 w-full overflow-x-hidden">
            {children}
          </main>
          <ConditionalFooter />
        </div>
      </body>
    </html>
  );
}