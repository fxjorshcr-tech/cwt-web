// src/app/transfers/page.tsx
// ✅ FIXED - Usando BookingFormWrapper para resolver error de useSearchParams
'use client';

import { Suspense, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookingFormWrapper } from '@/components/home/BookingFormWrapper';
import BookingNavbar from '@/components/booking/BookingNavbar';
import WhatsAppButton from "@/components/WhatsAppButton";
import {
  Shield,
  Users,
  Clock,
  Baby,
  HeadphonesIcon,
  CreditCard,
  CheckCircle2,
  MapPin,
  Car,
  Award,
  Heart
} from 'lucide-react';

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

      {/* ✅ Booking Form - USANDO WRAPPER CON SUSPENSE */}
      <section id="booking-form" className="relative -mt-20 z-20 px-6 pb-20">
        <div 
          className={`transition-opacity duration-500 ${
            isPageReady ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <BookingFormWrapper />
        </div>
      </section>

      {/* Why Choose Can't Wait Travel Section */}
      <section className="py-20 bg-gradient-to-b from-white via-blue-50 to-white">
        <div className="container mx-auto px-6 max-w-7xl">
          
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-blue-100 rounded-full mb-6 border border-blue-200">
              <MapPin className="h-5 w-5 text-blue-600" />
              <span className="text-blue-700 font-bold text-sm uppercase tracking-wide">
                Your Trusted Transportation Partner
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose Can't Wait Travel
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              As a <strong>100% Costa Rican company</strong>, we understand what travelers need. 
              Our native drivers bring decades of combined experience, local knowledge, and genuine 
              <em className="text-blue-600"> pura vida</em> hospitality to every journey.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            
            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="h-7 w-7 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">Native Experienced Drivers</h3>
                  <p className="text-gray-700 leading-relaxed">
                    All our drivers are Costa Rican natives with extensive knowledge of local routes, 
                    culture, and the best hidden spots along the way.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Car className="h-7 w-7 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">Comfortable Capacity</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We accommodate up to <strong>12 passengers</strong> with one large suitcase each. 
                    Perfect for families, groups, or travelers with extra luggage.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Baby className="h-7 w-7 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">Child Seats Available</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Traveling with little ones? We provide <strong>free child safety seats</strong> for 
                    all ages. Just let us know when booking.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <HeadphonesIcon className="h-7 w-7 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">24/7 Support Available</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Questions? Flight delays? No problem. Our bilingual support team is available 
                    around the clock via WhatsApp, phone, or email.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CreditCard className="h-7 w-7 text-cyan-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">Secure Payment Technology</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We use <strong>Stripe</strong> — the same secure payment system trusted by 
                    Amazon, Google, and millions worldwide. Your data is always protected.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Shield className="h-7 w-7 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">Licensed & Fully Insured</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Official <strong>ICT License #4121-2025</strong>. All vehicles fully insured 
                    with commercial liability coverage for your peace of mind.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30">
                    <Car className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-white">
                    <h3 className="text-2xl font-bold">Pura Vida</h3>
                    <p className="text-blue-100 text-sm">Guaranteed</p>
                  </div>
                </div>
                <p className="text-white/90 leading-relaxed mb-6">
                  Experience authentic Costa Rican hospitality from the moment we pick you up 
                  to your final destination.
                </p>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 text-center">
                    <p className="text-2xl font-bold text-white">500+</p>
                    <p className="text-xs text-blue-100">Travelers</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 text-center">
                    <p className="text-2xl font-bold text-white">4.9</p>
                    <p className="text-xs text-blue-100">Rating</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 text-center">
                    <p className="text-2xl font-bold text-white">50+</p>
                    <p className="text-xs text-blue-100">Routes</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-orange-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Award className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Quality First</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  We only offer services we <strong>personally operate</strong>. No third-party 
                  reselling means we control every detail of your experience.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                <div className="flex items-center gap-3">
                  <Heart className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-bold text-gray-900">100% Costa Rican</p>
                    <p className="text-sm text-gray-700">Locally owned & operated</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* How We Operate Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-8 md:p-12 border-2 border-blue-100 shadow-xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full mb-4 shadow-md">
                <Heart className="h-5 w-5 text-blue-600" />
                <span className="text-blue-700 font-bold text-sm uppercase tracking-wide">
                  How We Work
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                We Only Sell What We Operate
              </h2>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg mb-6 text-center">
                At Can't Wait Travel, we focus on <strong>quality over quantity</strong>. That's why 
                we only offer services that <strong className="text-blue-600">we personally operate and control</strong>.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="bg-white rounded-xl p-6 shadow-md border border-blue-100">
                  <div className="flex items-start gap-3 mb-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">What We Do</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li>✅ Operate our own private shuttles</li>
                        <li>✅ Run our own private tours</li>
                        <li>✅ Employ and train our drivers directly</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md border border-red-100">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-red-600 font-bold text-sm">✕</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">What We Don't Do</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li>❌ Resell tours from other companies</li>
                        <li>❌ Contract out to third parties</li>
                        <li>❌ Offer services we don't control</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-white rounded-xl border-2 border-blue-200">
                <p className="text-gray-700 leading-relaxed text-center">
                  <strong className="text-blue-600">Why does this matter?</strong> When you book with us, 
                  you're working with the people who actually provide the service. Every driver is our employee. 
                  Every vehicle is maintained by our team. We're accountable for every detail because 
                  <strong> it's our operation from start to finish</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
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