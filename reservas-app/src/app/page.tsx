// src/app/page.tsx
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import BookingNavbar from "@/components/booking/BookingNavbar";
import ScrollToBookingButton from "@/components/ScrollToBookingButton";
import StructuredData from "@/components/SEO/StructuredData";
import type { Metadata } from 'next';
import Script from 'next/script';

const QuickSearchForm = dynamic(() => import("@/components/forms/QuickSearchForm").then(mod => mod.QuickSearchForm), {
  loading: () => <ComponentSkeleton />,
  ssr: false,
});

const WhyChooseUs = dynamic(() => import("@/components/sections/WhyChooseUs"), {
  loading: () => <ComponentSkeleton />,
});

const HomeAddons = dynamic(() => import("@/components/sections/HomeAddons"), {
  loading: () => <ComponentSkeleton />,
});

const HowWeWork = dynamic(() => import("@/components/sections/HowWeWork"), {
  loading: () => <ComponentSkeleton />,
});

const MostBookedCTAServer = dynamic(() => import("@/components/sections/MostBookedCTAServer"), {
  loading: () => <ComponentSkeleton />,
  ssr: true,
});

const ComparisonTable = dynamic(() => import("@/components/sections/ComparisonTable"), {
  loading: () => <ComponentSkeleton />,
});

const Guarantees = dynamic(() => import("@/components/sections/Guarantees"), {
  loading: () => <ComponentSkeleton />,
});

const TrustedBy = dynamic(() => import("@/components/sections/TrustedBy"), {
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
  title: 'Costa Rica Private Shuttle & Airport Transfers | Can\'t Wait Travel CR',
  description: 'Book reliable private shuttle and airport transfer service in Costa Rica. Direct service from SJO and Liberia to La Fortuna, Manuel Antonio, Tamarindo, and more. Professional bilingual drivers, modern vehicles, ICT licensed #4121-2025.',
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
    title: 'Private Shuttle & Airport Transfers Costa Rica | Can\'t Wait Travel CR',
    description: 'Professional private shuttle and airport transfer service with bilingual drivers. Book your Costa Rica transfer today.',
    url: 'https://cantwaittravelcr.com',
    siteName: 'Can\'t Wait Travel CR',
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
    title: 'Private Shuttle & Airport Transfers Costa Rica | Can\'t Wait Travel CR',
    description: 'Professional airport transfers and private shuttle service across Costa Rica. Over 400+ routes available.',
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

      <div id="main-content" className="min-h-screen overflow-x-hidden">
        <StructuredData />
        <BookingNavbar />

        {/* Hero Section - Transfer-Focused */}
        <section className="relative h-[70vh] min-h-[550px] max-h-[700px] overflow-hidden">
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

          <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 pt-20 sm:pt-0">
            {/* Launch Seal Badge */}
            <div className="absolute top-20 sm:top-24 right-3 sm:right-6 lg:right-12 z-20">
              <div className="relative w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 animate-[pulse_3s_ease-in-out_infinite]">
                {/* Main seal */}
                <div className="absolute inset-0 rounded-full border-[3px] sm:border-4 border-yellow-400 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 shadow-2xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                  <div className="text-center text-white px-1 sm:px-2">
                    <div className="text-yellow-400 text-base sm:text-xl lg:text-2xl">🚀</div>
                    <div className="text-[8px] sm:text-[10px] lg:text-xs font-black tracking-wider leading-tight uppercase">
                      Just<br/>Launched
                    </div>
                    <div className="w-6 sm:w-10 lg:w-12 h-px bg-yellow-400/80 mx-auto my-0.5 sm:my-1"></div>
                    <div className="text-[7px] sm:text-[9px] lg:text-[10px] font-bold text-yellow-300">
                      NOV 2025
                    </div>
                    <div className="text-yellow-400 text-[6px] sm:text-[8px] lg:text-[10px] tracking-wider">★★★</div>
                  </div>
                </div>
                {/* Corner dots */}
                <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full shadow-sm"></div>
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full shadow-sm"></div>
                <div className="absolute top-1/2 -left-0.5 -translate-y-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full shadow-sm"></div>
                <div className="absolute top-1/2 -right-0.5 -translate-y-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full shadow-sm"></div>
              </div>
            </div>

            <div className="text-center max-w-5xl">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 drop-shadow-2xl leading-tight">
                Private Shuttle & Airport Transfers Across Costa Rica
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-white/95 mb-6 sm:mb-8 drop-shadow-lg max-w-2xl mx-auto font-medium px-4">
                Professional drivers • 100% private service • Local expertise
              </p>
            </div>
          </div>
        </section>

        {/* Welcome Message */}
        <section className="bg-white pt-6 pb-4 sm:pt-8 sm:pb-5">
          <div className="container mx-auto px-4 sm:px-6 text-center max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Can't Wait to Explore Costa Rica?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              Seamlessly book your private transfer connecting over <span className="font-semibold text-blue-600">400+ routes</span>.
            </p>
          </div>
        </section>

        {/* Booking Form */}
        <section className="relative bg-gray-50 pt-6 pb-10 sm:pt-8 sm:pb-14 booking-form-section">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <QuickSearchForm />
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">

            {/* Main Story Card */}
            <div className="relative overflow-hidden bg-white rounded-3xl shadow-xl border border-gray-100">

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-100/50 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-green-100/50 to-transparent rounded-full translate-y-24 -translate-x-24"></div>

              <div className="relative p-8 sm:p-12 lg:p-16">

                {/* Badge */}
                <div className="flex justify-center mb-8">
                  <div className="inline-flex items-center gap-3 px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold rounded-full shadow-lg">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400"></span>
                    </span>
                    LAUNCHED NOVEMBER 2025
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-gray-900 mb-6">
                  When Drivers <span className="text-blue-600">Join Forces</span>
                </h2>

                {/* Story Text */}
                <div className="max-w-4xl mx-auto space-y-5 text-gray-600 text-lg leading-relaxed">
                  <p>
                    <span className="font-semibold text-gray-800">Can't Wait Travel CR</span> was born when a group of Costa Rica's most experienced private shuttle drivers decided to stop working separately — and start building something together.
                  </p>
                  <p>
                    We each spent years behind the wheel, driving for different companies, learning every road, and perfecting our craft. But we shared the same frustration: we knew we could do better if we ran things ourselves.
                  </p>
                  <p>
                    So we joined forces. We pooled our experience, invested in our own fleet of modern vehicles — and finally built the company we'd actually want to book ourselves.
                  </p>
                  <p className="font-medium text-gray-800">
                    We run our own vehicles with our own team — people we trust, people we trained, people who care. That's it. No middlemen. No outsourcing. What you see is what you get.
                  </p>
                  <p className="text-blue-700 font-semibold italic">
                    We're just getting started, and honestly? That makes us work even harder.
                  </p>
                </div>

                {/* Discount Banner */}
                <div className="mt-12 max-w-2xl mx-auto">
                  <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-1 shadow-2xl">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                      LIMITED TIME OFFER
                    </div>
                    <div className="bg-white rounded-xl p-6 sm:p-8 text-center">
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        🎉 Be One of Our First 100 Clients!
                      </p>
                      <div className="flex items-center justify-center gap-3 mb-3">
                        <span className="text-gray-500 line-through text-lg">Full Price</span>
                        <span className="text-4xl sm:text-5xl font-black text-green-600">20% OFF</span>
                      </div>
                      <p className="text-gray-600 mb-4">
                        Book your transfer now and save automatically at checkout
                      </p>
                      <div className="inline-flex items-center gap-2 text-sm text-green-700 bg-green-100 px-4 py-2 rounded-full">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Applied automatically at checkout
                      </div>
                    </div>
                  </div>
                </div>

                {/* License Info */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-gray-500">
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    ICT Licensed #4121-2025
                  </span>
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Fully Insured
                  </span>
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Based in La Fortuna
                  </span>
                </div>

                {/* Trusted By */}
                <div className="mt-12 pt-10 border-t border-gray-200">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-6">
                    Trusted By
                  </p>
                  <div className="flex items-center justify-center gap-10 sm:gap-16">
                    <a
                      href="https://www.arenalecoglide.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
                    >
                      <Image
                        src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/logo-ecoglide.webp"
                        alt="Arenal EcoGlide"
                        width={160}
                        height={70}
                        className="h-14 sm:h-16 w-auto object-contain hover:scale-110 transition-transform"
                      />
                    </a>
                    <a
                      href="https://www.skylinecanopytour.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
                    >
                      <Image
                        src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/logo-skyline.webp"
                        alt="Skyline Canopy Tour"
                        width={160}
                        height={70}
                        className="h-14 sm:h-16 w-auto object-contain hover:scale-110 transition-transform"
                      />
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Optimized Structure for Conversions */}
        <WhyChooseUs />
        <MostBookedCTAServer />
        <HowWeWork />
        <PrivateTours />
        <ComparisonTable />
        <HomeAddons />
        <Guarantees />
        <TravelGuide />
        <FinalCTA />

        <ScrollToBookingButton />
      </div>
    </>
  );
}