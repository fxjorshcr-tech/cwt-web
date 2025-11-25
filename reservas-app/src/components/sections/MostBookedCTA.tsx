// src/components/sections/MostBookedCTA.tsx
'use client';

import { ArrowRight, Search, Sparkles, DollarSign } from 'lucide-react';
import Link from 'next/link';

interface Route {
  displayFrom: string;
  displayTo: string;
  slug: string;
  price: number | null;
  duration: string | null;
}

interface MostBookedCTAProps {
  routes: Route[];
}

export default function MostBookedCTA({ routes }: MostBookedCTAProps) {
  const scrollToBooking = () => {
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
      bookingForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="bg-white rounded-3xl p-8 sm:p-12 md:p-16 shadow-2xl hover:shadow-3xl transition-all duration-300">
          
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-lg">
              <Sparkles className="h-4 w-4 text-white" />
              <span className="text-white font-bold text-sm uppercase tracking-wide">
                MOST REQUESTED
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
              Traveler Favorites<br className="hidden sm:block" /> 
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Top Private Connections</span>
            </h2>
            
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From airport arrivals to the majestic Arenal Volcano. Discover the most popular private routes connected by our reliable fleet
            </p>
          </div>

          {/* Routes Section - MAIN FOCUS with SEO links */}
          <div className="mb-10">
            <h3 className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">
              Most Popular Departures
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {routes.map((route, idx) => (
                <Link
                  key={idx}
                  href={`/shuttle/${route.slug}`}
                  className="flex flex-col p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl hover:shadow-lg hover:scale-105 hover:border-blue-400 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="font-bold text-gray-900 text-sm group-hover:text-blue-700 transition-colors">{route.displayFrom}</span>
                      <ArrowRight className="h-4 w-4 text-blue-600 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                      <span className="font-bold text-gray-900 text-sm group-hover:text-blue-700 transition-colors">{route.displayTo}</span>
                    </div>
                  </div>
                  {route.price && (
                    <div className="flex items-center gap-1 text-blue-700 font-bold text-lg">
                      <span className="text-xs text-gray-600">From</span>
                      <DollarSign className="h-4 w-4" />
                      <span>{route.price}</span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Small features - Very subtle */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              Expert Local Drivers
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              100% Private
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
              ICT Certified #4121-2025
            </span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              href="/shuttle"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              View All Destinations
              <ArrowRight className="h-6 w-6" />
            </Link>

            <button
              onClick={scrollToBooking}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 font-bold text-lg rounded-xl hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Search className="h-6 w-6" />
              Search Your Route
            </button>
          </div>

          {/* Footer text */}
          <p className="text-center text-gray-500 text-sm">
            Browse popular routes or search your custom destination
          </p>
        </div>
      </div>
    </section>
  );
}