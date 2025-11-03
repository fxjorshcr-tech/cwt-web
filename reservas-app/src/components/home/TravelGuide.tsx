// src/components/home/TravelGuide.tsx
// Travel guide section with CTA to guides page

'use client';

import { MapPin, Compass, Camera, Mountain, Waves, Trees, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function TravelGuide() {
  const highlights = [
    {
      icon: Mountain,
      title: 'Arenal Volcano',
      description: 'Hot springs, hiking trails, and stunning views',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Waves,
      title: 'Beach Paradises',
      description: 'Manuel Antonio, Tamarindo, and pristine coastlines',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Trees,
      title: 'Cloud Forests',
      description: 'Monteverde\'s mystical hanging bridges and wildlife',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Camera,
      title: 'Wildlife Spots',
      description: 'Sloths, monkeys, toucans, and exotic creatures',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <Compass className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
              Explore Costa Rica
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Your Complete Costa Rica Travel Guide
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Insider tips, hidden gems, and essential information for the most popular tourist destinations. 
            Let our local expertise guide your perfect Costa Rica adventure.
          </p>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {highlights.map((item, idx) => (
            <div
              key={idx}
              className="group bg-white border-2 border-gray-100 rounded-xl p-6 hover:border-blue-200 hover:shadow-lg transition-all duration-300 text-center"
            >
              <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                <item.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Main CTA Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-orange-400/20 rounded-full translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Left side - Icon and content */}
              <div className="flex-shrink-0">
                <div className="h-24 w-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <MapPin className="h-12 w-12 text-white" />
                </div>
              </div>

              {/* Right side - Text and CTA */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold mb-3">
                  Discover the Best of Costa Rica
                </h3>
                <p className="text-blue-100 mb-6 text-base md:text-lg">
                  Explore detailed guides for every major destination - from adventure activities and best restaurants 
                  to local customs and must-see attractions. Written by locals who know Costa Rica inside and out.
                </p>
                <Link href="/travel-guide">
                  <button className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl">
                    <span>Explore Travel Guides</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </Link>
              </div>
            </div>

            {/* Bottom feature list */}
            <div className="mt-8 pt-8 border-t border-white/20">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold mb-1">20+</p>
                  <p className="text-sm text-blue-100">Destinations Covered</p>
                </div>
                <div>
                  <p className="text-3xl font-bold mb-1">100+</p>
                  <p className="text-sm text-blue-100">Local Tips & Tricks</p>
                </div>
                <div>
                  <p className="text-3xl font-bold mb-1">50+</p>
                  <p className="text-sm text-blue-100">Activity Recommendations</p>
                </div>
                <div>
                  <p className="text-3xl font-bold mb-1">Free</p>
                  <p className="text-sm text-blue-100">All Guides & Info</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick preview cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-900">Getting Around</h4>
            </div>
            <p className="text-sm text-gray-600">
              Transportation options, road conditions, driving tips, and how to navigate between destinations safely.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Camera className="h-5 w-5 text-orange-600" />
              </div>
              <h4 className="font-bold text-gray-900">Must-See Attractions</h4>
            </div>
            <p className="text-sm text-gray-600">
              Top-rated national parks, beaches, waterfalls, and hidden gems that most tourists miss.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Compass className="h-5 w-5 text-green-600" />
              </div>
              <h4 className="font-bold text-gray-900">Local Insights</h4>
            </div>
            <p className="text-sm text-gray-600">
              Best times to visit, weather patterns, packing lists, cultural tips, and insider recommendations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}