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

const WhyBookDirect = dynamic(() => import("@/components/sections/WhyBookDirect"), {
  loading: () => <ComponentSkeleton />,
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

const PrivateTours = dynamic(() => import("@/components/sections/PrivateTours"), {
  loading: () => <ComponentSkeleton />,
});

const HomeFAQs = dynamic(() => import("@/components/sections/HomeFAQs"), {
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

      <main id="main-content" className="min-h-screen overflow-x-hidden">
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

              {/* Social Media Buttons - Inside Hero */}
              <div className="flex items-center justify-center gap-3 mt-6 sm:mt-8">
                <a
                  href="https://wa.me/50685962438"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 p-2.5 sm:p-3 rounded-full transition-all hover:scale-110 shadow-lg"
                  aria-label="WhatsApp"
                >
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="white" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </a>
                <a
                  href="https://instagram.com/cantwaittravelcr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-md p-2.5 sm:p-3 rounded-full transition-all hover:scale-110 shadow-lg"
                  aria-label="Instagram"
                >
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="https://facebook.com/cantwaittravelcr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-md p-2.5 sm:p-3 rounded-full transition-all hover:scale-110 shadow-lg"
                  aria-label="Facebook"
                >
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Welcome Message */}
        <section className="bg-white py-8 sm:py-10">
          <div className="container mx-auto px-4 sm:px-6 text-center max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Welcome to Can't Wait Travel CR
            </h2>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              Discover over <span className="font-semibold text-blue-600">400+ routes</span> connecting Costa Rica's most popular destinations.
              Book your private shuttle in seconds with instant confirmation.
            </p>
          </div>
        </section>

        {/* Booking Form */}
        <section className="relative bg-gray-50 py-10 sm:py-14">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <QuickSearchForm />
          </div>
        </section>

        {/* New Optimized Structure - Transfers First */}
        <WhyBookDirect />
        <WhyChooseUs />
        <HomeAddons />
        <HowWeWork />
        <MostBookedCTAServer />
        <ComparisonTable />
        <Guarantees />
        <PrivateTours />
        <HomeFAQs />
        <TravelGuide />
        <FinalCTA />

        <ScrollToBookingButton />
      </main>
    </>
  );
}