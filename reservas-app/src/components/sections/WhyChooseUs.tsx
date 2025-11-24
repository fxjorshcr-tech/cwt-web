// src/components/home/WhyChooseUs.tsx
'use client';

import {
  Users,
  Car,
  Baby,
  HeadphonesIcon,
  CreditCard,
  Shield,
  MapPin,
  Award,
  Heart,
  CheckCircle2
} from 'lucide-react';

export default function WhyChooseUs() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white via-blue-50 to-white overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 bg-blue-100 rounded-full mb-4 sm:mb-6 border border-blue-200">
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            <span className="text-blue-700 font-bold text-xs sm:text-sm uppercase tracking-wide">
              Your Trusted Transportation Partner
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">
            The Best Way to Travel Between Destinations in Costa Rica
          </h2>
          <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed px-4">
            When it comes to moving from point A to point B in Costa Rica, <strong>private transfers with a trusted company like Can't Wait Travel CR</strong> are the best option for travelers who value <em>peace of mind and security</em>.
            Unlike shared shuttles or ride-sharing apps, our <strong>100% Costa Rican team</strong> offers direct, private transportation with <strong>over 30 years of combined experience</strong>.
            We know every curve of these roads and combine the warmth of <em className="text-blue-600">Pura Vida</em> hospitality with the strict professionalism
            of a licensed transport operator, ensuring you arrive safely and comfortably every time.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start mb-12 md:mb-16">
          
          <div className="space-y-4 sm:space-y-6">
            {/* 1. Expert Local Drivers */}
            <div className="flex items-start gap-3 sm:gap-4 group">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 sm:mb-2">Expert Local Drivers</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Our drivers are more than just chauffeurs; they are local experts. Fluent in English and 
                  respectful, they know the safest routes and the hidden gems along the way.
                </p>
              </div>
            </div>

            {/* 2. Private & Spacious */}
            <div className="flex items-start gap-3 sm:gap-4 group">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-orange-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Car className="h-6 w-6 sm:h-7 sm:w-7 text-orange-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 sm:mb-2">Private & Spacious</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Travel without squeezing in. Our modern vans comfortably accommodate up to <strong>12 passengers 
                  with luggage</strong>. It's your private space—clean, cool, and exclusively yours.
                </p>
              </div>
            </div>

            {/* 3. Family Safety First */}
            <div className="flex items-start gap-3 sm:gap-4 group">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Baby className="h-6 w-6 sm:h-7 sm:w-7 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 sm:mb-2">Family Safety First</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  We provide <strong>complimentary, high-quality safety seats</strong> for 
                  all ages. Simply request them when booking, and we'll have everything installed.
                </p>
              </div>
            </div>

            {/* 4. Real Human Support */}
            <div className="flex items-start gap-3 sm:gap-4 group">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <HeadphonesIcon className="h-6 w-6 sm:h-7 sm:w-7 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 sm:mb-2">Real Human Support</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Our bilingual team is available <strong>24/7 via WhatsApp, phone, 
                  or email</strong> to assist you instantly with any changes or questions.
                </p>
              </div>
            </div>

            {/* 5. Bank-Level Security */}
            <div className="flex items-start gap-3 sm:gap-4 group">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-cyan-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <CreditCard className="h-6 w-6 sm:h-7 sm:w-7 text-cyan-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 sm:mb-2">Bank-Level Security</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Book with confidence. We process payments via <strong>Stripe</strong>, guaranteeing that your 
                  data is protected by the same security standards used by Amazon and Google.
                </p>
              </div>
            </div>

            {/* 6. Fully Licensed & Insured */}
            <div className="flex items-start gap-3 sm:gap-4 group">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="h-6 w-6 sm:h-7 sm:w-7 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 sm:mb-2">Fully Licensed & Insured</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  We operate strictly by the book. Holding official <strong>ICT License #4121-2025</strong>, 
                  every vehicle carries full commercial liability coverage for your total peace of mind.
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
                <h3 className="text-xl font-bold text-gray-900">Direct Operation</h3>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                We personally operate every service—no third-party reselling.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <p className="text-sm text-gray-700">Flight monitoring included</p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <p className="text-sm text-gray-700">Meet & greet service</p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <p className="text-sm text-gray-700">Clean, air-conditioned vehicles</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
              <div className="flex items-center gap-3">
                <Heart className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-bold text-gray-900 text-base">100% Costa Rican</p>
                  <p className="text-sm text-gray-700">Nationwide coverage across Costa Rica</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}