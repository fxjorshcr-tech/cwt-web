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
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Book Direct With Us?
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            When you book with Can't Wait Travel, you're working directly with the people who will drive you.
            No middlemen, no outsourcing, no surprises.
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
              We don't outsource to random drivers or third parties. Every vehicle is ours, every driver is vetted and employed by us.
              <strong className="text-blue-600"> You're booking the people who will actually drive you.</strong>
            </p>
          </div>

          {/* Card 2: La Fortuna Based */}
          <div className="group bg-gradient-to-br from-green-50 to-white border-2 border-green-200 rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="h-14 w-14 bg-green-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <MapPin className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
              La Fortuna Based
            </h3>
            <p className="text-gray-700 leading-relaxed">
              We live here, we work here, we know these roads personally. Our drivers are from Arenal—not imported from San José.
              <strong className="text-green-600"> We know which routes flood, where construction is, and shortcuts only locals use.</strong>
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
              Full ICT tourism operator license #4121. Comprehensive insurance coverage.
              <strong className="text-purple-600"> Professional, legal, and safe—</strong>not a random ride-share driver or unlicensed freelancer.
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
              After three decades working in Costa Rican tourism for big companies, we started Can't Wait Travel to offer the service
              <strong className="text-orange-600"> WE would want as travelers—</strong>reliable, personal, and without the corporate markup.
            </p>
          </div>

          {/* Card 5: Direct Communication */}
          <div className="group bg-gradient-to-br from-cyan-50 to-white border-2 border-cyan-200 rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="h-14 w-14 bg-cyan-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <MessageCircle className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
              Text/WhatsApp the Owner Directly
            </h3>
            <p className="text-gray-700 leading-relaxed">
              No call centers, no automated responses. Message us on WhatsApp and get answers from the owner personally.
              <strong className="text-cyan-600"> You're not just a booking number to us.</strong>
            </p>
          </div>

          {/* Card 6: Small Team, Big Attention */}
          <div className="group bg-gradient-to-br from-pink-50 to-white border-2 border-pink-200 rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="h-14 w-14 bg-pink-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Heart className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
              Small Team, Big Attention to Detail
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Many big companies are impersonal. We're a family-run business where you'll meet the owners.
              <strong className="text-pink-600"> Your safety and comfort are our reputation—</strong>we take that seriously.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
