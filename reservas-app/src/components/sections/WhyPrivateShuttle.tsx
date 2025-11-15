// src/components/home/WhyPrivateShuttle.tsx
'use client';

import Image from 'next/image';
import { MapPin, Mountain, Users, Award, Clock } from 'lucide-react';

export default function WhyPrivateShuttle() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        
        {/* Centered Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
            <MapPin className="h-4 w-4 text-blue-600" />
            <span className="text-blue-700 font-bold text-sm uppercase tracking-wide">
              Local Experts
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Why Private Shuttle?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Experience the difference of personalized, door-to-door Costa Rica transportation
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* Left Side - Text Content */}
          <div className="order-2 lg:order-1">
            <div className="space-y-6 mb-8">
              {/* Reason 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Mountain className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">Navigate Costa Rica with Ease</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Costa Rica's mountain roads and rural routes can be challenging. Our experienced drivers know every turn, 
                    ensuring you arrive safely and comfortably without the stress of navigating unfamiliar terrain.
                  </p>
                </div>
              </div>

              {/* Reason 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">Comfort & Convenience</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Skip the crowded shared shuttles and complicated schedules. Travel on your time, in air-conditioned comfort, 
                    with door-to-door service that lets you relax and enjoy the journey.
                  </p>
                </div>
              </div>

              {/* Reason 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">Flexible & Personalized</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Want to stop at a scenic viewpoint or local fruit stand? Need extra luggage space for surfboards? 
                    With private shuttle, you set the schedule and make the rules. It's your journey, your way.
                  </p>
                </div>
              </div>
            </div>

            {/* About Can't Wait Travel */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 border-2 border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg sm:text-xl">Can't Wait Travel</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Your Local Transportation Partner</p>
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                As lifelong Costa Ricans with over three decades of combined experience in tourism, we've built our business 
                on the foundations of trust, flexibility, and personalized service. Our knowledgeable bilingual drivers and 
                modern, comfortable fleet ensure that every private transfer is seamless, safe, and stress-free.
              </p>
              
              {/* Quote with Logo */}
              <div className="border-t border-blue-200 pt-4 space-y-3">
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium italic">
                  "For us, every trip is a chance to share the Costa Rica we love."
                </p>
                {/* Logo - Responsive */}
                <div className="flex justify-end">
                  <div className="relative w-48 sm:w-64 md:w-80 h-12 sm:h-16 md:h-20">
                    <Image
                      src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/black-cwt-logo-private-shutlle-company.webp"
                      alt="Can't Wait Travel"
                      fill
                      className="object-contain object-right"
                      sizes="(max-width: 640px) 192px, (max-width: 768px) 256px, 320px"
                      loading="lazy"
                      quality={85}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Image - RESPONSIVE FIX */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative h-[400px] sm:h-[500px] lg:h-[700px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              {/* Placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 sm:p-8">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4 sm:mb-6 shadow-2xl">
                    <Users className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
                  </div>
                  <p className="text-gray-600 text-base sm:text-lg font-semibold mb-2">Team Photo Goes Here</p>
                  <p className="text-gray-500 text-xs sm:text-sm max-w-xs mb-4">
                    Replace this placeholder with an actual photo of the Can't Wait Travel team
                  </p>
                  <div className="px-4 sm:px-6 py-2 sm:py-3 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600">
                      Recommended: 800×1000px • JPG or WEBP
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative accents - Hidden on mobile */}
            <div className="hidden lg:block absolute -bottom-6 -right-6 w-24 h-24 bg-orange-500 rounded-full opacity-20 blur-2xl -z-10"></div>
            <div className="hidden lg:block absolute -top-6 -left-6 w-32 h-32 bg-blue-500 rounded-full opacity-20 blur-2xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}