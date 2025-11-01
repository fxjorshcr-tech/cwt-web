'use client';

import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HERO_BACKGROUND_URL =
  'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/private-shuttle-costa-rica-service.WEBP';

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

      {/* Contenido del Hero */}
      <div className="relative z-[2] text-center px-6 max-w-5xl mx-auto">
        <h1 className="font-black uppercase tracking-wider text-4xl sm:text-5xl md:text-7xl mb-4 drop-shadow-[2px_2px_8px_rgba(0,0,0,0.8)]">
          Private Transportation
        </h1>

        <h2 className="font-normal text-lg sm:text-xl md:text-3xl mb-6 drop-shadow-[1px_1px_4px_rgba(0,0,0,0.8)]">
          Reliable Airport Shuttles & Door-to-Door Service in Costa Rica
        </h2>

        <p className="text-sm md:text-lg max-w-2xl mx-auto opacity-95 drop-shadow-[1px_1px_4px_rgba(0,0,0,0.8)]">
          Safe, comfortable, and professional transportation across Costa Rica. 
          From airports to beaches, we've got you covered.
        </p>
      </div>

      {/* Indicador de scroll (flecha animada) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2] animate-bounce">
        <Button
          variant="ghost"
          size="icon"
          onClick={scrollToForm}
          className="rounded-full bg-white/10 hover:bg-white/20 text-white h-14 w-14"
        >
          <ChevronDown className="h-10 w-10" />
        </Button>
      </div>
    </section>
  );
}