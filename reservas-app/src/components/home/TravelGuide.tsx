// src/components/home/TravelGuide.tsx
'use client';

import { MapPin, Plane, Mountain, Palmtree, Waves, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function TravelGuide() {
  const featuredDestinations = [
    { 
      icon: Plane, 
      name: 'San José (SJO)', 
      zone: 'Airport Gateway',
      color: 'from-blue-500 to-blue-600',
      emoji: '✈️'
    },
    { 
      icon: Mountain, 
      name: 'La Fortuna', 
      zone: 'Volcano & Adventure',
      color: 'from-orange-500 to-orange-600',
      emoji: '🌋'
    },
    { 
      icon: Waves, 
      name: 'Manuel Antonio', 
      zone: 'Beach & Wildlife',
      color: 'from-green-500 to-green-600',
      emoji: '🏖️'
    },
    { 
      icon: Palmtree, 
      name: 'Guanacaste', 
      zone: 'Gold Coast Beaches',
      color: 'from-yellow-500 to-orange-500',
      emoji: '☀️'
    },
  ];

  const guideFeatures = [
    { emoji: '💡', text: 'Insider tips from locals' },
    { emoji: '🚗', text: 'How to get there' },
    { emoji: '🌤️', text: 'Best time to visit' },
    { emoji: '📅', text: 'How many days needed' },
    { emoji: '💰', text: 'Budget-saving tips' },
    { emoji: '⭐', text: 'Top experiences' },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
            <MapPin className="h-4 w-4 text-blue-600" />
            <span className="text-blue-700 font-bold text-sm uppercase tracking-wide">
              Travel Planning Made Easy
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Complete Costa Rica Travel Guide
          </h2>
          
          <p className="text-gray-600 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed">
            Insider guides to 7 destinations covering everything from airports to beaches, 
            volcanoes to cloud forests—all written by locals who actually live here
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-200 overflow-hidden">
          
          {/* Featured Destinations - 4 Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-b-2 border-gray-200">
            {featuredDestinations.map((dest, idx) => (
              <div key={idx} className="group text-center">
                <div className={`mx-auto mb-3 h-16 w-16 bg-gradient-to-br ${dest.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <dest.icon className="h-8 w-8 text-white" />
                </div>
                <p className="font-bold text-gray-900 text-sm mb-1">
                  {dest.name}
                </p>
                <p className="text-xs text-gray-600">
                  {dest.zone}
                </p>
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            
            {/* What's Included */}
            <div className="mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
                Everything You Need to Plan Your Trip
              </h3>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {guideFeatures.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl"
                  >
                    <span className="text-2xl flex-shrink-0">{item.emoji}</span>
                    <p className="text-sm font-semibold text-gray-700">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t-2 border-gray-200 my-6"></div>

            {/* Stats & CTA */}
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                7 Comprehensive Destination Guides
              </h3>
              
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-3xl font-bold text-blue-600">7</p>
                  <p className="text-sm text-gray-700 font-medium">Destinations</p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                  <p className="text-3xl font-bold text-indigo-600">100+</p>
                  <p className="text-sm text-gray-700 font-medium">Local Tips</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                  <p className="text-3xl font-bold text-orange-600">50+</p>
                  <p className="text-sm text-gray-700 font-medium">Experiences</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <p className="text-3xl font-bold text-green-600">Free</p>
                  <p className="text-sm text-gray-700 font-medium">All Access</p>
                </div>
              </div>

              {/* Destination List */}
              <div className="mb-8 text-left max-w-2xl mx-auto">
                <p className="text-sm text-gray-600 leading-relaxed">
                  <span className="font-semibold text-gray-900">Featured destinations:</span> San José Airport (SJO), 
                  Liberia Airport (LIR), La Fortuna/Arenal, Monteverde Cloud Forest, Manuel Antonio, 
                  Guanacaste Beaches (Tamarindo, Conchal, Papagayo), and Puerto Viejo Caribbean Coast
                </p>
              </div>

              {/* CTA Button */}
              <Link href="/travel-guide">
                <button className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                  <MapPin className="h-5 w-5" />
                  <span>Explore Complete Travel Guides</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}