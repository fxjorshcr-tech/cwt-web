// src/components/home/PrivateTours.tsx
// ✅ OPTIMIZED: Lazy loading added to image
'use client';

import { Mountain, Binoculars, Waves, Trees, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function PrivateTours() {
  const tourCategories = [
    {
      icon: Mountain,
      title: 'Adventure Tours',
      description: 'Zip-lining, Rafting, ATV',
      color: 'blue'
    },
    {
      icon: Binoculars,
      title: 'Wildlife Watching',
      description: 'Sloths, Monkeys, Birds',
      color: 'green'
    },
    {
      icon: Waves,
      title: 'Beach & Water',
      description: 'Snorkeling, Surfing, Beaches',
      color: 'cyan'
    },
    {
      icon: Trees,
      title: 'Nature & Hiking',
      description: 'Rainforest, Waterfalls, Trails',
      color: 'emerald'
    }
  ];

  const popularTours = [
    {
      icon: Mountain,
      title: 'Arenal Volcano Tour',
      description: 'Explore the iconic volcano, hot springs, and rainforest trails with expert naturalist guides.',
      price: 'From $95 per person',
      rating: 5
    },
    {
      icon: Trees,
      title: 'Monteverde Cloud Forest',
      description: 'Walk among clouds on hanging bridges, spot exotic birds, and discover unique wildlife.',
      price: 'From $85 per person',
      rating: 5
    },
    {
      icon: Waves,
      title: 'Manuel Antonio Park',
      description: 'Pristine beaches, monkeys, sloths, and incredible biodiversity in one stunning location.',
      price: 'From $75 per person',
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Exclusive Private Tours Across Costa Rica
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Experience Costa Rica's natural wonders with our carefully curated private 
            tours. Small groups, expert local guides, and unforgettable adventures 
            designed just for you.
          </p>
        </div>

        {/* Tour Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {tourCategories.map((category, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all text-center group cursor-pointer"
            >
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                category.color === 'blue' ? 'bg-blue-100' :
                category.color === 'green' ? 'bg-green-100' :
                category.color === 'cyan' ? 'bg-cyan-100' :
                'bg-emerald-100'
              }`}>
                <category.icon className={`h-8 w-8 ${
                  category.color === 'blue' ? 'text-blue-600' :
                  category.color === 'green' ? 'text-green-600' :
                  category.color === 'cyan' ? 'text-cyan-600' :
                  'text-emerald-600'
                }`} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{category.title}</h3>
              <p className="text-sm text-gray-600">{category.description}</p>
            </div>
          ))}
        </div>

        {/* Why Choose Our Tours */}
        <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
          {/* ✅ OPTIMIZED: Image with lazy loading */}
          <div className="relative h-[500px] md:h-[600px] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/private-shuttle-costa-rica-service.WEBP"
              alt="Private Tours Costa Rica - Expert guides and personalized experiences"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
              loading="lazy"
              quality={80}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-1 mb-2">
                {[1,2,3,4,5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                ))}
              </div>
              <p className="text-white text-sm italic">
                "Exceptional tours with knowledgeable guides and personalized experiences"
              </p>
            </div>
          </div>

          {/* Content */}
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Why Choose Our Private Tours?
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Unlike generic group tours, our private experiences are personally operated by our team 
              to ensure the highest quality and authentic Costa Rican experiences. We don't sell 
              third-party tours—we design and lead every adventure ourselves.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center mt-1">
                  <span className="text-orange-600 text-sm font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Operated Directly By Us</h4>
                  <p className="text-sm text-gray-600">
                    Every tour is personally operated by our experienced team, not outsourced to third parties
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                  <span className="text-blue-600 text-sm font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Small Private Groups</h4>
                  <p className="text-sm text-gray-600">
                    Maximum 6 people per tour for personalized attention and authentic experiences
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                  <span className="text-green-600 text-sm font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Expert Local Guides</h4>
                  <p className="text-sm text-gray-600">
                    Certified naturalists and cultural experts who bring Costa Rica's stories to life
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mt-1">
                  <span className="text-emerald-600 text-sm font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Flexible Schedules</h4>
                  <p className="text-sm text-gray-600">
                    Start times and itineraries customized to your preferences and travel plans
                  </p>
                </div>
              </div>
            </div>

            <a
              href="/private-tours"
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors"
            >
              Browse All Tours
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Most Popular Tours */}
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Most Popular Private Tours
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {popularTours.map((tour, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all group cursor-pointer"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <tour.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1">{tour.title}</h4>
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map((star) => (
                        <svg key={star} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  {tour.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900">{tour.price}</span>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}