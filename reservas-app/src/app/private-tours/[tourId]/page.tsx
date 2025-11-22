// src/app/private-tours/[tourId]/page.tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft, Clock, Users, MapPin, DollarSign, 
  CheckCircle, XCircle, AlertCircle, Star 
} from 'lucide-react';
import BookingNavbar from '@/components/booking/BookingNavbar';
import { getTourBySlug, getAllTours } from '@/lib/supabase-tours';
import { TourGallery } from '@/components/tours/TourGallery';
import { TourItinerary } from '@/components/tours/TourItinerary';

export const revalidate = 3600;

export async function generateStaticParams() {
  const tours = await getAllTours();
  return tours.map((tour) => ({
    tourId: tour.slug,
  }));
}

interface PageProps {
  params: {
    tourId: string;
  };
}

export default async function TourDetailPage({ params }: PageProps) {
  const tour = await getTourBySlug(params.tourId);

  if (!tour) {
    notFound();
  }

  // Determinar tiempo de manejo
  const getDriveTime = (slug: string) => {
    const driveTimes: Record<string, { time: string; description: string }> = {
      'poas-la-paz-waterfall': { 
        time: '2h drive', 
        description: 'Beautiful 2-hour mountain drive to Poás' 
      },
      'rio-celeste-frog-sloth-tour': { 
        time: '1h drive', 
        description: 'Scenic 1-hour drive each way from La Fortuna' 
      },
      'bajos-del-toro-blue-falls': { 
        time: '1.5h drive', 
        description: 'Scenic 1.5-hour drive through mountain countryside' 
      },
    };
    return driveTimes[slug] || null;
  };

  const driveTimeInfo = getDriveTime(params.tourId);

 const difficultyColors: Record<string, string> = {
  Easy: 'text-green-600 bg-green-50 border-green-200',
  Moderate: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  Challenging: 'text-red-600 bg-red-50 border-red-200'
};

  return (
    <>
      <BookingNavbar />

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-end">
        <div className="absolute inset-0 z-0">
          <Image
            src={tour.image}
            alt={tour.name}
            fill
            className="object-cover"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
        </div>

        <div className="relative z-10 w-full pb-12 px-6 pt-20 sm:pt-0">
          <div className="container mx-auto max-w-6xl">
            {/* Back Button */}
            <Link
              href="/private-tours"
              className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Tours</span>
            </Link>

            <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
              {tour.name}
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-white/95 max-w-3xl drop-shadow-lg mb-6">
              {tour.short_description}
            </p>

            {/* Quick Info Badges */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <div className="px-3 sm:px-4 py-2 bg-white/95 backdrop-blur-sm rounded-lg flex items-center gap-2">
                <Clock className="h-4 sm:h-5 w-4 sm:w-5 text-blue-600" />
                <span className="font-semibold text-sm sm:text-base">{tour.duration}</span>
              </div>
              <div className="px-3 sm:px-4 py-2 bg-white/95 backdrop-blur-sm rounded-lg flex items-center gap-2">
                <Users className="h-4 sm:h-5 w-4 sm:w-5 text-blue-600" />
                <span className="font-semibold text-sm sm:text-base">Max {tour.max_passengers}</span>
              </div>
              <div className={`px-3 sm:px-4 py-2 backdrop-blur-sm rounded-lg flex items-center gap-2 border ${difficultyColors[tour.difficulty]}`}>
                <AlertCircle className="h-4 sm:h-5 w-4 sm:w-5" />
                <span className="font-semibold text-sm sm:text-base">{tour.difficulty}</span>
              </div>
              <div className="px-3 sm:px-4 py-2 bg-white/95 backdrop-blur-sm rounded-lg flex items-center gap-2">
                <MapPin className="h-4 sm:h-5 w-4 sm:w-5 text-blue-600" />
                <span className="font-semibold text-sm sm:text-base truncate max-w-[100px] sm:max-w-none">{tour.pickup_time}</span>
              </div>
              {driveTimeInfo && (
                <div className="px-3 sm:px-4 py-2 bg-orange-500/95 backdrop-blur-sm rounded-lg flex items-center gap-2">
                  <span className="text-white text-sm sm:text-base">🚗</span>
                  <span className="font-semibold text-white text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">{driveTimeInfo.time}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Overview - Short Description */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tour Overview</h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {tour.short_description}
                </p>
              </div>

              {/* Photo Gallery */}
              {tour.gallery && tour.gallery.length > 0 && (
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Tour Photos</h2>
                  <TourGallery images={tour.gallery} tourName={tour.name} />
                </div>
              )}

              {/* Highlights */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Tour Highlights</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {tour.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                        <Star className="h-4 w-4 text-green-600 fill-green-600" />
                      </div>
                      <span className="text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tour Itinerary - UPDATED with new component */}
              <TourItinerary description={tour.long_description} />

              {/* What's Included / Not Included */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Included */}
                <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
                  <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="h-6 w-6" />
                    What's Included
                  </h3>
                  <ul className="space-y-2">
                    {tour.included.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Not Included */}
                <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-200">
                  <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
                    <XCircle className="h-6 w-6" />
                    Not Included
                  </h3>
                  <ul className="space-y-2">
                    {tour.not_included.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* What to Bring */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">What to Bring</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {tour.what_to_bring.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-700">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Important Notes */}
              <div className="bg-amber-50 rounded-2xl p-8 border-2 border-amber-200">
                <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-2">
                  <AlertCircle className="h-6 w-6" />
                  Important Information
                </h2>
                <ul className="space-y-3">
                  {tour.important_notes.map((note, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <span className="text-amber-600 mt-1">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column - Booking Card (Sticky) */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-6">
                {/* Price Card */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-200">
                  <div className="text-center mb-6">
                    <div className="inline-block px-4 py-1 bg-blue-100 rounded-full text-blue-700 text-sm font-semibold mb-4">
                      Private Tour Price
                    </div>
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                      <DollarSign className="h-8 w-8 text-blue-600" />
                      <span className="text-5xl font-bold text-blue-600">{tour.base_price}</span>
                    </div>
                    <p className="text-gray-600 font-medium mb-1">
                      For 2 people (minimum)
                    </p>
                    <p className="text-sm text-gray-500">
                      + ${tour.price_per_extra_person} per additional person (max {tour.max_passengers})
                    </p>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-semibold">{tour.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Group size:</span>
                        <span className="font-semibold">2-{tour.max_passengers} people</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pickup time:</span>
                        <span className="font-semibold">{tour.pickup_time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Min age:</span>
                        <span className="font-semibold">{tour.min_age}+ years</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/private-tours/booking?tour=${tour.slug}`}
                    className="block w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors text-center text-lg shadow-lg"
                  >
                    Book This Tour
                  </Link>

                  <p className="text-center text-xs text-gray-500 mt-4">
                    Secure booking • Instant confirmation
                  </p>
                </div>

                {/* Contact Card - UNIFIED */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                  <h3 className="font-bold text-gray-900 text-lg mb-3">Got Questions?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Contact us on WhatsApp for instant answers about this tour or custom requests. 
                    For groups larger than {tour.max_passengers} people, we can provide a custom quote.
                  </p>
                  <Link
                    href={`https://wa.me/50685962438?text=Hi!%20I%20have%20questions%20about%20the%20${encodeURIComponent(tour.name)}%20tour`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors text-center"
                  >
                    Chat on WhatsApp
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}