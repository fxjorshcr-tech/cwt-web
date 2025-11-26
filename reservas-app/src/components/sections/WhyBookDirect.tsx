// src/components/sections/WhyBookDirect.tsx
'use client';

import { Users, MessageCircle, Award, MapPin, Shield, Heart } from 'lucide-react';

export default function WhyBookDirect() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 border border-blue-200 rounded-full mb-6">
            <Heart className="h-5 w-5 text-blue-600" />
            <span className="text-blue-700 font-bold text-sm uppercase tracking-wide">
              Direct Service
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Why Book a Private Shuttle With Us?
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            When you book with Can't Wait Travel CR, you're working directly with the people who will drive you.
            Direct communication, transparent pricing, and personalized service from start to finish.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">

          {/* Card 1: Operated Directly by Us */}
          <div className="group bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="h-14 w-14 bg-blue-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Users className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
              Operated Directly by Us
            </h3>
            <p className="text-gray-700 leading-relaxed">
              We own every vehicle and employ every driver directly. When you book through our website, you're securing your ride with our professional team.
              <strong className="text-blue-600"> Direct booking means direct service.</strong>
            </p>
          </div>

          {/* Card 2: Nationwide Coverage */}
          <div className="group bg-gradient-to-br from-green-50 to-white border-2 border-green-200 rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="h-14 w-14 bg-green-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <MapPin className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
              Nationwide Coverage
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Based in La Fortuna with vehicles strategically located in SJO, Manuel Antonio, Guanacaste, and Monteverde.
              <strong className="text-green-600"> Complete coverage across Costa Rica's main destinations.</strong>
            </p>
          </div>

          {/* Card 3: Licensed & Insured */}
          <div className="group bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200 rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="h-14 w-14 bg-purple-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
              Licensed & Insured
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Full ICT tourism operator license #4121-2025 with comprehensive insurance coverage.
              <strong className="text-purple-600"> Professional, legal, and certified</strong> by Costa Rica's official tourism board.
            </p>
          </div>

          {/* Card 4: 30+ Years Experience */}
          <div className="group bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200 rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="h-14 w-14 bg-orange-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Award className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
              30+ Years Combined Experience
            </h3>
            <p className="text-gray-700 leading-relaxed">
              We started Can't Wait Travel CR to offer the service
              <strong className="text-orange-600"> WE would want as travelers—</strong>reliable, responsible, and authentic with local expertise.
            </p>
          </div>

          {/* Card 5: Quick Support */}
          <div className="group bg-gradient-to-br from-cyan-50 to-white border-2 border-cyan-200 rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="h-14 w-14 bg-cyan-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <MessageCircle className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
              Fast WhatsApp Support
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Message us on WhatsApp and connect instantly with our bilingual team members who know every detail of your booking.
              <strong className="text-cyan-600"> Fast response times from our dedicated support team.</strong>
            </p>
          </div>

          {/* Card 6: Secure Online Payments */}
          <div className="group bg-gradient-to-br from-pink-50 to-white border-2 border-pink-200 rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="h-14 w-14 bg-pink-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Heart className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
              Secure Online Payments
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Book with confidence using our secure online payment system.
              <strong className="text-pink-600"> Your financial data is protected with bank-level security.</strong>
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
