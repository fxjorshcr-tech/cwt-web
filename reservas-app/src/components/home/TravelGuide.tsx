// src/components/home/TravelGuide.tsx
// MOBILE-OPTIMIZED: Ultra compact, single section design

'use client';

import { MapPin, Mountain, Waves, Trees, Camera, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function TravelGuide() {
  const highlights = [
    { icon: Mountain, title: 'Arenal Volcano', color: 'from-blue-500 to-blue-600' },
    { icon: Waves, title: 'Beach Paradises', color: 'from-orange-500 to-orange-600' },
    { icon: Trees, title: 'Cloud Forests', color: 'from-green-500 to-green-600' },
    { icon: Camera, title: 'Wildlife Spots', color: 'from-purple-500 to-purple-600' },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6 max-w-4xl">
        
        {/* Compact Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Your Complete Travel Guide
          </h2>
          <p className="text-gray-600">
            Insider tips and essential information from Costa Rica locals
          </p>
        </div>

        {/* Single Compact Card */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden">
          
          {/* Top: 4 Icons Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
            {highlights.map((item, idx) => (
              <div key={idx} className="text-center">
                <div className={`mx-auto mb-2 h-14 w-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform`}>
                  <item.icon className="h-7 w-7 text-white" />
                </div>
                <p className="text-xs font-semibold text-gray-700">
                  {item.title}
                </p>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t-2 border-gray-200"></div>

          {/* Bottom: Info + CTA */}
          <div className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Discover the Best of Costa Rica
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Explore detailed guides with adventure activities, restaurants, local customs, and must-see attractions.
            </p>
            
            {/* Compact Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div>
                <p className="text-3xl font-bold text-blue-600">20+</p>
                <p className="text-xs text-gray-600">Destinations</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-indigo-600">100+</p>
                <p className="text-xs text-gray-600">Local Tips</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-orange-600">50+</p>
                <p className="text-xs text-gray-600">Activities</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-600">Free</p>
                <p className="text-xs text-gray-600">All Content</p>
              </div>
            </div>

            <Link href="/travel-guide">
              <button className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all">
                <MapPin className="h-5 w-5" />
                <span>Explore Travel Guides</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}