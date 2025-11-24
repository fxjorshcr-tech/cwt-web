// src/app/page.tsx
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import BookingNavbar from "@/components/booking/BookingNavbar";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToBookingButton from "@/components/ScrollToBookingButton";
import StructuredData from "@/components/SEO/StructuredData";
import type { Metadata } from 'next';
import Script from 'next/script';

const BookingFormWrapper = dynamic(() => import("@/components/forms/BookingFormWrapper").then(mod => mod.BookingFormWrapper), {
  loading: () => <ComponentSkeleton />,
  ssr: false,
});

const WhyBookDirect = dynamic(() => import("@/components/sections/WhyBookDirect"), {
  loading: () => <ComponentSkeleton />,
});

const WhyChooseUs = dynamic(() => import("@/components/sections/WhyChooseUs"), {
  loading: () => <ComponentSkeleton />,
});

const HowWeWork = dynamic(() => import("@/components/sections/HowWeWork"), {
  loading: () => <ComponentSkeleton />,
});

const MostBookedCTA = dynamic(() => import("@/components/sections/MostBookedCTA"), {
  loading: () => <ComponentSkeleton />,
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

          <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6">
            <div className="text-center max-w-5xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 drop-shadow-2xl leading-tight">
                Private Transfers Across Costa Rica
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/95 mb-6 sm:mb-8 drop-shadow-lg max-w-2xl mx-auto font-medium px-4">
                100% private, professional drivers, direct service from La Fortuna
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-6">
                <div className="flex items-center gap-2 text-white bg-white/10 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/20">
                  <span className="text-xs sm:text-sm font-semibold">ICT Licensed #4121</span>
                </div>
                <div className="flex items-center gap-2 text-white bg-white/10 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/20">
                  <span className="text-xs sm:text-sm font-semibold">Based in La Fortuna</span>
                </div>
                <div className="flex items-center gap-2 text-white bg-white/10 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/20">
                  <span className="text-xs sm:text-sm font-semibold">30+ Years Experience</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Booking Form - Right After Hero */}
        <section className="relative bg-gray-50 py-12 sm:py-16 -mt-12">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <BookingFormWrapper />
          </div>
        </section>

        {/* New Optimized Structure - Transfers First */}
        <WhyBookDirect />
        <WhyChooseUs />
        <HowWeWork />
        <MostBookedCTA />
        <ComparisonTable />
        <Guarantees />
        <PrivateTours />
        <HomeFAQs />
        <TravelGuide />
        <FinalCTA />

        <ScrollToBookingButton />
        <WhatsAppButton />
      </main>
    </>
  );
}