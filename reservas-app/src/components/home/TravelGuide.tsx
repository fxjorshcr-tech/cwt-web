// src/components/home/TravelGuide.tsx
// SEO OPTIMIZED - Preguntas como texto visual, no clickeables

'use client';

import { MapPin, Mountain, Waves, Trees, Camera, ArrowRight, Clock, Shield, Calendar, Navigation } from 'lucide-react';
import Link from 'next/link';

export default function TravelGuide() {
  const topDestinations = [
    { icon: Mountain, name: 'Arenal', color: 'from-blue-500 to-blue-600' },
    { icon: Waves, name: 'Beaches', color: 'from-orange-500 to-orange-600' },
    { icon: Trees, name: 'Forests', color: 'from-green-500 to-green-600' },
    { icon: Camera, name: 'Wildlife', color: 'from-purple-500 to-purple-600' },
  ];

  const travelQuestions = [
    { icon: Mountain, question: 'What to do in La Fortuna?', emoji: '🏔️' },
    { icon: Navigation, question: 'How to get to Monteverde?', emoji: '🚐' },
    { icon: Calendar, question: 'Best time to visit Costa Rica?', emoji: '📅' },
    { icon: Waves, question: 'Best beaches in Guanacaste?', emoji: '🏖️' },
    { icon: Clock, question: 'How many days in Manuel Antonio?', emoji: '⏰' },
    { icon: Shield, question: 'Is Costa Rica safe for tourists?', emoji: '🛡️' },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        
        {/* Header with SEO content */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Complete Costa Rica Travel Guide
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed">
            Planning your Costa Rica trip? Get insider tips from locals on what to do, 
            where to stay, how to get around, and when to visit Costa Rica's top destinations
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-200 overflow-hidden">
          
          {/* Top Destinations Icons */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 p-4 sm:p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-b-2 border-gray-200">
            {topDestinations.map((dest, idx) => (
              <div key={idx} className="text-center group">
                <div className={`mx-auto mb-2 h-12 w-12 sm:h-16 sm:w-16 bg-gradient-to-br ${dest.color} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <dest.icon className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                </div>
                <p className="text-xs sm:text-sm font-bold text-gray-700">
                  {dest.name}
                </p>
              </div>
            ))}
          </div>

          {/* Content Section */}
          <div className="p-6 sm:p-8">
            {/* Popular Questions - VISUAL ONLY (not clickable) */}
            <div className="mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
                Everything You Need to Plan Your Trip
              </h3>
              
              <div className="grid sm:grid-cols-2 gap-3">
                {travelQuestions.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl"
                  >
                    <span className="text-2xl flex-shrink-0">{item.emoji}</span>
                    <p className="text-sm sm:text-base font-semibold text-gray-700 leading-tight">
                      {item.question}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t-2 border-gray-200 my-6"></div>

            {/* Bottom Info */}
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                Comprehensive Destination Guides
              </h3>
              <p className="text-gray-600 text-sm sm:text-base mb-6 leading-relaxed">
                Detailed guides covering activities, hotels, transportation, safety tips, 
                best times to visit, and local customs for every major Costa Rica destination
              </p>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-3 sm:gap-4 mb-8">
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-2xl sm:text-3xl font-bold text-blue-600">20+</p>
                  <p className="text-xs sm:text-sm text-gray-700 font-medium">Destinations</p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200">
                  <p className="text-2xl sm:text-3xl font-bold text-indigo-600">100+</p>
                  <p className="text-xs sm:text-sm text-gray-700 font-medium">Local Tips</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-xl border border-orange-200">
                  <p className="text-2xl sm:text-3xl font-bold text-orange-600">50+</p>
                  <p className="text-xs sm:text-sm text-gray-700 font-medium">Activities</p>
                </div>
                <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">Free</p>
                  <p className="text-xs sm:text-sm text-gray-700 font-medium">All Access</p>
                </div>
              </div>

              {/* CTA Button - SOLO ESTE ES CLICKEABLE */}
              <Link href="/travel-guide">
                <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-sm sm:text-base">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Explore Complete Travel Guides</span>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* SEO-rich bottom text */}
        <div className="mt-8 text-center">
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-3xl mx-auto">
            From San José to La Fortuna, Liberia Airport to Tamarindo, Manuel Antonio to Monteverde—
            our comprehensive Costa Rica travel guides cover everything you need for an unforgettable trip
          </p>
        </div>
      </div>
    </section>
  );
}