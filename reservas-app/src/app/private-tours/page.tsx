// src/app/private-tours/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, Users, MapPin, DollarSign } from 'lucide-react';
import BookingNavbar from '@/components/booking/BookingNavbar';
import { getAllTours } from '@/lib/supabase-tours';

export const revalidate = 3600; // Revalidar cada hora

export default async function PrivateToursPage() {
  const tours = await getAllTours();

  // Helper para determinar tiempo de manejo
  const getDriveTime = (slug: string) => {
    const driveTimes: Record<string, string> = {
      'poas-la-paz-waterfall': '2h drive',
      'rio-celeste-frog-sloth-tour': '1h drive',
      'bajos-del-toro-blue-falls': '1.5h drive',
    };
    return driveTimes[slug] || null;
  };

  return (
    <>
      <BookingNavbar />

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/arenal-volcano-mountains-sky-costa-rica.webp"
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
            <span className="text-white text-sm font-bold uppercase tracking-wide">📍 LOCAL OPERATOR • LA FORTUNA</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
            La Fortuna: Unlocked.
          </h1>
          
          <p className="text-lg md:text-xl text-white/95 max-w-3xl mx-auto drop-shadow-lg leading-relaxed mb-8">
            Experience the volcano region with the locals who know it best. Private tours, hidden spots, and zero rigid schedules. Just you and the rainforest.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-6 text-white">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span className="text-sm font-medium">Private Groups Only</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span className="text-sm font-medium">Full-Day Adventures</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span className="text-sm font-medium">Door-to-Door Pickup</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Category Title */}
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Private Tours
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Immersive experiences exploring the best of La Fortuna region
            </p>
          </div>

          {/* Tours Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour) => {
              const driveTime = getDriveTime(tour.slug);
              
              return (
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

                  {/* Drive Time Badge - NEW */}
                  {driveTime && (
                    <div className="absolute top-16 left-4 bg-orange-500/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <span className="text-white text-xs">🚗</span>
                      <span className="font-semibold text-xs text-white">{driveTime}</span>
                    </div>
                  )}

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
                    {tour.short_description}
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
                      <span>Max {tour.max_passengers}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>Pickup {tour.pickup_time}</span>
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="flex items-baseline gap-1">
                          <DollarSign className="h-5 w-5 text-blue-600" />
                          <span className="text-2xl font-bold text-blue-600">{tour.base_price}</span>
                        </div>
                        <p className="text-xs text-gray-500">2 people (min)</p>
                        <p className="text-xs text-gray-500">+${tour.price_per_extra_person} per extra person</p>
                      </div>
                    </div>
                    
                    <div className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 group-hover:gap-3">
                      <span>View Details</span>
                      <ArrowRight className="h-4 w-4 transition-all" />
                    </div>
                  </div>
                </div>
              </Link>
            );
            })}
          </div>

          {/* ✅ Custom Tours CTA - Elegante */}
          <div className="mt-16 bg-white rounded-2xl p-8 md:p-12 border-2 border-gray-200 shadow-lg">
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-6">
                <span className="text-3xl">✨</span>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Have Something Specific in Mind?
              </h3>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We can create custom itineraries combining multiple destinations or activities throughout Costa Rica. Tell us your interests and we'll design the perfect tour for you.
              </p>
              
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all shadow-md hover:shadow-xl"
              >
                <span>Contact Us</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Section - UPDATED */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Why Choose Our Private Tours?
          </h2>

          <div className="max-w-4xl mx-auto space-y-6">
            <p className="text-gray-700 leading-relaxed text-lg">
              La Fortuna sits at the foot of the Arenal Volcano, a region defined by dense rainforests and volcanic activity. From the chemical reaction that turns Río Celeste turquoise, to the 70-meter drop of La Fortuna Waterfall, this area holds some of Costa Rica's most important ecosystems.
            </p>
            
            <p className="text-gray-700 leading-relaxed text-lg">
              The landscape here is diverse. You can walk through cloud forests on hanging bridges to spot toucans and howler monkeys, or hike trails that offer clear views of the volcano's cone. It is a place where geothermal hot springs and cold waterfalls coexist within the same forest.
            </p>
            
            <p className="text-gray-700 leading-relaxed text-lg">
              <strong className="text-gray-900">The Local Difference:</strong> As a fully licensed local operator (ICT #4121-2025), we offer a deeper look into this region. Our certified guides are natives of La Fortuna; they know the history of the volcano, the biology of the rainforest, and exactly where to find wildlife without needing to guess.
            </p>
            
            <p className="text-gray-700 leading-relaxed text-lg">
              We keep our tours strictly private. We believe you should experience these places at your own pace, not on a bus schedule. The price always includes round-trip transportation, entrance fees, and a traditional lunch, ensuring a complete and seamless experience.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}