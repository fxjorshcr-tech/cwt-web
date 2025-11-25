// src/app/private-tours/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, Users, MapPin, DollarSign } from 'lucide-react';
import BookingNavbar from '@/components/booking/BookingNavbar';
import { getAllTours } from '@/lib/supabase-tours';

export default function PrivateToursPage() {
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Load tours
    async function loadTours() {
      const data = await getAllTours();
      setTours(data);
      setLoading(false);
    }
    loadTours();
  }, []);

  // Helper para determinar tiempo de manejo
  const getDriveTime = (slug: string) => {
    const driveTimes: Record<string, string> = {
      'poas-la-paz-waterfall': '2h drive',
      'rio-celeste-frog-sloth-tour': '1h drive',
      'bajos-del-toro-blue-falls': '1.5h drive',
    };
    return driveTimes[slug] || null;
  };

  if (loading) {
    return (
      <>
        <BookingNavbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <BookingNavbar />

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] max-h-[750px] flex items-center justify-center">
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

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-20 sm:pt-0">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
            <MapPin className="h-5 w-5 text-white" />
            <span className="text-white text-xs sm:text-sm font-bold uppercase tracking-wide">
              <span className="hidden sm:inline">📍 LOCAL OPERATOR • </span>
              <span className="sm:hidden">📍 </span>LA FORTUNA
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
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
      <section className="py-10 sm:py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 max-w-7xl">

          {/* Category Title */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Available Tours
            </h2>
            <p className="text-gray-600">
              Experience La Fortuna's best attractions with local guides who know every trail and secret spot.
            </p>
          </div>

          {/* Tours Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tours.map((tour) => {
              const driveTime = getDriveTime(tour.slug);

              return (
                <Link
                  key={tour.id}
                  href={`/private-tours/${tour.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all hover:-translate-y-1 border border-gray-100"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    {tour.image ? (
                      <Image
                        src={tour.image}
                        alt={tour.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        No image available
                      </div>
                    )}
                    {driveTime && (
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                        <MapPin className="h-3 w-3" />
                        {driveTime}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {tour.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {tour.short_description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        <span>{tour.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4" />
                        <span>Private</span>
                      </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">${tour.base_price}</p>
                        <p className="text-xs text-gray-500">per person</p>
                      </div>
                      <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                        <span>View Details</span>
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
