// src/components/layout/ConditionalFooter.tsx
'use client';

import { usePathname } from "next/navigation";
import Footer from "@/components/home/Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // ✅ Ocultar footer en páginas del flujo de booking
  const hideFooter = pathname === '/booking-details' || 
                     pathname === '/summary' || 
                     pathname === '/payment';

  if (hideFooter) return null;
  
  return <Footer />;
}