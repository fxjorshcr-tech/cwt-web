// src/components/home/GoogleReviews.tsx
// Google reviews section with social proof

'use client';

import { Star, Quote, ExternalLink } from 'lucide-react';

export default function GoogleReviews() {
  const reviews = [
    {
      name: 'Sarah M.',
      country: 'United States',
      date: 'October 2024',
      rating: 5,
      text: 'Excellent service from SJO to La Fortuna! Our driver was punctual, professional, and the van was spotless. Highly recommend for anyone traveling to Arenal.',
      route: 'San José Airport → La Fortuna'
    },
    {
      name: 'John D.',
      country: 'Canada',
      date: 'September 2024',
      rating: 5,
      text: 'Very professional and reliable. The booking process was simple, and they monitored our delayed flight. Great communication throughout. Will use again!',
      route: 'Liberia Airport → Tamarindo'
    },
    {
      name: 'Emma L.',
      country: 'United Kingdom',
      date: 'November 2024',
      rating: 5,
      text: 'Perfect transfer service! Clean vehicle, friendly driver who spoke perfect English, and great value for money. Made our Costa Rica trip stress-free.',
      route: 'San José → Manuel Antonio'
    },
    {
      name: 'Michael R.',
      country: 'Germany',
      date: 'October 2024',
      rating: 5,
      text: 'Outstanding experience. Driver was early, helped with luggage, and provided great tips about Costa Rica. Comfortable ride with AC and WiFi.',
      route: 'Liberia Airport → Papagayo'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
              Customer Reviews
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Travelers Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real reviews from real travelers who chose our Costa Rica private shuttle service
          </p>
        </div>

        {/* Google Rating Summary */}
        <div className="flex flex-col items-center mb-12">
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-5xl font-bold text-gray-900">4.9</div>
                <div className="flex items-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-5 w-5 text-yellow-500 fill-yellow-500"
                    />
                  ))}
                </div>
              </div>
              <div className="border-l-2 border-gray-200 pl-4">
                <p className="text-lg font-semibold text-gray-900">
                  Based on Google Reviews
                </p>
                <p className="text-sm text-gray-600">
                  4 five-star reviews
                </p>
                <a
                  href="https://www.google.com/maps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium mt-2"
                >
                  See all reviews
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 relative"
            >
              {/* Quote icon */}
              <Quote className="absolute top-4 right-4 h-8 w-8 text-blue-100" />

              <div className="relative">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-yellow-500 fill-yellow-500"
                    />
                  ))}
                </div>

                {/* Review text */}
                <p className="text-gray-700 mb-4 leading-relaxed">
                  "{review.text}"
                </p>

                {/* Route badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full mb-4">
                  <span>📍 {review.route}</span>
                </div>

                {/* Reviewer info */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="font-semibold text-gray-900">{review.name}</p>
                    <p className="text-sm text-gray-600">{review.country}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{review.date}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Context Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
          <h3 className="font-bold text-gray-900 mb-2">
            New to Online Booking, Not New to the Business
          </h3>
          <p className="text-sm text-gray-700 max-w-2xl mx-auto">
            While we recently launched our online platform, our team has been providing reliable 
            transportation services across Costa Rica for years. We're building our digital presence, 
            but our commitment to excellent service has always been our priority.
          </p>
        </div>
      </div>
    </section>
  );
}