// src/app/shuttle/[route]/page.tsx
// ✅ UPDATED - Removed 13+ pax tier & Adjusted Grid to 3 columns
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import BookingNavbar from '@/components/booking/BookingNavbar';
import WhatsAppButton from '@/components/WhatsAppButton';
import { createClient } from '@/lib/supabase/server';
import { CheckCircle2, Clock, MapPin, Shield, Users, ArrowRight } from 'lucide-react';

// Definir las rutas populares
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
    return { title: 'Route Not Found' };
  }

  return {
    title: `Private Transfer from ${routeData.from} to ${routeData.to} | Direct Operator`,
    description: `Book your direct private transfer from ${routeData.from} to ${routeData.to}. 100% operated by us. No middlemen, no hidden fees. Licensed by ICT.`,
    keywords: [
      `${routeData.from} to ${routeData.to} private transfer`,
      `taxi ${routeData.from} ${routeData.to}`,
      `transportation ${routeData.from}`,
      'Costa Rica private driver',
      'direct transport Costa Rica'
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

  if (error || !data) return null;
  return data;
}

export default async function ShuttleRoutePage({ params }: { params: { route: string } }) {
  const routeInfo = POPULAR_ROUTES.find(r => r.slug === params.route);
  if (!routeInfo) notFound();

  const routeData = await getRouteData(routeInfo.from, routeInfo.to);
  if (!routeData) notFound();

  // ✅ CHANGE 1: Removed precio13a18 from calculation
  const minPrice = Math.min(
    routeData.precio1a6 || Infinity,
    routeData.precio7a9 || Infinity,
    routeData.precio10a12 || Infinity
  );

  return (
    <>
      <BookingNavbar />
      
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] max-h-[700px]">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/aerial-view-conchal-beach.webp?width=1600&quality=70"
              alt={`Private Transfer from ${routeInfo.from} to ${routeInfo.to}`}
              fill
              sizes="100vw"
              className="object-cover"
              priority
              quality={70}
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>

          <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
            <div className="text-center max-w-5xl">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl">
                {routeInfo.from} <span className="text-blue-400">to</span> {routeInfo.to}
              </h1>
              
              <p className="text-xl sm:text-2xl text-white/95 mb-8 drop-shadow-lg font-medium">
                100% Private. Operated by Us.
              </p>

              <div className="flex-wrap items-center justify-center gap-6 mb-10 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 inline-flex">
                <div className="flex items-center gap-3 text-white px-4">
                  <Clock className="h-5 w-5 text-blue-300" />
                  <div className="text-left">
                    <p className="text-xs text-blue-200 uppercase font-bold tracking-wider">Est. Time</p>
                    <p className="text-lg font-bold leading-none">{routeData.duracion}</p>
                  </div>
                </div>
                
                <div className="w-px h-10 bg-white/20 hidden sm:block" />
                
                <div className="flex items-center gap-3 text-white px-4">
                  <MapPin className="h-5 w-5 text-blue-300" />
                  <div className="text-left">
                    <p className="text-xs text-blue-200 uppercase font-bold tracking-wider">Distance</p>
                    <p className="text-lg font-bold leading-none">{routeData.kilometros} km</p>
                  </div>
                </div>

                <div className="w-px h-10 bg-white/20 hidden sm:block" />

                <div className="flex items-center gap-3 text-white px-4">
                  <div className="text-left">
                    <p className="text-xs text-blue-200 uppercase font-bold tracking-wider">Per Vehicle</p>
                    <p className="text-2xl font-black leading-none">${minPrice}</p>
                  </div>
                </div>
              </div>

              <Link
                href={`/transfers?from=${encodeURIComponent(routeInfo.from)}&to=${encodeURIComponent(routeInfo.to)}`}
                className="inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-gray-900 bg-white rounded-xl shadow-xl hover:scale-105 transition-all"
              >
                Reserve This Route
              </Link>
            </div>
          </div>
        </section>

        {/* Content Split */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-16 items-start">
              
              {/* Left Column: The Human Description */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  The Drive
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  This isn't just a transfer; it's a {routeData.duracion} drive through some of Costa Rica's most beautiful landscapes. 
                </p>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  <strong>We drive this route daily.</strong> We know exactly how to navigate the winding roads and where the best spots are to stretch your legs. Since this is a private service, you are welcome to ask your driver to stop for photos, fruit stands, or a quick bathroom break at any time.
                </p>

                <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl">
                  <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Direct Operator Guarantee
                  </h3>
                  <p className="text-blue-800 text-sm">
                    You are booking directly with <strong>Can't Wait Travel CR</strong> (License #4121-2025). No third-party agencies, no "middleman" markups.
                  </p>
                </div>
              </div>

              {/* Right Column: What's Included */}
              <div className="bg-gray-50 p-10 rounded-3xl border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">
                  What's Included
                </h3>
                <ul className="space-y-5">
                  {[
                    'Private vehicle (Just your group)',
                    'English-speaking local driver',
                    'Door-to-door service',
                    '1-hour complimentary stop',
                    'Luggage assistance',
                    'Free child seats (on request)',
                    'Waze/Google Maps navigation',
                    'A/C & Comfortable seating'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-4">
                      <div className="bg-white p-1 rounded-full shadow-sm mt-0.5">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      </div>
                      <span className="text-gray-700 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-20 bg-gray-50 border-t border-gray-200">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                One Price per Vehicle
              </h2>
              <p className="text-gray-600">
                Total cost for the whole van. No per-person fees.
              </p>
            </div>
            
            {/* ✅ CHANGE 2: Grid changed to lg:grid-cols-3 and removed 4th item */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {[
                { capacity: '1-6 Pass.', price: routeData.precio1a6, icon: <Users className="h-6 w-6" /> },
                { capacity: '7-9 Pass.', price: routeData.precio7a9, icon: <Users className="h-6 w-6" /> },
                { capacity: '10-12 Pass.', price: routeData.precio10a12, icon: <Users className="h-6 w-6" /> },
              ].map((tier, index) => (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center border border-gray-100">
                  <div className="flex justify-center text-blue-600 mb-4">{tier.icon}</div>
                  <p className="text-gray-500 font-medium mb-2">{tier.capacity}</p>
                  <p className="text-4xl font-black text-gray-900 tracking-tight">${tier.price}</p>
                  <p className="text-xs text-gray-400 mt-2 uppercase tracking-wide">Total</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="bg-gray-900 rounded-3xl p-12 text-center text-white shadow-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to ride?
              </h2>
              <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
                Secure your vehicle directly with us. No agents, no complexity.
              </p>
              <Link
                href={`/transfers?from=${encodeURIComponent(routeInfo.from)}&to=${encodeURIComponent(routeInfo.to)}`}
                className="inline-flex items-center justify-center gap-3 px-10 py-4 text-lg font-bold text-gray-900 bg-white rounded-xl shadow-lg hover:scale-105 transition-all"
              >
                Reserve Now
                <ArrowRight className="h-5 w-5" />
              </Link>
              <p className="text-gray-500 mt-6 text-sm">
                 No Charge Cancellations up to 48 hours
              </p>
            </div>
          </div>
        </section>

        <WhatsAppButton />
      </main>
    </>
  );
}