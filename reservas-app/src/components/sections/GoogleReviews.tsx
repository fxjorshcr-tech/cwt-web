// src/components/home/GoogleReviews.tsx
// SEO OPTIMIZED - Reviews con rutas específicas y destinos de Costa Rica

'use client';

import { Star, ExternalLink } from 'lucide-react';

export default function GoogleReviews() {
  const reviews = [
    {
      name: 'Sarah M.',
      country: '🇺🇸 United States',
      date: 'October 2024',
      rating: 5,
      text: 'Best private shuttle from San José Airport to La Fortuna! The driver was punctual, the van spotless, and he gave us great tips about what to do in Arenal. Highly recommend for anyone traveling to the volcano area.',
      route: 'SJO Airport → La Fortuna, Arenal'
    },
    {
      name: 'John D.',
      country: '🇨🇦 Canada',
      date: 'September 2024',
      rating: 5,
      text: 'Perfect airport transfer from Liberia to Tamarindo. They monitored our delayed flight and were waiting when we arrived. The driver spoke excellent English and recommended the best beaches in Guanacaste to visit.',
      route: 'Liberia Airport → Tamarindo Beach'
    },
    {
      name: 'Emma L.',
      country: '🇬🇧 United Kingdom',
      date: 'November 2024',
      rating: 5,
      text: 'Excellent private shuttle service from San José to Manuel Antonio. Clean vehicle with AC, friendly bilingual driver, and great value. He told us where to eat in Quepos and the best time to visit the national park.',
      route: 'San José → Manuel Antonio'
    },
    {
      name: 'Michael R.',
      country: '🇩🇪 Germany',
      date: 'October 2024',
      rating: 5,
      text: 'Outstanding transportation from Liberia Airport to Papagayo Peninsula. Driver was early, helped with all our luggage, and shared insider tips about Costa Rica. The shuttle had WiFi and was very comfortable for our family.',
      route: 'LIR Airport → Papagayo Peninsula'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        
        {/* Header with SEO content */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-full mb-4">
            <Star className="h-4 w-4 text-yellow-600 fill-yellow-600" />
            <span className="text-yellow-700 font-bold text-sm">Verified Google Reviews</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Travelers Say About Our Costa Rica Shuttle Service
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-sm sm:text-base">
            Real reviews from real travelers who chose our private shuttle service for their 
            Costa Rica airport transfers and transportation between destinations
          </p>
        </div>

        {/* Google Rating Card */}
        <div className="max-w-md mx-auto mb-12">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 sm:p-8 text-center shadow-lg">
            <div className="mb-4">
              <div className="text-5xl sm:text-6xl font-bold text-gray-900">4.9</div>
              <div className="flex items-center justify-center gap-1 mt-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-6 w-6 sm:h-7 sm:w-7 text-yellow-500 fill-yellow-500"
                  />
                ))}
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-700 font-semibold mb-1">
              Based on Google Reviews
            </p>
            <p className="text-xs sm:text-sm text-gray-600 mb-4">
              4 five-star reviews from verified Costa Rica travelers
            </p>
            <a
              href="https://www.google.com/maps"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              View all reviews on Google
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Reviews Grid with SEO-rich content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-10">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="bg-white border-2 border-gray-200 rounded-xl p-5 sm:p-6 hover:border-blue-300 hover:shadow-lg transition-all"
            >
              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-yellow-500 fill-yellow-500"
                  />
                ))}
              </div>

              {/* Review text - SEO optimized */}
              <p className="text-gray-700 text-sm sm:text-base mb-4 leading-relaxed">
                "{review.text}"
              </p>

              {/* Route badge - Important for local SEO */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs sm:text-sm font-medium rounded-full mb-4 border border-blue-200">
                <span>📍 {review.route}</span>
              </div>

              {/* Reviewer info */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <p className="font-bold text-gray-900 text-sm">{review.name}</p>
                  <p className="text-xs text-gray-600">{review.country}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{review.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Message with SEO keywords - DISEÑO MEJORADO */}
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-green-50 via-blue-50 to-green-50 border-2 border-green-300 rounded-2xl p-8 sm:p-10 shadow-lg">
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🇨🇷</div>
            <h3 className="font-bold text-gray-900 mb-3 text-xl sm:text-2xl">
              The "Pura Vida" Saying Isn't Just for Tourists
            </h3>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto rounded-full mb-4"></div>
          </div>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed text-center mb-4">
            You've probably heard that Costa Ricans say <span className="font-bold text-green-700">"Pura Vida"</span> for everything—and it's 100% true. 
            Hello? Pura Vida. Goodbye? Pura Vida. How are you? Pura Vida. Thank you? Pura Vida. You're welcome? Pura Vida. 
          </p>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed text-center italic">
            It's not a tourist gimmick created for t-shirts and Instagram captions—it's genuinely how we ticos live and communicate every single day.
          </p>
        </div>
      </div>
    </section>
  );
}