// src/components/home/TrustIndicators.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Clock,
  Award,
  CheckCircle,
  Star,
  ChevronLeft,
  ChevronRight,
  Sparkles
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

  const guarantees = [
    {
      icon: CheckCircle,
      title: 'On-Time Guarantee',
      description: 'Ready at scheduled time or discount on next trip',
      color: 'blue'
    },
    {
      icon: Shield,
      title: 'Clean Vehicles',
      description: 'Sanitized with A/C and premium amenities',
      color: 'orange'
    },
    {
      icon: Users,
      title: 'Bilingual Drivers',
      description: 'English/Spanish with local expertise',
      color: 'green'
    },
    {
      icon: Award,
      title: 'Satisfaction Promise',
      description: 'Contact us within 24hrs, we\'ll make it right',
      color: 'purple'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* SERVICE GUARANTEES - CENTERED & ELEGANT */}
        <div className="mb-20">
          {/* Header */}
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full mb-4 border border-blue-100">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-blue-700 font-bold text-sm">PREMIUM SERVICE</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Your Journey, Our Promise
            </h2>
            <p className="text-lg text-gray-600">
              Every ride comes with guarantees designed for your complete peace of mind
            </p>
          </div>

          {/* Guarantees Grid - Centered & Balanced */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {guarantees.map((item, idx) => {
              const colorClasses = {
                blue: {
                  border: 'border-blue-200',
                  bg: 'bg-blue-50',
                  icon: 'text-blue-600',
                  hover: 'hover:border-blue-300 hover:shadow-blue-100'
                },
                orange: {
                  border: 'border-orange-200',
                  bg: 'bg-orange-50',
                  icon: 'text-orange-600',
                  hover: 'hover:border-orange-300 hover:shadow-orange-100'
                },
                green: {
                  border: 'border-green-200',
                  bg: 'bg-green-50',
                  icon: 'text-green-600',
                  hover: 'hover:border-green-300 hover:shadow-green-100'
                },
                purple: {
                  border: 'border-purple-200',
                  bg: 'bg-purple-50',
                  icon: 'text-purple-600',
                  hover: 'hover:border-purple-300 hover:shadow-purple-100'
                }
              };

              const colors = colorClasses[item.color as keyof typeof colorClasses];

              return (
                <div
                  key={idx}
                  className={`group bg-white rounded-2xl border-2 ${colors.border} ${colors.hover} p-6 transition-all duration-300 hover:shadow-xl text-center`}
                >
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${colors.bg} rounded-2xl mb-4 group-hover:scale-110 transition-transform`}>
                    <item.icon className={`h-8 w-8 ${colors.icon}`} />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Disclaimer */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              * Subject to our{' '}
              <a href="/terms" className="text-blue-600 hover:text-blue-700 font-semibold underline">
                Terms & Conditions
              </a>
            </p>
          </div>
        </div>

        {/* MEET YOUR DRIVERS - Clean Carousel with Photos */}
        <div className="mt-20">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full mb-4 border border-gray-200">
              <Users className="h-4 w-4 text-gray-600" />
              <span className="text-gray-700 font-bold text-sm">PROFESSIONAL TEAM</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Meet Your Expert Drivers
            </h3>
            <p className="text-gray-600">
              ICT certified professionals with extensive local knowledge
            </p>
          </div>

          {/* Carousel Container */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-lg">
              
              {/* Driver Photo Section */}
              <div className="relative h-80 bg-gradient-to-br from-gray-100 to-gray-200">
                {/* Placeholder for real photo - replace with actual image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl mb-4">
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
                <h4 className="text-3xl font-bold text-gray-900 text-center mb-8">
                  {drivers[currentDriver].name}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-100 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Experience</p>
                    <p className="text-base font-bold text-gray-900">{drivers[currentDriver].experience}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Languages</p>
                    <p className="text-base font-bold text-gray-900">{drivers[currentDriver].languages}</p>
                  </div>

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

      </div>
    </section>
  );
}