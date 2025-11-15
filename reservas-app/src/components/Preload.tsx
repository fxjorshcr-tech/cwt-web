// src/components/Preload.tsx
//  Componente para precargar recursos críticos
import Head from 'next/head';

export function Preload() {
  return (
    <Head>
      {/* DNS Prefetch para dominios externos */}
      <link rel="dns-prefetch" href="https://mmlbslwljvmscbgsqkkq.supabase.co" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      
      {/* Preconnect a Supabase (más agresivo que dns-prefetch) */}
      <link rel="preconnect" href="https://mmlbslwljvmscbgsqkkq.supabase.co" crossOrigin="anonymous" />
      
      {/* Prefetch de rutas críticas */}
      <link rel="prefetch" href="/booking-details" />
      <link rel="prefetch" href="/summary" />
      <link rel="prefetch" href="/confirmation" />
      
      {/* Preload de imagen hero (crítica para LCP) */}
      <link
        rel="preload"
        as="image"
        href="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/aerial-view-conchal-beach.webp"
        imageSrcSet="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/aerial-view-conchal-beach.webp 1200w"
        imageSizes="100vw"
      />
    </Head>
  );
}
