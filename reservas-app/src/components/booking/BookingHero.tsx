"use client";

export default function BookingHero() {
  return (
    <section
      className="relative h-[280px] md:h-[350px] w-full flex items-center justify-center"
      style={{
        backgroundImage:
          'url(https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/private-transfer-sjo-airport.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/50 z-[1]" />

      {/* Contenido */}
      <div className="relative z-[2] container mx-auto px-6 text-center text-white">
        <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.3)] tracking-wide">
          Private Transportation
        </h1>
        <p className="font-normal text-lg sm:text-xl md:text-2xl drop-shadow-[1px_1px_3px_rgba(0,0,0,0.3)] max-w-2xl mx-auto leading-relaxed">
          Reliable, convenient & safe
        </p>
      </div>
    </section>
  );
}