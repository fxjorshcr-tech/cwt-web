// src/components/home/WhyPrivateShuttle.tsx
'use client';

import Image from 'next/image';
import { MapPin, Mountain, Clock, Camera, Award } from 'lucide-react';

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
            Why Choose Private Transportation?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Experience the difference of personalized, stress-free travel across Costa Rica
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* Left Side - Text Content */}
          <div className="order-2 lg:order-1">
            <div className="space-y-6 mb-8">
              {/* Reason 1: Master the Mountain Roads */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Mountain className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">Master the Mountain Roads</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Costa Rica's geography is breathtaking but demanding. Our professional drivers handle the 
                    winding roads, fog, and local traffic patterns, so you can simply relax and enjoy the view 
                    without the stress behind the wheel.
                  </p>
                </div>
              </div>

              {/* Reason 2: Your Schedule, Not Ours */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">Your Schedule, Not Ours</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Forget about waiting for other passengers or strictly fixed timetables. We depart exactly 
                    when you want. Direct, door-to-door service means you maximize your vacation time.
                  </p>
                </div>
              </div>

              {/* Reason 3: Freedom to Explore */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Camera className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">Freedom to Explore</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Want to stop for a photo of a waterfall? Need a quick break for local fruit? Unlike shared buses, 
                    we run on your rhythm. With us, the transfer is part of the adventure.
                  </p>
                </div>
              </div>
            </div>

            {/* About Can't Wait Travel - Updated */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 border-2 border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg sm:text-xl">More Than Just a Ride</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Your Local Transportation Partner</p>
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                Let's be honest: Costa Rica is a paradise, but our roads can be unpredictable. We believe 
                your transfer should be the most relaxing part of your day, not a source of worry.
              </p>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                As <strong>experienced professionals</strong>, we don't just offer a vehicle;
                we offer the certainty that you and your family are in the safest hands possible. We navigate
                the challenges so you don't have to.
              </p>
              
              {/* Quote with Logo */}
              <div className="border-t border-blue-200 pt-4 space-y-3">
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium italic">
                  "For us, driving isn't just a job—it's our way of welcoming you to the Costa Rica we love."
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
                    <Mountain className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
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