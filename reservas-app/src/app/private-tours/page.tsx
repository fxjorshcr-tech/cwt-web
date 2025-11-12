// src/app/private-tours/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, Users, MapPin, DollarSign } from 'lucide-react';
import BookingNavbar from '@/components/booking/BookingNavbar';
import { FULL_DAY_TOURS, HALF_DAY_TOURS } from '@/lib/tours-data';

export default function PrivateToursPage() {
  const [activeTab, setActiveTab] = useState<'half-day' | 'full-day'>('half-day');

  const displayTours = activeTab === 'half-day' ? HALF_DAY_TOURS : FULL_DAY_TOURS;

  return (
    <>
      <BookingNavbar />

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/arenal-volcano-tour-visit.webp"
            alt="La Fortuna Private Tours"
            fill
            className="object-cover"
            priority
            quality={85}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
            <MapPin className="h-5 w-5 text-white" />
            <span className="text-white text-sm font-medium">LA FORTUNA PRIVATE TOURS</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
            Discover La Fortuna
          </h1>
          
          <p className="text-lg md:text-xl text-white/95 max-w-3xl mx-auto drop-shadow-lg leading-relaxed mb-8">
            Private tours with expert guides. Small groups (max 6), personalized attention, unforgettable adventures.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-6 text-white">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span className="text-sm font-medium">Max 6 People</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span className="text-sm font-medium">Half & Full Day Tours</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span className="text-sm font-medium">Pickup from La Fortuna</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tour Category Tabs */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setActiveTab('half-day')}
              className={`px-8 py-3 rounded-full font-semibold transition-all ${
                activeTab === 'half-day'
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Half Day Tours <span className="text-sm opacity-75">(6 hours)</span>
            </button>
            <button
              onClick={() => setActiveTab('full-day')}
              className={`px-8 py-3 rounded-full font-semibold transition-all ${
                activeTab === 'full-day'
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Full Day Tours <span className="text-sm opacity-75">(10 hours)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Commitment Note */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <div className="container mx-auto px-4 py-3">
          <p className="text-center text-sm text-gray-700">
            <span className="font-semibold text-blue-700">All tours depart from La Fortuna at 8:00 AM</span> — Small groups, expert guides, lunch included
          </p>
        </div>
      </div>

      {/* Tours Grid */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Category Title */}
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {activeTab === 'half-day' ? 'Half Day Adventures' : 'Full Day Expeditions'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {activeTab === 'half-day' 
                ? 'Perfect for combining with other activities or relaxation time' 
                : 'Immersive experiences exploring the best of La Fortuna region'}
            </p>
          </div>

          {/* Tours Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayTours.map((tour) => (
              <Link
                key={tour.id}
                href={`/private-tours/${tour.slug}`}
                className="bg-white rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-blue-400 hover:shadow-2xl transition-all group"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={tour.image}
                    alt={tour.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    quality={75}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Duration Badge */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold text-sm">{tour.duration}</span>
                  </div>

                  {/* Difficulty Badge */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <span className={`font-semibold text-xs ${
                      tour.difficulty === 'Easy' ? 'text-green-600' :
                      tour.difficulty === 'Moderate' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {tour.difficulty}
                    </span>
                  </div>

                  {/* Title on Image */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white drop-shadow-lg">
                      {tour.name}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {tour.shortDescription}
                  </p>

                  {/* Highlights */}
                  <div className="mb-4">
                    <ul className="space-y-1">
                      {tour.highlights.slice(0, 3).map((highlight, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-green-600 mt-0.5">✓</span>
                          <span className="line-clamp-1">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>Max {tour.maxPassengers}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>Pickup 8AM</span>
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="flex items-baseline gap-1">
                          <DollarSign className="h-5 w-5 text-blue-600" />
                          <span className="text-2xl font-bold text-blue-600">{tour.basePrice}</span>
                        </div>
                        <p className="text-xs text-gray-500">2 people (min)</p>
                        <p className="text-xs text-gray-500">+${tour.pricePerExtraPerson} per extra person</p>
                      </div>
                    </div>
                    
                    <div className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 group-hover:gap-3">
                      <span>View Details</span>
                      <ArrowRight className="h-4 w-4 transition-all" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Large Groups CTA */}
          <div className="mt-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 border border-blue-100 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Traveling with More Than 6 People?
            </h3>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              We specialize in customizing tours for larger groups and families. 
              Contact us for a personalized quote and we'll create the perfect experience for your group.
            </p>
            <Link
              href="https://wa.me/50685962438?text=Hi!%20I'm%20interested%20in%20a%20private%20tour%20for%20a%20group%20of%20more%20than%206%20people"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors shadow-lg"
            >
              <span>Contact Us on WhatsApp</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {/* Custom Tour CTA */}
          <div className="mt-8 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 md:p-12 border border-orange-100 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Don't See What You're Looking For?
            </h3>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              We can create custom itineraries combining multiple destinations or activities. 
              Tell us your interests and we'll design the perfect tour for you.
            </p>
            <Link
              href="https://wa.me/50685962438?text=Hi!%20I'd%20like%20to%20request%20a%20custom%20private%20tour"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-colors shadow-lg"
            >
              <span>Request Custom Tour</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Why Choose Our Private Tours?
          </h2>
          <p className="text-center text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            We're not a marketplace — we directly operate every tour for quality you can trust
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '👥',
                title: 'Small Groups Only',
                description: 'Maximum 6 people per tour ensures personalized attention and flexibility'
              },
              {
                icon: '🌟',
                title: 'Expert Local Guides',
                description: 'Bilingual naturalist guides with deep knowledge of Costa Rican wildlife and culture'
              },
              {
                icon: '🚐',
                title: 'Comfortable Transportation',
                description: 'Private A/C vehicles with pickup from your La Fortuna hotel'
              },
              {
                icon: '🍽️',
                title: 'Lunch Included',
                description: 'Traditional Costa Rican meals at every tour, dietary needs accommodated'
              },
              {
                icon: '🎫',
                title: 'All Inclusive Pricing',
                description: 'Park entrances, equipment, snacks, and fees included — no hidden costs'
              },
              {
                icon: '⚡',
                title: 'Flexible & Personal',
                description: 'We adjust pace to your group and can modify itineraries within reason'
              }
            ].map((benefit, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}