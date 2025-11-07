import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabaseClient";
import { BookingFormWrapper } from "@/components/home/BookingFormWrapper";
import BookingSteps from "@/components/booking/BookingSteps";
import WhyPrivateShuttle from "@/components/home/WhyPrivateShuttle";
import TrustIndicators from "@/components/home/TrustIndicators";
import ValueProposition from "@/components/home/ValueProposition";
import TravelGuide from "@/components/home/TravelGuide";
import PrivateTours from "@/components/home/PrivateTours";
import GoogleReviews from "@/components/home/GoogleReviews";
import FAQ from "@/components/home/FAQ";
import FinalCTA from "@/components/home/FinalCTA";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToFormButton from "@/components/ScrollToFormButton";
import BackToFormButton from "@/components/BackToFormButton";
import StructuredData from "@/components/SEO/StructuredData";
import type { Metadata } from 'next';
import Script from 'next/script';

// ✅ SEO META TAGS
export const metadata: Metadata = {
  title: 'Private Shuttle Costa Rica | Airport Transfers SJO & LIR | Can\'t Wait Travel',
  description: 'Professional private shuttle service in Costa Rica. Door-to-door transfers from San José (SJO) and Liberia (LIR) airports to La Fortuna, Manuel Antonio, Tamarindo, Monteverde. Bilingual drivers, modern vehicles, ICT licensed.',
  
  keywords: [
    'private shuttle costa rica',
    'costa rica airport transfer',
    'SJO airport shuttle',
    'LIR airport transportation',
    'private transfer la fortuna',
    'shuttle to manuel antonio',
    'costa rica transportation service',
    'bilingual driver costa rica',
    'can\'t wait travel'
  ],

  openGraph: {
    title: 'Private Shuttle Costa Rica | Can\'t Wait Travel',
    description: 'Professional private shuttle service with bilingual drivers. Book your Costa Rica airport transfer today.',
    url: 'https://cantwaittravelcr.com',
    siteName: 'Can\'t Wait Travel',
    images: [
      {
        url: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/aerial-view-conchal-beach.webp',
        width: 1200,
        height: 630,
        alt: 'Costa Rica Beach - Private Shuttle Service',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Private Shuttle Costa Rica | Can\'t Wait Travel',
    description: 'Professional airport transfers and private shuttle service across Costa Rica.',
    images: ['https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/aerial-view-conchal-beach.webp'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  alternates: {
    canonical: 'https://cantwaittravelcr.com',
  },
};

interface Location {
  id: string;
  name: string;
  display_name: string;
}

async function getLocations(): Promise<Location[]> {
  const supabase = createClient();
  
  const { data: routes, error } = await supabase
    .from('routes')
    .select('origen, destino');

  if (error) {
    console.error('❌ Error:', error);
    return [];
  }

  const locationsSet = new Set<string>();
  routes?.forEach(route => {
    if (route.origen) locationsSet.add(route.origen);
    if (route.destino) locationsSet.add(route.destino);
  });

  const locations: Location[] = Array.from(locationsSet)
    .map(loc => ({
      id: loc,
      name: loc,
      display_name: loc.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    }))
    .sort((a, b) => a.display_name.localeCompare(b.display_name));

  console.log('✅ Locations:', locations.length);
  return locations;
}

export default async function Home() {
  const locations = await getLocations();

  return (
    <>
      {/* Google Analytics 4 - Commented out until you add your real Measurement ID
          This placeholder is causing the "third-party cookies" warning in Lighthouse.
          When you're ready to go live:
          1. Create your GA4 account at https://analytics.google.com
          2. Get your Measurement ID (G-XXXXXXXXXX)
          3. Replace both instances of G-XXXXXXXXXX below
          4. Uncomment this section
      */}
      {/* 
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
        strategy="afterInteractive"
        async
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XXXXXXXXXX');
        `}
      </Script>
      */}

      <main className="min-h-screen">
        
        {/* SEO - Structured Data for Google */}
        <StructuredData />

        {/* Navigation */}
        <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-96 h-24 md:w-[28rem] md:h-28">
                <Image
                  src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/logo-cant-wait-travel.webp?width=448&quality=85"
                  alt="Can't Wait Travel - Costa Rica Private Shuttle Service"
                  fill
                  sizes="(max-width: 768px) 384px, 448px"
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-white hover:text-gray-200 transition font-medium">Home</Link>
              <Link href="/transfers" className="text-white hover:text-gray-200 transition font-medium">Transfers</Link>
              <Link href="/private-tours" className="text-white hover:text-gray-200 transition font-medium">Private Tours</Link>
              <Link href="/travel-guide" className="text-white hover:text-gray-200 transition font-medium">Travel Guide</Link>
              <Link href="/about" className="text-white hover:text-gray-200 transition font-medium">About</Link>
              <Link href="/contact" className="text-white hover:text-gray-200 transition font-medium">Contact</Link>
              <Button size="lg" className="rounded-full px-8" aria-label="Book shuttle now">Book Now</Button>
            </div>

            <div className="md:hidden">
              <Button size="lg" className="rounded-full" aria-label="Book shuttle">Book</Button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative h-screen">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/aerial-view-conchal-beach.webp?width=1920&quality=75"
              alt="Private Shuttle Costa Rica - Beach Transportation Service"
              fill
              sizes="100vw"
              className="object-cover"
              priority
              quality={75}
              placeholder="blur"
              blurDataURL="data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA="
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>

          <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
            <div className="text-center max-w-4xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-2xl leading-tight">
                PRIVATE TRANSPORTATION
              </h1>
              
              <p className="text-sm sm:text-base md:text-lg text-white/95 mb-6 drop-shadow-lg max-w-3xl mx-auto">
                Professional shuttle service from SJO & LIR to all major Costa Rica destinations
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-6">
                <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white drop-shadow-2xl tracking-wider">
                  TRUSTED
                </span>
                <span className="text-white text-lg sm:text-xl">•</span>
                <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white drop-shadow-2xl tracking-wider">
                  FLEXIBLE
                </span>
                <span className="text-white text-lg sm:text-xl">•</span>
                <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white drop-shadow-2xl tracking-wider">
                  AUTHENTIC
                </span>
              </div>
            </div>

            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <svg className="w-6 h-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </div>
          </div>
        </section>

        {/* Booking Form */}
        <section id="booking-form" className="relative -mt-32 z-20 px-6 pb-20">
          <Suspense fallback={
            <div className="w-full max-w-5xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12">
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full" />
                  <p className="text-gray-600">Loading booking form...</p>
                </div>
              </div>
            </div>
          }>
            <BookingFormWrapper locations={locations} />
          </Suspense>
        </section>

        {/* Booking Steps */}
        <BookingSteps />

        {/* Why Private Shuttle */}
        <WhyPrivateShuttle />

        {/* Trust Indicators - Drivers */}
        <TrustIndicators />

        {/* Value Proposition - Routes */}
        <ValueProposition />

        {/* Travel Guide */}
        <TravelGuide />

        {/* Private Tours */}
        <PrivateTours />

        {/* Google Reviews */}
        <GoogleReviews />

        {/* FAQ */}
        <FAQ />

        {/* Final CTA */}
        <FinalCTA />

        {/* Back to Form Button */}
        <BackToFormButton />

        {/* Scroll to Form Button */}
        <ScrollToFormButton />

        {/* WhatsApp Floating Button */}
        <WhatsAppButton />

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div className="md:col-span-2">
                <div className="mb-4 flex items-center">
                  <div className="relative w-40 h-10">
                    <Image
                      src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/logo-cant-wait-travel.webp?width=160&quality=85"
                      alt="Can't Wait Travel Logo"
                      fill
                      sizes="160px"
                      className="object-contain"
                    />
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  Professional private shuttle service in Costa Rica. Licensed by ICT, 
                  fully insured, and trusted by travelers worldwide.
                </p>
                <p className="text-gray-400 text-xs mb-2">
                  ICT License: 4121-2025
                </p>
                <p className="text-gray-400 text-xs">
                  WhatsApp: +506-8596-2438
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-3">Quick Links</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><Link href="/transfers" className="hover:text-white transition">Our Routes</Link></li>
                  <li><Link href="/private-tours" className="hover:text-white transition">Private Tours</Link></li>
                  <li><Link href="/travel-guide" className="hover:text-white transition">Travel Guide</Link></li>
                  <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
                  <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-3">Legal</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><Link href="/terms" className="hover:text-white transition">Terms & Conditions</Link></li>
                  <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                  <li><Link href="/cancellation" className="hover:text-white transition">Cancellation Policy</Link></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 text-center">
              <p className="text-gray-300 text-sm">
                © {new Date().getFullYear()} Can't Wait Travel Costa Rica. All rights reserved.
              </p>
              <p className="text-gray-400 text-xs mt-2">
                Costa Rica Private Shuttle Service | San José Airport (SJO) | Liberia Airport (LIR) | 
                La Fortuna | Manuel Antonio | Tamarindo | Monteverde
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}