// src/components/home/ValueProposition.tsx
// Reformatted routes section + guarantees (removed "Why Choose Us" redundancy)

'use client';

import {
  CheckCircle,
  MapPin,
  ArrowRight
} from 'lucide-react';

export default function ValueProposition() {
  // Popular routes organized by region
  const routes = [
    {
      region: 'From San José (SJO) Airport',
      destinations: [
        { name: 'La Fortuna / Arenal', time: '3 hours', price: 'from $120' },
        { name: 'Manuel Antonio', time: '3.5 hours', price: 'from $140' },
        { name: 'Monteverde', time: '4 hours', price: 'from $150' },
        { name: 'Puerto Viejo', time: '4 hours', price: 'from $150' },
        { name: 'Tamarindo', time: '4.5 hours', price: 'from $180' },
      ],
      color: 'blue'
    },
    {
      region: 'From Liberia (LIR) Airport',
      destinations: [
        { name: 'Tamarindo Beach', time: '1.5 hours', price: 'from $80' },
        { name: 'Papagayo Peninsula', time: '45 min', price: 'from $60' },
        { name: 'Playa Flamingo', time: '1.5 hours', price: 'from $85' },
        { name: 'La Fortuna / Arenal', time: '3 hours', price: 'from $140' },
        { name: 'Monteverde', time: '3 hours', price: 'from $130' },
      ],
      color: 'orange'
    },
    {
      region: 'Popular Inter-City Routes',
      destinations: [
        { name: 'La Fortuna → Monteverde', time: '3.5 hours', price: 'from $100' },
        { name: 'Manuel Antonio → Monteverde', time: '5 hours', price: 'from $180' },
        { name: 'Tamarindo → La Fortuna', time: '4 hours', price: 'from $160' },
        { name: 'San José → Jaco Beach', time: '2 hours', price: 'from $90' },
        { name: 'Any Custom Route', time: 'varies', price: 'contact us' },
      ],
      color: 'blue'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
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

        {/* Routes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {routes.map((region, idx) => (
            <div
              key={idx}
              className={`bg-white border-2 ${
                region.color === 'blue' ? 'border-blue-100' : 'border-orange-100'
              } rounded-xl p-6 hover:shadow-xl transition-all duration-300`}
            >
              {/* Region Header */}
              <div className="mb-5">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-3 ${
                  region.color === 'blue' ? 'bg-blue-500' : 'bg-orange-500'
                }`}>
                  <MapPin className="h-4 w-4 text-white" />
                  <span className="text-white font-bold text-sm">{region.region}</span>
                </div>
              </div>

              {/* Destinations */}
              <div className="space-y-3">
                {region.destinations.map((dest, destIdx) => (
                  <div
                    key={destIdx}
                    className="group flex items-start justify-between gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                  >
                    <div className="flex-1">
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
                  </div>
                ))}
              </div>

              {/* Footer note */}
              <div className="mt-5 pt-5 border-t border-gray-100">
                <p className="text-xs text-gray-600 italic">
                  All prices are per vehicle (up to 10 passengers). Includes all fees, tolls, and taxes.
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Route CTA */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white text-center mb-12">
          <h3 className="text-2xl font-bold mb-3">
            Don't See Your Route?
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            We cover all of Costa Rica! Get a custom quote for any destination - from beaches to mountains, 
            we'll get you there safely and comfortably.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Request Custom Quote
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>

        {/* Guarantees Section */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-3">
                Our Commitments to You
              </h3>
              <p className="text-blue-100 max-w-2xl mx-auto">
                Every Costa Rica private shuttle booking comes with these guarantees for your peace of mind
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-orange-300" />
                <div>
                  <h4 className="font-bold mb-1">On-Time Pickup Guarantee</h4>
                  <p className="text-sm text-blue-100">
                    Your driver will be ready at the scheduled time or you'll receive a discount on your next trip. 
                    We value your time as much as you do.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-orange-300" />
                <div>
                  <h4 className="font-bold mb-1">Clean Vehicle Guarantee</h4>
                  <p className="text-sm text-blue-100">
                    All vehicles thoroughly sanitized before each trip with full A/C, comfortable seating, 
                    and premium amenities for your journey.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-orange-300" />
                <div>
                  <h4 className="font-bold mb-1">English-Speaking Driver</h4>
                  <p className="text-sm text-blue-100">
                    All our drivers are bilingual (English/Spanish) with excellent communication skills 
                    and local expertise to enhance your Costa Rica experience.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-orange-300" />
                <div>
                  <h4 className="font-bold mb-1">Satisfaction Promise</h4>
                  <p className="text-sm text-blue-100">
                    Not satisfied with your service? Contact us within 24 hours and we'll make it right. 
                    Your satisfaction is our priority.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-blue-100">
                * Subject to our{' '}
                <a href="/terms" className="underline hover:text-white">
                  Terms & Conditions
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}