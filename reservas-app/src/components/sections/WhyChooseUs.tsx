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
            Why Choose Can't Wait Travel CR
          </h2>
          <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed px-4">
            We're a <strong>100% Costa Rican company based in La Fortuna, Arenal</strong>—a group of ticos 
            with over <strong>30 years of combined experience</strong> operating private transfers and tours 
            throughout Costa Rica. Our native drivers bring local knowledge and genuine 
            <em className="text-blue-600"> pura vida</em> hospitality to every journey.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start mb-12 md:mb-16">
          
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-start gap-3 sm:gap-4 group">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 sm:mb-2">Native Experienced Drivers</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  All our drivers are Costa Rican natives with extensive knowledge of local routes, 
                  culture, and the best spots along the way.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4 group">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-orange-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Car className="h-6 w-6 sm:h-7 sm:w-7 text-orange-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 sm:mb-2">Comfortable Capacity</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  We accommodate up to <strong>12 passengers</strong> with one large suitcase and 
                  one carry-on per person.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4 group">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Baby className="h-6 w-6 sm:h-7 sm:w-7 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 sm:mb-2">Free Child Seats</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  We provide <strong>complimentary child safety seats</strong> for all ages. 
                  Just let us know when booking.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4 group">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <HeadphonesIcon className="h-6 w-6 sm:h-7 sm:w-7 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 sm:mb-2">24/7 Support</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Our bilingual support team is available around the clock via WhatsApp, phone, or email.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4 group">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-cyan-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <CreditCard className="h-6 w-6 sm:h-7 sm:w-7 text-cyan-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 sm:mb-2">Secure Payments</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  We use <strong>Stripe</strong>—the same secure payment system trusted by 
                  Amazon and Google.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4 group">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="h-6 w-6 sm:h-7 sm:w-7 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 sm:mb-2">Licensed & Insured</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Official <strong>ICT License #4121-2025</strong>. All vehicles fully insured 
                  with commercial liability coverage.
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
                We personally operate every service—no third-party reselling. This means we control 
                every detail of your experience.
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
                  <p className="text-sm text-gray-700">Based in La Fortuna, Arenal</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}