// src/components/home/VisualProof.tsx
// Photo gallery showcasing vehicles and services - FIXED with Supabase images only

'use client';

import Image from 'next/image';
import { CheckCircle } from 'lucide-react';

export default function VisualProof() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            See Our Fleet & Service
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Modern, comfortable vehicles ready to take you anywhere in Costa Rica
          </p>
        </div>

        {/* Single Large Image - Your Bus */}
        <div className="mb-12">
          <div className="relative group overflow-hidden rounded-2xl shadow-2xl max-w-5xl mx-auto">
            <div className="relative h-[500px]">
              <Image
                src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/New-bus-costarica.webp"
                alt="Modern air-conditioned van for Costa Rica private shuttle service"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 80vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-3xl font-bold mb-3">Our Modern Fleet</h3>
                <p className="text-lg text-white/90 mb-4">
                  Spacious, air-conditioned vans with comfortable seating for up to 10 passengers
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">Full A/C</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">Free WiFi</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">Bottled Water</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">Extra Luggage Space</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Feature 1 */}
          <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Professional Service
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Licensed bilingual drivers with extensive knowledge of Costa Rica's roads and destinations. 
                  Background checked and professionally trained for your safety and comfort.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-gradient-to-br from-orange-50 to-white border-2 border-orange-100 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Airport Meet & Greet
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Your driver will be waiting at arrivals with a personalized sign. 
                  We monitor flight times and adjust pickup automatically for delays.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Sanitized & Comfortable
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Every vehicle is thoroughly cleaned and sanitized before each trip. 
                  Comfortable reclining seats and ample legroom for long journeys.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="bg-gradient-to-br from-orange-50 to-white border-2 border-orange-100 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  All Equipment Included
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Free child seats, booster seats, and extra storage for surfboards, golf clubs, 
                  and oversized luggage. Just let us know what you need.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Bar */}
        <div className="bg-gray-900 text-white rounded-2xl p-8">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-4xl font-bold text-blue-400 mb-2">10+</p>
              <p className="text-gray-300">Passengers Capacity</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-orange-400 mb-2">100%</p>
              <p className="text-gray-300">Vehicles with A/C</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-400 mb-2">5★</p>
              <p className="text-gray-300">Rated Service</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}