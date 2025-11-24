// src/app/page.tsx
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import BookingNavbar from "@/components/booking/BookingNavbar";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToBookingButton from "@/components/ScrollToBookingButton";
import StructuredData from "@/components/SEO/StructuredData";
import { ArrowRight, MapPin } from 'lucide-react';
import type { Metadata } from 'next';
import Script from 'next/script';

const WhyChooseUs = dynamic(() => import("@/components/sections/WhyChooseUs"), {
  loading: () => <ComponentSkeleton />,
});

const HowWeWork = dynamic(() => import("@/components/sections/HowWeWork"), {
  loading: () => <ComponentSkeleton />,
});

const MostBookedCTA = dynamic(() => import("@/components/sections/MostBookedCTA"), {
  loading: () => <ComponentSkeleton />,
});

const WhyPrivateShuttle = dynamic(() => import("@/components/sections/WhyPrivateShuttle"), {
  loading: () => <ComponentSkeleton />,
});

const PrivateTours = dynamic(() => import("@/components/sections/PrivateTours"), {
  loading: () => <ComponentSkeleton />,
});

const TravelGuide = dynamic(() => import("@/components/sections/TravelGuide"), {
  loading: () => <ComponentSkeleton />,
});

const FinalCTA = dynamic(() => import("@/components/sections/FinalCTA"), {
  loading: () => <ComponentSkeleton />,
});

function ComponentSkeleton() {
  return (
    <div className="w-full py-16 bg-gray-50 animate-pulse">
      <div className="container mx-auto px-4">
        <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-8"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Costa Rica Private Shuttle & Airport Transfers | Can\'t Wait Travel',
  description: 'Book reliable private shuttle service in Costa Rica. Airport transfers from SJO and Liberia to La Fortuna, Manuel Antonio, Tamarindo, and more. Professional bilingual drivers, modern vehicles, fully licensed.',
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
    images: [{
      url: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/aerial-view-conchal-beach.webp',
      width: 1200,
      height: 630,
      alt: 'Costa Rica Beach - Private Shuttle Service',
    }],
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

export default async function Home() {
  return (
    <>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} strategy="afterInteractive" async />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `}
          </Script>
        </>
      )}

      <main id="main-content" className="min-h-screen overflow-x-hidden">
        <StructuredData />
        <BookingNavbar />

        {/* Hero Section - Reduced height, larger logo */}
        <section className="relative h-[60vh] min-h-[500px] max-h-[650px] overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/aerial-view-conchal-beach.webp"
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
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6">
            <div className="text-center max-w-4xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-2xl leading-tight">
                Explore Costa Rica Your Way
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/95 mb-8 drop-shadow-lg max-w-2xl mx-auto font-medium px-4">
                Private Transfers powered by Local Experts
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
                <div className="flex items-center gap-2 text-white bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                  <span className="text-sm font-semibold">100% Private Service</span>
                </div>
                <div className="flex items-center gap-2 text-white bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                  <span className="text-sm font-semibold">Direct Operator</span>
                </div>
                <div className="flex items-center gap-2 text-white bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                  <span className="text-sm font-semibold">ICT Certified</span>
                </div>
              </div>
            </div>
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <svg className="w-6 h-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </div>
          </div>
        </section>

        {/* Two Service Options */}
        <section className="relative bg-gradient-to-b from-gray-50 to-white py-20 px-4 sm:px-6">
          <div className="container mx-auto max-w-7xl">

            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Two Ways to Explore Costa Rica
              </h2>
              <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Can't Wait Travel CR connects you to Costa Rica's most popular routes with private transfers and hand-picked tours. Based in La Fortuna, we bring you complete transportation solutions across the country.
              </p>
            </div>

            {/* Two Cards Side by Side */}
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">

              {/* Private Transfers Card */}
              <div className="group bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden border border-gray-200 hover:border-blue-400 hover:-translate-y-2">
                {/* Image Section */}
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/puerto-viejo-caribean-coast-sunny-costa-rica.webp"
                    alt="Private Shuttle Van - Can't Wait Travel CR"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    quality={85}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Small Info Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <div className="bg-blue-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                      30+ Routes
                    </div>
                    <div className="bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                      100% Private
                    </div>
                  </div>

                  {/* Icon Badge on Image */}
                  <div className="absolute bottom-4 left-4 h-16 w-16 bg-white/95 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl">
                    <MapPin className="h-8 w-8 text-blue-600" />
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 md:p-10">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    Private Transfers
                  </h3>

                  <p className="text-gray-600 mb-6 leading-relaxed text-base">
                    Our core service. Point-to-point private transportation connecting Costa Rica's most beautiful destinations.
                    From SJO and Liberia airports to La Fortuna, Manuel Antonio, Tamarindo, and beyond.
                  </p>

                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-3 text-gray-700">
                      <span className="text-blue-600 mt-1 text-lg font-bold">✓</span>
                      <span className="text-base">Direct routes across Costa Rica</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                      <span className="text-blue-600 mt-1 text-lg font-bold">✓</span>
                      <span className="text-base">100% private service, just your group</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                      <span className="text-blue-600 mt-1 text-lg font-bold">✓</span>
                      <span className="text-base">Licensed, experienced local drivers</span>
                    </li>
                  </ul>

                  <Link
                    href="/transfers"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-2xl group-hover:scale-105 duration-300"
                  >
                    Book Your Transfer
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Hand Picked Tours Card */}
              <div className="group bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden border border-gray-200 hover:border-orange-400 hover:-translate-y-2">
                {/* Image Section */}
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/puerto-viejo-caribean-coast-sunny-costa-rica.webp"
                    alt="Private Tours - Can't Wait Travel CR"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    quality={85}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Small Info Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <div className="bg-orange-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                      From La Fortuna
                    </div>
                    <div className="bg-white/90 backdrop-blur-sm text-orange-600 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                      Local Experts
                    </div>
                  </div>

                  {/* Icon Badge on Image */}
                  <div className="absolute bottom-4 left-4 h-16 w-16 bg-white/95 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl">
                    <MapPin className="h-8 w-8 text-orange-600" />
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 md:p-10">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    Hand Picked Tours
                  </h3>

                  <p className="text-gray-600 mb-6 leading-relaxed text-base">
                    Our newest offering. Curated experiences departing from La Fortuna, designed by locals who know Costa Rica inside out.
                    Discover hidden gems, unique adventures, and authentic culture.
                  </p>

                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-3 text-gray-700">
                      <span className="text-orange-600 mt-1 text-lg font-bold">✓</span>
                      <span className="text-base">Expertly crafted itineraries</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                      <span className="text-orange-600 mt-1 text-lg font-bold">✓</span>
                      <span className="text-base">Private tours with local insights</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                      <span className="text-orange-600 mt-1 text-lg font-bold">✓</span>
                      <span className="text-base">Departing from La Fortuna</span>
                    </li>
                  </ul>

                  <Link
                    href="/private-tours"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-bold text-lg rounded-xl hover:from-orange-700 hover:to-orange-800 transition-all shadow-lg hover:shadow-2xl group-hover:scale-105 duration-300"
                  >
                    Explore Tours
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        <WhyChooseUs />
        <HowWeWork />
        <MostBookedCTA />
        <WhyPrivateShuttle />
        <PrivateTours />
        <TravelGuide />
        <FinalCTA />

        <ScrollToBookingButton />
        <WhatsAppButton />
      </main>
    </>
  );
}