// src/components/home/TravelGuide.tsx
// REDESIGNED: Clean, elegant, and modern travel guide section

'use client';

import { MapPin, Compass, Camera, Mountain, Waves, Trees, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function TravelGuide() {
  const highlights = [
    {
      icon: Mountain,
      title: 'Arenal Volcano',
      description: 'Hot springs, hiking trails, and stunning views',
      color: 'bg-blue-500',
      lightColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      icon: Waves,
      title: 'Beach Paradises',
      description: 'Manuel Antonio, Tamarindo, and pristine coastlines',
      color: 'bg-orange-500',
      lightColor: 'bg-orange-100',
      textColor: 'text-orange-600'
    },
    {
      icon: Trees,
      title: 'Cloud Forests',
      description: 'Monteverde\'s mystical hanging bridges and wildlife',
      color: 'bg-green-500',
      lightColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      icon: Camera,
      title: 'Wildlife Spots',
      description: 'Sloths, monkeys, toucans, and exotic creatures',
      color: 'bg-purple-500',
      lightColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header - Clean & Centered */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
            <Compass className="h-4 w-4 text-blue-600" />
            <span className="text-blue-700 font-bold text-sm uppercase tracking-wide">
              Explore Costa Rica
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your Complete Travel Guide
          </h2>
          <p className="text-lg text-gray-600">
            Insider tips, hidden gems, and essential information from locals who know Costa Rica inside and out
          </p>
        </div>

        {/* Highlights - Clean Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {highlights.map((item, idx) => (
            <div
              key={idx}
              className="group text-center"
            >
              <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                <item.icon className="h-10 w-10 text-white" />
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

        {/* Main Content - Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          
          {/* Left - Info Cards */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-100">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-2">Getting Around</h4>
                  <p className="text-sm text-gray-600">
                    Transportation options, road conditions, and safe navigation between destinations
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border-2 border-orange-100">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-2">Must-See Attractions</h4>
                  <p className="text-sm text-gray-600">
                    Top-rated parks, beaches, waterfalls, and hidden gems most tourists miss
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-100">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Compass className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-2">Local Insights</h4>
                  <p className="text-sm text-gray-600">
                    Best times to visit, weather patterns, packing lists, and insider tips
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - CTA Card - Clean White Design */}
          <div className="bg-white rounded-3xl p-10 shadow-2xl border-2 border-gray-200">
            <div className="mb-8">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Discover the Best of Costa Rica
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Explore detailed guides for every major destination with adventure activities, best restaurants, 
                local customs, and must-see attractions.
              </p>
            </div>

            {/* Stats Grid - Better Aligned */}
            <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b-2 border-gray-200">
              <div className="text-center">
                <p className="text-5xl font-bold text-blue-600 mb-2">20+</p>
                <p className="text-sm font-semibold text-gray-600">Destinations</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-bold text-blue-600 mb-2">100+</p>
                <p className="text-sm font-semibold text-gray-600">Local Tips</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-bold text-orange-600 mb-2">50+</p>
                <p className="text-sm font-semibold text-gray-600">Activities</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-bold text-green-600 mb-2">Free</p>
                <p className="text-sm font-semibold text-gray-600">All Content</p>
              </div>
            </div>

            {/* CTA Button */}
            <Link href="/travel-guide">
              <button className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-xl">
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