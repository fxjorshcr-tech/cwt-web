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

        {/* New Company Badge */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <div className="bg-gradient-to-br from-blue-50 to-green-50 border-2 border-blue-200 rounded-2xl p-6 sm:p-8 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-full mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                LAUNCHED NOVEMBER 25, 2025
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                Fresh Start, Local Expertise
              </h3>
              <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto mb-4">
                We're a team of professional drivers with practically new vehicles and a deep passion for sharing our beloved Costa Rica.
                We've been driving these roads for years, and now we've officially launched our own company.
                We're building our reputation one trip at a time — and we'd love for you to be part of our story.
              </p>
              <div className="bg-green-100 border-2 border-green-300 rounded-xl p-4 mt-6 max-w-md mx-auto">
                <p className="text-green-800 font-bold text-lg mb-1">
                  🎉 Be One of Our First 100 Clients!
                </p>
                <p className="text-green-700 text-sm">
                  Book now and get <span className="font-bold text-xl">20% OFF</span> your transfer.
                  <br />
                  <span className="text-xs text-green-600">Applied automatically at checkout.</span>
                </p>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                ICT Licensed #4121-2025 • Fully Insured • Based in La Fortuna
              </p>

              {/* Check who trusts us */}
              <div className="mt-8 pt-6 border-t border-blue-200">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Check Who Already Trusts Us
                </p>
                <div className="flex items-center justify-center gap-8 sm:gap-12">
                  <a
                    href="https://www.arenalecoglide.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300"
                  >
                    <Image
                      src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/logo-ecoglide.webp"
                      alt="Arenal EcoGlide"
                      width={140}
                      height={60}
                      className="h-12 sm:h-14 w-auto object-contain hover:scale-105 transition-transform"
                    />
                  </a>
                  <a
                    href="https://www.skylinecanopytour.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300"
                  >
                    <Image
                      src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/logo-skyline.webp"
                      alt="Skyline Canopy Tour"
                      width={140}
                      height={60}
                      className="h-12 sm:h-14 w-auto object-contain hover:scale-105 transition-transform"
                    />
                  </a>
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