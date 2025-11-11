// src/components/home/PrivateTours.tsx
// FINAL - Cards con imágenes, sin sección "Why Book", solo botón

'use client';

import { Mountain, Flame, Droplets, Trees, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import Image from 'next/image';

export default function PrivateTours() {
  const laFortunaTours = [
    {
      icon: Mountain,
      title: 'Arenal Volcano Hiking Tour',
      description: 'Hike the ancient lava trails of Arenal Volcano with expert naturalist guides. Learn about the 1968 eruption, spot wildlife, and enjoy breathtaking views.',
      price: 'From $95',
      duration: 'Half day (4-5 hours)',
      image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/aerial-view-conchal-beach.webp',
      highlights: ['Expert local guide', 'Wildlife spotting', 'Volcano history']
    },
    {
      icon: Flame,
      title: 'Hot Springs & Waterfalls',
      description: 'Relax in natural hot springs heated by Arenal Volcano, then cool off at the stunning La Fortuna Waterfall. Perfect combination of relaxation and adventure.',
      price: 'From $110',
      duration: 'Full day (6-8 hours)',
      image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/private-shuttle-costa-rica-service.WEBP',
      highlights: ['Natural hot springs', 'Waterfall swim', 'Lunch included']
    },
    {
      icon: Droplets,
      title: 'Rio Celeste & Tenorio Park',
      description: 'Discover the magical turquoise waters of Rio Celeste. Hike through pristine rainforest to waterfalls and volcanic hot springs.',
      price: 'From $125',
      duration: 'Full day (8-10 hours)',
      image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/aerial-view-conchal-beach.webp',
      highlights: ['Rio Celeste waterfall', 'Rainforest hike', 'Blue lagoon']
    },
    {
      icon: Trees,
      title: 'Hanging Bridges & Wildlife',
      description: 'Walk among the rainforest canopy on suspended bridges up to 150 feet high. Spot sloths, toucans, and monkeys with expert guides.',
      price: 'From $85',
      duration: 'Half day (3-4 hours)',
      image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/private-shuttle-costa-rica-service.WEBP',
      highlights: ['Hanging bridges', 'Wildlife viewing', 'Professional photos']
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-orange-100 border border-orange-200 rounded-full mb-6">
            <Mountain className="h-5 w-5 text-orange-600" />
            <span className="text-orange-700 font-bold text-sm uppercase tracking-wide">
              We Operate These Tours Directly
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Best Private Tours in La Fortuna, Arenal
          </h2>
          
          <p className="text-gray-600 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed mb-8">
            Created and operated by us—no third-party reselling. Our expert local guides bring 
            La Fortuna's natural wonders to life with personalized, small-group experiences.
          </p>

          {/* Why Our Tours - Compact */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm sm:text-base font-semibold text-gray-700">100% Operated by Us</span>
            </div>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <span className="text-sm sm:text-base font-semibold text-gray-700">Expert Local Guides</span>
            </div>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-orange-600" />
              <span className="text-sm sm:text-base font-semibold text-gray-700">Small Groups (Max 6)</span>
            </div>
          </div>
        </div>

        {/* Tours Grid - CARDS WITH IMAGES */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {laFortunaTours.map((tour, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-blue-400 hover:shadow-2xl transition-all"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={tour.image}
                  alt={tour.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  loading="lazy"
                  quality={80}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                
                {/* Icon badge */}
                <div className="absolute top-4 left-4">
                  <div className="w-12 h-12 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                    <tour.icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>

                {/* Duration badge */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <span className="text-xs font-semibold text-gray-700">{tour.duration}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Title */}
                <h3 className="font-bold text-gray-900 text-lg mb-2 leading-tight">
                  {tour.title}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-700 mb-4 leading-relaxed line-clamp-3">
                  {tour.description}
                </p>

                {/* Highlights */}
                <div className="mb-4 space-y-1.5">
                  {tour.highlights.map((highlight, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                      <span className="text-xs text-gray-600">{highlight}</span>
                    </div>
                  ))}
                </div>

                {/* Price & Arrow */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-base font-bold text-blue-600">{tour.price}</span>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button - SOLO ESTE */}
        <div className="text-center">
          <a
            href="/private-tours"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 text-base sm:text-lg"
          >
            Discover All La Fortuna Tours
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
}

// Star component
function Star({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
    </svg>
  );
}