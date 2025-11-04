// app/travel-guide/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin, Compass, Info } from 'lucide-react';

export const metadata = {
  title: 'Costa Rica Travel Guide 2026 | Local Expert Tips & Destination Guides',
  description: 'Your complete insider guide to Costa Rica. Expert answers to Reddit\'s most-asked questions, hidden gems, and practical tips from locals.',
  keywords: 'Costa Rica travel guide 2026, Costa Rica tips, La Fortuna guide, Manuel Antonio travel, Monteverde Costa Rica, best beaches Costa Rica, Costa Rica itinerary 2026'
};

export default function TravelGuidePage() {
  const destinations = [
    {
      name: 'San José (SJO)',
      slug: 'san-jose-sjo',
      description: 'Costa Rica\'s vibrant capital and main gateway. Where to stay, what to do, and how to navigate the city safely.',
      image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/sjo-costa-rica-city-sunset.webp',
      highlights: ['Airport transfers', 'City tours', 'Museums & culture'],
      hasImage: true
    },
    {
      name: 'La Fortuna / Arenal Volcano',
      slug: 'la-fortuna-arenal',
      description: 'Adventure capital with the iconic Arenal Volcano, hot springs, waterfalls, and endless outdoor activities.',
      image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/arenal-volcano-tour-visit.webp',
      highlights: ['Volcano tours', 'Hot springs', 'Waterfall hikes'],
      hasImage: true
    },
    {
      name: 'Puerto Viejo / Cahuita',
      slug: 'puerto-viejo-cahuita',
      description: 'Caribbean coast paradise with Afro-Caribbean culture, pristine beaches, and incredible snorkeling spots.',
      image: null,
      highlights: ['Beach vibes', 'Snorkeling', 'Local culture'],
      hasImage: false
    },
    {
      name: 'Manuel Antonio',
      slug: 'manuel-antonio',
      description: 'World-famous national park combining stunning beaches with incredible wildlife viewing opportunities.',
      image: null,
      highlights: ['National park', 'Beach & jungle', 'Wildlife'],
      hasImage: false
    },
    {
      name: 'Quepos',
      slug: 'quepos',
      description: 'Gateway to Manuel Antonio with sport fishing, jungle adventures, and authentic local experiences.',
      image: null,
      highlights: ['Sport fishing', 'Adventure tours', 'Local eats'],
      hasImage: false
    },
    {
      name: 'Uvita',
      slug: 'uvita',
      description: 'Hidden gem of the South Pacific with whale watching, pristine beaches, and the famous Whale\'s Tail.',
      image: null,
      highlights: ['Whale watching', 'Waterfalls', 'Quiet beaches'],
      hasImage: false
    },
    {
      name: 'Sámara / Nosara',
      slug: 'samara-nosara',
      description: 'Laid-back beach towns perfect for surfing, yoga retreats, and experiencing the pure vida lifestyle.',
      image: null,
      highlights: ['Surfing', 'Yoga', 'Beaches'],
      hasImage: false
    },
    {
      name: 'Guanacaste Beaches',
      slug: 'guanacaste-beaches',
      description: 'Gold coast beaches including Tamarindo, Flamingo, Conchal, and Papagayo with luxury resorts and adventures.',
      image: null,
      highlights: ['Beach resorts', 'Snorkeling', 'Nightlife'],
      hasImage: false
    },
    {
      name: 'Monteverde Cloud Forest',
      slug: 'monteverde',
      description: 'Mystical cloud forest with hanging bridges, zip-lining, and unique wildlife in misty mountain settings.',
      image: null,
      highlights: ['Cloud forest', 'Hanging bridges', 'Zip-lining'],
      hasImage: false
    },
    {
      name: 'Rincón de la Vieja',
      slug: 'rincon-de-la-vieja',
      description: 'Active volcano area with bubbling mud pots, hot springs, horseback riding, and authentic ranch experiences.',
      image: null,
      highlights: ['Volcano hikes', 'Hot springs', 'Horseback riding'],
      hasImage: false
    }
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/waterfall-costa-rica-tour.webp"
            alt="Costa Rica Travel Guide - Waterfall Adventure"
            fill
            className="object-cover"
            priority
            loading="eager"
            quality={85}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
            <Compass className="h-5 w-5 text-white" />
            <span className="text-white text-sm font-medium">EXPLORE COSTA RICA</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
            Costa Rica Travel Guide 2026
          </h1>
          
          <p className="text-lg md:text-xl text-white/95 max-w-3xl mx-auto drop-shadow-lg leading-relaxed">
            Your complete insider's guide to Costa Rica. Expert answers to Reddit's most-asked questions, 
            hidden gems, and practical tips from locals.
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-4">
              <Info className="h-5 w-5 text-blue-600" />
              <span className="text-blue-600 text-sm font-semibold">LOCAL EXPERTISE</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Thousands of Travelers
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              We've researched the most frequently asked questions on Reddit, travel forums, and AI platforms, 
              combining them with our years of local experience to create comprehensive guides for each destination. 
              No fluff—just practical, honest advice from people who live and work in Costa Rica.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
              <div className="text-4xl font-bold text-blue-600 mb-2">10+</div>
              <p className="text-sm text-gray-600">Major Destinations Covered</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
              <div className="text-4xl font-bold text-orange-500 mb-2">100+</div>
              <p className="text-sm text-gray-600">Local Tips & Insights</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
              <div className="text-4xl font-bold text-green-600 mb-2">Real</div>
              <p className="text-sm text-gray-600">Local Expert Knowledge</p>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Cascade Layout */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Destination
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Click on any destination to discover insider tips, practical advice, and everything you need 
              to know before you go
            </p>
          </div>

          <div className="space-y-12">
            {destinations.map((destination, index) => {
              const isImageRight = index % 2 === 0;
              
              return (
                <Link
                  key={destination.slug}
                  href={`/travel-guide/${destination.slug}`}
                  className="group block"
                >
                  <div className={`flex flex-col ${isImageRight ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300`}>
                    {/* Image Side */}
                    <div className="md:w-1/2 relative h-72 md:h-96 bg-gray-200 overflow-hidden">
                      {destination.hasImage && destination.image ? (
                        <Image
                          src={destination.image}
                          alt={`${destination.name} Travel Guide`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                          <MapPin className="h-20 w-20 text-white/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      
                      {/* Badge */}
                      <div className="absolute top-6 right-6">
                        {destination.hasImage ? (
                          <span className="px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-full shadow-lg">
                            ✓ Complete Guide
                          </span>
                        ) : (
                          <span className="px-4 py-2 bg-orange-500 text-white text-sm font-bold rounded-full shadow-lg">
                            Coming Soon
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content Side */}
                    <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
                      <div className="mb-4">
                        <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                          Destination #{index + 1}
                        </span>
                      </div>
                      
                      <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                        {destination.name}
                      </h3>
                      
                      <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                        {destination.description}
                      </p>

                      {/* Highlights */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {destination.highlights.map((highlight, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>

                      {/* CTA */}
                      <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-4 transition-all">
                        <span>Explore {destination.name}</span>
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Need Help Planning Your Trip?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Our team of local experts can help you create the perfect Costa Rica itinerary, 
            arrange transportation, and book tours
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
            >
              Contact Our Team
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-bold rounded-xl border-2 border-gray-200 transition-colors"
            >
              Book Transportation
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}