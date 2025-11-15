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
  Heart
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
            Why Choose Can't Wait Travel
          </h2>
          <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed px-4">
            As a <strong>100% Costa Rican company</strong>, we understand what travelers need. 
            Our native drivers bring decades of combined experience, local knowledge, and genuine 
            <em className="text-blue-600"> pura vida</em> hospitality to every journey.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center mb-12 md:mb-16">
          
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-start gap-3 sm:gap-4 group">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 sm:mb-2">Native Experienced Drivers</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  All our drivers are Costa Rican natives with extensive knowledge of local routes, 
                  culture, and the best hidden spots along the way.
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
                  We accommodate up to <strong>12 passengers</strong> with one large suitcase each. 
                  Perfect for families, groups, or travelers with extra luggage.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4 group">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Baby className="h-6 w-6 sm:h-7 sm:w-7 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 sm:mb-2">Child Seats Available</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Traveling with little ones? We provide <strong>free child safety seats</strong> for 
                  all ages. Just let us know when booking.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4 group">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <HeadphonesIcon className="h-6 w-6 sm:h-7 sm:w-7 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 sm:mb-2">24/7 Support Available</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Questions? Flight delays? No problem. Our bilingual support team is available 
                  around the clock via WhatsApp, phone, or email.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4 group">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-cyan-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <CreditCard className="h-6 w-6 sm:h-7 sm:w-7 text-cyan-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 sm:mb-2">Secure Payment Technology</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  We use <strong>Stripe</strong> — the same secure payment system trusted by 
                  Amazon, Google, and millions worldwide. Your data is always protected.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4 group">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="h-6 w-6 sm:h-7 sm:w-7 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 sm:mb-2">Licensed & Fully Insured</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Official <strong>ICT License #4121-2025</strong>. All vehicles fully insured 
                  with commercial liability coverage for your peace of mind.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30">
                  <Car className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                </div>
                <div className="text-white">
                  <h3 className="text-xl sm:text-2xl font-bold">Pura Vida</h3>
                  <p className="text-blue-100 text-xs sm:text-sm">Guaranteed</p>
                </div>
              </div>
              <p className="text-sm sm:text-base text-white/90 leading-relaxed mb-4 sm:mb-6">
                Experience authentic Costa Rican hospitality from the moment we pick you up 
                to your final destination.
              </p>
              
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-white/20 text-center">
                  <p className="text-xl sm:text-2xl font-bold text-white">500+</p>
                  <p className="text-[10px] sm:text-xs text-blue-100">Travelers</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-white/20 text-center">
                  <p className="text-xl sm:text-2xl font-bold text-white">4.9</p>
                  <p className="text-[10px] sm:text-xs text-blue-100">Rating</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-white/20 text-center">
                  <p className="text-xl sm:text-2xl font-bold text-white">50+</p>
                  <p className="text-[10px] sm:text-xs text-blue-100">Routes</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border-2 border-orange-200">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Award className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Quality First</h3>
              </div>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                We only offer services we <strong>personally operate</strong>. No third-party 
                reselling means we control every detail of your experience.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 sm:p-6 border-2 border-green-200">
              <div className="flex items-center gap-3">
                <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                <div>
                  <p className="font-bold text-gray-900 text-sm sm:text-base">100% Costa Rican</p>
                  <p className="text-xs sm:text-sm text-gray-700">Locally owned & operated</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}