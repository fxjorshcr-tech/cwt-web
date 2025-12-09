// src/app/shuttle/[route]/page.tsx
// ✅ UPDATED - Removed 13+ pax tier & Adjusted Grid to 3 columns
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import BookingNavbar from '@/components/booking/BookingNavbar';
import WhatsAppButton from '@/components/WhatsAppButton';
import { createClient } from '@/lib/supabase/server';
import { CheckCircle2, Clock, MapPin, Shield, Users, ArrowRight, Sparkles, Route, Lightbulb } from 'lucide-react';

// Definir las rutas populares - NOMBRES EXACTOS de la base de datos
const POPULAR_ROUTES = [
  // SJO Airport routes
  { from: 'SJO - Juan Santamaria Int. Airport', to: 'La Fortuna (Arenal)', slug: 'sjo-to-la-fortuna' },
  { from: 'SJO - Juan Santamaria Int. Airport', to: 'Manuel Antonio / Quepos', slug: 'sjo-to-manuel-antonio' },
  { from: 'SJO - Juan Santamaria Int. Airport', to: 'Jaco', slug: 'sjo-to-jaco' },
  { from: 'SJO - Juan Santamaria Int. Airport', to: 'Tamarindo (Guanacaste)', slug: 'sjo-to-tamarindo' },
  { from: 'SJO - Juan Santamaria Int. Airport', to: 'Monteverde (Cloud Forest)', slug: 'sjo-to-monteverde' },
  { from: 'SJO - Juan Santamaria Int. Airport', to: 'Puerto Viejo (Caribbean Coast)', slug: 'sjo-to-puerto-viejo' },
  // La Fortuna routes
  { from: 'La Fortuna (Arenal)', to: 'SJO - Juan Santamaria Int. Airport', slug: 'la-fortuna-to-sjo' },
  { from: 'La Fortuna (Arenal)', to: 'LIR - Liberia Int. Airport', slug: 'la-fortuna-to-lir' },
  { from: 'La Fortuna (Arenal)', to: 'Monteverde (Cloud Forest)', slug: 'la-fortuna-to-monteverde' },
  { from: 'La Fortuna (Arenal)', to: 'Papagayo Peninsula, Guanacaste', slug: 'la-fortuna-to-papagayo' },
  { from: 'La Fortuna (Arenal)', to: 'Tamarindo (Guanacaste)', slug: 'la-fortuna-to-tamarindo' },
  { from: 'La Fortuna (Arenal)', to: 'Flamingo (Guanacaste)', slug: 'la-fortuna-to-flamingo' },
  { from: 'La Fortuna (Arenal)', to: 'Conchal (Guanacaste)', slug: 'la-fortuna-to-conchal' },
  { from: 'La Fortuna (Arenal)', to: 'Manuel Antonio / Quepos', slug: 'la-fortuna-to-manuel-antonio' },
  { from: 'La Fortuna (Arenal)', to: 'Jaco', slug: 'la-fortuna-to-jaco' },
  { from: 'La Fortuna (Arenal)', to: 'Samara / Playa Carrillo (Guanacaste)', slug: 'la-fortuna-to-samara' },
  { from: 'La Fortuna (Arenal)', to: 'Nosara (Playa Guiones Area)', slug: 'la-fortuna-to-nosara' },
  { from: 'La Fortuna (Arenal)', to: 'Puerto Viejo (Caribbean Coast)', slug: 'la-fortuna-to-puerto-viejo' },
  // LIR Airport routes
  { from: 'LIR - Liberia Int. Airport', to: 'Tamarindo (Guanacaste)', slug: 'lir-to-tamarindo' },
  { from: 'LIR - Liberia Int. Airport', to: 'Papagayo Peninsula, Guanacaste', slug: 'lir-to-papagayo' },
  { from: 'LIR - Liberia Int. Airport', to: 'Playas del Coco (Guanacaste)', slug: 'lir-to-playas-del-coco' },
  { from: 'LIR - Liberia Int. Airport', to: 'La Fortuna (Arenal)', slug: 'lir-to-la-fortuna' },
  { from: 'LIR - Liberia Int. Airport', to: 'Nosara (Playa Guiones Area)', slug: 'lir-to-nosara' },
  { from: 'LIR - Liberia Int. Airport', to: 'Santa Teresa (Nicoya Peninsula)', slug: 'lir-to-santa-teresa' },
  { from: 'LIR - Liberia Int. Airport', to: 'Monteverde (Cloud Forest)', slug: 'lir-to-monteverde' },
  { from: 'LIR - Liberia Int. Airport', to: 'Rio Celeste', slug: 'lir-to-rio-celeste' },
  // Manuel Antonio routes
  { from: 'Manuel Antonio / Quepos', to: 'SJO - Juan Santamaria Int. Airport', slug: 'manuel-antonio-to-sjo' },
  // Monteverde routes
  { from: 'Monteverde (Cloud Forest)', to: 'SJO - Juan Santamaria Int. Airport', slug: 'monteverde-to-sjo' },
  { from: 'Monteverde (Cloud Forest)', to: 'Manuel Antonio / Quepos', slug: 'monteverde-to-manuel-antonio' },
  { from: 'Monteverde (Cloud Forest)', to: 'Tamarindo (Guanacaste)', slug: 'monteverde-to-tamarindo' },
  { from: 'Monteverde (Cloud Forest)', to: 'La Fortuna (Arenal)', slug: 'monteverde-to-la-fortuna' },
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

// Extended route type with new description fields
interface RouteData {
  id: number;
  origen: string | null;
  destino: string | null;
  duracion: string | null;
  kilometros: number | null;
  precio1a6: number | null;
  precio7a9: number | null;
  precio10a12: number | null;
  // New fields for route descriptions
  slug?: string | null;
  journey_description?: string | null;
  points_of_interest?: string[] | null;
  road_type?: string | null;
  traveler_tip?: string | null;
}

async function getRouteData(from: string, to: string): Promise<RouteData | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('routes')
    .select('*')
    .ilike('origen', `%${from}%`)
    .ilike('destino', `%${to}%`)
    .single();

  if (error || !data) return null;
  return data as RouteData;
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
      
      <div className="min-h-screen bg-white">
        {/* Hero Section - Simplified */}
        <section className="relative h-[50vh] min-h-[400px] max-h-[500px]">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/aerial-view-conchal-beach.webp"
              alt={`Private Transfer from ${routeInfo.from} to ${routeInfo.to}`}
              fill
              sizes="100vw"
              className="object-cover"
              priority
              
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>

          <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 pt-20 sm:pt-0">
            <div className="text-center max-w-3xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-2xl">
                100% Private. Operated by Us.
              </h1>
              <p className="text-base sm:text-lg text-white/90 drop-shadow-lg">
                Direct transfers across Costa Rica
              </p>
            </div>
          </div>
        </section>

        {/* Route Info Section - Below Hero */}
        <section className="py-12 bg-white border-b border-gray-200">
          <div className="container mx-auto px-6 max-w-4xl">

            {/* Route Display - Same style as listing page */}
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 mb-8 border border-gray-200">
              <div className="space-y-4">
                {/* From Location */}
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2.5 rounded-lg flex-shrink-0 mt-1">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">From</p>
                    <p className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                      {routeInfo.from}
                    </p>
                  </div>
                </div>

                {/* Arrow Separator */}
                <div className="flex items-center justify-center">
                  <div className="bg-gray-200 p-2 rounded-full">
                    <ArrowRight className="h-6 w-6 text-gray-600" />
                  </div>
                </div>

                {/* To Location */}
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2.5 rounded-lg flex-shrink-0 mt-1">
                    <MapPin className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">To</p>
                    <p className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                      {routeInfo.to}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Duration and Price Info */}
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mb-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
                  <Clock className="h-5 w-5" />
                  <span className="text-sm font-semibold uppercase tracking-wider">Duration</span>
                </div>
                <p className="text-xl font-bold text-gray-900">{routeData.duracion}</p>
              </div>

              <div className="w-px h-16 bg-gray-300 hidden sm:block" />

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
                  <Users className="h-5 w-5" />
                  <span className="text-sm font-semibold uppercase tracking-wider">Starting at</span>
                </div>
                <p className="text-3xl font-black text-blue-600">${minPrice}</p>
                <p className="text-xs text-gray-500 mt-1">per vehicle</p>
              </div>
            </div>

            <div className="text-center">
              <Link
                href={`/transfers?from=${encodeURIComponent(routeInfo.from)}&to=${encodeURIComponent(routeInfo.to)}`}
                className="inline-flex items-center justify-center px-8 py-3 text-base font-bold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition-all"
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
              
              {/* Left Column: Enhanced Description */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                  The Journey
                </h2>

                {/* Dynamic description from database */}
                {routeData.journey_description && (
                  <p className="text-base text-gray-700 mb-4 leading-relaxed">
                    {routeData.journey_description}
                  </p>
                )}

                {/* Road type info */}
                {routeData.road_type && (
                  <div className="flex items-start gap-3 mb-4 p-4 bg-gray-50 rounded-xl">
                    <Route className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Road conditions</p>
                      <p className="text-sm text-gray-600">{routeData.road_type}</p>
                    </div>
                  </div>
                )}

                {/* Points of interest */}
                {routeData.points_of_interest && routeData.points_of_interest.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Along the way</p>
                    <div className="flex flex-wrap gap-2">
                      {routeData.points_of_interest.map((point: string, index: number) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                          {point}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Traveler tip */}
                {routeData.traveler_tip && (
                  <div className="flex items-start gap-3 mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <Lightbulb className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-amber-800">Tip</p>
                      <p className="text-sm text-amber-700">{routeData.traveler_tip}</p>
                    </div>
                  </div>
                )}

                {/* Fallback if no dynamic content */}
                {!routeData.journey_description && (
                  <p className="text-base text-gray-700 mb-8 leading-relaxed">
                    This {routeData.duracion} private transfer takes you comfortably from {routeInfo.from} to {routeInfo.to}.
                    Our experienced drivers know the roads well and will ensure a safe, enjoyable journey.
                  </p>
                )}

                <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-xl mb-6">
                  <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Direct Operator Guarantee
                  </h3>
                  <p className="text-blue-800 text-sm leading-relaxed">
                    You are booking directly with <strong>Can't Wait Travel CR</strong> (ICT License #4121-2025). No third-party agencies, no hidden fees, no middleman markups.
                  </p>
                </div>

                {/* Add-ons Promotion */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 p-6 rounded-xl">
                  <h3 className="font-bold text-orange-900 mb-3 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-orange-600" />
                    Enhance Your Transfer
                  </h3>
                  <p className="text-orange-900 text-sm mb-4 leading-relaxed">
                    Make this journey even more special with our exclusive add-ons:
                  </p>
                  <ul className="space-y-2 text-sm text-orange-800">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Flex Protection:</strong> Change pickup time up to 1 hour before departure</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Explorer Upgrade:</strong> Add 3 hours for scenic stops, waterfalls & complimentary cooler</span>
                    </li>
                  </ul>
                  <p className="text-xs text-orange-700 mt-4 italic">
                    Available during booking checkout
                  </p>
                </div>
              </div>

              {/* Right Column: What's Included */}
              <div className="bg-gray-50 p-10 rounded-3xl border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-8">
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
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                One Price per Vehicle
              </h2>
              <p className="text-sm text-gray-600">
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
                  <p className="text-2xl font-black text-gray-900 tracking-tight">${tier.price}</p>
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
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to ride?
              </h2>
              <p className="text-base text-gray-300 mb-8 max-w-xl mx-auto">
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
      </div>
    </>
  );
}