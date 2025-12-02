// src/components/sections/WhyChooseUs.tsx
'use client';

import Link from 'next/link';
import {
  MapPin,
  Clock,
  Users,
  Baby,
  CreditCard,
  Shield,
  Award,
  CheckCircle2
} from 'lucide-react';

export default function WhyChooseUs() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white via-blue-50 to-white overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">
            Why Private Transfers Make Sense in Costa Rica
          </h2>
          <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed px-4 mb-4">
            Getting around Costa Rica doesn't have to be complicated. A private transfer means one vehicle, one destination, on your schedule—no shared stops, no fixed departure times, and no navigating mountain roads yourself.
          </p>
          <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed px-4 mb-6">
            We're based in La Fortuna, but we keep vehicles ready in <strong>SJO, Manuel Antonio, Guanacaste, and Monteverde</strong>. So wherever you're headed, there's a van nearby.
          </p>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4 mb-6">
            Over <strong className="text-blue-600">400+ routes</strong> connecting every major destination.
          </p>
          <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto px-4 mb-8 bg-blue-50 py-4 rounded-xl border border-blue-100">
            We believe great service starts with personal accountability. That's why we only accept bookings we can handle ourselves. Your trip isn't passed off to a third party—it stays with our team.
          </p>
          <div className="text-center">
            <Link
              href="/transfers"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all hover:shadow-xl hover:scale-105"
            >
              Check Your Route & Get a Quote
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start mb-12 md:mb-16">

          <div className="space-y-4 sm:space-y-6">
            {/* 1. Direct, Door-to-Door */}
            <div className="flex items-start gap-3 sm:gap-4 group">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 sm:mb-2">Direct, Door-to-Door</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  We pick you up at your hotel, Airbnb, or the airport—and drop you off exactly where you need to be.
                </p>
              </div>
            </div>

            {/* 2. You Pick the Time */}
            <div className="flex items-start gap-3 sm:gap-4 group">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-orange-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="h-6 w-6 sm:h-7 sm:w-7 text-orange-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 sm:mb-2">You Pick the Time</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Need to leave at 5am for an early flight? Or maybe after lunch? You tell us when.
                </p>
              </div>
            </div>

            {/* 3. Space for the Whole Group */}
            <div className="flex items-start gap-3 sm:gap-4 group">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 sm:h-7 sm:w-7 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 sm:mb-2">Space for the Whole Group</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Our vans fit up to <strong>12 passengers</strong> with all their luggage. Families, friends, big groups—plenty of room.
                </p>
              </div>
            </div>

            {/* 4. Car Seats at No Extra Cost */}
            <div className="flex items-start gap-3 sm:gap-4 group">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-pink-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Baby className="h-6 w-6 sm:h-7 sm:w-7 text-pink-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 sm:mb-2">Car Seats at No Extra Cost</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Traveling with little ones? Just let us know and we'll have the seats ready.
                </p>
              </div>
            </div>

            {/* 5. What You See is What You Pay */}
            <div className="flex items-start gap-3 sm:gap-4 group">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-cyan-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <CreditCard className="h-6 w-6 sm:h-7 sm:w-7 text-cyan-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 sm:mb-2">What You See is What You Pay</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  No surprise fees at the end. The booking price is the final price.
                </p>
              </div>
            </div>

            {/* 6. Licensed & Fully Insured */}
            <div className="flex items-start gap-3 sm:gap-4 group">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 sm:mb-2">Licensed & Fully Insured</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  ICT certified (<strong>#4121-2025</strong>). Every trip is covered.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Award className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">What's Included</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <p className="text-sm sm:text-base text-gray-700">Flight monitoring—we track your arrival</p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <p className="text-sm sm:text-base text-gray-700">Meet & greet at the airport</p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <p className="text-sm sm:text-base text-gray-700">Clean, air-conditioned vehicles</p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <p className="text-sm sm:text-base text-gray-700">Bilingual driver</p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <p className="text-sm sm:text-base text-gray-700">WhatsApp support before and during your trip</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
              <p className="font-bold text-gray-900 text-lg mb-2">30+ Years Combined Experience</p>
              <p className="text-sm sm:text-base text-gray-700">
                Our team has been driving these roads for decades. We know every shortcut, every viewpoint, and every road condition.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
