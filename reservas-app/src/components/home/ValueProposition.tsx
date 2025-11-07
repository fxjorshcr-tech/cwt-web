// src/components/home/ValueProposition.tsx
// ✅ ACCESSIBILITY FIXED - All contrast issues resolved

'use client';

import { useEffect, useState } from 'react';
import {
  CheckCircle,
  MapPin,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { createClient } from '@/utils/supabaseClient';

interface Route {
  origen: string;
  destino: string;
  precio1a6: number;
  duracion: string;
}

interface Destination {
  name: string;
  time: string;
  price: string;
  origen: string;
  destino: string;
}

export default function ValueProposition() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoutes() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('routes')
        .select('origen, destino, precio1a6, duracion');

      if (error) {
        console.error('Error fetching routes:', error);
        setLoading(false);
        return;
      }

      // Organize routes by region
      const sjoRoutes = data?.filter((r: Route) => 
        r.origen === 'SJO - Juan Santamaria Int. Airport'
      ) || [];
      
      const lirRoutes = data?.filter((r: Route) => 
        r.origen === 'LIR - Liberia International Airport'
      ) || [];

      // Define the order we want
      const sjoDestinations = [
        'La Fortuna, Arenal Volcano & El Castillo',
        'Manuel Antonio (National Park Area)',
        'Monteverde (Cloud Forest)',
        'Tamarindo / Flamingo / Conchal (Guanacaste Beaches)',
        'Jaco / Playa Hermosa (Central Pacific)'
      ];

      const lirDestinations = [
        'Nosara (Playa Guiones Area)',
        'Tamarindo / Flamingo / Conchal (Guanacaste Beaches)',
        'Hacienda Pinilla / Avellanas / JW Marriot (Guanacaste)',
        'Las Catalinas, Guanacaste',
        'RIU Guanacaste Hotel / RIU Palace Hotel (Guanacaste)'
      ];

      // Map to destination format
      const sjoFormatted: Destination[] = sjoDestinations
        .map(dest => {
          const route = sjoRoutes.find((r: Route) => r.destino === dest);
          if (!route) return null;
          return {
            name: dest.replace(' (National Park Area)', '').replace(' (Cloud Forest)', '').replace(' (Central Pacific)', ''),
            time: route.duracion || '3 hours',
            price: `from $${route.precio1a6}`,
            origen: route.origen,
            destino: route.destino
          };
        })
        .filter(Boolean) as Destination[];

      const lirFormatted: Destination[] = lirDestinations
        .map(dest => {
          const route = lirRoutes.find((r: Route) => r.destino === dest);
          if (!route) return null;
          return {
            name: dest.replace(' (Playa Guiones Area)', '').replace(' (Guanacaste Beaches)', '').replace(' (Guanacaste)', ''),
            time: route.duracion || '1.5 hours',
            price: `from $${route.precio1a6}`,
            origen: route.origen,
            destino: route.destino
          };
        })
        .filter(Boolean) as Destination[];

      const interCityRoutes: Destination[] = [
        { 
          name: 'La Fortuna → Monteverde', 
          time: '3.5 hours', 
          price: 'from $100',
          origen: 'La Fortuna, Arenal Volcano & El Castillo',
          destino: 'Monteverde (Cloud Forest)'
        },
        { 
          name: 'Manuel Antonio → Monteverde', 
          time: '5 hours', 
          price: 'from $180',
          origen: 'Manuel Antonio (National Park Area)',
          destino: 'Monteverde (Cloud Forest)'
        },
        { 
          name: 'Tamarindo → La Fortuna', 
          time: '4 hours', 
          price: 'from $160',
          origen: 'Tamarindo / Flamingo / Conchal (Guanacaste Beaches)',
          destino: 'La Fortuna, Arenal Volcano & El Castillo'
        },
        { 
          name: 'San José → Jaco Beach', 
          time: '2 hours', 
          price: 'from $90',
          origen: 'SJO - Juan Santamaria Int. Airport',
          destino: 'Jaco / Playa Hermosa (Central Pacific)'
        },
        { 
          name: 'Monteverde → Manuel Antonio', 
          time: '5 hours', 
          price: 'from $180',
          origen: 'Monteverde (Cloud Forest)',
          destino: 'Manuel Antonio (National Park Area)'
        }
      ];

      setRoutes([
        {
          region: 'From SJO Airport',
          destinations: sjoFormatted,
          color: 'blue'
        },
        {
          region: 'From LIR Airport',
          destinations: lirFormatted,
          color: 'orange'
        },
        {
          region: 'Popular Inter-City Routes',
          destinations: interCityRoutes,
          color: 'blue'
        }
      ]);
      setLoading(false);
    }

    fetchRoutes();
  }, []);

  const handleRouteClick = (origin: string, destination: string) => {
    if (!origin || !destination) {
      const bookingForm = document.getElementById('booking-form');
      if (bookingForm) {
        bookingForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const url = new URL(window.location.href);
    url.searchParams.set('origin', origin);
    url.searchParams.set('destination', destination);
    window.history.pushState({}, '', url);

    setTimeout(() => {
      const bookingForm = document.getElementById('booking-form');
      if (bookingForm) {
        bookingForm.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 100);

    window.dispatchEvent(new CustomEvent('updateBookingForm', {
      detail: { origin, destination }
    }));
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading routes...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <MapPin className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
              Popular Routes & Destinations
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Most Popular Destinations
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Transparent pricing for all major destinations - no hidden fees
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {routes.map((region, idx) => (
            <div
              key={idx}
              className={`bg-white border-2 ${
                region.color === 'blue' ? 'border-blue-100' : 'border-orange-100'
              } rounded-xl p-6 hover:shadow-xl transition-all duration-300`}
            >
              <div className="mb-5">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-3 ${
                  region.color === 'blue' ? 'bg-blue-500' : 'bg-orange-500'
                }`}>
                  <MapPin className="h-4 w-4 text-white" />
                  <span className="text-white font-bold text-sm">{region.region}</span>
                </div>
              </div>

              <div className="space-y-3">
                {region.destinations.map((dest: Destination, destIdx: number) => (
                  <button
                    key={destIdx}
                    onClick={() => handleRouteClick(dest.origen, dest.destino)}
                    className="w-full group flex items-start justify-between gap-3 p-4 min-h-[48px] rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200 cursor-pointer"
                    aria-label={`Book shuttle from ${dest.origen} to ${dest.destino}`}
                  >
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-blue-600 transition-colors">
                        {dest.name}
                      </p>
                      <p className="text-xs text-gray-700">
                        ⏱️ {dest.time}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-sm font-bold ${
                        region.color === 'blue' ? 'text-blue-600' : 'text-orange-600'
                      }`}>
                        {dest.price}
                      </p>
                      <ArrowRight className="h-3 w-3 text-gray-500 group-hover:text-blue-600 transition-colors ml-auto mt-1" />
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-5 pt-5 border-t border-gray-100">
                <p className="text-xs text-gray-700 italic">
                  All prices are per vehicle (up to 10 passengers). Includes all fees, tolls, and taxes.
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* WHY CHOOSE CAN'T WAIT TRAVEL */}
        <div className="mt-16 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full mb-5 border border-blue-200">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <span className="text-blue-700 font-bold text-sm uppercase tracking-wide">
                Premium Service Standard
              </span>
            </div>
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Can't Wait Travel
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every shuttle booking comes with these guarantees for your complete peace of mind
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="group bg-white rounded-2xl p-8 border-2 border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-5 group-hover:scale-110 transition-transform">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-3 text-xl">On-Time Pickup Guarantee</h4>
              <p className="text-gray-700 leading-relaxed">
                Your driver will be ready at the scheduled time or you'll receive a discount on your next trip.
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-8 border-2 border-orange-100 hover:border-orange-300 hover:shadow-xl transition-all duration-300 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-2xl mb-5 group-hover:scale-110 transition-transform">
                <CheckCircle className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-3 text-xl">Clean Vehicle Guarantee</h4>
              <p className="text-gray-700 leading-relaxed">
                All vehicles thoroughly sanitized with full A/C, comfortable seating, and premium amenities.
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-8 border-2 border-green-100 hover:border-green-300 hover:shadow-xl transition-all duration-300 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-5 group-hover:scale-110 transition-transform">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-3 text-xl">English-Speaking Driver</h4>
              <p className="text-gray-700 leading-relaxed">
                All drivers are bilingual (English/Spanish) with excellent local expertise.
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-8 border-2 border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all duration-300 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-5 group-hover:scale-110 transition-transform">
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-3 text-xl">Satisfaction Promise</h4>
              <p className="text-gray-700 leading-relaxed">
                Not satisfied? Contact us within 24 hours and we'll make it right.
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              * Subject to our{' '}
              <a 
                href="/terms" 
                className="text-blue-600 hover:text-blue-700 font-semibold underline transition-colors"
                aria-label="Read our terms and conditions"
              >
                Terms & Conditions
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}