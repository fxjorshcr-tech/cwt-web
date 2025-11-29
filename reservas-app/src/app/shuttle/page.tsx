// src/app/shuttle/page.tsx
// ✅ UPDATED - Consistent "Private Operator" branding (No "Shuttles")
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import BookingNavbar from '@/components/booking/BookingNavbar';
import WhatsAppButton from '@/components/WhatsAppButton';
import { TrendingUp, Clock, DollarSign, MapPin, Flame, ArrowRight, Shield, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Traveler Favorites | Top Private Routes Costa Rica',
  description: 'Discover the most requested private routes across Costa Rica. Direct transfers from SJO, Liberia, and La Fortuna with local experts.',
  keywords: ['Costa Rica private transfers', 'popular routes', 'direct transport', 'SJO airport transfer', 'La Fortuna transport'],
};

// NOMBRES EXACTOS de la base de datos para matching perfecto
const popularRoutes = [
  {
    category: 'From SJO Airport',
    icon: '✈️',
    routes: [
      { from: 'SJO - Juan Santamaria Int. Airport (or Alajuela City & Downtown San Jose)', to: 'La Fortuna, Arenal Volcano & El Castillo', slug: 'sjo-to-la-fortuna', isHot: true },
      { from: 'SJO - Juan Santamaria Int. Airport (or Alajuela City & Downtown San Jose)', to: 'Manuel Antonio (National Park Area) Quepos', slug: 'sjo-to-manuel-antonio', isHot: true },
      { from: 'SJO - Juan Santamaria Int. Airport (or Alajuela City & Downtown San Jose)', to: 'Tamarindo / Flamingo / Conchal (Guanacaste Beaches)', slug: 'sjo-to-tamarindo' },
      { from: 'SJO - Juan Santamaria Int. Airport (or Alajuela City & Downtown San Jose)', to: 'Monteverde (Cloud Forest)', slug: 'sjo-to-monteverde' },
      { from: 'SJO - Juan Santamaria Int. Airport (or Alajuela City & Downtown San Jose)', to: 'Puerto Viejo de Talamanca (Caribbean Coast)', slug: 'sjo-to-puerto-viejo' },
    ]
  },
  {
    category: 'From La Fortuna',
    icon: '🌋',
    routes: [
      { from: 'La Fortuna, Arenal Volcano & El Castillo', to: 'SJO - Juan Santamaria Int. Airport (or Alajuela City & Downtown San Jose)', slug: 'la-fortuna-to-sjo', isHot: true },
      { from: 'La Fortuna, Arenal Volcano & El Castillo', to: 'LIR - Liberia International Airport', slug: 'la-fortuna-to-lir' },
      { from: 'La Fortuna, Arenal Volcano & El Castillo', to: 'Monteverde (Cloud Forest)', slug: 'la-fortuna-to-monteverde', isHot: true },
      { from: 'La Fortuna, Arenal Volcano & El Castillo', to: 'Papagayo Peninsula, Guanacaste', slug: 'la-fortuna-to-papagayo' },
      { from: 'La Fortuna, Arenal Volcano & El Castillo', to: 'Tamarindo / Flamingo / Conchal (Guanacaste Beaches)', slug: 'la-fortuna-to-tamarindo' },
      { from: 'La Fortuna, Arenal Volcano & El Castillo', to: 'Manuel Antonio (National Park Area) Quepos', slug: 'la-fortuna-to-manuel-antonio', isHot: true },
      { from: 'La Fortuna, Arenal Volcano & El Castillo', to: 'Jaco / Playa Hermosa (Central Pacific)', slug: 'la-fortuna-to-jaco' },
      { from: 'La Fortuna, Arenal Volcano & El Castillo', to: 'Samara (Playa Samara Beach)', slug: 'la-fortuna-to-samara' },
      { from: 'La Fortuna, Arenal Volcano & El Castillo', to: 'Nosara (Playa Guiones Area)', slug: 'la-fortuna-to-nosara' },
      { from: 'La Fortuna, Arenal Volcano & El Castillo', to: 'Puerto Viejo de Talamanca (Caribbean Coast)', slug: 'la-fortuna-to-puerto-viejo' },
    ]
  },
  {
    category: 'From LIR Airport',
    icon: '🛬',
    routes: [
      { from: 'LIR - Liberia International Airport', to: 'Tamarindo / Flamingo / Conchal (Guanacaste Beaches)', slug: 'lir-to-tamarindo', isHot: true },
      { from: 'LIR - Liberia International Airport', to: 'Papagayo Peninsula, Guanacaste', slug: 'lir-to-papagayo', isHot: true },
      { from: 'LIR - Liberia International Airport', to: 'La Fortuna, Arenal Volcano & El Castillo', slug: 'lir-to-la-fortuna' },
      { from: 'LIR - Liberia International Airport', to: 'Nosara (Playa Guiones Area)', slug: 'lir-to-nosara' },
      { from: 'LIR - Liberia International Airport', to: 'Santa Teresa / Malpais/ Montezuma Area', slug: 'lir-to-santa-teresa' },
      { from: 'LIR - Liberia International Airport', to: 'Monteverde (Cloud Forest)', slug: 'lir-to-monteverde' },
      { from: 'LIR - Liberia International Airport', to: 'Rio Celeste (Tenorio Volcano National Park)', slug: 'lir-to-rio-celeste' },
    ]
  },
  {
    category: 'From Monteverde',
    icon: '🌿',
    routes: [
      { from: 'Monteverde (Cloud Forest)', to: 'SJO - Juan Santamaria Int. Airport (or Alajuela City & Downtown San Jose)', slug: 'monteverde-to-sjo' },
      { from: 'Monteverde (Cloud Forest)', to: 'Manuel Antonio (National Park Area) Quepos', slug: 'monteverde-to-manuel-antonio' },
      { from: 'Monteverde (Cloud Forest)', to: 'Tamarindo / Flamingo / Conchal (Guanacaste Beaches)', slug: 'monteverde-to-tamarindo' },
      { from: 'Monteverde (Cloud Forest)', to: 'La Fortuna, Arenal Volcano & El Castillo', slug: 'monteverde-to-la-fortuna' },
    ]
  },
];

async function getRoutePrice(from: string, to: string) {
  const supabase = createClient();
  
  const { data } = await supabase
    .from('routes')
    .select('precio1a6, precio7a9, precio10a12, precio13a18, duracion')
    .ilike('origen', `%${from}%`)
    .ilike('destino', `%${to}%`)
    .single();

  if (!data) {
    return { price: null, duration: null };
  }

  const minPrice = Math.min(
    data.precio1a6 || Infinity,
    data.precio7a9 || Infinity,
    data.precio10a12 || Infinity,
    data.precio13a18 || Infinity
  );

  return {
    price: minPrice === Infinity ? null : minPrice,
    duration: data.duracion
  };
}

export default async function MostBookedPage() {
  // Obtener precios y duraciones de todas las rutas
  const routesWithData = await Promise.all(
    popularRoutes.map(async (category) => ({
      ...category,
      routes: await Promise.all(
        category.routes.map(async (route) => {
          const { price, duration } = await getRoutePrice(route.from, route.to);
          return {
            ...route,
            price,
            duration
          };
        })
      )
    }))
  );

  return (
    <>
      <BookingNavbar />
      
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px] max-h-[600px]">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/aerial-view-conchal-beach.webp"
              alt="Costa Rica Private Transportation Routes"
              fill
              sizes="100vw"
              className="object-cover"
              priority
              
            />
            {/* Darker overlay for better text contrast */}
            <div className="absolute inset-0 bg-black/60" />
          </div>

          <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
            <div className="text-center max-w-5xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 mb-6">
                <Flame className="h-5 w-5 text-orange-400" />
                <span className="text-white font-bold text-sm tracking-wide uppercase">Traveler Favorites</span>
              </div>
              
              {/* ✅ UPDATED: Removed "Where Our Guests Are Going" */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-xl leading-tight">
                Top Connections Across Costa Rica
              </h1>

              <p className="text-base sm:text-lg text-white/90 mb-8 drop-shadow-md max-w-2xl mx-auto font-medium">
                The most requested routes by our travelers.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-white">
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 p-1.5 rounded-full">
                    <Shield className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold">ICT Licensed</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="bg-white/20 p-1.5 rounded-full">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold">100% Private</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Routes Grid */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6 max-w-7xl">
            
            {routesWithData.map((category, idx) => (
              <div key={idx} className="mb-20 last:mb-0">
                <div className="flex items-center gap-4 mb-10 border-b border-gray-200 pb-4">
                  <div className="text-3xl">{category.icon}</div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {category.category}
                    </h2>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
                  {category.routes
                    .filter(route => route.price !== null)
                    .map((route) => (
                    <Link
                      key={route.slug}
                      href={`/shuttle/${route.slug}`}
                      className="group flex items-center justify-between p-4 hover:bg-blue-50 transition-all duration-200"
                    >
                      {/* Left: Destination info */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                          <MapPin className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-bold text-gray-900 truncate">
                              {route.to}
                            </p>
                            {route.isHot && (
                              <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0">
                                POPULAR
                              </span>
                            )}
                          </div>
                          {route.duration && (
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <Clock className="h-3 w-3" />
                              <span>{route.duration}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Price and arrow */}
                      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                        {route.price && (
                          <div className="text-right">
                            <p className="text-xs text-gray-400">From</p>
                            <p className="text-lg font-black text-gray-900">${route.price}</p>
                          </div>
                        )}
                        <div className="bg-gray-100 group-hover:bg-blue-600 p-2 rounded-full transition-colors">
                          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}

          </div>
        </section>

        {/* CTA Section - Search All Routes */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-12 text-center text-white shadow-2xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Don't See Your Route?
              </h2>
              <p className="text-base text-blue-100 mb-8 max-w-xl mx-auto">
                Search all available routes in Costa Rica using our booking form. We connect destinations from coast to coast.
              </p>
              <Link
                href="/transfers"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-xl shadow-lg hover:scale-105 transition-all"
              >
                Search All Routes
                <ArrowRight className="h-5 w-5" />
              </Link>
              <p className="text-blue-200 mt-6 text-sm">
                 Direct Operator • 100% Private Service
              </p>
            </div>
          </div>
        </section>

        <WhatsAppButton />
      </main>
    </>
  );
}