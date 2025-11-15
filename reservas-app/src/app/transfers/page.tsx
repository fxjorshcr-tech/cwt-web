// src/app/transfers/page.tsx
// ✅ UPDATED - Ahora con BookingSteps y PaymentMethods del home
'use client';

import { Suspense, useState, useEffect } from "react";
import Image from "next/image";
import { BookingFormWrapper } from '@/components/forms/BookingFormWrapper';
import BookingNavbar from '@/components/booking/BookingNavbar';
import BookingSteps from '@/components/booking/BookingSteps';
import PaymentMethods from '@/components/sections/PaymentMethods';
import WhatsAppButton from "@/components/WhatsAppButton";
import { CheckCircle2 } from 'lucide-react';

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

        {/* Compact Hero Section */}
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
              
              <p className="text-base sm:text-lg md:text-xl text-white/95 mb-6 drop-shadow-lg max-w-3xl mx-auto">
                Professional door-to-door transportation across Costa Rica
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6">
                <span className="text-sm sm:text-base md:text-lg font-semibold text-white drop-shadow-2xl flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Licensed Drivers
                </span>
                <span className="text-white text-lg">•</span>
                <span className="text-sm sm:text-base md:text-lg font-semibold text-white drop-shadow-2xl flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Modern Vehicles
                </span>
                <span className="text-white text-lg">•</span>
                <span className="text-sm sm:text-base md:text-lg font-semibold text-white drop-shadow-2xl flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  24/7 Support
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ✅ Booking Form */}
        <section id="booking-form" className="relative -mt-20 z-20 px-6 pb-20">
          <div 
            className={`transition-opacity duration-500 ${
              isPageReady ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <BookingFormWrapper />
          </div>
        </section>

        {/* ✅ NEW - Booking Steps (del home) */}
        <BookingSteps />

        {/* ✅ NEW - Payment Methods (del home) */}
        <PaymentMethods />

        {/* CTA Final */}
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to Book Your Transfer?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
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
              className="inline-flex items-center justify-center px-12 py-4 text-lg font-semibold text-white bg-blue-600 rounded-xl shadow-xl hover:bg-blue-700 hover:shadow-2xl transition-all transform hover:scale-105"
            >
              Book Your Transfer Now
            </button>
            <p className="text-sm text-gray-600 mt-4">
              Free cancellation up to 48 hours before pickup
            </p>
          </div>
        </section>

        <WhatsAppButton />
      </main>
    </>
  );
}