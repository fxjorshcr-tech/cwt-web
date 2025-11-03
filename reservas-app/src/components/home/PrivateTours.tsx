// src/components/home/PrivateTours.tsx
// Private tours section with CTA to tours page

'use client';

import { 
  Binoculars, 
  Sunrise, 
  Waves, 
  Mountain, 
  TreePine,
  Camera,
  ArrowRight,
  Star,
  Users,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function PrivateTours() {
  const tourCategories = [
    {
      icon: Mountain,
      title: 'Adventure Tours',
      examples: 'Zip-lining, Rafting, ATV',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Binoculars,
      title: 'Wildlife Watching',
      examples: 'Sloths, Monkeys, Birds',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Waves,
      title: 'Beach & Water',
      examples: 'Snorkeling, Surfing, Beaches',
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      icon: TreePine,
      title: 'Nature & Hiking',
      examples: 'Rainforest, Waterfalls, Trails',
      color: 'from-emerald-500 to-emerald-600'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <Binoculars className="h-5 w-5 text-orange-600" />
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
              Operated by Us
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Exclusive Private Tours Across Costa Rica
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience Costa Rica's natural wonders with our carefully curated private tours. 
            Small groups, expert local guides, and unforgettable adventures designed just for you.
          </p>
        </div>

        {/* Tour Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          {tourCategories.map((category, idx) => (
            <div
              key={idx}
              className="group bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-xl p-5 hover:border-orange-200 hover:shadow-lg transition-all duration-300 text-center"
            >
              <div className={`w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-md`}>
                <category.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1 text-sm md:text-base">
                {category.title}
              </h3>
              <p className="text-xs text-gray-600">
                {category.examples}
              </p>
            </div>
          ))}
        </div>

        {/* Main Feature Section */}
        <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
          {/* Left - Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[400px] group">
            <Image
              src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/private-shuttle-costa-rica-service.WEBP"
              alt="Costa Rica private tours - Arenal volcano adventure"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              </div>
              <p className="text-sm text-white/90">
                "Exceptional tours with knowledgeable guides and personalized experiences"
              </p>
            </div>
          </div>

          {/* Right - Content */}
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Private Tours?
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Unlike generic group tours, our private experiences are tailored to your interests, pace, 
              and schedule. Explore Costa Rica's hidden treasures with expert local guides who share 
              insider knowledge and passion for this incredible country.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Small Private Groups</h4>
                  <p className="text-sm text-gray-600">
                    Maximum 8 people per tour for personalized attention and authentic experiences
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sunrise className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Flexible Schedules</h4>
                  <p className="text-sm text-gray-600">
                    Start times and itineraries customized to your preferences and travel plans
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Camera className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Expert Local Guides</h4>
                  <p className="text-sm text-gray-600">
                    Certified naturalists and cultural experts who bring Costa Rica's stories to life
                  </p>
                </div>
              </div>
            </div>

            <Link href="/private-tours">
              <button className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-xl">
                <span>Browse All Tours</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
          </div>
        </div>

        {/* Tour Features Banner */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="h-6 w-6" />
              </div>
              <p className="text-2xl font-bold mb-1">Full Day</p>
              <p className="text-sm text-orange-100">Most tours 6-8 hours</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="h-6 w-6" />
              </div>
              <p className="text-2xl font-bold mb-1">Max 8</p>
              <p className="text-sm text-orange-100">People per group</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="h-6 w-6" />
              </div>
              <p className="text-2xl font-bold mb-1">5-Star</p>
              <p className="text-sm text-orange-100">Rated experiences</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Binoculars className="h-6 w-6" />
              </div>
              <p className="text-2xl font-bold mb-1">15+</p>
              <p className="text-sm text-orange-100">Unique tours offered</p>
            </div>
          </div>
        </div>

        {/* Popular Tours Preview */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Most Popular Private Tours
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border-2 border-gray-100 rounded-xl p-6 hover:border-orange-200 hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Mountain className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Arenal Volcano Tour</h4>
                  <div className="flex items-center gap-1 text-xs text-yellow-500">
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Explore the iconic volcano, hot springs, and rainforest trails with expert naturalist guides.
              </p>
              <p className="text-sm text-gray-900 font-semibold">From $95 per person</p>
            </div>

            <div className="bg-white border-2 border-gray-100 rounded-xl p-6 hover:border-orange-200 hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <TreePine className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Monteverde Cloud Forest</h4>
                  <div className="flex items-center gap-1 text-xs text-yellow-500">
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Walk among clouds on hanging bridges, spot exotic birds, and discover unique wildlife.
              </p>
              <p className="text-sm text-gray-900 font-semibold">From $85 per person</p>
            </div>

            <div className="bg-white border-2 border-gray-100 rounded-xl p-6 hover:border-orange-200 hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                  <Waves className="h-6 w-6 text-cyan-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Manuel Antonio Park</h4>
                  <div className="flex items-center gap-1 text-xs text-yellow-500">
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Pristine beaches, monkeys, sloths, and incredible biodiversity in one stunning location.
              </p>
              <p className="text-sm text-gray-900 font-semibold">From $75 per person</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}