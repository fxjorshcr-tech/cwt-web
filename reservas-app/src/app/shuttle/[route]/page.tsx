// src/app/shuttle/[route]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import BookingNavbar from '@/components/booking/BookingNavbar';
import WhatsAppButton from '@/components/WhatsAppButton';
import { createClient } from '@/lib/supabase/server';
import { CheckCircle2, Clock, MapPin, Star } from 'lucide-react';

// Definir las rutas populares que queremos indexar
const POPULAR_ROUTES = [
  // SJO Airport routes
  { from: 'SJO', to: 'La Fortuna', slug: 'sjo-to-la-fortuna' },
  { from: 'SJO', to: 'Manuel Antonio', slug: 'sjo-to-manuel-antonio' },
  { from: 'SJO', to: 'Tamarindo', slug: 'sjo-to-tamarindo' },
  { from: 'SJO', to: 'Monteverde', slug: 'sjo-to-monteverde' },
  { from: 'SJO', to: 'Puerto Viejo', slug: 'sjo-to-puerto-viejo' },
  
  // La Fortuna routes
  { from: 'La Fortuna', to: 'SJO', slug: 'la-fortuna-to-sjo' },
  { from: 'La Fortuna', to: 'LIR', slug: 'la-fortuna-to-lir' },
  { from: 'La Fortuna', to: 'Monteverde', slug: 'la-fortuna-to-monteverde' },
  { from: 'La Fortuna', to: 'Papagayo', slug: 'la-fortuna-to-papagayo' },
  { from: 'La Fortuna', to: 'Tamarindo', slug: 'la-fortuna-to-tamarindo' },
  { from: 'La Fortuna', to: 'Manuel Antonio', slug: 'la-fortuna-to-manuel-antonio' },
  { from: 'La Fortuna', to: 'Jaco', slug: 'la-fortuna-to-jaco' },
  { from: 'La Fortuna', to: 'Samara', slug: 'la-fortuna-to-samara' },
  { from: 'La Fortuna', to: 'Nosara', slug: 'la-fortuna-to-nosara' },
  { from: 'La Fortuna', to: 'Puerto Viejo', slug: 'la-fortuna-to-puerto-viejo' },
  
  // LIR Airport routes
  { from: 'LIR', to: 'Tamarindo', slug: 'lir-to-tamarindo' },
  { from: 'LIR', to: 'Papagayo', slug: 'lir-to-papagayo' },
  { from: 'LIR', to: 'La Fortuna', slug: 'lir-to-la-fortuna' },
  { from: 'LIR', to: 'Nosara', slug: 'lir-to-nosara' },
  { from: 'LIR', to: 'Santa Teresa', slug: 'lir-to-santa-teresa' },
  { from: 'LIR', to: 'Monteverde', slug: 'lir-to-monteverde' },
  { from: 'LIR', to: 'Rio Celeste', slug: 'lir-to-rio-celeste' },
  
  // Monteverde routes
  { from: 'Monteverde', to: 'SJO', slug: 'monteverde-to-sjo' },
  { from: 'Monteverde', to: 'Manuel Antonio', slug: 'monteverde-to-manuel-antonio' },
  { from: 'Monteverde', to: 'Tamarindo', slug: 'monteverde-to-tamarindo' },
  { from: 'Monteverde', to: 'La Fortuna', slug: 'monteverde-to-la-fortuna' },
];

export async function generateStaticParams() {
  return POPULAR_ROUTES.map(route => ({
    route: route.slug
  }));
}

export async function generateMetadata({ params }: { params: { route: string } }): Promise<Metadata> {
  const routeData = POPULAR_ROUTES.find(r => r.slug === params.route);
  
  if (!routeData) {
    return {
      title: 'Route Not Found',
    };
  }

  return {
    title: `Private Shuttle from ${routeData.from} to ${routeData.to}`,
    description: `Book your private door-to-door shuttle service from ${routeData.from} to ${routeData.to}. Professional drivers, modern vehicles, flexible scheduling. Licensed by ICT Costa Rica.`,
    keywords: [
      `${routeData.from} to ${routeData.to} shuttle`,
      `private transfer ${routeData.from} ${routeData.to}`,
      `transportation ${routeData.from}`,
      'Costa Rica private shuttle',
      'airport transfer Costa Rica'
    ],
  };
}

async function getRouteData(from: string, to: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('routes')
    .select('*')
    .ilike('origen', `%${from}%`)
    .ilike('destino', `%${to}%`)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export default async function ShuttleRoutePage({ params }: { params: { route: string } }) {
  const routeInfo = POPULAR_ROUTES.find(r => r.slug === params.route);
  
  if (!routeInfo) {
    notFound();
  }

  const routeData = await getRouteData(routeInfo.from, routeInfo.to);

  if (!routeData) {
    notFound();
  }

  const minPrice = Math.min(
    routeData.precio1a6 || Infinity,
    routeData.precio7a9 || Infinity,
    routeData.precio10a12 || Infinity,
    routeData.precio13a18 || Infinity
  );

  return (
    <>
      <BookingNavbar />
      
      <main className="min-h-screen bg-white">
        <section className="relative h-[60vh] min-h-[500px]">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/aerial-view-conchal-beach.webp?width=1600&quality=70"
              alt={`Private Shuttle from ${routeInfo.from} to ${routeInfo.to}`}
              fill
              sizes="100vw"
              className="object-cover"
              priority
              quality={70}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
          </div>

          <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
            <div className="text-center max-w-4xl">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl">
                {routeInfo.from} to {routeInfo.to}
              </h1>
              
              <p className="text-xl sm:text-2xl text-white/95 mb-8 drop-shadow-lg">
                Private Door-to-Door Shuttle Service
              </p>

              <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
                <div className="flex items-center gap-2 text-white">
                  <Clock className="h-6 w-6" />
                  <span className="text-lg font-semibold">{routeData.duracion}</span>
                </div>
                <span className="text-white text-2xl">•</span>
                <div className="flex items-center gap-2 text-white">
                  <MapPin className="h-6 w-6" />
                  <span className="text-lg font-semibold">{routeData.kilometros} km</span>
                </div>
                <span className="text-white text-2xl">•</span>
                <div className="flex items-center gap-2 text-white">
                  <span className="text-2xl font-bold">From ${minPrice}</span>
                  <span className="text-sm">per vehicle</span>
                </div>
              </div>

              <Link
                href={`/transfers?from=${encodeURIComponent(routeInfo.from)}&to=${encodeURIComponent(routeInfo.to)}`}
                className="inline-flex items-center justify-center px-12 py-5 text-lg font-bold text-white bg-blue-600 rounded-xl shadow-2xl hover:bg-blue-700 transition-all transform hover:scale-105"
              >
                Book This Route Now
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12">
              
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  About This Route
                </h2>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  Our professional private shuttle service from {routeInfo.from} to {routeInfo.to} offers 
                  comfortable, safe, and reliable door-to-door transportation. Perfect for families, groups, 
                  or anyone seeking a stress-free travel experience across Costa Rica.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  The journey takes approximately {routeData.duracion} and covers {routeData.kilometros} km 
                  through some of Costa Rica&apos;s most beautiful landscapes. We include a complimentary 1-hour 
                  stop for photos, bathroom breaks, or snacks along the way.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  What&apos;s Included
                </h3>
                <ul className="space-y-4">
                  {[
                    'Door-to-door private service',
                    'Professional licensed driver',
                    'Modern, air-conditioned vehicle',
                    '1-hour complimentary stop',
                    'Luggage assistance',
                    'Child seats available (free)',
                    'Flight monitoring (airport pickups)',
                    '24/7 customer support'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Transparent Pricing
            </h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { capacity: '1-6 passengers', price: routeData.precio1a6 },
                { capacity: '7-9 passengers', price: routeData.precio7a9 },
                { capacity: '10-12 passengers', price: routeData.precio10a12 },
                { capacity: '13-18 passengers', price: routeData.precio13a18 },
              ].map((tier, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 transition-colors">
                  <p className="text-gray-600 mb-2">{tier.capacity}</p>
                  <p className="text-4xl font-bold text-gray-900">${tier.price}</p>
                  <p className="text-sm text-gray-500 mt-2">per vehicle</p>
                </div>
              ))}
            </div>

            <p className="text-center text-gray-600 mt-8">
              All prices are per vehicle, not per person. Pay once for your entire group!
            </p>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                  <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="text-3xl font-bold text-gray-900">5.0 Rating</p>
                  <p className="text-gray-600">on Google Reviews</p>
                </div>
                
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">ICT Licensed</p>
                  <p className="text-gray-600">#4121-2025</p>
                </div>

                <div className="text-center md:text-right">
                  <p className="text-3xl font-bold text-gray-900">24/7</p>
                  <p className="text-gray-600">Customer Support</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to Book Your Shuttle?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Secure your private shuttle from {routeInfo.from} to {routeInfo.to} now and travel with complete peace of mind
            </p>
            <Link
              href={`/transfers?from=${encodeURIComponent(routeInfo.from)}&to=${encodeURIComponent(routeInfo.to)}`}
              className="inline-flex items-center justify-center px-12 py-4 text-lg font-semibold text-white bg-blue-600 rounded-xl shadow-xl hover:bg-blue-700 hover:shadow-2xl transition-all transform hover:scale-105"
            >
              Book Now
            </Link>
            <p className="text-sm text-gray-600 mt-4">
              Free cancellation up to 48 hours before pickup
            </p>
          </div>
        </section>

        <WhatsAppButton />
      </main>
    </>
  );
}