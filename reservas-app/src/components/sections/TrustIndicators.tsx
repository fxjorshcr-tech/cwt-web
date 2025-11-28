// src/components/home/TrustIndicators.tsx
// ONLY DRIVERS - No guarantees section

'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Clock,
  Award,
  Star,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function TrustIndicators() {
  const [currentDriver, setCurrentDriver] = useState(0);

  const drivers = [
    {
      name: 'Carlos Rodríguez',
      experience: '8 years',
      languages: 'English, Spanish',
      specialty: 'Airport Transfers'
    },
    {
      name: 'María González',
      experience: '6 years',
      languages: 'English, Spanish, German',
      specialty: 'Long Distance Routes'
    },
    {
      name: 'José Morales',
      experience: '10 years',
      languages: 'English, Spanish',
      specialty: 'Beach Destinations'
    },
    {
      name: 'Ana Patricia',
      experience: '5 years',
      languages: 'English, Spanish, French',
      specialty: 'Monteverde & Cloud Forest'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDriver((prev) => (prev + 1) % drivers.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [drivers.length]);

  const nextDriver = () => {
    setCurrentDriver((prev) => (prev + 1) % drivers.length);
  };

  const prevDriver = () => {
    setCurrentDriver((prev) => (prev - 1 + drivers.length) % drivers.length);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
            <Users className="h-4 w-4 text-blue-600" />
            <span className="text-blue-700 font-bold text-sm uppercase tracking-wide">
              Our Professional Team
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Meet Your Expert Drivers
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            ICT certified professionals with extensive Costa Rica experience
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-lg">
            
            {/* Driver Photo Section - SQUARE */}
            <div className="relative h-96 bg-gradient-to-br from-gray-100 to-gray-200">
              {/* Placeholder for real photo */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-2xl mb-4">
                    <Users className="h-16 w-16 text-white" />
                  </div>
                  <p className="text-sm text-gray-500 italic">Photo coming soon</p>
                </div>
              </div>
              
              {/* 5 Star Rating Badge */}
              <div className="absolute top-6 right-6 flex items-center gap-1 bg-white px-4 py-2 rounded-full shadow-lg">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>

            {/* Driver Info Section */}
            <div className="p-8">
              <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">
                {drivers[currentDriver].name}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Experience */}
                <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-100 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Experience</p>
                  <p className="text-base font-bold text-gray-900">{drivers[currentDriver].experience}</p>
                </div>

                {/* Languages */}
                <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Languages</p>
                  <p className="text-base font-bold text-gray-900">{drivers[currentDriver].languages}</p>
                </div>

                {/* Specialty */}
                <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-orange-100 flex items-center justify-center">
                    <Award className="h-6 w-6 text-orange-600" />
                  </div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Specialty</p>
                  <p className="text-base font-bold text-gray-900">{drivers[currentDriver].specialty}</p>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevDriver}
              className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-white hover:bg-gray-50 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110 z-10 border-2 border-gray-200"
              aria-label="Previous driver"
            >
              <ChevronLeft className="h-6 w-6 text-gray-900" />
            </button>
            <button
              onClick={nextDriver}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-white hover:bg-gray-50 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110 z-10 border-2 border-gray-200"
              aria-label="Next driver"
            >
              <ChevronRight className="h-6 w-6 text-gray-900" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {drivers.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentDriver(idx)}
                className={`h-2.5 rounded-full transition-all ${
                  idx === currentDriver 
                    ? 'w-10 bg-blue-600' 
                    : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to driver ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}