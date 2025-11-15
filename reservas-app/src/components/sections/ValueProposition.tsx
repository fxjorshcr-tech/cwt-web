// src/components/home/ValueProposition.tsx
// ✅ RESPONSIVE - Fixed mobile layout

'use client';

import { MapPin, ArrowRight } from 'lucide-react';

interface Destination {
  name: string;
  time: string;
  price: string;
  origen: string;
  destino: string;
}

// ✅ Static data - no database calls needed
const ROUTES = [
  {
    region: 'From SJO Airport',
    destinations: [
      {
        name: 'La Fortuna, Arenal Volcano',
        time: '3 hours',
        price: 'from $140',
        origen: 'SJO - Juan Santamaria Int. Airport',
        destino: 'La Fortuna, Arenal Volcano & El Castillo'
      },
      {
        name: 'Manuel Antonio',
        time: '3.5 hours',
        price: 'from $160',
        origen: 'SJO - Juan Santamaria Int. Airport',
        destino: 'Manuel Antonio (National Park Area)'
      },
      {
        name: 'Monteverde',
        time: '3 hours',
        price: 'from $150',
        origen: 'SJO - Juan Santamaria Int. Airport',
        destino: 'Monteverde (Cloud Forest)'
      },
      {
        name: 'Tamarindo / Flamingo / Conchal',
        time: '5 hours',
        price: 'from $240',
        origen: 'SJO - Juan Santamaria Int. Airport',
        destino: 'Tamarindo / Flamingo / Conchal (Guanacaste Beaches)'
      },
      {
        name: 'Jaco / Playa Hermosa',
        time: '2 hours',
        price: 'from $90',
        origen: 'SJO - Juan Santamaria Int. Airport',
        destino: 'Jaco / Playa Hermosa (Central Pacific)'
      }
    ],
    color: 'blue'
  },
  {
    region: 'From LIR Airport',
    destinations: [
      {
        name: 'Nosara',
        time: '2.5 hours',
        price: 'from $150',
        origen: 'LIR - Liberia International Airport',
        destino: 'Nosara (Playa Guiones Area)'
      },
      {
        name: 'Tamarindo / Flamingo / Conchal',
        time: '1.5 hours',
        price: 'from $100',
        origen: 'LIR - Liberia International Airport',
        destino: 'Tamarindo / Flamingo / Conchal (Guanacaste Beaches)'
      },
      {
        name: 'Hacienda Pinilla / Avellanas',
        time: '1.5 hours',
        price: 'from $95',
        origen: 'LIR - Liberia International Airport',
        destino: 'Hacienda Pinilla / Avellanas / JW Marriot (Guanacaste)'
      },
      {
        name: 'Las Catalinas',
        time: '1 hour',
        price: 'from $85',
        origen: 'LIR - Liberia International Airport',
        destino: 'Las Catalinas, Guanacaste'
      },
      {
        name: 'RIU Guanacaste Hotel',
        time: '45 min',
        price: 'from $75',
        origen: 'LIR - Liberia International Airport',
        destino: 'RIU Guanacaste Hotel / RIU Palace Hotel (Guanacaste)'
      }
    ],
    color: 'orange'
  },
  {
    region: 'Popular Inter-City Routes',
    destinations: [
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
    ],
    color: 'blue'
  }
];

export default function ValueProposition() {
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

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-gray-50 to-white overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 mb-2 sm:mb-3">
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            <span className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
              Popular Routes & Destinations
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
            Most Popular Destinations
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Choose your destination and see transparent pricing with no hidden fees. 
            All transfers include bilingual drivers, modern vehicles (up to 12 passengers), 
            and door-to-door service with flexible schedules.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {ROUTES.map((region, idx) => (
            <div
              key={idx}
              className={`bg-white border-2 ${
                region.color === 'blue' ? 'border-blue-100' : 'border-orange-100'
              } rounded-xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300`}
            >
              <div className="mb-4 sm:mb-5">
                <div className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg mb-3 ${
                  region.color === 'blue' ? 'bg-blue-500' : 'bg-orange-500'
                }`}>
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  <span className="text-white font-bold text-xs sm:text-sm">{region.region}</span>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                {region.destinations.map((dest: Destination, destIdx: number) => (
                  <button
                    key={destIdx}
                    onClick={() => handleRouteClick(dest.origen, dest.destino)}
                    className="w-full group flex items-start justify-between gap-2 sm:gap-3 p-3 sm:p-4 min-h-[48px] rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200 cursor-pointer"
                    aria-label={`Book shuttle from ${dest.origen} to ${dest.destino}`}
                  >
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-gray-900 text-xs sm:text-sm mb-1 group-hover:text-blue-600 transition-colors leading-tight">
                        {dest.name}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-700">
                        ⏱️ {dest.time}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-xs sm:text-sm font-bold ${
                        region.color === 'blue' ? 'text-blue-600' : 'text-orange-600'
                      }`}>
                        {dest.price}
                      </p>
                      <ArrowRight className="h-3 w-3 text-gray-500 group-hover:text-blue-600 transition-colors ml-auto mt-1" />
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-gray-100">
                <p className="text-[10px] sm:text-xs text-gray-700 italic">
                  Per vehicle (up to 12 passengers). Includes fees, tolls, and taxes.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}