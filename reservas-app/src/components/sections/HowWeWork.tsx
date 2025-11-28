// src/components/sections/HowWeWork.tsx
'use client';

import { Calendar, CheckCircle, Car } from 'lucide-react';

export default function HowWeWork() {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Simple, transparent, reliable—book your private transfer in 3 easy steps
          </p>
        </div>

        {/* 3 Steps */}
        <div className="grid sm:grid-cols-3 gap-8 sm:gap-6">

          {/* Step 1: Book */}
          <div className="text-center">
            <div className="relative mb-6">
              {/* Circle with Number */}
              <div className="h-20 w-20 sm:h-24 sm:w-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-xl">
                <Calendar className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>
              {/* Step Number Badge */}
              <div className="absolute -top-2 -right-2 sm:-right-4 h-8 w-8 bg-blue-600 border-4 border-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              {/* Connector Line - Hidden on mobile */}
              <div className="hidden sm:block absolute top-10 left-[calc(50%+48px)] w-[calc(100%-48px)] h-1 bg-gradient-to-r from-blue-300 to-green-300"></div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
              Book Online
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Select your route, date, and passengers. Get instant pricing with no hidden fees.
            </p>
          </div>

          {/* Step 2: We Confirm */}
          <div className="text-center">
            <div className="relative mb-6">
              {/* Circle with Number */}
              <div className="h-20 w-20 sm:h-24 sm:w-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>
              {/* Step Number Badge */}
              <div className="absolute -top-2 -right-2 sm:-right-4 h-8 w-8 bg-green-600 border-4 border-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              {/* Connector Line - Hidden on mobile */}
              <div className="hidden sm:block absolute top-10 left-[calc(50%+48px)] w-[calc(100%-48px)] h-1 bg-gradient-to-r from-green-300 to-orange-300"></div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
              Get Confirmed
            </h3>
            <p className="text-gray-600 leading-relaxed">
              We confirm your booking and send all details: vehicle, pickup time.
            </p>
          </div>

          {/* Step 3: Meet Your Driver */}
          <div className="text-center">
            <div className="relative mb-6">
              {/* Circle with Number */}
              <div className="h-20 w-20 sm:h-24 sm:w-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto shadow-xl">
                <Car className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>
              {/* Step Number Badge */}
              <div className="absolute -top-2 -right-2 sm:-right-4 h-8 w-8 bg-orange-600 border-4 border-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                <span className="text-white font-bold text-sm">3</span>
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
              Relax & Enjoy
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Sit back, relax, and enjoy the journey to your destination.
            </p>
          </div>

        </div>

        {/* Bottom Note */}
        <div className="mt-12 p-6 bg-blue-50 border-2 border-blue-200 rounded-2xl text-center">
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed max-w-3xl mx-auto">
            <strong className="text-blue-600">Direct service with our own fleet.</strong> We only accept bookings we can personally handle.
            If we don't have capacity, we'll be upfront with you—your confirmed booking is guaranteed.
          </p>
        </div>

      </div>
    </section>
  );
}