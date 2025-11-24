// src/app/transfers/page.tsx
// ✅ UPDATED - Consistent Colors & Fixed Missing Text
'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { BookingFormWrapper } from '@/components/forms/BookingFormWrapper';
import BookingNavbar from '@/components/booking/BookingNavbar';
import BookingSteps from '@/components/booking/BookingSteps';
import PaymentMethods from '@/components/sections/PaymentMethods';
import WhatsAppButton from "@/components/WhatsAppButton";
import { CheckCircle2, Shield, MapPin, Users } from 'lucide-react'; 

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
              alt="Costa Rica Private Transportation Services"
              fill
              sizes="100vw"
              className="object-cover"
              priority
              quality={70}
            />
            {/* Capa oscura para mejor lectura */}
            <div className="absolute inset-0 bg-black/50" />
            {/* Gradiente sutil azulado en la base para conectar con la marca */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
            <div className="text-center max-w-4xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-xl leading-tight">
                Private Transportation in Costa Rica
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-white/95 mb-8 drop-shadow-md max-w-3xl mx-auto font-medium">
                Direct Operator | Stress-Free Travel
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
                {/* Tags unificados visualmente */}
                <div className="flex items-center gap-2 text-white bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                  <Shield className="h-4 w-4 text-green-400" />
                  <span className="text-sm font-semibold">ICT Certified</span>
                </div>
                <div className="flex items-center gap-2 text-white bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                  <Users className="h-4 w-4 text-orange-400" />
                  <span className="text-sm font-semibold">Local Experts</span>
                </div>
                <div className="flex items-center gap-2 text-white bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                  <CheckCircle2 className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-semibold">100% Private</span>
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

        {/* Why Choose Us - Consistent Colors */}
        <section className="relative py-20 bg-gray-50 overflow-hidden">
          
          <div className="container relative mx-auto px-6 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Direct Service. No Surprises.
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We personally operate every transfer to guarantee excellence.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 - Availability (BLUE Theme) */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-blue-600 group">
                <div className="h-14 w-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                  <CheckCircle2 className="h-7 w-7 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Guaranteed Availability</h3>
                <p className="text-gray-600 leading-relaxed">
                  We never overbook. We match our bookings strictly to our fleet capacity. 
                  <br />
                  <strong className="text-blue-700 block mt-2">If we confirm it, we drive it.</strong>
                </p>
              </div>

              {/* Feature 2 - Private (GREEN Theme) */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-green-500 group">
                <div className="h-14 w-14 bg-green-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-500 transition-colors duration-300">
                  <Shield className="h-7 w-7 text-green-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">100% Private Fleet</h3>
                <p className="text-gray-600 leading-relaxed">
                  Enjoy the comfort of our modern, air-conditioned vans exclusively for your group.
                </p>
              </div>

              {/* Feature 3 - Local (ORANGE Theme) */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-orange-500 group">
                <div className="h-14 w-14 bg-orange-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-colors duration-300">
                  <MapPin className="h-7 w-7 text-orange-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Local Expert Drivers</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our drivers are locals from La Fortuna with over 30 years of experience. We know every curve of the road.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Booking Steps */}
        <BookingSteps />

        {/* Payment Methods */}
        <PaymentMethods />
        
        <WhatsAppButton />
      </main>
    </>
  );
}