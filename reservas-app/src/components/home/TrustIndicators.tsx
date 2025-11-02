// src/components/home/TrustIndicators.tsx
// Trust badges and certifications - SEO optimized

'use client';

import {
  Shield,
  CheckCircle,
  Award,
  Users,
  Clock,
  Globe,
  BadgeCheck,
  Phone
} from 'lucide-react';

export default function TrustIndicators() {
  const indicators = [
    {
      icon: BadgeCheck,
      title: 'Licensed & Insured',
      description: 'Fully licensed by Costa Rica Tourism Board (ICT) and comprehensively insured for your safety',
      color: 'blue'
    },
    {
      icon: Users,
      title: 'Professional Drivers',
      description: 'Bilingual, certified drivers with background checks and extensive Costa Rica route knowledge',
      color: 'blue'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock WhatsApp and phone support in English and Spanish for any travel concerns',
      color: 'orange'
    },
    {
      icon: Shield,
      title: 'Modern Fleet',
      description: 'Air-conditioned vans and SUVs regularly maintained and sanitized for your comfort',
      color: 'orange'
    },
    {
      icon: Award,
      title: 'Transparent Pricing',
      description: 'No hidden fees or surprise charges - see the complete price before you book your Costa Rica transfer',
      color: 'blue'
    },
    {
      icon: Globe,
      title: 'Trusted Worldwide',
      description: 'Serving travelers from USA, Canada, Europe and beyond with reliable airport and hotel shuttles',
      color: 'orange'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* SEO-Rich Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <Shield className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
              Why Trust Can't Wait Travel Costa Rica
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Your Trusted Costa Rica Transportation Partner
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Professional private shuttle service connecting San José Airport (SJO), Liberia Airport (LIR), 
            and major destinations including La Fortuna, Manuel Antonio, Tamarindo, Monteverde, and more
          </p>
        </div>

        {/* Trust Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {indicators.map((item, idx) => (
            <div
              key={idx}
              className="group bg-white border-2 border-gray-100 rounded-xl p-6 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 h-12 w-12 rounded-xl ${
                  item.color === 'blue' ? 'bg-blue-500' : 'bg-orange-500'
                } flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SEO Content - Routes & Services */}
        <div className="mt-12 bg-gradient-to-br from-gray-50 to-blue-50/30 border border-gray-200 rounded-2xl p-8">
          <div className="prose max-w-none">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Comprehensive Costa Rica Private Shuttle Services
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">🚗 Popular Routes We Cover:</h4>
                <ul className="space-y-1 list-none">
                  <li>✓ San José (SJO) Airport to La Fortuna Arenal</li>
                  <li>✓ Liberia (LIR) Airport to Tamarindo Beach</li>
                  <li>✓ San José to Manuel Antonio National Park</li>
                  <li>✓ Liberia to Papagayo Peninsula resorts</li>
                  <li>✓ La Fortuna to Monteverde Cloud Forest</li>
                  <li>✓ Any Costa Rica destination door-to-door</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">🌟 Our Services Include:</h4>
                <ul className="space-y-1 list-none">
                  <li>✓ Airport pickup with meet & greet service</li>
                  <li>✓ Hotel to hotel private transfers</li>
                  <li>✓ Round-trip shuttle reservations</li>
                  <li>✓ Multi-stop itinerary transportation</li>
                  <li>✓ Large group van rentals (up to 10 passengers)</li>
                  <li>✓ Flight monitoring for delayed arrivals</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white border border-gray-200 rounded-xl">
            <p className="text-3xl font-bold text-blue-600 mb-1">500+</p>
            <p className="text-sm text-gray-600">Transfers This Year</p>
          </div>
          <div className="text-center p-4 bg-white border border-gray-200 rounded-xl">
            <p className="text-3xl font-bold text-orange-600 mb-1">15+</p>
            <p className="text-sm text-gray-600">Countries Served</p>
          </div>
          <div className="text-center p-4 bg-white border border-gray-200 rounded-xl">
            <p className="text-3xl font-bold text-blue-600 mb-1">24/7</p>
            <p className="text-sm text-gray-600">Customer Support</p>
          </div>
          <div className="text-center p-4 bg-white border border-gray-200 rounded-xl">
            <p className="text-3xl font-bold text-orange-600 mb-1">4.9★</p>
            <p className="text-sm text-gray-600">Average Rating</p>
          </div>
        </div>
      </div>
    </section>
  );
}