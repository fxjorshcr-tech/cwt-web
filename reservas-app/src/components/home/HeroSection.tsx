// src/components/home/HeroSection.tsx
'use client';

import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HERO_BACKGROUND_URL =
  'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/aerial-view-conchal-beach.webp';

export function HeroSection() {
  const scrollToForm = () => {
    window.scrollTo({
      top: window.innerHeight - 100,
      behavior: 'smooth'
    });
  };

  return (
    <section
      className="relative h-screen flex flex-col items-center justify-center text-white"
      style={{
        backgroundImage: `url(${HERO_BACKGROUND_URL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/50 z-[1]" />

      {/* Contenido del Hero - COMPACTO Y OPTIMIZADO PARA MÓVIL */}
      <div className="relative z-[2] text-center px-4 max-w-4xl mx-auto">
        
        {/* Título Principal - Más pequeño */}
        <h1 className="font-black uppercase tracking-wide text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 drop-shadow-[2px_2px_8px_rgba(0,0,0,0.8)] leading-tight">
          Private Transportation
        </h1>

        {/* Subtítulo - Más pequeño */}
        <h2 className="font-normal text-xs sm:text-sm md:text-base lg:text-lg mb-4 drop-shadow-[1px_1px_4px_rgba(0,0,0,0.8)] opacity-90 max-w-2xl mx-auto">
          Professional shuttle service from SJO & LIR to all major Costa Rica destinations
        </h2>

        {/* TRUSTED • FLEXIBLE • AUTHENTIC - Más pequeño */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 text-xs sm:text-sm md:text-base font-semibold tracking-wider">
          <span className="drop-shadow-lg">TRUSTED</span>
          <span className="text-blue-400">•</span>
          <span className="drop-shadow-lg">FLEXIBLE</span>
          <span className="text-blue-400">•</span>
          <span className="drop-shadow-lg">AUTHENTIC</span>
        </div>
      </div>

      {/* Indicador de scroll (flecha animada) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2] animate-bounce">
        <Button
          variant="ghost"
          size="icon"
          onClick={scrollToForm}
          className="rounded-full bg-white/10 hover:bg-white/20 text-white h-12 w-12 sm:h-14 sm:w-14"
        >
          <ChevronDown className="h-8 w-8 sm:h-10 sm:w-10" />
        </Button>
      </div>
    </section>
  );
}