// src/components/home/ValueProposition.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  MapPin,
  ArrowRight,
  CheckCircle,
  Shield,
  Clock,
  Users,
  Award
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

      // Static inter-city routes
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

  // ✅ FIXED: Preload destination in booking form
  const handleRouteClick = (origin: string, destination: string) => {
    if (!origin || !destination) {
      const bookingForm = document.getElementById('booking-form');
      if (bookingForm) {
        bookingForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const url = new URL(window.location.origin);
    url.searchParams.set('origin', origin);
    url.searchParams.set('destination', destination);
    
    window.location.href = url.toString() + '#booking-form';
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
        {/* Popular Routes Section */}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20">
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
                    className="w-full group flex items-start justify-between gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200 cursor-pointer"
                  >
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-blue-600 transition-colors">
                        {dest.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        ⏱️ {dest.time}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-sm font-bold ${
                        region.color === 'blue' ? 'text-blue-600' : 'text-orange-600'
                      }`}>
                        {dest.price}
                      </p>
                      <ArrowRight className="h-3 w-3 text-gray-400 group-hover:text-blue-600 transition-colors ml-auto mt-1" />
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-5 pt-5 border-t border-gray-100">
                <p className="text-xs text-gray-600 italic">
                  All prices are per vehicle (up to 10 passengers). Includes all fees, tolls, and taxes.
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* SERVICE GUARANTEES - CLEAN DESIGN */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
              <Award className="h-4 w-4 text-blue-600" />
              <span className="text-blue-700 font-semibold text-sm uppercase tracking-wide">
                Premium Service Standard
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Why Choose Can't Wait Travel
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every shuttle booking comes with these guarantees for your complete peace of mind
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="h-1 bg-blue-500"></div>
              <div className="p-6">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <CheckCircle className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  On-Time Pickup Guarantee
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Your driver will be ready at the scheduled time or you'll receive a discount on your next trip. 
                  We value your time as much as you do.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="h-1 bg-orange-500"></div>
              <div className="p-6">
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="h-7 w-7 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Clean Vehicle Guarantee
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  All vehicles thoroughly sanitized before each trip with full A/C, comfortable seating, 
                  and premium amenities for your journey.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="h-1 bg-green-500"></div>
              <div className="p-6">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <Users className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  English-Speaking Driver
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  All our drivers are bilingual (English/Spanish) with excellent communication skills 
                  and local expertise to enhance your Costa Rica experience.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="h-1 bg-purple-500"></div>
              <div className="p-6">
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <Award className="h-7 w-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Satisfaction Promise
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Not satisfied with your service? Contact us within 24 hours and we'll make it right. 
                  Your satisfaction is our priority.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              * Subject to our{' '}
              <a href="/terms" className="underline hover:text-gray-700 font-semibold transition-colors">
                Terms & Conditions
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}