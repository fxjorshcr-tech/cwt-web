// src/app/shuttle/page.tsx
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import BookingNavbar from '@/components/booking/BookingNavbar';
import WhatsAppButton from '@/components/WhatsAppButton';
import { TrendingUp, Clock, DollarSign, MapPin, Flame, ArrowRight, Star } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Most Booked Shuttle Routes in Costa Rica',
  description: 'Discover our most popular private shuttle routes across Costa Rica. Book your door-to-door transfer with confidence - these are our customers\' top choices.',
  keywords: ['Costa Rica shuttles', 'popular routes', 'most booked transfers', 'airport shuttle', 'private transportation'],
};

const popularRoutes = [
  {
    category: 'From SJO Airport',
    icon: '✈️',
    routes: [
      { from: 'SJO', to: 'La Fortuna', slug: 'sjo-to-la-fortuna', isHot: true },
      { from: 'SJO', to: 'Manuel Antonio', slug: 'sjo-to-manuel-antonio', isHot: true },
      { from: 'SJO', to: 'Tamarindo', slug: 'sjo-to-tamarindo' },
      { from: 'SJO', to: 'Monteverde', slug: 'sjo-to-monteverde' },
      { from: 'SJO', to: 'Puerto Viejo', slug: 'sjo-to-puerto-viejo' },
    ]
  },
  {
    category: 'From La Fortuna',
    icon: '🌋',
    routes: [
      { from: 'La Fortuna', to: 'SJO', slug: 'la-fortuna-to-sjo', isHot: true },
      { from: 'La Fortuna', to: 'LIR', slug: 'la-fortuna-to-lir' },
      { from: 'La Fortuna', to: 'Monteverde', slug: 'la-fortuna-to-monteverde', isHot: true },
      { from: 'La Fortuna', to: 'Papagayo', slug: 'la-fortuna-to-papagayo' },
      { from: 'La Fortuna', to: 'Tamarindo', slug: 'la-fortuna-to-tamarindo' },
      { from: 'La Fortuna', to: 'Manuel Antonio', slug: 'la-fortuna-to-manuel-antonio', isHot: true },
      { from: 'La Fortuna', to: 'Jaco', slug: 'la-fortuna-to-jaco' },
      { from: 'La Fortuna', to: 'Samara', slug: 'la-fortuna-to-samara' },
      { from: 'La Fortuna', to: 'Nosara', slug: 'la-fortuna-to-nosara' },
      { from: 'La Fortuna', to: 'Puerto Viejo', slug: 'la-fortuna-to-puerto-viejo' },
    ]
  },
  {
    category: 'From LIR Airport',
    icon: '🛬',
    routes: [
      { from: 'LIR', to: 'Tamarindo', slug: 'lir-to-tamarindo', isHot: true },
      { from: 'LIR', to: 'Papagayo', slug: 'lir-to-papagayo', isHot: true },
      { from: 'LIR', to: 'La Fortuna', slug: 'lir-to-la-fortuna' },
      { from: 'LIR', to: 'Nosara', slug: 'lir-to-nosara' },
      { from: 'LIR', to: 'Santa Teresa', slug: 'lir-to-santa-teresa' },
      { from: 'LIR', to: 'Monteverde', slug: 'lir-to-monteverde' },
      { from: 'LIR', to: 'Rio Celeste', slug: 'lir-to-rio-celeste' },
    ]
  },
  {
    category: 'From Monteverde',
    icon: '🌿',
    routes: [
      { from: 'Monteverde', to: 'SJO', slug: 'monteverde-to-sjo' },
      { from: 'Monteverde', to: 'Manuel Antonio', slug: 'monteverde-to-manuel-antonio' },
      { from: 'Monteverde', to: 'Tamarindo', slug: 'monteverde-to-tamarindo' },
      { from: 'Monteverde', to: 'La Fortuna', slug: 'monteverde-to-la-fortuna' },
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
      
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px]">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/aerial-view-conchal-beach.webp?width=1600&quality=70"
              alt="Most Booked Shuttle Routes in Costa Rica"
              fill
              sizes="100vw"
              className="object-cover"
              priority
              quality={70}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
          </div>

          <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
            <div className="text-center max-w-5xl">
              <div className="inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm px-6 py-3 rounded-full border border-orange-400/30 mb-6">
                <Flame className="h-6 w-6 text-orange-400" />
                <span className="text-orange-300 font-bold text-lg uppercase tracking-wide">Trending Routes</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl leading-tight">
                Most Booked Shuttles
              </h1>
              
              <p className="text-xl sm:text-2xl text-white/90 mb-4 drop-shadow-lg max-w-3xl mx-auto leading-relaxed">
                Join thousands of happy travelers on Costa Rica&apos;s most popular routes
              </p>
              
              <div className="flex items-center justify-center gap-8 text-white/80">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-semibold">5.0 Rating</span>
                </div>
                <span className="text-2xl">•</span>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  <span className="text-sm font-semibold">10,000+ Rides</span>
                </div>
                <span className="text-2xl">•</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">ICT Licensed</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Routes Grid */}
        <section className="py-24">
          <div className="container mx-auto px-6 max-w-7xl">
            
            {routesWithData.map((category, idx) => (
              <div key={idx} className="mb-20 last:mb-0">
                <div className="flex items-center gap-4 mb-10">
                  <div className="text-5xl">{category.icon}</div>
                  <div>
                    <h2 className="text-4xl font-black text-gray-900 flex items-center gap-3">
                      {category.category}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {category.routes.filter(r => r.price !== null).length} available routes
                    </p>
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.routes
                    .filter(route => route.price !== null)
                    .map((route) => (
                    <Link
                      key={route.slug}
                      href={`/shuttle/${route.slug}`}
                      className="group relative bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                    >
                      {/* Hot Badge */}
                      {route.isHot && (
                        <div className="absolute top-4 right-4 z-10">
                          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                            <Flame className="h-3 w-3" />
                            HOT
                          </div>
                        </div>
                      )}

                      {/* Gradient Background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="relative p-6">
                        <div className="mb-4">
                          <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                            <MapPin className="h-4 w-4" />
                            <span className="font-medium">Route</span>
                          </div>
                          <h3 className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">
                            {route.from}
                            <ArrowRight className="inline-block mx-2 h-6 w-6" />
                            {route.to}
                          </h3>
                        </div>

                        <div className="space-y-3 mb-6">
                          {route.duration && (
                            <div className="flex items-center gap-3">
                              <div className="bg-blue-100 p-2 rounded-lg">
                                <Clock className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium">Duration</p>
                                <p className="text-sm font-bold text-gray-900">{route.duration}</p>
                              </div>
                            </div>
                          )}
                          {route.price && (
                            <div className="flex items-center gap-3">
                              <div className="bg-green-100 p-2 rounded-lg">
                                <DollarSign className="h-4 w-4 text-green-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium">Starting at</p>
                                <p className="text-2xl font-black text-gray-900">${route.price}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                          <span className="text-blue-600 font-bold group-hover:text-blue-700">
                            View Details
                          </span>
                          <ArrowRight className="h-5 w-5 text-blue-600 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}

          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Don&apos;t See Your Route?
            </h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              We service <span className="font-bold">ALL destinations</span> across Costa Rica. Get a custom quote in seconds!
            </p>
            <Link
              href="/transfers"
              className="inline-flex items-center justify-center gap-3 px-12 py-5 text-xl font-bold text-blue-600 bg-white rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all transform"
            >
              Get Custom Quote
              <ArrowRight className="h-6 w-6" />
            </Link>
            <p className="text-white/80 mt-6 text-sm">
              ✓ Instant confirmation • ✓ Free cancellation • ✓ 24/7 support
            </p>
          </div>
        </section>

        <WhatsAppButton />
      </main>
    </>
  );
}