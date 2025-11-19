// src/app/transfers/page.tsx
// ✅ UPDATED - Clean professional design, no excessive colors
'use client';

import { Suspense, useState, useEffect } from "react";
import Image from "next/image";
import { BookingFormWrapper } from '@/components/forms/BookingFormWrapper';
import BookingNavbar from '@/components/booking/BookingNavbar';
import BookingSteps from '@/components/booking/BookingSteps';
import PaymentMethods from '@/components/sections/PaymentMethods';
import WhatsAppButton from "@/components/WhatsAppButton";
import { CheckCircle2, Shield, Clock, Users } from 'lucide-react';

export default function TransfersPage() {
  const [isPageReady, setIsPageReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageReady(true);
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <BookingNavbar />
      
      <main className="min-h-screen bg-white">

        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px]">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/aerial-view-conchal-beach.webp?width=1600&quality=70"
              alt="Costa Rica Private Shuttle Transfers"
              fill
              sizes="100vw"
              className="object-cover"
              priority
              quality={70}
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>

          <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
            <div className="text-center max-w-4xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-2xl leading-tight">
                Private Shuttle Transfers
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl text-white/95 mb-8 drop-shadow-lg max-w-3xl mx-auto">
                Professional door-to-door transportation across Costa Rica
              </p>

              <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
                <div className="flex items-center gap-2 text-white">
                  <div className="h-10 w-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">Licensed & Insured</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <div className="h-10 w-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">Professional Drivers</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <div className="h-10 w-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Booking Form */}
        <section id="booking-form" className="relative -mt-20 z-20 px-6 pb-20">
          <div 
            className={`transition-opacity duration-500 ${
              isPageReady ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <BookingFormWrapper />
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="relative py-16 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-200/20 rounded-full blur-3xl" />
          
          <div className="container relative mx-auto px-6 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Our Service
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Professional transportation with your comfort and safety as our priority
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white rounded-2xl p-8 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all group">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Licensed & Certified</h3>
                <p className="text-gray-600 leading-relaxed">
                  All our drivers are licensed by the Costa Rican Tourism Board (ICT License #4121-2025) 
                  and fully insured for your peace of mind.
                </p>
                {/* Bottom accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-b-2xl" />
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-2xl p-8 border-2 border-green-200 shadow-lg hover:shadow-xl transition-all group">
                <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Modern Fleet</h3>
                <p className="text-gray-600 leading-relaxed">
                  Travel in comfort with our well-maintained, air-conditioned vehicles. 
                  All vehicles are regularly inspected and equipped with safety features.
                </p>
                {/* Bottom accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-b-2xl" />
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-2xl p-8 border-2 border-orange-200 shadow-lg hover:shadow-xl transition-all group">
                <div className="h-12 w-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Reliable Service</h3>
                <p className="text-gray-600 leading-relaxed">
                  Punctual pickups, flight tracking for airport transfers, and 24/7 customer 
                  support to assist you throughout your journey.
                </p>
                {/* Bottom accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-b-2xl" />
              </div>
            </div>
          </div>
        </section>

        {/* Booking Steps */}
        <BookingSteps />

        {/* Payment Methods */}
        <PaymentMethods />

        {/* CTA Final */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="bg-gray-900 rounded-3xl p-12 text-center text-white relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
              
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Book Your Transfer?
                </h2>
                <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                  Secure your private shuttle now and travel with peace of mind across Costa Rica
                </p>
                <button
                  onClick={() => {
                    const element = document.getElementById('booking-form');
                    if (element) {
                      element.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'center'
                      });
                    }
                  }}
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-900 bg-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  Book Your Transfer Now
                </button>
                <p className="text-sm text-gray-400 mt-6">
                  Free cancellation up to 48 hours before pickup • Instant confirmation
                </p>
              </div>
            </div>
          </div>
        </section>

        <WhatsAppButton />
      </main>
    </>
  );
}