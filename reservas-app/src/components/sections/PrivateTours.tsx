// src/components/home/PrivateTours.tsx
'use client';

import { Mountain, Droplets, Trees, ArrowRight, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function PrivateTours() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-orange-100 border border-orange-200 rounded-full mb-6">
            <Mountain className="h-5 w-5 text-orange-600" />
            <span className="text-orange-700 font-bold text-sm uppercase tracking-wide">
              📍 DEPARTING FROM LA FORTUNA
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Signature Private Adventures
          </h2>
          
          <p className="text-gray-600 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed mb-8">
            Authentic experiences created by Can't Wait Travel CR. Just you, our expert guides, and the magic of the rainforest.
          </p>

          {/* Why Our Tours */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              <span className="text-xs sm:text-base font-semibold text-gray-700">100% Operated by Us</span>
            </div>
            <span className="text-gray-300 hidden sm:inline">•</span>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              <span className="text-xs sm:text-base font-semibold text-gray-700">Expert Local Guides</span>
            </div>
            <span className="text-gray-300 hidden sm:inline">•</span>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
              <span className="text-xs sm:text-base font-semibold text-gray-700">Private Groups Only</span>
            </div>
          </div>
        </div>

        {/* Single Hero Image - Volcano - RESPONSIVE */}
        <div className="mb-12">
          <div className="relative h-[350px] sm:h-[450px] md:h-[500px] lg:h-[600px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/arenal-volcano-tour-visit.webp"
              alt="Arenal Volcano Tours - La Fortuna Costa Rica"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
              loading="lazy"
              quality={85}
            />
            {/* Gradient overlay más fuerte en mobile */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 sm:from-black/60 sm:via-black/20 sm:to-transparent"></div>
            
            {/* Text Overlay - RESPONSIVE */}
            <div className="absolute inset-0 flex flex-col items-center justify-end sm:justify-center text-center px-4 sm:px-6 pb-8 sm:pb-0">
              <div className="max-w-3xl">
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 drop-shadow-2xl leading-tight">
                  Explore La Fortuna's Natural Wonders
                </h3>
                <p className="text-sm sm:text-lg md:text-xl text-white/95 mb-4 sm:mb-6 drop-shadow-lg leading-relaxed">
                  Volcanoes, waterfalls, hanging bridges, hot springs, and pristine rainforests
                </p>
                
                {/* Icons - Stack on mobile, row on desktop */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-2 sm:gap-4 text-white/90 text-xs sm:text-base">
                  <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Mountain className="h-4 w-4 sm:h-5 sm:w-5" />
                    Half-Day Tours
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Droplets className="h-4 w-4 sm:h-5 sm:w-5" />
                    Full-Day Adventures
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Trees className="h-4 w-4 sm:h-5 sm:w-5" />
                    Wildlife & Nature
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link
            href="/private-tours"
            className="inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base lg:text-lg"
          >
            Discover All La Fortuna Tours
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}