// src/app/travel-guide/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Compass, Clock, Users, ArrowRight } from 'lucide-react';
import BookingNavbar from '@/components/booking/BookingNavbar';
import { getAllDestinations } from '@/lib/supabase-destinations';
import TravelGuideClient from '@/components/travel-guide/TravelGuideClient';

export const revalidate = 3600;

// Zonas geográficas
const ZONES = [
  { id: 'all', name: 'All Destinations', icon: '🌎' },
  { id: 'airports', name: 'Airports', icon: '✈️' },
  { id: 'northern', name: 'Northern Zone', icon: '🌋' },
  { id: 'caribbean', name: 'Caribbean', icon: '🌴' },
  { id: 'pacific-central', name: 'Central Pacific', icon: '🏖️' },
  { id: 'guanacaste', name: 'Guanacaste', icon: '☀️' },
  { id: 'pacific-south', name: 'South Pacific', icon: '🐒' },
];

export default async function TravelGuidePage() {
  const destinations = await getAllDestinations();

  return (
    <>
      <BookingNavbar />
      
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative h-[65vh] min-h-[450px] max-h-[700px] flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/Beatiful-waterfall-costa-rica-nature.webp"
              alt="Costa Rica Travel Guide"
              fill
              className="object-cover"
              priority
              quality={80}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
          </div>

          <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-20 sm:pt-0">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
              <Compass className="h-4 sm:h-5 w-4 sm:w-5 text-white" />
              <span className="text-white text-xs sm:text-sm font-medium uppercase tracking-wide">EXPLORE COSTA RICA</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
              Costa Rica Travel Guide
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-white/95 max-w-3xl mx-auto drop-shadow-lg leading-relaxed">
              Expert guides to {destinations.length} destinations. Practical tips from locals who live here.
            </p>
          </div>
        </section>

        {/* Client Component para filtros e interactividad */}
        <TravelGuideClient destinations={destinations} zones={ZONES} />

        {/* Final CTA */}
        <section className="py-16 bg-gradient-to-br from-blue-600 to-blue-700">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Explore Costa Rica?
            </h2>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              Book your private shuttle with professional drivers. Door-to-door service to any destination.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/transfers#booking-form"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 font-bold rounded-xl transition-colors shadow-xl"
              >
                <span>Book Transportation</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-800 hover:bg-blue-900 text-white font-bold rounded-xl border-2 border-blue-500 transition-colors"
              >
                Contact Us
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Professional Drivers</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Door-to-Door</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}