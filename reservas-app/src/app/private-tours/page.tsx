// app/private-tours/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, Users, MapPin, Star, Check } from 'lucide-react';
import BookingNavbar from '@/components/booking/BookingNavbar';

// Definición de áreas con descripciones
const AREAS = [
  { 
    id: 'guanacaste', 
    name: 'Guanacaste', 
    icon: '☀️',
    description: 'Costa Rica\'s sunniest province on the Pacific northwest coast. Famous for consistent dry season weather, spectacular beaches, active volcanoes, and incredible wildlife. From December to April, Guanacaste offers near-guaranteed sunshine and is home to pristine national parks, luxury resorts, and authentic ranch culture. Perfect for combining beach relaxation with adventure activities.'
  },
  { 
    id: 'sjo', 
    name: 'SJO Area', 
    icon: '🏛️',
    description: 'The Central Valley surrounding San José offers Costa Rica\'s most accessible adventures. Located at pleasant elevation with year-round spring-like weather, this region is perfect for coffee plantation tours, active volcanoes like Poás and Irazú, spectacular waterfalls, and day trips to both Pacific coasts. Ideal for travelers with limited time or those arriving/departing through Juan Santamaría International Airport.'
  },
  { 
    id: 'la-fortuna', 
    name: 'La Fortuna', 
    icon: '🌋',
    description: 'Costa Rica\'s adventure capital dominated by the majestic Arenal Volcano. This region perfectly blends thrilling activities with natural relaxation—volcano hikes, hanging bridges, waterfall swims, white-water rafting, and world-class hot springs all in one destination. La Fortuna sits in the northern lowlands where rainforest meets volcano, creating ideal conditions for wildlife viewing and outdoor adventures year-round.'
  },
];

// Tours por área
const tours = {
  guanacaste: [
    {
      id: 'rincon-adventure',
      name: 'Rincón de la Vieja Adventure',
      shortDesc: 'Volcano hikes, hot springs, waterfalls & zip-lining',
      image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/waterfall-costa-rica-tour.webp',
      duration: 'Full Day (8-10 hours)',
      groupSize: 'Max 6 people',
      price: 'From $125',
      rating: 4.9,
      reviews: 247,
      highlights: [
        'Bubbling mud pots & volcanic fumaroles',
        'Natural hot springs soak',
        'Waterfall swim & jungle hike',
        'Optional zip-lining through canopy'
      ],
      included: [
        'Professional bilingual guide',
        'Transportation from/to hotel',
        'Lunch & refreshments',
        'Park entrance fees',
        'All equipment provided'
      ],
      notIncluded: [
        'Additional drinks',
        'Tips (optional)',
        'Personal expenses'
      ]
    },
    {
      id: 'catamaran-sailing',
      name: 'Catamaran Sunset Sailing',
      shortDesc: 'Snorkel, dolphins, open bar & spectacular sunset',
      image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/aerial-view-conchal-beach.webp',
      duration: 'Half Day (4-5 hours)',
      groupSize: 'Max 6 people',
      price: 'From $85',
      rating: 5.0,
      reviews: 412,
      highlights: [
        'Sail along stunning Guanacaste coast',
        'Snorkel in crystal-clear bays',
        'Spot dolphins, turtles & flying fish',
        'Open bar & fresh tropical fruits',
        'Watch sunset over Pacific Ocean'
      ],
      included: [
        'Catamaran cruise',
        'Snorkel equipment & instruction',
        'Open bar (beer, wine, cocktails)',
        'Fresh fruit & snacks',
        'Beach hotel pickup'
      ],
      notIncluded: [
        'Hotel drop-off (own transport back)',
        'Photos (available for purchase)',
        'Tips for crew'
      ]
    },
    {
      id: 'palo-verde-wildlife',
      name: 'Palo Verde Wetlands Safari',
      shortDesc: 'Boat tour through crocodile & bird paradise',
      image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/waterfall-costa-rica-tour.webp',
      duration: 'Half Day (5-6 hours)',
      groupSize: 'Max 6 people',
      price: 'From $95',
      rating: 4.8,
      reviews: 189,
      highlights: [
        'Boat safari through Tempisque River',
        'See massive crocodiles up close',
        'Over 300 bird species spotted',
        'Howler monkeys & iguanas',
        'Expert naturalist guide commentary'
      ],
      included: [
        'Boat tour with naturalist guide',
        'Hotel transportation',
        'Lunch at local restaurant',
        'Binoculars provided',
        'Park entrance'
      ],
      notIncluded: [
        'Additional beverages',
        'Gratuities',
        'Travel insurance'
      ]
    }
  ],

  sjo: [
    {
      id: 'coffee-plantation',
      name: 'Coffee Plantation Experience',
      shortDesc: 'Bean to cup journey at award-winning finca',
      image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/waterfall-costa-rica-tour.webp',
      duration: 'Half Day (4 hours)',
      groupSize: 'Max 6 people',
      price: 'From $65',
      rating: 4.9,
      reviews: 324,
      highlights: [
        'Tour organic coffee plantation',
        'Learn roasting & brewing techniques',
        'Taste multiple coffee varieties',
        'Visit processing facilities',
        'Take home fresh roasted beans'
      ],
      included: [
        'Plantation tour with coffee expert',
        'Coffee tasting session',
        'Light snacks',
        'Transportation from San José',
        'Small bag of coffee gift'
      ],
      notIncluded: [
        'Additional coffee purchases',
        'Lunch (available)',
        'Tips'
      ]
    },
    {
      id: 'poas-volcano',
      name: 'Poás Volcano & La Paz Waterfall',
      shortDesc: 'Active crater, cloud forest & stunning waterfalls',
      image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/sjo-costa-rica-city-sunset.webp',
      duration: 'Full Day (8-9 hours)',
      groupSize: 'Max 6 people',
      price: 'From $110',
      rating: 4.9,
      reviews: 567,
      highlights: [
        'View Poás active volcanic crater',
        'Walk through cloud forest trails',
        'Visit 5 spectacular waterfalls',
        'Wildlife rescue center tour',
        'Hummingbird garden experience'
      ],
      included: [
        'Professional guide',
        'All park entrance fees',
        'Lunch at mountain lodge',
        'Hotel pickup/drop-off',
        'Bottled water'
      ],
      notIncluded: [
        'Breakfast',
        'Additional souvenirs',
        'Optional donations'
      ]
    },
    {
      id: 'tortuga-island',
      name: 'Tortuga Island Beach Escape',
      shortDesc: 'Paradise island with white sand & turquoise water',
      image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/aerial-view-conchal-beach.webp',
      duration: 'Full Day (9-10 hours)',
      groupSize: 'Max 6 people',
      price: 'From $125',
      rating: 5.0,
      reviews: 289,
      highlights: [
        'Boat ride through Gulf of Nicoya',
        'Pristine white-sand beach',
        'Snorkeling in crystal waters',
        'Beach volleyball & kayaking',
        'Fresh seafood BBQ lunch'
      ],
      included: [
        'Round-trip boat transportation',
        'Snorkel equipment',
        'Lunch on the beach',
        'Tropical fruit & drinks',
        'Beach hotel pickup/return'
      ],
      notIncluded: [
        'Alcoholic beverages',
        'Towels (bring your own)',
        'Tips for crew'
      ]
    }
  ],

  'la-fortuna': [
    {
      id: 'arenal-combo',
      name: 'Arenal Volcano & Hot Springs Combo',
      shortDesc: 'Volcano hike, La Fortuna Waterfall & thermal pools',
      image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/arenal-volcano-tour-visit.webp',
      duration: 'Full Day (10-12 hours)',
      groupSize: 'Max 6 people',
      price: 'From $145',
      rating: 5.0,
      reviews: 623,
      highlights: [
        'Hike Arenal Volcano trails',
        'Swim at La Fortuna Waterfall',
        'Relax in natural hot springs',
        'Explore lava rock formations',
        'Dinner at hot springs resort'
      ],
      included: [
        'Expert naturalist guide',
        'All park entrances',
        'Hot springs access',
        'Lunch & dinner included',
        'Hotel transportation',
        'Towels provided'
      ],
      notIncluded: [
        'Drinks at restaurants',
        'Spa treatments',
        'Gratuities'
      ]
    },
    {
      id: 'hanging-bridges',
      name: 'Rainforest Hanging Bridges Walk',
      shortDesc: 'Canopy bridges, wildlife spotting & nature trails',
      image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/waterfall-costa-rica-tour.webp',
      duration: 'Half Day (4-5 hours)',
      groupSize: 'Max 6 people',
      price: 'From $75',
      rating: 4.8,
      reviews: 445,
      highlights: [
        'Walk 16 bridges through canopy',
        'Spot sloths, monkeys & toucans',
        'Expert guide wildlife tracking',
        'Panoramic volcano views',
        'Easy trail suitable for all ages'
      ],
      included: [
        'Professional guide',
        'Park entrance',
        'Hotel pickup/drop-off',
        'Binoculars provided',
        'Snacks & water'
      ],
      notIncluded: [
        'Lunch',
        'Photography services',
        'Tips'
      ]
    },
    {
      id: 'rio-celeste',
      name: 'Río Celeste Blue Waterfall Hike',
      shortDesc: 'Turquoise waterfall, jungle trails & hot springs',
      image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/waterfall-costa-rica-tour.webp',
      duration: 'Full Day (9-10 hours)',
      groupSize: 'Max 6 people',
      price: 'From $130',
      rating: 5.0,
      reviews: 378,
      highlights: [
        'Hike to stunning blue waterfall',
        'See where rivers turn turquoise',
        'Volcanic hot springs visit',
        'Beautiful jungle trails',
        'Swimming in natural pools'
      ],
      included: [
        'Bilingual naturalist guide',
        'Tenorio Park entrance',
        'Lunch at local restaurant',
        'Hotel transportation',
        'Rubber boots provided'
      ],
      notIncluded: [
        'Additional drinks',
        'Optional souvenirs',
        'Gratuities'
      ]
    }
  ]
};

export default function PrivateToursPage() {
  const [activeArea, setActiveArea] = useState('guanacaste');

  const activeTours = tours[activeArea as keyof typeof tours];

  return (
    <>
      {/* Navbar */}
      <BookingNavbar />

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/Beatiful-waterfall-costa-rica-nature.webp"
            alt="Costa Rica Private Tours"
            fill
            className="object-cover"
            priority
            quality={80}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
            <MapPin className="h-5 w-5 text-white" />
            <span className="text-white text-sm font-medium">TAILORED PRIVATE TOURS</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
            Costa Rica Private Tours
          </h1>
          
          <p className="text-lg md:text-xl text-white/95 max-w-3xl mx-auto drop-shadow-lg leading-relaxed">
            Expertly curated experiences with professional guides. Small groups, personalized attention, unforgettable adventures.
          </p>
        </div>
      </section>

      {/* Area Tabs */}
      <div id="tours" className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2 justify-center">
            {AREAS.map(area => (
              <button
                key={area.id}
                onClick={() => setActiveArea(area.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full whitespace-nowrap font-semibold transition-all ${
                  activeArea === area.id
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-lg">{area.icon}</span>
                <span>{area.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Small Commitment Note */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <div className="container mx-auto px-4 py-3">
          <p className="text-center text-sm text-gray-700">
            <span className="font-semibold text-blue-700">We only offer tours we directly operate</span> — ensuring quality and personalized service
          </p>
        </div>
      </div>

      {/* Tours Grid */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Area Title & Description */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
              {AREAS.find(a => a.id === activeArea)?.name} Tours
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-6 md:p-8 border-2 border-gray-200 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="text-4xl flex-shrink-0">
                    {AREAS.find(a => a.id === activeArea)?.icon}
                  </div>
                  <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                    {AREAS.find(a => a.id === activeArea)?.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tours Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeTours.map((tour) => (
              <div
                key={tour.id}
                className="bg-white rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-blue-400 hover:shadow-2xl transition-all group"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={tour.image}
                    alt={tour.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    quality={70}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-sm">{tour.rating}</span>
                    <span className="text-xs text-gray-600">({tour.reviews})</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {tour.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{tour.shortDesc}</p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{tour.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{tour.groupSize}</span>
                    </div>
                  </div>

                  {/* Top Highlights */}
                  <div className="mb-4">
                    <ul className="space-y-1">
                      {tour.highlights.slice(0, 3).map((highlight, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price & CTA */}
                  <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{tour.price}</p>
                      <p className="text-xs text-gray-500">per person</p>
                    </div>
                    <Link
                      href={`/contact?tour=${tour.id}`}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                    >
                      <span>Book Now</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Custom Tour CTA */}
          <div className="mt-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 border border-blue-100 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Don't See What You're Looking For?
            </h3>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              We specialize in creating custom itineraries tailored to your interests, schedule, and budget. 
              Let us design the perfect Costa Rica experience just for you.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg"
            >
              <span>Request Custom Tour</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}