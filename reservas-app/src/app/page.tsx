// src/app/page.tsx
import { Suspense } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { BookingForm } from "@/components/forms/BookingForm";
import BookingNavbar from "@/components/booking/BookingNavbar";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToBookingButton from "@/components/ScrollToBookingButton";
import StructuredData from "@/components/SEO/StructuredData";
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

        <section className="relative h-screen max-h-[800px] overflow-x-hidden max-w-full">
          <div className="absolute inset-0 z-0 max-w-full">
            <Image src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/aerial-view-conchal-beach.webp" alt="Private Shuttle Costa Rica - Beach Transportation Service" fill sizes="100vw" className="object-cover" priority quality={75} placeholder="blur" blurDataURL="data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=" />
            <div className="absolute inset-0 bg-black/50" />
          </div>

          <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6">
            <div className="text-center max-w-4xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 drop-shadow-2xl leading-tight">Explore Costa Rica Your Way</h1>
              <p className="text-base sm:text-lg md:text-xl text-white/95 mb-6 drop-shadow-lg max-w-2xl mx-auto font-light px-4">Private Transfers & Tours Led by Trusted Local Experts</p>
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 px-4">
                <span className="text-sm sm:text-base md:text-lg font-medium text-white drop-shadow-xl">Safe</span>
                <span className="text-white text-lg">•</span>
                <span className="text-sm sm:text-base md:text-lg font-medium text-white drop-shadow-xl">Flexible</span>
                <span className="text-white text-lg">•</span>
                <span className="text-sm sm:text-base md:text-lg font-medium text-white drop-shadow-xl">Authentic</span>
              </div>
            </div>
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <svg className="w-6 h-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </div>
          </div>
        </section>

        <section id="booking-form" className="relative -mt-32 z-20 px-4 sm:px-6 pb-20">
          <Suspense fallback={<div className="w-full max-w-5xl mx-auto"><div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12"><div className="flex flex-col items-center justify-center gap-4"><div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full" /><p className="text-gray-600">Loading booking form...</p></div></div></div>}>
            <BookingForm />
          </Suspense>
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