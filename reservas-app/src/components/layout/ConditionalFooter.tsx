// src/components/layout/ConditionalFooter.tsx
'use client';

import { usePathname } from "next/navigation";
import Footer from "@/components/layout/Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // ✅ Ocultar footer en páginas del flujo de booking
  const hideFooter = pathname === '/preview' ||
                     pathname === '/checkout' ||
                     pathname === '/payment';

  if (hideFooter) return null;
  
  return <Footer />;
}