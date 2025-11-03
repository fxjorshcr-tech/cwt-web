// src/components/home/TrustIndicators.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Clock,
  Award,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function TrustIndicators() {
  const [currentDriver, setCurrentDriver] = useState(0);

  const drivers = [
    {
      name: 'Carlos Rodríguez',
      photo: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/driver-1.jpg',
      experience: '8 years',
      languages: 'English, Spanish',
      specialty: 'Airport Transfers'
    },
    {
      name: 'María González',
      photo: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/driver-2.jpg',
      experience: '6 years',
      languages: 'English, Spanish, German',
      specialty: 'Long Distance Routes'
    },
    {
      name: 'José Morales',
      photo: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/driver-3.jpg',
      experience: '10 years',
      languages: 'English, Spanish',
      specialty: 'Beach Destinations'
    },
    {
      name: 'Ana Patricia',
      photo: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/driver-4.jpg',
      experience: '5 years',
      languages: 'English, Spanish, French',
      specialty: 'Monteverde & Cloud Forest'
    }
  ];

  const indicators = [
    {
      icon: Shield,
      title: 'Licensed & Insured',
      description: 'Fully licensed by Costa Rica Tourism Board with comprehensive insurance for your safety.',
      color: 'blue'
    },
    {
      icon: Users,
      title: 'Professional Drivers',
      description: 'Licensed for tourism transportation. Bilingual drivers with background checks and route expertise.',
      color: 'blue'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock WhatsApp and phone support in English and Spanish.',
      color: 'orange'
    },
    {
      icon: Award,
      title: 'Transparent Pricing',
      description: 'No hidden fees or surprises. Complete price shown before booking.',
      color: 'orange'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDriver((prev) => (prev + 1) % drivers.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [drivers.length]);

  const nextDriver = () => {
    setCurrentDriver((prev) => (prev + 1) % drivers.length);
  };

  const prevDriver = () => {
    setCurrentDriver((prev) => (prev - 1 + drivers.length) % drivers.length);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <Shield className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
              Why Trust Us
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Your Trusted Transportation Partner
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Professional shuttle service connecting airports and major Costa Rica destinations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {indicators.map((item, idx) => (
            <div
              key={idx}
              className="group bg-white border-2 border-gray-100 rounded-xl p-6 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className={`flex-shrink-0 h-14 w-14 rounded-xl mb-4 ${
                  item.color === 'blue' ? 'bg-blue-500' : 'bg-orange-500'
                } flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <item.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-orange-50/30 border-2 border-gray-200 rounded-2xl p-8 mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Meet Your Professional Drivers
            </h3>
            <p className="text-sm text-gray-600 max-w-xl mx-auto">
              Certified, bilingual drivers with extensive Costa Rica experience
            </p>
          </div>

          <div className="relative max-w-md mx-auto">
            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="relative h-80 bg-gradient-to-br from-blue-100 to-orange-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Users className="h-32 w-32 text-gray-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-500 text-sm">Driver Photo</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  {drivers[currentDriver].name}
                </h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-semibold text-gray-900">Experience:</span>{' '}
                    {drivers[currentDriver].experience} professional driving
                  </p>
                  <p>
                    <span className="font-semibold text-gray-900">Languages:</span>{' '}
                    {drivers[currentDriver].languages}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-900">Specialty:</span>{' '}
                    {drivers[currentDriver].specialty}
                  </p>
                </div>
              </div>

              <button
                onClick={prevDriver}
                className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
                aria-label="Previous driver"
              >
                <ChevronLeft className="h-5 w-5 text-gray-900" />
              </button>
              <button
                onClick={nextDriver}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
                aria-label="Next driver"
              >
                <ChevronRight className="h-5 w-5 text-gray-900" />
              </button>
            </div>

            <div className="flex justify-center gap-2 mt-6">
              {drivers.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentDriver(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentDriver 
                      ? 'w-8 bg-blue-600' 
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to driver ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-600 italic">
              All drivers licensed for tourism transportation and background-checked
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}